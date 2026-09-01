// frontend/src/layout/UserLayout.jsx

import React from "react";
import { Outlet } from "react-router-dom";

import UserHeader from "../components/user/UserHeader";
import UserSidebar from "../components/user/UserSidebar";

/**
 * ==================================================
 * 👤 USER LAYOUT
 * ==================================================
 *
 * Common layout for authenticated users.
 *
 * Structure:
 *
 * UserHeader
 *     ↓
 * UserSidebar + Page Content
 *
 * Responsibilities:
 * - Common user header
 * - User sidebar navigation
 * - Render nested user pages
 *
 * No API logic
 * No business logic
 * No permission logic
 * ==================================================
 */

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= HEADER ================= */}

      <UserHeader />

      {/* ================= MAIN AREA ================= */}

      <div className="flex min-h-[calc(100vh-4rem)]">

        {/* ================= SIDEBAR ================= */}

        <div className="hidden md:block flex-shrink-0">

          <UserSidebar />

        </div>

        {/* ================= PAGE CONTENT ================= */}

        <main className="flex-1 min-w-0">

          <Outlet />

        </main>

      </div>

    </div>
  );
};

export default UserLayout;