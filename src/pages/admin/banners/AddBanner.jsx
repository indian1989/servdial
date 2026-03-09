import { useState } from "react";
import axios from "../../api/axios";

const AddBanner = () => {
  const [formData, setFormData] = useState({
    link: "",
    image: null,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === "file") {
      setFormData({ ...formData, image: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, isActive: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.link || !formData.image) {
      return alert("Please provide link and image");
    }

    const data = new FormData();
    data.append("link", formData.link);
    data.append("image", formData.image);
    data.append("isActive", formData.isActive);

    try {
      setLoading(true);
      await axios.post("/banners", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLoading(false);
      alert("Banner added successfully");
      setFormData({ link: "", image: null, isActive: true });
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Failed to add banner");
    }
  };

  return (
    <div className="admin-page">
      <h2>Add New Banner</h2>

      <form className="add-banner-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="link"
          placeholder="Banner Link"
          value={formData.link}
          onChange={handleChange}
          required
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
        />

        {formData.image && (
          <img
            src={URL.createObjectURL(formData.image)}
            alt="Preview"
            style={{ width: "200px", margin: "10px 0" }}
          />
        )}

        <label>
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />{" "}
          Active
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Banner"}
        </button>
      </form>
    </div>
  );
};

export default AddBanner;