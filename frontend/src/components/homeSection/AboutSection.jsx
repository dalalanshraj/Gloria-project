import { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";

export default function AboutSection({ listingId }) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (path) => {
    if (!path || typeof path !== "string") return "";

    const base = import.meta.env.VITE_API_URL || "";

    if (path.startsWith("http")) return path;

    return (
      base.replace(/\/$/, "") + "/" + path.replace(/^\//, "")
    );
  };

  // FETCH LISTING
  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/listings/${listingId}`)
      .then((res) => {
        setListing(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, [listingId]);

  // LOADING
  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading property...
      </div>
    );
  }

  // NO PROPERTY
  if (!listing) {
    return (
      <div className="py-20 text-center text-red-500">
        Property not found
      </div>
    );
  }

  const image =
    listing?.photos?.length > 0
      ? getImageUrl(listing.photos[0])
      : "https://via.placeholder.com/600x400";

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#4aa3c7]
        py-16
        sm:py-20
        md:py-24
        lg:py-28
        px-4
        sm:px-6
        lg:px-8
      "
    >
      {/* BACKGROUND DESIGN */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

      <div
        className="
          relative
          z-10
          max-w-7xl
          mx-auto
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-12
          lg:gap-20
          items-center
        "
      >
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center lg:text-left"
        >
          <p
            className="
              text-yellow-300
              text-sm
              sm:text-base
              font-medium
              tracking-wide
              uppercase
              mb-3
            "
          >
            Welcome to
          </p>

          <h1
            className="
              text-3xl
              sm:text-4xl
              md:text-5xl
              lg:text-6xl
              font-extrabold
              text-white
              leading-tight
            "
          >
            DONNA DANIEL <br className="hidden sm:block" />
            REALTY INC
          </h1>

          <div className="space-y-4 sm:space-y-5 mt-5 sm:mt-6">
            <p
              className="
                text-white/90
                text-sm
                sm:text-base
                md:text-lg
                leading-relaxed
              "
            >
              Donna Daniel Realty Inc is your trusted partner in
              finding the perfect home and investment opportunities.
              We specialize in premium properties, offering expert
              guidance for buying, selling, and renting real estate.
            </p>

            <p
              className="
                text-white/90
                text-sm
                sm:text-base
                md:text-lg
                leading-relaxed
              "
            >
              From luxury homes to modern apartments, our team
              ensures a smooth and transparent process. We focus
              on delivering value, comfort, and long-term
              satisfaction to every client.
            </p>

            <p
              className="
                text-white/90
                text-sm
                sm:text-base
                md:text-lg
                leading-relaxed
              "
            >
              Whether you're searching for your dream home or a
              profitable investment, we are here to guide you
              every step of the way.
            </p>
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full flex justify-center"
        >
          <div
            className="
              relative
              w-full
              max-w-2xl
            "
          >
            {/* IMAGE */}
            <img
              src={image}
              alt="Real Estate"
              className="
                w-full
                h-[260px]
                sm:h-[360px]
                md:h-[450px]
                lg:h-[520px]
                object-cover
                rounded-3xl
                border-4
                border-white
                shadow-2xl
              "
            />

            {/* FLOATING CARD */}
            <div
              className="
                absolute
                -bottom-5
                left-1/2
                -translate-x-1/2
                sm:left-auto
                sm:right-6
                sm:translate-x-0
                bg-white
                rounded-2xl
                px-5
                py-4
                shadow-xl
                w-[85%]
                sm:w-auto
              "
            >
              <h3 className="text-lg font-bold text-[#4aa3c7]">
                Trusted Realty Experts
              </h3>

              <p className="text-sm text-gray-600 mt-1">
                Helping families find perfect vacation homes &
                investments.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}