import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="bg-luxury-blush py-24 text-center">
      <h2 className="text-5xl font-serif mb-6 text-modern-black">
        Luxury Nail Care Redefined
      </h2>
      <p className="max-w-2xl mx-auto text-lg mb-8">
        Experience elegance, precision, and artistry in every manicure and pedicure.
      </p>
      <Link
        to="/booking"
        className="bg-luxury-gold text-white px-8 py-3 rounded-full hover:opacity-90 transition"
      >
        Book Appointment
      </Link>
    </section>
  );
};

export default Hero;