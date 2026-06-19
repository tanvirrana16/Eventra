import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Loader2, Check, Calendar, Music, Ticket } from 'lucide-react';
import EventCard from './EventCard';
import mockEvents from '../data/mockEventsExtended';
import { API_BASE_URL } from '../config';

const ALL_CATEGORIES = [
  "Concert",
  "Sports",
  "Workshops",
  "Fundraisers",
  "Festivals",
  "Competitions",
  "Fashion Shows",
  "Conferences",
  "Seminars",
  "Reunions",
  "Exhibitions",
  "Launching",
  "Stand-up",
  "Party",
  "Pop Culture",
  "Movie / Drama"
];

export default function EventsPage({ onViewDetails }) {
  // Filters & State
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Live' | 'Upcoming'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]); // Array of strings
  const [localCategories, setLocalCategories] = useState([]); // Local state for dropdown before applying
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Pagination
  const [displayLimit, setDisplayLimit] = useState(16);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Dynamic API state
  const [eventsList, setEventsList] = useState(mockEvents);
  const [heroData, setHeroData] = useState(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Refs for closing dropdown
  const dropdownRef = useRef(null);
  const toggleBtnRef = useRef(null);

  // Parse category filter from URL (e.g. ?category=slug) if passed from ExploreCategories click
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryQuery = params.get('category');
    if (categoryQuery) {
      const matchedCategory = ALL_CATEGORIES.find(
        cat => cat.toLowerCase().replace(/ /g, '-').replace(/\//g, '-') === categoryQuery.toLowerCase()
      );
      if (matchedCategory) {
        setSelectedCategories([matchedCategory]);
      }
    }
  }, []);

  // Fetch Page Hero and Events Registry from APIs on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/pages/hero/events`)
      .then(res => res.json())
      .then(data => setHeroData(data))
      .catch(err => console.warn('Failed to load events page hero details', err));

    fetch(`${API_BASE_URL}/events`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          // Normalize status field if backend doesn't output rawStatus
          const normalized = data.map(evt => ({
            ...evt,
            rawStatus: evt.rawStatus || (evt.status === 'Closed' ? 'Past' : evt.status === 'Live Event' ? 'Live' : 'Upcoming')
          }));
          setEventsList(normalized);
        }
        setIsLoadingEvents(false);
      })
      .catch(err => {
        console.warn('Events API connection failed, using mock events.', err);
        setIsLoadingEvents(false);
      });
  }, []);

  // Dynamic category counts calculation from active events list
  const categoryCounts = React.useMemo(() => {
    return eventsList.reduce((acc, evt) => {
      acc[evt.category] = (acc[evt.category] || 0) + 1;
      return acc;
    }, {});
  }, [eventsList]);

  // Dropdown Click-Outside Handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync local categories with actual applied categories when dropdown opens
  useEffect(() => {
    if (isDropdownOpen) {
      setLocalCategories(selectedCategories);
    }
  }, [isDropdownOpen, selectedCategories]);

  // Handle local checkbox toggle in the dropdown
  const handleCheckboxToggle = (cat) => {
    setLocalCategories((prev) => {
      if (prev.includes(cat)) {
        return prev.filter((c) => c !== cat);
      } else {
        return [...prev, cat];
      }
    });
  };

  // Apply the selected categories to the main list filter
  const handleApplyFilter = (e) => {
    e.preventDefault();
    setSelectedCategories(localCategories);
    setDisplayLimit(16); // Reset pagination on filter apply
    setIsDropdownOpen(false);
  };

  // Status radio selection handler
  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setDisplayLimit(16); // Reset pagination
  };

  // Search input handler
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setDisplayLimit(16); // Reset pagination
  };

  // Filter & Sort Events
  const processedEvents = React.useMemo(() => {
    let result = [...eventsList];

    // 1. Filter by Status
    if (statusFilter === 'Live') {
      result = result.filter((evt) => evt.rawStatus === 'Live');
    } else if (statusFilter === 'Upcoming') {
      result = result.filter((evt) => evt.rawStatus === 'Upcoming');
    }

    // 2. Filter by Category
    if (selectedCategories.length > 0) {
      result = result.filter((evt) => selectedCategories.includes(evt.category));
    }

    // 3. Filter by Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter((evt) => {
        const titleMatch = evt.title.toLowerCase().includes(q);
        const categoryMatch = evt.category.toLowerCase().includes(q);
        const organizerMatch = evt.organizer.name.toLowerCase().includes(q);
        const venueMatch = evt.venue.toLowerCase().includes(q);
        const tagsMatch = evt.tags.some((tag) => tag.toLowerCase().includes(q));
        return titleMatch || categoryMatch || organizerMatch || venueMatch || tagsMatch;
      });
    }

    // 4. Sort Events
    // Sorting spec: nearest upcoming events displayed first, followed by live events (when applicable), and then past events in chronological order.
    return result.sort((a, b) => {
      const getGroupScore = (evt) => {
        if (evt.rawStatus === 'Upcoming') return 1;
        if (evt.rawStatus === 'Live') return 2;
        return 3; // Past
      };

      const scoreA = getGroupScore(a);
      const scoreB = getGroupScore(b);

      if (scoreA !== scoreB) {
        return scoreA - scoreB;
      }

      // Within the same status group, sort ascending by date
      return new Date(a.date) - new Date(b.date);
    });
  }, [statusFilter, selectedCategories, searchQuery, eventsList]);

  // Pagination Handler (Simulate API load)
  const handleLoadMore = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);

    setTimeout(() => {
      setDisplayLimit((prevLimit) => {
        if (prevLimit === 16) {
          return 32;
        } else {
          return prevLimit + 32;
        }
      });
      setIsLoadingMore(false);
    }, 800);
  };

  const displayedEvents = processedEvents.slice(0, displayLimit);
  const hasMore = processedEvents.length > displayLimit;

  const heroTitle = heroData?.title || '';
  const heroSubtitle = heroData?.subtitle || '';
  const heroBgColor = heroData?.background_color || '#0C3B2E';

  return (
    <div className="flex-grow bg-slate-50 font-outfit">
      {/* Hero Banner Section */}
      <section 
        className="w-full pt-20 pb-28 sm:pt-28 sm:pb-40 text-left text-white relative overflow-hidden select-none animate-fade-in"
        style={{ backgroundColor: heroBgColor }}
      >
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Two-Column Responsive Layout */}
        <div className="max-w-6xl mx-auto px-4 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Text & Headers */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              Discover Local Events
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight bg-gradient-to-b from-white via-white to-emerald-100 bg-clip-text text-transparent">
              {heroTitle}
            </h1>
            <div className="w-16 h-1.5 bg-[#2E6F40] rounded-full"></div>

            <p className="text-sm sm:text-base text-emerald-100/70 max-w-xl font-light leading-relaxed text-justify">
              {heroSubtitle}
            </p>
          </div>

          {/* Right Column: Floating Interactive SVG/CSS Mockup */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="w-72 h-72 sm:w-80 sm:h-80 relative animate-float">
              {/* Outer dashed spinning ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-emerald-500/25 animate-spin" style={{ animationDuration: '40s' }}></div>
              <div className="absolute inset-8 rounded-full border border-emerald-500/10"></div>

              {/* Central Glassmorphic Event Ticket mockup card */}
              <div className="absolute inset-12 bg-emerald-950/45 border border-emerald-500/20 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col justify-between p-5 text-left select-none group hover:border-emerald-400/35 transition-colors">
                <div className="flex justify-between items-center border-b border-emerald-800/40 pb-2">
                  <span className="text-[10px] font-black text-emerald-400 tracking-widest uppercase">STAGE TICKET</span>
                  <Ticket className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="my-2">
                  <span className="text-xs font-bold text-white block truncate">Rock & Jazz Fest 2026</span>
                  <span className="text-[9px] text-emerald-300 font-semibold block mt-0.5">Live at Arena Hall</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-emerald-800/40">
                  <span className="text-[9px] font-bold text-white uppercase">ADMIT ONE</span>
                  <span className="text-[9px] font-bold text-yellow-400">★ VIP PASS</span>
                </div>
              </div>

              {/* Outer floating icons */}
              <div className="absolute -top-1 -right-1 w-12 h-12 bg-[#0C3B2E] border border-emerald-500/25 rounded-2xl flex items-center justify-center shadow-lg animate-float-delayed">
                <Calendar className="h-5.5 w-5.5 text-emerald-400 animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -left-1 w-12 h-12 bg-[#0C3B2E] border border-emerald-500/25 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                <Music className="h-5.5 w-5.5 text-emerald-400" />
              </div>
            </div>
          </div>

        </div>

        {/* Premium Bottom Wave Curved Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none z-10">
          <svg className="relative block w-full h-[60px] md:h-[120px] translate-y-[1px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86C220.11,68,121.81,98.63,0,27.35V120H1200V95.8C1130.49,111.54,1059.8,111.45,985.66,92.83Z"
              className="fill-slate-50"
            ></path>
          </svg>
        </div>
      </section>

      {/* Main Content & Filters Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">

        {/* Filter and Search Action Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white/60 p-4 rounded-3xl border border-gray-100 backdrop-blur-md">

          {/* Left Side: Status Filters */}
          <div className="flex items-center space-x-2.5">
            {['All', 'Live', 'Upcoming'].map((status) => {
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 transform active:scale-95 cursor-pointer border ${isActive
                      ? 'bg-[#2E6F40]/10 border-[#2E6F40]/20 text-[#2E6F40] shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200/70 text-gray-500 hover:text-gray-800'
                    }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full border flex items-center justify-center transition-all ${isActive ? 'border-[#2E6F40] bg-[#2E6F40]' : 'border-gray-300'
                    }`}>
                    {isActive && <span className="h-1 w-1 bg-white rounded-full"></span>}
                  </span>
                  <span>{status}</span>
                </button>
              );
            })}
          </div>

          {/* Right/Center Side: Search and Dropdown Filter Settings */}
          <div className="flex items-center space-x-3 w-full md:w-auto relative">

            {/* Filter Settings Button */}
            <button
              ref={toggleBtnRef}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`p-3 bg-white border border-slate-200 hover:border-[#2E6F40] rounded-2xl hover:text-[#2E6F40] transition-all cursor-pointer transform active:scale-95 flex items-center justify-center shadow-xs ${isDropdownOpen || selectedCategories.length > 0
                  ? 'border-[#2E6F40] text-[#2E6F40] bg-emerald-50/20'
                  : 'text-gray-500'
                }`}
              title="Filter Categories"
            >
              <SlidersHorizontal className={`h-4.5 w-4.5 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Search Input Box */}
            <div className="relative flex-grow md:w-64 lg:w-80 group">
              <input
                type="text"
                placeholder="Search Events..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-5 pr-11 py-3 bg-white text-xs text-gray-800 font-bold border border-slate-200 focus:border-[#2E6F40] placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/10 transition-all duration-300 shadow-xs focus:shadow-md"
              />
              <Search className="absolute right-4.5 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-[#2E6F40] transition-colors duration-300" />
            </div>

          </div>
        </div>

        {/* Category Dropdown Modal Expanded Panel Container */}
        <div
          ref={dropdownRef}
          className={`w-full bg-white rounded-3xl border border-slate-200/80 shadow-md text-left transition-all duration-500 ease-in-out overflow-hidden transform origin-top ${isDropdownOpen
              ? 'max-h-[600px] opacity-100 scale-y-100 mb-8 p-6 sm:p-8 border-slate-200/80'
              : 'max-h-0 opacity-0 scale-y-95 pointer-events-none p-0 border-0 mb-0'
            }`}
        >
          <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-5">
            <h4 className="text-sm font-black text-gray-900 font-outfit uppercase tracking-wider">
              Categories
            </h4>
            {localCategories.length > 0 && (
              <button
                onClick={() => setLocalCategories([])}
                className="text-[10px] font-black text-[#2E6F40] hover:text-[#2E6F40]/80 uppercase tracking-widest cursor-pointer animate-fade-in"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Categories Grid List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {ALL_CATEGORIES.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isChecked = localCategories.includes(cat);
              return (
                <label
                  key={cat}
                  className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl hover:bg-slate-50 border transition-all cursor-pointer group text-xs font-bold text-gray-700 ${isChecked
                      ? 'border-[#2E6F40] bg-emerald-50/10'
                      : 'border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isChecked ? 'border-black bg-black text-white' : 'border-gray-300 bg-white group-hover:border-gray-400'
                      }`}>
                      {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="font-semibold text-gray-900 group-hover:text-black transition-colors">{cat}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 group-hover:text-gray-500 font-mono font-medium">{count}</span>
                </label>
              );
            })}
          </div>

          {/* Dropdown Action Filter Button */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleApplyFilter}
              className="py-2.5 px-8 bg-black hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Selected Categories Indicator Tags (Pills) */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-8 animate-fade-in">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-1">Active Categories:</span>
            {selectedCategories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-900 text-white rounded-md text-[10px] font-extrabold uppercase tracking-wider"
              >
                <span>{cat}</span>
                <button
                  onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))}
                  className="hover:text-red-400 transition-colors ml-1 font-black cursor-pointer text-[9px]"
                  title="Remove filter"
                >
                  ✕
                </button>
              </span>
            ))}
            <button
              onClick={() => setSelectedCategories([])}
              className="text-[10px] font-black text-red-600 hover:text-red-700 uppercase tracking-widest cursor-pointer ml-1"
            >
              Reset
            </button>
          </div>
        )}

        {/* Dynamic Cards Grid */}
        {processedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {displayedEvents.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                onViewDetails={onViewDetails}
                showStatusBadge={true}
              />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center max-w-md mx-auto space-y-4">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-gray-400">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 leading-snug">No Events Found</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We couldn't find any events matching your selected criteria. Try resetting your search filters or check back later!
            </p>
            <button
              onClick={() => {
                setStatusFilter('All');
                setSearchQuery('');
                setSelectedCategories([]);
              }}
              className="px-6 py-2.5 bg-gradient-to-r from-[#2E6F40] to-emerald-600 text-white text-xs font-bold rounded-xl shadow cursor-pointer hover:shadow-md transition-shadow"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Load More/Pagination Container */}
        {processedEvents.length > 0 && (
          <div className="mt-16 text-center flex flex-col items-center justify-center space-y-4">
            <p className="text-xs text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-900">{displayedEvents.length}</span> of <span className="font-bold text-gray-900">{processedEvents.length}</span> Events
            </p>

            {hasMore ? (
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="min-w-[140px] py-3.5 px-8 bg-white hover:bg-slate-50 text-slate-800 text-xs font-extrabold rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin text-[#2E6F40]" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <span>View More</span>
                )}
              </button>
            ) : (
              <div className="inline-block py-2.5 px-6 bg-slate-100 rounded-full border border-slate-200/30">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  You've reached the end of the event list.
                </p>
              </div>
            )}
          </div>
        )}

      </section>

      {/* Styled slide animation keyframes inject */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.25s ease-out forwards;
        }
      `}</style>

    </div>
  );
}
