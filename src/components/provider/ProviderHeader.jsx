import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaHome,
  FaStore,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

function ProviderHeader({ onMenuClick }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isNotificationsActive =
    location.pathname.startsWith("/provider/notifications");

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="min-h-[64px] px-3 sm:px-4 md:px-6 flex items-center justify-between gap-3">

        {/* =====================================================
            LEFT
        ===================================================== */}

        <div className="flex items-center gap-2 sm:gap-4 min-w-0">

          {/* MOBILE MENU */}
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="
                md:hidden
                w-10 h-10
                rounded-xl
                flex items-center justify-center
                text-gray-600
                hover:bg-gray-100
                transition
                shrink-0
              "
              aria-label="Open provider menu"
            >
              <span className="text-xl">☰</span>
            </button>
          )}

          {/* HOME */}
          <Link
            to="/"
            className="
              hidden sm:flex
              items-center gap-2
              text-sm font-medium
              text-gray-600
              hover:text-blue-600
              transition
              whitespace-nowrap
            "
          >
            <FaHome />
            <span>Home</span>
          </Link>

          {/* BUSINESSES */}
          <Link
            to="/provider/businesses"
            className="
              hidden sm:flex
              items-center gap-2
              text-sm font-medium
              text-gray-600
              hover:text-blue-600
              transition
              whitespace-nowrap
            "
          >
            <FaStore />
            <span>Businesses</span>
          </Link>

          {/* SEARCH */}
          <div
            className="
              hidden md:flex
              items-center gap-3
              w-[320px]
              lg:w-[420px]
              bg-gray-50
              border border-gray-200
              px-3
              py-2.5
              rounded-xl
              focus-within:border-blue-400
              focus-within:ring-2
              focus-within:ring-blue-100
              transition
            "
          >
            <FaSearch className="text-gray-400 shrink-0" />

            <input
              type="text"
              placeholder="Search businesses, leads, reviews..."
              className="
                w-full
                outline-none
                text-sm
                bg-transparent
                text-gray-700
                placeholder:text-gray-400
              "
            />
          </div>

        </div>


        {/* =====================================================
            RIGHT
        ===================================================== */}

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <Link
            to="/provider/notifications"
            aria-label="Notifications"
            className={`
              relative
              w-10
              h-10
              rounded-xl
              flex
              items-center
              justify-center
              transition
              ${
                isNotificationsActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
              }
            `}
          >
            <FaBell className="text-lg" />

            {/* Notification count */}
            <span
              className="
                absolute
                -top-0.5
                -right-0.5
                min-w-[18px]
                h-[18px]
                px-1
                flex
                items-center
                justify-center
                rounded-full
                bg-red-500
                text-white
                text-[10px]
                font-bold
                border-2
                border-white
              "
            >
              2
            </span>
          </Link>


          {/* =================================================
              ROLE
          ================================================= */}

          <span
            className="
              hidden sm:inline-flex
              text-xs
              bg-blue-50
              text-blue-700
              px-3
              py-1.5
              rounded-full
              font-semibold
              capitalize
              whitespace-nowrap
            "
          >
            {user?.role === "provider"
              ? "Business Owner"
              : user?.role}
          </span>


          {/* =================================================
              USER
          ================================================= */}

          <div
            className="
              flex
              items-center
              gap-2
              max-w-[150px]
              sm:max-w-none
            "
          >
            <FaUserCircle
              className="
                text-2xl
                sm:text-[28px]
                text-gray-500
                shrink-0
              "
            />

            <div className="hidden sm:block leading-tight min-w-0">
              <div className="font-semibold text-sm text-gray-800 truncate max-w-[130px]">
                {user?.name || "Provider"}
              </div>

              <div className="text-gray-400 text-xs">
                Provider Panel
              </div>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}

export default ProviderHeader;