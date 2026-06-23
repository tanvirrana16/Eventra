import { useState, useEffect } from 'react';
import {
  Heart, Briefcase, Presentation, Mic, Music, Cake, Code, Dumbbell, Users,
  Camera, Utensils, Paintbrush, Layers, Lightbulb, Volume2, Tv, Tickets,
  FileText, ShieldAlert, Armchair, Flower, PenTool, ArrowRight, ChevronLeft,
  ChevronRight, Star, ChevronDown, CheckCircle, Zap, Trophy, ShieldCheck,
  Clock, DollarSign, Award, MessageSquare, Check, Plus, Minus, Calendar, Settings,
  Loader2
} from 'lucide-react';
import { API_BASE_URL } from '../config';

// Icon mapper for dynamic string icon lookup
const iconMap = {
  Heart, Briefcase, Presentation, Mic, Music, Cake, Code, Dumbbell, Users,
  Camera, Utensils, Paintbrush, Layers, Lightbulb, Volume2, Tv, Tickets,
  FileText, ShieldAlert, Armchair, Flower, PenTool, ArrowRight, ChevronLeft,
  ChevronRight, Star, ChevronDown, CheckCircle, Zap, Trophy, ShieldCheck,
  Clock, DollarSign, Award, MessageSquare, Check, Plus, Minus, Calendar, Settings
};

const MOCK_CORE_SERVICES = [
  {
    title: 'Wedding Planning',
    icon: 'Heart',
    gradient: 'from-purple-500/10 to-indigo-500/5 border-purple-500/15 text-purple-700 hover:border-purple-400/40 hover:shadow-purple-500/5',
    badgeBg: 'bg-purple-50 text-purple-700',
    description: 'We manage every aspect of your wedding, including decor, guest lists, catering, and schedule planning for your special day.',
    features: ['Venue Selection', 'Custom Decoration', 'Catering & Menu Design', 'Guest Invitations', 'On-Day Coordination', 'Photography Setup']
  },
  {
    title: 'Corporate Events',
    icon: 'Briefcase',
    gradient: 'from-amber-500/10 to-orange-500/5 border-amber-500/15 text-amber-700 hover:border-amber-400/40 hover:shadow-amber-500/5',
    badgeBg: 'bg-amber-50 text-amber-700',
    description: 'Professional corporate event organization from product launches, annual dinners, board meetups, to team-building activities.',
    features: ['AV Setup & Support', 'Guest Speaker booking', 'Catering & Logistics', 'Branding & Signage', 'On-Site Management', 'VIP Coordination']
  },
  {
    title: 'Conferences & Seminars',
    icon: 'Presentation',
    gradient: 'from-teal-500/10 to-emerald-500/5 border-teal-500/15 text-teal-700 hover:border-teal-400/40 hover:shadow-teal-500/5',
    badgeBg: 'bg-teal-50 text-teal-700',
    description: 'Flawless seminar execution featuring high-end streaming setups, registration, speaker support, and feedback management.',
    features: ['Digital Registration', 'Live Streaming Setups', 'Speaker Coordination', 'Feedback Forms', 'Stage Design', 'Security Services']
  },
  {
    title: 'Concert Management',
    icon: 'Music',
    gradient: 'from-purple-500/10 to-indigo-500/5 border-purple-500/15 text-purple-700 hover:border-purple-400/40 hover:shadow-purple-500/5',
    badgeBg: 'bg-purple-50 text-purple-700',
    description: 'Large scale concert logistics, including stadium booking, ticket portal integration, professional audio systems, and security.',
    features: ['Acoustics & Lighting', 'Ticket Portal Setup', 'Artist Management', 'Crowd Security', 'VIP Seating Deck', 'Permit Management']
  },
  {
    title: 'Cultural Programs',
    icon: 'Tv',
    gradient: 'from-amber-500/10 to-orange-500/5 border-amber-500/15 text-amber-700 hover:border-amber-400/40 hover:shadow-amber-500/5',
    badgeBg: 'bg-amber-50 text-amber-700',
    description: 'Vibrant traditional and national cultural program setups featuring customized theme decor, local artists, and stage design.',
    features: ['Custom Stage Sets', 'Traditional Decor', 'Artist Management', 'Event Flow Control', 'Photography & Video', 'Sound Engineering']
  },
  {
    title: 'Birthday Parties',
    icon: 'Cake',
    gradient: 'from-teal-500/10 to-emerald-500/5 border-teal-500/15 text-teal-700 hover:border-teal-400/40 hover:shadow-teal-500/5',
    badgeBg: 'bg-teal-50 text-teal-700',
    description: 'Creating magical birthday setups matching your customized themes, catering, entertainment shows, and cake presentation.',
    features: ['Theme Decoration', 'Kids Entertainment', 'Cake Setup Design', 'Photo Booths', 'Catering Services', 'Invitation Cards']
  },
  {
    title: 'Startup & Tech Events',
    icon: 'Code',
    gradient: 'from-purple-500/10 to-indigo-500/5 border-purple-500/15 text-purple-700 hover:border-purple-400/40 hover:shadow-purple-500/5',
    badgeBg: 'bg-purple-50 text-purple-700',
    description: 'Hackathons, networking sessions, pitch cups, and product demos. We coordinate power backups, high-speed networks, and VC invites.',
    features: ['Pitch Deck Stages', 'VC Coordinator', 'High Speed Internet', 'Power Backups', 'Live Demo Zones', 'Event Promotion']
  },
  {
    title: 'Sports Events',
    icon: 'Dumbbell',
    gradient: 'from-amber-500/10 to-orange-500/5 border-amber-500/15 text-amber-700 hover:border-amber-400/40 hover:shadow-amber-500/5',
    badgeBg: 'bg-amber-50 text-amber-700',
    description: 'Planning tournaments, championships, runs, or marathons. We coordinate stadium logistics, safety, and athlete badges.',
    features: ['Stadium Booking', 'Athlete Badges', 'Medical/Safety staff', 'Score Boards', 'Sponsorship Banners', 'Press Deck Setup']
  },
  {
    title: 'Community Meetups',
    icon: 'Users',
    gradient: 'from-teal-500/10 to-emerald-500/5 border-teal-500/15 text-teal-700 hover:border-teal-400/40 hover:shadow-teal-500/5',
    badgeBg: 'bg-teal-50 text-teal-700',
    description: 'Intimate and social group gatherings. We find cozy cafes, organize discussion cards, registration tables, and catering setups.',
    features: ['Cafe Bookings', 'Icebreakers Cards', 'Guest Support', 'Catering & Snacks', 'Promotion Services', 'Audio Microphones']
  }
];

const MOCK_ADDITIONAL_SERVICES = [
  { name: 'Photography & Videography', icon: 'Camera' },
  { name: 'Catering Services', icon: 'Utensils' },
  { name: 'Event Decoration', icon: 'Paintbrush' },
  { name: 'Stage Design', icon: 'Layers' },
  { name: 'Lighting Setup', icon: 'Lightbulb' },
  { name: 'Professional Sound System', icon: 'Volume2' },
  { name: 'DJ & Live Entertainment', icon: 'Music' },
  { name: 'LED Display Solutions', icon: 'Tv' },
  { name: 'Ticket Management', icon: 'Tickets' },
  { name: 'Event Registration', icon: 'FileText' },
  { name: 'Security Services', icon: 'ShieldAlert' },
  { name: 'Furniture Rental', icon: 'Armchair' },
  { name: 'Floral Decoration', icon: 'Flower' },
  { name: 'Custom Invitation Design', icon: 'PenTool' }
];

const MOCK_TIMELINE_STEPS = [
  { step: 'Step 1', title: 'Consultation', description: 'We meet to understand your vision, goals, and budget constraints.', icon: 'MessageSquare' },
  { step: 'Step 2', title: 'Planning', description: 'Our team designs a detailed roadmap and secures top-tier resources.', icon: 'Calendar' },
  { step: 'Step 3', title: 'Execution', description: 'We bring the plan to life with flawless on-site coordination.', icon: 'Zap' },
  { step: 'Step 4', title: 'Successful Event', description: 'Relax and enjoy a seamlessly delivered, unforgettable guest experience.', icon: 'Trophy' }
];

const MOCK_WHY_CHOOSE_US = [
  { title: 'Experienced Event Managers', description: 'Our certified planners have coordinated over 500+ events globally.', icon: 'Users' },
  { title: 'Customized Event Planning', description: 'Every roadmap, stage design, and decor is built tailored specifically to your needs.', icon: 'PenTool' },
  { title: 'Transparent Pricing', description: 'No hidden charges, flexible packages, and transparent quotations upfront.', icon: 'DollarSign' },
  { title: 'Modern Equipment', description: 'Utilizing top-grade audio systems, LED displays, and custom laser lighting.', icon: 'Settings' },
  { title: 'Creative Event Concepts', description: 'Innovative themes and designs that leave a lasting memory on all attendees.', icon: 'Lightbulb' },
  { title: 'Trusted by Organizations', description: 'Active partners with over 80+ top multinational corporate brands.', icon: 'Award' },
  { title: 'Professional Team', description: 'Dedicated on-site coordinators who manage all micro-logistics on event day.', icon: 'ShieldCheck' },
  { title: 'On-Time Event Execution', description: 'Strict timeline compliance and prompt execution schedules.', icon: 'Clock' }
];

const MOCK_PORTFOLIO_PROJECTS = [
  {
    title: 'Annual Tech Innovators Summit 2026',
    category: 'Conferences',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    location: 'Convention Hall A, San Francisco',
    attendees: '1,200 Attendees',
    date: 'March 15, 2026'
  },
  {
    title: 'Serenade Woods Luxury Wedding',
    category: 'Wedding Planning',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    location: 'Whispering Pines Forest, Oregon',
    attendees: '350 Guests',
    date: 'May 28, 2026'
  },
  {
    title: 'Neon Horizon Music & Arts Fest',
    category: 'Concerts',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    location: 'Riverfront Arena Amphitheatre',
    attendees: '8,500 Attendees',
    date: 'June 05, 2026'
  }
];

const MOCK_PRICING_PACKAGES = [
  {
    name: 'Basic',
    price: '$1,500',
    suitable: 'Suitable for small events',
    features: [
      'Initial Event Planning & Strategy',
      'Standard Backdrop & Stage Decor',
      'Basic Photography (4 hours coverage)',
      'Standard Guest Support Check-in',
      'Catering Vendor Selection Support'
    ],
    buttonText: 'Choose Plan',
    popular: false
  },
  {
    name: 'Professional',
    price: '$4,500',
    suitable: 'Suitable for medium-sized events',
    features: [
      'Premium Stage Backdrop & Theme Decor',
      'High-Res Photography & Videography',
      'Full Catering Logistics Coordination',
      'Stage Lighting & Basic Sound Setup',
      'Digital Invites & RSVP Management',
      '2 Dedicated On-Site Coordinators'
    ],
    buttonText: 'Choose Plan',
    popular: true
  },
  {
    name: 'Enterprise',
    price: '$10,000',
    suitable: 'Suitable for large corporate events',
    features: [
      'Dedicated Full-Time Event Director',
      'Custom Visual 3D Stage Rendering',
      'VIP/Premium Guest Care Services',
      'High-Grade Security & Crowd Management',
      'LED Screen & Professional Sound Arrays',
      'Live Streaming & AV Setup',
      'Custom End-to-End Solutions'
    ],
    buttonText: 'Contact Sales',
    popular: false
  }
];

const MOCK_TESTIMONIALS = [
  {
    name: 'Rachel Morrison',
    org: 'VP of Operations at Google Cloud',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
    rating: 5,
    review: 'Eventra managed our annual tech conference flawlessly. The team was highly professional, incredibly organized, and exceeded all our expectations from scheduling down to stage setups.'
  },
  {
    name: 'Michael Chen',
    org: 'Founder of Delta Startups',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
    rating: 5,
    review: 'The pitch cup and mixer organized by Eventra was a massive success! Their AV support was perfect, internet speed ran smoothly, and on-site logistics went without a single issue.'
  },
  {
    name: 'Sophie & Daniel',
    org: 'Married Couples',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
    rating: 5,
    review: 'Our wedding decor and execution were absolutely magical. Eventra handled all guest check-ins, food coordinate timings, and decor layout exactly as we had designed in the roadmaps.'
  }
];

const MOCK_FAQ_ITEMS = [
  { question: 'How do I book an event management service?', answer: 'You can book by clicking the \'Book a Service\' button in our hero section or navigating to our Contact page. Our executive event planners will set up an online video call to draft initial proposals.' },
  { question: 'Can I customize my package?', answer: 'Absolutely! All basic, professional, and enterprise plans serve as structured guides. We customize every detail—decoration themes, speaker decks, permits, catering—to match your exact target goals.' },
  { question: 'Do you organize corporate events?', answer: 'Yes, corporate events are one of our core specialties. We host conferences, seminars, stakeholder meetups, team-building camps, and formal award dinners.' },
  { question: 'Do you provide catering services?', answer: 'While we do not prepare food directly in-house, we coordinate directly with elite, licensed local catering vendors. We draft menus, sample food quality, and direct catering serving timelines.' },
  { question: 'How early should I book?', answer: 'For large conferences, weddings, or concerts, we highly recommend booking at least 3 to 6 months in advance. For minor workshops, startup mixers, or birthday parties, 1 month is generally sufficient.' },
  { question: 'Can you manage university events?', answer: 'Yes, we coordinate university convocations, talent sports cups, and tech hackathons. We offer discounted pricing models specifically for academic institutions.' },
  { question: 'What payment methods do you accept?', answer: 'We accept bank wire transfers, major credit cards, mobile wallets, and corporate cheques. Payments are generally structured in a 50% booking advance and a 50% post-event clearance format.' },
  { question: 'Can I cancel or reschedule my booking?', answer: 'Yes. Cancelations up to 30 days before the event receive full refunds minus deposits. Rescheduling is free of charge up to 15 days prior, subject to venue availability.' }
];

export default function ServicesPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState('');

  const openDetails = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setSelectedType('');
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/services`)
      .then(res => {
        if (!res.ok) throw new Error('API server error');
        return res.json();
      })
      .then(data => {
        setPageData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load services page data', err);
        setIsLoading(false);
      });
  }, []);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handlePrevTestimonial = () => {
    const list = pageData?.testimonials || MOCK_TESTIMONIALS;
    setActiveTestimonial((prev) => (prev - 1 + list.length) % list.length);
  };

  const handleNextTestimonial = () => {
    const list = pageData?.testimonials || MOCK_TESTIMONIALS;
    setActiveTestimonial((prev) => (prev + 1) % list.length);
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex flex-col justify-center items-center py-40 bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-[#2E6F40] mb-4" />
        <span className="text-sm text-gray-500 font-bold">Loading Services details...</span>
      </div>
    );
  }

  const heroTitle = pageData?.hero?.title || 'Professional Event Management';
  const heroSubtitle = pageData?.hero?.subtitle || 'Complete high-end event management solutions tailored to your unique requirements.';
  const heroBgColor = pageData?.hero?.background_color || '#0C3B2E';

  const coreServices = pageData?.core_services || MOCK_CORE_SERVICES;
  const additionalServices = pageData?.additional_services || MOCK_ADDITIONAL_SERVICES;
  const timelineSteps = pageData?.timeline_steps || MOCK_TIMELINE_STEPS;
  const whyChooseUs = pageData?.why_choose_us || MOCK_WHY_CHOOSE_US;
  const portfolioProjects = pageData?.portfolio_projects || MOCK_PORTFOLIO_PROJECTS;
  const pricingPackages = pageData?.pricing_packages || MOCK_PRICING_PACKAGES;
  const testimonials = pageData?.testimonials || MOCK_TESTIMONIALS;
  const faqItems = pageData?.faq_items || MOCK_FAQ_ITEMS;

  return (
    <div className="flex-grow bg-slate-50 font-outfit select-none">

      {/* SECTION 1: HERO BANNER */}
      <section 
        className="w-full pt-18 pb-15 sm:pt-15 sm:pb-36 text-left text-white relative overflow-hidden"
        style={{ backgroundColor: heroBgColor }}
      >
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Content container */}
        <div className="max-w-6xl mx-auto px-4 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Text Left */}
          <div className="lg:col-span-7 text-left space-y-6">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              Our Services
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-b from-white via-white to-emerald-100 bg-clip-text text-transparent">
              {heroTitle}
            </h1>
            <div className="w-16 h-1.5 bg-[#2E6F40] rounded-full"></div>

            <p className="text-sm sm:text-base text-emerald-100/70 max-w-xl font-light leading-relaxed text-justify">
              {heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center justify-start gap-4 pt-2">
              <button
                onClick={() => {
                  window.location.href = '/contact-us';
                }}
                className="py-3 px-8 bg-gradient-to-r from-[#2E6F40] to-emerald-600 hover:from-emerald-700 hover:to-[#2E6F40] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm cursor-pointer transform active:scale-95"
              >
                Book a Service
              </button>
              <button
                onClick={() => {
                  window.location.href = '/contact-us';
                }}
                className="py-3 px-8 border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold rounded-full transition-all duration-300 text-sm cursor-pointer transform active:scale-95"
              >
                Get a Free Consultation
              </button>
            </div>
          </div>

          {/* Interactive Illustration Right */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="w-72 h-72 sm:w-80 sm:h-80 relative animate-float">
              {/* Outer dashed spinning ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/25 animate-spin" style={{ animationDuration: '40s' }}></div>
              <div className="absolute inset-8 rounded-full border border-emerald-500/10"></div>

              {/* Central Glassmorphic Event Execution status checklist mockup card */}
              <div className="absolute inset-12 bg-emerald-950/45 border border-emerald-500/20 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col justify-between p-5 text-left select-none group hover:border-emerald-400/35 transition-colors">
                <div className="flex justify-between items-center border-b border-emerald-800/40 pb-2">
                  <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase">ROADMAP STATUS</span>
                  <Settings className="h-4 w-4 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div className="my-2 space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 bg-emerald-950/80 rounded-full p-0.5 border border-emerald-500/20" />
                    <span className="text-[10px] text-white font-semibold">1. Venue Confirmed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 bg-emerald-950/80 rounded-full p-0.5 border border-emerald-500/20" />
                    <span className="text-[10px] text-white font-semibold">2. Stage & AV Ready</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-3.5 w-3.5 rounded-full border border-yellow-400/40 bg-emerald-950/80 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 bg-yellow-400 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-[10px] text-yellow-400 font-bold">3. Guest List Prep</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-emerald-800/40">
                  <span className="text-[9px] font-bold text-white uppercase">EXECUTION RATE</span>
                  <span className="text-[10px] font-bold text-emerald-400">85% Complete</span>
                </div>
              </div>

              {/* Outer floating icons */}
              <div className="absolute -top-1 -right-1 w-12 h-12 bg-[#0C3B2E] border border-emerald-500/25 rounded-2xl flex items-center justify-center shadow-lg animate-float-delayed">
                <Briefcase className="h-5.5 w-5.5 text-emerald-400" />
              </div>
              <div className="absolute -bottom-1 -left-1 w-12 h-12 bg-[#0C3B2E] border border-emerald-500/25 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                <Presentation className="h-5.5 w-5.5 text-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>

        </div>

        {/* Premium Curved Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-10">
          <svg className="relative block w-full h-[60px] md:h-[120px] translate-y-[1px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86C220.11,68,121.81,98.63,0,27.35V120H1200V95.8C1130.49,111.54,1059.8,111.45,985.66,92.83Z"
              className="fill-slate-50"
            ></path>
          </svg>
        </div>
      </section>

      {/* SECTION 2: OUR CORE SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center md:text-left mb-16">
          <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
            What we do best
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
            Our Core Services
          </h2>
          <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto md:mx-0"></div>
          <p className="text-sm text-gray-500 mt-4 max-w-3xl leading-relaxed font-normal">
            Whether you're planning a wedding, conference, concert, or community gathering, Eventra provides complete event planning and management solutions designed to make every event successful.
          </p>
        </div>

        {/* Core Services Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreServices.map((srv, idx) => {
            const IconComponent = iconMap[srv.icon] || Heart;
            return (
              <div
                key={idx}
                className={`group relative bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer ${srv.gradient}`}
              >
                {/* Animated corner borders */}
                <div className="absolute top-0 left-0 w-8 h-[1.5px] bg-gradient-to-r from-emerald-400 to-transparent transition-all group-hover:w-16 duration-700 z-30"></div>
                <div className="absolute top-0 left-0 w-[1.5px] h-8 bg-gradient-to-b from-emerald-400 to-transparent transition-all group-hover:h-16 duration-700 z-30"></div>
                <div className="absolute bottom-0 right-0 w-8 h-[1.5px] bg-gradient-to-l from-emerald-400 to-transparent transition-all group-hover:w-16 duration-700 z-30"></div>
                <div className="absolute bottom-0 right-0 w-[1.5px] h-8 bg-gradient-to-t from-emerald-400 to-transparent transition-all group-hover:h-16 duration-700 z-30"></div>

                <div className="space-y-5">
                  {/* Icon with soft gradient circular wrap */}
                  <div className={`p-4 rounded-2xl w-14 h-14 flex items-center justify-center ${srv.badgeBg} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-2xs`}>
                    <IconComponent className="h-7 w-7 stroke-[1.8]" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed font-normal">
                    {srv.description}
                  </p>

                  <div className="border-t border-gray-100 my-2"></div>

                  {/* Bullet list of features */}
                  <ul className="space-y-2">
                    {srv.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center space-x-2 text-xs font-semibold text-gray-600">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={() => openDetails(srv, 'core')}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all duration-300 transform active:scale-98 cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: ADDITIONAL SERVICES */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center md:text-left mb-12">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              Value Add-ons
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
              Additional Services
            </h2>
            <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto md:mx-0"></div>
          </div>

          {/* Grid of features */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {additionalServices.map((srv, idx) => {
              const IconComponent = iconMap[srv.icon] || Camera;
              return (
                <div
                  key={idx}
                  onClick={() => openDetails(srv, 'additional')}
                  className="group relative bg-slate-50 hover:bg-emerald-50/20 border border-slate-100 hover:border-emerald-500/25 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md cursor-pointer aspect-square"
                >
                  <div className="p-3 bg-white text-[#2E6F40] rounded-xl shadow-2xs group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <IconComponent className="h-5 w-5 stroke-[1.8]" />
                  </div>
                  <h4 className="text-xxs sm:text-xs font-extrabold text-gray-800 group-hover:text-black mt-3 leading-snug">
                    {srv.name}
                  </h4>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
            Roadmap
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
            How It Works
          </h2>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            We professionally manage every aspect of your event from concept to completion.
          </p>
          <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto"></div>
        </div>

        {/* Timeline Horizontal/Vertical Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative max-w-5xl mx-auto">
          {timelineSteps.map((step, idx) => {
            const IconComponent = iconMap[step.icon] || Zap;
            return (
              <div 
                key={idx} 
                onClick={() => openDetails(step, 'timeline')}
                className="flex flex-col items-center text-center relative group cursor-pointer"
              >

                {/* Visual Arrow connector lines on desktop */}
                {idx < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-emerald-500/30 to-transparent z-0"></div>
                )}

                {/* Animated card badge */}
                <div className="relative z-10 w-20 h-20 rounded-3xl bg-white border border-slate-100 hover:border-emerald-500/30 shadow-md flex items-center justify-center text-[#2E6F40] hover:scale-105 transition-transform duration-300">
                  {/* Pulse background */}
                  <div className="absolute inset-0 bg-emerald-500/0 hover:bg-emerald-500/5 rounded-3xl transition-colors duration-300"></div>

                  {/* Step counter tag */}
                  <span className="absolute -top-2 bg-emerald-600 text-white font-extrabold text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-sm">
                    {step.step}
                  </span>

                  <IconComponent className="h-8 w-8 stroke-[1.5]" />
                </div>

                <div className="mt-5 space-y-2 max-w-[220px]">
                  <h4 className="text-base font-bold text-gray-900 group-hover:text-[#2E6F40] transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: WHY CHOOSE EVENTRA */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center md:text-left mb-16">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              Our Values
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
              Why Choose Eventra
            </h2>
            <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto md:mx-0"></div>
          </div>

          {/* Grid of features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((ch, idx) => {
              const IconComponent = iconMap[ch.icon] || Users;
              return (
                <div
                  key={idx}
                  onClick={() => openDetails(ch, 'why')}
                  className="group relative bg-slate-50 hover:bg-white border border-slate-100 hover:border-emerald-500/25 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer"
                >
                  <div className="p-3 bg-white text-[#2E6F40] rounded-xl w-11 h-11 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="h-5.5 w-5.5 stroke-[1.8]" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-black mt-4">
                    {ch.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed font-normal">
                    {ch.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 6: FEATURED PROJECTS / PORTFOLIO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center md:text-left mb-16">
          <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
            Case Studies
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
            Featured Events
          </h2>
          <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto md:mx-0"></div>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            Explore some of our successfully organized events.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioProjects.map((pj, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={pj.image}
                  alt={pj.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-80 pointer-events-none"></div>
                <span className="absolute top-4 left-4 bg-slate-900/90 text-white font-extrabold text-[9px] uppercase tracking-wider px-3 py-1 rounded-md">
                  {pj.category}
                </span>
              </div>

              <div className="p-6 flex-grow text-left space-y-4">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#2E6F40] transition-colors leading-snug">
                  {pj.title}
                </h3>

                <div className="border-t border-gray-100 my-2"></div>

                <div className="grid grid-cols-2 gap-2 text-xxs font-bold text-gray-500 uppercase tracking-wider">
                  <div>
                    <span className="text-[9px] text-gray-400 block mb-0.5">Location</span>
                    <span className="text-gray-800">{pj.location.split(',')[0]}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-400 block mb-0.5">Scale</span>
                    <span className="text-emerald-700">{pj.attendees}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button 
                  onClick={() => openDetails(pj, 'portfolio')}
                  className="w-full py-2.5 bg-slate-50 hover:bg-slate-900 hover:text-white text-gray-800 text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
                >
                  View Case Study
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: PRICING PACKAGES */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-16">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              Plans
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
              Our Packages
            </h2>
            <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto"></div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {pricingPackages.map((pkg, idx) => (
              <div
                key={idx}
                className={`relative bg-white rounded-3xl p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between cursor-pointer ${pkg.popular
                  ? 'border-[#2E6F40] ring-1 ring-[#2E6F40] shadow-xl md:scale-105 z-20'
                  : 'border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-md'
                  }`}
              >
                {/* Popular Ribbon */}
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2E6F40] text-white font-black text-[9px] uppercase tracking-widest px-4 py-1 rounded-full shadow-md animate-pulse">
                    Most Popular
                  </span>
                )}

                <div className="space-y-6 text-left">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">{pkg.suitable}</p>
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">{pkg.price}</span>
                    <span className="text-xs text-gray-400 font-bold ml-1">/ setup</span>
                  </div>

                  <div className="border-t border-gray-100 my-2"></div>

                  <ul className="space-y-3">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-2 text-xs font-semibold text-gray-600 leading-normal">
                        <Check className="h-4 w-4 text-emerald-600 shrink-0 stroke-[3] mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    onClick={() => openDetails(pkg, 'pricing')}
                    className={`w-full py-3 px-4 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${pkg.popular
                      ? 'bg-[#2E6F40] hover:bg-[#2E6F40]/90 text-white shadow-md'
                      : 'bg-slate-900 hover:bg-black text-white'
                      }`}
                  >
                    {pkg.buttonText}
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 8: CLIENT TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
              Client Testimonials
            </h2>
            <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto"></div>
          </div>

          {/* Sliding Review Card Container */}
          <div className="max-w-3xl mx-auto bg-white border border-slate-100 shadow-md rounded-3xl p-8 sm:p-12 relative overflow-hidden text-left font-outfit">

            {/* Testimonial Active Slide Mapping with fade transition */}
            <div className="space-y-6 animate-fade-in" key={activeTestimonial}>

              {/* Stars rating */}
              <div className="flex items-center space-x-1 text-amber-500">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500" />
                ))}
              </div>

              {/* Testimonial Review */}
              <p className="text-base sm:text-lg text-gray-700 italic font-light leading-relaxed">
                "{testimonials[activeTestimonial].review}"
              </p>

              <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">

                {/* Profile Avatar */}
                <div className="flex items-center space-x-3.5">
                  <img
                    src={testimonials[activeTestimonial].photo}
                    alt={testimonials[activeTestimonial].name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/20"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">{testimonials[activeTestimonial].org}</p>
                  </div>
                </div>

                {/* Slider Controls */}
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={handlePrevTestimonial}
                    className="p-2.5 rounded-full border border-slate-200 hover:border-[#2E6F40] hover:text-[#2E6F40] transition-colors cursor-pointer bg-white"
                    aria-label="Previous Testimonial"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNextTestimonial}
                    className="p-2.5 rounded-full border border-slate-200 hover:border-[#2E6F40] hover:text-[#2E6F40] transition-colors cursor-pointer bg-white"
                    aria-label="Next Testimonial"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        </section>
      )}

      {/* SECTION 9: FREQUENTLY ASKED QUESTIONS */}
      {faqItems.length > 0 && (
        <section className="bg-white py-20 border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">

            <div className="text-center mb-16">
              <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
                Got Questions?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
                Frequently Asked Questions
              </h2>
              <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto"></div>
            </div>

            {/* Accordion List */}
            <div className="space-y-4">
              {faqItems.map((faq, idx) => {
                const isExpanded = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 hover:text-emerald-800 transition-colors bg-white cursor-pointer"
                    >
                      <span className="text-sm font-bold pr-4">{faq.question}</span>
                      <span className={`p-1 bg-slate-50 text-gray-500 rounded-lg transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-emerald-50 text-[#2E6F40]' : ''
                        }`}>
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>

                    {/* Expandable answer panel */}
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden bg-slate-50/50 ${isExpanded ? 'max-h-40 border-t border-gray-100 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                        }`}
                    >
                      <p className="p-5 text-xs sm:text-sm text-gray-600 leading-relaxed font-normal text-justify">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* SECTION 10: CALL-TO-ACTION BANNER */}
      <section className="w-full bg-[#0C3B2E] py-20 text-center text-white relative overflow-hidden select-none border-t border-emerald-500/10">
        {/* Soft background glows */}
        <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Curved Divider Line decoration */}
        <div className="absolute inset-0 border-y border-white/5 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-20 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-2xl mx-auto bg-gradient-to-b from-white to-emerald-100 bg-clip-text text-transparent">
            Ready to Make Your Next Event Unforgettable?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-emerald-100/70 max-w-lg mx-auto font-light leading-relaxed">
            Let Eventra take care of the planning while you enjoy every single moment with your guests.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => window.location.href = '/contact-us'}
              className="py-3 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-xs cursor-pointer transform active:scale-95"
            >
              Book a Service
            </button>
            <button 
              onClick={() => window.location.href = '/contact-us'}
              className="py-3 px-8 border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold rounded-full transition-all duration-300 text-xs cursor-pointer transform active:scale-95"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 11: DETAILS MODAL WINDOW */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col font-outfit text-left transform scale-100 transition-all duration-300 animate-[slideDown_0.2s_ease-out]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-[#0C3B2E] via-[#114E3C] to-[#2E6F40] p-6 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-black tracking-widest uppercase text-emerald-300">
                    {selectedType === 'core' && 'Core Service Detail'}
                    {selectedType === 'additional' && 'Value-Added Service Detail'}
                    {selectedType === 'timeline' && 'Process Step Detail'}
                    {selectedType === 'why' && 'Value Proposition'}
                    {selectedType === 'portfolio' && 'Project Case Study'}
                    {selectedType === 'pricing' && 'Pricing Package Details'}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight">
                    {selectedItem.title || selectedItem.name || 'Service Details'}
                  </h3>
                </div>
                <button 
                  onClick={closeModal} 
                  className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer"
                >
                  <Minus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh] select-text">
              {/* Main description */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Overview</label>
                <p className="text-sm text-slate-600 leading-relaxed text-justify">
                  {selectedItem.description || selectedItem.suitable || 'Explore details about this event management service, customized to match your exact budget and targets.'}
                </p>
              </div>

              {/* Pricing / Category fields */}
              {(selectedItem.price || selectedItem.category || selectedItem.location) && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  {selectedItem.price && (
                    <div>
                      <span className="block text-[9px] font-black text-slate-400 uppercase">Package Pricing</span>
                      <span className="text-lg font-black text-[#2E6F40]">{selectedItem.price}</span>
                    </div>
                  )}
                  {selectedItem.category && (
                    <div>
                      <span className="block text-[9px] font-black text-slate-400 uppercase">Category</span>
                      <span className="text-xs font-extrabold text-slate-800">{selectedItem.category}</span>
                    </div>
                  )}
                  {selectedItem.location && (
                    <div className="col-span-2 border-t border-slate-200/60 pt-2.5">
                      <span className="block text-[9px] font-black text-slate-400 uppercase">Location & Venue</span>
                      <span className="text-xs font-semibold text-slate-700">{selectedItem.location}</span>
                    </div>
                  )}
                  {selectedItem.date && (
                    <div className="col-span-2 border-t border-slate-200/60 pt-2.5">
                      <span className="block text-[9px] font-black text-slate-400 uppercase">Completion Date</span>
                      <span className="text-xs font-semibold text-slate-700">{selectedItem.date}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Features lists */}
              {selectedItem.features && Array.isArray(selectedItem.features) && selectedItem.features.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Included Features</label>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedItem.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                        <CheckCircle className="h-4 w-4 text-[#2E6F40] shrink-0 stroke-[2.5]" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dynamic Detail Bullet Points (custom modal details) */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Detailed Information</label>
                <div className="p-4 bg-emerald-50/20 border border-emerald-500/10 rounded-2xl space-y-3">
                  {selectedItem.details && Array.isArray(selectedItem.details) && selectedItem.details.length > 0 ? (
                    <ul className="space-y-2.5">
                      {selectedItem.details.map((point, pIdx) => (
                        <li key={pIdx} className="flex items-start space-x-2.5 text-xs text-slate-600 leading-normal font-medium text-justify">
                          <span className="h-1.5 w-1.5 bg-[#2E6F40] rounded-full shrink-0 mt-1.5"></span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 leading-relaxed text-justify font-medium">
                      No additional micro-details have been configured for this item yet. For detailed custom planning, pricing quotes, or queries, please contact our support team.
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">
              <button 
                onClick={() => window.location.href = '/contact-us'}
                className="mr-3 py-2.5 px-5 bg-gradient-to-r from-[#2E6F40] to-emerald-600 hover:from-emerald-700 hover:to-[#2E6F40] text-white text-xs font-bold rounded-xl shadow-md transition-all duration-300 cursor-pointer"
              >
                Book Consultation
              </button>
              <button 
                onClick={closeModal}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
