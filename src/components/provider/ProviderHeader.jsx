import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaHome,
  FaStore,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function ProviderHeader() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex items-center justify-between bg-white border-b px-6 py-3 shadow-sm sticky top-0 z-20">

      {/* LEFT: HOME + SEARCH */}
      <div className="flex items-center gap-4 w-1/2">

        {/* HOME BUTTON */}
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
        >
          <FaHome />
          Home
        </Link>

        {/* BUSINESS QUICK LINK */}
        <Link
          to="/provider/businesses"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
        >
          <FaStore />
          Businesses
        </Link>

        {/* SEARCH */}
        <div className="flex items-center gap-3 w-full bg-gray-50 px-3 py-2 rounded-md">
          <FaSearch className="text-gray-400" />
          <input
            placeholder="Search your businesses, leads, reviews..."
            className="w-full outline-none text-sm bg-transparent"
          />
        </div>

      </div>

      {/* RIGHT: ACTIONS */}
      <div className="flex items-center gap-5">

        {/* NOTIFICATIONS */}
        <div className="relative cursor-pointer">
          <FaBell className="text-gray-600 text-lg hover:text-blue-600 transition" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
            2
          </span>
        </div>

        {/* ROLE BADGE */}
        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium capitalize">
          {user?.role === "provider" ? "Business Owner" : user?.role}
        </span>

        {/* USER INFO */}
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-2xl text-gray-600" />

          <div className="text-sm leading-tight">
            <div className="font-medium">{user?.name}</div>
            <div className="text-gray-400 text-xs">Provider Panel</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProviderHeader;