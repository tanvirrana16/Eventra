import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, ArrowUpRight } from 'lucide-react';

const sliderEvents = [
  {
    title: "Corporate Events",
    desc: "Networking with industry leaders and global companies.",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&h=800&q=80",
    date: "25 JUN"
  },
  {
    title: "Hands-on Workshops",
    desc: "Gain practical experience from subject matter experts.",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&h=800&q=80",
    date: "02 JUL"
  },
  {
    title: "Tech Conferences",
    desc: "Discover emerging trends in technology and innovation.",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&h=800&q=80",
    date: "14 JUL"
  },
  {
    title: "Startup Meetups",
    desc: "Pitch to investors and form strategic co-founder partnerships.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&h=800&q=80",
    date: "18 JUL"
  },
  {
    title: "Cultural Programs",
    desc: "Experience the vibrant arts and traditional community events.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&h=800&q=80",
    date: "30 JUL"
  },
  {
    title: "Live Concerts",
    desc: "Feel the beat and experience high-octane live music.",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&h=800&q=80",
    date: "05 AUG"
  },
  {
    title: "University Events",
    desc: "Empowering young students and supporting tech talent.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&h=800&q=80",
    date: "12 AUG"
  },
  {
    title: "Community Gatherings",
    desc: "Connect locally, build relationships, and share interests.",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&h=800&q=80",
    date: "20 AUG"
  }
];

export default function Hero({ data, slider }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroTitle = data?.title || "Discover Local Events, Meet New Communities";
  const heroSubtitle = data?.subtitle || "Discover exciting events happening around you—from workshops, seminars, hackathons, networking sessions, cultural festivals, and community meetups. Connect with like-minded people, expand your network, learn new skills, and create unforgettable experiences with Eventra.";
  const btn1Text = data?.btn1_text || "Explore Events";
  const btn1Url = data?.btn1_url || "#events";
  const btn2Text = data?.btn2_text || "Host Event";
  const btn2Url = data?.btn2_url || "/signup";

  const slides = slider && slider.length > 0 ? slider : sliderEvents;

  // Autoplay functionality
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative min-h-[90vh] bg-[#0C3B2E] text-white overflow-hidden font-outfit pt-10 pb-44 lg:pt-16 lg:pb-52 px-4 sm:px-6 lg:px-8 flex items-center">

      {/* Background Floating Blurred Orbs */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">

        {/* Left Side Content Column */}
        <div className="lg:col-span-6 space-y-6 text-left max-w-2xl">

          <div className="inline-flex items-center space-x-2 bg-[#CFFFDC] text-[#2E6F40] px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2E6F40] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2E6F40]"></span>
            </span>
            <span>Live event platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.15] tracking-tight text-balance">
            {heroTitle} {heroTitle.includes('Discover Local Events') && <span className="text-[#CFFFDC]">& Upgrade Your Skills</span>}
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/70 leading-relaxed font-normal text-justify">
            {heroSubtitle}
          </p>

          {/* Dynamic Action Buttons based on isLoggedIn */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => btn1Url.startsWith('http') ? window.open(btn1Url, '_blank') : navigate(btn1Url)}
              className="py-3.5 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm flex items-center space-x-1.5 cursor-pointer transform active:scale-95"
            >
              <span>{btn1Text}</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => btn2Url.startsWith('http') ? window.open(btn2Url, '_blank') : navigate(btn2Url)}
              className="py-3.5 px-8 border border-white/20 hover:border-white hover:bg-white/5 text-white font-bold rounded-full transition-all duration-300 text-sm cursor-pointer transform active:scale-95"
            >
              {btn2Text}
            </button>
          </div>

        </div>

        {/* Right Side Slider and Overlapping Cards Column */}
        <div className="lg:col-span-6 relative flex items-center justify-center lg:pl-6">

          {/* Overlapping Floating Element: Platform Rating (Top Right) */}
          <div className="absolute top-4 -right-4 z-20 glass-panel py-2 px-3.5 rounded-xl shadow-lg hidden md:flex items-center space-x-1 border border-white/50 hover:border-emerald-400/60 hover:shadow-emerald-500/10 transition-all duration-500 animate-pulse cursor-pointer">
            <Star className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-extrabold text-slate-900">4.9/5 Rating</span>
          </div>

          {/* Main Image Slider Container */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[1.4/1] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-emerald-500/10 group">
            
            {/* Animated border lines (top-left & bottom-right corners) */}
            <div className="absolute top-0 left-0 w-10 h-[1.5px] bg-gradient-to-r from-emerald-400 to-transparent transition-all group-hover:w-24 duration-700 z-30"></div>
            <div className="absolute top-0 left-0 w-[1.5px] h-10 bg-gradient-to-b from-emerald-400 to-transparent transition-all group-hover:h-24 duration-700 z-30"></div>
            
            <div className="absolute bottom-0 right-0 w-10 h-[1.5px] bg-gradient-to-l from-emerald-400 to-transparent transition-all group-hover:w-24 duration-700 z-30"></div>
            <div className="absolute bottom-0 right-0 w-[1.5px] h-10 bg-gradient-to-t from-emerald-400 to-transparent transition-all group-hover:h-24 duration-700 z-30"></div>
            
            {/* Glowing border outline */}
            <div className="absolute inset-0 rounded-3xl border border-emerald-500/20 group-hover:border-emerald-400/40 pointer-events-none z-30 transition-all duration-700 group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]"></div>

            {/* Slides Mapping */}
            {slides.map((slide, idx) => (
              <div
                key={slide.title + '-' + idx}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                  }`}
              >
                {/* Background Image */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover brightness-75 filter transition-all duration-[4500ms] ease-out group-hover:scale-110"
                />

                {/* Bottom Card details gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 text-white text-left">
                  {slide.date && (
                    <div className="absolute top-4 left-4 bg-[#CFFFDC] text-[#2E6F40] font-black text-xs px-3 py-1.5 rounded-xl shadow flex flex-col items-center">
                      <span className="text-[10px] uppercase font-bold tracking-tight">Date</span>
                      <span className="text-sm tracking-tighter leading-none">{slide.date.split(" ")[0]}</span>
                      <span className="text-[9px] leading-none">{slide.date.split(" ")[1]}</span>
                    </div>
                  )}

                  <h3 className="text-xl sm:text-2xl font-bold font-outfit leading-tight text-white mb-1">
                    {slide.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 font-light max-w-sm">
                    {slide.description || slide.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* Slider Navigation Arrows */}
            {slides.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-25 bg-black/45 hover:bg-black/75 hover:scale-105 text-white p-2.5 rounded-full backdrop-blur-sm transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                  aria-label="Previous event slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-25 bg-black/45 hover:bg-black/75 hover:scale-105 text-white p-2.5 rounded-full backdrop-blur-sm transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                  aria-label="Next event slide"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Slider Navigation Dots */}
            {slides.length > 1 && (
              <div className="absolute bottom-4 right-6 z-25 flex space-x-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === currentSlide ? 'bg-[#CFFFDC] w-6' : 'bg-white/40 w-2'
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Slide Progress Bar */}
            {slides.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
                <div
                  key={currentSlide}
                  className="h-full bg-[#CFFFDC] animate-[progress_4.5s_linear]"
                  style={{
                    animationKey: currentSlide,
                    width: '100%'
                  }}
                />
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Slider Progress Bar Animation style injection (Vite scoped) */}
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>

      {/* Wavy bottom divider with glowing green gradient line */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
        <svg className="relative block w-full h-[80px] md:h-[150px] translate-y-[2px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="greenWaveGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2E6F40" />
              <stop offset="35%" stopColor="#10B981" />
              <stop offset="70%" stopColor="#CFFFDC" />
              <stop offset="100%" stopColor="#2E6F40" />
            </linearGradient>
          </defs>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c74.14,18.62,144.83,18.92,214.34,3.18V120H0V27.35C121.81,98.63,220.11,68,321.39,56.44Z" className="fill-[#f8fafc]"></path>
          
          <path 
            d="M0,27.35C121.81,98.63,220.11,68,321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c74.14,18.62,144.83,18.92,214.34,3.18" 
            fill="none" 
            stroke="url(#greenWaveGlow)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            className="opacity-95 animate-pulse"
          />
        </svg>
      </div>
    </section>
  );
}
