import { useEffect, useState } from "react";
import api from "../api/axios";

export default function About() {
  const [images, setImages] = useState([]);

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

      .catch(console.log);
  }, []);

  // =====================================
  // GET SECTION IMAGE
  // =====================================

  const getSectionImage = (type) => {
    const found = images.find(
      (img) => img.sectionType === type && img.status === "published",
    );

    return found
      ? getImageUrl(found.image)
      : "https://images.unsplash.com/photo-1505691938895-1758d7feb511";
  };

  // =====================================
  // SECTIONS
  // =====================================

  const sections = [
    {
      title: "THE PENTHOUSE",

      subtitle: "Luxury Gulf View Condo",

      description:
        "Welcome to our stunning 20th-floor penthouse at Laketown Wharf Resort, where breathtaking gulf views and luxury beachfront living create the perfect vacation experience.",

      image: getSectionImage("penthouse"),
    },

    {
      title: "PRIME LOCATION",

      subtitle: "Steps From The Beach",

      description:
        "Located just a short 3-minute walk from Panama City Beach’s famous white sandy beaches, the condo offers easy access to restaurants, shopping, entertainment, and endless coastal adventures.",

      image: getSectionImage("prime-location"),
    },

    {
      title: "LUXURY LIVING ROOM",

      subtitle: "Open & Elegant Space",

      description:
        "Relax in the bright and airy living room featuring large windows, modern interiors, comfortable seating, natural sunlight, and direct balcony access with magical ocean and sunset views.",

      image: getSectionImage("living-room"),
    },

    {
      title: "MASTER BEDROOM",

      subtitle: "Private Gulf View Suite",

      description:
        "The luxurious master suite features a king-sized bed, elegant décor, flat-screen TV, spa-style bathroom, walk-in shower, and stunning gulf views directly from the bedroom.",

      image: getSectionImage("master-bedroom"),
    },

    {
      title: "GUEST BEDROOMS",

      subtitle: "Comfort For Everyone",

      description:
        "Our spacious condo comfortably sleeps up to 12 guests with multiple king bedrooms, cozy guest suites, a bunk room, and a queen sleeper sofa perfect for families and large groups.",

      image: getSectionImage("guest-bedroom"),
    },

    {
      title: "BUNK ROOM",

      subtitle: "Perfect For Kids",

      description:
        "The stylish bunk room is designed especially for children and families, featuring comfortable bunk beds and a relaxing environment for unforgettable beach vacations.",

      image: getSectionImage("bunk-room"),
    },

    {
      title: "GOURMET KITCHEN",

      subtitle: "Fully Equipped Luxury Kitchen",

      description:
        "Cook and gather with ease in our fully stocked gourmet kitchen featuring modern appliances, cookware, spacious countertops, dining essentials, refrigerator, oven, and everything needed for family meals.",

      image: getSectionImage("kitchen"),
    },

    {
      title: "PRIVATE BALCONY",

      subtitle: "Magical Gulf Views",

      description:
        "Enjoy breathtaking sunrise and sunset views from your private balcony overlooking the Gulf of Mexico. The perfect space for relaxing mornings and evening conversations.",

      image: getSectionImage("balcony"),
    },

    // {
    //   title:
    //     "RESORT AMENITIES",

    //   subtitle:
    //     "Luxury Resort Experience",

    //   description:
    //     "Laketown Wharf Resort offers premium amenities including five swimming pools, hot tubs, private beach access, fitness center, putting green, outdoor gazebos, and relaxing resort-style living.",

    //   image:
    //     getSectionImage(
    //       "amenities"
    //     ),
    // },

    {
      title: "BEACH ACCESS",

      subtitle: "White Sandy Beaches",

      description:
        "Spend your days enjoying crystal-clear water and the world-famous white sandy beaches just steps away from the condo.",

      image: getSectionImage("beach-access"),
    },

    {
      title: "FAMILY FRIENDLY",

      subtitle: "Perfect Vacation Stay",

      description:
        "Designed for families and groups, our penthouse offers spacious living areas, kid-friendly accommodations, relaxing resort amenities, and everything needed for a comfortable stay.",

      image: getSectionImage("family-friendly"),
    },

    {
      title: "UNFORGETTABLE EXPERIENCE",

      subtitle: "Your Dream Beach Getaway",

      description:
        "Whether you're planning a romantic escape, family vacation, or relaxing coastal retreat, Reel Paradise delivers luxury, comfort, breathtaking views, and unforgettable beach experiences.",

      image: getSectionImage("experience"),
    },
  ];

  return (
    <section className="bg-[#f5f5f3] py-20 overflow-hidden ">
      <div className="max-w-7xl mx-auto px-5 md:px-10 mt-16 md:mt-10">
        {/* HEADING */}
        <div className="text-center mb-28">
          <h1
            className="
            font-playfair
            text-black
            font-bold
            leading-[0.95]
            text-center
            text-5xl
            sm:text-6xl
            md:text-7xl
            lg:text-[90px]
          "
          >
            About
            <br />
            Stunning Sunset Views
          </h1>

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
            Experience luxury beachfront living with premium interiors,
            breathtaking ocean views, resort-style amenities, and unforgettable
            family vacations at Reel Paradise.
          </p>
        </div>

        {/* SECTIONS */}
        <div className="space-y-32">
          {sections.map((item, index) => (
            <div
              key={index}
              className={`
                  grid
                  grid-cols-1
                  lg:grid-cols-2
                  gap-16
                  lg:gap-24
                  items-center
                  ${index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""}
                `}
            >
              {/* IMAGE */}
              <div
                className="
                  overflow-hidden
                  group
                "
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="
                      w-full
                      h-[300px]
                      sm:h-[420px]
                      lg:h-[520px]
                      object-cover
                      transition
                      duration-700
                      group-hover:scale-105
                    "
                />
              </div>

              {/* CONTENT */}
              <div
                className="
                  text-center
                  px-2
                  md:px-10
                "
              >
                {/* TITLE */}
                <h3
                  className="
                    uppercase
                    tracking-[10px]
                    text-black
                    text-lg
                    md:text-2xl
                    mb-8
                    font-light
                  "
                >
                  {item.title}
                </h3>

                {/* SUBTITLE */}
                <h4
                  className="
                    uppercase
                    tracking-[6px]
                    text-gray-400
                    text-xs
                    md:text-sm
                    mb-8
                  "
                >
                  {item.subtitle}
                </h4>

                {/* DESCRIPTION */}
                <p
                  className="
                    text-gray-600
                    text-lg
                    md:text-[22px]
                    leading-[2]
                    font-light
                  "
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
