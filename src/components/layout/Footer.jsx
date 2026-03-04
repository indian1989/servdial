import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Grid Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo + About */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              ServDial
            </h2>
            <p className="text-sm text-gray-400 leading-6">
              ServDial is India's trusted business listing platform.
              Discover top services near you across multiple cities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Home</li>
              <li className="hover:text-white cursor-pointer">All Businesses</li>
              <li className="hover:text-white cursor-pointer">Add Business</li>
              <li className="hover:text-white cursor-pointer">Login</li>
              <li className="hover:text-white cursor-pointer">Register</li>
            </ul>
          </div>

          {/* Top Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Top Categories
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer">Electrician</li>
              <li className="hover:text-white cursor-pointer">Plumber</li>
              <li className="hover:text-white cursor-pointer">Hotels</li>
              <li className="hover:text-white cursor-pointer">Restaurant</li>
              <li className="hover:text-white cursor-pointer">AC Repair</li>
            </ul>
          </div>

          {/* Contact + Social */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h3>
            <p className="text-sm mb-2">Email: support@servdial.com</p>
            <p className="text-sm mb-4">Phone: +91 90000 00000</p>

            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 flex items-center justify-center rounded-full hover:bg-blue-600 transition"
                aria-label="Facebook"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 flex items-center justify-center rounded-full hover:bg-pink-500 transition"
                aria-label="Instagram"
              >
                <FaInstagram size={14} />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 flex items-center justify-center rounded-full hover:bg-blue-400 transition"
                aria-label="Twitter"
              >
                <FaTwitter size={14} />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 flex items-center justify-center rounded-full hover:bg-blue-700 transition"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={14} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ServDial. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;