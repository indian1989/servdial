// frontend/src/utils/normalizeBusiness.js
export const normalizeBusiness = (b = {}) => {
  try {
    return {
      _id: b?._id || null,

      // ✅ ALWAYS SAFE SLUG
      slug: b?.slug || b?._id || "",

      name: b?.name || "Unnamed Business",

      image:
        (Array.isArray(b?.images) && b.images.length > 0 && b.images[0]) ||
        b?.logo ||
        "https://via.placeholder.com/400x250?text=ServDial",

      category:
        typeof b?.category === "object"
          ? b?.category?.name
          : b?.category || "General",

      city: b?.city || "Unknown",

      rating: b?.averageRating || b?.rating || 0,

      reviewCount: b?.totalReviews || b?.reviewCount || 0,

      phone:
        b?.phone ||
        b?.mobile ||
        b?.contactNumber ||
        null,

      isFeatured: b?.isFeatured || false,

      isVerified: b?.isVerified || false,

      distance: b?.distance ?? null,

      isNew:
        b?.createdAt
          ? (Date.now() - new Date(b.createdAt).getTime()) /
              (1000 * 60 * 60 * 24) <
            7
          : false,
    };
  } catch (err) {
    console.error("NORMALIZE ERROR:", err, b);
    return {};
  }
};