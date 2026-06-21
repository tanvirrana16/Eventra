import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Loader2, 
  AlertCircle,
  X,
  Ticket,
  Award
} from 'lucide-react';
import { API_BASE_URL } from '../../config';
import DashboardSidebar from './DashboardSidebar';
import DashboardHome from './DashboardHome';
import MyProfile from './MyProfile';
import MyRegistrations from './MyRegistrations';
import MyEventPasses from './MyEventPasses';
import PassDetailsModal from './PassDetailsModal';
import MyCertificates from './MyCertificates';
import CertificatePreviewModal from './CertificatePreviewModal';
import Notifications from './Notifications';
import AccountSettings from './AccountSettings';

export default function DashboardLayout({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  // Navigation & Sub-views Active State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Dashboard Unified Data States
  const [userProfile, setUserProfile] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [passes, setPasses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Modal / Detail States
  const [selectedPass, setSelectedPass] = useState(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedDetailEvent, setSelectedDetailEvent] = useState(null);

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState({
    registrations: [],
    passes: [],
    certificates: [],
    notifications: []
  });

  // Global Page Loading & Fetch Error Handling
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Auth Guard - redirect if no token
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // 2. Fetch all dashboard data from API endpoints
  const fetchAllDashboardData = useCallback(() => {
    if (!token) return;
    Promise.resolve().then(() => {
      setIsLoading(true);
      setErrorMsg('');
    });

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    const checkResponse = async (res) => {
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsLoggedIn(false);
          navigate('/login');
          throw new Error('session_expired');
        }
        throw new Error('api_error');
      }
      return res.json();
    };

    Promise.all([
      fetch(`${API_BASE_URL}/user/profile`, { headers }).then(checkResponse),
      fetch(`${API_BASE_URL}/user/dashboard`, { headers }).then(checkResponse),
      fetch(`${API_BASE_URL}/user/registrations`, { headers }).then(checkResponse),
      fetch(`${API_BASE_URL}/user/passes`, { headers }).then(checkResponse),
      fetch(`${API_BASE_URL}/user/certificates`, { headers }).then(checkResponse),
      fetch(`${API_BASE_URL}/user/notifications`, { headers }).then(checkResponse),
    ])
      .then(([profileData, statsData, regsData, passesData, certsData, notifData]) => {
        setUserProfile(profileData);
        
        // Handle stats + activities + reminders
        setDashboardStats(statsData.stats);
        setRecentActivities(statsData.recent_activities || []);
        setReminders(statsData.reminders || []);

        setRegistrations(regsData);
        setPasses(passesData);
        setCertificates(certsData);
        setNotifications(notifData);
        
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.message !== 'session_expired') {
          setErrorMsg('Failed to sync dashboard data with the API. Please ensure server connection.');
        }
        console.error('Dashboard synchronization error:', err);
      });
  }, [token, navigate, setIsLoggedIn]);

  useEffect(() => {
    fetchAllDashboardData();
  }, [fetchAllDashboardData]);

  // 3. User profile updating hook
  const handleProfileUpdate = (updatedUser) => {
    setUserProfile(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // 4. Logout trigger
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // 5. Notifications action handlers
  const handleMarkNotificationRead = (id) => {
    return fetch(`${API_BASE_URL}/user/notifications/${id}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        fetchAllDashboardData();
      });
  };

  const handleMarkAllNotificationsRead = () => {
    return fetch(`${API_BASE_URL}/user/notifications/read-all`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        fetchAllDashboardData();
      });
  };

  const handleDeleteNotification = (id) => {
    return fetch(`${API_BASE_URL}/user/notifications/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        fetchAllDashboardData();
      });
  };

  // 6. View Pass handler
  const handleViewPassDetails = (regId) => {
    const selected = passes.find(p => p.registration_id === regId);
    if (selected) {
      setSelectedPass(selected);
      setShowPassModal(true);
    }
  };

  // 7. View Certificate preview handler
  const handleViewCertificatePreview = (cert) => {
    setSelectedCertificate(cert);
    setShowCertificateModal(true);
  };

  // 8. Global Search Handler
  const handleGlobalSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults({ registrations: [], passes: [], certificates: [], notifications: [] });
      return;
    }

    const lowerQuery = query.toLowerCase();
    
    const filteredRegs = registrations.filter(r => r.event.title.toLowerCase().includes(lowerQuery));
    const filteredPasses = passes.filter(p => p.event_name.toLowerCase().includes(lowerQuery));
    const filteredCerts = certificates.filter(c => c.event_name.toLowerCase().includes(lowerQuery));
    const filteredNotifs = notifications.filter(n => n.title.toLowerCase().includes(lowerQuery) || n.message.toLowerCase().includes(lowerQuery));

    setSearchResults({
      registrations: filteredRegs,
      passes: filteredPasses,
      certificates: filteredCerts,
      notifications: filteredNotifs
    });
  };

  // Calculate total unread notifications
  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-outfit text-[#2E6F40] space-y-3">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="font-extrabold text-sm tracking-wide">Syncing Participant Dashboard...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-outfit p-4 text-center max-w-md mx-auto space-y-4">
        <AlertCircle className="h-12 w-12 text-rose-500" />
        <h3 className="text-xl font-extrabold text-slate-800">Connection Failed</h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold">{errorMsg}</p>
        <button 
          onClick={fetchAllDashboardData}
          className="py-2.5 px-6 rounded-full bg-[#2E6F40] text-white font-extrabold text-sm shadow-md hover:bg-emerald-800 transition-all cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Active view router mapping
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardHome 
            stats={dashboardStats} 
            activities={recentActivities} 
            reminders={reminders}
            user={userProfile}
            setActiveTab={setActiveTab}
          />
        );
      case 'profile':
        return (
          <MyProfile 
            user={userProfile} 
            onProfileUpdate={handleProfileUpdate}
            API_BASE_URL={API_BASE_URL}
            token={token}
          />
        );
      case 'registrations':
        return (
          <MyRegistrations 
            registrations={registrations} 
            onViewDetails={(event) => {
              // Wait, let's open details in a different way or pass event to open modal
              setSelectedDetailEvent(event);
            }}
            onViewPass={handleViewPassDetails}
            onCancelSuccess={fetchAllDashboardData}
            API_BASE_URL={API_BASE_URL}
            token={token}
          />
        );
      case 'passes':
        return (
          <MyEventPasses 
            passes={passes} 
            onViewFullPass={handleViewPassDetails}
          />
        );
      case 'certificates':
        return (
          <MyCertificates 
            certificates={certificates}
            onViewPreview={handleViewCertificatePreview}
          />
        );
      case 'notifications':
        return (
          <Notifications 
            notifications={notifications}
            onMarkRead={handleMarkNotificationRead}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onDelete={handleDeleteNotification}
          />
        );
      case 'settings':
        return (
          <AccountSettings 
            user={userProfile}
            onSettingsUpdate={handleProfileUpdate}
            API_BASE_URL={API_BASE_URL}
            token={token}
            handleLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-outfit relative">
      
      {/* 1. Large Screen Fixed Left Sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed top-0 left-0 bg-[#0C3B2E] border-r border-emerald-900/40 z-30">
        <DashboardSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          handleLogout={handleLogout}
          unreadCount={unreadCount}
        />
      </aside>

      {/* 2. Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay backdrop */}
          <div 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          ></div>
          
          <aside className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0C3B2E] animate-[slideRight_0.3s_ease-out] z-50">
            <DashboardSidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
              handleLogout={handleLogout}
              unreadCount={unreadCount}
            />
          </aside>
        </div>
      )}

      {/* 3. Main Dashboard Window */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Header Dashboard Nav */}
        <header className="bg-white border-b border-slate-100 h-16 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm shadow-slate-100/50">
          
          {/* Mobile hamburger & page label */}
          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-1.5 rounded-xl hover:bg-slate-50 lg:hidden text-slate-500 hover:text-slate-800 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-base font-extrabold text-slate-800 capitalize tracking-tight">
              {activeTab === 'dashboard' ? 'Overview' : activeTab.replace('-', ' ')}
            </span>
          </div>

          {/* Search & Profile */}
          <div className="flex items-center space-x-4">
            
            {/* Global Search trigger */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              title="Global Search"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            {/* Subtle divider */}
            <div className="h-6 w-[1.5px] bg-slate-100"></div>

            {/* Profile summary header */}
            <div 
              onClick={() => setActiveTab('profile')}
              className="flex items-center space-x-2.5 hover:opacity-85 transition-opacity cursor-pointer select-none"
            >
              <img
                src={userProfile?.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80'}
                alt={userProfile?.name}
                className="h-8 w-8 rounded-full object-cover border border-slate-100 shadow-sm"
              />
              <span className="text-xs font-bold text-slate-700 hidden sm:block truncate max-w-[100px]">
                {userProfile?.name?.split(' ')[0]}
              </span>
            </div>

          </div>

        </header>

        {/* Dynamic sub-view window container */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {renderActiveView()}
        </main>

      </div>

      {/* 4. Global Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-4 pt-16 animate-fade-in font-outfit text-left">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[70vh]">
            
            {/* Input bar */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="relative flex-1 max-w-xs sm:max-w-md group">
                <input
                  type="text"
                  autoFocus
                  placeholder="Global search registrations, passes, certificates..."
                  value={searchQuery}
                  onChange={handleGlobalSearch}
                  className="w-full pl-9 pr-4 py-2 border-none focus:outline-none text-slate-800 rounded-xl text-sm font-semibold"
                />
                <Search className="absolute left-1.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#2E6F40] transition-colors" />
              </div>
              <button 
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                  setSearchResults({ registrations: [], passes: [], certificates: [], notifications: [] });
                }}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Results display panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {searchQuery ? (
                <>
                  {/* Registrations */}
                  {searchResults.registrations.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black tracking-widest text-[#2E6F40] uppercase">Registrations</p>
                      {searchResults.registrations.map(r => (
                        <div 
                          key={r.id}
                          onClick={() => {
                            setSelectedDetailEvent(r.event);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div className="min-w-0 flex-1 pr-2">
                            <p className="text-xs font-bold text-slate-800 truncate">{r.event.title}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Code: {r.registration_code}</p>
                          </div>
                          <span className="text-[10px] font-black text-slate-400 group-hover:text-[#2E6F40] transition-colors">Details &rarr;</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Passes */}
                  {searchResults.passes.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black tracking-widest text-amber-600 uppercase">Event Passes</p>
                      {searchResults.passes.map(p => (
                        <div 
                          key={p.registration_id}
                          onClick={() => {
                            setSelectedPass(p);
                            setShowPassModal(true);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div className="min-w-0 flex-1 pr-2 flex items-center space-x-2">
                            <Ticket className="h-4 w-4 text-amber-500 shrink-0" />
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-800 truncate">{p.event_name}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{p.venue}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-slate-400">View Pass &rarr;</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Certificates */}
                  {searchResults.certificates.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black tracking-widest text-purple-600 uppercase">Certificates</p>
                      {searchResults.certificates.map(c => (
                        <div 
                          key={c.id}
                          onClick={() => {
                            setSelectedCertificate(c);
                            setShowCertificateModal(true);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <div className="min-w-0 flex-1 pr-2 flex items-center space-x-2">
                            <Award className="h-4 w-4 text-purple-500 shrink-0" />
                            <div className="truncate">
                              <p className="text-xs font-bold text-slate-800 truncate">{c.event_name}</p>
                              <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Code: {c.certificate_code}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-slate-400">View Preview &rarr;</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Notifications */}
                  {searchResults.notifications.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black tracking-widest text-blue-600 uppercase">Notifications</p>
                      {searchResults.notifications.map(n => (
                        <div 
                          key={n.id}
                          onClick={() => {
                            setActiveTab('notifications');
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-xl cursor-pointer transition-colors text-left"
                        >
                          <p className="text-xs font-bold text-slate-800">{n.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 truncate leading-relaxed">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* If nothing matches */}
                  {searchResults.registrations.length === 0 && 
                   searchResults.passes.length === 0 && 
                   searchResults.certificates.length === 0 && 
                   searchResults.notifications.length === 0 && (
                    <div className="py-12 text-center text-slate-400 font-semibold text-sm">
                      No matching records found.
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center text-slate-400 font-semibold text-xs uppercase tracking-wider select-none">
                  Begin typing to search your dashboard records...
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 5. Pass Details Boarding Pass Modal */}
      {showPassModal && selectedPass && (
        <PassDetailsModal 
          pass={selectedPass}
          onClose={() => {
            setShowPassModal(false);
            setSelectedPass(null);
          }}
        />
      )}

      {/* 6. Certificate Accomplishment Preview Modal */}
      {showCertificateModal && selectedCertificate && (
        <CertificatePreviewModal 
          cert={selectedCertificate}
          onClose={() => {
            setShowCertificateModal(false);
            setSelectedCertificate(null);
          }}
        />
      )}

      {/* 7. Fallback Event Details Popup (from global view) */}
      {selectedDetailEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full relative max-h-[90vh] flex flex-col">
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-extrabold text-slate-800 text-lg">{selectedDetailEvent.title}</h3>
                <button 
                  onClick={() => setSelectedDetailEvent(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <img 
                src={selectedDetailEvent.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&h=250&q=80'} 
                alt={selectedDetailEvent.title} 
                className="w-full h-44 object-cover rounded-xl shadow-inner"
              />
              <div className="space-y-2 text-xs font-semibold text-slate-600">
                <p><span className="font-bold text-slate-800">Date:</span> {selectedDetailEvent.dateText}</p>
                <p><span className="font-bold text-slate-800">Time:</span> {selectedDetailEvent.time}</p>
                <p><span className="font-bold text-slate-800">Venue:</span> {selectedDetailEvent.venue}</p>
                <p><span className="font-bold text-slate-800">Organizer:</span> {selectedDetailEvent.organizer?.name}</p>
                <p className="text-justify font-normal leading-relaxed pt-2 border-t border-slate-50">{selectedDetailEvent.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
