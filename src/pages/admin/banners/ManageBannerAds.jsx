import { useEffect, useState } from "react";
import axios from "../../api/axios";

const ManageBannerAds = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/banners");
      setBanners(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Delete Banner
  const deleteBanner = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await axios.delete(`/banners/${id}`);
      fetchBanners();
    } catch (error) {
      console.error(error);
    }
  };

  // Toggle Active Status
  const toggleStatus = async (banner) => {
    try {
      await axios.put(`/banners/${banner._id}/status`, {
        isActive: !banner.isActive,
      });
      fetchBanners();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin-page">
      <h2>Manage Banner Ads</h2>

      {loading ? (
        <p>Loading banners...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Banner</th>
              <th>Link</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {banners.map((banner) => (
              <tr key={banner._id}>
                <td>
                  <img
                    src={banner.imageUrl}
                    alt="banner"
                    style={{ width: "150px" }}
                  />
                </td>
                <td>{banner.link}</td>
                <td>
                  {banner.isActive ? (
                    <span style={{ color: "green" }}>Active</span>
                  ) : (
                    <span style={{ color: "red" }}>Inactive</span>
                  )}
                </td>
                <td>
                  <button onClick={() => toggleStatus(banner)}>
                    {banner.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    style={{ color: "red" }}
                    onClick={() => deleteBanner(banner._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageBannerAds;