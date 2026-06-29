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
        setImages(res.data || []);
      })
      .catch(console.log);
  }, []);

  // =====================================
  // GET SECTION IMAGE
  // =====================================

  const getSectionImage = (type) => {
    const found = images.find(
      (img) =>
        img.sectionType === type &&
        img.status === "published"
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
    title: "THE CONDO",
    subtitle: "Top Floor Gulf View Retreat",
    description:
      "Escape to this beautifully furnished top-floor condo featuring breathtaking Gulf views, a spacious private balcony, direct beach access, and resort-style amenities. Perfect for families seeking a relaxing getaway on Santa Rosa Beach.",
    image: getSectionImage("hero"),
  },

  {
    title: "PRIME LOCATION",
    subtitle: "Santa Rosa Beach",
    description:
      "Located on scenic Santa Rosa Beach, the condo is only a short walk across the private beach boardwalk to the Gulf. Gulf Place shopping, local restaurants, bike paths, and Seaside are all just minutes away.",
    image: getSectionImage("gulf-views"),
  },

  {
    title: "LIVING ROOM",
    subtitle: "Relax In Comfort",
    description:
      "The inviting living room features comfortable seating, a 55-inch Smart TV, plenty of natural light, and direct access to the spacious private balcony overlooking the pool, hot tub, pond, and Gulf.",
    image: getSectionImage("living-room"),
  },

  // {
  //   title: "MASTER BEDROOM",
  //   subtitle: "Private King Suite",
  //   description:
  //     "The master suite includes a king-size bed, 42-inch flat-screen TV, USB charging ports, private bathroom with a renovated walk-in shower, and direct access to a relaxing coastal retreat.",
  //   image: getSectionImage("master-bedroom"),
  // },

  // {
  //   title: "SECOND BEDROOM",
  //   subtitle: "Comfortable King Bedroom",
  //   description:
  //     "The second bedroom offers a king-size bed, a 42-inch flat-screen TV, and convenient access to the guest bathroom, making it ideal for another couple or family members.",
  //   image: getSectionImage("second-bedroom"),
  // },

  // {
  //   title: "THIRD BEDROOM",
  //   subtitle: "Twin Beds For Guests",
  //   description:
  //     "Perfect for children or friends, the third bedroom features two comfortable twin beds and a 32-inch flat-screen TV for added convenience during your stay.",
  //   image: getSectionImage("third-bedroom"),
  // },

  {
    title: "FULLY EQUIPPED KITCHEN",
    subtitle: "Everything You Need",
    description:
      "The updated kitchen features granite countertops, modern appliances, a Keurig coffee maker, blender, cookware, and everything needed to prepare meals throughout your vacation.",
    image: getSectionImage("kitchen"),
  },

  {
    title: "PRIVATE BALCONY",
    subtitle: "350 Sq Ft Outdoor Living",
    description:
      "Relax on the oversized 350-square-foot furnished balcony with unobstructed views of the resort pool, hot tub, private pond, and the emerald waters of the Gulf. It's the perfect place for morning coffee or evening sunsets.",
    image: getSectionImage("balcony"),
  },

  {
    title: "POOL & HOT TUB",
    subtitle: "Relax & Recharge",
    description:
      "Enjoy the large resort swimming pool and hot tub, heated during select holiday periods. The beautifully maintained pool area offers the perfect place to unwind after a day at the beach.",
    image: getSectionImage("pool-hot-tub"),
  },

  {
    title: "COMMUNITY AMENITIES",
    subtitle: "Resort Features",
    description:
      "San Remo offers gated security, a fitness center with updated equipment, a large community room with a full kitchen, beautifully landscaped grounds, and easy access to the private beach boardwalk.",
    image: getSectionImage("community-amenities"),
  },

  // {
  //   title: "BEACH ACCESS",
  //   subtitle: "Private Beach Boardwalk",
  //   description:
  //     "Take a short walk from the condo along the private beach boardwalk and enjoy Santa Rosa Beach's famous sugar-white sand and crystal-clear emerald Gulf waters.",
  //   image: getSectionImage("beach-access"),
  // },

  {
    title: "FAMILY FRIENDLY",
    subtitle: "Everything For Families",
    description:
      "Just a short drive from the condo, Camp Helen State Park offers breathtaking coastal scenery, nature trails, kayaking, wildlife viewing, and peaceful beaches. It's the perfect escape for guests looking to experience the natural beauty of Florida's Emerald Coast.",
    image: getSectionImage("family-friendly"),
  },

  {
    title: "LOCAL ATTRACTIONS",
    subtitle: "Dining & Shopping Nearby",
    description:
      "Walk to Gulf Place for shopping and restaurants like The Perfect Pig, Shunk Gully Oyster Bar, Pizza by the Sea, Goatfeathers, Blue Mabel, and Stinky's Fish Camp. Destin, Seaside, and Panama City's attractions are also within easy driving distance.",
    image: getSectionImage("local-attractions"),
  },
];
    return (
    <section className="bg-[#f5f5f3] py-20 overflow-hidden">
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
    Luxury Living
    <br />
    On Santa Rosa Beach
  </h1>

  <p
    className="
      mt-8
      text-gray-600
      max-w-5xl
      mx-auto
      text-lg
      md:text-xl
      leading-[2]
    "
  >
    Escape to a spacious Gulf-view condo designed for unforgettable coastal
    vacations. Enjoy direct beach access, a private furnished balcony,
    resort-style amenities, beautifully updated interiors, and a peaceful
    setting just minutes from Gulf Place, Seaside, and the best dining and
    attractions along Florida's Emerald Coast.
  </p>
</div>

        {/* SECTIONS */}
         <div className="space-y-32">
          {sections.map((item, index) => (
           <div
  className={`grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center ${
    index % 2 !== 0 ? "lg:[&>*:first-child]:order-2" : ""
  }`}
>
  
  {/* IMAGE */}
  <div className="w-full">
    <img
      src={item.image}
      alt={item.title}
      className="w-full h-[300px] sm:h-[450px] lg:h-[550px] object-cover"
    />
  </div>

  {/* CONTENT */}
  <div className="flex flex-col justify-center text-center lg:text-center px-2 md:px-8 lg:px-14">
    
    {/* TOP TITLE */}
    <h3 className="uppercase tracking-[8px] text-black text-lg md:text-2xl mb-8 font-light">
      {item.title}
    </h3>

    {/* SUBTITLE */}
    <h4 className="uppercase tracking-[6px] text-gray-400 text-xs md:text-sm mb-8">
      {item.subtitle}
    </h4>

    {/* DESCRIPTION */}
    <p className="text-gray-600 text-lg md:text-2xl  font-light">
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