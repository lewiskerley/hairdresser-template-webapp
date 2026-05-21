import { useState } from 'react';
import { useQueryParams } from './hooks/useQueryParams';
import { SiteConfigProvider } from './context/SiteConfigContext';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Services from './components/Services';
import Gallery from './components/Gallery';
import About from './components/About';
import MapSection from './components/MapSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import AdminPage from './components/AdminPage';

export default function App() {
  const { config, isAdmin } = useQueryParams();
  const [bookingOpen, setBookingOpen] = useState(false);

  if (isAdmin) return <AdminPage />;

  return (
    <SiteConfigProvider config={config}>
      <div style={{ minHeight: '100vh' }}>
        <Nav onBookNow={() => setBookingOpen(true)} />
        <Hero onBookNow={() => setBookingOpen(true)} />
        <Services onBookNow={() => setBookingOpen(true)} />
        <Gallery />
        <About />
        <MapSection />
        <Contact onBookNow={() => setBookingOpen(true)} />
        <Footer />
        <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
      </div>
    </SiteConfigProvider>
  );
}
