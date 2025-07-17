import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Optional: Lucide icons

const ImageSlider = ({ images, h }) => {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  };
  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  if (total === 0) {
    return (
      <img
        src="https://via.placeholder.com/300x200"
        alt="placeholder"
        className="w-full md:w-60 h-40 object-cover rounded-lg shadow"
      />
    );
  }

  return (
    <div className={`relative w-full ${h}`}>
      <img
        src={images[current]}
        alt={`Image ${current + 1}`}
        className="w-full h-full object-cover rounded-lg shadow"
      />

      {total > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full p-1"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full p-1"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === current ? "bg-orange-500" : "bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
