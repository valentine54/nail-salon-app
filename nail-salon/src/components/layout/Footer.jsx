import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-trendy-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif text-luxury-gold mb-4">LuxeNails</h3>
            <p className="text-gray-400 mb-4">
              Where artistry meets elegance. Experience premium nail care in a luxurious setting.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-luxury-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-luxury-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-luxury-gold transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-luxury-gold transition-colors">Home</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-luxury-gold transition-colors">Services</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-luxury-gold transition-colors">About Us</Link></li>
              <li><Link to="/booking" className="text-gray-400 hover:text-luxury-gold transition-colors">Book Now</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-luxury-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-luxury-gold flex-shrink-0 mt-1" />
                <span className="text-gray-400">123 Luxury Lane, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-luxury-gold" />
                <span className="text-gray-400">+254 700 000 000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-luxury-gold" />
                <span className="text-gray-400">info@luxenails.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Opening Hours</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-3">
                <Clock size={20} className="text-luxury-gold" />
                <span className="text-gray-400">Mon-Fri: 9am - 8pm</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={20} className="text-luxury-gold" />
                <span className="text-gray-400">Saturday: 10am - 6pm</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={20} className="text-luxury-gold" />
                <span className="text-gray-400">Sunday: 11am - 4pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} LuxeNails. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;