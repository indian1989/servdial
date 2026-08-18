import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

import {
  FaBars,
  FaTimes,
  FaChevronRight,
  FaHome,
  FaStore,
  FaCity,
  FaLayerGroup,
  FaBullhorn,
  FaUsers,
  FaUserShield,
  FaChartBar,
  FaCog,
  FaInbox,
} from "react-icons/fa";

function AdminSidebar({
  sidebarOpen,
  onClose,
  onToggle,
}) {
  const { user } = useContext(AuthContext);
  const role = user?.role;

  return (
    <>
      {/* =====================================================
          MOBILE TOP BAR
      ===================================================== */}

      <div
        className="
          md:hidden
          sticky
          top-0
          z-40
          h-16
          bg-white
          border-b
          border-gray-200
          flex
          items-center
          justify-between
          px-4
          shadow-sm
        "
      >

        <div className="flex items-center gap-3 min-w-0">

          {/* LOGO */}

          <div
            className="
              w-9
              h-9
              rounded-xl
              bg-indigo-600
              text-white
              flex
              items-center
              justify-center
              font-bold
              text-sm
              shadow-sm
              shrink-0
            "
          >
            S
          </div>

          <div className="leading-tight min-w-0">

            <p className="text-sm font-bold text-gray-900 truncate">
              Admin Panel
            </p>

            <p className="text-[11px] text-gray-500 truncate">
              ServDial Management
            </p>

          </div>

        </div>


        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          onClick={onToggle}
          aria-label="Open admin menu"
          className="
            w-10
            h-10
            rounded-xl
            bg-gray-100
            hover:bg-gray-200
            text-gray-700
            flex
            items-center
            justify-center
            transition
            shrink-0
          "
        >
          <FaBars size={17} />
        </button>

      </div>


      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <aside
        className="
          hidden
          md:flex
          flex-col
          w-64
          shrink-0
          min-h-screen
          bg-gray-950
          text-white
          border-r
          border-gray-800
          sticky
          top-0
          h-screen
        "
      >

        <SidebarContent
          role={role}
        />

      </aside>


      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      <div
        className={`
          fixed
          inset-0
          z-50
          md:hidden
          transition-all
          duration-300
          ${
            sidebarOpen
              ? "bg-black/50 backdrop-blur-[2px] pointer-events-auto"
              : "bg-transparent pointer-events-none"
          }
        `}
        onClick={onClose}
      >

        {/* ===================================================
            MOBILE DRAWER
        =================================================== */}

        <aside
          onClick={(e) => e.stopPropagation()}
          className={`
            fixed
            inset-y-0
            left-0
            w-[min(84vw,320px)]
            bg-gray-950
            text-white
            shadow-2xl
            flex
            flex-col
            transform
            transition-transform
            duration-300
            ease-out
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >

          <SidebarContent
            role={role}
            mobile
            onClose={onClose}
          />

        </aside>

      </div>
    </>
  );
}


/* =========================================================
   SIDEBAR CONTENT
========================================================= */

function SidebarContent({
  role,
  mobile = false,
  onClose,
}) {

  return (
    <div className="flex flex-col h-full">


      {/* ===================================================
          BRAND HEADER
      =================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          px-5
          py-5
          border-b
          border-gray-800
        "
      >

        <div className="flex items-center gap-3 min-w-0">

          {/* LOGO */}

          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-indigo-600
              flex
              items-center
              justify-center
              text-white
              font-bold
              text-lg
              shrink-0
              shadow-lg
            "
          >
            S
          </div>


          {/* TITLE */}

          <div className="min-w-0">

            <h2 className="text-base font-bold truncate">
              Admin Panel
            </h2>

            <p className="text-[11px] text-gray-400 truncate">
              ServDial Management
            </p>

          </div>

        </div>


        {/* MOBILE CLOSE */}

        {mobile && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close admin menu"
            className="
              w-9
              h-9
              rounded-xl
              bg-gray-800
              hover:bg-gray-700
              text-gray-300
              hover:text-white
              flex
              items-center
              justify-center
              transition
              shrink-0
            "
          >
            <FaTimes size={16} />
          </button>
        )}

      </div>


      {/* ===================================================
          NAVIGATION
      =================================================== */}

      <nav
        className="
          flex-1
          overflow-y-auto
          px-3
          py-5
          scrollbar-thin
          scrollbar-thumb-gray-700
        "
      >

        {/* MENU */}

        <p
          className="
            px-3
            mb-3
            text-[10px]
            uppercase
            tracking-[0.16em]
            font-bold
            text-gray-500
          "
        >
          Menu
        </p>


        <ul className="space-y-1.5">


          {/* =================================================
              DASHBOARD
          ================================================= */}

          <AdminNavItem
            to="/admin/dashboard"
            label="Dashboard"
            icon={FaHome}
            mobile={mobile}
            onClose={onClose}
          />


          {/* =================================================
              BUSINESS ENGINE
          ================================================= */}

          <SectionTitle>
            Business Engine
          </SectionTitle>


          <AdminNavItem
            to="/admin/businesses"
            label="Businesses"
            icon={FaStore}
            mobile={mobile}
            onClose={onClose}
          />

          <AdminNavItem
            to="/admin/businesses/add"
            label="Add Business"
            icon={FaStore}
            mobile={mobile}
            onClose={onClose}
          />


          {/* =================================================
              LOCATION ENGINE
          ================================================= */}

          <SectionTitle>
            Location Engine
          </SectionTitle>


          <AdminNavItem
            to="/admin/cities"
            label="Cities"
            icon={FaCity}
            mobile={mobile}
            onClose={onClose}
          />


          {/* =================================================
              CATEGORY ENGINE
          ================================================= */}

          <SectionTitle>
            Category Engine
          </SectionTitle>


          <AdminNavItem
            to="/admin/categories"
            label="Categories"
            icon={FaLayerGroup}
            mobile={mobile}
            onClose={onClose}
          />


          {/* =================================================
              MONETIZATION
          ================================================= */}

          <SectionTitle>
            Monetization
          </SectionTitle>


          <AdminNavItem
            to="/admin/banners"
            label="Banner Ads"
            icon={FaBullhorn}
            mobile={mobile}
            onClose={onClose}
          />

          <AdminNavItem
            to="/admin/banners/add"
            label="Add Banner"
            icon={FaBullhorn}
            mobile={mobile}
            onClose={onClose}
          />


          {/* =================================================
              USERS
          ================================================= */}

          <SectionTitle>
            Users
          </SectionTitle>


          <AdminNavItem
            to="/admin/users"
            label="Users"
            icon={FaUsers}
            mobile={mobile}
            onClose={onClose}
          />


          {/* =================================================
              LEAD MANAGEMENT
          ================================================= */}

          <SectionTitle>
            Lead Management
          </SectionTitle>


          <AdminNavItem
            to="/admin/leads"
            label="Leads"
            icon={FaInbox}
            mobile={mobile}
            onClose={onClose}
          />


          {/* =================================================
              SUPERADMIN
          ================================================= */}

          {role === "superadmin" && (
            <>

              <SectionTitle>
                System Control
              </SectionTitle>


              <AdminNavItem
                to="/admin/admins"
                label="Admins"
                icon={FaUserShield}
                mobile={mobile}
                onClose={onClose}
              />


              <AdminNavItem
                to="/admin/analytics"
                label="Analytics"
                icon={FaChartBar}
                mobile={mobile}
                onClose={onClose}
              />


              <AdminNavItem
                to="/admin/settings"
                label="Settings"
                icon={FaCog}
                mobile={mobile}
                onClose={onClose}
              />

            </>
          )}

        </ul>

      </nav>


      {/* ===================================================
          SIDEBAR FOOTER
      =================================================== */}

      <div
        className="
          px-4
          py-4
          border-t
          border-gray-800
        "
      >

        <div
          className="
            rounded-xl
            bg-gray-900
            border
            border-gray-800
            px-3
            py-3
          "
        >

          <p className="text-xs font-semibold text-gray-300">
            ServDial Admin
          </p>

          <p className="text-[11px] text-gray-500 mt-1 leading-4">
            Manage businesses, users, locations and platform activity.
          </p>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({ children }) {
  return (
    <li className="list-none">

      <p
        className="
          px-3
          mt-5
          mb-3
          text-[10px]
          uppercase
          tracking-[0.16em]
          font-bold
          text-gray-500
        "
      >
        {children}
      </p>

    </li>
  );
}


/* =========================================================
   NAV ITEM
========================================================= */

function AdminNavItem({
  to,
  label,
  icon: Icon,
  mobile,
  onClose,
}) {

  return (
    <li>

      <NavLink
        to={to}
        end={to === "/admin/dashboard"}
        onClick={mobile ? onClose : undefined}
        className={({ isActive }) => `
          group
          relative
          flex
          items-center
          gap-3
          min-h-[46px]
          px-3
          rounded-xl
          transition-all
          duration-200

          ${
            isActive
              ? `
                bg-indigo-600
                text-white
                shadow-lg
                shadow-indigo-950/30
              `
              : `
                text-gray-400
                hover:bg-gray-800
                hover:text-white
              `
          }
        `}
      >

        {({ isActive }) => (
          <>

            {/* ACTIVE INDICATOR */}

            {isActive && (
              <span
                className="
                  absolute
                  left-0
                  top-2
                  bottom-2
                  w-1
                  rounded-r-full
                  bg-white
                "
              />
            )}


            {/* ICON */}

            <span
              className={`
                w-9
                h-9
                rounded-lg
                flex
                items-center
                justify-center
                shrink-0
                transition

                ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "bg-gray-800/60 text-gray-400 group-hover:text-white"
                }
              `}
            >

              {Icon ? (
                <Icon className="w-[18px] h-[18px]" />
              ) : (
                <FaChevronRight size={12} />
              )}

            </span>


            {/* LABEL */}

            <span
              className="
                flex-1
                text-sm
                font-medium
                truncate
              "
            >
              {label}
            </span>


            {/* ARROW */}

            <FaChevronRight
              size={10}
              className={`
                shrink-0
                transition-all
                duration-200

                ${
                  isActive
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0"
                }
              `}
            />

          </>
        )}

      </NavLink>

    </li>
  );
}


export default AdminSidebar;