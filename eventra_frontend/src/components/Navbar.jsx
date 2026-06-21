import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, CheckCheck, Trash2, Info, Calendar, Award, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';
import { API_BASE_URL } from '../config';

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showMobileNotifDropdown, setShowMobileNotifDropdown] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);

  // Separate refs for desktop and mobile dropdowns
  const desktopNotifRef = useRef(null);
  const mobileNotifRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Re-read user from localStorage whenever isLoggedIn changes
  const user = useMemo(() => {
    if (!isLoggedIn) return null;
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, [isLoggedIn]);

  const isAdmin = isLoggedIn && user?.role === 'admin';
  const token = isLoggedIn ? localStorage.getItem('token') : null;

  // Stable fetch function using useCallback
  const fetchNotifications = useCallback(() => {
    if (!token || isAdmin) return;
    setNotifLoading(true);
    fetch(`${API_BASE_URL}/user/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed');
        return res.json();
      })
      .then(data => {
        setNotifications(Array.isArray(data) ? data : []);
        setNotifLoading(false);
      })
      .catch(() => {
        setNotifications([]);
        setNotifLoading(false);
      });
  }, [token, isAdmin]);

  // Initial fetch + polling every 60s
  useEffect(() => {
    if (!isLoggedIn || isAdmin) {
      Promise.resolve().then(() => setNotifications([]));
      return;
    }
    Promise.resolve().then(() => fetchNotifications());
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [isLoggedIn, isAdmin, fetchNotifications]);

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (desktopNotifRef.current && !desktopNotifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (mobileNotifRef.current && !mobileNotifRef.current.contains(e.target)) {
        setShowMobileNotifDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkRead = (id, e) => {
    e.stopPropagation();
    fetch(`${API_BASE_URL}/user/notifications/${id}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    }).then(res => {
      if (res.ok) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      }
    }).catch(() => {});
  };

  const handleMarkAllRead = (e) => {
    if (e) e.stopPropagation();
    fetch(`${API_BASE_URL}/user/notifications/read-all`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    }).then(res => {
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      }
    }).catch(() => {});
  };

  const handleDeleteNotif = (id, e) => {
    e.stopPropagation();
    fetch(`${API_BASE_URL}/user/notifications/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
    }).then(res => {
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    }).catch(() => {});
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'event':       return <Calendar    className="h-3.5 w-3.5 text-emerald-600" />;
      case 'certificate': return <Award       className="h-3.5 w-3.5 text-purple-500" />;
      case 'warning':     return <AlertCircle className="h-3.5 w-3.5 text-amber-500" />;
      default:            return <Info        className="h-3.5 w-3.5 text-blue-500"  />;
    }
  };

  const formatNotifDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleString('en-US', {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setNotifications([]);
    setShowNotifDropdown(false);
    setShowMobileNotifDropdown(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleNavLinkClick = (e, name) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const routes = {
      'Home': '/',
      'Events': '/events',
      'Services': '/services',
      'Certificate Verification': '/certificate-verification',
      'About Us': '/about-us',
      'Contact': '/contact-us',
    };
    if (name === 'Dashboard') {
      if (isAdmin) {
        window.location.assign('http://localhost:8000/admin');
      } else if (user?.role === 'organizer') {
        navigate('/organizer-dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    if (routes[name]) {
      navigate(routes[name]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Home',                     href: '/' },
    { name: 'Events',                   href: '/events' },
    { name: 'Services',                 href: '/services' },
    { name: 'Certificate Verification', href: '/certificate-verification' },
    { name: 'About Us',                 href: '/about-us' },
    { name: 'Contact',                  href: '/contact-us' },
    ...(isLoggedIn ? [{ name: 'Dashboard', href: isAdmin ? 'http://localhost:8000/admin' : (user?.role === 'organizer' ? '/organizer-dashboard' : '/dashboard') }] : []),
  ];

  const isActivePath = (linkName) => {
    const map = {
      'Home':                     '/',
      'Events':                   '/events',
      'Services':                 '/services',
      'Certificate Verification': '/certificate-verification',
      'About Us':                 '/about-us',
      'Contact':                  '/contact-us',
      'Dashboard':                user?.role === 'organizer' ? '/organizer-dashboard' : '/dashboard',
    };
    return location.pathname === map[linkName];
  };

  // NotifDropdown removed from inside Navbar component

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#E5E7EB]/90 backdrop-blur-md text-[#2E6F40] shadow-md shadow-[#2E6F40]/5 font-outfit transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <div className="flex items-center space-x-3 shrink-0">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center space-x-2.5 group"
            >
              <img
                src={logo}
                alt="Eventra Logo"
                className="h-10 w-auto object-contain transition-all duration-300 group-hover:scale-105 group-hover:rotate-3"
              />
              <span className="text-2xl font-black tracking-widest font-outfit bg-gradient-to-r from-[#2E6F40] to-emerald-500 bg-clip-text text-transparent group-hover:from-emerald-700 group-hover:to-emerald-400 transition-all duration-300">
                EVENTRA
              </span>
            </a>
          </div>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex items-center space-x-6 text-sm font-bold tracking-wide">
              {navLinks.map((link) => {
                const active = isActivePath(link.name);
                return (
                  <li key={link.name}>
                    <button
                      onClick={(e) => handleNavLinkClick(e, link.name)}
                      className={`relative py-2 transition-colors duration-300 hover:text-[#2E6F40]/80 group block cursor-pointer text-left font-bold ${
                        active ? 'text-[#2E6F40]' : ''
                      }`}
                    >
                      {link.name}
                      <span className={`absolute bottom-0 left-0 h-[3px] rounded-full bg-[#2E6F40] transition-all duration-300 ${
                        active ? 'w-full' : 'w-0 group-hover:w-full'
                      }`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ── Desktop Right: Bell + Auth ── */}
          <div className="hidden md:flex items-center space-x-3">

            {/* Notification Bell (non-admin logged-in users) */}
            {isLoggedIn && !isAdmin && (
              <div className="relative" ref={desktopNotifRef}>
                <button
                  id="navbar-notification-bell"
                  onClick={() => {
                    const next = !showNotifDropdown;
                    setShowNotifDropdown(next);
                    if (next) fetchNotifications();
                  }}
                  className="relative p-2 rounded-full hover:bg-[#2E6F40]/10 text-[#2E6F40] transition-all duration-200 cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white border border-white shadow-sm animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <NotifDropdown
                    isMobile={false}
                    unreadCount={unreadCount}
                    notifLoading={notifLoading}
                    notifications={notifications}
                    getNotifIcon={getNotifIcon}
                    formatNotifDate={formatNotifDate}
                    handleMarkRead={handleMarkRead}
                    handleMarkAllRead={handleMarkAllRead}
                    handleDeleteNotif={handleDeleteNotif}
                    setShowNotifDropdown={setShowNotifDropdown}
                    setShowMobileNotifDropdown={setShowMobileNotifDropdown}
                    navigate={navigate}
                    user={user}
                  />
                )}
              </div>
            )}

            {/* Logout / Login */}
            <button
              onClick={() => isLoggedIn ? handleLogout() : navigate('/login')}
              className="text-xs font-extrabold py-2.5 px-6 rounded-full border border-[#2E6F40] text-[#2E6F40] hover:bg-[#2E6F40] hover:text-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer transform active:scale-95"
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>

            {!isLoggedIn && (
              <button
                onClick={() => navigate('/signup')}
                className="text-xs font-extrabold py-2.5 px-6 rounded-full bg-gradient-to-r from-[#2E6F40] to-emerald-600 hover:from-emerald-700 hover:to-[#2E6F40] text-white shadow-md hover:shadow-[0_10px_20px_-5px_rgba(46,111,64,0.3)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer transform active:scale-95"
              >
                Sign Up
              </button>
            )}
          </div>

          {/* ── Mobile Right: Bell + Hamburger ── */}
          <div className="md:hidden flex items-center space-x-1">

            {/* Mobile Notification Bell */}
            {isLoggedIn && !isAdmin && (
              <div className="relative" ref={mobileNotifRef}>
                <button
                  onClick={() => {
                    const next = !showMobileNotifDropdown;
                    setShowMobileNotifDropdown(next);
                    if (next) fetchNotifications();
                  }}
                  className="relative p-2 rounded-full hover:bg-[#2E6F40]/10 text-[#2E6F40] transition-all duration-200 cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white border border-white shadow-sm">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showMobileNotifDropdown && (
                  <NotifDropdown
                    isMobile={true}
                    unreadCount={unreadCount}
                    notifLoading={notifLoading}
                    notifications={notifications}
                    getNotifIcon={getNotifIcon}
                    formatNotifDate={formatNotifDate}
                    handleMarkRead={handleMarkRead}
                    handleMarkAllRead={handleMarkAllRead}
                    handleDeleteNotif={handleDeleteNotif}
                    setShowNotifDropdown={setShowNotifDropdown}
                    setShowMobileNotifDropdown={setShowMobileNotifDropdown}
                    navigate={navigate}
                    user={user}
                  />
                )}
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl hover:bg-white/40 focus:outline-none transition-colors duration-300"
            >
              {isMobileMenuOpen
                ? <X    className="h-6 w-6 text-[#2E6F40]" />
                : <Menu className="h-6 w-6 text-[#2E6F40]" />
              }
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#E5E7EB]/95 backdrop-blur-lg border-t border-[#2E6F40]/10 px-4 pt-4 pb-8 space-y-6 shadow-inner animate-fade-in">
          <ul className="flex flex-col space-y-3 font-bold text-[#2E6F40] pl-2 text-left">
            {navLinks.map((link) => {
              const active = isActivePath(link.name);
              return (
                <li key={link.name}>
                  <button
                    onClick={(e) => handleNavLinkClick(e, link.name)}
                    className={`block w-full py-2.5 border-b border-[#2E6F40]/5 hover:text-emerald-800 transition-colors text-left font-bold cursor-pointer ${
                      active ? 'text-emerald-800 pl-2 border-l-2 border-[#2E6F40]' : ''
                    }`}
                  >
                    {link.name}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col space-y-3 pt-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                isLoggedIn ? handleLogout() : navigate('/login');
              }}
              className="w-full py-3 px-5 rounded-full border border-[#2E6F40] text-[#2E6F40] hover:bg-[#2E6F40] hover:text-white font-extrabold text-center text-sm transition-all"
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
            {!isLoggedIn && (
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }}
                className="w-full py-3 px-6 bg-gradient-to-r from-[#2E6F40] to-emerald-600 text-white font-extrabold text-center text-sm rounded-full shadow-md transition-all"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      )}

      {/* Premium bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-emerald-500/10 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#2E6F40]/70 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 right-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#CFFFDC] to-transparent pointer-events-none" />
    </nav>
  );
}

function NotifDropdown({
  isMobile = false,
  unreadCount,
  notifLoading,
  notifications,
  getNotifIcon,
  formatNotifDate,
  handleMarkRead,
  handleMarkAllRead,
  handleDeleteNotif,
  setShowNotifDropdown,
  setShowMobileNotifDropdown,
  navigate
}) {
  const handleClose = () => {
    if (isMobile) {
      setShowMobileNotifDropdown(false);
    } else {
      setShowNotifDropdown(false);
    }
  };

  return (
    <div
      className={`absolute right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[999] ${
        isMobile ? 'w-72' : 'w-80 sm:w-96'
      } animate-[fadeSlideDown_0.2s_ease-out]`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#0C3B2E] to-emerald-900">
        <div className="flex items-center space-x-2">
          <Bell className="h-4 w-4 text-emerald-300" />
          <span className="text-sm font-extrabold text-white tracking-wide">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded-full leading-none">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMarkAllRead(e);
            }}
            className="flex items-center space-x-1 text-xs text-emerald-300 hover:text-white transition-colors cursor-pointer font-bold"
            title="Mark all as read"
          >
            <CheckCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Read All</span>
          </button>
        )}
      </div>

      {/* List Content */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
        {notifLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-start space-x-3 animate-pulse">
                <div className="h-7 w-7 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2 py-0.5">
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-2">
              <Bell className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold text-slate-500">All caught up!</p>
            <p className="text-[10px] text-slate-400 mt-0.5">No notifications at the moment.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={(e) => {
                if (!notif.is_read) {
                  handleMarkRead(notif.id, e);
                }
                if (notif.type?.toLowerCase().includes('event') && notif.data?.event_id) {
                  navigate(`/events/${notif.data.event_id}`);
                  handleClose();
                } else if (notif.type?.toLowerCase().includes('certificate')) {
                  navigate('/certificate-verification');
                  handleClose();
                }
              }}
              className={`flex items-start p-4 hover:bg-slate-50 transition-colors gap-3 relative group cursor-pointer ${
                !notif.is_read ? 'bg-emerald-50/20' : ''
              }`}
            >
              {/* Unread dot */}
              {!notif.is_read && (
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-emerald-600" />
              )}

              {/* Icon */}
              <div className="p-1.5 rounded-lg bg-slate-50 shrink-0">
                {getNotifIcon(notif.type)}
              </div>

              {/* Title & Message */}
              <div className="flex-1 min-w-0 pr-12">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {notif.title || 'Notification'}
                </p>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words line-clamp-2">
                  {notif.message}
                </p>
                <span className="text-[9px] font-medium text-slate-400 mt-1 block">
                  {formatNotifDate(notif.created_at)}
                </span>
              </div>

              {/* Action Buttons (visible on hover) */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 bg-white/95 p-1 rounded-lg shadow-sm border border-slate-100">
                {!notif.is_read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkRead(notif.id, e);
                    }}
                    className="p-1 rounded hover:bg-slate-100 text-emerald-600 transition-colors cursor-pointer"
                    title="Mark as read"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNotif(notif.id, e);
                  }}
                  className="p-1 rounded hover:bg-rose-50 text-rose-500 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
