export default function AmenitiesModal({
  amenities,
  onClose,
}) {
  return (
    <div
      className="
      fixed 
      inset-0 
      bg-black/50 
      flex 
      items-center 
      justify-center 
      z-50
      p-4
    "
    >
      <div
        className="
        bg-white 
        w-full 
        max-w-5xl 
        rounded-3xl 
        p-8 
        relative 
        max-h-[90vh] 
        overflow-y-auto
      "
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="
          absolute 
          top-5 
          right-5 
          text-2xl
          hover:rotate-90
          transition-all
          duration-300
        "
        >
          ✕
        </button>

        {/* TITLE */}
        <h2
          className="
          text-3xl 
          md:text-4xl 
          font-semibold 
          text-gray-800 
          mb-10
        "
        >
          Amenities ({amenities.length})
        </h2>

        {/* GRID */}
        <div
          className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          gap-5
        "
        >
          {amenities.map((name, i) => (
            <div
              key={i}
              className="text-black font-medium text-xl"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}