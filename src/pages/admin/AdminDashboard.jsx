import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Businesses */}
        <div
          className="bg-blue-500 text-white p-6 rounded-lg cursor-pointer hover:bg-blue-600"
          onClick={() => navigate("/admin/businesses")}
        >
          <h2 className="text-xl font-semibold mb-2">Manage Businesses</h2>
          <p>Add, edit, approve, or delete businesses</p>
        </div>

        <div
          className="bg-green-500 text-white p-6 rounded-lg cursor-pointer hover:bg-green-600"
          onClick={() => navigate("/admin/businesses/add")}
        >
          <h2 className="text-xl font-semibold mb-2">Add Business</h2>
          <p>Add a new business to the platform</p>
        </div>

        {/* Cities */}
        <div
          className="bg-yellow-500 text-white p-6 rounded-lg cursor-pointer hover:bg-yellow-600"
          onClick={() => navigate("/admin/cities")}
        >
          <h2 className="text-xl font-semibold mb-2">Manage Cities</h2>
          <p>Add, edit, or delete cities</p>
        </div>

        <div
          className="bg-orange-500 text-white p-6 rounded-lg cursor-pointer hover:bg-orange-600"
          onClick={() => navigate("/admin/cities/add")}
        >
          <h2 className="text-xl font-semibold mb-2">Add City</h2>
          <p>Add a new city</p>
        </div>

        {/* Categories */}
        <div
          className="bg-purple-500 text-white p-6 rounded-lg cursor-pointer hover:bg-purple-600"
          onClick={() => navigate("/admin/categories")}
        >
          <h2 className="text-xl font-semibold mb-2">Manage Categories</h2>
          <p>Add, edit, or delete categories</p>
        </div>

        <div
          className="bg-pink-500 text-white p-6 rounded-lg cursor-pointer hover:bg-pink-600"
          onClick={() => navigate("/admin/categories/add")}
        >
          <h2 className="text-xl font-semibold mb-2">Add Category</h2>
          <p>Add a new category</p>
        </div>

        {/* Banners */}
        <div
          className="bg-indigo-500 text-white p-6 rounded-lg cursor-pointer hover:bg-indigo-600"
          onClick={() => navigate("/admin/banners")}
        >
          <h2 className="text-xl font-semibold mb-2">Manage Banners</h2>
          <p>Edit or remove existing banners</p>
        </div>

        <div
          className="bg-teal-500 text-white p-6 rounded-lg cursor-pointer hover:bg-teal-600"
          onClick={() => navigate("/admin/banners/add")}
        >
          <h2 className="text-xl font-semibold mb-2">Add Banner</h2>
          <p>Add a new banner to homepage</p>
        </div>

        {/* Users */}
        <div
          className="bg-gray-500 text-white p-6 rounded-lg cursor-pointer hover:bg-gray-600"
          onClick={() => navigate("/admin/users")}
        >
          <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
          <p>View and manage platform users</p>
        </div>

        {/* Admins */}
        <div
          className="bg-red-500 text-white p-6 rounded-lg cursor-pointer hover:bg-red-600"
          onClick={() => navigate("/admin/admins")}
        >
          <h2 className="text-xl font-semibold mb-2">Manage Admins</h2>
          <p>View and manage admin accounts</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;