import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
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
import PassVerificationPage from './components/PassVerificationPage';
import SSLCommerzHostedPage from './components/SSLCommerzHostedPage';
import { API_BASE_URL } from './config';

// ─── Public Layout Shell (Navbar + Footer wrapper) ───────────────────────────
// This component is used as the `element` for the public layout route.
// It renders Navbar, the matched child page via <Outlet />, and Footer.
function PublicLayout({ isLoggedIn, setIsLoggedIn, homepageData, selectedEvent, onOpenDetails, onCloseDetails }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-900 overflow-x-hidden">
      <div>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <div className="pt-16">
          {/* Child page is rendered here */}
          <Outlet context={{ homepageData, onOpenDetails }} />
        </div>
      </div>

      <Footer data={homepageData?.footer} />

      {selectedEvent && (
        <EventDetailsModal event={selectedEvent} onClose={onCloseDetails} />
      )}
    </div>
  );
}

// ─── Home Page assembled from sections ───────────────────────────────────────
function HomePage({ isLoggedIn, homepageData, onOpenDetails }) {
  return (
    <>
      <Hero
        isLoggedIn={isLoggedIn}
        data={homepageData?.hero}
        slider={homepageData?.slider}
      />
      <ExploreCategories data={homepageData?.top_categories} />
      <LatestEvents onViewDetails={onOpenDetails} data={homepageData?.latest_events} />
      <UpcomingEvents onViewDetails={onOpenDetails} data={homepageData?.upcoming_events} />
      <StatsCounter data={homepageData?.stats} />
    </>
  );
}

// ─── Main App Content ─────────────────────────────────────────────────────────
function AppContent({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [homepageData, setHomepageData] = useState(null);

  // Fetch homepage data once on mount
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

  // Auto-open event modal if ?id= is in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eventId = params.get('id') || params.get('event_id');
    if (eventId) {
      fetch(`${API_BASE_URL}/events?id=${eventId}`)
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => {
          if (data && data.length > 0) setSelectedEvent(data[0]);
        })
        .catch(err => {
          console.warn('Failed to load event details from query param', err);
        });
    }
  }, [location.search]);

  const handleOpenDetails = (event) => setSelectedEvent(event);

  const handleCloseDetails = () => {
    setSelectedEvent(null);
    const params = new URLSearchParams(window.location.search);
    if (params.has('id')) {
      params.delete('id');
      const newSearch = params.toString();
      const newPath = window.location.pathname + (newSearch ? `?${newSearch}` : '');
      window.history.replaceState(null, '', newPath);
    }
  };

  return (
    <Routes>
      {/* ── Full-screen pages: no Navbar / Footer ─────────────────────── */}
      <Route
        path="/dashboard"
        element={<DashboardLayout setIsLoggedIn={setIsLoggedIn} />}
      />
      <Route
        path="/organizer-dashboard"
        element={<OrganizerDashboardLayout setIsLoggedIn={setIsLoggedIn} />}
      />
      <Route
        path="/sslcommerz/hosted-checkout"
        element={<SSLCommerzHostedPage />}
      />

      {/* ── Public layout shell: all pages that share Navbar + Footer ─── */}
      <Route
        element={
          <PublicLayout
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
            homepageData={homepageData}
            selectedEvent={selectedEvent}
            onOpenDetails={handleOpenDetails}
            onCloseDetails={handleCloseDetails}
          />
        }
      >
        <Route
          path="/"
          element={
            <HomePage
              isLoggedIn={isLoggedIn}
              homepageData={homepageData}
              onOpenDetails={handleOpenDetails}
            />
          }
        />
        <Route path="/events" element={<EventsPage onViewDetails={handleOpenDetails} />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/certificate-verification" element={<CertificateVerificationPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignupPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/pass/verify" element={<PassVerificationPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('token') !== null;
  });

  return <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />;
}
