import React, { useState, useEffect } from 'react';
import {
  Compass, Eye, Heart, Shield, Award, Calendar, Users, Settings, Search,
  ShieldCheck, MessageSquare, LineChart, Laptop, Trophy, Globe, Briefcase,
  ChevronDown, ChevronLeft, ChevronRight, Star, ArrowRight, HelpCircle,
  Mail, MapPin, Zap
} from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

// Team Members Data
const TEAM_MEMBERS = [
  {
    name: "Alexander Vance",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Visionary entrepreneur with 10+ years managing large-scale global event technologies. Driven by connecting people through innovation.",
    socials: { linkedin: "#", twitter: "#", github: "#" }
  },
  {
    name: "Elena Rostova",
    role: "Project Manager",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Certified Scrum Master ensuring timeline enforcement, vendor compliance, and seamless on-day management checklists.",
    socials: { linkedin: "#", twitter: "#", facebook: "#" }
  },
  {
    name: "Sarah Jenkins",
    role: "UI/UX Lead Designer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Passionate about building highly intuitive, premium user experiences and layout grids that make event discovery enjoyable.",
    socials: { linkedin: "#", twitter: "#" }
  },
  {
    name: "Marcus Cole",
    role: "Lead Frontend Developer",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Vite and React specialist crafting smooth micro-interactions, responsive CSS components, and highly accessible structures.",
    socials: { linkedin: "#", github: "#", twitter: "#" }
  }
];

// Why Choose Us Data
const CHOOSE_FEATURES = [
  { title: "Modern Event Management", desc: "Easily organize events from a unified portal with smart settings and layout customization.", icon: Settings },
  { title: "Easy Event Discovery", desc: "Instantly filter events based on tags, categories, live status, and physical location.", icon: Search },
  { title: "Secure Registration", desc: "High-grade registration forms and payment portals keeping client details completely private.", icon: ShieldCheck },
  { title: "Digital Certificates", desc: "Secure cryptographic certificate generation validating participant achievements instantly.", icon: Award },
  { title: "Professional Support", desc: "Our coordination helpdesk operates 24/7 assisting organizers with logistics setup.", icon: MessageSquare },
  { title: "Smart Event Analytics", desc: "Track attendees, ticket sales, registration trends, and feedback ratings in real-time.", icon: LineChart },
  { title: "Responsive Platform", desc: "Optimized mobile drawer viewports and fluid designs suitable for any size device screen.", icon: Laptop },
  { title: "Trusted by Communities", desc: "Active integration networks with university clubs, tech communities, and corporate brands.", icon: Users }
];

// Horizontal Timeline Data
const TIMELINE_STEPS = [
  { year: "2025", title: "Idea Born", desc: "Eventra project conceived to build an unified event coordinator platform.", icon: LightbulbIcon },
  { year: "2026", title: "Official Launch", desc: "Version 1.0 released globally with instant search and ticket registry systems.", icon: Zap },
  { year: "2026", title: "Community Growth", desc: "Hosted over 100+ community meets and deployed secure digital certificate systems.", icon: Trophy },
  { year: "Future", title: "Global Expansion", desc: "Integrating automated AI matchmaking and expanding corporate events portfolios.", icon: Globe }
];

// Helper icon component since Lightbulb isn't imported from standard list
function LightbulbIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a3 3 0 0 0-3-3H6.75m5.25 3h3a3 3 0 0 0 3-3H17.25M9 13.5H5.625M18.375 13.5H15M9 21h6M12 3a9 9 0 0 0-9 9c0 2.378 1.026 4.5 2.668 6h12.664A9 9 0 0 0 12 3Z" />
    </svg>
  );
}

// Partners Mock Logos
const PARTNERS = [
  { name: "Apex University", logoText: "APEX", desc: "Academic Partner" },
  { name: "Delta Startups", logoText: "DELTA", desc: "Startup Ecosystem" },
  { name: "Zenith Corp", logoText: "ZENITH", desc: "Corporate Sponsor" },
  { name: "Omni Media", logoText: "OMNI", desc: "Media Broadcaster" },
  { name: "NextTech", logoText: "NEXT", desc: "Tech Incubator" },
  { name: "Genesis Lab", logoText: "GENESIS", desc: "Research Partner" }
];

// Testimonials Data
const TESTIMONIALS = [
  {
    name: "Professor Albert Sterling",
    org: "Dean of Computer Science at Stanford",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80",
    rating: 5,
    review: "Eventra made organizing our university tech conference effortless. The platform is intuitive, reliable, and professional. The digital certificate generation was highly appreciated by the students."
  },
  {
    name: "Clara Oswald",
    org: "Co-Founder of Zenith Tech Meetups",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
    rating: 5,
    review: "As an event organizer, tracking registrations used to be a nightmare. Deployed Eventra for our tech hackathon and the experience was absolute bliss. Dynamic check-ins ran without a lag."
  },
  {
    name: "Julian Sterling",
    org: "Director of HR at Nexa Corp",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
    rating: 5,
    review: "The annual corporate team camp we hosted using Eventra was coordinated flawlessly. The scheduling flows and feedback analytics gave us key insights into team engagement."
  }
];

// FAQ Data
const FAQ_ITEMS = [
  {
    question: "What is Eventra?",
    answer: "Eventra is a modern, premium event management platform built to simplify event discovery, registration, scheduling, and digital certificate verification. We serve communities, corporate groups, startups, and academic groups alike."
  },
  {
    question: "How do I create an event?",
    answer: "You can create an event by registering an Organizer profile. Once approved by our compliance review team, you will receive full access to our dashboard to draft schedules, customize landing pages, upload maps, and track invites."
  },
  {
    question: "Is Eventra free to use?",
    answer: "Eventra offers a free tier for community meetups and standard local events. For premium features such as sound/lighting equipment bookings, custom LED rendering, certificate generation, or payment portals, we offer flexible subscription packages."
  },
  {
    question: "Can organizations use Eventra?",
    answer: "Absolutely! Eventra has a dedicated organizational suite built to handle high-volume user traffic, VIP scheduling, sponsor banners, multiple on-site coordinators, and detailed post-event analytical spreadsheets."
  },
  {
    question: "How do certificate verification and registration work?",
    answer: "When a participant completes an event, a unique Certificate ID is registered in our database. The participant receives a digital link. Anyone can verify this link or input the Certificate ID on our Certificate Verification page to retrieve instant registry validation."
  },
  {
    question: "How can I become a partner?",
    answer: "We welcome partnerships with universities, corporate sponsors, tech incubators, and media networks. Click the 'Contact Us' button in our call-to-action banner below, or reach out to partners@eventra.com to request collaboration terms."
  }
];

// Achievements Numbers Data
const STATS = [
  { count: 100, label: "Events Organized", suffix: "+", color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  { count: 10000, label: "Participants Connected", suffix: "+", color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
  { count: 150, label: "Registered Organizers", suffix: "+", color: "text-amber-700 bg-amber-50 border-amber-100" },
  { count: 98, label: "Satisfaction Rate", suffix: "%", color: "text-rose-600 bg-rose-50 border-rose-100" },
  { count: 500, label: "Certificates Issued", suffix: "+", color: "text-purple-600 bg-purple-50 border-purple-100" },
  { count: 25, label: "Partner Organizations", suffix: "+", color: "text-teal-600 bg-teal-50 border-teal-100" }
];

export default function AboutUsPage() {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Dynamic API state
  const [heroData, setHeroData] = useState({
    title: 'About Eventra',
    subtitle: 'Connecting people through meaningful events. Eventra helps individuals, communities, universities, startups, and organizations discover, organize, and experience memorable events with ease. We believe that every gathering creates a gateway to expand knowledge, build connections, and create growth pathways.',
    background_color: '#0C3B2E'
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/pages/hero/about-us`)
      .then(res => res.json())
      .then(data => setHeroData(data))
      .catch(err => console.warn('Failed to load about us page hero details', err));
  }, []);

  // Counter animation logic
  const [counts, setCounts] = useState(STATS.map(() => 0));

  useEffect(() => {
    const duration = 2000; // 2 seconds counting
    const steps = 50;
    const intervalTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setCounts(STATS.map((stat) => {
        const target = stat.count;
        const currentVal = Math.round((target / steps) * currentStep);
        return currentVal >= target ? target : currentVal;
      }));

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const heroTitle = heroData?.title || '';
  const heroSubtitle = heroData?.subtitle || '';
  const heroBgColor = heroData?.background_color || '#0C3B2E';

  return (
    <div className="flex-grow bg-slate-50 font-outfit select-none overflow-x-hidden">

      {/* Stylesheet keyframes for teams & hero animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-1.5deg); }
        }
        .animate-float-icon {
          animation: float-icon 5s ease-in-out infinite;
        }
        .text-justify {
          text-align: justify;
        }
      `}} />

      {/* SECTION 1: HERO BANNER */}
      <section 
        className="w-full pt-20 pb-28 sm:pt-28 sm:pb-40 text-center text-white relative overflow-hidden"
        style={{ backgroundColor: heroBgColor }}
      >
        {/* Ambient glows */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Content container */}
        <div className="max-w-6xl mx-auto px-4 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Text Content */}
          <div className="lg:col-span-7 text-left space-y-6">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              Who We Are
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight bg-gradient-to-b from-white via-white to-emerald-100 bg-clip-text text-transparent">
              {heroTitle}
            </h1>
            <div className="w-16 h-1.5 bg-[#2E6F40] rounded-full"></div>

            {/* Justified Description */}
            <p className="text-sm sm:text-base text-emerald-100/70 max-w-xl font-light leading-relaxed text-justify">
              {heroSubtitle}
            </p>
          </div>

          {/* Premium Interactive Illustration */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="w-72 h-72 sm:w-80 sm:h-80 relative animate-float-icon">
              {/* Spinning borders */}
              <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/30 animate-spin" style={{ animationDuration: '30s' }}></div>
              <div className="absolute inset-6 rounded-full border border-emerald-500/15"></div>

              {/* Team Collaboration visual container */}
              <div className="absolute inset-10 bg-emerald-950/40 border border-emerald-500/20 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col justify-center items-center p-6 text-center select-none overflow-hidden group hover:border-emerald-400/35 transition-colors">
                <Users className="h-16 w-16 text-emerald-400 stroke-[1.2] animate-pulse" />
                <span className="text-sm font-black text-white tracking-widest mt-4">COLLABORATION</span>
                <span className="text-[10px] font-medium text-emerald-400/70 tracking-wide mt-1 uppercase">Eventra Ecosystem</span>

                {/* Floating orbs within card overlay */}
                <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-teal-500/15 blur-xs pointer-events-none"></div>
                <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-emerald-500/15 blur-xs pointer-events-none"></div>
              </div>

              {/* Auxiliary floating badges */}
              <div className="absolute -top-2 -left-2 w-12 h-12 bg-[#0C3B2E] border border-emerald-500/25 rounded-2xl flex items-center justify-center shadow-lg">
                <Compass className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#0C3B2E] border border-emerald-500/25 rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy className="h-6 w-6 text-amber-400" />
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

      {/* SECTION 2: OUR STORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Interactive Image Card */}
          <div className="relative group rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500">
            {/* Visual borders on hover */}
            <div className="absolute top-0 left-0 w-12 h-[1.5px] bg-gradient-to-r from-emerald-400 to-transparent transition-all group-hover:w-28 duration-700 z-10"></div>
            <div className="absolute top-0 left-0 w-[1.5px] h-12 bg-gradient-to-b from-emerald-400 to-transparent transition-all group-hover:h-28 duration-700 z-10"></div>

            <div className="aspect-[4/3] w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80"
                alt="Eventra Collaboration Story"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-80 pointer-events-none"></div>
          </div>

          {/* Right: Narrative */}
          <div className="space-y-6 text-left">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              History
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827]">
              Our Story
            </h2>
            <div className="w-12 h-1.5 bg-[#2E6F40] rounded-full"></div>

            {/* Justified descriptions */}
            <div className="space-y-4 text-xs sm:text-sm text-gray-500 leading-relaxed font-normal text-justify">
              <p>
                Eventra was created with a simple vision: to make discovering, organizing, and managing events easier for everyone. Whether it's a university seminar, startup meetup, corporate conference, cultural festival, or community gathering, our platform brings people together through seamless event experiences.
              </p>
              <p>
                We believe that every event creates opportunities to learn, connect, collaborate, and grow. Our mission is to empower organizers with powerful management tools while helping participants discover events that inspire them. From automated scheduler checklists to cryptographic certificate security, Eventra builds bridge routes.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/events')}
                className="py-3 px-8 bg-gradient-to-r from-[#2E6F40] to-emerald-600 hover:from-emerald-700 hover:to-[#2E6F40] text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-xs cursor-pointer transform active:scale-95 flex items-center space-x-1.5"
              >
                <span>Explore Events</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: MISSION, VISION & VALUES */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              Foundations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
              Mission, Vision & Values
            </h2>
            <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto"></div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1: Mission */}
            <div className="group relative bg-slate-50 border border-slate-100 hover:border-emerald-500/20 hover:bg-white rounded-3xl p-6 sm:p-8 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-110 transition-transform">
                  <Compass className="h-6 w-6 stroke-[1.8]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Our Mission</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal text-justify">
                  To simplify event management and create meaningful experiences by connecting organizers and participants through an intuitive and innovative platform.
                </p>
              </div>
            </div>

            {/* Card 2: Vision */}
            <div className="group relative bg-slate-50 border border-slate-100 hover:border-emerald-500/20 hover:bg-white rounded-3xl p-6 sm:p-8 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 group-hover:scale-110 transition-transform">
                  <Eye className="h-6 w-6 stroke-[1.8]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Our Vision</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal text-justify">
                  To become the leading event management platform that empowers communities, organizations, and individuals to create unforgettable events worldwide.
                </p>
              </div>
            </div>

            {/* Card 3: Core Values */}
            <div className="group relative bg-slate-50 border border-slate-100 hover:border-emerald-500/20 hover:bg-white rounded-3xl p-6 sm:p-8 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shrink-0 group-hover:scale-110 transition-transform">
                  <Heart className="h-6 w-6 stroke-[1.8]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Our Values</h3>

                {/* Justified Bullet values list */}
                <div className="grid grid-cols-2 gap-2 text-xs font-bold text-gray-600">
                  <div className="flex items-center space-x-1.5">
                    <Shield className="h-3.5 w-3.5 text-amber-500" />
                    <span>Innovation</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Shield className="h-3.5 w-3.5 text-amber-500" />
                    <span>Integrity</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Shield className="h-3.5 w-3.5 text-amber-500" />
                    <span>Collaboration</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Shield className="h-3.5 w-3.5 text-amber-500" />
                    <span>Creativity</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Shield className="h-3.5 w-3.5 text-amber-500" />
                    <span>Satisfaction</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Shield className="h-3.5 w-3.5 text-amber-500" />
                    <span>Excellence</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: WHY CHOOSE EVENTRA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
            Advantages
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
            Why Choose Eventra?
          </h2>
          <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto"></div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CHOOSE_FEATURES.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={idx}
                className="group bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-emerald-500/20 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#2E6F40] group-hover:scale-110 transition-transform">
                  <IconComponent className="h-5.5 w-5.5 stroke-[1.8]" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 mt-4 group-hover:text-emerald-950 transition-colors">
                  {feat.title}
                </h4>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed font-normal text-justify">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

      </section>

      {/* SECTION 5: OUR JOURNEY (HORIZONTAL TIMELINE) */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              Roadmap
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
              Our Journey
            </h2>
            <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto"></div>
          </div>

          {/* Horizontal timeline cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative max-w-5xl mx-auto">
            {TIMELINE_STEPS.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center text-center relative group">

                  {/* Connective arrows on desktop */}
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-emerald-500/30 to-transparent z-0"></div>
                  )}

                  {/* Icon Card */}
                  <div className="relative z-10 w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-500/20 shadow-sm flex items-center justify-center text-[#2E6F40] hover:scale-105 transition-transform duration-300">
                    <span className="absolute -top-2 bg-[#2E6F40] text-white font-extrabold text-[8px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                      {step.year}
                    </span>
                    <IconComponent className="h-8 w-8 stroke-[1.5]" />
                  </div>

                  {/* Summary */}
                  <div className="mt-5 space-y-2 max-w-[200px]">
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#2E6F40] transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-normal text-justify">
                      {step.desc}
                    </p>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 6: MEET OUR TEAM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
            Leadership
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
            Meet Our Team
          </h2>
          <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto"></div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM_MEMBERS.map((tm, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between relative"
            >

              {/* Profile Image with zoom container */}
              <div className="relative aspect-[1/1] overflow-hidden">
                <img
                  src={tm.image}
                  alt={tm.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Social media overlay triggers on hover */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-3 text-white">
                    {tm.socials.linkedin && (
                      <a href={tm.socials.linkedin} className="p-2 bg-white/10 hover:bg-white/20 hover:scale-115 rounded-xl transition-all" aria-label="LinkedIn">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                    {tm.socials.twitter && (
                      <a href={tm.socials.twitter} className="p-2 bg-white/10 hover:bg-white/20 hover:scale-115 rounded-xl transition-all" aria-label="Twitter">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                    )}
                    {tm.socials.github && (
                      <a href={tm.socials.github} className="p-2 bg-white/10 hover:bg-white/20 hover:scale-115 rounded-xl transition-all" aria-label="GitHub">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    )}
                    {tm.socials.facebook && (
                      <a href={tm.socials.facebook} className="p-2 bg-white/10 hover:bg-white/20 hover:scale-115 rounded-xl transition-all" aria-label="Facebook">
                        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio Details */}
              <div className="p-6 space-y-3 flex-grow text-left">
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#2E6F40] transition-colors leading-tight">
                    {tm.name}
                  </h3>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mt-0.5">
                    {tm.role}
                  </span>
                </div>
                <p className="text-xxs sm:text-xs text-gray-500 leading-relaxed font-normal text-justify">
                  {tm.bio}
                </p>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* SECTION 7: ACHIEVEMENTS (STATS BLOCK) */}
      <section className="bg-slate-900 py-16 text-white border-y border-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {STATS.map((stat, idx) => (
              <div
                key={idx}
                className="group relative bg-slate-950 rounded-2xl p-5 border border-emerald-950/20 hover:border-emerald-500/20 flex flex-col justify-center items-center text-center transition-all duration-300 hover:shadow-[0_4px_20px_rgba(16,185,129,0.05)] cursor-pointer"
              >

                {/* Numerical count output */}
                <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none block">
                  {counts[idx].toLocaleString()}{stat.suffix}
                </span>

                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mt-2 text-center leading-normal">
                  {stat.label}
                </span>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 8: OUR PARTNERS */}
      <section className="bg-white py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
              Our Partners
            </h2>
            <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto"></div>
          </div>

          {/* Grayscale partner grids */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {PARTNERS.map((pt, idx) => (
              <div
                key={idx}
                className="group border border-slate-100 bg-slate-50 hover:bg-white hover:border-emerald-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-md cursor-pointer aspect-video"
              >
                <span className="text-sm font-black tracking-widest text-slate-400 group-hover:text-emerald-700 transition-colors">
                  {pt.logoText}
                </span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 group-hover:text-slate-800 transition-colors">
                  {pt.desc}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 9: CLIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
            Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
            What They Say
          </h2>
          <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto"></div>
        </div>

        {/* Carousel Container */}
        <div className="max-w-3xl mx-auto bg-white border border-slate-100 shadow-md rounded-3xl p-8 sm:p-12 relative overflow-hidden text-left">

          <div className="space-y-6 animate-fade-in" key={activeTestimonial}>

            {/* Star ratings */}
            <div className="flex items-center space-x-1 text-amber-500">
              {[...Array(TESTIMONIALS[activeTestimonial].rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-500" />
              ))}
            </div>

            {/* Testimonial Review text-justify */}
            <p className="text-sm sm:text-base text-gray-700 italic font-light leading-relaxed text-justify">
              "{TESTIMONIALS[activeTestimonial].review}"
            </p>

            <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">

              {/* Profile details */}
              <div className="flex items-center space-x-3">
                <img
                  src={TESTIMONIALS[activeTestimonial].photo}
                  alt={TESTIMONIALS[activeTestimonial].name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">{TESTIMONIALS[activeTestimonial].name}</h4>
                  <p className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">{TESTIMONIALS[activeTestimonial].org}</p>
                </div>
              </div>

              {/* Slider actions */}
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

      {/* SECTION 10: FREQUENTLY ASKED QUESTIONS */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
              Frequently Asked Questions
            </h2>
            <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full mx-auto"></div>
          </div>

          {/* Accordions list */}
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 hover:text-emerald-800 transition-colors bg-white cursor-pointer focus:outline-none"
                  >
                    <span className="text-sm font-bold pr-4">{faq.question}</span>
                    <span className={`p-1 bg-slate-50 text-gray-500 rounded-lg transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-emerald-50 text-[#2E6F40]' : ''
                      }`}>
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

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

      {/* SECTION 11: CALL-TO-ACTION PROMOTIONAL BANNER */}
      <section className="w-full bg-[#0C3B2E] py-20 text-center text-white relative overflow-hidden select-none border-t border-emerald-500/10">
        <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="absolute inset-0 border-y border-white/5 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-20 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-2xl mx-auto bg-gradient-to-b from-white to-emerald-100 bg-clip-text text-transparent">
            Ready to Be Part of the Eventra Community?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-emerald-100/70 max-w-lg mx-auto font-light leading-relaxed">
            Join thousands of event organizers and participants who are already creating unforgettable experiences with Eventra.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate('/events')}
              className="py-3 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-xs cursor-pointer transform active:scale-95 flex items-center space-x-1.5"
            >
              <span>Explore Events</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => alert("Opening support ticketing...")}
              className="py-3 px-8 border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold rounded-full transition-all duration-300 text-xs cursor-pointer transform active:scale-95 flex items-center space-x-1.5"
            >
              <Mail className="h-4 w-4" />
              <span>Contact Us</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
