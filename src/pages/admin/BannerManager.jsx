import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const BannerManager = () => {
  const { user } = useAuth();
  const [banners, setBanners] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin =
    user?.role === "admin" || user?.role === "superadmin";

  const fetchBanners = async () => {
    try {
      const { data } = await axios.get("/api/banners");
      setBanners(data.banners || []);
    } catch (error) {
      console.error("Failed to fetch banners");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      setLoading(true);

      await axios.post(
        "/api/banners",
        { title, image, link },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setTitle("");
      setImage("");
      setLink("");
      fetchBanners();
    } catch (error) {
      alert("Banner creation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;

    try {
      await axios.delete(`/api/banners/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      fetchBanners();
    } catch (error) {
      alert("Delete failed");
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-10 text-center text-red-500 font-semibold">
        This feature will be available soon for user and provider
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Banner Management
      </h1>

      {/* Add Banner Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">
          Add New Banner
        </h2>

        <input
          type="text"
          placeholder="Banner Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border w-full px-3 py-2 mb-4 rounded-md"
          required
        />

        <input
          type="text"
          placeholder="Image URL (Cloudinary)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border w-full px-3 py-2 mb-4 rounded-md"
          required
        />

        <input
          type="text"
          placeholder="Redirect Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border w-full px-3 py-2 mb-4 rounded-md"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Adding..." : "Add Banner"}
        </button>
      </form>

      {/* Existing Banners */}
      <div className="grid md:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-40 object-cover"
            />

            <div className="p-4">
              <h3 className="font-semibold mb-2">
                {banner.title}
              </h3>

              <button
                onClick={() => handleDelete(banner._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerManager;