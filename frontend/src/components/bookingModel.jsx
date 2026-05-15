import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axios";
import emailjs from "@emailjs/browser";
import modelImg from "../assets/img3.png";

export default function BookingModalContact({ listingId, onClose }) {
  const [blockedDates, setBlockedDates] = useState([]);
  const [selecting, setSelecting] = useState("checkIn");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    adults: "1",
    kids: "0",
    checkIn: null,
    checkOut: null,
    message: "",
  });

  const fetchDates = () => {
    api
      .get("/calendar/blocked")
      .then((res) => setBlockedDates(res.data))
      .catch(console.log);
  };

  useEffect(() => {
    fetchDates();
  }, []);

  const isBlocked = (date) => {
    return blockedDates.some((r) => {
      const s = new Date(r.start);
      const e = new Date(r.end);
      return date >= s && date < e;
    });
  };

  const isRangeValid = (start, end) => {
    if (!start || !end) return false;

    return !blockedDates.some((r) => {
      const s = new Date(r.start);
      const e = new Date(r.end);
      return start < e && end > s;
    });
  };
  const isSameDay = (a, b) => a.toDateString() === b.toDateString();
  const getDateType = (date) => {
    // 🔥 turnover first
    for (let i = 0; i < blockedDates.length; i++) {
      const currentEnd = new Date(blockedDates[i].end);

      for (let j = 0; j < blockedDates.length; j++) {
        const nextStart = new Date(blockedDates[j].start);

        const diff = (nextStart - currentEnd) / (1000 * 60 * 60 * 24);

        if ((diff === 0 || diff === 1) && isSameDay(date, currentEnd)) {
          return "turnover-day";
        }
      }
    }

    // normal
    for (let r of blockedDates) {
      const start = new Date(r.start);
      const end = new Date(r.end);

      if (isSameDay(date, start)) return "checkin-day";
      if (isSameDay(date, end)) return "checkout-day";
      if (date > start && date < end) return "blocked-day";
    }

    return "available-day";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const propertyId = listingId || id;

    if (!propertyId) {
      aa;
      alert("Property not found ❌");
      return;
    }

    if (!form.name || !form.email || !form.phone) {
      alert("Please fill all details ⚠️");
      return;
    }

    if (!form.checkIn || !form.checkOut) {
      alert("Please select dates 📅");
      return;
    }

    try {
      setLoading(true);

      const dbPayload = {
        property: propertyId, // ✅ FIXED
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message || "",

        Arrival: form.checkIn,
        Departure: form.checkOut,

        Adults: form.adults,
        Kids: form.kids,
      };

      console.log("SENDING:", dbPayload);

      await api.post("/inquiries", dbPayload);

      const emailPayload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        checkIn: form.checkIn.toDateString(),
        checkOut: form.checkOut.toDateString(),
        adults: form.adults,
        kids: form.kids,
        message: form.message,
      };

      await emailjs.send(
        "service_x4xnlqz",
        "template_oeep0hc",
        emailPayload,
        "CRTc5BG_9M1t3EjYj",
      );

      alert("Booking request sent ✅");
    } catch (err) {
      console.log("ERROR:", err.response?.data || err);
      alert(err.response?.data?.error || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  const nights =
    form.checkIn && form.checkOut
      ? Math.ceil((form.checkOut - form.checkIn) / (1000 * 60 * 60 * 24))
      : 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
        <div className="w-full max-w-5xl h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex">
          {/* LEFT IMAGE */}
          <div className="hidden md:block md:w-1/2 h-48 md:h-full">
            <img src={modelImg} className="w-full h-full object-cover" />
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-1/2 h-full flex flex-col">
            {/* HEADER */}
            <div className="relative p-5">
              <h2 className="text-2xl font-semibold text-center">
                Book Your Stay
              </h2>

              {/* ❌ CLOSE ICON */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-2xl hover:scale-110"
              >
                ✕
              </button>
            </div>

            {/* SCROLL */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* 🔥 MESSAGE */}
              {error && (
                <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-100 text-green-600 p-2 rounded mb-3 text-sm">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  placeholder="Name"
                  className="w-full border p-3 rounded-lg"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <input
                  placeholder="Email"
                  className="w-full border p-3 rounded-lg"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <input
                  placeholder="Phone"
                  className="w-full border p-3 rounded-lg"
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                {/* Guests */}
                <div className="flex gap-3">
                  {/* Adults */}
                  <div className="w-full">
                    <label className="text-sm text-gray-500">Adults</label>
                    <input
                      type="number"
                      min="1"
                      value={form.adults}
                      className="w-full border p-3 rounded-lg"
                      onChange={(e) =>
                        setForm({ ...form, adults: Number(e.target.value) })
                      }
                    />
                  </div>

                  {/* Kids */}
                  <div className="w-full">
                    <label className="text-sm text-gray-500">Kids</label>
                    <input
                      type="number"
                      min="0"
                      value={form.kids}
                      className="w-full border p-3 rounded-lg"
                      onChange={(e) =>
                        setForm({ ...form, kids: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
                {/* DATE */}
                <div className="flex gap-3">
                  <div
                    onClick={() => setSelecting("checkIn")}
                    className="w-full p-3 border rounded-lg text-center cursor-pointer"
                  >
                    {form.checkIn ? form.checkIn.toDateString() : "Check-in"}
                  </div>

                  <div
                    onClick={() => setSelecting("checkOut")}
                    className="w-full p-3 border rounded-lg text-center cursor-pointer"
                  >
                    {form.checkOut ? form.checkOut.toDateString() : "Check-out"}
                  </div>
                </div>

                {/* CALENDAR */}
                <div className="border rounded-xl p-2 ">
                  <DatePicker
                    inline
                    selectsRange
                    startDate={form.checkIn}
                    endDate={form.checkOut}
                    onChange={(dates) => {
                      const [start, end] = dates;

                      if (selecting === "checkIn") {
                        setForm({
                          ...form,
                          checkIn: start,
                          checkOut: null,
                        });
                        setSelecting("checkOut");
                      } else {
                        setForm({
                          ...form,
                          checkIn: form.checkIn,
                          checkOut: end,
                        });
                      }
                    }}
                    minDate={new Date()}
                    dayClassName={getDateType}
                  />
                </div>
                <textarea
                  placeholder="Your Message"
                  className="w-full border p-3 rounded-lg"
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                />

                {nights > 0 && (
                  <p className="text-sm text-gray-600">
                    {nights} nights selected
                  </p>
                )}
                <p className=" text-sm mt-2 text-black">
                  Cleaning Fee - 850 - Mandatory
                </p>
                <button className="w-full bg-[#FFE8BE] py-3 rounded-lg">
                  Send Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ STYLE FIX */}
      <style>{`
      .react-datepicker__day.past-day {
        background: #eee !important;
        color: #999 !important;
        pointer-events: none;
      }

      .react-datepicker__day.blocked-day {
        background: #5C5CFF !important;
        color: white !important;
        text-decoration: line-through;
        border-radius: 6px;
      }

      .react-datepicker__day.available-day {
        background: #e6fffb !important;
        border-radius: 6px;
      }

      .react-datepicker__day.selected-range {
        background: #1890ff !important;
        color: white !important;
        border-radius: 6px;
      }

      .react-datepicker__day:hover {
        background: #6366f1 !important;
        color: white !important;
      }
    `}</style>
    </>
  );
}
