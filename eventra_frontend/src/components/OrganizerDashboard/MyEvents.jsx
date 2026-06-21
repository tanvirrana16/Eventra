import { useState } from 'react';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Trash2, 
  PlusCircle, 
  Layers, 
  Eye, 
  Loader2
} from 'lucide-react';

export default function MyEvents({ events, API_BASE_URL, token, onDeleteSuccess, setActiveTab, onViewEvent }) {
  const [activeAction, setActiveAction] = useState(null);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete/archive this event?")) return;
    
    setActiveAction(`delete-${id}`);
    fetch(`${API_BASE_URL}/organizer/events/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(async (res) => {
        const data = await res.json();
        setActiveAction(null);
        if (res.ok) {
          alert(data.message || 'Event processed successfully.');
          onDeleteSuccess();
        } else {
          alert(data.message || 'Failed to delete event.');
        }
      })
      .catch((err) => {
        setActiveAction(null);
        console.error(err);
        alert('Network error. Failed to delete event.');
      });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'draft':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'archived':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 font-outfit text-left animate-fade-in select-none">
      
      {/* Header */}
      <div className="pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">My Events</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
            Manage your created drafts, active publications, seat bookings, and revenue tracking.
          </p>
        </div>
        
        <button
          onClick={() => setActiveTab('launch-event')}
          className="flex items-center space-x-2 py-2.5 px-4 bg-[#2E6F40] hover:bg-[#235431] text-white rounded-xl text-xs font-bold shadow-md shadow-[#2E6F40]/10 hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>Launch New Event</span>
        </button>
      </div>

      {/* Grid of events */}
      <div className="mt-8 select-text">
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div 
                key={evt.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col overflow-hidden"
              >
                
                {/* Event Image Banner */}
                <div className="relative h-40 bg-slate-100">
                  <img 
                    src={evt.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&h=250&q=80'} 
                    alt={evt.title} 
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-3 right-3 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shadow-sm ${getStatusColor(evt.status)}`}>
                    {evt.status}
                  </span>
                </div>

                {/* Event Details Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                      {evt.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-800 line-clamp-1">
                      {evt.title}
                    </h3>
                    
                    {/* Meta info */}
                    <div className="space-y-1.5 pt-1 text-[11px] font-semibold text-slate-500">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{evt.event_date ? new Date(evt.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'} at {evt.event_time || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{evt.registrations || 0} Registered ({evt.seats_available} seats left)</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <DollarSign className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="font-extrabold text-slate-700">Revenue: ${(evt.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onViewEvent(evt)}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-2 border border-slate-200 hover:border-[#2E6F40] hover:text-[#2E6F40] rounded-xl text-xs font-bold text-slate-600 transition-colors cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </button>
                    
                    <button
                      onClick={() => handleDelete(evt.id)}
                      disabled={activeAction === `delete-${evt.id}`}
                      className="flex-1 flex items-center justify-center space-x-1.5 py-2 border border-rose-100 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-xs font-bold text-rose-500 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {activeAction === `delete-${evt.id}` ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 font-semibold text-sm flex flex-col items-center justify-center space-y-3">
            <Layers className="h-10 w-10 text-slate-300" />
            <p className="max-w-xs leading-relaxed">You haven't launched any events yet. Click 'Launch New Event' to begin!</p>
          </div>
        )}
      </div>

    </div>
  );
}
