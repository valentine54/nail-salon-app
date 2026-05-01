// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import Login from './pages/Login';
import TechDashboard from './pages/TechDashboard';
import Dashboard from './pages/Dashboard';
import SetPassword from './pages/SetPassword';
import AuthCallback from './pages/AuthCallback';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import GallerySection from './components/GallerySection';
import AboutSection from './components/AboutSection';
import ServicesSection from './components/ServicesSection';
import PricingAndBookingSection from './components/PricingAndBookingSection';
import LocationSection from './components/LocationSection';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
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
      <AuthProvider>
        <div className="min-h-screen bg-ivory text-gray-800 font-serif">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/location" element={<LocationSection />} />
            <Route path="/booking" element={<PricingAndBookingSection />} />
            <Route path="/login" element={<Login />} />

  <Route
    path="/dashboard"
    element={

        <TechDashboard />

    }
  />

  <Route
    path="/admin"
    element={

        <Dashboard />

    }
  />

            <Route path="/set-password" element={<SetPassword />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
           <WhatsAppFloat />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;