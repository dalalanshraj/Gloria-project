import { useEffect, useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import api from "../api/axios";

import { IoLocation } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

import emailjs from "@emailjs/browser";

import { useNavigate } from "react-router-dom";

export default function Contact({ listingId }) {
  const [listing, setListing] = useState(null);

  const [calendarData, setCalendarData] = useState([]);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    adults: "",
    kids: "",
    checkIn: null,
    checkOut: null,
    message: "",
  });

  // =====================================
  // FETCH LISTING
  // =====================================

  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/listings/${listingId}`)

      .then((res) => {
        setListing(res.data);
      })

      .catch(console.log);
  }, [listingId]);

  // =====================================
  // FETCH CALENDAR
  // =====================================

  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/calendar/${listingId}/calendar`)

      .then((res) => {
        setCalendarData(res.data.calendar || []);
      })

      .catch(console.log);
  }, [listingId]);

  // =====================================
  // FORMAT DATE
  // =====================================

  const formatLocalDate = (date) => {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Chicago",

      year: "numeric",

      month: "2-digit",

      day: "2-digit",
    }).format(new Date(date));
  };

  // =====================================
  // BLOCKED MAP
  // =====================================

  const blockedMap = useMemo(() => {
    const map = {};

    calendarData.forEach((item) => {
      const itemDate = new Date(
        new Date(item.date).toLocaleString("en-US", {
          timeZone: "America/Chicago",
        }),
      );

      const key = formatLocalDate(itemDate);

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(item.status);
    });

    return map;
  }, [calendarData]);

  // =====================================
  // DATE TYPE
  // =====================================

  const getDateType = (date) => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const currentDate = new Date(date);

    currentDate.setHours(0, 0, 0, 0);

    // PAST
    if (currentDate < today) {
      return "past-day";
    }

    const currentKey = formatLocalDate(currentDate);

    const statuses = blockedMap[currentKey] || [];

    const hasCIN = statuses.includes("CIN");

    const hasCOUT = statuses.includes("COUT");

    const hasR = statuses.includes("R");

    const hasH = statuses.includes("H");

    // TURNOVER
    if (hasCIN && hasCOUT) {
      return "turnover-day";
    }

    // CHECK-IN
    if (hasCIN) {
      return "checkin-day";
    }

    // CHECK-OUT
    if (hasCOUT) {
      return "checkout-day";
    }

    // BLOCKED
    if (hasR) {
      return "blocked-day";
    }

    // HOLD
    if (hasH) {
      return "hold-day";
    }

    return "available-day";
  };

  // =====================================
  // BLOCKED CHECK
  // =====================================

  const isBlocked = (date) => {
    const key = formatLocalDate(date);

    const statuses = blockedMap[key] || [];

    return statuses.includes("R");
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const dbPayload = {
        property: listingId,

        name: form.name,

        email: form.email,

        phone: form.phone,

        message: form.message,

        Arrival: form.checkIn,

        Departure: form.checkOut,

        Adults: form.adults,

        Kids: form.kids,
      };

      await api.post("/inquiries", dbPayload);

    const recipients = [
  listing?.property?.email,
  listing?.property?.altEmail,
].filter(Boolean);

const emailPayload = {
  to_email: recipients.join(","),

  Recipients: recipients.join(", "),

  property: listing?.property?.title,

  name: form.name,
  email: form.email,
  phone: form.phone,

  Arrival: formatLocalDate(form.checkIn),
  Departure: formatLocalDate(form.checkOut),

  adults: form.adults,
  kids: form.kids,

  message: form.message,
};

for (const recipient of recipients) {
  await emailjs.send(
    "service_t1dtkqc",
    "template_1hmh0cs",
    {
      ...emailPayload,
      to_email: recipient,
    },
    "jViExLAlcltfrIIX0"
  );
}

      setStatus({
        type: "success",

        message: "Booking request sent successfully ✅",
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        adults: "",
        kids: "",
        checkIn: null,
        checkOut: null,
        message: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.log(err);

      setStatus({
        type: "error",

        message: "Something went wrong ❌",
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // NIGHTS
  // =====================================

  const nights =
    form.checkIn && form.checkOut
      ? Math.ceil((form.checkOut - form.checkIn) / (1000 * 60 * 60 * 24))
      : 0;

  return (
    <section className="bg-[#f8f8f5] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* HEADING */}

        <div className="text-center mb-20 mt-17 md:mt-10">
          <p className="uppercase tracking-[6px] text-gray-400 text-xs md:text-sm mb-6">
            Contact & Booking
          </p>

          <h1 className="font-playfair text-black font-bold leading-[0.95] text-5xl sm:text-6xl md:text-7xl lg:text-[90px]">
            Get In Touch
          </h1>

          <p className="mt-8 text-gray-600 max-w-3xl mx-auto text-lg md:text-xl leading-[2]">
            Plan your luxury beachfront stay with live availability and
            unforgettable experiences.
          </p>
        </div>

        {/* MAIN */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">
          {/* LEFT */}

          <div>
            <div className="space-y-6 mb-10">
              {/* LOCATION */}

              <div className="bg-white rounded-[28px] p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#FFE8BE] flex items-center justify-center">
                    <IoLocation size={24} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-xl mb-2">Location</h3>

                    <p className="text-gray-600 leading-7">
                      {listing?.location?.address || "Panama City Beach"}
                    </p>
                  </div>
                </div>
              </div>

              {/* EMAIL */}

              <div className="bg-white rounded-[28px] p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#FFE8BE] flex items-center justify-center">
                    <MdEmail size={24} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-xl mb-2">Email</h3>

                    <p className="text-gray-600 break-all">
                      {listing?.property?.altEmail || "info@example.com"}
                    </p>
                  </div>
                </div>
              </div>

              {/* PHONE */}

              <div className="bg-white rounded-[28px] p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#FFE8BE] flex items-center justify-center">
                    <FaPhoneAlt size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-xl mb-2">Phone</h3>

                    <p className="text-gray-600">
                      {listing?.property?.altPhone || "Phone not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[35px] p-6 md:p-10 shadow-sm space-y-5"
          >
            <h2 className="font-playfair text-4xl md:text-5xl mb-6">
              Book Your Stay
            </h2>

            {/* INPUTS */}

            <input
              placeholder="Full Name"
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <input
              placeholder="Email Address"
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

            <input
              placeholder="Phone Number"
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />

            {/* GUESTS */}

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                min="1"
                placeholder="Adults"
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none"
                value={form.adults}
                onChange={(e) =>
                  setForm({
                    ...form,
                    adults: e.target.value,
                  })
                }
              />

              <input
                type="number"
                min="0"
                placeholder="Kids"
                className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none"
                value={form.kids}
                onChange={(e) =>
                  setForm({
                    ...form,
                    kids: e.target.value,
                  })
                }
              />
            </div>

            {/* CHECK IN / OUT */}

            <div className="grid grid-cols-2 gap-4">
              {/* CHECK IN */}

              <div>
                <label className="text-sm text-gray-500 mb-2 block">
                  Check In
                </label>

                <DatePicker
                  selected={form.checkIn}
                  selectsStart
                  startDate={form.checkIn}
                  endDate={form.checkOut}
                  minDate={new Date()}
                  placeholderText="Select check in"
                  dateFormat="MMM dd, yyyy"
                  dayClassName={getDateType}
                  filterDate={(date) => !isBlocked(date)}
                  onChange={(date) => {
                    setForm({
                      ...form,
                      checkIn: date,
                    });
                  }}
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-2xl
                    px-5
                    py-4
                    outline-none
                  "
                />
              </div>

              {/* CHECK OUT */}

              <div>
                <label className="text-sm text-gray-500 mb-2 block">
                  Check Out
                </label>

                <DatePicker
                  selected={form.checkOut}
                  selectsEnd
                  startDate={form.checkIn}
                  endDate={form.checkOut}
                  minDate={form.checkIn || new Date()}
                  placeholderText="Select check out"
                  dateFormat="MMM dd, yyyy"
                  dayClassName={getDateType}
                  filterDate={(date) => !isBlocked(date)}
                  onChange={(date) => {
                    setForm({
                      ...form,
                      checkOut: date,
                    });
                  }}
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-2xl
                    px-5
                    py-4
                    outline-none
                  "
                />
              </div>
            </div>

            {/* MESSAGE */}

            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full border border-gray-200 rounded-2xl px-5 py-4 outline-none"
              value={form.message}
              onChange={(e) =>
                setForm({
                  ...form,
                  message: e.target.value,
                })
              }
            />

            {/* NIGHTS */}

            {nights > 0 && (
              <p className="text-gray-600">{nights} nights selected</p>
            )}

            {/* STATUS */}

            {status.message && (
              <div
                className={`rounded-2xl px-5 py-4 text-sm ${
                  status.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {status.message}
              </div>
            )}

            {/* BUTTON */}

            <button
              disabled={loading}
              className="w-full bg-[#FFE8BE] hover:scale-[1.02] transition-all duration-300 py-4 rounded-full font-medium text-black tracking-[2px] uppercase"
            >
              {loading ? "Sending..." : "Send Booking"}
            </button>
          </form>
        </div>
      </div>

      {/* DATEPICKER CSS */}

      <style>{`

.react-datepicker {
  border: none !important;
  border-radius: 20px !important;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  font-family: inherit;
}

.react-datepicker__header {
  background: white !important;
  border-bottom: 1px solid #eee !important;
  padding-top: 15px;
}

.react-datepicker__current-month {
  font-weight: 600;
  font-size: 16px;
}

.react-datepicker__day-name,
.react-datepicker__day {
  width: 38px;
  height: 38px;
  line-height: 38px;
  margin: 2px;
  border-radius: 10px;
}

.react-datepicker__day.available-day {
  background: #d1fae5 !important;
}

.react-datepicker__day.blocked-day {
  background: #5C5CFF !important;
  color: white !important;
}

.react-datepicker__day.hold-day {
  background: #facc15 !important;
  color: black !important;
}

.react-datepicker__day.checkin-day {
  background: linear-gradient(
    135deg,
    #d1fae5 50%,
    #5C5CFF 50%
  ) !important;
}

.react-datepicker__day.checkout-day {
  background: linear-gradient(
    315deg,
    #d1fae5 50%,
    #5C5CFF 50%
  ) !important;
}

.react-datepicker__day.turnover-day {
  position: relative !important;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    #5C5CFF 50%,
    #5C5CFF 50%
  ) !important;
}

.react-datepicker__day.turnover-day::after {
  content: "";
  position: absolute;
  width: 160%;
  height: 2px;
  background: black;
  top: 50%;
  left: -30%;
  transform: rotate(-45deg);
}

.react-datepicker__day.past-day {
  background: #f1f1f1 !important;
  opacity: 0.5;
}

.react-datepicker__day--outside-month {
  visibility: hidden !important;
}

      `}</style>
    </section>
  );
}
