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
      {/* <p
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
      </p> */}
      <div className="text-center mb-24">

      <h2
        className="
        font-playfair text-5xl md:text-7xl font-bold
      "
      >
        Our Amenities
      </h2>
</div>
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
            <p key={i} className="text-gray-600 text-lg md:text-2xl  font-light" >
              {name}
            </p>
          ))}
      </div>

      {/* BUTTON */}
      {amenities.length > 0 && (
        <div className="flex justify-center p-3">
          <button
            onClick={() => setOpen(true)}
          className="px-12 py-4 bg-black text-white uppercase tracking-[4px] text-sm hover:bg-blue-500 transition-all duration-500"
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
