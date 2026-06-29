import condoImg from "../../assets/about-Img1.png";
import bedroomImg from "../../assets/about-img2.jpeg";
import kitchenImg from "../../assets/about-img3.jpg";
import beachImg from "../../assets/about-img4.jpeg";

import { Link } from "react-router-dom";

export default function AboutSection() {
 const sections = [
  {
    title: "THE CONDO",
    subtitle: "Luxury Gulf View Retreat",
    description:
      "Escape to this beautifully furnished top-floor condo featuring breathtaking Gulf views, a spacious private balcony, direct beach access, and resort-style amenities. Perfect for families seeking a relaxing getaway on Santa Rosa Beach.",
    image: condoImg,
  },

  {
    title: "PRIMARY BEDROOM",
    subtitle: "Comfortable King Suite",
    description:
      "The spacious primary suite features a luxurious king-size bed, Smart TV, private en-suite bathroom with a walk-in shower, USB charging ports, and a peaceful atmosphere for the perfect night's sleep.",
    image: bedroomImg,
  },

  {
    title: "FULLY EQUIPPED KITCHEN",
    subtitle: "Everything You Need",
    description:
      "Prepare delicious meals in the modern kitchen featuring granite countertops, stainless steel appliances, a Keurig coffee maker, blender, cookware, dining essentials, and plenty of space for family gatherings.",
    image: kitchenImg,
  },

  {
    title: "FAMILY GETAWAY",
    subtitle: "Perfect for Every Vacation",
     description:
    "Just a short drive from the condo, Camp Helen State Park offers breathtaking coastal scenery, nature trails, kayaking, wildlife viewing, and peaceful beaches. It's the perfect escape for guests looking to experience the natural beauty of Florida's Emerald Coast.",
  image: beachImg,
        image: beachImg,
  },
];

  return (
    <section className="bg-[#f8f8f8] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        
        {/* MAIN HEADING */}
        <div className="text-center mb-24">
        <h1 className="font-playfair text-5xl md:text-7xl font-bold">
   Luxury Gulf View Condo
</h1>

          <p className="mt-8 text-gray-600 max-w-4xl mx-auto text-lg md:text-xl leading-9">
             Escape to our beautifully furnished top-floor condo at San Remo on Santa Rosa Beach. Enjoy breathtaking Gulf views, direct beach access, resort-style amenities, and spacious accommodations designed for relaxing family vacations and unforgettable coastal getaways.
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

        {/* BUTTON */}
        <div className="flex justify-center mt-28">
          <Link to="/about">
            <button className="px-12 py-4 bg-black text-white uppercase tracking-[4px] text-sm hover:bg-blue-500 transition-all duration-500">
              Explore More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}