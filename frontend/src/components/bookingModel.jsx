import { useEffect, useState, useMemo, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axios";
import emailjs from "@emailjs/browser";
import modelImg from "../assets/img.jpg";

export default function BookingModalContact({
  listingId,
  onClose,
}) {
  const [calendarDates, setCalendarDates] = useState([]);
  const [listing, setListing] = useState(null);

  const [selecting, setSelecting] =
    useState("checkIn");

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    adults: 1,
    kids: 0,
    checkIn: null,
    checkOut: null,
    message: "",
  });

  // =====================================
  // FETCH CALENDAR
  // =====================================

 useEffect(() => {
  if (listingId) {
    fetchDates();
    fetchListing();
  }
}, [listingId]);
  const fetchDates = async () => {
    try {
      const res = await api.get(
        `/calendar/${listingId}/calendar`
      );

      setCalendarDates(
        res.data.calendar || []
      );
    } catch (err) {
      console.log(err);
    }
  };
  const fetchListing = async () => {
  try {
    const res = await api.get(`/listings/${listingId}`);

    setListing(res.data);
  } catch (err) {
    console.log(err);
  }
};

  // =====================================
  // DATE FORMAT
  // =====================================

  const formatLocalDate = (date) => {
    return new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "America/Chicago",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(new Date(date));
  };

  // =====================================
  // BLOCKED MAP
  // =====================================

  const blockedMap = useMemo(() => {
    const map = {};

    calendarDates.forEach((item) => {
      const itemDate = new Date(
        new Date(item.date).toLocaleString(
          "en-US",
          {
            timeZone:
              "America/Chicago",
          }
        )
      );

      const key =
        formatLocalDate(itemDate);

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(item.status);
    });

    return map;
  }, [calendarDates]);

  // =====================================
  // DATE TYPE
  // =====================================

  const getDateType = useCallback(
    (date) => {
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const currentDate = new Date(
        date
      );

      currentDate.setHours(
        0,
        0,
        0,
        0
      );

      if (currentDate < today) {
        return "past-day";
      }

      const currentKey =
        formatLocalDate(currentDate);

      const statuses =
        blockedMap[currentKey] || [];

      const hasCIN =
        statuses.includes("CIN");

      const hasCOUT =
        statuses.includes("COUT");

      const hasR =
        statuses.includes("R");

      const hasH =
        statuses.includes("H");

      const prevDay = new Date(
        currentDate
      );

      prevDay.setDate(
        prevDay.getDate() - 1
      );

      const prevKey =
        formatLocalDate(prevDay);

      const prevStatuses =
        blockedMap[prevKey] || [];

      const prevHasBooking =
        prevStatuses.includes("R") ||
        prevStatuses.includes("COUT");

      if (hasCIN && hasCOUT) {
        return "turnover-day";
      }

      if (
        hasCIN &&
        prevHasBooking
      ) {
        return "turnover-day";
      }

      if (hasCIN) {
        return "checkin-day";
      }

      if (hasCOUT) {
        return "checkout-day";
      }

      if (hasR) {
        return "blocked-day";
      }

      if (hasH) {
        return "hold-day";
      }

      return "available-day";
    },
    [blockedMap]
  );

  // =====================================
  // DATE SELECT
  // =====================================

  const handleDateChange = (
    dates
  ) => {
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
  };

  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.phone
    ) {
      return alert(
        "Please fill all details"
      );
    }

    if (
      !form.checkIn ||
      !form.checkOut
    ) {
      return alert(
        "Please select dates"
      );
    }

    try {
      setLoading(true);

      await api.post("/inquiries", {
        property: listingId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        Arrival: form.checkIn,
        Departure: form.checkOut,
        Adults: form.adults,
        Kids: form.kids,
      });

     const recipients = [
  listing?.property?.email,
  listing?.property?.altEmail,
].filter(Boolean);

console.log("Recipients:", recipients);

for (const recipient of recipients) {

  await emailjs.send(
    "service_24r0j2n",
    "template_of44swa",
    {
      to_email: recipient,

      property: listing?.property?.title,

      name: form.name,
      email: form.email,
      phone: form.phone,

      Arrival: formatLocalDate(form.checkIn),
      Departure: formatLocalDate(form.checkOut),

      adults: form.adults,
      kids: form.kids,
      message: form.message,
    },
    "rT74gL23XsIP2be41"
  );
}

      alert(
        "Booking request sent"
      );

      onClose();
    } catch (err) {
      console.log(err);

      alert(
        err?.response?.data
          ?.error ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // NIGHTS
  // =====================================

  const nights =
    form.checkIn &&
    form.checkOut
      ? Math.ceil(
          (form.checkOut -
            form.checkIn) /
            (1000 *
              60 *
              60 *
              24)
        )
      : 0;

  return (
    <>
      {/* OVERLAY */}
      <div className="fixed inset-0 z-[999999] bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">

        {/* MODAL */}
        <div
          className="
          relative
          w-full
          max-w-6xl
          h-[95vh]
          bg-[#faf8f5]
          rounded-[30px]
          overflow-hidden
          shadow-[0_20px_80px_rgba(0,0,0,0.35)]
          flex
          flex-col
          lg:flex-row
          border
          border-white/20
        "
        >

          {/* LEFT IMAGE */}
          <div className="hidden lg:block lg:w-[48%] h-full relative overflow-hidden">
            <img
              src={modelImg}
              alt=""
              className="
              w-full
              h-full
              object-cover
              scale-105
              hover:scale-110
              transition-all
              duration-[3000ms]
            "
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/30" />

            {/* TEXT */}
            <div className="absolute bottom-12 left-10 z-10 text-white">
              <p className="uppercase tracking-[5px] text-sm text-white/80 mb-4">
                Luxury Stay
              </p>

              <h2 className="font-playfair text-5xl leading-tight">
                Book Your
                <br />
                Dream Vacation
              </h2>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-[52%] h-full flex flex-col">

            {/* HEADER */}
            <div className="relative px-6 sm:px-8 pt-7 pb-5 border-b border-gray-200">

              <p className="uppercase tracking-[4px] text-xs text-gray-400 mb-3">
                Reservation
              </p>

              <h2 className="text-3xl sm:text-4xl font-playfair text-black">
                Book Your Stay
              </h2>

              {/* CLOSE */}
              <button
                onClick={onClose}
                className="
                absolute
                top-6
                right-6
                w-11
                h-11
                rounded-full
                border
                border-gray-300
                flex
                items-center
                justify-center
                text-xl
                hover:bg-black
                hover:text-white
                transition-all
                duration-300
              "
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6">

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* NAME */}
                <input
                  type="text"
                  placeholder="Full Name"
                  className="
                  w-full
                  border
                  border-gray-300
                  bg-white
                  px-5
                  py-4
                  rounded-xl
                  outline-none
                  focus:border-black
                  transition-all
                  duration-300
                "
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name:
                        e.target.value,
                    })
                  }
                />

                {/* EMAIL */}
                <input
                  type="email"
                  placeholder="Email Address"
                  className="
                  w-full
                  border
                  border-gray-300
                  bg-white
                  px-5
                  py-4
                  rounded-xl
                  outline-none
                  focus:border-black
                  transition-all
                  duration-300
                "
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email:
                        e.target.value,
                    })
                  }
                />

                {/* PHONE */}
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="
                  w-full
                  border
                  border-gray-300
                  bg-white
                  px-5
                  py-4
                  rounded-xl
                  outline-none
                  focus:border-black
                  transition-all
                  duration-300
                "
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone:
                        e.target.value,
                    })
                  }
                />

                {/* GUESTS */}
                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="text-sm text-gray-500 mb-2 block">
                      Adults
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={form.adults}
                      className="
                      w-full
                      border
                      border-gray-300
                      bg-white
                      px-5
                      py-4
                      rounded-xl
                      outline-none
                      focus:border-black
                    "
                      onChange={(e) =>
                        setForm({
                          ...form,
                          adults:
                            Number(
                              e.target
                                .value
                            ),
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-500 mb-2 block">
                      Kids
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={form.kids}
                      className="
                      w-full
                      border
                      border-gray-300
                      bg-white
                      px-5
                      py-4
                      rounded-xl
                      outline-none
                      focus:border-black
                    "
                      onChange={(e) =>
                        setForm({
                          ...form,
                          kids:
                            Number(
                              e.target
                                .value
                            ),
                        })
                      }
                    />
                  </div>

                </div>

                {/* DATE BOXES */}
                <div className="grid grid-cols-2 gap-4">

                  <div
                    onClick={() =>
                      setSelecting(
                        "checkIn"
                      )
                    }
                    className="
                    py-4
                    border
                    border-gray-300
                    bg-white
                    rounded-xl
                    text-center
                    cursor-pointer
                    hover:border-black
                    transition-all
                    duration-300
                    font-medium
                  "
                  >
                    {form.checkIn
                      ? formatLocalDate(
                          form.checkIn
                        )
                      : "Check-In"}
                  </div>

                  <div
                    onClick={() =>
                      setSelecting(
                        "checkOut"
                      )
                    }
                    className="
                    py-4
                    border
                    border-gray-300
                    bg-white
                    rounded-xl
                    text-center
                    cursor-pointer
                    hover:border-black
                    transition-all
                    duration-300
                    font-medium
                  "
                  >
                    {form.checkOut
                      ? formatLocalDate(
                          form.checkOut
                        )
                      : "Check-Out"}
                  </div>

                </div>

                {/* CALENDAR */}
                <div className="border border-gray-200 rounded-2xl bg-white p-3 overflow-x-auto">
                  <DatePicker
                    inline
                    selectsRange
                    startDate={
                      form.checkIn
                    }
                    endDate={
                      form.checkOut
                    }
                    onChange={
                      handleDateChange
                    }
                    minDate={
                      new Date()
                    }
                    dayClassName={
                      getDateType
                    }
                    fixedHeight
                    showPopperArrow={
                      false
                    }
                    showOtherMonths={
                      false
                    }
                    filterDate={(
                      date
                    ) => {
                      const today =
                        new Date();

                      today.setHours(
                        0,
                        0,
                        0,
                        0
                      );

                      const current =
                        new Date(date);

                      current.setHours(
                        0,
                        0,
                        0,
                        0
                      );

                      return (
                        current >=
                        today
                      );
                    }}
                  />
                </div>

                {/* MESSAGE */}
                <textarea
                  placeholder="Your Message"
                  className="
                  w-full
                  border
                  border-gray-300
                  bg-white
                  px-5
                  py-4
                  rounded-xl
                  outline-none
                  focus:border-black
                  transition-all
                  duration-300
                  min-h-[120px]
                  resize-none
                "
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message:
                        e.target.value,
                    })
                  }
                />

                {/* NIGHTS */}
                {nights > 0 && (
                  <p className="text-sm text-gray-600">
                    {nights} nights
                    selected
                  </p>
                )}

                {/* BUTTON */}
                <button
                  disabled={loading}
                  className="
                  w-full
                  bg-black
                  hover:bg-[#1a1a1a]
                  text-white
                  py-4
                  rounded-full
                  uppercase
                  tracking-[3px]
                  text-sm
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                "
                >
                  {loading
                    ? "Sending..."
                    : "Send Booking"}
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>

      {/* CALENDAR STYLES */}
      <style>{`

.react-datepicker {
  border: none;
  width: 100%;
  max-width: 100%;
  font-family: 'Poppins', sans-serif;
}

.react-datepicker__month-container {
  width: 100%;
}

.react-datepicker__header {
  background: white;
  border-bottom: none;
  padding-top: 10px;
}

.react-datepicker__current-month {
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
}

.react-datepicker__week {
  display: flex;
  justify-content: space-between;
}

.react-datepicker__day,
.react-datepicker__day-name {
  width: 38px;
  height: 38px;
  line-height: 38px;
  margin: 3px;
  border-radius: 10px;
}

/* AVAILABLE */
.react-datepicker__day.available-day {
  background: #d1fae5 !important;
  color: black !important;
}

/* BOOKED */
.react-datepicker__day.blocked-day {
  background: #5C5CFF !important;
  color: white !important;
}

/* HOLD */
.react-datepicker__day.hold-day {
  background: #facc15 !important;
  color: black !important;
}

  /* CHECK-IN */
.react-datepicker__day.checkin-day {

  background: linear-gradient(
    135deg,
    #d1fae5 50%,
    #5C5CFF 50%
  ) !important;

  color: black !important;
}

/* CHECK-OUT */
.react-datepicker__day.checkout-day {

  background: linear-gradient(
    315deg,
    #d1fae5 50%,
    #5C5CFF 50%
  ) !important;

  color: black !important;
}

/* TURNOVER */
.react-datepicker__day.turnover-day {

  position: relative !important;

  background: linear-gradient(
    315deg,
    #5C5CFF 50%,
    #5C5CFF 50%
  ) !important;

  color: black !important;

  overflow: hidden;
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

  z-index: 5;
}
/* OUTSIDE DAYS */
.react-datepicker__day--outside-month {

  visibility: hidden !important;
  pointer-events: none !important;

}

     

      `}</style>
    </>
  );
}