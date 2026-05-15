import { useEffect, useState } from "react";
import api from "../api/axios";
export default function BookingPolicy() {
    const [images, setImages] = useState([]);

  const BASE_URL =
    import.meta.env.VITE_API_URL || "https://30anickoftime.com/";

  useEffect(() => {
    api.get("/gallery/published")
      .then((res) => {
        const data = res.data || [];

        const formatted = data.map((img) => {
          const path = img.image.startsWith("/")
            ? img.image
            : "/" + img.image;

          return `https://30anickoftime.com/${path}`;
        });

        setImages(formatted);
      })
      .catch(console.log);
  }, []);

  // 👉 fallback images (important)
  const image1 =
    images[0] ||
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511";

  const image2 =
    images[1] ||
    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0";

  const heroImage = images[2] || image1;
  return (
    <>
    {/* 🔥 HERO */}
      <section className="relative h-[20vh] flex items-center justify-center text-white">

        <div
          className="absolute inset-0 bg-fixed bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Booking Policy
          </h1>
          {/* <p className="text-gray-200 max-w-xl mx-auto">
            Discover comfort, luxury, and unforgettable stays with us.
          </p> */}
        </div>
      </section>

    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
          Booking Policy
        </h1>

        <div className="space-y-5 text-gray-700 text-sm md:text-base leading-relaxed">
          <p className="font-semibold text-center text-lg text-blue-600">
            ALL RENTALS DURING PEAK SEASON ARE STRICTLY
          </p>

          <p className="text-center font-bold text-xl tracking-wide">
            ************ SATURDAY - SATURDAY ************
          </p>

          <p>
            All payments must be made directly to the property owner. A deposit
            is required and must be received within one week of reserving the
            condo in order to confirm your booking.
          </p>

          <p>
            The final payment is due 30 days prior to your arrival date. However,
            you are welcome to complete the full payment anytime before the due
            date for your convenience.
          </p>

          <p>
            Once your booking is confirmed, a rental contract will be provided.
            Please ensure that you carefully read the entire contract, paying
            special attention to the refund policy, especially in cases of
            evacuation or unexpected circumstances.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <p className="text-blue-700 font-medium">
              Important: Kindly review all terms and conditions thoroughly to
              avoid any misunderstandings during your stay.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
