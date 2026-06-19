import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  })();
  const isAdmin = isLoggedIn && user?.role === 'admin';

  const handleNavLinkClick = (e, name, href) => {
    e.preventDefault();
    if (name === 'Home') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (name === 'Events') {
      navigate('/events');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (name === 'Services') {
      navigate('/services');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (name === 'Certificate Verification') {
      navigate('/certificate-verification');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (name === 'About Us') {
      navigate('/about-us');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (name === 'Contact') {
      navigate('/contact-us');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (name === 'Dashboard') {
      window.location.assign('http://localhost:8000/admin');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Services', href: '/services' },
    { name: 'Certificate Verification', href: '/certificate-verification' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Contact', href: '/contact-us' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Dashboard', href: 'http://localhost:8000/admin' });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#E5E7EB]/90 backdrop-blur-md text-[#2E6F40] shadow-md shadow-[#2E6F40]/5 font-outfit transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left Side: Brand Logo */}
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

          {/* Center: Navigation Links & Search Bar */}
          <div className="hidden md:flex items-center space-x-8">
            <ul className="flex items-center space-x-6 text-sm font-bold tracking-wide">
              {navLinks.map((link) => {
                const isActive = (link.name === 'Home' && location.pathname === '/') || 
                                 (link.name === 'Events' && location.pathname === '/events') ||
                                 (link.name === 'Services' && location.pathname === '/services') ||
                                 (link.name === 'Certificate Verification' && location.pathname === '/certificate-verification') ||
                                 (link.name === 'About Us' && location.pathname === '/about-us') ||
                                 (link.name === 'Contact' && location.pathname === '/contact-us');
                return (
                  <li key={link.name}>
                    <button
                      onClick={(e) => handleNavLinkClick(e, link.name, link.href)}
                      className={`relative py-2 transition-colors duration-300 hover:text-[#2E6F40]/80 group block cursor-pointer text-left font-bold ${
                        isActive ? 'text-[#2E6F40]' : ''
                      }`}
                    >
                      {link.name}
                      <span className={`absolute bottom-0 left-0 h-[3px] rounded-full bg-[#2E6F40] transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}></span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Side: Authentication */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => {
                if (isLoggedIn) {
                  setIsLoggedIn(false);
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  navigate('/');
                } else {
                  window.open('/login', '_blank');
                }
              }}
              className="text-xs font-extrabold py-2.5 px-6 rounded-full border border-[#2E6F40] text-[#2E6F40] hover:bg-[#2E6F40] hover:text-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer transform active:scale-95"
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="text-xs font-extrabold py-2.5 px-6 rounded-full bg-gradient-to-r from-[#2E6F40] to-emerald-600 hover:from-emerald-700 hover:to-[#2E6F40] text-white shadow-md hover:shadow-[0_10px_20px_-5px_rgba(46,111,64,0.3)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer transform active:scale-95"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-xl hover:bg-white/40 focus:outline-none transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-[#2E6F40]" />
              ) : (
                <Menu className="h-6 w-6 text-[#2E6F40]" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#E5E7EB]/95 backdrop-blur-lg border-t border-[#2E6F40]/10 px-4 pt-4 pb-8 space-y-6 shadow-inner animate-fade-in">
          {/* Navigation Links */}
          <ul className="flex flex-col space-y-3 font-bold text-[#2E6F40] pl-2 text-left">
            {navLinks.map((link) => {
              const isActive = (link.name === 'Home' && location.pathname === '/') || 
                               (link.name === 'Events' && location.pathname === '/events') ||
                               (link.name === 'Services' && location.pathname === '/services') ||
                               (link.name === 'Certificate Verification' && location.pathname === '/certificate-verification') ||
                               (link.name === 'About Us' && location.pathname === '/about-us') ||
                               (link.name === 'Contact' && location.pathname === '/contact-us');
              return (
                <li key={link.name}>
                  <button
                    onClick={(e) => {
                      handleNavLinkClick(e, link.name, link.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full py-2.5 border-b border-[#2E6F40]/5 hover:text-emerald-800 transition-colors text-left font-bold cursor-pointer ${
                      isActive ? 'text-emerald-800 pl-2 border-l-2 border-[#2E6F40]' : ''
                    }`}
                  >
                    {link.name}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Auth buttons for Mobile */}
          <div className="flex flex-col space-y-3 pt-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (isLoggedIn) {
                  setIsLoggedIn(false);
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  navigate('/');
                } else {
                  window.open('/login', '_blank');
                }
              }}
              className="w-full py-3 px-5 rounded-full border border-[#2E6F40] text-[#2E6F40] hover:bg-[#2E6F40] hover:text-white font-extrabold text-center text-sm transition-all"
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate('/signup');
              }}
              className="w-full py-3 px-6 bg-gradient-to-r from-[#2E6F40] to-emerald-600 text-white font-extrabold text-center text-sm rounded-full shadow-md transition-all"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}

      {/* Premium bottom border (subtle green outline + glowing brand gradient with mint highlight) */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-emerald-500/10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-[#2E6F40]/70 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 right-1/3 h-[1px] bg-gradient-to-r from-transparent via-[#CFFFDC] to-transparent pointer-events-none"></div>
    </nav>
  );
}
