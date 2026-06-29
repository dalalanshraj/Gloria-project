import { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

import {
  Link,
  useLocation,
} from "react-router-dom";

import api from "../api/axios";

// ================= LOGOS =================
import WhiteLogo from "../assets/logo/LOGO.png";
import BlackLogo from "../assets/logo/LOGO3.png";

export default function Navbar({ listingId }) {

  const [open, setOpen] = useState(false);

  const [listing, setListing] =
    useState(null);

  const location = useLocation();

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
  // BACKEND DATA
  // =====================================

  const address =
    listing?.location?.address ||
    "Panama City Beach";

  const email =
    listing?.property?.altEmail ||
    "info@example.com";

  const phone =
    listing?.property?.altPhone ||
    "000-000-0000";

  const title =
    listing?.property?.title ||
    "Luxury Condo";

  // =====================================
  // PAGE CHECK
  // =====================================

  const pathname =
    location.pathname;

  // HOME PAGE
  const isHome =
    pathname === "/";

  // SINGLE PROPERTY PAGE
  const isPropertyPage =
    /^\/[^/]+$/.test(pathname) &&
    pathname !== "/about" &&
    pathname !== "/gallery" &&
    pathname !== "/contact-us";

  // =====================================
  // LOGO CHANGE
  // =====================================

  const currentLogo =
    isHome || isPropertyPage
      ? WhiteLogo
      : BlackLogo;

  // =====================================
  // MENU
  // =====================================

  const menuItems = [
    {
      name: "Home",
      path: "/",
    },

    {
      name: "About",
      path: "/about",
    },

    {
      name: "Gallery",
      path: "/gallery",
    },

    {
      name: "Contact",
      path: "/contact-us",
    },
  ];

  return (
    <div className="relative">

      {/* ================= NAVBAR ================= */}

      <header
        className="
        absolute
        top-0
        left-0
        w-full
        flex
        items-center
        justify-between
        px-5
        md:px-10
        py-6
        z-[999999]
      "
      >

        {/* ================= LOGO ================= */}

        <Link to="/">

          <img
           src={open ? BlackLogo : currentLogo}
            alt="logo"
            className="
              w-32
              md:w-40
              object-contain
            "
          />

        </Link>

        {/* ================= TOGGLE ================= */}

        <button
          onClick={() =>
            setOpen(!open)
          }

          className="
          relative
          z-[999999]
          w-12
          h-12
          flex
          flex-col
          justify-center
          items-center
          cursor-pointer
        "
        >

          {/* TOP */}
          <span
            className={`
              block
              absolute
              h-[2px]
              w-10
              rounded-full
              transition-all
              duration-500
              ease-in-out
              ${
                open
                  ? "rotate-45 bg-black"
                  : `-translate-y-3 ${
                      isHome ||
                      isPropertyPage
                        ? "bg-white"
                        : "bg-black"
                    }`
              }
            `}
          />

          {/* MIDDLE */}
          <span
            className={`
              block
              absolute
              h-[2px]
              w-10
              rounded-full
              transition-all
              duration-500
              ease-in-out
              ${
                open
                  ? "opacity-0"
                  : `opacity-100 ${
                      isHome ||
                      isPropertyPage
                        ? "bg-white"
                        : "bg-black"
                    }`
              }
            `}
          />

          {/* BOTTOM */}
          <span
            className={`
              block
              absolute
              h-[2px]
              w-10
              rounded-full
              transition-all
              duration-500
              ease-in-out
              ${
                open
                  ? "-rotate-45 bg-black"
                  : `translate-y-3 ${
                      isHome ||
                      isPropertyPage
                        ? "bg-white"
                        : "bg-black"
                    }`
              }
            `}
          />

        </button>

      </header>

      {/* ================= OVERLAY ================= */}

      <div
        className={`
        fixed
        top-0
        right-0
        h-screen
        w-full
        bg-[#f5f5f5]
        z-[99999]
        transition-all
        duration-700
        ease-in-out
        overflow-y-auto
        ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }
      `}
      >

        <div
          className="
          min-h-screen
          flex
          flex-col
          lg:flex-row
          items-start
          justify-center
          gap-16
          lg:gap-40
          px-6
          sm:px-10
          md:px-20
          py-50
        "
        >

          {/* ================= LEFT ================= */}

          <div className="w-full lg:w-auto">

            <ul className="space-y-5 md:space-y-7">

              {menuItems.map(
                (item, i) => (

                  <li key={i}>

                    <Link
                      to={item.path}

                      onClick={() =>
                        setOpen(false)
                      }

                      className="
                      relative
                      inline-block
                      text-4xl
                      sm:text-5xl
                      md:text-6xl
                      font-playfair
                      font-semibold
                      text-black
                      group
                    "
                    >

                      {item.name}

                      <span
                        className="
                        absolute
                        left-0
                        bottom-1
                        md:bottom-2
                        w-0
                        h-3
                        md:h-4
                        bg-blue-500
                        -z-10
                        transition-all
                        duration-500
                        group-hover:w-full
                      "
                      />

                    </Link>

                  </li>

                )
              )}

            </ul>

          </div>

          {/* ================= RIGHT ================= */}

          <div
            className="
            flex
            flex-col
            md:flex-row
            gap-14
            lg:gap-24
            w-full
            lg:w-auto
          "
          >

            {/* CONTACT */}

            <div className="max-w-sm">

              <h3
                className="
                uppercase
                tracking-[4px]
                text-gray-400
                text-xs
                md:text-sm
                mb-8
              "
              >
                Contact Info
              </h3>

              <div
                className="
                space-y-5
                text-gray-700
                text-base
                md:text-lg
                leading-8
              "
              >

                <p>{address}</p>

                <a
                  href={`mailto:${email}`}
                  className="
                  hover:text-pink-500
                  transition
                  break-all
                  block
                "
                >
                  {email}
                </a>

                <a
                  href={`tel:${phone}`}
                  className="
                  hover:text-pink-500
                  transition
                  block
                "
                >
                  {phone}
                </a>

              </div>

            </div>

            {/* SOCIAL */}

            <div>

              <h3
                className="
                uppercase
                tracking-[4px]
                text-gray-400
                text-xs
                md:text-sm
                mb-8
              "
              >
                {title}
              </h3>

              <div className="flex gap-4 mt-8">

                {[
                  FaFacebookF,
                  FaInstagram,
                  FaTwitter,
                ].map(
                  (Icon, i) => (

                    <div
                      key={i}

                      className="
                      w-11
                      h-11
                      rounded-full
                      border
                      border-gray-300
                      flex
                      items-center
                      justify-center
                      hover:bg-blue-500
                      hover:text-white
                      hover:border-pink-500
                      transition-all
                      duration-300
                      cursor-pointer
                    "
                    >

                      <Icon size={16} />

                    </div>

                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}