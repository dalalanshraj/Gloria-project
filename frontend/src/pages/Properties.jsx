import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import PropertyCard from "../components/PropertyCard";

const Properties = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/listings/published")
      .then((res) => {
        setListings(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>

      {/* LISTINGS */}
      <div className="p-10 bg-gray-100 ">
         <p className="uppercase text-xs text-center tracking-[3px] text-[#2f9bad]
  mb-3">Properties</p>
        <h2 className="text-3xl md:text-5xl text-center font-semibold text-gray-800 mb-8">
          Our Properties
        </h2>

        {loading && (
          <p className="text-center text-gray-500">
            Loading properties...
          </p>
        )}

        {!loading && listings.length === 0 && (
          <p className="text-center text-red-500">
            No properties available
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {listings.map((listing) => (
            <PropertyCard
              key={listing._id}
              listing={listing}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Properties;
