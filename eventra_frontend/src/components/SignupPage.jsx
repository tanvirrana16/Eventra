import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Check, ShieldCheck, AlertCircle, Loader2, User, KeyRound, Phone, Users, Calendar, Sparkles, MapPin, Building2, Globe } from 'lucide-react';
import logo from '../assets/logo.png';

export default function SignupPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('participant');
  const [interests, setInterests] = useState('');
  const [location, setLocation] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // States for loaders and notices
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [statusMsg, setStatusMsg] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);

  // Validate inputs
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s\-()]{8,16}$/;

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!role) {
      newErrors.role = 'Please select a role';
    }

    // Dynamic role validations
    if (role === 'participant') {
      if (!interests.trim()) {
        newErrors.interests = 'Interests are required';
      }
      if (!location.trim()) {
        newErrors.location = 'Location is required';
      }
    } else if (role === 'organizer') {
      if (!organizationName.trim()) {
        newErrors.organizationName = 'Organization name is required';
      }
      if (!contactInfo.trim()) {
        newErrors.contactInfo = 'Contact info is required';
      }
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setAlertVisible(false);
    setStatus(null);

    // Simulate POST /api/signup API Request
    setTimeout(() => {
      // Mock successful signup flow
      setIsLoading(false);
      setStatus('success');
      setStatusMsg('Account created successfully! Logging you in...');
      setAlertVisible(true);
      
      setTimeout(() => {
        localStorage.setItem('token', 'MOCK_JWT_TOKEN_ABC123');
        const userData = { name: name, email: email, phone: phone, role: role };
        if (role === 'participant') {
          userData.interests = interests;
          userData.location = location;
        } else if (role === 'organizer') {
          userData.organizationName = organizationName;
          userData.contactInfo = contactInfo;
        }
        localStorage.setItem('user', JSON.stringify(userData));
        setIsLoggedIn(true);
        navigate('/');
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 flex items-stretch font-outfit overflow-hidden">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row shadow-2xl mt-1 mb-6 lg:mt-2 lg:mb-10 rounded-3xl overflow-hidden bg-white">
        
        {/* Left Side: Welcome Section (55% on Desktop) */}
        <div className="w-full lg:w-[55%] bg-gradient-to-br from-[#0C3B2E] via-[#114E3C] to-[#2E6F40] relative p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden">
          {/* Ambient blur blobs */}
          <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none"></div>
          
          {/* Top Brand Header */}
          <div className="relative z-10 flex items-center space-x-3">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="flex items-center space-x-3 group">
              <img 
                src={logo} 
                alt="Eventra Logo" 
                className="h-10 w-auto filter brightness-0 invert group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300" 
              />
              <span className="text-2xl font-black tracking-widest text-white">EVENTRA</span>
            </a>
          </div>

          {/* Middle Content: Title, Description, and Vector SVG */}
          <div className="relative z-10 my-10 lg:my-0 flex-1 flex flex-col justify-center">
            
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
                Create Your Account
              </h1>
              
              <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed text-justify mb-8">
                Sign up to Eventra and gain full access to premium tools. Start organizing events, registering participants, printing certificates, and tracking user milestones.
              </p>
            </div>

            {/* Premium Vector SVG Illustration representing Event Community & Security */}
            <div className="relative w-full max-w-sm mx-auto h-60 sm:h-72 my-4 flex items-center justify-center">
              
              {/* Animated Floating Badges */}
              {/* Badge 1: Secure Login */}
              <div className="absolute top-6 -left-4 z-20 animate-float bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-2 px-4 flex items-center space-x-2.5 shadow-lg shadow-[#0C3B2E]/30">
                <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold text-white tracking-wide">✔ Secure Login</span>
              </div>

              {/* Badge 2: Discover Events */}
              <div className="absolute bottom-12 -left-6 z-20 animate-float-delayed bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-2 px-4 flex items-center space-x-2.5 shadow-lg shadow-[#0C3B2E]/30">
                <span className="text-xs font-bold text-white tracking-wide">✔ Discover Events</span>
              </div>

              {/* Badge 3: Manage Certificates */}
              <div className="absolute top-1/2 -right-6 z-20 animate-float bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-2 px-4 flex items-center space-x-2.5 shadow-lg shadow-[#0C3B2E]/30">
                <span className="text-xs font-bold text-white tracking-wide">✔ Manage Certificates</span>
              </div>

              {/* Central illustration SVG */}
              <svg className="w-48 h-48 sm:w-56 sm:h-56 filter drop-shadow-[0_15px_30px_rgba(16,185,129,0.2)]" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Grid Sphere */}
                <circle cx="100" cy="100" r="80" stroke="url(#sphereGrad)" strokeWidth="1" strokeDasharray="4 4" className="animate-[spin_40s_linear_infinite]" />
                <circle cx="100" cy="100" r="60" stroke="url(#sphereGrad)" strokeWidth="1.5" strokeDasharray="6 3" className="animate-[spin_20s_linear_infinite_reverse]" />
                
                {/* Floating Orbit Rings */}
                <ellipse cx="100" cy="100" rx="90" ry="25" stroke="url(#ringGrad)" strokeWidth="2" transform="rotate(-30 100 100)" className="animate-pulse" />
                <ellipse cx="100" cy="100" rx="90" ry="25" stroke="url(#ringGrad)" strokeWidth="1" transform="rotate(40 100 100)" />
                
                {/* Node Points */}
                <circle cx="35" cy="70" r="5" fill="#34D399" className="animate-ping" style={{ animationDuration: '3s' }} />
                <circle cx="35" cy="70" r="5" fill="#34D399" />
                
                <circle cx="165" cy="130" r="7" fill="#FBBF24" className="animate-ping" style={{ animationDuration: '4s' }} />
                <circle cx="165" cy="130" r="7" fill="#FBBF24" />

                <circle cx="140" cy="50" r="4" fill="#6EE7B7" />
                <circle cx="60" cy="150" r="6" fill="#10B981" />

                {/* Central Ticket & Security Shield */}
                <g className="animate-float">
                  {/* Holographic Ticket Graphic */}
                  <rect x="55" y="70" width="90" height="60" rx="10" fill="url(#ticketGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  <path d="M55 95 C62 95 62 105 55 105" stroke="rgba(255,255,255,0.4)" fill="#114E3C" />
                  <path d="M145 95 C138 95 138 105 145 105" stroke="rgba(255,255,255,0.4)" fill="#114E3C" />
                  <line x1="80" y1="85" x2="120" y2="85" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                  <line x1="80" y1="95" x2="110" y2="95" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                  <line x1="80" y1="105" x2="115" y2="105" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Glowing Security Shield Core */}
                  <path d="M100 55 L120 65 V85 C120 97 112 108 100 112 C88 108 80 97 80 85 V65 L100 55 Z" fill="url(#shieldGrad)" stroke="white" strokeWidth="2" className="filter drop-shadow-[0_4px_10px_rgba(251,191,36,0.5)]" />
                  <path d="M100 62 L113 69 V83 C113 92 107 100 100 103 C93 100 87 92 87 83 V69 L100 62 Z" fill="#0C3B2E" opacity="0.4" />
                  <path d="M96 75 L100 71 L108 79" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>

                {/* SVG Gradients Definitions */}
                <defs>
                  <linearGradient id="sphereGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#34D399" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#2E6F40" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="ringGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#34D399" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="ticketGrad" x1="55" y1="70" x2="145" y2="130" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#2E6F40" />
                    <stop offset="100%" stopColor="#0C3B2E" />
                  </linearGradient>
                  <linearGradient id="shieldGrad" x1="80" y1="55" x2="120" y2="112" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#FBBF24" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
          </div>

          {/* Left Side Footer */}
          <div className="relative z-10 flex items-center justify-between text-xs text-emerald-100/60 border-t border-emerald-800/40 pt-6">
            <span>© 2026 Eventra. All rights reserved.</span>
            <span>v2.0.1 Premium</span>
          </div>

        </div>

        {/* Right Side: Register Form (45% on Desktop) */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center bg-white p-6 sm:p-10 lg:p-12">
          
          <div className="max-w-[440px] w-full mx-auto">
            
            {/* Header Titles */}
            <div className="text-center lg:text-left mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-outfit">
                Create Your Account
              </h2>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                Get started today by establishing your credentials.
              </p>
            </div>

            {/* Notification alert states (Success / Error) */}
            {alertVisible && (
              <div className={`p-4 rounded-xl border mb-5 flex items-start space-x-3 text-sm animate-[slideDown_0.3s_ease-out] shadow-md ${
                status === 'success' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                <div className="shrink-0 mt-0.5">
                  {status === 'success' ? (
                    <Check className="h-5 w-5 text-emerald-600 bg-emerald-100 rounded-full p-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-rose-600" />
                  )}
                </div>
                <div className="font-semibold">{statusMsg}</div>
              </div>
            )}

            {/* Primary Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
              
              {/* Full Name Input */}
              <div className="space-y-1 text-left">
                <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.name 
                        ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                        : 'border-slate-200 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40]'
                    }`}
                  />
                  <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-200 ${
                    errors.name ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-[#2E6F40]'
                  }`} />
                </div>
                {errors.name && (
                  <p className="text-xs text-rose-600 font-bold flex items-center space-x-1 mt-1">
                    <span>• {errors.name}</span>
                  </p>
                )}
              </div>

              {/* Email Address Input */}
              <div className="space-y-1 text-left">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.email 
                        ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                        : 'border-slate-200 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40]'
                    }`}
                  />
                  <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-200 ${
                    errors.email ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-[#2E6F40]'
                  }`} />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-600 font-bold flex items-center space-x-1 mt-1">
                    <span>• {errors.email}</span>
                  </p>
                )}
              </div>

              {/* Phone Number Input */}
              <div className="space-y-1 text-left">
                <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Phone Number
                </label>
                <div className="relative group">
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                    }}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.phone 
                        ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                        : 'border-slate-200 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40]'
                    }`}
                  />
                  <Phone className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-200 ${
                    errors.phone ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-[#2E6F40]'
                  }`} />
                </div>
                {errors.phone && (
                  <p className="text-xs text-rose-600 font-bold flex items-center space-x-1 mt-1">
                    <span>• {errors.phone}</span>
                  </p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Select Role
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Participant Option Box */}
                  <div
                    onClick={() => {
                      if (!isLoading) {
                        setRole('participant');
                        if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
                      }
                    }}
                    className={`flex items-center p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none ${
                      role === 'participant'
                        ? 'border-[#2E6F40] bg-emerald-50/30'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg border mr-3 transition-colors duration-200 ${
                      role === 'participant'
                        ? 'bg-[#2E6F40] text-white border-[#2E6F40]'
                        : 'bg-white text-slate-400 border-slate-200'
                    }`}>
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold leading-none ${role === 'participant' ? 'text-[#2E6F40]' : 'text-slate-700'}`}>
                        Participant
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 font-medium">Join Events</span>
                    </div>
                  </div>

                  {/* Organizer Option Box */}
                  <div
                    onClick={() => {
                      if (!isLoading) {
                        setRole('organizer');
                        if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
                      }
                    }}
                    className={`flex items-center p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none ${
                      role === 'organizer'
                        ? 'border-[#2E6F40] bg-emerald-50/30'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg border mr-3 transition-colors duration-200 ${
                      role === 'organizer'
                        ? 'bg-[#2E6F40] text-white border-[#2E6F40]'
                        : 'bg-white text-slate-400 border-slate-200'
                    }`}>
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold leading-none ${role === 'organizer' ? 'text-[#2E6F40]' : 'text-slate-700'}`}>
                        Organizer
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 font-medium">Host Events</span>
                    </div>
                  </div>
                </div>
                {errors.role && (
                  <p className="text-xs text-rose-600 font-bold flex items-center space-x-1 mt-1">
                    <span>• {errors.role}</span>
                  </p>
                )}
              </div>

              {/* Participant Fields */}
              {role === 'participant' && (
                <div className="space-y-4 animate-[slideDown_0.2s_ease-out]">
                  {/* Interests Input */}
                  <div className="space-y-1 text-left">
                    <label htmlFor="interests" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Interests
                    </label>
                    <div className="relative group">
                      <input
                        id="interests"
                        type="text"
                        placeholder="e.g. Design, Coding, Music, Sports"
                        value={interests}
                        onChange={(e) => {
                          setInterests(e.target.value);
                          if (errors.interests) setErrors(prev => ({ ...prev, interests: '' }));
                        }}
                        disabled={isLoading}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.interests 
                            ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                            : 'border-slate-200 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40]'
                        }`}
                      />
                      <Sparkles className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-200 ${
                        errors.interests ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-[#2E6F40]'
                      }`} />
                    </div>
                    {errors.interests && (
                      <p className="text-xs text-rose-600 font-bold flex items-center space-x-1 mt-1">
                        <span>• {errors.interests}</span>
                      </p>
                    )}
                  </div>

                  {/* Location Input */}
                  <div className="space-y-1 text-left">
                    <label htmlFor="location" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Location
                    </label>
                    <div className="relative group">
                      <input
                        id="location"
                        type="text"
                        placeholder="Enter your city or country"
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
                        }}
                        disabled={isLoading}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.location 
                            ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                            : 'border-slate-200 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40]'
                        }`}
                      />
                      <MapPin className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-200 ${
                        errors.location ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-[#2E6F40]'
                      }`} />
                    </div>
                    {errors.location && (
                      <p className="text-xs text-rose-600 font-bold flex items-center space-x-1 mt-1">
                        <span>• {errors.location}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Organizer Fields */}
              {role === 'organizer' && (
                <div className="space-y-4 animate-[slideDown_0.2s_ease-out]">
                  {/* Organization Name Input */}
                  <div className="space-y-1 text-left">
                    <label htmlFor="organizationName" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Organization Name
                    </label>
                    <div className="relative group">
                      <input
                        id="organizationName"
                        type="text"
                        placeholder="Enter your organization's name"
                        value={organizationName}
                        onChange={(e) => {
                          setOrganizationName(e.target.value);
                          if (errors.organizationName) setErrors(prev => ({ ...prev, organizationName: '' }));
                        }}
                        disabled={isLoading}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.organizationName 
                            ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                            : 'border-slate-200 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40]'
                        }`}
                      />
                      <Building2 className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-200 ${
                        errors.organizationName ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-[#2E6F40]'
                      }`} />
                    </div>
                    {errors.organizationName && (
                      <p className="text-xs text-rose-600 font-bold flex items-center space-x-1 mt-1">
                        <span>• {errors.organizationName}</span>
                      </p>
                    )}
                  </div>

                  {/* Contact Info Input */}
                  <div className="space-y-1 text-left">
                    <label htmlFor="contactInfo" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Contact Info
                    </label>
                    <div className="relative group">
                      <input
                        id="contactInfo"
                        type="text"
                        placeholder="Enter website URL or contact email"
                        value={contactInfo}
                        onChange={(e) => {
                          setContactInfo(e.target.value);
                          if (errors.contactInfo) setErrors(prev => ({ ...prev, contactInfo: '' }));
                        }}
                        disabled={isLoading}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 transition-all duration-200 ${
                          errors.contactInfo 
                            ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                            : 'border-slate-200 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40]'
                        }`}
                      />
                      <Globe className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-200 ${
                        errors.contactInfo ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-[#2E6F40]'
                      }`} />
                    </div>
                    {errors.contactInfo && (
                      <p className="text-xs text-rose-600 font-bold flex items-center space-x-1 mt-1">
                        <span>• {errors.contactInfo}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Password Input */}
              <div className="space-y-1 text-left">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-10 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.password 
                        ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                        : 'border-slate-200 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40]'
                    }`}
                  />
                  <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-200 ${
                    errors.password ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-[#2E6F40]'
                  }`} />
                  
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    tabIndex="-1"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-600 font-bold flex items-center space-x-1 mt-1">
                    <span>• {errors.password}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1 text-left">
                <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Confirm Password
                </label>
                <div className="relative group">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }}
                    disabled={isLoading}
                    className={`w-full pl-10 pr-10 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.confirmPassword 
                        ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500' 
                        : 'border-slate-200 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40]'
                    }`}
                  />
                  <KeyRound className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 transition-colors duration-200 ${
                    errors.confirmPassword ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-[#2E6F40]'
                  }`} />
                  
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    tabIndex="-1"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-rose-600 font-bold flex items-center space-x-1 mt-1">
                    <span>• {errors.confirmPassword}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-[#2E6F40] hover:bg-[#235431] text-white py-3 px-6 rounded-xl font-bold text-sm tracking-wide shadow-md shadow-[#2E6F40]/10 hover:shadow-lg hover:shadow-[#2E6F40]/20 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-200 disabled:opacity-85 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            {/* Styled Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative bg-white px-4 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest select-none">
                OR
              </div>
            </div>

            {/* Social Logins */}
            <div className="space-y-2.5">
              {/* Google SSO */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    localStorage.setItem('token', 'MOCK_JWT_TOKEN_ABC123');
                    localStorage.setItem('user', JSON.stringify({ name: 'Google User', email: 'google@gmail.com' }));
                    setIsLoggedIn(true);
                    navigate('/');
                  }, 1200);
                }}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 transform cursor-pointer disabled:opacity-50"
              >
                <svg className="h-4.5 w-4.5 mr-2.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* GitHub SSO */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    localStorage.setItem('token', 'MOCK_JWT_TOKEN_ABC123');
                    localStorage.setItem('user', JSON.stringify({ name: 'Github User', email: 'github@github.com' }));
                    setIsLoggedIn(true);
                    navigate('/');
                  }, 1200);
                }}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 transform cursor-pointer disabled:opacity-50"
              >
                <svg className="h-4.5 w-4.5 mr-2.5 fill-slate-800 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                <span>Continue with GitHub</span>
              </button>

              {/* Facebook SSO */}
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    localStorage.setItem('token', 'MOCK_JWT_TOKEN_ABC123');
                    localStorage.setItem('user', JSON.stringify({ name: 'Facebook User', email: 'facebook@facebook.com' }));
                    setIsLoggedIn(true);
                    navigate('/');
                  }, 1200);
                }}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 transform cursor-pointer disabled:opacity-50"
              >
                <svg className="h-4.5 w-4.5 mr-2.5 fill-[#1877F2] shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Continue with Facebook</span>
              </button>
            </div>

            {/* Form Footer Redirect Links */}
            <div className="text-center mt-6 text-slate-500 font-semibold text-xs sm:text-sm">
              <span>Already have an account? </span>
              <button
                type="button"
                onClick={() => navigate('/login')}
                disabled={isLoading}
                className="text-[#2E6F40] hover:text-emerald-700 font-bold hover:underline bg-transparent border-none cursor-pointer"
              >
                Sign In
              </button>
            </div>

            {/* Bottom Security Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-5 border-t border-slate-100 text-[10px] sm:text-xs font-bold text-slate-500 select-none">
              <span className="flex items-center space-x-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Secure Login</span>
              </span>
              <span className="flex items-center space-x-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Encrypted Authentication</span>
              </span>
              <span className="flex items-center space-x-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Privacy Protected</span>
              </span>
            </div>

          </div>
          
        </div>

      </div>
    </div>
  );
}
