import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaHome,
} from "react-icons/fa";

import {
  Link,
  useLocation,
} from "react-router-dom";


/* =========================================================
   ADMIN HEADER
========================================================= */

function AdminHeader({
  onMenuClick,
}) {

  const {
    user,
  } = useContext(AuthContext);

  const location =
    useLocation();


  const isNotificationsActive =
    location.pathname.startsWith(
      "/admin/notifications"
    );


  return (
    <header
      className="
        shrink-0
         sticky
    top-0
        z-40
        w-full
        bg-white
        border-b
        border-gray-200
        shadow-sm
      "
    >

      <div
        className="
          min-h-[64px]
          px-3
          sm:px-4
          md:px-6

          flex
          items-center
          justify-between
          gap-2
          sm:gap-3
        "
      >

        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            sm:gap-3
            min-w-0
            flex-1
          "
        >

          {/* =================================================
              MOBILE MENU
          ================================================= */}

          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              aria-label="Open admin menu"
              className="
                md:hidden

                w-10
                h-10

                rounded-xl

                flex
                items-center
                justify-center

                text-gray-600
                hover:bg-gray-100
                hover:text-indigo-600

                transition

                shrink-0
              "
            >
              <span
                className="
                  text-xl
                  leading-none
                "
              >
                ☰
              </span>
            </button>
          )}


          {/* =================================================
              HOME
              
              Visible on mobile and desktop
          ================================================= */}

          <Link
            to="/"
            aria-label="Go to home"
            className="
              flex
              items-center
              justify-center

              w-10
              h-10

              sm:w-auto
              sm:h-auto

              sm:px-2

              rounded-xl
              sm:rounded-none

              text-gray-600
              hover:bg-gray-100
              sm:hover:bg-transparent

              hover:text-indigo-600

              transition

              shrink-0
            "
          >

            <FaHome />

            <span
              className="
                hidden
                sm:inline
                ml-2
                text-sm
                font-medium
              "
            >
              Home
            </span>

          </Link>


          {/* =================================================
              BUSINESS SEARCH
              
              Mobile:
              icon-only button/field
              
              Desktop:
              full search input
          ================================================= */}

          <div
            className="
              flex
              items-center

              bg-gray-50
              border
              border-gray-200

              rounded-xl

              focus-within:border-indigo-400
              focus-within:ring-2
              focus-within:ring-indigo-100

              transition

              min-w-0
              flex-1

              max-w-[220px]

              sm:max-w-[320px]

              md:max-w-[480px]
            "
          >

            <FaSearch
              className="
                text-gray-400
                shrink-0
                ml-3
              "
            />

            <input
              type="text"
              placeholder="Search businesses..."
              aria-label="Search businesses"
              className="
                w-full

                outline-none

                text-sm
                bg-transparent
                text-gray-700
                placeholder:text-gray-400

                px-2
                py-2.5

                min-w-0
              "
            />

          </div>

        </div>


        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <div
          className="
            flex
            items-center
            gap-1
            sm:gap-3

            shrink-0
          "
        >

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          <Link
            to="/admin/notifications"
            aria-label="Admin notifications"
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
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
              }
            `}
          >

            <FaBell
              className="
                text-lg
              "
            />


            {/* COUNT */}

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
              3
            </span>

          </Link>


          {/* =================================================
              ROLE BADGE
          ================================================= */}

          <span
            className="
              hidden
              sm:inline-flex

              items-center

              text-xs

              bg-indigo-50
              text-indigo-700

              px-3
              py-1.5

              rounded-full

              font-semibold

              capitalize
              whitespace-nowrap
            "
          >
            {user?.role || "Admin"}
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


            <div
              className="
                hidden
                sm:block
                leading-tight
                min-w-0
              "
            >

              <div
                className="
                  font-semibold
                  text-sm
                  text-gray-800
                  truncate
                  max-w-[130px]
                "
              >
                {user?.name || "Admin"}
              </div>

              <div
                className="
                  text-gray-400
                  text-xs
                "
              >
                Admin Panel
              </div>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}


export default AdminHeader;