import { MapPin, Clock } from 'lucide-react';

export default function EventCard({ event, onViewDetails, showStatusBadge }) {
  const { title, dateText, dateBadge, time, venue, image, organizer } = event;

  // Dynamically calculate status for badge
  const displayStatus = event.rawStatus || (event.status === 'Closed' ? 'Past' : event.status === 'Live Event' ? 'Live' : event.status || 'Upcoming');
  
  const badgeColorClass = displayStatus === 'Live'
    ? 'bg-rose-600 animate-pulse text-white'
    : (displayStatus === 'Past' ? 'bg-slate-500 text-white' : 'bg-emerald-600 text-white');

  return (
    <div className="flex-none w-72 sm:w-80 md:w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between group font-outfit select-none">

      {/* Top Section: Promotional Event Image */}
      <div className="relative aspect-[16/10] overflow-hidden shrink-0">

        {/* Event Image with hover zoom */}
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Status Badge (top-right corner, dynamically calculated) */}
        {showStatusBadge && displayStatus && (
          <span className={`absolute top-3 right-3 font-extrabold text-[10px] tracking-wide uppercase px-3 py-1 rounded-full shadow-md z-20 ${badgeColorClass}`}>
            {displayStatus}
          </span>
        )}

        {/* Date Badge Overlay (bottom-left corner) */}
        {dateBadge && (
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-[#2E6F40] shadow-md px-3 py-2 rounded-xl flex flex-col items-center justify-center min-w-[52px] border border-white/20 z-20 animate-fade-in">
            <span className="text-lg font-extrabold leading-none tracking-tight">{dateBadge.day}</span>
            <span className="text-[10px] font-black uppercase tracking-wider leading-none mt-0.5">{dateBadge.month}</span>
          </div>
        )}

      </div>

      {/* Middle Section: Card Content */}
      <div className="p-5 flex-grow text-left space-y-4 flex flex-col justify-between">

        <div className="space-y-3">
          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-[#2E6F40] transition-colors duration-300 leading-snug">
            {title}
          </h3>

          {/* Organizer details */}
          <div className="flex items-center space-x-2.5">
            <img
              src={organizer?.avatar}
              alt={organizer?.name}
              className="w-6 h-6 rounded-full object-cover ring-2 ring-emerald-500/20"
            />
            <span className="text-xs font-semibold text-gray-600">
              by <span className="text-gray-900 font-bold">{organizer?.name}</span>
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Available Seats count display */}
          <div className="text-xs font-semibold text-gray-600 flex items-center justify-between bg-slate-50/70 py-2 px-3 rounded-xl border border-slate-100/80">
            <span className="text-gray-500 font-medium">Available Seats:</span>
            <span className={`font-extrabold ${event.seatsLeft === 0 ? 'text-rose-600' : 'text-[#2E6F40]'}`}>
              {event.seatsLeft} / {event.totalSeats ?? 100}
            </span>
          </div>

          <div className="border-t border-gray-100 my-2"></div>

          {/* Bottom Metadata: Location and Time */}
          <div className="space-y-2 text-xs font-medium text-gray-500">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-[#2E6F40] shrink-0" />
              <span className="truncate">{venue}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-[#2E6F40] shrink-0" />
              <span>{dateText} • {time}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section: CTA */}
      <div className="px-5 pb-5">
        <button
          onClick={() => onViewDetails(event)}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-[#2E6F40] to-emerald-600 hover:from-emerald-700 hover:to-[#2E6F40] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer text-center transform active:scale-[0.98]"
        >
          View Details
        </button>
      </div>

    </div>
  );
}
