import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
// =========================================================
// SERVER API
// =========================================================

const API_BASE_URL =
  process.env.VITE_API_BASE_URL ||
  //"https://api.servdial.com/api";
"http://localhost:5000/api";

// =========================================================
// FETCH BUSINESS FOR SSR
// =========================================================

const fetchBusinessForSSR = async (url) => {
  try {
    const parsedUrl = new URL(
      url,
      "https://servdial.com"
    );

    const parts = parsedUrl.pathname
      .split("/")
      .filter(Boolean);

      if (
  parts[0] === ".well-known"
) {
  return null;
}

    /*
     * BUSINESS URL
     *
     * /citySlug/categorySlug/businessSlug
     *
     * IMPORTANT:
     * Business URL does NOT contain state slug.
     */

    if (parts.length !== 3) {
      return null;
    }

    const [
      citySlug,
      categorySlug,
      businessSlug,
    ] = parts;

    /*
     * Avoid treating state/city/category URLs
     * as business URLs.
     */

    if (
      !citySlug ||
      !categorySlug ||
      !businessSlug
    ) {
      return null;
    }

        /*
     * IMPORTANT:
     *
     * Business URLs are:
     * /citySlug/categorySlug/businessSlug
     *
     * City category URLs are:
     * /stateSlug/citySlug/categorySlug
     *
     * Verify that the first segment is actually
     * a city before calling the business API.
     */

    const endpoint =
      `${API_BASE_URL}/businesses/` +
      `${encodeURIComponent(citySlug)}/` +
      `${encodeURIComponent(categorySlug)}/` +
      `${encodeURIComponent(businessSlug)}`;

    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn(
        "⚠️ SSR business API:",
        response.status,
        endpoint
      );

      return null;
    }

    const data = await response.json();

    return data || null;

  } catch (error) {

    console.error(
      "❌ SSR business fetch error:",
      error
    );

    return null;
  }
};

// =========================================================
// FETCH CITY FOR SSR
// =========================================================

const fetchCityForSSR = async (url) => {
  try {
    const parsedUrl = new URL(
      url,
      "https://servdial.com"
    );

    const parts = parsedUrl.pathname
      .split("/")
      .filter(Boolean);

    /*
     * CURRENT CITY URL
     *
     * /stateSlug/citySlug
     *
     * Example:
     * /bihar/hajipur-vaishali-bihar
     */

    if (parts.length !== 2) {
      return null;
    }

    const [stateSlug, citySlug] = parts;

    /*
     * Blog URLs and other known two-segment
     * routes should not be treated as city URLs.
     */

    if (
      !stateSlug ||
      !citySlug ||
      stateSlug === "blog"
    ) {
      return null;
    }

    const endpoint =
      `${API_BASE_URL}/cities/` +
      `${encodeURIComponent(citySlug)}`;

    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn(
        "⚠️ SSR city API:",
        response.status,
        endpoint
      );

      return null;
    }

    const data = await response.json();

    /*
     * City API may return:
     * { city: {...} }
     * or
     * { data: {...} }
     */

    const city =
      data?.city ||
      data?.data ||
      null;

    /*
     * If API asks for a redirect, do not use
     * redirected/invalid city data for SSR.
     */

    if (
      data?.redirect === true ||
      !city
    ) {
      return null;
    }

    /*
     * Verify this city belongs to the requested state.
     */

    if (
      city.stateSlug &&
      city.stateSlug !== stateSlug
    ) {
      return null;
    }

    return city;

  } catch (error) {

    console.error(
      "❌ SSR city fetch error:",
      error
    );

    return null;
  }
};

// =========================================================
// FETCH CATEGORIES FOR CITY SSR
// =========================================================

const fetchCategoriesForSSR = async () => {
  try {
    const endpoint = `${API_BASE_URL}/categories`;

    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn(
        "⚠️ SSR categories API:",
        response.status,
        endpoint
      );

      return [];
    }

    const data = await response.json();

    return (
      data?.categories ||
      data?.data ||
      []
    );
  } catch (error) {
    console.error(
      "❌ SSR categories fetch error:",
      error
    );

    return [];
  }
};

// =========================================================
// FETCH RANDOM CITY BUSINESSES FOR SSR
// =========================================================

const fetchCityBusinessesForSSR = async (citySlug) => {
  try {
    if (!citySlug) return [];

    const endpoint =
      `${API_BASE_URL}/businesses/random` +
      `?city=${encodeURIComponent(citySlug)}` +
      `&limit=20`;

    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn(
        "⚠️ SSR city businesses API:",
        response.status,
        endpoint
      );

      return [];
    }

    const data = await response.json();

    return Array.isArray(data?.data)
      ? data.data
      : [];
  } catch (error) {
    console.error(
      "❌ SSR city businesses fetch error:",
      error
    );

    return [];
  }
};

// =========================================================
// FETCH CITY CATEGORY FOR SSR
// =========================================================

const fetchCityCategoryForSSR = async (url) => {
  try {
    const parsedUrl = new URL(
      url,
      "https://servdial.com"
    );

    const parts = parsedUrl.pathname
      .split("/")
      .filter(Boolean);

    /*
     * CITY + CATEGORY URL
     *
     * /stateSlug/citySlug/categorySlug
     */

    if (parts.length !== 3) {
      return null;
    }

    const [
      stateSlug,
      citySlug,
      categorySlug,
    ] = parts;

    if (
      !stateSlug ||
      !citySlug ||
      !categorySlug
    ) {
      return null;
    }

    /*
     * Verify that the second segment
     * is actually a city.
     */

    const cityEndpoint =
      `${API_BASE_URL}/cities/` +
      `${encodeURIComponent(citySlug)}`;

    const cityResponse = await fetch(
      cityEndpoint,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!cityResponse.ok) {
      return null;
    }

    const cityData =
      await cityResponse.json();

    const city =
      cityData?.city ||
      cityData?.data ||
      null;

    if (!city) {
      return null;
    }

    if (
      city.slug !== citySlug ||
      (
        city.stateSlug &&
        city.stateSlug !== stateSlug
      )
    ) {
      return null;
    }

    /*
     * Fetch the exact same API used by
     * CityCategoryPage on the client.
     */

    const endpoint =
      `${API_BASE_URL}/seo/` +
      `${encodeURIComponent(citySlug)}/` +
      `${encodeURIComponent(categorySlug)}`;

    const response = await fetch(
      endpoint,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    /*
     * Preserve canonical/404 information.
     */

    if (
      data?.redirect === true
    ) {
      return null;
    }

    if (
      categorySlug !== "all" &&
      !data?.category?.slug
    ) {
      return null;
    }

    return {
      stateSlug,
      citySlug,
      categorySlug,

      city:
        data?.city ||
        city,

      category:
        categorySlug === "all"
          ? null
          : (
              data?.category ||
              null
            ),

      subCategories:
        data?.subCategories ||
        [],

      businesses:
        Array.isArray(data?.data)
          ? data.data
          : [],

      canonicalCitySlug:
        data?.city?.slug ||
        data?.canonicalCitySlug ||
        citySlug,

      canonicalCategorySlug:
        data?.category?.slug ||
        data?.canonicalSlug ||
        categorySlug,

      redirect:
        data?.redirect === true,
    };

  } catch (error) {
    console.error(
      "❌ SSR city category fetch error:",
      error
    );

    return null;
  }
};

// =========================================================
// FETCH BLOG FOR SSR
// =========================================================

const fetchBlogForSSR = async (url) => {
  try {
    const parsedUrl = new URL(url, "https://servdial.com");
    const parts = parsedUrl.pathname.split("/").filter(Boolean);

    if (parts[0] !== "blog") return null;

    let endpoint = "";

    // /blog
    if (parts.length === 1) {
      endpoint = `${API_BASE_URL}/blog`;
    }

    // /blog/:slug
    else if (parts.length === 2 && parts[1]) {
      endpoint =
        `${API_BASE_URL}/blog/` +
        `${encodeURIComponent(parts[1])}`;
    }

    else {
      return null;
    }

    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn(
        `Blog SSR fetch failed: ${response.status} ${endpoint}`
      );
      return null;
    }

    const data = await response.json();

    // Return only API data so frontend SSR props
    // match the actual blog/list data shape.
    return data?.data || null;
  } catch (error) {
    console.error("Blog SSR fetch error:", error);
    return null;
  }
};


// =========================================================
// SSR RENDER
// =========================================================

export async function render(url) {

  console.log("🔥 NEW ENTRY-SERVER IS RUNNING:", url);

  const helmetContext = {};

  /*
   * Fetch business before React render.
   *
   * This allows us to provide the business data
   * through the SSR environment.
   */

const ssrBusinessResponse =
  await fetchBusinessForSSR(url);

const ssrBlogResponse =
  await fetchBlogForSSR(url);

const ssrCityResponse =
  await fetchCityForSSR(url);

const ssrCityCategoryResponse =
  await fetchCityCategoryForSSR(url);

let ssrCategoriesResponse = [];
let ssrBusinessesResponse = [];

if (ssrCityResponse) {
  ssrCategoriesResponse =
    await fetchCategoriesForSSR();

  const citySlug =
    ssrCityResponse.slug ||
    ssrCityResponse.data?.slug;

  if (citySlug) {
    ssrBusinessesResponse =
      await fetchCityBusinessesForSSR(citySlug);
  }
}

  /*
   * IMPORTANT:
   *
   * We do not modify the existing client routing.
   * This data is currently prepared for SSR.
   */

const html = renderToString(
  <React.StrictMode>
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <AuthProvider>
          <App
  ssrBusiness={ssrBusinessResponse}
  ssrBlog={ssrBlogResponse}
  ssrCity={ssrCityResponse}
  ssrCategories={ssrCategoriesResponse}
  ssrBusinesses={ssrBusinessesResponse}
  ssrCityCategory={ssrCityCategoryResponse}
/>
        </AuthProvider>
      </StaticRouter>
    </HelmetProvider>
  </React.StrictMode>
);


  return {
  html,
  helmet: helmetContext.helmet,
  ssrBusiness: ssrBusinessResponse,
  ssrBlog: ssrBlogResponse,
  ssrCity: ssrCityResponse,
  ssrCategories: ssrCategoriesResponse,
  ssrBusinesses: ssrBusinessesResponse,
  ssrCityCategory: ssrCityCategoryResponse,
};
}