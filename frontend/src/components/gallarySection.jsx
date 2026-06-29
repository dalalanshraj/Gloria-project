import { useEffect, useState } from "react";
import api from "../api/axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Link } from "react-router-dom";

export default function GallerySection() {
  const [images, setImages] = useState([]);

  const [current, setCurrent] = useState(0);

  const [loading, setLoading] = useState(true);

  // =====================================
  // IMAGE URL
  // =====================================

  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return "";

    const base = import.meta.env.VITE_API_URL || "";

    if (path.startsWith("http")) return path;

    return base.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
  };

  // =====================================
  // FETCH IMAGES
  // =====================================

  useEffect(() => {
    api
      .get("/gallery/published")

      .then((res) => {
        const data = res.data || [];

        setImages(data);
      })

      .catch(console.log)

      .finally(() => setLoading(false));
  }, []);

  // =====================================
  // AUTO SLIDE
  // =====================================

  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images]);

  // =====================================
  // NAVIGATION
  // =====================================

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  // =====================================
  // NO IMAGES
  // =====================================

  if (!images.length) {
    return <div className="py-20 text-center">No Images Found</div>;
  }

  return (
    <section
      className="
      bg-[#f8f8f5]
      py-20
      overflow-hidden
    "
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* ================= HEADING ================= */}

      <div className="text-center mb-16">
  <p
    className="
      uppercase
      tracking-[6px]
      text-gray-400
      text-xs
      md:text-sm
      mb-6
    "
  >
    Experience Coastal Luxury
  </p>

  <h2
    className="
      font-playfair
      text-black
      font-bold
      leading-[0.95]
      text-5xl
      sm:text-6xl
      md:text-7xl
      lg:text-[85px]
    "
  >
    Discover
    <br />
    Every Detail
  </h2>

  <p
    className="
      mt-8
      text-gray-600
      max-w-4xl
      mx-auto
      text-lg
      md:text-xl
      leading-[2]
    "
  >
    From breathtaking Gulf views and a spacious private balcony to elegant
    interiors, resort amenities, and direct beach access, explore every space
    that makes this San Remo condo the perfect destination for your next beach
    getaway.
  </p>
</div>

        {/* ================= SLIDER ================= */}

        <div
          className="
          relative
          w-full
          overflow-hidden
          rounded-[35px]
        "
        >
          {/* SLIDES */}
          <div
            className="
            flex
            transition-transform
            duration-700
            ease-in-out
          "
            style={{
              transform: `translateX(-${current * 100}%)`,
            }}
          >
            {images.map((img, i) => (
              <div
                key={i}
                className="
                  min-w-full
                  relative
                  group
                "
              >
                {/* IMAGE */}
                <img
                  src={getImageUrl(img.image)}
                  alt="gallery"
                  className="
                      w-full
                      h-[300px]
                      sm:h-[450px]
                      md:h-[600px]
                      object-cover
                    "
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />

                {/* OVERLAY */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/50
                    via-black/10
                    to-transparent
                  "
                />
              </div>
            ))}
          </div>

          {/* ================= LEFT ================= */}

          <button
            onClick={prevSlide}
            className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            w-12
            h-12
            rounded-full
            bg-white/20
            backdrop-blur-md
            flex
            items-center
            justify-center
            text-white
            hover:bg-white
            hover:text-black
            transition-all
            duration-300
          "
          >
            <ChevronLeft size={26} />
          </button>

          {/* ================= RIGHT ================= */}

          <button
            onClick={nextSlide}
            className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            w-12
            h-12
            rounded-full
            bg-white/20
            backdrop-blur-md
            flex
            items-center
            justify-center
            text-white
            hover:bg-white
            hover:text-black
            transition-all
            duration-300
          "
          >
            <ChevronRight size={26} />
          </button>

          {/* ================= DOTS ================= */}

          <div
            className="
            absolute
            bottom-6
            left-1/2
            -translate-x-1/2
            flex
            gap-3
          "
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`
                    transition-all
                    duration-300
                    rounded-full
                    ${
                      current === i
                        ? "w-10 h-3 bg-white"
                        : "w-3 h-3 bg-white/50"
                    }
                  `}
              />
            ))}
          </div>
        </div>

        {/* ================= BUTTON ================= */}

        <div className="flex justify-center mt-16">
          <Link to="/gallery">
            <button
              className="
             px-12 py-4 bg-black text-white uppercase tracking-[4px] text-sm hover:bg-blue-500 transition-all duration-500
            "
            >
              Explore Gallery →
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
