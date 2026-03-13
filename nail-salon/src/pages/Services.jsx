import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Heart, Award, Clock } from 'lucide-react';

const Services = () => {
  const serviceCategories = [
    {
      category: "Manicure",
      icon: <Sparkles className="w-6 h-6" />,
      services: [
        { name: "Classic Manicure", price: "KES 2,500", duration: "45 min", description: "Nail shaping, cuticle care, and polish" },
        { name: "Gel Manicure", price: "KES 3,500", duration: "60 min", description: "Long-lasting gel polish with perfect shine" },
        { name: "French Manicure", price: "KES 3,000", duration: "50 min", description: "Classic elegant white tips" },
        { name: "Paraffin Treatment", price: "KES 4,000", duration: "75 min", description: "Deep moisturizing paraffin wax treatment" },
      ]
    },
    {
      category: "Pedicure",
      icon: <Heart className="w-6 h-6" />,
      services: [
        { name: "Spa Pedicure", price: "KES 3,500", duration: "60 min", description: "Relaxing foot soak with essential oils" },
        { name: "Luxury Pedicure", price: "KES 5,000", duration: "90 min", description: "Exfoliating scrub, mask, and hot stone massage" },
        { name: "Gel Pedicure", price: "KES 4,500", duration: "75 min", description: "Long-lasting gel polish for toes" },
      ]
    },
    {
      category: "Nail Enhancements",
      icon: <Award className="w-6 h-6" />,
      services: [
        { name: "Acrylic Full Set", price: "KES 4,500", duration: "90 min", description: "Durable acrylic extensions" },
        { name: "Acrylic Fill", price: "KES 3,000", duration: "60 min", description: "Maintenance for existing acrylics" },
        { name: "Gel Extensions", price: "KES 5,000", duration: "105 min", description: "Lightweight gel nail extensions" },
        { name: "Dip Powder", price: "KES 4,000", duration: "75 min", description: "Odorless, long-lasting alternative" },
      ]
    },
    {
      category: "Nail Art",
      icon: <Sparkles className="w-6 h-6" />,
      services: [
        { name: "Basic Nail Art", price: "KES 500+", duration: "15 min", description: "Simple designs per nail" },
        { name: "Premium Art", price: "KES 1,000+", duration: "30 min", description: "Intricate designs and patterns" },
        { name: "3D Embellishments", price: "KES 1,500+", duration: "45 min", description: "Rhinestones, pearls, and charms" },
      ]
    }
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-luxury-ivory to-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif mb-6"
          >
            Our <span className="text-luxury-gold">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            From classic elegance to trendy designs, we offer a complete range of nail services
            tailored to your preferences.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {serviceCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
            className="mb-16 last:mb-0"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-luxury-gold/10 rounded-full text-luxury-gold">
                {category.icon}
              </div>
              <h2 className="text-3xl font-serif">{category.category}</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.services.map((service, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-luxury-gold">
                      {service.price}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock size={16} />
                      <span>{service.duration}</span>
                    </div>
                  </div>
                  <Link
                    to="/booking"
                    className="block text-center border-2 border-luxury-gold text-luxury-gold py-2 rounded-lg hover:bg-luxury-gold hover:text-white transition-colors duration-300"
                  >
                    Book Now
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </section>

      {/* Packages Section */}
      <section className="bg-gradient-to-r from-luxury-gold/10 to-trendy-hot-pink/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif mb-4">Special <span className="text-luxury-gold">Packages</span></h2>
            <p className="text-gray-600">Save more with our curated packages</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Bridal Package",
                price: "KES 15,000",
                includes: ["Manicure", "Pedicure", "Nail Art", "Consultation"],
                popular: true
              },
              {
                name: "Spa Day",
                price: "KES 12,000",
                includes: ["Luxury Pedicure", "Gel Manicure", "Paraffin Treatment"],
                popular: false
              },
              {
                name: "Group Booking",
                price: "KES 8,000/person",
                includes: ["Any 2 Services", "Champagne", "Group Discount"],
                popular: false
              }
            ].map((pkg, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-lg shadow-xl overflow-hidden ${
                  pkg.popular ? 'ring-2 ring-luxury-gold transform scale-105' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="bg-luxury-gold text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-serif mb-2">{pkg.name}</h3>
                  <p className="text-3xl font-bold text-luxury-gold mb-6">{pkg.price}</p>
                  <ul className="space-y-3 mb-8">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Sparkles size={16} className="text-luxury-gold" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/booking"
                    className="block text-center bg-luxury-gold text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Book Package
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;