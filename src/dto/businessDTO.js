// src/dto/businessDTO.js
/* ================= LIST DTO (FOR TABLES / CARDS) ================= */

export const toBusinessListDTO = (b = {}) => {

  console.log("RAW LOCATION:", {
    cityId: b.cityId,
    cityName: b.cityName,
    district: b.district,
    state: b.state,
  });


  return {

    _id: b._id,

    slug:
      b.slug ||
      b._id,


    name:
      b.name ||
      "Unnamed",


    image:
      (Array.isArray(b.images) && b.images.length > 0
        ? b.images[0]
        : null) ||
      b.logo ||
      "https://via.placeholder.com/400x250",

    plan: b.plan || "free",
isTrustedPartner: b.isTrustedPartner || false,
isPremiumPartner: b.isPremiumPartner || false,

    // ================= CATEGORY =================

    categoryName:
      (
        b.categoryId?.name ||
        b.categoryName ||
        b.category ||
        "General"
      )
      .toString()
      .trim()
      .replace(/\b\w/g, (l) => l.toUpperCase()),


    categorySlug:
      b.categoryId?.slug ||
      b.categorySlug ||
      "",

// ================= CITY =================

cityName:
  (
    b.cityName ||
    b.cityId?.name ||
    "Unknown"
  )
  .toString()
  .trim()
  .toLowerCase()
  .replace(/\b\w/g, (l) => l.toUpperCase()),


    citySlug:
      (
        b.citySlug ||
        b.cityId?.slug ||
        ""
      )
      .toString()
      .trim()
      .toLowerCase(),



    // ================= DISTRICT =================

    district:
      (
        b.district ||
        ""
      )
      .toString()
      .trim()
      .replace(/\b\w/g, (l) => l.toUpperCase()),



    // ================= STATE =================

    state:
(
  b.state ||
  b.stateName ||
  (
    b.citySlug
      ?.split("-")
      ?.pop()
  ) ||
  ""
)
.toString()
.trim()
.replace(/\b\w/g, (l) => l.toUpperCase()),


    // ================= RATING =================

    rating:
      b.averageRating ||
      b.rating ||
      0,


    reviewCount:
      b.totalReviews ||
      b.reviewCount ||
      0,



    // ================= FLAGS =================

    isFeatured:
      b.isFeatured || false,


    isVerified:
      b.isVerified || false,



    // ================= CONTACT =================

    phone:
      b.phone ||
      b.contactNumber ||
      null,


    whatsapp:
      b.whatsapp ||
      null,



    // ================= STATS =================

    views:
      b.views ||
      0,


    phoneClicks:
      b.phoneClicks ||
      0,


    whatsappClicks:
      b.whatsappClicks ||
      0,



    distance:
      b.distance || null,

  };

};



/* ================= EDIT DTO (FULL FORM SAFE DATA) ================= */

export const toBusinessEditDTO = (b = {}) => {

  return {

    _id: b._id,


    // BASIC

    name:
      b.name || "",


    description:
      b.description || "",



    // RELATIONS

    categoryId:
      b.categoryId?._id?.toString?.() ||
      b.categoryId?.toString?.() ||
      "",



    cityId:
      b.cityId?._id?.toString?.() ||
      b.cityId?.toString?.() ||
      "",



    // LOCATION

    address:
      b.address || "",


    pincode:
      b.pincode || "",


    district:
      b.district || "",


    state:
      b.state || "",


    location:
      b.location || null,



    // CONTACT

    phone:
      b.phone || "",


    whatsapp:
      b.whatsapp || "",


    website:
      b.website || "",



    // MEDIA

    images:
      Array.isArray(b.images)
        ? b.images
        : [],


    logo:
      b.logo || "",



    // FEATURES

    businessHours:
      b.businessHours || {},


    tags:
      Array.isArray(b.tags)
        ? b.tags
        : [],


    boost:
      b.boost || false,



    // ADMIN

    isFeatured:
      b.isFeatured || false,


    isVerified:
      b.isVerified || false,



    slug:
      b.slug || "",

  };

};



/* ================= SAFE NORMALIZER FOR SAVE ================= */

export const normalizeBusinessPayload = (
  data = {},
  mode = "admin"
) => {


  return {


    name:
      data.name,


    description:
      data.description,



    categoryId:
      data.categoryId?.value ||
      data.categoryId,



    cityId:
      data.cityId?.value ||
      data.cityId,



    address:
      data.address,


    pincode:
      data.pincode,



    district:
      data.district || "",


    state:
      data.state || "",



    phone:
      data.phone,


    whatsapp:
      data.whatsapp,



    website:
      data.website || "",



    images:
      data.images || [],


    logo:
      data.logo || "",



    location:
      data.location?.coordinates?.length === 2
        ? data.location
        : undefined,



    ...(mode === "provider" && {

      businessHours:
        data.businessHours || {},


      tags:
        Array.isArray(data.tags)
          ? data.tags
          : [],


      boost:
        data.boost || false,

    }),



    ...(mode === "admin" && {

      isVerified:
        true,

    }),


  };

};