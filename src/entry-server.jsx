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
  "https://api.servdial.com/api";


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
// SSR RENDER
// =========================================================

export async function render(url) {

  const helmetContext = {};

  /*
   * Fetch business before React render.
   *
   * This allows us to provide the business data
   * through the SSR environment.
   */

  const ssrBusinessResponse =
    await fetchBusinessForSSR(url);


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
          <App ssrBusiness={ssrBusinessResponse} />
        </AuthProvider>
      </StaticRouter>
    </HelmetProvider>
  </React.StrictMode>
);


  return {

    html,

    helmet:
      helmetContext.helmet,

    ssrBusiness:
      ssrBusinessResponse,

  };
}