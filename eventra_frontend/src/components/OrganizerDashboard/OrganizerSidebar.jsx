import { 
  LayoutDashboard, 
  PlusCircle, 
  Calendar, 
  Users, 
  Mic, 
  Award, 
  DollarSign, 
  BarChart3, 
  Bell, 
  User, 
  Settings, 
  ExternalLink, 
  LogOut,
  X
} from 'lucide-react';
import logo from '../../assets/logo.png';

export default function OrganizerSidebar({ 
  activeTab, 
  setActiveTab, 
  onCloseMobile, 
  handleLogout,
  unreadCount 
}) {
  const menuItems = [
    { id: 'dashboard',      name: 'Dashboard',        icon: LayoutDashboard },
    { id: 'launch-event',   name: 'Launch Event',     icon: PlusCircle },
    { id: 'my-events',      name: 'My Events',        icon: Calendar },
    { id: 'participants',   name: 'Participants',     icon: Users },
    { id: 'speakers',       name: 'Speakers',         icon: Mic },
    { id: 'certificates',   name: 'Certificates',     icon: Award },
    { id: 'revenue',        name: 'Revenue & Payments', icon: DollarSign },
    { id: 'analytics',      name: 'Event Analytics',  icon: BarChart3 },
    { id: 'notifications',  name: 'Notifications',     icon: Bell, badge: true },
    { id: 'profile',        name: 'My Profile',        icon: User },
    { id: 'settings',       name: 'Account Settings',  icon: Settings },
  ];

  return (
    <div className="h-full flex flex-col justify-between bg-[#0C3B2E] text-white font-outfit select-none">
      
      <div>
        {/* Branding header */}
        <div className="p-6 border-b border-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={logo} 
              alt="Eventra Logo" 
              className="h-9 w-auto filter brightness-0 invert"
            />
            <span className="text-xl font-black tracking-widest bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
              EVENTRA
            </span>
          </div>
          {onCloseMobile && (
            <button 
              onClick={onCloseMobile} 
              className="p-1 rounded-lg hover:bg-emerald-900/30 lg:hidden text-emerald-200 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Visit Live Website Button */}
        <div className="mx-4 mt-4 mb-1">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-emerald-800/40 border border-emerald-700/40 hover:bg-emerald-700/40 hover:border-emerald-500/50 transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
              <span className="text-xs font-bold text-emerald-200 group-hover:text-white transition-colors">
                Visit Live Website
              </span>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-emerald-400 group-hover:text-white group-hover:scale-110 transition-all duration-200" />
          </a>
        </div>

        {/* Menu Items list */}
        <nav className="p-4 space-y-1 mt-2 overflow-y-auto max-h-[70vh]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 hover:pl-6 group cursor-pointer ${
                  isActive 
                    ? 'bg-[#2E6F40] text-white shadow-lg shadow-[#2E6F40]/20' 
                    : 'text-emerald-100/70 hover:bg-emerald-900/30 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-4.5 w-4.5 transition-transform duration-300 ${
                    isActive ? 'scale-110 text-white' : 'text-emerald-300 group-hover:scale-110'
                  }`} />
                  <span>{item.name}</span>
                </div>

                {item.badge && unreadCount > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout button footer */}
      <div className="p-4 border-t border-emerald-900/40">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3.5 px-4 py-3 text-rose-300 hover:text-white rounded-xl text-sm font-bold tracking-wide transition-all duration-300 hover:bg-rose-950/20 hover:pl-6 cursor-pointer group"
        >
          <LogOut className="h-4.5 w-4.5 text-rose-400 group-hover:scale-110 transition-transform duration-300" />
          <span>Logout</span>
        </button>
      </div>

    </div>
  );
}
