const Testimonials = () => {
  return (
    <section className="bg-white py-20">
      <h3 className="text-4xl font-serif text-center mb-12">
        What Our Clients Say
      </h3>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 px-6">
        <div className="p-6 shadow-lg rounded-lg">
          <p>"Absolutely the best nail salon experience I've had!"</p>
          <span className="block mt-4 font-semibold">– Sarah M.</span>
        </div>

        <div className="p-6 shadow-lg rounded-lg">
          <p>"Professional, clean, and beautiful results every time."</p>
          <span className="block mt-4 font-semibold">– Grace K.</span>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;