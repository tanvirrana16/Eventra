import React, { useState, useEffect } from 'react';
import {
  Mail, Phone, MapPin, Clock, ChevronDown, RefreshCw, CheckCircle,
  AlertTriangle, ArrowRight, MessageSquare, Shield, User, HelpCircle,
  Send, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const CONTACT_INFO = [
  {
    title: "Email Us",
    details: ["hello@eventra.live", "support@eventra.live"],
    icon: Mail,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100"
  },
  {
    title: "Call Us",
    details: ["+880 1703-916173", "+1 (323) 772-8781"],
    icon: Phone,
    color: "text-emerald-700 bg-emerald-50 border-emerald-100"
  },
  {
    title: "Our Office",
    details: ["Barishal, Bangladesh", "Open Monday–Friday", "9:00 AM – 6:00 PM"],
    icon: MapPin,
    color: "text-amber-700 bg-amber-50 border-amber-100"
  },
  {
    title: "Working Hours",
    details: [
      "Mon – Fri: 9:00 AM – 6:00 PM",
      "Saturday: 10:00 AM – 2:00 PM",
      "Sunday: Closed"
    ],
    icon: Clock,
    color: "text-rose-600 bg-rose-50 border-rose-100"
  }
];

export default function ContactUsPage() {
  const navigate = useNavigate();

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');

  // Submit Status Machine
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'success' | 'error'

  // Dynamic API state
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/pages/hero/contact-us`)
      .then(res => res.json())
      .then(data => setHeroData(data))
      .catch(err => console.warn('Failed to load contact us page hero details', err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Field Validation Checks
    if (!fullName.trim() || !emailAddress.trim() || !message.trim()) {
      alert("Please fill in all required fields (Name, Email, Message).");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulate API POST /api/contact
    setTimeout(() => {
      // Demo trigger for error state: if email address contains "error", simulate API failure
      if (emailAddress.toLowerCase().includes('error')) {
        setSubmitStatus('error');
      } else {
        setSubmitStatus('success');
        // Clear fields on success
        setFullName('');
        setEmailAddress('');
        setPhoneNumber('');
        setSubject('General Inquiry');
        setMessage('');
      }
      setIsSubmitting(false);

      // Reset feedback alert state after 6 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 6000);

    }, 1250);
  };

  const heroTitle = heroData?.title || 'Contact Us';
  const heroSubtitle = heroData?.subtitle || "Have a question, need support, or want to collaborate with Eventra? We'd love to hear from you. Reach out to our team, and we'll get back to you as soon as possible. Our technical customer support agents are ready to assist you.";
  const heroBgColor = heroData?.background_color || '#0C3B2E';

  return (
    <div className="flex-grow bg-slate-50 font-outfit select-none overflow-x-hidden">

      {/* Stylesheet keyframes for teams & illustrations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes float-envelope {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1.5deg); }
        }
        .animate-float-envelope {
          animation: float-envelope 5.5s ease-in-out infinite;
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
        {/* Soft background glows */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Content container */}
        <div className="max-w-6xl mx-auto px-4 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Text Left */}
          <div className="lg:col-span-7 text-left space-y-6">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight bg-gradient-to-b from-white via-white to-emerald-100 bg-clip-text text-transparent">
              {heroTitle}
            </h1>
            <div className="w-16 h-1.5 bg-[#2E6F40] rounded-full"></div>

            {/* Justified Subtitle */}
            <p className="text-sm sm:text-base text-emerald-100/70 max-w-xl font-light leading-relaxed text-justify">
              {heroSubtitle}
            </p>
          </div>

          {/* Interactive CSS Illustration Right */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="w-72 h-72 sm:w-80 sm:h-80 relative animate-float-envelope">
              {/* Decorative dashed outer ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/25 animate-spin" style={{ animationDuration: '35s' }}></div>
              <div className="absolute inset-8 rounded-full border border-emerald-500/10"></div>

              {/* Central Mail/Support badge container */}
              <div className="absolute inset-12 bg-emerald-950/45 border border-emerald-500/20 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col justify-center items-center p-6 text-center select-none group hover:border-emerald-400/35 transition-colors">
                <MessageSquare className="h-16 w-16 text-emerald-400 stroke-[1.2] animate-pulse" />
                <span className="text-sm font-black text-white tracking-widest mt-4">HELP DESK</span>
                <span className="text-[10px] font-medium text-emerald-400/70 tracking-wide mt-1 uppercase">24/7 Global Response</span>

                {/* Sub orbs inside template */}
                <div className="absolute -bottom-4 -left-4 w-10 h-10 rounded-full bg-teal-500/15 blur-xs pointer-events-none"></div>
                <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-emerald-500/15 blur-xs pointer-events-none"></div>
              </div>

              {/* Outer floating anchors */}
              <div className="absolute -top-1 -right-1 w-12 h-12 bg-[#0C3B2E] border border-emerald-500/25 rounded-2xl flex items-center justify-center shadow-lg">
                <Mail className="h-5.5 w-5.5 text-emerald-400" />
              </div>
              <div className="absolute -bottom-1 -left-1 w-12 h-12 bg-[#0C3B2E] border border-emerald-500/25 rounded-2xl flex items-center justify-center shadow-lg">
                <Phone className="h-5.5 w-5.5 text-emerald-400" />
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

      {/* SECTION 2: CONTACT INFORMATION CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-16 sm:-mt-24 relative z-30">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONTACT_INFO.map((info, idx) => {
            const IconComponent = info.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white border border-slate-100 hover:border-emerald-500/20 rounded-3xl p-6 sm:p-8 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                {/* Signature Animated corner borders */}
                <div className="absolute top-0 left-0 w-8 h-[1.5px] bg-gradient-to-r from-emerald-400 to-transparent transition-all group-hover:w-16 duration-700 z-10"></div>
                <div className="absolute top-0 left-0 w-[1.5px] h-8 bg-gradient-to-b from-emerald-400 to-transparent transition-all group-hover:h-16 duration-700 z-10"></div>
                <div className="absolute bottom-0 right-0 w-8 h-[1.5px] bg-gradient-to-l from-emerald-400 to-transparent transition-all group-hover:w-16 duration-700 z-10"></div>
                <div className="absolute bottom-0 right-0 w-[1.5px] h-8 bg-gradient-to-t from-emerald-400 to-transparent transition-all group-hover:h-16 duration-700 z-10"></div>

                <div className="space-y-4 text-left">
                  {/* Icon wrapper */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${info.color}`}>
                    <IconComponent className="h-6 w-6 stroke-[1.8]" />
                  </div>

                  <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-950 transition-colors">
                    {info.title}
                  </h3>

                  {/* Details listing */}
                  <ul className="space-y-1">
                    {info.details.map((detail, dIdx) => (
                      <li key={dIdx} className="text-xs sm:text-sm text-gray-500 font-semibold leading-normal truncate">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: CONTACT FORM & MAP (TWO-COLUMN RESPONSIVE LAYOUT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Side: Form (60%) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-10 relative overflow-hidden group">

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-12 h-[1.5px] bg-gradient-to-r from-emerald-400 to-transparent transition-all group-hover:w-28 duration-700"></div>
            <div className="absolute top-0 left-0 w-[1.5px] h-12 bg-gradient-to-b from-emerald-400 to-transparent transition-all group-hover:h-28 duration-700"></div>

            <div className="space-y-6">

              {/* Form Title Header */}
              <div className="text-left space-y-1.5">
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Send Us a Message
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed font-normal text-justify">
                  Fill out the form below, and our event management team will respond to your queries as soon as possible.
                </p>
              </div>

              {/* Submit Feedback Prompts */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-emerald-50 border border-emerald-500/20 rounded-xl text-left flex items-start space-x-3 text-emerald-800 animate-fade-in">
                  <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold">Message Sent Successfully!</p>
                    <p className="font-medium mt-0.5">Thank you for contacting Eventra. Our support team will get in touch with you shortly.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-rose-50 border border-rose-500/20 rounded-xl text-left flex items-start space-x-3 text-rose-800 animate-fade-in">
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold">Submission Failed</p>
                    <p className="font-medium mt-0.5">We encountered an error processing your query. Please check your credentials and try again.</p>
                  </div>
                </div>
              )}

              {/* Form Fields input elements */}
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">

                {/* Full Name */}
                <div className="space-y-1.5 sm:col-span-1">
                  <label htmlFor="fullName" className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-gray-950 placeholder-gray-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all"
                    />
                    <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5 sm:col-span-1">
                  <label htmlFor="email" className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      required
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="Enter your email address"
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-gray-950 placeholder-gray-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all"
                    />
                    <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5 sm:col-span-1">
                  <label htmlFor="phone" className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                    Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your phone number"
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-gray-950 placeholder-gray-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all"
                    />
                    <Phone className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400" />
                  </div>
                </div>

                {/* Subject Dropdown */}
                <div className="space-y-1.5 sm:col-span-1">
                  <label htmlFor="subject" className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-gray-950 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Event Registration">Event Registration</option>
                      <option value="Event Management Services">Event Management Services</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Certificate Verification">Certificate Verification</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                    <HelpCircle className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-400 pointer-events-none" />
                    <ChevronDown className="absolute right-3.5 top-3.5 h-4.5 w-4.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label htmlFor="message" className="text-xs font-black text-gray-700 uppercase tracking-wider block">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      rows="5"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us how we can help you..."
                      disabled={isSubmitting}
                      className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-gray-950 placeholder-gray-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/30 focus:border-transparent transition-all resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#2E6F40] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-98 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>

          </div>

          {/* Right Side: Map & Coordinates (40%) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">

            {/* Google Map embedded iframe */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden relative aspect-[16/10] lg:aspect-auto lg:flex-grow">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58933.24222405021!2d90.31885449999999!3d22.70100225!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b0870348b7%3A0x3c17243d7c62b90!2sBarisal!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Eventra Office Location"
                className="w-full h-full min-h-[250px] lg:min-h-[300px]"
              ></iframe>
            </div>

            {/* Office details */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 space-y-4 text-left">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">Eventra Headquarters</h3>
                <p className="text-xs text-gray-500 font-semibold mt-0.5 flex items-center space-x-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-700" />
                  <span>Barishal, Bangladesh</span>
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs font-bold text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 uppercase tracking-wider text-[10px] w-14 shrink-0 block">Phone:</span>
                  <a href="tel:+8801703916173" className="hover:text-emerald-700 transition-colors">+880 1703-916173</a>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 uppercase tracking-wider text-[10px] w-14 shrink-0 block">Email:</span>
                  <a href="mailto:hello@eventra.live" className="hover:text-emerald-700 transition-colors">hello@eventra.live</a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 4: FOLLOW US (STAY CONNECTED) */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">

          <div className="space-y-2">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              Social Hub
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Stay Connected
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed text-justify sm:text-center">
              Follow Eventra on social media for the latest events, announcements, updates, and community activities. Let's grow our network together.
            </p>
          </div>

          {/* Social media icons grid using inline SVGs */}
          <div className="flex flex-wrap items-center justify-center gap-4">

            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-4 rounded-full bg-slate-50 text-gray-400 hover:bg-gradient-to-br hover:from-[#2E6F40] hover:to-emerald-500 hover:text-white hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 shadow-md flex items-center justify-center border border-slate-100" aria-label="Facebook">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
            </a>

            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-4 rounded-full bg-slate-50 text-gray-400 hover:bg-gradient-to-br hover:from-[#2E6F40] hover:to-emerald-500 hover:text-white hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 shadow-md flex items-center justify-center border border-slate-100" aria-label="Instagram">
              <svg className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-4 rounded-full bg-slate-50 text-gray-400 hover:bg-gradient-to-br hover:from-[#2E6F40] hover:to-emerald-500 hover:text-white hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 shadow-md flex items-center justify-center border border-slate-100" aria-label="LinkedIn">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            {/* X/Twitter */}
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-4 rounded-full bg-slate-50 text-gray-400 hover:bg-gradient-to-br hover:from-[#2E6F40] hover:to-emerald-500 hover:text-white hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 shadow-md flex items-center justify-center border border-slate-100" aria-label="Twitter">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-4 rounded-full bg-slate-50 text-gray-400 hover:bg-gradient-to-br hover:from-[#2E6F40] hover:to-emerald-500 hover:text-white hover:scale-110 hover:-translate-y-0.5 transition-all duration-300 shadow-md flex items-center justify-center border border-slate-100" aria-label="YouTube">
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.5 12 3.5 12 3.5s-7.517 0-9.388.503a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.503 9.388.503 9.388.503s7.518 0 9.388-.503a3.003 3.003 0 0 0 2.11-2.11c.502-1.87.502-5.837.502-5.837s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>

          </div>

        </div>
      </section>

      {/* SECTION 5: CALL-TO-ACTION BANNER */}
      <section className="w-full bg-[#0C3B2E] py-20 text-center text-white relative overflow-hidden select-none border-t border-emerald-500/10">
        <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="absolute inset-0 border-y border-white/5 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-20 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-2xl mx-auto bg-gradient-to-b from-white to-emerald-100 bg-clip-text text-transparent">
            Let's Create Something Amazing Together
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-emerald-100/70 max-w-lg mx-auto font-light leading-relaxed">
            Whether you're planning a conference, workshop, wedding, cultural festival, or community gathering, Eventra is here to help bring your vision to life.
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
              onClick={() => navigate('/services')}
              className="py-3 px-8 border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold rounded-full transition-all duration-300 text-xs cursor-pointer transform active:scale-95 flex items-center space-x-1.5"
            >
              <Calendar className="h-4 w-4" />
              <span>Book a Service</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
