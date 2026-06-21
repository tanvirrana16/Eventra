import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  ExternalLink, 
  Ticket, 
  XOctagon, 
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function MyRegistrations({ 
  registrations, 
  onViewDetails, 
  onViewPass, 
  onCancelSuccess,
  API_BASE_URL, 
  token 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All', 'Upcoming', 'Live', 'Past'
  const [isCancelling, setIsCancelling] = useState(null);

  const handleCancelRegistration = (regId) => {
    if (!window.confirm('Are you sure you want to cancel this registration? This will release your seat.')) return;
    
    setIsCancelling(regId);
    
    fetch(`${API_BASE_URL}/user/registrations/${regId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
    .then(async (res) => {
      const data = await res.json();
      setIsCancelling(null);
      if (res.ok) {
        alert(data.message || 'Registration cancelled successfully.');
        onCancelSuccess();
      } else {
        alert(data.message || 'Failed to cancel registration.');
      }
    })
    .catch((err) => {
      setIsCancelling(null);
      alert('Error connecting to the API.');
      console.error(err);
    });
  };

  // Filter & Search Logic
  const filteredRegs = registrations.filter((reg) => {
    const matchesSearch = reg.event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || reg.event.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Live':
        return 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse';
      case 'Past':
        return 'bg-slate-50 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 font-outfit text-left animate-fade-in">
      
      {/* Title */}
      <div className="pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">My Registrations</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
            Browse and manage events you've signed up for.
          </p>
        </div>
        
        {/* Statistics count indicator */}
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-full px-3.5 py-1.5 self-start">
          Total Signups: {registrations.length}
        </span>
      </div>

      {/* Filters & Search Row */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md group">
          <input
            type="text"
            placeholder="Search by event name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#2E6F40] transition-colors" />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          {['All', 'Upcoming', 'Live', 'Past'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === filter
                  ? 'bg-[#2E6F40] text-white shadow-md'
                  : 'bg-slate-50 border border-slate-100 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

      </div>

      {/* Registrations List / Table */}
      <div className="mt-8 overflow-x-auto">
        {filteredRegs.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-widest text-slate-400">
                <th className="pb-4 pl-2">Event</th>
                <th className="pb-4">Category</th>
                <th className="pb-4">Schedule</th>
                <th className="pb-4">Venue</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegs.map((reg) => {
                const event = reg.event;
                const isUpcoming = event.status === 'Upcoming';
                const isCancelled = reg.pass_status === 'Cancelled';
                
                return (
                  <tr 
                    key={reg.id} 
                    className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${
                      isCancelled ? 'opacity-60' : ''
                    }`}
                  >
                    
                    {/* Poster & Name */}
                    <td className="py-4 pl-2 min-w-[220px]">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=120&h=80&q=80'}
                          alt={event.title}
                          className="h-11 w-16 object-cover rounded-lg shadow-sm bg-slate-100"
                        />
                        <div className="text-left">
                          <p className="font-extrabold text-slate-800 text-sm hover:text-[#2E6F40] transition-colors leading-snug">
                            {event.title}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                            Reg ID: {reg.registration_code}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4">
                      <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {event.category}
                      </span>
                    </td>

                    {/* Schedule */}
                    <td className="py-4 min-w-[150px]">
                      <div className="space-y-1 text-slate-600 font-semibold text-xs">
                        <div className="flex items-center space-x-1.5">
                          <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                          <span>{event.dateText}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                    </td>

                    {/* Venue */}
                    <td className="py-4 min-w-[140px]">
                      <div className="flex items-start space-x-1 text-slate-600 font-semibold text-xs leading-relaxed max-w-[160px]">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="truncate" title={event.venue}>{event.venue}</span>
                      </div>
                    </td>

                    {/* Event Status Badges */}
                    <td className="py-4">
                      {isCancelled ? (
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold border border-rose-300 text-rose-500 bg-rose-50 uppercase tracking-wider">
                          Cancelled
                        </span>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold border uppercase tracking-wider ${getStatusBadge(event.status)}`}>
                          {event.status}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 pr-2 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* View Details */}
                        <button
                          onClick={() => onViewDetails(event)}
                          className="p-2 text-slate-400 hover:text-[#2E6F40] bg-slate-50 border border-slate-100 hover:border-emerald-200 rounded-xl transition-all cursor-pointer"
                          title="View Details"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        
                        {/* View Pass */}
                        {!isCancelled && (
                          <button
                            onClick={() => onViewPass(reg.id)}
                            className="p-2 text-slate-400 hover:text-amber-600 bg-slate-50 border border-slate-100 hover:border-amber-200 rounded-xl transition-all cursor-pointer"
                            title="View Digital Pass"
                          >
                            <Ticket className="h-4 w-4" />
                          </button>
                        )}
                        
                        {/* Cancel Registration */}
                        {!isCancelled && isUpcoming && (
                          <button
                            onClick={() => handleCancelRegistration(reg.id)}
                            disabled={isCancelling === reg.id}
                            className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 border border-slate-100 hover:border-rose-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                            title="Cancel Registration"
                          >
                            {isCancelling === reg.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XOctagon className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-12 text-center text-slate-400 font-semibold text-sm flex flex-col items-center justify-center space-y-2.5">
            <AlertCircle className="h-8 w-8 text-slate-300" />
            <p>No event registrations match the search or filter criteria.</p>
          </div>
        )}
      </div>

    </div>
  );
}
