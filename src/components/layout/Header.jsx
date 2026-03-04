import { useState, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import CityDropdown from "../common/CityDropdown";
import GPSButton from "../common/GPSButton";
import ServDialLogo from "../../assets/ServDial.png";

const servicesList = [
  "Plumber",
  "Electrician",
  "AC Repair",
  "Carpenter",
  "Painter",
  "Home Cleaning",
  "Salon",
  "Restaurant",
  "Hotel",
  "Doctor",
  "Gym",
  "Interior Designer"
];

const Header = () => {
  const navigate = useNavigate();
  const { city } = useParams();

  const [service, setService] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredServices = useMemo(() => {
    if (!service) return [];
    return servicesList.filter((s) =>
      s.toLowerCase().includes(service.toLowerCase())
    );
  }, [service]);

  const handleSelectService = (selectedService) => {
    if (!city) {
      alert("Please select a city first");
      return;
    }
    navigate(`/${city.toLowerCase()}/${selectedService.toLowerCase()}`);
    setService("");
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city) {
      alert("Please select a city first");
      return;
    }
    if (!service.trim()) return;
    navigate(`/${city.toLowerCase()}/${service.toLowerCase()}`);
    setService("");
    setShowSuggestions(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Left: Logo + City/Search */}
        <div className="flex items-center gap-6 flex-1">

          {/* Logo */}
          <div className="flex flex-col leading-tight">
            <Link to="/">
              <img
                src={ServDialLogo}
                alt="ServDial Logo"
                className="h-20 md:h-36 w-auto"
              />
            </Link>
            
          </div>

          {/* City + Search + GPS */}
          <div className="flex items-center gap-4 relative flex-1">
            <CityDropdown />

            <div className="relative flex-1">
              <form onSubmit={handleSubmit} className="flex">
                <input
                  type="text"
                  placeholder="Search service..."
                  value={service}
                  onChange={(e) => { setService(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => service && setShowSuggestions(true)}
                  className="border px-3 py-2 rounded-l-md text-sm w-full focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 text-sm"
                >
                  Search
                </button>
              </form>

              {/* Suggestions Dropdown */}
              {showSuggestions && filteredServices.length > 0 && (
                <div className="absolute bg-white shadow-lg w-full mt-1 rounded-md z-50 max-h-56 overflow-y-auto">
                  {filteredServices.map((s) => (
                    <div
                      key={s}
                      onClick={() => handleSelectService(s)}
                      className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <GPSButton /> {/* proper gap with search and city dropdown */}
          </div>

        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700 ml-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/mumbai" className="hover:text-blue-600">All Businesses</Link>
          <Link to="/add-business" className="hover:text-blue-600">Add Business</Link>
          <Link to="/login" className="hover:text-blue-600">Login</Link>
        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden ml-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            ☰
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col gap-2 p-4 md:hidden z-50">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/mumbai" className="hover:text-blue-600">All Businesses</Link>
            <Link to="/add-business" className="hover:text-blue-600">Add Business</Link>
            <Link to="/login" className="hover:text-blue-600">Login</Link>
          </div>
        )}

      </div>
    </header>
  );
};

export default Header;