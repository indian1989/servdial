// frontend/src/utils/business/serviceHelpers.js

import {
  SERVICE_SUGGESTIONS_BY_CATEGORY,
  DEFAULT_SERVICE_SUGGESTIONS,
  ALL_SERVICE_SUGGESTIONS,
} from "./serviceConfig";

import {
  SERVICE_LIBRARY,
} from "./serviceLibrary";


/* =========================================================
   NORMALIZE TEXT
========================================================= */

export const normalizeServiceText = (value = "") => {
  return String(value)
    .trim()
    .replace(/\s+/g, " ");
};


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
========================================================= */

export const isRestaurantCategory = ({
  categoryName = "",
  parentName = "",
  parentSlug = "",
} = {}) => {

  const categoryKey =
    normalizeCategoryKey(categoryName);

  const parentKey =
    normalizeCategoryKey(parentName);

  const parentSlugKey =
    normalizeCategoryKey(parentSlug);


  /* -----------------------------------------
     Preferred: Parent Category
  ----------------------------------------- */

  if (
    parentKey === "restaurantandfood" ||
    parentSlugKey === "restaurantfood"
  ) {
    return true;
  }


  /* -----------------------------------------
     Fallback: Older Category Data
  ----------------------------------------- */

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
    "sweetshop",
    "restaurantandbar",
    "foodcourt",
    "icecreamparlor",
    "juicecenter",
  ].includes(categoryKey);
};


/* =========================================================
   GET CATEGORY-SPECIFIC SERVICES
========================================================= */

export const getCategoryServices = (
  categoryName = ""
) => {

  const key =
    normalizeCategoryKey(categoryName);

  return Array.isArray(
    SERVICE_SUGGESTIONS_BY_CATEGORY[key]
  )
    ? SERVICE_SUGGESTIONS_BY_CATEGORY[key]
    : [];
};


/* =========================================================
   GET SUGGESTED SERVICES

   Priority:

   1. Exact category
   2. Restaurant / Food category
   3. Common services

   IMPORTANT:
   Large SERVICE_LIBRARY is NOT dumped here.
========================================================= */

export const getSuggestedServices = ({
  categoryName = "",
  parentName = "",
  parentSlug = "",
} = {}) => {

  const categoryServices =
    getCategoryServices(categoryName);


  /* -----------------------------------------
     Exact Category Match
  ----------------------------------------- */

  if (categoryServices.length > 0) {

    return uniqueServices([
      ...categoryServices,
      ...DEFAULT_SERVICE_SUGGESTIONS,
    ]);

  }


  /* -----------------------------------------
     Restaurant / Food Fallback
  ----------------------------------------- */

  if (
    isRestaurantCategory({
      categoryName,
      parentName,
      parentSlug,
    })
  ) {

    return uniqueServices([
      ...(SERVICE_SUGGESTIONS_BY_CATEGORY.restaurant || []),
      ...DEFAULT_SERVICE_SUGGESTIONS,
    ]);

  }


  /* -----------------------------------------
     Global Common Services
  ----------------------------------------- */

  return uniqueServices(
    DEFAULT_SERVICE_SUGGESTIONS
  );
};


/* =========================================================
   CHECK IF CATEGORY HAS SUGGESTIONS
========================================================= */

export const hasServiceSuggestions = ({
  categoryName = "",
  parentName = "",
  parentSlug = "",
} = {}) => {

  return getSuggestedServices({
    categoryName,
    parentName,
    parentSlug,
  }).length > 0;
};


/* =========================================================
   GET ALL SERVICES

   Includes:

   - Common services
   - Master service library
   - Category-specific services
========================================================= */

export const getAllServices = () => {

  return uniqueServices([
    ...ALL_SERVICE_SUGGESTIONS,
    ...SERVICE_LIBRARY,
  ]);
};


/* =========================================================
   SEARCH SERVICE LIBRARY
========================================================= */

export const searchServices = (
  searchText = "",
  services = ALL_SERVICE_SUGGESTIONS
) => {

  const query =
    normalizeServiceText(searchText)
      .toLowerCase();


  if (!query) {
    return [];
  }


  return uniqueServices(
    services.filter((service) => {

      const name =
        typeof service === "string"
          ? service
          : service?.name;

      return normalizeServiceText(name)
        .toLowerCase()
        .includes(query);

    })
  );
};


/* =========================================================
   REMOVE DUPLICATE SERVICES
========================================================= */

export const uniqueServices = (
  services = []
) => {

  const seen = new Set();


  return services.filter((service) => {

    const name =
      typeof service === "string"
        ? service
        : service?.name;


    const normalized =
      normalizeServiceText(name);


    const key =
      normalized.toLowerCase();


    if (!normalized || seen.has(key)) {
      return false;
    }


    seen.add(key);

    return true;

  });

};


/* =========================================================
   SELECT OPTIONS MAPPER
========================================================= */

export const mapServicesToSelectOptions = (
  services = []
) => {

  return uniqueServices(services)
    .map((service) => {

      const name =
        typeof service === "string"
          ? service
          : service?.name;


      const normalized =
        normalizeServiceText(name);


      if (!normalized) {
        return null;
      }


      return {
        value: normalized,
        label: normalized,
      };

    })
    .filter(Boolean);

};