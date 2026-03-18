import { Link, useLocation } from "react-router-dom";
import { providerRoutes } from "../../routes/routeConfig";
import { FaBars, FaTimes } from "react-icons/fa";

function ProviderSidebar({ sidebarOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-gray-900 text-white min-h-screen p-4 transition-all duration-300">
        <SidebarContent location={location} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-4 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={onClose}
            className="mb-4 text-white text-xl font-bold"
          >
            <FaTimes />
          </button>
          <SidebarContent location={location} />
        </div>
      </div>
    </>
  );
}

// Sidebar content with icons
function SidebarContent({ location }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-6">Provider Panel</h2>
      <ul className="space-y-3">
        {providerRoutes.map((route) => {
          const isActive = location.pathname.startsWith(route.path);

          return (
            <li key={route.path}>
              <Link
                to={route.path}
                className={`flex items-center gap-2 p-2 rounded transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white font-semibold"
                    : "hover:bg-gray-700"
                }`}
              >
                {/* Icon if provided */}
                {route.icon && <route.icon className="w-5 h-5" />}
                <span>{route.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default ProviderSidebar;