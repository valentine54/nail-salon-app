import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Clock } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Sparkles className="w-8 h-8 text-luxury-gold" />,
      title: "Premium Products",
      description: "We use only the highest quality, cruelty-free products for lasting beauty."
    },
    {
      icon: <Shield className="w-8 h-8 text-luxury-gold" />,
      title: "Hygiene First",
      description: "Sterilized equipment and sanitary protocols for your safety."
    },
    {
      icon: <Clock className="w-8 h-8 text-luxury-gold" />,
      title: "Flexible Hours",
      description: "Early morning and evening appointments available."
    }
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500",
    "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500",
    "https://images.unsplash.com/photo-1610992015732-2449b0bb0a86?w=500",
    "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=500",
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1582095133179-bfd8e2fc6a00?w=1600"
            alt="Luxury Nail Salon"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative text-center text-white px-6"
        >
          <h1 className="text-5xl md:text-7xl font-serif mb-6">
            Where Art Meets
            <span className="block text-luxury-gold">Elegance</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            Experience premium nail artistry in a sanctuary of luxury and style
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" className="btn-primary">
              Book Appointment
            </Link>
            <Link to="/services" className="btn-secondary text-white border-white hover:bg-white hover:text-trendy-black">
              Explore Services
            </Link>
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-4">
              Why Choose <span className="text-luxury-gold">LuxeNails</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of luxury and professionalism
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center p-8 rounded-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 bg-luxury-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-4">
              Our <span className="text-luxury-gold">Masterpieces</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse through our latest creations and get inspired
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group overflow-hidden rounded-lg aspect-square"
              >
                <img
                  src={img}
                  alt={`Nail Art ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Sparkles className="text-white w-8 h-8" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/gallery" className="btn-secondary inline-flex items-center gap-2">
              View Full Gallery <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-luxury-gold to-trendy-hot-pink text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center px-6"
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Ready for the Ultimate Nail Experience?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Book your appointment today and let us pamper you
          </p>
          <Link
            to="/booking"
            className="bg-white text-trendy-black px-10 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300 inline-flex items-center gap-2 text-lg"
          >
            Schedule Now <ArrowRight size={24} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;