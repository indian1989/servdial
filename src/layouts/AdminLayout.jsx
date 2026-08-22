import { Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";


/* =========================================================
   ADMIN LAYOUT
========================================================= */

function AdminLayout() {

  const {
    user,
    loading,
  } = useContext(AuthContext);


  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);


  const allowedRoles = [
    "admin",
    "superadmin",
  ];


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {

    return (
      <div
        className="
          flex
          items-center
          justify-center
          h-screen
          bg-gray-50
        "
      >

        <div
          className="
            animate-pulse
            text-gray-500
            text-lg
          "
        >
          Loading admin panel...
        </div>

      </div>
    );

  }


  /* =======================================================
     ACCESS CONTROL
  ======================================================= */

  if (
    !user ||
    !allowedRoles.includes(
      user.role
    )
  ) {

    return (
      <div
        className="
          flex
          items-center
          justify-center
          h-screen
          bg-gray-50
          p-4
        "
      >

        <div
          className="
            w-full
            max-w-md
            bg-white
            shadow-lg
            rounded-xl
            p-6
            text-center
          "
        >

          <h2
            className="
              text-xl
              font-bold
              text-red-500
            "
          >
            Access Denied
          </h2>

          <p
            className="
              text-gray-500
              mt-2
            "
          >
            Admin panel is restricted to admin and superadmin only.
          </p>

        </div>

      </div>
    );

  }


  /* =======================================================
     MAIN LAYOUT
========================================================= */

  return (
    <div
      className="
        flex
        h-screen
        bg-gray-50
        overflow-hidden
      "
    >

      {/* ===================================================
          SIDEBAR
          
          Desktop:
          - Fixed sidebar
          - Independent vertical scroll

          Mobile:
          - Drawer
          - Overlay
          - Independent vertical scroll
      =================================================== */}

      <AdminSidebar
        sidebarOpen={
          sidebarOpen
        }
        onClose={() =>
          setSidebarOpen(false)
        }
      />


      {/* ===================================================
          MAIN AREA
      =================================================== */}

      <div
        className="
          flex
          flex-col
          flex-1
          min-w-0
          h-screen
          overflow-hidden
        "
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <AdminHeader
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />


        {/* =================================================
            CONTENT AREA
            ONLY THIS AREA SCROLLS
        ================================================= */}

        <main
          className="
            flex-1
            min-w-0
            min-h-0
            overflow-y-auto
            overflow-x-hidden
            p-4
            md:p-6
          "
        >

          <Outlet />

        </main>

      </div>

    </div>
  );
}


export default AdminLayout;