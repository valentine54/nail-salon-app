// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import GallerySection from './components/GallerySection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import PricingAndBookingSection from './components/PricingAndBookingSection';
import LocationSection from './components/LocationSection';
import Footer from './components/Footer';
import WhatsAppFloat from "./components/WhatsAppFloat";
function HomePage() {
  return (
    <>
      <HeroSection />
      <GallerySection />
      <AboutSection />
      <ServicesSection />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>

        <div className="min-h-screen bg-ivory text-gray-800 font-serif">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/location" element={<LocationSection />} />
            <Route path="/booking" element={<PricingAndBookingSection />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
           <WhatsAppFloat />
        </div>

    </BrowserRouter>
  );
}

export default App;