const Portfolio = () => {
  const images = [1, 2, 3, 4, 5, 6];

  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <h3 className="text-4xl font-serif text-center mb-12">
        Our Work
      </h3>

      <div className="grid md:grid-cols-3 gap-6">
        {images.map((img) => (
          <div
            key={img}
            className="h-64 bg-gray-200 rounded-lg shadow-md hover:scale-105 transition"
          />
        ))}
      </div>
    </section>
  );
};

export default Portfolio;