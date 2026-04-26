import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FaBell, FaSearch, FaUserCircle, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

function AdminHeader() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex items-center justify-between bg-white border-b px-6 py-3 shadow-sm sticky top-0 z-20">

      {/* LEFT: SEARCH + HOME */}
      <div className="flex items-center gap-4 w-1/2">

        {/* HOME BUTTON */}
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
        >
          <FaHome />
          Home
        </Link>

        {/* SEARCH */}
        <div className="flex items-center gap-3 w-full bg-gray-50 px-3 py-2 rounded-md">
          <FaSearch className="text-gray-400" />
          <input
            placeholder="Search businesses, users, cities..."
            className="w-full outline-none text-sm bg-transparent"
          />
        </div>
      </div>

      {/* RIGHT: ACTIONS */}
      <div className="flex items-center gap-5">

        {/* NOTIFICATIONS */}
        <div className="relative cursor-pointer">
          <FaBell className="text-gray-600 text-lg hover:text-indigo-600 transition" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
            3
          </span>
        </div>

        {/* ROLE BADGE */}
        <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium capitalize">
          {user?.role}
        </span>

        {/* USER */}
        <div className="flex items-center gap-2">
          <FaUserCircle className="text-2xl text-gray-600" />
          <div className="text-sm leading-tight">
            <div className="font-medium">{user?.name}</div>
            <div className="text-gray-400 text-xs">Admin Panel</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminHeader;