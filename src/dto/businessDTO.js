// src/components/business/businessDTO.js

/* ================= LIST DTO (FOR TABLES / CARDS) ================= */
export const toBusinessListDTO = (b = {}) => {
  return {
    _id: b._id,
    slug: b.slug || b._id,

    name: b.name || "Unnamed",

    image:
      (b.images && b.images[0]) ||
      b.logo ||
      "https://via.placeholder.com/400x250",

    categoryName:
      typeof b.categoryId === "object"
        ? b.categoryId?.name
        : b.category || "General",

    cityName:
      typeof b.cityId === "object"
        ? b.cityId?.name
        : b.cityName || "Unknown",

    rating: b.averageRating || b.rating || 0,
    reviewCount: b.totalReviews || b.reviewCount || 0,

    isFeatured: b.isFeatured || false,
    isVerified: b.isVerified || false,

    phone: b.phone || b.contactNumber || null,
  };
};

/* ================= EDIT DTO (FULL FORM SAFE DATA) ================= */
export const toBusinessEditDTO = (b = {}) => {
  return {
    _id: b._id,

    // ===== BASIC INFO =====
    name: b.name || "",
    description: b.description || "",

    // ===== RELATIONS (FIXED FOR SELECTS) =====
    categoryId:
      typeof b.categoryId === "object"
        ? b.categoryId?._id
        : b.categoryId || "",

    cityId:
      typeof b.cityId === "object"
        ? b.cityId?._id
        : b.cityId || "",

    // ===== LOCATION INFO =====
    address: b.address || "",
    pincode: b.pincode || "",
    district: b.district || "",
    state: b.state || "",

    location: b.location || null,

    // ===== CONTACT =====
    phone: b.phone || "",
    whatsapp: b.whatsapp || "",
    website: b.website || "",

    // ===== MEDIA =====
    images: b.images || [],
    logo: b.logo || "",

    // ===== PROVIDER FEATURES =====
    businessHours: b.businessHours || {},
    tags: b.tags || [],
    boost: b.boost || false,

    // ===== ADMIN FLAGS =====
    isFeatured: b.isFeatured || false,
    isVerified: b.isVerified || false,

    // ===== METADATA =====
    slug: b.slug || "",
  };
};

/* ================= SAFE NORMALIZER FOR SAVE ================= */
export const normalizeBusinessPayload = (data = {}, mode = "admin") => {
  return {
    name: data.name,
    description: data.description,

    categoryId: data.categoryId?.value || data.categoryId,
    cityId: data.cityId?.value || data.cityId,

    address: data.address,
    pincode: data.pincode,
    phone: data.phone,
    whatsapp: data.whatsapp,
    website: data.website || "",

    images: data.images || [],
    logo: data.logo || "",

    location:
      data.location?.coordinates?.length === 2
        ? data.location
        : undefined,

    // ===== PROVIDER ONLY =====
    ...(mode === "provider" && {
      businessHours: data.businessHours || {},
      tags: Array.isArray(data.tags)
        ? data.tags
        : (data.tags || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),

      boost: data.boost || false,
    }),

    // ===== ADMIN ONLY =====
    ...(mode === "admin" && {
      isVerified: true,
    }),
  };
};