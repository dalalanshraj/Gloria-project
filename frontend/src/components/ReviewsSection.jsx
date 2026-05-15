import { useState, useEffect } from "react";
import api from "../api/axios";

export default function ReviewsSection({ listingId }) {
  const [open, setOpen] = useState(false);

  const [reviews, setReviews] =
    useState([]);

  // FETCH REVIEWS FROM LISTING
  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/listings/${listingId}`)
      .then((res) => {

        console.log(
          "FULL LISTING:",
          res.data
        );

        // 👇 YOUR REVIEWS ARRAY
        const data =
          res.data?.reviews ||
          res.data?.listing?.reviews ||
          [];

        setReviews(data);

      })
      .catch((err) => {
        console.log(err);
      });

  }, [listingId]);

  // PREVIEW
  const preview = reviews.slice(0, 3);

  return (
    <section className="bg-[#f5f5f5] py-20 px-6 md:px-16">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-14 text-center">
          <p
            className="
            uppercase 
            text-xs 
            tracking-[3px] 
            text-[#2f9bad]
            mb-3
          "
          >
            Testimonials
          </p>

          <h2
            className="
            text-3xl 
            md:text-5xl 
            font-semibold 
            text-gray-800
          "
          >
            What Our Clients Say
          </h2>
        </div>

        {/* NO REVIEWS */}
        {reviews.length === 0 ? (
          <div className="text-center text-gray-500">
            No reviews available
          </div>
        ) : (
          <>
            {/* REVIEWS GRID */}
            <div className="grid md:grid-cols-2 gap-8">

              {/* BIG REVIEW */}
              <div
                className="
                relative 
                bg-white/80 
                backdrop-blur-xl 
                p-8 
                md:p-10 
                rounded-3xl 
                shadow-lg 
                hover:shadow-2xl 
                transition 
                duration-500
              "
              >
                <div
                  className="
                  absolute 
                  -inset-1 
                  bg-[#FFE8BE]/10 
                  blur-xl 
                  rounded-3xl
                "
                ></div>

                <div className="relative">

                  {/* STARS */}
                  <div className="text-yellow-500 text-lg mb-3">
                    {"★".repeat(
                      preview[0]?.rating || 5
                    )}
                  </div>

                  {/* MESSAGE */}
                  <p
                    className="
                    text-gray-600 
                    leading-relaxed 
                    text-lg
                  "
                  >
                    {preview[0]?.message}
                  </p>

                  {/* USER */}
                  <div className="mt-6 flex items-center gap-3">

                    <div
                      className="
                      w-10 
                      h-10 
                      bg-[#FFE8BE] 
                      rounded-full 
                      flex 
                      items-center 
                      justify-center 
                      text-black 
                      font-bold
                    "
                    >
                      {preview[0]?.name?.charAt(0)}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">
                        {preview[0]?.name}
                      </p>

                      <p className="text-sm text-gray-400">
                        {preview[0]?.stayDate}
                      </p>
                    </div>

                  </div>
                </div>
              </div>

              {/* SMALL REVIEWS */}
              <div className="flex flex-col gap-6">

                {preview
                  .slice(1)
                  .map((r, i) => (
                    <div
                      key={i}
                      className="
                      bg-white 
                      p-6 
                      rounded-2xl 
                      shadow-md 
                      hover:shadow-xl 
                      hover:-translate-y-1 
                      transition 
                      duration-300
                    "
                    >

                      {/* STARS */}
                      <div className="text-yellow-500 mb-2 text-sm">
                        {"★".repeat(
                          r?.rating || 5
                        )}
                      </div>

                      {/* TITLE */}
                      <h4 className="font-semibold text-lg mb-2">
                        {r?.title}
                      </h4>

                      {/* MESSAGE */}
                      <p className="text-gray-600 text-sm">
                        {r?.message}
                      </p>

                      {/* USER */}
                      <div className="mt-4 flex items-center gap-2">

                        <div
                          className="
                          w-8 
                          h-8 
                          bg-gray-200 
                          rounded-full 
                          flex 
                          items-center 
                          justify-center 
                          text-sm 
                          font-bold
                        "
                        >
                          {r?.name?.charAt(0)}
                        </div>

                        <div>
                          <p
                            className="
                            font-semibold 
                            text-gray-800 
                            text-sm
                          "
                          >
                            {r?.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            {r?.stayDate}
                          </p>
                        </div>

                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex justify-center mt-14">

              <button
                onClick={() =>
                  setOpen(true)
                }
                className="
                px-8 
                py-3 
                rounded-full 
                bg-[#FFE8BE] 
                text-black 
                font-medium 
                shadow-md 
                hover:scale-105  
                transition 
                duration-300
              "
              >
                View All Reviews →
              </button>

            </div>
          </>
        )}
      </div>

      {/* MODAL */}
      {open && (
        <div
          className="
          fixed 
          inset-0 
          bg-black/70 
          flex 
          items-center 
          justify-center 
          z-50 
          px-4
        "
        >

          <div
            className="
            bg-white 
            w-full 
            max-w-3xl 
            rounded-2xl 
            p-6 
            relative 
            shadow-xl
          "
          >

            {/* TOP */}
            <div
              className="
              flex 
              justify-between 
              items-center 
              mb-6
            "
            >
              <h3 className="text-2xl font-semibold">
                Reviews ({reviews.length})
              </h3>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="
                text-2xl 
                text-gray-600 
                hover:text-black
              "
              >
                ✕
              </button>
            </div>

            {/* LIST */}
            <div
              className="
              max-h-[65vh] 
              overflow-y-auto 
              space-y-6 
              pr-2
            "
            >

              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="
                  shadow-xl 
                  rounded-2xl 
                  p-6 
                  bg-gray-50 
                  hover:shadow-md 
                  transition
                "
                >

                  {/* STARS */}
                  <div className="text-yellow-500 text-lg mb-2">
                    {"★".repeat(
                      r?.rating || 5
                    )}
                  </div>

                  {/* TITLE */}
                  <h4
                    className="
                    font-semibold 
                    text-lg 
                    mb-1
                  "
                  >
                    {r?.title}
                  </h4>

                  {/* MESSAGE */}
                  <p
                    className="
                    text-gray-600 
                    leading-relaxed
                  "
                  >
                    {r?.message}
                  </p>

                  {/* DATE */}
                  <p
                    className="
                    text-sm 
                    text-gray-400 
                    mt-3
                  "
                  >
                    {r?.stayDate}
                  </p>

                  {/* USER */}
                  <div className="mt-4 flex items-center gap-2">

                    <div
                      className="
                      w-10 
                      h-10 
                      bg-[#FFE8BE] 
                      rounded-full 
                      flex 
                      items-center 
                      justify-center 
                      text-black 
                      font-bold
                    "
                    >
                      {r?.name?.charAt(0)}
                    </div>

                    <p
                      className="
                      font-semibold 
                      text-gray-800 
                      text-sm
                    "
                    >
                      {r?.name}
                    </p>

                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      )}
    </section>
  );
}