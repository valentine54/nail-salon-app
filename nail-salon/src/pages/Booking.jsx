import { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CheckCircle } from 'lucide-react';

const Booking = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: new Date(),
    time: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const services = [
    "Gel Manicure - KES 3,500",
    "Acrylic Extensions - KES 4,500",
    "Spa Pedicure - KES 3,500",
    "Luxury Pedicure - KES 5,000",
    "Nail Art - From KES 500",
    "Bridal Package - KES 15,000",
  ];

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Booking submitted:", formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-gradient-to-br from-luxury-ivory to-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle className="w-24 h-24 text-luxury-gold mx-auto mb-6" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-serif mb-4"
          >
            Booking Confirmed!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-8"
          >
            Thank you for choosing LuxeNails. We'll send a confirmation to {formData.email}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <a 
              href="/" 
              className="btn-primary inline-block"
            >
              Return Home
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gradient-to-br from-luxury-ivory to-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-serif mb-4">
            Book Your <span className="text-luxury-gold">Appointment</span>
          </h1>
          <p className="text-xl text-gray-600">
            Choose your service and preferred time, and we'll take care of the rest
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex-1 text-center">
              <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-semibold mb-2
                ${step >= num ? 'bg-luxury-gold text-white' : 'bg-gray-200 text-gray-600'}`}>
                {num}
              </div>
              <p className={`text-sm ${step >= num ? 'text-luxury-gold' : 'text-gray-500'}`}>
                {num === 1 ? 'Service & Date' : num === 2 ? 'Your Details' : 'Confirm'}
              </p>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="text-luxury-gold" size={20} />
                    Select Service
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  >
                    <option value="">Choose a service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="text-luxury-gold" size={20} />
                    Select Date
                  </label>
                  <DatePicker
                    selected={formData.date}
                    onChange={(date) => setFormData({...formData, date})}
                    minDate={new Date()}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                    dateFormat="MMMM d, yyyy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
                    <Clock className="text-luxury-gold" size={20} />
                    Select Time
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setFormData({...formData, time})}
                        className={`p-3 border rounded-lg transition-all ${
                          formData.time === time
                            ? 'bg-luxury-gold text-white border-luxury-gold'
                            : 'hover:border-luxury-gold hover:text-luxury-gold'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-primary"
                    disabled={!formData.service || !formData.time}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="text-luxury-gold" size={20} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
                    <Mail className="text-luxury-gold" size={20} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
                    <Phone className="text-luxury-gold" size={20} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+254 XXX XXX XXX"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="text-luxury-gold" size={20} />
                    Special Requests (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any specific requirements or preferences?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
                  ></textarea>
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="btn-primary"
                    disabled={!formData.name || !formData.email || !formData.phone}
                  >
                    Review Booking
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-serif mb-6">Review Your Booking</h3>

                <div className="bg-luxury-ivory p-6 rounded-lg space-y-4">
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="font-semibold">Service:</span>
                    <span className="text-luxury-gold">{formData.service}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="font-semibold">Date:</span>
                    <span>{formData.date.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="font-semibold">Time:</span>
                    <span>{formData.time}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="font-semibold">Name:</span>
                    <span>{formData.name}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="font-semibold">Email:</span>
                    <span>{formData.email}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-gray-200">
                    <span className="font-semibold">Phone:</span>
                    <span>{formData.phone}</span>
                  </div>
                  {formData.notes && (
                    <div className="flex justify-between pb-2">
                      <span className="font-semibold">Special Requests:</span>
                      <span className="text-gray-600">{formData.notes}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}
          </form>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center text-gray-600"
        >
          <p className="mb-2">✨ 24-hour cancellation policy applies</p>
          <p>📞 Need help? Call us at <span className="font-semibold text-luxury-gold">+254 700 000 000</span></p>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;