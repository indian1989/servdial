// frontend/src/pages/TemporaryListings.jsx

import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import TemporaryListingList from "../components/temporaryListing/TemporaryListingList";

const TemporaryListings = ({
  ssrTemporaryListings,
}) => {
    const { user } = useContext(AuthContext);
const navigate = useNavigate();

const handleAddTemporaryListing = () => {
  if (!user) {
    navigate("/unauthorized");
    return;
  }

  if (user.role === "provider") {
    navigate("/provider/temporary-listings/add");
    return;
  }

  if (user.role === "admin" || user.role === "superadmin") {
    navigate("/admin/temporary-listings/add");
    return;
  }

  navigate("/unauthorized");
};

  return (
    <div className="min-h-screen bg-gray-50">
      
      <Helmet>
  <title>Temporary Listings | ServDial</title>

  <meta
    name="description"
    content="Discover temporary businesses, services, offers and other time-limited listings available on ServDial."
  />

  <meta
    name="robots"
    content="index,follow"
  />

  <link
    rel="canonical"
    href="https://www.servdial.com/temporary-listings"
  />

  <meta
    property="og:title"
    content="Temporary Listings | ServDial"
  />

  <meta
    property="og:description"
    content="Discover temporary businesses, services, offers and other time-limited listings available on ServDial."
  />

  <meta
    property="og:url"
    content="https://www.servdial.com/temporary-listings"
  />

  <meta
    property="og:type"
    content="website"
  />

  <meta
    name="twitter:card"
    content="summary_large_image"
  />

  <meta
    name="twitter:title"
    content="Temporary Listings | ServDial"
  />

  <meta
    name="twitter:description"
    content="Discover temporary businesses, services, offers and other time-limited listings available on ServDial."
  />

  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.servdial.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Temporary Listings",
          item: "https://www.servdial.com/temporary-listings",
        },
      ],
    })}
  </script>
</Helmet>

      {/* Header */}

      <section className="mx-4 mt-6 rounded-2xl bg-blue-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
         <nav
  aria-label="Breadcrumb"
  className="mb-6 text-sm"
>
  <ol className="flex flex-wrap items-center gap-2">
    <li>
      <Link
        to="/"
        className="text-blue-100 transition hover:text-white"
      >
        Home
      </Link>
    </li>

    <li className="text-blue-200">&gt;</li>

    <li
      aria-current="page"
      className="font-medium text-white"
    >
      Temporary Listings
    </li>
  </ol>
</nav>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                Temporary Listing
              </span>

              <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Temporary Listings
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-blue-50 sm:text-base">
                Discover businesses, services, offers and other
                time-limited listings available on ServDial.
              </p>
            </div>

            <button
  type="button"
  onClick={handleAddTemporaryListing}
  className="inline-flex w-fit items-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-blue-600 shadow-sm transition hover:bg-blue-50"
>
  Add Temporary Listing
</button>
          </div>
        </div>
      </section>

      {/* Listings */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TemporaryListingList
  ssrTemporaryListings={
    ssrTemporaryListings
  }
/>
      </main>
    </div>
  );
};

export default TemporaryListings;