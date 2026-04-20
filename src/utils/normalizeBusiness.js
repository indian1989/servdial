export const normalizeBusiness = (b = {}) => {
  return {
    _id: b._id || b.id,

    slug: b.slug || b._id,

    name: b.name || "Unnamed Business",

    image:
      (Array.isArray(b.images) && b.images[0]) ||
      b.logo ||
      "https://via.placeholder.com/400x250?text=ServDial",

    category:
      typeof b.category === "object"
        ? b.category?.name
        : b.category || "General",

    // ✅ FIXED (THIS WAS BREAKING UI)
    city: b.city || b.cityName || "Unknown",

    rating: b.averageRating || b.rating || 0,

    reviewCount: b.totalReviews || b.reviewCount || 0,

    // ✅ IMPORTANT: preserve BOTH
    phone: b.phone || null,
    whatsapp: b.whatsapp || b.phone || null,

    isFeatured: !!b.isFeatured,
    isVerified: !!b.isVerified,

    distance: b.distance ?? null,

    location: b.location || null,

    isNew:
      b.createdAt
        ? (Date.now() - new Date(b.createdAt).getTime()) /
            (1000 * 60 * 60 * 24) < 7
        : false,
  };
};