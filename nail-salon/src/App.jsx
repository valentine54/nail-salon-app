import { Routes, Route } from 'react-router-dom'
import { Link } from "react-router-dom"

import Header from './components/Header'
import HeroSection from './components/HeroSection'
import GallerySection from './components/GallerySection'
import AboutSection from './components/AboutSection'
import ServicesSection from './components/ServicesSection'
import PricingAndBookingSection from './components/PricingAndBookingSection'
import LocationSection from './components/LocationSection'
import Footer from './components/Footer'
// import Footer from './components/Footer'

function HomePage() {
  return (
    <>
      <HeroSection />
      <GallerySection />
      <AboutSection />
      <ServicesSection />
{/*       <PricingAndBookingSection /> */}
{/*       <ContactSection /> */}
    </>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-ivory text-gray-800 font-serif">
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/location" element={<LocationSection />} />
        <Route path="/booking" element={<PricingAndBookingSection />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App