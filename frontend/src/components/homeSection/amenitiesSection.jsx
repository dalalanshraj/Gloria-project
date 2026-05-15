import { useState, useEffect } from "react";
import api from "../../api/axios";
import AmenitiesModal from "./AmenitiesModal";

export default function AmenitiesSection({ listingId }) {
  const [open, setOpen] = useState(false);

  const [amenities, setAmenities] = useState([]);

  // FETCH AMENITIES FROM BACKEND
  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/listings/${listingId}`)
      .then((res) => {
        console.log("FULL DATA:", res.data);

        // 👇 OBJECT TO ARRAY
        const amenitiesObject =
          res.data?.amenities || res.data?.property?.amenities || {};

        const data = Object.keys(amenitiesObject).filter(
          (key) => amenitiesObject[key] === true,
        );

        setAmenities(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [listingId]);

  // PREVIEW
  const preview = amenities.slice(0, 12);

  return (
    <section className="py-1 px-6 md:px-16">
      {/* TOP */}
      <p
        className="
        uppercase 
        text-center 
        text-xs 
        tracking-[3px] 
        text-[#2f9bad]
        mb-3
      "
      >
        Amenities
      </p>

      <h2
        className="
        text-3xl 
        text-center 
        md:text-5xl 
        font-semibold 
        text-gray-800 
        mb-10
      "
      >
        Our Amenities
      </h2>

      {/* PREVIEW */}
      <div
        className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        gap-5
        
      "
      >
        {preview
          .filter((item) => item?.trim() !== "")
          .map((name, i) => (
            <div key={i} className="text-black font-medium text-xl" >
              {name}
            </div>
          ))}
      </div>

      {/* BUTTON */}
      {amenities.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => setOpen(true)}
            className="
           px-8 py-3 mt-5 rounded-full bg-[#FFE8BE] text-black font-medium shadow-md hover:scale-105  transition duration-300
          "
          >
            Show all {amenities.length} Amenities
          </button>
        </div>
      )}

      {/* MODAL */}
      {open && (
        <AmenitiesModal amenities={amenities} onClose={() => setOpen(false)} />
      )}
    </section>
  );
}
