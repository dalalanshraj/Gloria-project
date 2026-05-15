import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import api from "../api/axios.js";
import { Link } from "react-router-dom";

import logo from "../assets/logo/LOGO.png";

export default function Navbar({ listingId }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const timeoutRef = useRef(null);
  const [contactNumber, setContactNumber] = useState("");

  useEffect(() => {
    if (!listingId) return;

    api
      .get(`/listings/${listingId}`)
      .then((res) => {
        console.log(res.data);

        // ✅ SAME AS ABOUT SECTION
        setContactNumber(res.data?.property?.altPhone || "");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [listingId]);

  // SCROLL EFFECT
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // DROPDOWN
  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    setDropdown(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdown(false);
    }, 200);
  };

  // MENU LINKS
  const links = [
    { name: "Home", path: "/" },

    {
      name: "Photos",
      path: "/gallery",
    },

    { name: "About", path: "/about" },

    {
      name: "Contact",
      path: "/contect-us",
    },
  ];

  return (
    <nav
      className={`fixed w-full  z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/70 backdrop-blur-md shadow-lg"
          : "bg-black/20 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl  mx-auto px-6 md:px-10 py-4">
        {/* MAIN NAV */}
        <div className="flex items-center justify-between">
          {/* LEFT MENU */}
          <ul className="hidden md:flex items-center gap-8 text-white">
            {links.map((link, i) => (
              <li key={i} className="relative group text-[19px] font-medium">
                <Link to={link.path}>{link.name}</Link>

                <span
                  className="
                  absolute 
                  left-0 
                  -bottom-1 
                  w-0 
                  h-[2px] 
                  bg-yellow-400 
                  transition-all 
                  duration-300 
                  group-hover:w-full
                "
                ></span>
              </li>
            ))}
          </ul>

          {/* CENTER LOGO */}
          <div
            className=" pt-13
            absolute 
            left-1/2 
            -translate-x-1/2"
          >
            <Link to="/">
              <img src={logo} alt="logo" className="w-32 md:w-30" />
            </Link>
          </div>

          {/* RIGHT CONTACT */}
          <div className="hidden md:flex items-center">
            <a
              href={`tel:${contactNumber}`}
              className="
              flex 
              items-center 
              gap-3
              bg-white/10
              border
              border-white/20
              backdrop-blur-md
              px-5
              py-3
              rounded-full
              hover:bg-yellow-400
              hover:text-black
              transition-all
              duration-300
              text-white
            "
            >
              <div
                className="
                w-10 
                h-10 
                rounded-full 
                bg-yellow-400 
                text-black
                flex 
                items-center 
                justify-center
              "
              >
                <Phone size={18} />
              </div>

              <div className="leading-tight">
                <p className="text-xs uppercase tracking-wider">
                  Contact Today
                </p>

                <p className="font-semibold text-[15px]">{contactNumber}</p>
              </div>
            </a>
          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden ml-auto text-white">
            <button onClick={() => setOpen(!open)}>
              {open ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          open ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div
          className="
          bg-black/95
          backdrop-blur-lg
          px-6
          py-6
          text-white
          space-y-5
        "
        >
          {links.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              onClick={() => setOpen(false)}
              className="
              block
              text-lg
              border-b
              border-white/10
              pb-3
            "
            >
              {link.name}
            </Link>
          ))}

          {/* MOBILE CONTACT */}
          <a
            href={`tel:${contactNumber}`}
            className="
            flex
            items-center
            gap-3
            bg-yellow-400
            text-black
            rounded-2xl
            px-5
            py-4
            mt-6
          "
          >
            <Phone size={20} />

            <div>
              <p className="text-sm">Contact Today</p>

              <p className="font-bold">{contactNumber}</p>
            </div>
          </a>
        </div>
      </div>
    </nav>
  );
}
