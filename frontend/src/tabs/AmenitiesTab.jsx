import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { amenitiesData } from "../amenitiesData.js";
import { useModal } from "../context/ModalContext";

export default function AmenitiesTab({ listingId, initialData = {}, goNextTab }) {
  const [amenities, setAmenities] = useState({});
  const { showModal } = useModal();
  const [amenityInput, setAmenityInput] = useState("");
  const [parsedAmenities, setParsedAmenities] = useState([]);

  /* ================= LOAD INITIAL ================= */
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setAmenities(initialData);
    }
  }, [initialData]);

  /* ================= FALLBACK LOAD ================= */
  useEffect(() => {
    if (!listingId || Object.keys(amenities).length > 0) return;

    api
      .get(`/listings/${listingId}`)
      .then((res) => setAmenities(res.data.amenities || {}));
  }, [listingId]);

  /* ================= HANDLERS ================= */
  const toggleCheckbox = (value) => {
    setAmenities((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  const selectRadio = (group, value) => {
    setAmenities((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((k) => {
        if (k.startsWith(group + ":")) delete updated[k];
      });
      updated[`${group}:${value}`] = true;
      return updated;
    });
  };

  const checkAll = (options, checked) => {
    const updated = {};
    options.forEach((opt) => (updated[opt] = checked));
    setAmenities((prev) => ({ ...prev, ...updated }));
  };

  /* ================= SAVE ================= */
 const saveAmenities = async () => {
  try {
    await api.put(
      `/listings/${listingId}/amenities`,
      amenities
    );

 
    goNextTab();
    return

  } catch (err) {
    showModal("Failed to save amenities");
  }
};
const autoSelectAmenities = () => {
  const text = amenityInput.toLowerCase();

  const allAmenities = amenitiesData
    .flatMap((s) => s.options)
    .sort((a, b) => b.length - a.length); // longest first

  const updated = {};
  let remainingText = text;

  allAmenities.forEach((option) => {
    const amenity = option.toLowerCase();

    if (remainingText.includes(amenity)) {
      updated[option] = true;

      // remove matched text so smaller matches won't fire
      remainingText = remainingText.replaceAll(
        amenity,
        " "
      );
    }
  });

  setAmenities((prev) => ({
    ...prev,
    ...updated,
  }));

  showModal(
    `${Object.keys(updated).length} amenities selected`
  );
};

const handleAmenityPaste = (value) => {
  setAmenityInput(value);

  const tags = value
    .split(/[\n,;,]/)
    .map((x) => x.trim())
    .filter(Boolean);

  setParsedAmenities(tags);
};

const removeTag = (tag) => {
  const updated = parsedAmenities.filter(
    (item) => item !== tag
  );

  setParsedAmenities(updated);
  setAmenityInput(updated.join(",  "));
};


  return (
    <div className="space-y-6">

      {/* ACTION BAR */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-8 shadow-sm">
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-semibold text-gray-800">
      Quick Amenity Selector
    </h3>

    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
      {parsedAmenities.length} Selected
    </span>
  </div>

  <textarea
    rows={4}
    value={amenityInput}
    onChange={(e) =>
      
      handleAmenityPaste(e.target.value)
    }
    
    placeholder={`Paste amenities here...
Pool Hot Tub WiFi Washer Dryer Ocean View`}
    className="
  w-full
  min-h-[120px]
  border
  border-gray-200
  rounded-xl
  p-5

  text-[15px]
  leading-8

  resize-none

  focus:outline-none
  focus:ring-2
  focus:ring-blue-500

  transition-all
  duration-200
"
  />
  <p className="text-xs text-gray-500 mt-2">
  Paste amenities separated by comma or new line.
</p>

  {/* Tags */}
  {parsedAmenities.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-4 animate-fadeIn">
      {parsedAmenities.map((tag) => (
        <div
          key={tag}
         className="
flex
items-center
gap-2
px-4
py-2
bg-gradient-to-r
from-blue-50
to-indigo-50
border
border-blue-200
rounded-full
shadow-sm
hover:shadow-md
transition-all
duration-200
hover:-translate-y-0.5
"
        >
          <span>{tag}</span>

          <button
  type="button"
  onClick={() => removeTag(tag)}
  className="
    flex
    items-center
    justify-center
    w-6
    h-6
    rounded-full
    bg-red-100
    text-red-600
    hover:bg-red-500
    hover:text-white
    transition
  "
>
  ✕
</button>
        </div>
      ))}
    </div>
  )}

  <button
    onClick={autoSelectAmenities}
    className="
     bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg cursor-pointer
    "
  >
    Auto Select Amenities
  </button>
</div>
      <div className="sticky top-0 bg-white z-10 flex justify-end border-b pb-4">
        <button
          onClick={saveAmenities}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg cursor-pointer"
        >
          Save & Next →
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">

        {amenitiesData.map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-xl border shadow-sm hover:shadow-md transition"
          >
            {/* HEADER */}
            <div className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 border-b rounded-t-xl">
              {section.title}
            </div>

            {/* CHECK ALL */}
            {section.type === "checkbox" && (
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-sm">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    checkAll(section.options, e.target.checked)
                  }
                />
                Select all
              </label>
            )}

            {/* OPTIONS */}
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {section.options.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type={section.type}
                    name={section.name}
                    checked={
                      section.type === "radio"
                        ? !!amenities[`${section.name}:${option}`]
                        : !!amenities[option]
                    }
                    onChange={() =>
                      section.type === "radio"
                        ? selectRadio(section.name, option)
                        : toggleCheckbox(option)
                    }
                  />
                  <span className="text-sm text-gray-700">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
