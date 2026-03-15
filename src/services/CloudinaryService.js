import API from "../api/axios";

// ================= CLOUDINARY UPLOAD =================
// file: File object from input
// returns: { secure_url, public_id }
export const uploadImage = async (file) => {
  if (!file) throw new Error("No file provided for upload");

  // Cloudinary unsigned upload preset
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary environment variables missing");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

  try {
    const res = await API.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data; // includes secure_url, public_id, etc.
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Cloudinary upload failed");
  }
};