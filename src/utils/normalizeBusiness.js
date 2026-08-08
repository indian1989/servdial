export const normalizeBusiness = (b = {}) => {

  const category =
    b.categoryId?.name ||
    b.category?.name ||
    b.category ||
    "General";


  const city =
    b.cityId?.name ||
    b.cityName ||
    b.city?.name ||
    b.city ||
    "Unknown";


  const images =
    Array.isArray(b.images) && b.images.length
      ? b.images
      : b.logo
      ? [b.logo]
      : [
          "https://via.placeholder.com/400x250?text=ServDial"
        ];


  return {

    // ================= BASIC =================

    _id: b._id || b.id,

    slug:
      b.slug ||
      b._id ||
      b.id,


    name:
      b.name ||
      "Unnamed Business",


    description:
      b.description || "",


    // ================= MEDIA =================

    images,

    image:
      images[0],


    logo:
      b.logo || null,


    // ================= CATEGORY =================

    category,

    categoryId:
      b.categoryId?._id ||
      b.categoryId ||
      null,


    // ================= CITY =================

    city,

    cityId:
      b.cityId?._id ||
      b.cityId ||
      null,


    citySlug:
      b.citySlug ||
      b.cityId?.slug ||
      "",



    // ================= CONTACT =================

    phone:
      b.phone || null,


    whatsapp:
      b.whatsapp ||
      b.phone ||
      null,



    email:
      b.email || null,



    // ================= RATING =================

    rating:
      Number(
        b.averageRating ||
        b.rating ||
        0
      ),


    reviewCount:
      Number(
        b.totalReviews ||
        b.reviewCount ||
        0
      ),



    // ================= LOCATION =================

    location:
      b.location || null,


    address:
      b.address || {},



    // ================= BUSINESS DATA =================

    services:
      b.services || [],


    businessHours:
      b.businessHours || {},


    faq:
      b.faq || [],


    offers:
      b.offers || [],


    features:
      b.categoryId?.features ||
      b.features ||
      [],



    // ================= STATUS =================

    isFeatured:
      Boolean(b.isFeatured),


    isVerified:
      Boolean(b.isVerified),


    status:
      b.status || "active",



    // ================= DISTANCE =================

    distance:
      b.distance ?? null,



    // ================= NEW BUSINESS BADGE =================

    isNew:
      b.createdAt
        ? (
            Date.now() -
            new Date(b.createdAt).getTime()
          ) /
          (1000 * 60 * 60 * 24) < 7
        : false,


    // keep original if future required
    raw:b
  };
};