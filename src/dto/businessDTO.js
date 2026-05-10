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

    // ================= CATEGORY =================
    categoryName:
  (b.categoryId?.name || b.category || "General")
    .toString()
    .trim()
    .replace(/\b\w/g, (l) => l.toUpperCase()),

    categorySlug:
      b.categoryId?.slug || b.categorySlug || null,

    // ================= CITY =================
    cityName:
  (b.cityId?.name || b.cityName || "Unknown")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase()),

    citySlug:
  (b.cityId?.slug || b.citySlug || "")
    .toString()
    .trim()
    .toLowerCase(),

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
      b.categoryId?._id?.toString?.() ||
      b.categoryId?.toString?.() ||
      "",

    cityId:
      b.cityId?._id?.toString?.() ||
      b.cityId?.toString?.() ||
      "",

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
    images: Array.isArray(b.images)
      ? b.images
      : b.images?.url
      ? [b.images.url]
      : [],

    logo: b.logo || "",

    // ===== PROVIDER FEATURES =====
    businessHours: b.businessHours || {},

    tags: Array.isArray(b.tags)
      ? b.tags
      : [],

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