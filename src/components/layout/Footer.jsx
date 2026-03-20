import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const categories = [
    "Restaurants",
    "Hospitals",
    "Plumbers",
    "Electricians",
    "Hotels",
    "Beauty Salons",
    "Gyms",
    "Real Estate",
  ];

  const cities = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Patna",
    "Pune",
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">

      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">

        {/* BRAND */}
        <div>
          <h2 className="text-white text-xl font-bold mb-3">
            ServDial
          </h2>

          <p className="text-sm text-gray-400 mb-4">
            ServDial helps you discover trusted local businesses
            near you. Search services, contact providers instantly,
            and explore top rated businesses across cities.
          </p>

          {/* CONTACT */}
          <div className="space-y-2 text-sm">

            <div className="flex items-center gap-2">
              <MapPin size={16} />
              India
            </div>

            <div className="flex items-center gap-2">
              <Mail size={16} />
              support.servdial@gmail.com
            </div>

            <div className="flex items-center gap-2">
              <Phone size={16} />
              +91 6200152506
            </div>

          </div>
        </div>

        {/* COMPANY LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-3">
            Company
          </h3>

          <ul className="space-y-2 text-sm">

            <li>
              <Link to="/about" className="hover:text-white">
                About Us
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>

            <li>
              <Link to="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link to="/terms" className="hover:text-white">
                Terms of Service
              </Link>
            </li>

            <li>
              <Link to="/advertise" className="hover:text-white">
                Advertise Wth Us
              </Link>
            </li>

             <li>
              <Link to="/disclaimer" className="hover:text-white">
                Disclaimer
              </Link>
            </li>

            <li>
              <Link to="/faq" className="hover:text-white">
                FAQ's
              </Link>
            </li>


          </ul>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3 className="text-white font-semibold mb-3">
            Popular Categories
          </h3>

          <ul className="space-y-2 text-sm">

            {categories.map((cat, i) => (
              <li key={i}>
                <Link
                  to={`/search?q=${cat}`}
                  className="hover:text-white"
                >
                  {cat}
                </Link>
              </li>
            ))}

          </ul>
        </div>

        {/* CITIES */}
        <div>
          <h3 className="text-white font-semibold mb-3">
            Popular Cities
          </h3>

          <ul className="space-y-2 text-sm">

            {cities.map((city, i) => (
              <li key={i}>
                <Link
                  to={`/search?city=${city}`}
                  className="hover:text-white"
                >
                  {city}
                </Link>
              </li>
            ))}

          </ul>
        </div>

      </div>

      {/* SOCIAL + COPYRIGHT */}
      <div className="border-t border-gray-800">

        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} ServDial. All rights reserved.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4">

            <a href="#" className="hover:text-white">
              <Facebook size={18} />
            </a>

            <a href="#" className="hover:text-white">
              <Instagram size={18} />
            </a>

            <a href="#" className="hover:text-white">
              <Twitter size={18} />
            </a>

            <a href="#" className="hover:text-white">
              <Linkedin size={18} />
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;