import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Clock, Users, ArrowRight, ShieldCheck, Ticket, Check, Share2 } from 'lucide-react';

export default function EventDetailsModal({ event, onClose }) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [animationClass, setAnimationClass] = useState('opacity-0 scale-95');

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

  const handleRegister = () => {
    setIsRegistered(true);
    setTimeout(() => {
      // simulate success modal update
    }, 1500);
  };

  const handleShare = () => {
    const dummyUrl = `${window.location.origin}/events/${event.id}`;
    navigator.clipboard.writeText(dummyUrl).then(() => {
      setIsShared(true);
      setTimeout(() => {
        setIsShared(false);
      }, 2000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto transition-opacity duration-300">

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] ${animationClass}`}
      >

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-40 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white hover:scale-105 transition-all cursor-pointer"
          aria-label="Close details"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: Large Cover Image & Gallery (Grid) */}
        <div className="w-full md:w-5/12 bg-slate-100 flex flex-col justify-between border-r border-gray-100 overflow-y-auto md:max-h-full">
          <div className="relative aspect-[16/10] md:aspect-auto md:flex-grow">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover min-h-[240px] md:min-h-full"
            />
            {/* Category tag */}
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
                  <div key={i} className="aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-xs hover:scale-105 transition-transform duration-300">
                    <img src={imgUrl} alt={`gallery-${i}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Scrollable Information Details */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-full text-left font-outfit">

          {/* Core Info */}
          <div className="space-y-6">

            {/* Title & Metadata badges */}
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {event.status && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[9px] uppercase tracking-wide px-2 py-0.5 rounded-md">
                    {event.status}
                  </span>
                )}
                {event.seatsLeft <= 15 && (
                  <span className="bg-amber-50 text-amber-700 border border-amber-200 font-extrabold text-[9px] uppercase tracking-wide px-2 py-0.5 rounded-md animate-pulse">
                    Selling Out Fast
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                {event.title}
              </h2>
            </div>

            {/* Organizer Profile */}
            <div className="flex items-center space-x-3.5 bg-slate-50 p-3 rounded-2xl border border-gray-100">
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#2E6F40]/10"
              />
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hosted By</p>
                <p className="text-sm font-bold text-gray-900">{event.organizer.name}</p>
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
                  <p className="text-[11px] text-gray-500 font-medium">{event.time}</p>
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
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                {event.description || "Join us for this unique learning and networking opportunity. Connect with pioneers in the industry, learn state-of-the-art tools, and expand your portfolio. The event features multiple interactive QA segments, refreshment setups, and project demonstrations."}
              </p>
            </div>

            {/* Event Tags */}
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
                    <div key={index} className="flex items-center space-x-3 bg-slate-50/50 p-2.5 rounded-xl border border-gray-100 hover:bg-slate-50 transition-colors">
                      <img src={speaker.avatar} alt={speaker.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-gray-900 truncate">{speaker.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{speaker.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Action Row */}
          <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            {/* Seats indicator */}
            <div className="flex items-center space-x-2 text-left self-start sm:self-center">
              <div className="bg-red-50 text-red-600 p-2 rounded-full">
                <Ticket className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Remaining Seats</p>
                <p className="text-xs text-red-600 font-black">Only {event.seatsLeft || 25} spots left</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={handleShare}
                className={`py-3 px-4 rounded-2xl border transition-all duration-300 flex items-center justify-center space-x-1.5 cursor-pointer transform active:scale-95 text-xs font-extrabold ${
                  isShared
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200/80 hover:text-slate-800'
                }`}
                title="Share Event"
              >
                <Share2 className="h-4 w-4" />
                <span>{isShared ? 'Copied!' : 'Share'}</span>
              </button>

              {isRegistered ? (
                <div className="w-full sm:w-auto bg-emerald-600 text-white py-3 px-8 rounded-2xl flex items-center justify-center space-x-2 font-bold shadow-lg shadow-emerald-600/20">
                  <Check className="h-5 w-5" />
                  <span className="text-sm">Registered!</span>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  className="w-full sm:w-auto py-3 px-8 bg-[#2E6F40] hover:bg-[#2E6F40]/90 text-white text-sm font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer transform active:scale-95"
                >
                  <span>Register Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
