import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Gallery() {
  const [images, setImages] = useState([]);

  const [active, setActive] = useState(null);

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
  // FETCH
  // =====================================

  useEffect(() => {
    api
      .get("/gallery/published")

      .then((res) => setImages(res.data))

      .catch(console.log);
  }, []);

  return (
    <div className="bg-[#f8f8f5] min-h-screen">
      {/* ================= HEADING ================= */}

      <section
        className="
        pt-24
        pb-16
        px-5
        md:px-10
      "
      >
        <div className="max-w-7xl mx-auto text-center mt-16 md:mt-10">
          {/* SMALL TEXT */}
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
            Luxury Moments
          </p>

          {/* MAIN HEADING */}
          <h1
            className="
            font-playfair
            text-black
            font-bold
            leading-[0.95]
            text-5xl
            sm:text-6xl
            md:text-7xl
            lg:text-[90px]
          "
          >
            Property Gallery
          </h1>

          {/* DESCRIPTION */}
          <p
            className="
            mt-8
            text-gray-600
            max-w-3xl
            mx-auto
            text-lg
            md:text-xl
            leading-[2]
          "
          >
            Explore our luxury penthouse, breathtaking gulf views, elegant
            interiors, resort amenities, and unforgettable beachfront
            experiences.
          </p>
        </div>
      </section>

      {/* ================= GALLERY ================= */}

      <section
        className="
        px-4
        sm:px-6
        md:px-10
        lg:px-16
        pb-20
      "
      >
        <div
          className="
          columns-1
          sm:columns-2
          lg:columns-3
          xl:columns-4
          gap-5
          space-y-5
        "
        >
          {images.map((img) => (
            <div
              key={img._id}
              className="
              relative
              overflow-hidden
              rounded-[28px]
              cursor-pointer
              group
            "
              onClick={() => setActive(img)}
            >
              {/* IMAGE */}
              <img
                src={getImageUrl(img.image)}
                alt="gallery"
                className="
                  w-full
                  object-cover
                  rounded-[28px]
                  transition-all
                  duration-700
                  group-hover:scale-105
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
                from-black/40
                via-black/5
                to-transparent
                opacity-0
                group-hover:opacity-100
                transition-all
                duration-500
              "
              />

              {/* VIEW BUTTON */}
              <div
                className="
                absolute
                bottom-5
                left-1/2
                -translate-x-1/2
                opacity-0
                group-hover:opacity-100
                transition-all
                duration-500
              "
              >
                <button
                  className="
                  bg-white/90
                  backdrop-blur-md
                  text-black
                  px-5
                  py-2
                  rounded-full
                  text-sm
                  tracking-[2px]
                  uppercase
                "
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= LIGHTBOX ================= */}

      {active && (
        <div
          className="
          fixed
          inset-0
          bg-black/95
          z-[999999]
          flex
          items-center
          justify-center
          p-4
        "
        >
          {/* CLOSE */}
          <button
            onClick={() => setActive(null)}
            className="
            absolute
            top-5
            right-5
            text-white
            text-4xl
            z-50
          "
          >
            ✕
          </button>

          {/* IMAGE */}
          <img
            src={getImageUrl(active.image)}
            alt="preview"
            className="
              max-w-[95vw]
              max-h-[90vh]
              rounded-3xl
              object-contain
            "
          />
        </div>
      )}
    </div>
  );
}
