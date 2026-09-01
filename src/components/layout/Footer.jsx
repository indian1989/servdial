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
import { useCity } from "../../context/CityContext";
import { useEffect, useState } from "react";
import API from "../../api/axios";

const Footer = () => {
  const { city } = useCity();

  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get(
          "/admin/system-settings"
        );

        const data = res.data?.data;

        const serverSettings = Array.isArray(data)
          ? data[0]
          : data;

        if (serverSettings) {
          setSettings(serverSettings);
        }
      } catch (err) {
        console.error(
          "Failed to fetch footer system settings:",
          err
        );
      }
    };

    fetchSettings();
  }, []);

   /* CATEGORIES */
   
   const categories = [
    { name: "Restaurants & Food", slug: "restaurants-food" },
    { name: "Health & Medical", slug: "health-medical" },
    { name: "Automobiles", slug: "automobiles" },
    { name: "Electricians", slug: "electrician" },
    { name: "Hotels & Accommodation", slug: "hotels-accommodation" },
    { name: "Beauty Parlours", slug: "beauty-parlour" },
    { name: "Gyms", slug: "gym" },
    { name: "Real Estate", slug: "real-estate" },
  
];

    /* CITIES */
    
    const cities = [
      
      { name: "Delhi", slug: "delhi-new-delhi-delhi" },
      { name: "Mumbai", slug: "mumbai-mumbai-suburban-maharashtra" },
      { name: "Bangalore", slug: "bengaluru-bengaluru-urban-karnataka" },
      { name: "Hyderabad", slug: "hyderabad-hyderabad-telangana" },
      { name: "Chennai", slug: "chennai-chennai-tamil-nadu" },
      { name: "Kolkata", slug: "kolkata-kolkata-west-bengal" },
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

    {/* =================================================
    CATEGORIES
================================================= */}

<div>

  <h3 className="text-white font-semibold mb-3">
    {city?.slug
      ? `Popular Categories in ${city.name}`
      : "Popular Categories on ServDial"}
  </h3>

  <ul className="space-y-2 text-sm">

    {categories.map((cat) => (

      <li key={cat.slug}>

        <Link
          to={
            city?.slug
              ? `/${city.slug}/${cat.slug}`
              : `/category/${cat.slug}`
          }
          className="hover:text-white transition-colors"
        >
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

  {settings?.socialLinks?.facebook && (
    <a
      href={settings.socialLinks.facebook}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-blue-500 transition-colors"
      aria-label="ServDial Facebook Page"
    >
      <Facebook size={18} />
    </a>
  )}

  {settings?.socialLinks?.instagram && (
    <a
      href={settings.socialLinks.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-pink-500 transition-colors"
      aria-label="ServDial Instagram Page"
    >
      <Instagram size={18} />
    </a>
  )}

  {settings?.socialLinks?.twitter && (
    <a
      href={settings.socialLinks.twitter}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-sky-500 transition-colors"
      aria-label="ServDial Twitter Page"
    >
      <Twitter size={18} />
    </a>
  )}

  {settings?.socialLinks?.linkedin && (
    <a
      href={settings.socialLinks.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-blue-600 transition-colors"
      aria-label="ServDial LinkedIn Page"
    >
      <Linkedin size={18} />
    </a>
  )}

</div>

        </div>

      </div>

    </footer>
  );
  };

export default Footer;