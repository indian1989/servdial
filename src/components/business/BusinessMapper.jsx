export const normalizeBusinessPayload = (data, mode = "provider") => {
  return {
    name: data.name,
    description: data.description,
    categoryId: data.categoryId?.value || data.categoryId,
    cityId: data.cityId?.value || data.cityId,

    address: data.address,
    phone: data.phone,
    whatsapp: data.whatsapp || data.phone,
    website: data.website || "",

    // provider-only fields
    ...(mode === "provider" && {
      logo: data.logo || "",
      images: data.images || [],
      businessHours: data.businessHours || {},
      tags: Array.isArray(data.tags)
        ? data.tags
        : (data.tags || "")
            .split(",")
            .map(t => t.trim())
            .filter(Boolean),

      boost: data.boost || false,
      location: data.location && data.location.coordinates?.length === 2
  ? data.location
  : undefined,
    }),

    // admin-only override
    ...(mode === "admin" && {
      isVerified: true,
      role: "admin",
    }),
  };
};
