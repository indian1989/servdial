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
  
   /* CATEGORIES */
   
   const categories = [
    { name: "Restaurants & Food", slug: "restaurants-food" },
    { name: "Health & Medical", slug: "health-medical" },
    { name: "Automobiles", slug: "automobiles" },
    { name: "Electricians", slug: "electrician" },
    { name: "Hotels & Accommondation", slug: "hotels-accommondation" },
    { name: "Beauty Parlours", slug: "beauty-parlour" },
    { name: "Gyms", slug: "gym" },
    { name: "Real Estate", slug: "real-estate" },
  
];

    /* CITIES */
    
    const cities = [
      
      { name: "Delhi", slug: "delhi-new-delhi-delhi" },
      { name: "Mumbai", slug: "mumbai" },
      { name: "Bangalore", slug: "bangalore" },
      { name: "Hyderabad", slug: "hyderabad" },
      { name: "Chennai", slug: "chennai" },
      { name: "Kolkata", slug: "kolkata" },
      { name: "Patna", slug: "patna-patna-bihar" },
      { name: "Pune", slug: "pune-pune-maharashtra" },
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
                About ServDial
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-white">
                Contact ServDial
              </Link>
            </li>

             <li>
              <Link to="/advertise" className="hover:text-white">
                Advertise With ServDial
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
              <Link to="/community-guidelines" className="hover:text-white">
                Community Guidelines
              </Link>
            </li>

            <li>
              <Link to="/disclaimer" className="hover:text-white">
                Disclaimer
              </Link>
            </li>

             <li>
              <Link to="/provider-agreement" className="hover:text-white">
                Provider Agreement
              </Link>
            </li>
             <li>
              <Link to="/refund-policy" className="hover:text-white">
                Refund Policy
              </Link>
            </li>

            <li>
              <Link to="/faq" className="hover:text-white">
                ServDial FAQ's
              </Link>
            </li>


          </ul>
        </div>

        {/* CATEGORIES */}
        
        <div>

          <h3 className="text-white font-semibold mb-3">
            Popular Categories on ServDial
            </h3>
            
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/category/${cat.slug}`}
                  className="hover:text-white transition-colors" >
                    {cat.name}
                    </Link>
                    </li>
                  ))}
                  </ul>
                  
                  </div>

      {/* CITIES */}
      
      <div>
        
        <h3 className="text-white font-semibold mb-3">
         
          Popular Cities on ServDial
          
          </h3>
          
          <ul className="space-y-2 text-sm">
            {cities.map((city) => (
              
              <li key={city.slug}>
                <Link to={`/${city.slug}/all`}
                className="hover:text-white transition-colors" >
                  {city.name}
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

            <a
              href="https://www.facebook.com/ServDialdotcom/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
              aria-label="ServDial Facebook Page"
            >
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