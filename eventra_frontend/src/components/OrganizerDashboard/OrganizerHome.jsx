import { 
  Calendar, 
  Users, 
  DollarSign, 
  Award, 
  TrendingUp, 
  Layers, 
  PlusCircle, 
  ArrowRight,
  ClipboardList
} from 'lucide-react';

export default function OrganizerHome({ stats, recentRegistrations, setActiveTab, user }) {
  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Events',
      value: stats.total_events || 0,
      icon: Layers,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      description: 'Total events created'
    },
    {
      title: 'Live Events',
      value: stats.live_events || 0,
      icon: TrendingUp,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      description: 'Currently active events'
    },
    {
      title: 'Upcoming Events',
      value: stats.upcoming_events || 0,
      icon: Calendar,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      description: 'Future scheduled events'
    },
    {
      title: 'Total Registrations',
      value: stats.total_registrations || 0,
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      description: 'Attendee bookings'
    },
    {
      title: 'Total Revenue',
      value: `$${(stats.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      description: 'Total event earnings'
    },
    {
      title: 'Certificates Issued',
      value: stats.certificates_issued || 0,
      icon: Award,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      description: 'Issued credentials'
    }
  ];

  return (
    <div className="space-y-8 font-outfit text-left animate-fade-in select-none">
      
      {/* ── Welcome Banner ── */}
      <div className="bg-gradient-to-r from-[#0C3B2E] via-[#114E3C] to-[#2E6F40] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-emerald-500/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none translate-x-20 -translate-y-20"></div>
        <div className="relative z-10 space-y-2">
          <span className="bg-[#CFFFDC] text-[#2E6F40] font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full inline-block shadow-sm">
            Organizer Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Welcome Back, {user?.name || 'Organizer'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/70 max-w-2xl font-light leading-relaxed">
            Manage your events, participants, registrations, certificates, and performance analytics from your Eventra Organizer Dashboard. Keep track of earnings and attendee lists dynamically.
          </p>
        </div>
      </div>

      {/* ── Quick Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <div 
            key={idx}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-start justify-between"
          >
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">{card.title}</span>
              <span className="text-xl sm:text-2xl font-black text-slate-800 block">{card.value}</span>
              <span className="text-[10px] text-slate-400 font-semibold block">{card.description}</span>
            </div>
            <div className={`p-3 rounded-xl ${card.color.split(' ')[1]} ${card.color.split(' ')[0]} border ${card.color.split(' ')[2]} shrink-0 shadow-2xs`}>
              <card.icon className="h-5.5 w-5.5 stroke-[2]" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Lower Section Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Recent Registrations (7/12 width) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-100 shadow-md p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-3 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ClipboardList className="h-5 w-5 text-[#2E6F40]" />
                <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Recent Registrations</h3>
              </div>
              <button 
                onClick={() => setActiveTab('participants')}
                className="text-xs font-bold text-[#2E6F40] hover:text-emerald-700 transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-50 overflow-x-auto">
              {recentRegistrations && recentRegistrations.length > 0 ? (
                recentRegistrations.map((reg) => (
                  <div key={reg.id} className="py-3.5 flex items-center justify-between text-xs font-semibold text-slate-600 gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-slate-800 text-sm truncate">{reg.participant_name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">Event: {reg.event_title}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono font-bold text-slate-700">{reg.registration_code}</p>
                      <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full mt-1 ${
                        reg.payment_status === 'paid' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {reg.payment_status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-400 font-semibold">
                  No recent registrations found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Actions Panel (5/12 width) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-100 shadow-md p-6 space-y-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight pb-3 border-b border-slate-50">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'Launch New Event', desc: 'Create and configure an event wizard', action: 'launch-event', icon: PlusCircle, bg: 'hover:bg-emerald-50/20 hover:border-emerald-500/30' },
              { title: 'View My Events', desc: 'Manage all created drafts & published events', action: 'my-events', icon: Calendar, bg: 'hover:bg-blue-50/20 hover:border-blue-500/30' },
              { title: 'Participant Check-in', desc: 'Verify passes and check-in attendees', action: 'participants', icon: Users, bg: 'hover:bg-rose-50/20 hover:border-rose-500/30' },
              { title: 'Issue Certificates', desc: 'Generate and send event credentials', action: 'certificates', icon: Award, bg: 'hover:bg-purple-50/20 hover:border-purple-500/30' },
            ].map((act, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(act.action)}
                className={`w-full flex items-center justify-between p-3.5 border border-slate-100 rounded-2xl text-left transition-all duration-300 cursor-pointer ${act.bg} group shadow-2xs hover:shadow-sm`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-slate-50 text-slate-500 group-hover:text-emerald-700 transition-colors">
                    <act.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-800 group-hover:text-[#2E6F40] transition-colors">{act.title}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate">{act.desc}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#2E6F40] group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
