import { 
  Mic, 
  Building2, 
  Briefcase
} from 'lucide-react';

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

export default function Speakers({ events }) {
  // Aggregate all speakers across organizer's events
  const speakers = [];
  const seenSpeakers = new Set();

  if (events && events.length > 0) {
    events.forEach(event => {
      // Note: LaunchEvent wizard submits speakers, which gets stored in the event
      // If the event has speakers array:
      if (event.speakers && Array.isArray(event.speakers)) {
        event.speakers.forEach(sp => {
          const uniqueKey = `${sp.name}-${sp.designation}`.toLowerCase();
          if (!seenSpeakers.has(uniqueKey)) {
            seenSpeakers.add(uniqueKey);
            speakers.push({
              ...sp,
              eventTitle: event.title
            });
          }
        });
      }
    });
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 font-outfit text-left animate-fade-in select-none">
      
      {/* Header */}
      <div className="pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Hosted Speaker Directory</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
            Browse and manage all speakers assigned to your events in Eventra.
          </p>
        </div>
      </div>

      {/* Speaker Grid */}
      <div className="mt-8 select-text">
        {speakers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {speakers.map((sp, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center text-center space-y-4"
              >
                {/* Speaker Photo */}
                <div className="relative">
                  <img 
                    src={sp.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80'} 
                    alt={sp.name} 
                    className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 shadow-sm"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1.5 bg-[#2E6F40] text-white rounded-full border-2 border-white shadow-xs">
                    <Mic className="h-3 w-3" />
                  </div>
                </div>

                {/* Speaker Details */}
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-800 text-base">{sp.name}</h3>
                  <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500 font-semibold">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    <span>{sp.designation}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 font-semibold">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>{sp.organization || 'Independent'}</span>
                  </div>
                </div>

                {/* Biography */}
                {sp.biography && (
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed px-2 font-normal text-justify">
                    {sp.biography}
                  </p>
                )}

                {/* Event Tag */}
                <div className="pt-2 border-t border-slate-50 w-full flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Event</span>
                  <span className="text-[11px] text-[#2E6F40] font-bold mt-0.5 truncate max-w-[200px]" title={sp.eventTitle}>
                    {sp.eventTitle}
                  </span>
                </div>

                 {/* Social Links */}
                <div className="flex items-center space-x-3 pt-2">
                  {sp.social_links?.linkedin && (
                    <a 
                      href={sp.social_links.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-400 rounded-xl transition-colors border border-slate-100"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                    </a>
                  )}
                  {sp.social_links?.facebook && (
                    <a 
                      href={sp.social_links.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 text-slate-400 rounded-xl transition-colors border border-slate-100"
                    >
                      <FacebookIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 font-semibold text-sm flex flex-col items-center justify-center space-y-3">
            <Mic className="h-10 w-10 text-slate-300" />
            <p className="max-w-xs leading-relaxed">No speakers configured for your events yet. Add speakers inside the Launch Event Wizard!</p>
          </div>
        )}
      </div>

    </div>
  );
}
