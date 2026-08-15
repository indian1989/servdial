// frontend/src/utils/business/serviceHelpers.js

import { SERVICE_SUGGESTIONS_BY_CATEGORY } from "./serviceConfig";

/* =========================================================
   NORMALIZE CATEGORY KEY
========================================================= */

export const normalizeCategoryKey = (categoryName = "") => {
  return String(categoryName)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "")
    .trim();
};

/* =========================================================
   RESTAURANT / FOOD FAMILY DETECTION
   Uses parent category when available
========================================================= */

export const isRestaurantCategory = ({
  categoryName = "",
  parentName = "",
  parentSlug = "",
} = {}) => {
  const categoryKey = normalizeCategoryKey(categoryName);
  const parentKey = normalizeCategoryKey(parentName);
  const parentSlugKey = normalizeCategoryKey(parentSlug);

  // Preferred: parent category
  if (
    parentKey === "restaurantandfood" ||
    parentSlugKey === "restaurantfood"
  ) {
    return true;
  }

  // Fallback for older data
  return [
    "restaurant",
    "familyrestaurant",
    "chineserestaurant",
    "cafe",
    "dhaba",
    "food",
    "fastfood",
    "bakery",
    "cloudkitchen",
    "pizzaoutlet",
    "biryanihouse",
  ].includes(categoryKey);
};

/* =========================================================
   SUGGESTED SERVICES
========================================================= */

export const getSuggestedServices = ({
  categoryName = "",
  parentName = "",
  parentSlug = "",
} = {}) => {
  const key = normalizeCategoryKey(categoryName);

  // Exact category match
  if (SERVICE_SUGGESTIONS_BY_CATEGORY[key]) {
    return SERVICE_SUGGESTIONS_BY_CATEGORY[key];
  }

  // Parent category fallback
  if (
    isRestaurantCategory({
      categoryName,
      parentName,
      parentSlug,
    })
  ) {
    return (
      SERVICE_SUGGESTIONS_BY_CATEGORY.restaurant ||
      SERVICE_SUGGESTIONS_BY_CATEGORY.food ||
      SERVICE_SUGGESTIONS_BY_CATEGORY.default
    );
  }

  return SERVICE_SUGGESTIONS_BY_CATEGORY.default;
};

/* =========================================================
   CHECK IF CATEGORY HAS SUGGESTIONS
========================================================= */

export const hasServiceSuggestions = ({
  categoryName = "",
  parentName = "",
  parentSlug = "",
} = {}) => {
  const key = normalizeCategoryKey(categoryName);

  return (
    Boolean(SERVICE_SUGGESTIONS_BY_CATEGORY[key]) ||
    isRestaurantCategory({
      categoryName,
      parentName,
      parentSlug,
    })
  );
};

/* =========================================================
   SELECT OPTIONS MAPPER
========================================================= */

export const mapServicesToSelectOptions = (services = []) => {
  return services.map((service) => ({
    value: service,
    label: service,
  }));
};