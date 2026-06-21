import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, MapPin, Calendar, ArrowRight, ShieldCheck, 
  Ticket, Share2, CreditCard, Smartphone, Copy, 
  ExternalLink, Lock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { API_BASE_URL } from '../config';

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

export default function EventDetailsModal({ event, onClose }) {
  const navigate = useNavigate();

  // Core Modal UI Animation
  const [animationClass, setAnimationClass] = useState('opacity-0 scale-95');

  // Sub-modals & Lightboxes
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);

  // Workflow states: 'details' | 'rules' | 'payment' | 'pass'
  const [viewState, setViewState] = useState('details');

  // Interactive local states
  const [seatsLeft, setSeatsLeft] = useState(event?.seatsLeft ?? 25);
  const [isShared, setIsShared] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  
  // Registration States
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(''); // 'Visa' | 'MasterCard' | 'bKash' | 'Nagad'
  const paymentAmount = parseFloat(event?.ticketPrice) || 0;
  const [paymentDetails, setPaymentDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [paymentError, setPaymentError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccessData, setRegistrationSuccessData] = useState(null);

  useEffect(() => {
    // Trigger entrance animation on mount
    const timeout = setTimeout(() => {
      setAnimationClass('opacity-100 scale-100');
    }, 10);
    return () => clearTimeout(timeout);
  }, []);

  if (!event) return null;

  const handleClose = () => {
    // Trigger closing animation
    setAnimationClass('opacity-0 scale-95');
    setTimeout(() => {
      onClose();
    }, 200);
  };

  // Social Share URL construction
  const eventUrl = `${window.location.origin}/events?id=${event.id}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(eventUrl).then(() => {
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    });
  };

  const handleShareSocial = (platform) => {
    let url;
    const text = encodeURIComponent(`Check out this event: ${event.title}`);
    const u = encodeURIComponent(eventUrl);
    
    switch(platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${u}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${u}&text=${text}`;
        break;
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${text}%20${u}`;
        break;
      default:
        return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Seat Availability Message Calculation
  const getSeatMessage = () => {
    if (seatsLeft === 0) {
      return { text: 'Event is fully booked.', style: 'bg-red-50 text-red-700 border-red-200 animate-pulse' };
    }
    if (seatsLeft <= 5) {
      return { text: `Only ${seatsLeft} seats remaining!`, style: 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse font-black' };
    }
    if (seatsLeft <= 15) {
      return { text: 'Limited seats available.', style: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    return { text: 'Seats available.', style: 'bg-emerald-50 text-[#2E6F40] border-emerald-100' };
  };

  const seatMessage = getSeatMessage();

  // Registration Button Handler
  const handleStartRegistration = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You must log in before registering for an event.");
      navigate('/login');
      return;
    }
    
    // Check if seats exist
    if (seatsLeft <= 0) {
      alert("This event is fully booked.");
      return;
    }

    setViewState('rules');
  };

  const handleRulesContinue = () => {
    if (event.ticketType === 'paid') {
      setViewState('payment');
    } else {
      executeRegistration();
    }
  };

  // Call backend registration API
  const executeRegistration = (paymentMethodOverride = '') => {
    setIsRegistering(true);
    setRegistrationError('');

    const token = localStorage.getItem('token');
    const method = paymentMethodOverride || selectedPaymentMethod;

    fetch(`${API_BASE_URL}/events/${event.id}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        payment_method: method || null,
        payment_amount: event.ticketPrice || 0
      })
    })
      .then(async (res) => {
        const data = await res.json();
        setIsRegistering(false);
        if (res.ok) {
          setSeatsLeft(prev => Math.max(0, prev - 1));
          setRegistrationSuccessData(data);
          setViewState('pass');
        } else {
          setRegistrationError(data.message || 'Registration failed. Please try again.');
        }
      })
      .catch((err) => {
        setIsRegistering(false);
        setRegistrationError('Network error. Check if backend is active.');
        console.error(err);
      });
  };

  // Payment Form Submission Handler
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setPaymentError('');

    if (!selectedPaymentMethod) {
      setPaymentError('Please select a payment method.');
      return;
    }

    // Verify fields are entered (mock verification)
    if (['Visa', 'MasterCard'].includes(selectedPaymentMethod)) {
      if (!paymentDetails.number || !paymentDetails.name || !paymentDetails.expiry || !paymentDetails.cvv) {
        setPaymentError('Please fill out all card information fields.');
        return;
      }
      if (paymentDetails.number.replace(/\s/g, '').length < 16) {
        setPaymentError('Please enter a valid 16-digit card number.');
        return;
      }
    } else {
      if (!paymentDetails.number) {
        setPaymentError('Please enter your mobile account number.');
        return;
      }
      if (paymentDetails.number.length < 11) {
        setPaymentError('Please enter a valid 11-digit mobile wallet number.');
        return;
      }
    }

    // Simulate verification delay
    setIsRegistering(true);
    setTimeout(() => {
      executeRegistration();
    }, 1500);
  };

  // Format QR Code URL
  const qrCodeUrl = registrationSuccessData 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(registrationSuccessData.qr_data)}`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto transition-opacity duration-300">

      {/* Main Details Modal Container */}
      {viewState === 'details' && (
        <div
          className={`relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] ${animationClass}`}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white hover:scale-105 transition-all cursor-pointer shadow-md"
            aria-label="Close details"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Left Section: Event Poster and Gallery */}
          <div className="w-full md:w-5/12 bg-slate-100 flex flex-col justify-between border-r border-gray-100 overflow-y-auto md:max-h-full">
            <div className="relative aspect-[16/10] md:aspect-auto md:flex-grow">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover min-h-[240px] md:min-h-full"
              />
              <span className="absolute top-4 left-4 bg-slate-900/90 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                {event.category || 'General'}
              </span>
            </div>

            {/* Gallery Section */}
            {event.gallery && event.gallery.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-slate-50 shrink-0">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Event Gallery</p>
                <div className="grid grid-cols-4 gap-2">
                  {event.gallery.map((imgUrl, i) => (
                    <div 
                      key={i} 
                      onClick={() => setActiveLightboxImage(imgUrl)}
                      className="aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-xs hover:scale-105 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer"
                    >
                      <img src={imgUrl} alt={`gallery-${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Section: Scrollable Information Details */}
          <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-full text-left font-outfit">
            
            <div className="space-y-6">
              {/* Event Status Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`font-extrabold text-[9px] uppercase tracking-wide px-2 py-0.5 rounded-md border ${
                  event.status === 'Live' || event.status === 'Live Event' 
                    ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                    : event.status === 'Past' || event.status === 'Closed'
                      ? 'bg-slate-100 text-slate-600 border-slate-300'
                      : 'bg-emerald-50 text-[#2E6F40] border-emerald-200'
                }`}>
                  {event.status === 'Live Event' ? 'Live' : event.status}
                </span>

                {/* Seat availability text */}
                <span className={`font-extrabold text-[9px] uppercase tracking-wide px-2 py-0.5 rounded-md border ${seatMessage.style}`}>
                  {seatMessage.text}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                {event.title}
              </h2>

              {/* Organizer Profile */}
              <div className="flex items-center space-x-3.5 bg-slate-50 p-3 rounded-2xl border border-gray-100">
                <img
                  src={event.organizer?.avatar}
                  alt={event.organizer?.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#2E6F40]/10"
                />
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hosted By</p>
                  <p className="text-sm font-bold text-gray-900">{event.organizer?.name}</p>
                  {event.organizer?.organizationName && (
                    <p className="text-[10px] text-gray-500 font-semibold">{event.organizer?.organizationName}</p>
                  )}
                </div>
              </div>

              {/* Date/Time/Venue grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-2.5">
                  <div className="bg-emerald-50 text-[#2E6F40] p-2 rounded-xl shrink-0 mt-0.5">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Date & Time</p>
                    <p className="text-[11px] text-gray-500 font-medium">{event.dateText}</p>
                    <p className="text-[11px] text-gray-500 font-medium">
                      {event.time} {event.eventEndTime && `- ${event.eventEndTime}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <div className="bg-emerald-50 text-[#2E6F40] p-2 rounded-xl shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Venue</p>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{event.venue}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">About The Event</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal text-justify whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Dynamic Tag Rendering */}
              {event.tags && event.tags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tags</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {event.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-[#2E6F40] text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md border border-slate-200/50 hover:bg-[#CFFFDC]/30 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Speakers Section */}
              {event.speakers && event.speakers.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Featured Speakers</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {event.speakers.map((speaker, index) => (
                      <div 
                        key={index} 
                        onClick={() => setSelectedSpeaker(speaker)}
                        className="flex items-center space-x-3 bg-slate-50/50 p-2.5 rounded-xl border border-gray-100 hover:bg-slate-50 hover:border-emerald-500/25 transition-all duration-300 cursor-pointer"
                      >
                        <img 
                          src={speaker.avatar || speaker.photo} 
                          alt={speaker.name} 
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-[#2E6F40]/10" 
                        />
                        <div className="truncate text-left">
                          <p className="text-xs font-bold text-gray-900 truncate">{speaker.name}</p>
                          <p className="text-[10px] text-gray-500 truncate">
                            {speaker.designation || speaker.role} {speaker.organization && `@ ${speaker.organization}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls / Action Row */}
            <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
              
              {/* Seats indicator */}
              <div className="flex items-center space-x-2 text-left self-start sm:self-center">
                <div className="bg-emerald-50 text-[#2E6F40] p-2 rounded-full">
                  <Ticket className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Available Seats</p>
                  <p className="text-xs text-gray-500 font-medium">
                    <span className="font-extrabold text-[#2E6F40]">{seatsLeft}</span> / {event.totalSeats || 100} remaining
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 w-full sm:w-auto relative">
                
                {/* Share Button with popup menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
                    className="py-3 px-4 rounded-2xl border bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80 hover:text-slate-800 transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer transform active:scale-95 text-xs font-extrabold"
                    title="Share Event"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>

                  {/* Share Dropdown */}
                  {isShareMenuOpen && (
                    <div className="absolute bottom-14 right-0 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 z-50 min-w-[150px] space-y-1 animate-fade-in text-left">
                      <button 
                        onClick={() => { handleShareSocial('facebook'); setIsShareMenuOpen(false); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-slate-50 hover:text-[#2E6F40] transition-colors"
                      >
                        <FacebookIcon className="h-4 w-4 text-blue-600" />
                        <span>Facebook</span>
                      </button>
                      <button 
                        onClick={() => { handleShareSocial('linkedin'); setIsShareMenuOpen(false); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-slate-50 hover:text-[#2E6F40] transition-colors"
                      >
                        <LinkedinIcon className="h-4 w-4 text-blue-800" />
                        <span>LinkedIn</span>
                      </button>
                      <button 
                        onClick={() => { handleShareSocial('twitter'); setIsShareMenuOpen(false); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-slate-50 hover:text-[#2E6F40] transition-colors"
                      >
                        <TwitterIcon className="h-4 w-4 text-slate-900" />
                        <span>Twitter (X)</span>
                      </button>
                      <button 
                        onClick={() => { handleShareSocial('whatsapp'); setIsShareMenuOpen(false); }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-slate-50 hover:text-[#2E6F40] transition-colors"
                      >
                        <Share2 className="h-4 w-4 text-emerald-600" />
                        <span>WhatsApp</span>
                      </button>
                      <hr className="border-gray-100 my-1" />
                      <button 
                        onClick={() => { handleCopyLink(); setIsShareMenuOpen(false); }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-gray-700 hover:bg-slate-50 hover:text-[#2E6F40] transition-colors"
                      >
                        <span className="flex items-center space-x-2.5">
                          <Copy className="h-4 w-4 text-gray-500" />
                          <span>{isShared ? 'Copied!' : 'Copy Link'}</span>
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Primary Action Button */}
                {seatsLeft === 0 ? (
                  <div className="w-full sm:w-auto bg-slate-100 border border-slate-200 text-slate-400 py-3 px-8 rounded-2xl font-bold text-center cursor-not-allowed text-xs uppercase tracking-wider">
                    Fully Booked
                  </div>
                ) : event.status === 'Past' || event.status === 'Closed' ? (
                  <div className="w-full sm:w-auto bg-slate-100 border border-slate-200 text-slate-400 py-3 px-8 rounded-2xl font-bold text-center cursor-not-allowed text-xs uppercase tracking-wider">
                    Event Ended
                  </div>
                ) : (
                  <button
                    onClick={handleStartRegistration}
                    className="w-full sm:w-auto py-3 px-8 bg-[#2E6F40] hover:bg-[#2E6F40]/90 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer transform active:scale-[0.98]"
                  >
                    <span>{event.ticketType === 'paid' ? `Register • $${event.ticketPrice}` : 'Register Now'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rules & Regulations Modal view */}
      {viewState === 'rules' && (
        <div className={`relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 text-left font-outfit ${animationClass}`}>
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-2.5 text-[#2E6F40]">
                <ShieldCheck className="h-6 w-6" />
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide">Rules & Regulations</h3>
              </div>
              <button onClick={() => setViewState('details')} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Please read and agree to the following guidelines defined by the event host before proceeding to ticket assignment:
            </p>

            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 space-y-3.5 max-h-[250px] overflow-y-auto">
              {event.rules && event.rules.length > 0 ? (
                event.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs text-gray-700 leading-normal">
                    <span className="h-5 w-5 rounded-full bg-emerald-50 border border-emerald-100 text-[#2E6F40] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="font-semibold text-gray-900">{rule}</p>
                  </div>
                ))
              ) : (
                <div className="space-y-3.5">
                  <div className="flex items-start space-x-2.5 text-xs text-gray-700">
                    <span className="font-bold text-[#2E6F40]">✓</span>
                    <p className="font-semibold">Bring a valid government-issued photo ID card.</p>
                  </div>
                  <div className="flex items-start space-x-2.5 text-xs text-gray-700">
                    <span className="font-bold text-[#2E6F40]">✓</span>
                    <p className="font-semibold">Event registration is personal and non-transferable.</p>
                  </div>
                  <div className="flex items-start space-x-2.5 text-xs text-gray-700">
                    <span className="font-bold text-[#2E6F40]">✓</span>
                    <p className="font-semibold">Cooperate with the event coordination guides at the venue.</p>
                  </div>
                  <div className="flex items-start space-x-2.5 text-xs text-gray-700">
                    <span className="font-bold text-[#2E6F40]">✓</span>
                    <p className="font-semibold">No refunds can be issued after registration confirmation.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button 
                onClick={() => setViewState('details')} 
                className="py-2.5 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-xs cursor-pointer"
              >
                Back
              </button>
              <button 
                onClick={handleRulesContinue} 
                className="py-3 px-8 bg-[#2E6F40] hover:bg-[#2E6F40]/90 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Selection and Gateway view */}
      {viewState === 'payment' && (
        <div className={`relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 text-left font-outfit ${animationClass}`}>
          <form onSubmit={handlePaymentSubmit} className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-2.5 text-[#2E6F40]">
                <CreditCard className="h-6 w-6" />
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-wide">Secure Payment Gateways</h3>
              </div>
              <button type="button" onClick={() => setViewState('rules')} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error banner */}
            {(paymentError || registrationError) && (
              <div className="p-3.5 bg-rose-50 text-rose-700 rounded-2xl border border-rose-150 flex items-start space-x-2.5 text-xs font-semibold animate-shake">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 text-rose-500 mt-0.5" />
                <span>{paymentError || registrationError}</span>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-xs text-gray-500 font-medium">Select a Payment Method:</p>
              
              {/* Payment Methods Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'Visa', label: 'Visa Card', icon: CreditCard, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                  { id: 'MasterCard', label: 'MasterCard', icon: CreditCard, color: 'text-red-500 bg-red-50 border-red-200' },
                  { id: 'bKash', label: 'bKash Mobile', icon: Smartphone, color: 'text-pink-600 bg-pink-50 border-pink-200' },
                  { id: 'Nagad', label: 'Nagad Account', icon: Smartphone, color: 'text-orange-600 bg-orange-50 border-orange-200' }
                ].map(method => {
                  const isChecked = selectedPaymentMethod === method.id;
                  return (
                    <label 
                      key={method.id} 
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all cursor-pointer text-center group ${
                        isChecked 
                          ? 'border-[#2E6F40] bg-emerald-50/20' 
                          : 'border-slate-100 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="payment_method" 
                        value={method.id} 
                        checked={isChecked} 
                        onChange={() => { setSelectedPaymentMethod(method.id); setPaymentError(''); }} 
                        className="sr-only" 
                      />
                      <method.icon className={`h-6 w-6 mb-2 ${method.color.split(' ')[0]}`} />
                      <span className="text-xs font-extrabold text-gray-900">{method.label}</span>
                    </label>
                  );
                })}
              </div>

              {/* Dynamic Payment input details */}
              {selectedPaymentMethod && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 space-y-3 animate-slide-up">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Charge Amount</span>
                    <span className="text-sm font-black text-gray-900">${paymentAmount.toFixed(2)}</span>
                  </div>

                  {['Visa', 'MasterCard'].includes(selectedPaymentMethod) ? (
                    <div className="space-y-3">
                      <div className="text-[10px] text-emerald-700 bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl font-bold uppercase tracking-wider text-center">
                        Recipient A/C: Sonali Bank • 0338401002885
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Card Number</label>
                        <input 
                          type="text" 
                          placeholder="4111 2222 3333 4444" 
                          value={paymentDetails.number}
                          onChange={(e) => setPaymentDetails({...paymentDetails, number: e.target.value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)})}
                          className="w-full bg-white border border-gray-200 focus:border-[#2E6F40] text-xs font-bold p-2.5 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Cardholder Name</label>
                        <input 
                          type="text" 
                          placeholder="John Doe" 
                          value={paymentDetails.name}
                          onChange={(e) => setPaymentDetails({...paymentDetails, name: e.target.value})}
                          className="w-full bg-white border border-gray-200 focus:border-[#2E6F40] text-xs font-bold p-2.5 rounded-xl outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Expiry Date</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY" 
                            value={paymentDetails.expiry}
                            onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value.replace(/[^0-9]/g, '').replace(/(.{2})/, '$1/').slice(0, 5)})}
                            className="w-full bg-white border border-gray-200 focus:border-[#2E6F40] text-xs font-bold p-2.5 rounded-xl outline-none text-center"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">CVV / CVC</label>
                          <input 
                            type="password" 
                            placeholder="•••" 
                            maxLength="3"
                            value={paymentDetails.cvv}
                            onChange={(e) => setPaymentDetails({...paymentDetails, cvv: e.target.value.replace(/[^0-9]/g, '')})}
                            className="w-full bg-white border border-gray-200 focus:border-[#2E6F40] text-xs font-bold p-2.5 rounded-xl outline-none text-center"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Mobile Account Number (11-digit)</label>
                      <input 
                        type="text" 
                        placeholder="01712345678" 
                        maxLength="11"
                        value={paymentDetails.number}
                        onChange={(e) => setPaymentDetails({...paymentDetails, number: e.target.value.replace(/[^0-9]/g, '')})}
                        className="w-full bg-white border border-gray-200 focus:border-[#2E6F40] text-xs font-bold p-2.5 rounded-xl outline-none"
                      />
                      <div className="text-[10px] text-emerald-700 bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl font-bold uppercase tracking-wider text-center mt-3">
                        Recipient Wallet: bKash/Nagad • 01533138489
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button 
                type="button"
                onClick={() => setViewState('rules')} 
                className="py-2.5 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-xs cursor-pointer"
              >
                Back
              </button>
              <button 
                type="submit" 
                disabled={isRegistering}
                className="py-3.5 px-8 bg-[#2E6F40] hover:bg-[#2E6F40]/90 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center space-x-2"
              >
                {isRegistering ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5 text-emerald-100" />
                    <span>Pay & Complete Registration</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Generated Digital Pass ticket view */}
      {viewState === 'pass' && registrationSuccessData && (
        <div className={`relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 text-center font-outfit ${animationClass}`}>
          
          <div className="space-y-6">
            
            {/* Header Success notice */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-[#2E6F40] rounded-full">
                <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-wide">
                Registration Successful
              </h3>
              <p className="text-xs text-gray-400 font-semibold">
                Your entry ticket has been reserved and sent to <span className="text-gray-900">{registrationSuccessData.user.email}</span>
              </p>
            </div>

            {/* Premium Digital Pass ticket Layout (Dashed split design) */}
            <div className="bg-gradient-to-br from-[#0C3B2E] via-[#114E3C] to-[#2E6F40] rounded-3xl shadow-xl border border-emerald-500/20 text-white flex flex-col md:flex-row relative overflow-hidden text-left p-6 gap-6 md:gap-0 font-outfit select-none">
              
              {/* Circular border cuts for ticket aesthetic */}
              <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full -ml-3 z-20"></div>
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full -mr-3 z-20"></div>

              {/* Main Ticket Info Stub (65% width) */}
              <div className="w-full md:w-8/12 flex flex-col justify-between space-y-6 md:pr-6 md:border-r md:border-dashed md:border-white/20">
                <div className="space-y-2.5">
                  <span className="inline-block bg-yellow-400 text-slate-900 font-black text-[9px] uppercase px-2.5 py-1 rounded-md tracking-wider">
                    {registrationSuccessData.event.ticket_type} Pass
                  </span>
                  <h4 className="text-lg font-black tracking-tight leading-tight block line-clamp-2">
                    {registrationSuccessData.event.title}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest block">Attendee</span>
                    <span className="text-xs font-bold text-white block truncate">{registrationSuccessData.user.name}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest block">Registration ID</span>
                    <span className="text-xs font-mono font-bold text-white block">{registrationSuccessData.registration.registration_code}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest block">Date & Time</span>
                    <span className="text-[10px] font-semibold text-emerald-100 block">
                      {registrationSuccessData.event.dateText}<br />
                      {registrationSuccessData.event.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-emerald-300 uppercase tracking-widest block">Venue</span>
                    <span className="text-[10px] font-semibold text-emerald-100 block truncate leading-normal">
                      {registrationSuccessData.event.venue}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px]">
                  <span className="text-emerald-200">Host: <strong>{registrationSuccessData.event.organizer_name}</strong></span>
                  <span className="font-black text-yellow-300 uppercase tracking-widest">★ ADMIT ONE</span>
                </div>
              </div>

              {/* QR Code Ticket Stub (35% width) */}
              <div className="w-full md:w-4/12 flex flex-col items-center justify-center md:pl-6 space-y-3.5 self-center">
                
                {/* Simulated ticket cutout circles for vertical split on mobile */}
                <div className="block md:hidden w-full border-t border-dashed border-white/20 my-2"></div>

                <div className="bg-white p-2.5 rounded-2xl shadow-md flex items-center justify-center border border-emerald-500/10">
                  {qrCodeUrl ? (
                    <img 
                      src={qrCodeUrl} 
                      alt="Pass Unique QR Code" 
                      className="w-28 h-28 object-contain shrink-0" 
                    />
                  ) : (
                    <div className="w-28 h-28 bg-slate-200 animate-pulse rounded-lg flex items-center justify-center text-slate-400">
                      QR CODE
                    </div>
                  )}
                </div>
                
                <div className="text-center space-y-0.5">
                  <span className="text-[9px] text-emerald-200 font-bold uppercase tracking-wider block">Pass Status</span>
                  <span className="bg-emerald-500/25 border border-emerald-400/35 text-emerald-300 px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wide inline-block">
                    {registrationSuccessData.registration.pass_status}
                  </span>
                </div>
              </div>

            </div>

            {/* Pass Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-center space-x-4">
              <button 
                onClick={handleClose} 
                className="py-3 px-8 bg-[#2E6F40] hover:bg-[#2E6F40]/90 text-white font-bold text-xs rounded-xl shadow transition-colors cursor-pointer"
              >
                Close & Return
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Speaker Biography Pop-up Sub-modal */}
      {selectedSpeaker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs animate-fade-in text-left">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-gray-100 font-outfit">
            <button
              onClick={() => setSelectedSpeaker(null)}
              className="absolute top-4.5 right-4.5 p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 rounded-full transition-colors cursor-pointer text-gray-500"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="space-y-5">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedSpeaker.avatar || selectedSpeaker.photo}
                  alt={selectedSpeaker.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-50"
                />
                <div>
                  <h4 className="text-base font-extrabold text-gray-900 leading-snug">{selectedSpeaker.name}</h4>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">{selectedSpeaker.designation || selectedSpeaker.role}</p>
                  {selectedSpeaker.organization && (
                    <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">{selectedSpeaker.organization}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <h5 className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Biography</h5>
                <p className="text-xs text-gray-600 leading-relaxed font-normal text-justify">
                  {selectedSpeaker.biography || "This speaker is a recognized expert in their domain, bringing years of practical and theoretical experience to the session panels. Connect during the interactive question-answer block."}
                </p>
              </div>

              {selectedSpeaker.social_links && Object.keys(selectedSpeaker.social_links).length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Connect</h5>
                  <div className="flex items-center space-x-2">
                    {Object.entries(selectedSpeaker.social_links).map(([platform, link]) => (
                      <a
                        key={platform}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-slate-50 hover:bg-[#CFFFDC]/20 border border-slate-100 rounded-xl text-gray-500 hover:text-[#2E6F40] transition-colors"
                        title={platform}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Image Lightbox View Overlay */}
      {activeLightboxImage && (
        <div 
          onClick={() => setActiveLightboxImage(null)}
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <button
            onClick={() => setActiveLightboxImage(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/25 rounded-full text-white transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
          <img 
            src={activeLightboxImage} 
            alt="Expanded gallery snapshot" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/5" 
          />
        </div>
      )}

    </div>
  );
}
