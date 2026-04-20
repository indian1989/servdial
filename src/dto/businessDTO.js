export const toBusinessDTO = (b = {}) => {
  return {
    _id: b._id || b.id || null,
    slug: b.slug || b._id || "",

    name: b.name || "Unnamed",

    image:
      (b.images && b.images[0]) ||
      b.logo ||
      "https://via.placeholder.com/400x250",

    categoryName:
      typeof b.categoryId === "object"
        ? b.categoryId?.name
        : b.category || "General",

    // 🔥 FIX 1: CITY NAME (MULTI FALLBACK)
    cityName:
      b.cityName ||
      (typeof b.cityId === "object" ? b.cityId?.name : null) ||
      b.city ||
      "Unknown",

    // 🔥 FIX 2: CITY SLUG SAFE
    citySlug:
      b.citySlug ||
      (typeof b.cityId === "object" ? b.cityId?.slug : null) ||
      "",

    categorySlug:
      typeof b.categoryId === "object"
        ? b.categoryId?.slug
        : "",

    rating: b.averageRating || b.rating || 0,
    reviewCount: b.totalReviews || b.reviewCount || 0,

    // 🔥 FIX 3: PHONE NORMALIZATION (CRITICAL)
    phone:
      b.phone ||
      b.contactNumber ||
      b.mobile ||
      null,

    whatsapp:
      b.whatsapp ||
      b.phone ||
      b.contactNumber ||
      null,

    isFeatured: b.isFeatured || false,
    isVerified: b.isVerified || false,

    distance: b.distance ?? null,

    views: b.views || 0,
    phoneClicks: b.phoneClicks || 0,
    whatsappClicks: b.whatsappClicks || 0,
  };
};