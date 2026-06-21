import { 
  Calendar, 
  Hourglass, 
  Ticket, 
  Award, 
  Clock, 
  Bell, 
  ShieldAlert,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export default function DashboardHome({ 
  stats, 
  activities, 
  reminders, 
  user,
  setActiveTab 
}) {
  
  // Format Date for activities
  const formatTimeAgo = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) return `${diffMins <= 0 ? 'Just now' : `${diffMins}m ago`}`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const statCards = [
    { 
      title: 'Registered Events', 
      value: stats?.total_registrations ?? 0, 
      desc: 'Total event signups', 
      icon: Calendar, 
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-500/10',
      tab: 'registrations'
    },
    { 
      title: 'Upcoming Events', 
      value: stats?.upcoming_events ?? 0, 
      desc: 'Active registrations', 
      icon: Hourglass, 
      color: 'from-blue-500 to-indigo-600',
      shadow: 'shadow-blue-500/10',
      tab: 'registrations'
    },
    { 
      title: 'Event Passes', 
      value: stats?.event_passes ?? 0, 
      desc: 'Active digital passes', 
      icon: Ticket, 
      color: 'from-amber-500 to-orange-600',
      shadow: 'shadow-amber-500/10',
      tab: 'passes'
    },
    { 
      title: 'Certificates Earned', 
      value: stats?.certificates_earned ?? 0, 
      desc: 'Verified accomplishments', 
      icon: Award, 
      color: 'from-purple-500 to-pink-600',
      shadow: 'shadow-purple-500/10',
      tab: 'certificates'
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in font-outfit text-left">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0C3B2E] via-[#114E3C] to-[#2E6F40] p-8 sm:p-10 shadow-xl shadow-[#0C3B2E]/10">
        <div className="absolute top-1/4 -right-10 w-64 h-64 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-4 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Participant Panel</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome Back, {user?.name || 'User'}
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mt-2.5 text-justify">
            Manage your events, registrations, certificates, and account activities from your personalized Eventra dashboard. Keep track of schedules and access your passes easily.
          </p>
        </div>
      </div>

      {/* Reminders Banner Section */}
      {reminders && reminders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-slate-800">
            <Bell className="h-5 w-5 text-[#2E6F40] animate-bounce" />
            <h2 className="text-lg font-extrabold tracking-tight">Upcoming Schedule Reminders</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reminders.map((reminder) => (
              <div 
                key={reminder.id}
                onClick={() => setActiveTab('registrations')}
                className="flex items-start space-x-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/40 shadow-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group"
              >
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-700">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-amber-700 transition-colors">
                    {reminder.event_title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                    {reminder.message}
                  </p>
                </div>
                <span className="text-amber-600 font-black text-xs shrink-0 self-center tracking-wide group-hover:translate-x-1 transition-transform">
                  View Pass &rarr;
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => setActiveTab(card.tab)}
              className={`p-6 rounded-2xl bg-white border border-slate-100 shadow-md ${card.shadow} hover:shadow-lg hover:-translate-y-1 transform transition-all duration-300 cursor-pointer group`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{card.title}</p>
                  <p className="text-3xl font-black text-slate-800 group-hover:text-[#2E6F40] transition-colors">{card.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-md`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{card.desc}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-[#2E6F40] transition-all" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Activities Section */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-100 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-5 border-b border-slate-50">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">Recent Activities</h2>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Feed Log</span>
            </div>
            
            <div className="mt-5 space-y-5">
              {activities && activities.length > 0 ? (
                activities.map((act) => (
                  <div key={act.id} className="flex items-start space-x-4">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 shrink-0">
                      <Clock className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-xs font-bold text-[#2E6F40] uppercase tracking-wider">{act.action}</p>
                      <p className="text-sm font-semibold text-slate-700 mt-0.5 truncate">{act.description}</p>
                    </div>
                    <span className="text-xs text-slate-400 font-bold shrink-0 self-center">
                      {formatTimeAgo(act.created_at)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 font-semibold text-sm">
                  No recent activities recorded.
                </div>
              )}
            </div>
          </div>
          
          {activities && activities.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-50 text-center">
              <p className="text-xs text-slate-400 font-semibold">Your actions are fully audited and secure.</p>
            </div>
          )}
        </div>

        {/* Info / Quick Links Column */}
        <div className="space-y-6">
          
          {/* Profile Card Summary */}
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-md text-center flex flex-col items-center">
            <div className="relative">
              <img 
                src={user?.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'} 
                alt={user?.name} 
                className="h-20 w-20 rounded-full object-cover border-4 border-emerald-500/20 shadow-md"
              />
              <span className="absolute bottom-0 right-0 h-4.5 w-4.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            
            <h3 className="font-extrabold text-slate-800 text-base mt-4">{user?.name}</h3>
            <p className="text-xs text-slate-400 font-bold mt-0.5">{user?.email}</p>
            <p className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mt-3 inline-block uppercase tracking-wider">
              {user?.role || 'Participant'}
            </p>

            <button 
              onClick={() => setActiveTab('profile')}
              className="mt-6 w-full text-center py-2.5 px-4 rounded-xl text-xs font-bold border border-[#2E6F40] text-[#2E6F40] hover:bg-[#2E6F40] hover:text-white transition-all duration-300 cursor-pointer"
            >
              Edit Profile Info
            </button>
          </div>

          {/* Tips / Notice Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-3.5">
            <div className="flex items-center space-x-2 text-slate-700 font-bold text-sm">
              <ShieldAlert className="h-4.5 w-4.5 text-[#2E6F40]" />
              <span>Dashboard Safety Notice</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed text-justify font-semibold">
              Never share your **Registration Code** or **Security Tokens** with anyone. Entrance staff will only scan the QR Code on your digital pass to check you in.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
