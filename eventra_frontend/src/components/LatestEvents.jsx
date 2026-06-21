import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import EventCard from './EventCard';
import { latestEvents as mockLatestEvents } from '../data/mockEvents';

export default function LatestEvents({ onViewDetails, data }) {
  const navigate = useNavigate();
  const events = data && data.length > 0 ? data : mockLatestEvents;

  return (
    <section id="events" className="py-20 bg-white font-outfit relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          {/* Left: Heading and Badge */}
          <div className="text-left">
            <span className="inline-block bg-[#CFFFDC] text-[#2E6F40] text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-md border border-[#2E6F40]/10 shadow-2xs">
              Fresh additions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mt-1.5">
              Latest Events
            </h2>
            <div className="w-16 h-1.5 bg-[#2E6F40] mt-3 rounded-full"></div>
          </div>

          {/* Right: View All link with hover transition */}
          <div className="shrink-0 self-start md:self-end">
            <button
              onClick={() => navigate('/events')}
              className="inline-flex items-center space-x-1.5 text-sm font-extrabold text-[#2E6F40] hover:text-[#2E6F40]/80 group transition-colors duration-300 bg-transparent border-none cursor-pointer"
            >
              <span className="relative text-left">
                View All Events
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2E6F40] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </span>
              <ArrowRight className="h-4.5 w-4.5 transform group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Cards Layout: 4 columns desktop, 2 columns tablet, horizontal scroll mobile */}
        <div className="flex overflow-x-auto pb-4 gap-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-x-visible md:pb-0 scrollbar-none snap-x snap-mandatory">
          {events.map((event) => (
            <div key={event.id} className="shrink-0 snap-start md:shrink-0 md:w-auto">
              <EventCard
                event={event}
                onViewDetails={onViewDetails}
                showStatusBadge={false}
              />
            </div>
          ))}
        </div>

      </div>

      {/* Premium Divider Border */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-slate-200/80 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-[#2E6F40]/25 to-transparent pointer-events-none"></div>
    </section>
  );
}
