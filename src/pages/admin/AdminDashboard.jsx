import React, { useEffect, useState } from "react";
// Path: src/pages/admin/AdminDashboard.jsx
import {
  getAllBusinesses,
  getAllUsers,
  getAllCities,
  getAllCategories,
  getAllBanners,
  getAllAdmins
} from "../../api/adminAPI"; // <-- two levels up from admin/
import Loader from "../../components/common/Loader"; // <-- two levels up
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    businesses: 0,
    users: 0,
    cities: 0,
    categories: 0,
    banners: 0,
    admins: 0,
  });

  // ================= FETCH STATS =================
  const fetchStats = async () => {
    setLoading(true);
    try {
      const [
        businessesRes,
        usersRes,
        citiesRes,
        categoriesRes,
        bannersRes,
        adminsRes,
      ] = await Promise.all([
        getAllBusinesses(),
        getAllUsers(),
        getAllCities(),
        getAllCategories(),
        getAllBanners(),
        getAllAdmins(),
      ]);

      setStats({
        businesses: businessesRes.data.length,
        users: usersRes.data.length,
        cities: citiesRes.data.length,
        categories: categoriesRes.data.length,
        banners: bannersRes.data.length,
        admins: adminsRes.data.length,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch dashboard stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    { name: "Businesses", count: stats.businesses, link: "/admin/manage-businesses" },
    { name: "Users", count: stats.users, link: "/admin/manage-users" },
    { name: "Cities", count: stats.cities, link: "/admin/manage-cities" },
    { name: "Categories", count: stats.categories, link: "/admin/manage-categories" },
    { name: "Banner Ads", count: stats.banners, link: "/admin/manage-banners" },
    { name: "Admins", count: stats.admins, link: "/admin/add-admin" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              to={card.link}
              key={card.name}
              className="bg-white shadow-md p-6 rounded hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold">{card.name}</h3>
                <p className="text-3xl font-bold mt-2">{card.count}</p>
              </div>
              <div className="mt-4 text-blue-500 font-semibold underline">
                Manage
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;