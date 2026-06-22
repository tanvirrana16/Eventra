import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Upload, 
  Calendar, 
  Clock, 
  Image as ImageIcon,
  DollarSign,
  AlignJustify,
  Bold,
  Heading,
  Link,
  List,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import EventCard from '../EventCard';

const CATEGORIES = [
  "Concert", "Sports", "Workshops", "Fundraisers", "Festivals", 
  "Competitions", "Fashion Shows", "Conferences", "Seminars", 
  "Reunions", "Exhibitions", "Launching", "Stand-up", "Party", 
  "Pop Culture", "Movie / Drama"
];

const CATEGORY_TAGS = {
  'Concert': ['Concert', 'Music', 'Live', 'Performance', 'Show', 'Sound', 'Vibe'],
  'Sports': ['Sports', 'Athletics', 'Game', 'Match', 'Fitness', 'Tournament', 'Championship'],
  'Workshops': ['Workshop', 'Learning', 'Skills', 'Masterclass', 'Education', 'Training', 'Hands-on'],
  'Fundraisers': ['Fundraiser', 'Charity', 'Donation', 'Support', 'Community', 'Cause', 'Help'],
  'Festivals': ['Festival', 'Celebration', 'Culture', 'Food', 'Fun', 'Art', 'Holiday'],
  'Competitions': ['Competition', 'Contest', 'Trophy', 'Battle', 'Challenge', 'Awards', 'Win'],
  'Fashion Shows': ['Fashion', 'Show', 'Style', 'Runway', 'Design', 'Model', 'Trends'],
  'Conferences': ['Conference', 'Networking', 'Keynote', 'Industry', 'Panel', 'Summit', 'Business'],
  'Seminars': ['Seminar', 'Education', 'Lecture', 'Academic', 'Learning', 'Speaker', 'Research'],
  'Reunions': ['Reunion', 'Meetup', 'Alumni', 'Gathering', 'Friends', 'Social', 'Family'],
  'Exhibitions': ['Exhibition', 'Art', 'Gallery', 'Showcase', 'Display', 'Museum', 'Expo'],
  'Launching': ['Launch', 'Release', 'New', 'Startup', 'Product', 'Unveiling', 'Innovation'],
  'Stand-up': ['Stand-up', 'Comedy', 'Laughter', 'Show', 'Jokes', 'Humor', 'Comedian'],
  'Party': ['Party', 'Celebration', 'Music', 'Dance', 'Nightlife', 'Drinks', 'Social'],
  'Pop Culture': ['Pop Culture', 'Comic', 'Cosplay', 'Gaming', 'Fandom', 'Geek', 'Anime'],
  'Movie / Drama': ['Movie', 'Drama', 'Film', 'Cinema', 'Screening', 'Theater', 'Acting']
};

export default function LaunchEvent({ API_BASE_URL, token, onEventCreated, eventToEdit = null, onCancelEdit = null }) {
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Form State ──
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  
  // Media
  const [posterBase64, setPosterBase64] = useState('');
  const [galleryBase64, setGalleryBase64] = useState([]);

  // Schedule
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  // Location
  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [mapsLink, setMapsLink] = useState('');

  // Capacity
  const [totalSeats, setTotalSeats] = useState(100);
  const [deadline, setDeadline] = useState('');
  const [contactDetails, setContactDetails] = useState('');

  // Helper: Convert 12-hour format or database time to standard HH:MM
  const convertTime12to24 = (timeStr) => {
    if (!timeStr) return '';
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeStr)) {
      return timeStr.substring(0, 5);
    }
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (match) {
      let hours = parseInt(match[1]);
      const minutes = match[2];
      const ampm = match[3].toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    }
    return timeStr;
  };

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title || '');
      setCategory(eventToEdit.category || '');
      setDescription(eventToEdit.description || '');
      setTags(eventToEdit.tags || []);
      setPosterBase64(eventToEdit.image || '');
      setGalleryBase64(eventToEdit.gallery || []);
      setStartDate(eventToEdit.event_date || eventToEdit.date || '');
      setStartTime(eventToEdit.event_time ? convertTime12to24(eventToEdit.event_time) : (eventToEdit.time ? convertTime12to24(eventToEdit.time) : ''));
      setEndDate(eventToEdit.event_end_date || eventToEdit.eventEndDate || '');
      setEndTime(eventToEdit.event_end_time ? convertTime12to24(eventToEdit.event_end_time) : (eventToEdit.eventEndTime ? convertTime12to24(eventToEdit.eventEndTime) : ''));
      
      // Split location back to venueName, address, city
      if (eventToEdit.location) {
        const parts = eventToEdit.location.split(',').map(p => p.trim());
        if (parts.length >= 3) {
          setVenueName(parts[0]);
          setAddress(parts[1]);
          setCity(parts[2]);
        } else {
          setVenueName(eventToEdit.location);
          setAddress('');
          setCity('');
        }
      } else if (eventToEdit.venue) {
        const parts = eventToEdit.venue.split(',').map(p => p.trim());
        if (parts.length >= 3) {
          setVenueName(parts[0]);
          setAddress(parts[1]);
          setCity(parts[2]);
        } else {
          setVenueName(eventToEdit.venue);
          setAddress('');
          setCity('');
        }
      }

      setTotalSeats(eventToEdit.total_seats ?? eventToEdit.totalSeats ?? 100);
      setDeadline(eventToEdit.registration_deadline ?? eventToEdit.registrationDeadline ?? '');
      setContactDetails(eventToEdit.contact_details ?? eventToEdit.contactDetails ?? '');
      setTicketType(eventToEdit.ticket_type ?? eventToEdit.ticketType ?? 'free');
      setTicketPrice(eventToEdit.ticket_price ?? eventToEdit.ticketPrice ?? '');
      setCurrency(eventToEdit.currency || 'USD');
      setPaymentMethods(eventToEdit.payment_methods ?? eventToEdit.paymentMethods ?? ['Visa', 'bKash']);
      setRules(eventToEdit.rules || []);
      setSpeakers(eventToEdit.speakers || []);
      setStep(1);
    } else {
      setTitle('');
      setCategory('');
      setDescription('');
      setTags([]);
      setPosterBase64('');
      setGalleryBase64([]);
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      setVenueName('');
      setAddress('');
      setCity('');
      setTotalSeats(100);
      setDeadline('');
      setContactDetails('');
      setTicketType('free');
      setTicketPrice('');
      setCurrency('USD');
      setPaymentMethods(['Visa', 'bKash']);
      setRules([
        'Bring valid ID card.',
        'Registration is non-transferable.',
        'No refund after registration.',
        'Follow venue regulations.'
      ]);
      setSpeakers([]);
      setStep(1);
    }
  }, [eventToEdit]);

  // Pricing
  const [ticketType, setTicketType] = useState('free'); // free | paid
  const [ticketPrice, setTicketPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [paymentMethods, setPaymentMethods] = useState(['Visa', 'bKash']);

  // Rules
  const [rules, setRules] = useState([
    'Bring valid ID card.',
    'Registration is non-transferable.',
    'No refund after registration.',
    'Follow venue regulations.'
  ]);
  const [newRule, setNewRule] = useState('');

  // Speakers
  const [speakers, setSpeakers] = useState([]);
  const [speakerName, setSpeakerName] = useState('');
  const [speakerPhoto, setSpeakerPhoto] = useState('');
  const [speakerDesignation, setSpeakerDesignation] = useState('');
  const [speakerOrg, setSpeakerOrg] = useState('');
  const [speakerBio, setSpeakerBio] = useState('');
  const [speakerLinkedin, setSpeakerLinkedin] = useState('');
  const [speakerFacebook, setSpeakerFacebook] = useState('');

  // ── Category Change handler to auto-generate tags ──
  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setCategory(selected);
    if (CATEGORY_TAGS[selected]) {
      setTags(CATEGORY_TAGS[selected]);
    } else {
      setTags([]);
    }
  };

  // Helper to read local images to base64
  const handlePosterUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryBase64(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSpeakerPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSpeakerPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSpeaker = () => {
    if (!speakerName) {
      alert('Speaker name is required.');
      return;
    }
    const newSpeaker = {
      name: speakerName,
      photo: speakerPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
      designation: speakerDesignation,
      organization: speakerOrg,
      biography: speakerBio,
      social_links: {
        linkedin: speakerLinkedin,
        facebook: speakerFacebook
      }
    };
    setSpeakers([...speakers, newSpeaker]);
    // reset input fields
    setSpeakerName('');
    setSpeakerPhoto('');
    setSpeakerDesignation('');
    setSpeakerOrg('');
    setSpeakerBio('');
    setSpeakerLinkedin('');
    setSpeakerFacebook('');
  };

  const removeSpeaker = (idx) => {
    setSpeakers(speakers.filter((_, i) => i !== idx));
  };

  // Custom rich text wrapper helpers
  const wrapText = (tagOpen, tagClose) => {
    const textarea = document.getElementById('event-desc-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = tagOpen + selected + tagClose;
    setDescription(text.substring(0, start) + replacement + text.substring(end));
    textarea.focus();
  };

  // Rules list helpers
  const addRule = () => {
    if (!newRule.trim()) return;
    setRules([...rules, newRule.trim()]);
    setNewRule('');
  };

  const removeRule = (idx) => {
    setRules(rules.filter((_, i) => i !== idx));
  };

  // ── Step Navigation & Validations ──
  const nextStep = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!title) return setErrorMsg('Event Title is required.');
      if (!category) return setErrorMsg('Please select an event category.');
      if (!description) return setErrorMsg('Event Full Description is required.');
    }
    if (step === 2) {
      if (!posterBase64) return setErrorMsg('Event Poster is required.');
    }
    if (step === 3) {
      if (!startDate || !startTime) return setErrorMsg('Start date and time are required.');
    }
    if (step === 4) {
      if (!venueName || !address || !city) return setErrorMsg('Venue, Address and City are required.');
    }
    if (step === 5) {
      if (totalSeats <= 0) return setErrorMsg('Total Seats must be greater than 0.');
    }
    if (step === 6) {
      if (ticketType === 'paid') {
        if (!ticketPrice || isNaN(parseFloat(ticketPrice)) || parseFloat(ticketPrice) <= 0) {
          return setErrorMsg('Ticket Price is required and must be a valid positive number.');
        }
        if (paymentMethods.length === 0) return setErrorMsg('Select at least one payment method.');
      }
    }
    setStep(prev => Math.min(10, prev + 1));
  };

  const prevStep = () => {
    setErrorMsg('');
    setStep(prev => Math.max(1, prev - 1));
  };

  // ── Submit Event ──
  const handleSubmitEvent = (publishStatus = 'published') => {
    setIsSubmitting(true);
    setErrorMsg('');

    const formattedLocation = `${venueName}, ${address}, ${city}`;
    const payload = {
      title,
      category,
      description,
      event_date: startDate,
      event_time: startTime,
      event_end_date: endDate || null,
      event_end_time: endTime || null,
      registration_deadline: deadline || null,
      contact_details: contactDetails || null,
      location: formattedLocation,
      total_seats: totalSeats,
      ticket_type: ticketType,
      ticket_price: ticketType === 'paid' ? parseFloat(ticketPrice) : 0,
      currency,
      payment_methods: paymentMethods,
      rules,
      speakers,
      image: posterBase64,
      gallery: galleryBase64,
      status: publishStatus,
    };

    const url = eventToEdit 
      ? `${API_BASE_URL}/organizer/events/${eventToEdit.id}` 
      : `${API_BASE_URL}/organizer/events`;
      
    const method = eventToEdit ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        const data = await res.json();
        setIsSubmitting(false);
        if (res.ok) {
          alert(`Event successfully ${eventToEdit ? 'updated' : (publishStatus === 'published' ? 'published' : 'saved as draft')}!`);
          onEventCreated();
        } else {
          setErrorMsg(data.message || 'Failed to submit event. Try again.');
        }
      })
      .catch((err) => {
        setIsSubmitting(false);
        setErrorMsg('Network error. Check backend server.');
        console.error(err);
      });
  };

  // Prepare Event Details Object for preview rendering
  const previewEventData = {
    title: title || 'Awesome Event Title',
    category: category || 'Category',
    dateBadge: { day: startDate ? startDate.split('-')[2] : '12', month: 'JUL' },
    dateText: startDate ? new Date(startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Sunday, July 12, 2026',
    time: startTime || '10:00 AM',
    venue: venueName ? `${venueName}, ${city}` : 'Venue Name, City',
    image: posterBase64 || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    organizer: {
      name: 'Organizer Name',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'
    },
    seatsLeft: totalSeats,
    totalSeats: totalSeats,
    ticketType,
    ticketPrice: ticketType === 'paid' ? parseFloat(ticketPrice || 0) : 0,
    status: 'Upcoming',
    rawStatus: 'Upcoming'
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 font-outfit text-left animate-fade-in select-none">
      
      {/* ── Wizard Header ── */}
      <div className="pb-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            {eventToEdit ? 'Edit Event Wizard' : 'Launch Event Wizard'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
            {eventToEdit ? 'Update details of your existing event.' : 'Follow the 10-step wizard to configure, preview, and host your premium event.'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {eventToEdit && onCancelEdit && (
            <button
              onClick={onCancelEdit}
              className="text-xs font-bold text-rose-600 hover:text-white border border-rose-200 hover:bg-rose-600 px-3 py-1.5 rounded-full transition-colors cursor-pointer mr-2"
            >
              Cancel Edit
            </button>
          )}
          <span className="text-xs font-black text-white bg-[#0C3B2E] px-3.5 py-1.5 rounded-full select-none shadow-sm">
            Step {step} of 10
          </span>
        </div>
      </div>

      {/* ── Step Indicators Row ── */}
      <div className="mt-6 overflow-x-auto pb-2 flex items-center space-x-1.5 select-none scrollbar-none">
        {[...Array(10)].map((_, i) => {
          const stepNum = i + 1;
          const isActive = step === stepNum;
          const isCompleted = step > stepNum;
          return (
            <button
              key={i}
              onClick={() => { if (isCompleted || stepNum < step) setStep(stepNum); }}
              className={`h-7 px-3.5 rounded-full text-xxs font-black tracking-wide shrink-0 transition-all cursor-pointer ${
                isActive 
                  ? 'bg-[#2E6F40] text-white shadow-md' 
                  : (isCompleted ? 'bg-emerald-50 border border-emerald-100 text-[#2E6F40]' : 'bg-slate-50 text-slate-400')
              }`}
            >
              Step {stepNum}
            </button>
          );
        })}
      </div>

      {/* Error Message Alert */}
      {errorMsg && (
        <div className="mt-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-2xl flex items-center space-x-2.5 animate-shake">
          <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── Steps Form ── */}
      <div className="mt-8 min-h-[380px] select-text">

        {/* ── STEP 1: Basic Event Information ── */}
        {step === 1 && (
          <div className="space-y-6 animate-slide-up">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Event Title</label>
              <input 
                type="text" 
                placeholder="Enter event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-gray-900 placeholder-gray-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all shadow-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Event Category</label>
              <select 
                value={category}
                onChange={handleCategoryChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-gray-900 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all shadow-xs"
              >
                <option value="">Select event category...</option>
                {CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Full Description (Rich Text Editor)</label>
              {/* Rich text helper buttons */}
              <div className="flex items-center space-x-1.5 p-2 bg-slate-100 rounded-t-xl border border-slate-200 border-b-0 shrink-0">
                <button type="button" onClick={() => wrapText('<strong>', '</strong>')} className="p-1.5 hover:bg-slate-200 rounded text-slate-700" title="Bold"><Bold className="h-4 w-4" /></button>
                <button type="button" onClick={() => wrapText('<p style="text-align: justify;">', '</p>')} className="p-1.5 hover:bg-slate-200 rounded text-slate-700" title="Justify text"><AlignJustify className="h-4 w-4" /></button>
                <button type="button" onClick={() => wrapText('<h3>', '</h3>')} className="p-1.5 hover:bg-slate-200 rounded text-slate-700" title="Heading"><Heading className="h-4 w-4" /></button>
                <button type="button" onClick={() => wrapText('<ul>\n <li>', '</li>\n</ul>')} className="p-1.5 hover:bg-slate-200 rounded text-slate-700" title="Bullet List"><List className="h-4 w-4" /></button>
                <button type="button" onClick={() => { const url = prompt('Enter URL:'); if (url) wrapText(`<a href="${url}" target="_blank" class="text-emerald-700 underline font-bold">`, '</a>'); }} className="p-1.5 hover:bg-slate-200 rounded text-slate-700" title="Link"><Link className="h-4 w-4" /></button>
              </div>
              <textarea 
                id="event-desc-textarea"
                rows="6"
                placeholder="Write full event description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-gray-900 placeholder-gray-400 rounded-b-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all shadow-xs"
              />
            </div>

            {tags.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Automatically Generated Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 text-[#2E6F40] rounded text-[10px] font-bold">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Event Media ── */}
        {step === 2 && (
          <div className="space-y-6 animate-slide-up">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Event Poster Image (Required)</label>
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-50/80 hover:border-slate-300">
                <input 
                  type="file" 
                  id="posterUpload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handlePosterUpload}
                />
                <label htmlFor="posterUpload" className="cursor-pointer flex flex-col items-center space-y-2">
                  {posterBase64 ? (
                    <img src={posterBase64} alt="Poster Preview" className="h-44 w-auto object-cover rounded-xl shadow-md border" />
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white shadow-2xs border border-slate-100 rounded-full flex items-center justify-center text-gray-400">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold text-gray-700">Click to upload poster image</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Event Gallery Images (Optional, Multiple)</label>
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-50/80 hover:border-slate-300">
                <input 
                  type="file" 
                  id="galleryUpload" 
                  className="hidden" 
                  multiple 
                  accept="image/*"
                  onChange={handleGalleryUpload}
                />
                <label htmlFor="galleryUpload" className="cursor-pointer flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-white shadow-2xs border border-slate-100 rounded-full flex items-center justify-center text-gray-400">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-bold text-gray-700">Click to upload multiple gallery images</p>
                </label>
              </div>
              
              {galleryBase64.length > 0 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {galleryBase64.map((img, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden shadow border border-slate-100 aspect-video">
                      <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setGalleryBase64(galleryBase64.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-xs"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3: Event Schedule ── */}
        {step === 3 && (
          <div className="space-y-6 animate-slide-up">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Event Start Date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-gray-900 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all shadow-xs"
                  />
                  <Calendar className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Event Start Time</label>
                <div className="relative">
                  <input 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-gray-900 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all shadow-xs"
                  />
                  <Clock className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Event End Date (Optional)</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-gray-900 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all shadow-xs"
                  />
                  <Calendar className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Event End Time (Optional)</label>
                <div className="relative">
                  <input 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-gray-900 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all shadow-xs"
                  />
                  <Clock className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: Event Location ── */}
        {step === 4 && (
          <div className="space-y-6 animate-slide-up">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Venue Name</label>
              <input 
                type="text" 
                placeholder="e.g. Grand Convention Hall A"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-gray-900 placeholder-gray-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all shadow-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Address</label>
                <input 
                  type="text" 
                  placeholder="e.g. 123 Eventra Ave"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-gray-900 placeholder-gray-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all shadow-xs"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">City</label>
                <input 
                  type="text" 
                  placeholder="e.g. Dhaka"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-gray-900 placeholder-gray-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all shadow-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Google Maps Link (Optional)</label>
              <input 
                type="text" 
                placeholder="https://maps.google.com/..."
                value={mapsLink}
                onChange={(e) => setMapsLink(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-gray-900 placeholder-gray-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all shadow-xs"
              />
            </div>
          </div>
        )}

        {/* ── STEP 5: Capacity & Registration ── */}
        {step === 5 && (
          <div className="space-y-6 animate-slide-up">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Total Seats</label>
              <input 
                type="number" 
                placeholder="100"
                value={totalSeats}
                onChange={(e) => setTotalSeats(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-gray-900 placeholder-gray-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all shadow-xs"
              />
            </div>

            <div className="p-4 bg-emerald-50/40 border border-emerald-100 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between">
              <span>Available Seats (Auto Calculated):</span>
              <span className="text-sm font-black text-[#2E6F40]">{totalSeats} Seats</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Registration Deadline (Optional)</label>
              <div className="relative">
                <input 
                  type="date" 
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-gray-900 placeholder-gray-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all shadow-xs"
                />
                <Calendar className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Contact Details (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. Email: info@domain.com, Phone: +88012345"
                value={contactDetails}
                onChange={(e) => setContactDetails(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-gray-900 placeholder-gray-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all shadow-xs"
              />
            </div>
          </div>
        )}

        {/* ── STEP 6: Event Type & Payments ── */}
        {step === 6 && (
          <div className="space-y-6 animate-slide-up">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Event Type</label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 text-xs font-bold text-gray-800 cursor-pointer">
                  <input 
                    type="radio" 
                    name="ticketType" 
                    value="free" 
                    checked={ticketType === 'free'}
                    onChange={() => setTicketType('free')}
                    className="h-4 w-4 accent-[#2E6F40]"
                  />
                  <span>Free Event</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-bold text-gray-800 cursor-pointer">
                  <input 
                    type="radio" 
                    name="ticketType" 
                    value="paid" 
                    checked={ticketType === 'paid'}
                    onChange={() => setTicketType('paid')}
                    className="h-4 w-4 accent-[#2E6F40]"
                  />
                  <span>Paid Event</span>
                </label>
              </div>
            </div>

            {ticketType === 'paid' && (
              <div className="space-y-5 p-5 border border-slate-100 rounded-2xl bg-slate-50/50 animate-slide-up">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Ticket Price</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        placeholder="29.99"
                        value={ticketPrice}
                        onChange={(e) => setTicketPrice(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 focus:bg-white text-gray-900 rounded-xl text-xs font-bold focus:outline-none"
                      />
                      <DollarSign className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Currency</label>
                    <select 
                      value={currency} 
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 focus:bg-white text-gray-900 rounded-xl text-xs font-bold focus:outline-none"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="BDT">BDT (৳)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Allowed Payment Gateways (Select Methods)</label>
                  <div className="grid grid-cols-2 gap-3 text-xs font-bold text-gray-800">
                    {[
                      { id: 'Visa', name: 'Visa & Bank transfer (Sonali Bank)' },
                      { id: 'MasterCard', name: 'MasterCard & Card Payments' },
                      { id: 'bKash', name: 'bKash wallet (01533138489)' },
                      { id: 'Nagad', name: 'Nagad wallet (01533138489)' },
                    ].map(method => (
                      <label key={method.id} className="flex items-center space-x-2.5 p-3.5 bg-white border border-slate-200/60 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input 
                          type="checkbox" 
                          checked={paymentMethods.includes(method.id)} 
                          onChange={() => {
                            if (paymentMethods.includes(method.id)) {
                              setPaymentMethods(paymentMethods.filter(m => m !== method.id));
                            } else {
                              setPaymentMethods([...paymentMethods, method.id]);
                            }
                          }}
                          className="accent-[#2E6F40] h-4 w-4"
                        />
                        <div className="text-left leading-normal">
                          <p className="font-extrabold text-slate-800">{method.id}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">{method.name}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 7: Rules & Regulations ── */}
        {step === 7 && (
          <div className="space-y-6 animate-slide-up">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Define Event Rules & Regulations</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  placeholder="e.g. Please bring registration ticket barcode"
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addRule(); } }}
                  className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-gray-900 placeholder-gray-400 rounded-xl text-xs font-bold focus:outline-none"
                />
                <button 
                  type="button" 
                  onClick={addRule}
                  className="p-3 bg-[#2E6F40] text-white hover:bg-emerald-800 rounded-xl flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2.5 max-h-[300px] overflow-y-auto">
              {rules.length > 0 ? (
                rules.map((rule, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl">
                    <span className="text-xs font-semibold text-gray-700 text-left">{rule}</span>
                    <button 
                      type="button" 
                      onClick={() => removeRule(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-6 text-xs font-semibold">No custom rules added. Default settings apply.</div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 8: Speakers Management ── */}
        {step === 8 && (
          <div className="space-y-6 animate-slide-up">
            <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-4">
              <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider">Add Event Speaker</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Speaker Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Swara Devi"
                    value={speakerName}
                    onChange={(e) => setSpeakerName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:bg-white text-gray-900 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Designation / Role</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Keynote Speaker"
                    value={speakerDesignation}
                    onChange={(e) => setSpeakerDesignation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:bg-white text-gray-900 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Organization</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Stanford University"
                    value={speakerOrg}
                    onChange={(e) => setSpeakerOrg(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:bg-white text-gray-900 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Short Biography</label>
                  <textarea 
                    rows="3" 
                    placeholder="Provide short background bio..."
                    value={speakerBio}
                    onChange={(e) => setSpeakerBio(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:bg-white text-gray-900 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Photo (Upload / File)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleSpeakerPhotoUpload}
                    className="w-full text-xs font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">LinkedIn Profile URL</label>
                  <input 
                    type="text" 
                    placeholder="https://linkedin.com/..."
                    value={speakerLinkedin}
                    onChange={(e) => setSpeakerLinkedin(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:bg-white text-gray-900 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Facebook Profile URL</label>
                  <input 
                    type="text" 
                    placeholder="https://facebook.com/..."
                    value={speakerFacebook}
                    onChange={(e) => setSpeakerFacebook(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 focus:bg-white text-gray-900 rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <button 
                type="button" 
                onClick={addSpeaker}
                className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow transition-colors cursor-pointer"
              >
                Add Speaker to Event
              </button>
            </div>

            {/* List of added speakers */}
            {speakers.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {speakers.map((sp, idx) => (
                  <div key={idx} className="p-3.5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between relative shadow-2xs">
                    <div className="flex items-center space-x-3 text-left">
                      <img src={sp.photo} alt={sp.name} className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-50/50" />
                      <div>
                        <p className="text-xs font-black text-slate-800 leading-snug">{sp.name}</p>
                        <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{sp.designation} ({sp.organization})</p>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeSpeaker(idx)}
                      className="p-1 hover:bg-slate-50 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 9: Event Preview ── */}
        {step === 9 && (
          <div className="space-y-8 animate-slide-up select-none">
            <h4 className="text-xs font-black text-gray-700 uppercase tracking-wider pb-2 border-b">Complete Event Preview</h4>
            
            <div className="flex flex-col md:flex-row items-start justify-center gap-12">
              
              {/* Event Card Mock */}
              <div className="w-80 shrink-0">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 text-center">Event Card Preview</span>
                <EventCard 
                  event={previewEventData}
                  onViewDetails={() => alert('Mocking click view details...')}
                  showStatusBadge={true}
                />
              </div>

              {/* Modal Detail & Registration Flow Preview summaries */}
              <div className="flex-1 space-y-4 text-left text-xs font-semibold text-slate-600">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Event details summary</span>
                
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3.5 leading-relaxed">
                  <p><strong className="text-slate-800">Title:</strong> {title || 'N/A'}</p>
                  <p><strong className="text-slate-800">Category:</strong> {category || 'N/A'}</p>
                  <p><strong className="text-slate-800">Description (HTML Scoped):</strong></p>
                  <div className="p-3 bg-white border border-slate-100 rounded-lg max-h-28 overflow-y-auto text-xxs font-mono" dangerouslySetInnerHTML={{ __html: description || 'N/A' }}></div>
                  <p><strong className="text-slate-800">Location:</strong> {venueName}, {address}, {city}</p>
                  <p><strong className="text-slate-800">Total Seats:</strong> {totalSeats} Seats</p>
                  <p><strong className="text-slate-800">Ticket Details:</strong> {ticketType === 'paid' ? `${currency} ${ticketPrice}` : 'Free Entrance'}</p>
                  
                  {ticketType === 'paid' && (
                    <p><strong className="text-slate-800">Gateways:</strong> {paymentMethods.join(', ')}</p>
                  )}
                  
                  <p><strong className="text-slate-800">Speakers Count:</strong> {speakers.length} Speakers added</p>
                  <p><strong className="text-slate-800">Rules Count:</strong> {rules.length} Rules defined</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── STEP 10: Publish Event ── */}
        {step === 10 && (
          <div className="space-y-8 flex flex-col items-center justify-center text-center max-w-md mx-auto py-12 animate-slide-up select-none">
            <div className="p-4 bg-emerald-50 border border-emerald-100 text-[#2E6F40] rounded-full shadow-2xs">
              <CheckCircle className="h-10 w-10 stroke-[2]" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-800 leading-tight">Ready to Publish?</h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Confirm your configuration parameters. Save as a draft to edit details later, or publish instantly to display the event live in the public catalog.
              </p>
            </div>

            <div className="pt-4 w-full flex flex-col sm:flex-row items-center gap-3">
              <button 
                onClick={() => handleSubmitEvent('draft')}
                disabled={isSubmitting}
                className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {eventToEdit ? 'Save as Draft' : 'Save Draft'}
              </button>
              <button 
                onClick={() => handleSubmitEvent('published')}
                disabled={isSubmitting}
                className="w-full py-3 bg-[#2E6F40] hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {eventToEdit ? 'Update Event' : 'Publish Event'}
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ── Action Buttons ── */}
      <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between select-none">
        <button
          onClick={prevStep}
          disabled={step === 1 || isSubmitting}
          className="py-2.5 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        {step < 10 ? (
          <button
            onClick={nextStep}
            className="py-2.5 px-7 bg-[#2E6F40] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <div className="w-1"></div>
        )}
      </div>

    </div>
  );
}
