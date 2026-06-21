import { useState } from 'react';
import { 
  Users, 
  Search, 
  Download, 
  Loader2, 
  QrCode
} from 'lucide-react';

export default function Participants({ 
  participants, 
  API_BASE_URL, 
  token, 
  onCheckInSuccess 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEvent, setFilterEvent] = useState('');
  const [activeAction, setActiveAction] = useState(null);

  // Extract unique events for filtering
  const uniqueEvents = Array.from(new Set(participants.map(p => p.event_title)));

  const handleCheckInToggle = (id) => {
    setActiveAction(id);
    fetch(`${API_BASE_URL}/organizer/registrations/${id}/check-in`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(async (res) => {
        const data = await res.json();
        setActiveAction(null);
        if (res.ok) {
          alert(data.message);
          onCheckInSuccess();
        } else {
          alert(data.message || 'Failed to update check-in status.');
        }
      })
      .catch((err) => {
        setActiveAction(null);
        console.error(err);
        alert('Network error. Failed to toggle check-in.');
      });
  };

  const getFilteredParticipants = () => {
    return participants.filter(p => {
      const matchesSearch = 
        p.participant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.participant_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.participant_phone.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesEvent = filterEvent === '' || p.event_title === filterEvent;

      return matchesSearch && matchesEvent;
    });
  };

  const exportData = (format) => {
    const dataToExport = getFilteredParticipants();
    if (dataToExport.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Registration Date', 'Event Name', 'Status'];
    const rows = dataToExport.map(p => [
      `"${p.participant_name.replace(/"/g, '""')}"`,
      `"${p.participant_email}"`,
      `"${p.participant_phone}"`,
      p.registration_date,
      `"${p.event_title.replace(/"/g, '""')}"`,
      p.ticket_status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eventra_participants_${format === 'excel' ? 'excel.csv' : 'export.csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = getFilteredParticipants();

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 font-outfit text-left animate-fade-in select-none">
      
      {/* Header */}
      <div className="pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Participant Directory & Check-in</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
            Search, filter, check-in attendees dynamically, and download CSV reports.
          </p>
        </div>
        
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => exportData('csv')}
            className="flex items-center space-x-1.5 py-2 px-3 border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 bg-white rounded-xl text-xs font-bold text-slate-600 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => exportData('excel')}
            className="flex items-center space-x-1.5 py-2 px-3 border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 bg-white rounded-xl text-xs font-bold text-slate-600 transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        
        {/* Search */}
        <div className="sm:col-span-2 relative group">
          <input 
            type="text" 
            placeholder="Search by name, email, or phone number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-[#2E6F40] transition-colors" />
        </div>

        {/* Filter Event Category */}
        <select
          value={filterEvent}
          onChange={(e) => setFilterEvent(e.target.value)}
          className="px-4 py-3 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#2E6F40]/20 focus:border-[#2E6F40] transition-all"
        >
          <option value="">All Hosted Events</option>
          {uniqueEvents.map((title, idx) => (
            <option key={idx} value={title}>{title}</option>
          ))}
        </select>

      </div>

      {/* Directory Table */}
      <div className="mt-8 overflow-x-auto select-text">
        {filtered.length > 0 ? (
          <table className="w-full border-collapse text-xs font-semibold text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="pb-3.5 pr-4">Attendee Info</th>
                <th className="pb-3.5 px-4">Contact Details</th>
                <th className="pb-3.5 px-4">Event Booked</th>
                <th className="pb-3.5 px-4">Reg Date</th>
                <th className="pb-3.5 px-4">Ticket Status</th>
                <th className="pb-3.5 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-4 pr-4">
                    <p className="font-extrabold text-slate-800 text-sm">{item.participant_name}</p>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 block">ID: #{item.id}</span>
                  </td>
                  <td className="py-4 px-4 font-mono">
                    <p className="text-slate-700">{item.participant_email}</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">{item.participant_phone || 'N/A'}</p>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800 max-w-[200px] truncate" title={item.event_title}>
                    {item.event_title}
                  </td>
                  <td className="py-4 px-4 text-slate-500">
                    {item.registration_date}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center space-x-1 text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${
                      item.ticket_status === 'Checked-in'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : (item.ticket_status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-blue-50 text-blue-700 border-blue-100')
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        item.ticket_status === 'Checked-in'
                          ? 'bg-emerald-500'
                          : (item.ticket_status === 'Cancelled' ? 'bg-rose-500' : 'bg-blue-500')
                      }`} />
                      <span>{item.ticket_status}</span>
                    </span>
                  </td>
                  <td className="py-4 pl-4 text-right">
                    {item.ticket_status !== 'Cancelled' ? (
                      <button
                        onClick={() => handleCheckInToggle(item.id)}
                        disabled={activeAction === item.id}
                        className={`inline-flex items-center space-x-1 py-1.5 px-3 border rounded-xl font-bold cursor-pointer transition-all hover:scale-102 ${
                          item.ticket_status === 'Checked-in'
                            ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {activeAction === item.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <QrCode className="h-3.5 w-3.5" />
                        )}
                        <span>{item.ticket_status === 'Checked-in' ? 'Cancel Check-in' : 'Mark Checked-in'}</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xxs font-extrabold uppercase italic">Booking Cancelled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center text-slate-400 font-semibold text-sm flex flex-col items-center justify-center space-y-2.5">
            <Users className="h-8 w-8 text-slate-300" />
            <p>No matching participants found.</p>
          </div>
        )}
      </div>

    </div>
  );
}
