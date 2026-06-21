import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExploreCategories from './components/ExploreCategories';
import LatestEvents from './components/LatestEvents';
import UpcomingEvents from './components/UpcomingEvents';
import StatsCounter from './components/StatsCounter';
import Footer from './components/Footer';
import EventDetailsModal from './components/EventDetailsModal';
import EventsPage from './components/EventsPage';
import ServicesPage from './components/ServicesPage';
import CertificateVerificationPage from './components/CertificateVerificationPage';
import AboutUsPage from './components/AboutUsPage';
import ContactUsPage from './components/ContactUsPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import OrganizerDashboardLayout from './components/OrganizerDashboard/OrganizerDashboardLayout';
import { API_BASE_URL } from './config';

function AppContent({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();
  const isDashboard = 
    location.pathname.replace(/\/$/, '') === '/dashboard' || 
    location.pathname.replace(/\/$/, '') === '/organizer-dashboard';
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [homepageData, setHomepageData] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/homepage`)
      .then(res => {
        if (!res.ok) throw new Error('API server error');
        return res.json();
      })
      .then(data => setHomepageData(data))
      .catch(err => {
        console.warn('API connection failed: using mock fallback data.', err);
      });
  }, []);

  const handleOpenDetails = (event) => setSelectedEvent(event);
  const handleCloseDetails = () => setSelectedEvent(null);

  // Dashboard: full-screen, no Navbar/Footer
  if (isDashboard) {
    return (
      <Routes>
        <Route path="/dashboard" element={
          <DashboardLayout setIsLoggedIn={setIsLoggedIn} />
        } />
        <Route path="/organizer-dashboard" element={
          <OrganizerDashboardLayout setIsLoggedIn={setIsLoggedIn} />
        } />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-900 overflow-x-hidden">
      <div>
        {/* Navigation Bar */}
        <Navbar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
        />

        <div className="pt-16">
          <Routes>
            <Route path="/" element={
              <>
                <Hero
                  isLoggedIn={isLoggedIn}
                  data={homepageData?.hero}
                  slider={homepageData?.slider}
                />
                <ExploreCategories data={homepageData?.top_categories} />
                <LatestEvents
                  onViewDetails={handleOpenDetails}
                  data={homepageData?.latest_events}
                />
                <UpcomingEvents
                  onViewDetails={handleOpenDetails}
                  data={homepageData?.upcoming_events}
                />
                <StatsCounter data={homepageData?.stats} />
              </>
            } />

            <Route path="/events" element={<EventsPage onViewDetails={handleOpenDetails} />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/certificate-verification" element={<CertificateVerificationPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<SignupPage setIsLoggedIn={setIsLoggedIn} />} />
          </Routes>
        </div>
      </div>

      {/* Footer */}
      <Footer data={homepageData?.footer} />

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('token') !== null;
  });

  return <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />;
}

