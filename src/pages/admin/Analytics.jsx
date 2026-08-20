import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import Select from "react-select";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  FaUsers,
  FaUserShield,
  FaCity,
  FaLayerGroup,
  FaStore,
  FaClock,
  FaStar,
  FaBullhorn,
  FaChartBar,
  FaMapMarkerAlt,
  FaList,
  FaFilter,
} from "react-icons/fa";


/* =========================================================
   ANALYTICS
========================================================= */

function Analytics() {

  const [stats, setStats] = useState({
    users: 0,
    admins: 0,
    cities: 0,
    categories: 0,
    businesses: 0,
    pending: 0,
    featured: 0,

    ads: {
      total: 0,
      active: 0,
      expired: 0,
      clicks: 0,
    },
  });

  const [businesses, setBusinesses] = useState([]);
  const [users, setUsers] = useState([]);
  const [cities, setCities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Default detail section
   * Category-wise Business Data
   */
  const [activeSection, setActiveSection] =
    useState("categories");

  const [cityCategoryCity, setCityCategoryCity] = useState(null);
  const [cityCategoryCategory, setCityCategoryCategory] = useState(null);

  /* =========================================================
     FETCH DATA
  ========================================================= */

  const fetchAnalytics = async () => {
  try {
    setLoading(true);
    setError("");

    const [
      adminRes,
      businessRes,
      usersRes,
      adsRes,
      citiesRes,
    ] = await Promise.all([
      API.get("/admin/dashboard"),

      // Analytics ke liye complete business data
      API.get("/admin/businesses", {
        params: {
          page: 1,
          limit: 10000,
        },
      }),

      API.get("/admin/users"),

      API.get("/admin/banners"),

      API.get("/admin/cities"),
    ]);

    /* =====================================================
       ADMIN / DASHBOARD DATA
    ===================================================== */

    const adminResponse = adminRes?.data || {};

    const adminData =
      adminResponse?.stats ||
      adminResponse?.data ||
      {};


    /* =====================================================
       USERS
    ===================================================== */

    const usersResponse = usersRes?.data || {};

    const usersList =
      usersResponse?.data ||
      usersResponse?.users ||
      [];

    const safeUsers =
      Array.isArray(usersList)
        ? usersList
        : [];


    /* =====================================================
       BUSINESSES
    ===================================================== */

    const businessResponse =
      businessRes?.data || {};

    const businessList =
      businessResponse?.data ||
      businessResponse?.businesses ||
      [];

    const safeBusinesses =
      Array.isArray(businessList)
        ? businessList
        : [];


    /* =====================================================
       BUSINESS TOTAL
    ===================================================== */

    const businessTotal =
      Number(
        businessResponse?.meta?.total ??
        businessResponse?.total ??
        safeBusinesses.length
      );


    /* =====================================================
       CITIES
    ===================================================== */

    const citiesResponse =
      citiesRes?.data || {};

    const citiesList =
      citiesResponse?.data ||
      citiesResponse?.cities ||
      [];

    const safeCities =
      Array.isArray(citiesList)
        ? citiesList
        : [];


    /* =====================================================
       BANNERS / ADS
    ===================================================== */

    const adsResponse =
      adsRes?.data || {};

    const bannersList =
      adsResponse?.data ||
      adsResponse?.banners ||
      [];

    const safeBanners =
      Array.isArray(bannersList)
        ? bannersList
        : [];


    /* =====================================================
       BANNER ANALYTICS
    ===================================================== */

    const totalBanners =
      safeBanners.length;

    const activeBanners =
      safeBanners.filter(
        (banner) =>
          banner.isActive === true &&
          banner.status === "approved"
      ).length;

    const inactiveBanners =
      safeBanners.filter(
        (banner) =>
          banner.isActive !== true ||
          banner.status !== "approved"
      ).length;

    const totalClicks =
      safeBanners.reduce(
        (total, banner) =>
          total +
          Number(banner.clicks || 0),
        0
      );


    /* =====================================================
       BUSINESS STATUS
    ===================================================== */

    const pendingBusinesses =
      safeBusinesses.filter(
        (business) =>
          business.status === "pending"
      ).length;

    const featuredBusinesses =
      safeBusinesses.filter(
        (business) =>
          business.isFeatured === true
      ).length;


    /* =====================================================
       USERS / ADMINS
    ===================================================== */

    const totalUsers =
      typeof adminData.users === "number"
        ? adminData.users
        : typeof adminData.totalUsers === "number"
          ? adminData.totalUsers
          : safeUsers.filter(
              (user) =>
                user.role === "user" ||
                user.role === "provider"
            ).length;

    const totalAdmins =
      typeof adminData.admins === "number"
        ? adminData.admins
        : typeof adminData.totalAdmins === "number"
          ? adminData.totalAdmins
          : safeUsers.filter(
              (user) =>
                user.role === "admin" ||
                user.role === "superadmin"
            ).length;


    /* =====================================================
       CATEGORIES
    ===================================================== */

    const totalCategories =
      typeof adminData.categories === "number"
        ? adminData.categories
        : 0;


    /* =====================================================
       CITIES
    ===================================================== */

    const totalCities =
      typeof adminData.cities === "number"
        ? adminData.cities
        : safeCities.length;


    /* =====================================================
       SAVE BUSINESS / USER / CITY DATA
    ===================================================== */

    setBusinesses(safeBusinesses);

    setUsers(safeUsers);

    setCities(safeCities);


    /* =====================================================
       SAVE ANALYTICS STATS
    ===================================================== */

    setStats({

      users: totalUsers,

      admins: totalAdmins,

      cities: totalCities,

      categories: totalCategories,

      businesses: businessTotal,

      pending: pendingBusinesses,

      featured: featuredBusinesses,

      ads: {
        total: totalBanners,
        active: activeBanners,
        expired: inactiveBanners,
        clicks: totalClicks,
      },

    });

  } catch (err) {

    console.error(
      "Analytics error:",
      err
    );

    setError(
      err?.response?.data?.message ||
      "Failed to load analytics data."
    );

  } finally {

    setLoading(false);

  }
};


useEffect(() => {
  fetchAnalytics();
}, []);


  /* =========================================================
     CATEGORY-WISE DATA
  ========================================================= */

  const categoryData = useMemo(() => {

    const map = {};

    businesses.forEach((business) => {

      const category =
        business.categoryId?.name ||
        business.categoryName ||
        business.category?.name ||
        "Uncategorized";

      if (!map[category]) {
        map[category] = 0;
      }

      map[category]++;

    });


    return Object.entries(map)

      .map(([category, count]) => ({
        category,
        count,
      }))

      .sort(
        (a, b) =>
          b.count - a.count
      );

  }, [businesses]);


  /* =========================================================
     CITY-WISE DATA
  ========================================================= */

  const cityData = useMemo(() => {

    const map = {};

    businesses.forEach((business) => {

      const city =
        business.cityId?.name ||
        business.cityName ||
        business.city?.name ||
        "Unknown City";

      if (!map[city]) {
        map[city] = 0;
      }

      map[city]++;

    });


    return Object.entries(map)

      .map(([city, count]) => ({
        city,
        count,
      }))

      .sort(
        (a, b) =>
          b.count - a.count
      );

  }, [businesses]);

  /* =========================================================
   CITY + CATEGORY-WISE DATA
========================================================= */

const cityCategoryData = useMemo(() => {

  const map = {};

  businesses.forEach((business) => {

    /* =====================================================
       CITY
       Prefer slug for unique grouping
    ===================================================== */

    const citySlug =
      business.cityId?.slug ||
      business.citySlug ||
      business.city?.slug ||
      "";


    const cityName =
      business.cityId?.name ||
      business.cityName ||
      business.city?.name ||
      "Unknown City";


    /* =====================================================
       CATEGORY
       Prefer slug for unique grouping
    ===================================================== */

    const categorySlug =
      business.categoryId?.slug ||
      business.categorySlug ||
      business.category?.slug ||
      "";


    const categoryName =
      business.categoryId?.name ||
      business.categoryName ||
      business.category?.name ||
      "Uncategorized";


    /* =====================================================
       SAFETY
    ===================================================== */

    if (!citySlug || !categorySlug) {
      return;
    }


    /* =====================================================
       UNIQUE CITY + CATEGORY KEY

       Example:
       hajipur-vaishali-bihar__hotel
    ===================================================== */

    const key =
      `${citySlug}__${categorySlug}`;


    if (!map[key]) {

      map[key] = {
        key,

        citySlug,
        categorySlug,

        cityName,
        categoryName,

        count: 0,
      };

    }


    map[key].count++;

  });


  return Object.values(map)
    .sort(
      (a, b) =>
        b.count - a.count
    );

}, [businesses]);

/* =========================================================
   CITY + CATEGORY FILTER OPTIONS
========================================================= */

const cityCategoryCityOptions = useMemo(() => {

  const map = new Map();

  cityCategoryData.forEach((item) => {

    if (!item.citySlug) {
      return;
    }

    if (!map.has(item.citySlug)) {

      map.set(item.citySlug, {
        value: item.citySlug,
        label: item.cityName,
      });

    }

  });

  return Array.from(map.values())
    .sort((a, b) =>
      a.label.localeCompare(b.label)
    );

}, [cityCategoryData]);


const cityCategoryCategoryOptions = useMemo(() => {

  const map = new Map();

  cityCategoryData.forEach((item) => {

    if (!item.categorySlug) {
      return;
    }

    if (!map.has(item.categorySlug)) {

      map.set(item.categorySlug, {
        value: item.categorySlug,
        label: item.categoryName,
      });

    }

  });

  return Array.from(map.values())
    .sort((a, b) =>
      a.label.localeCompare(b.label)
    );

}, [cityCategoryData]);


/* =========================================================
   FILTERED CITY + CATEGORY DATA
========================================================= */

const filteredCityCategoryData = useMemo(() => {

  let result = cityCategoryData;


  /* CITY FILTER */

  if (cityCategoryCity?.value) {

    result = result.filter(
      (item) =>
        item.citySlug ===
        cityCategoryCity.value
    );

  }


  /* CATEGORY FILTER */

  if (cityCategoryCategory?.value) {

    result = result.filter(
      (item) =>
        item.categorySlug ===
        cityCategoryCategory.value
    );

  }


  return result;

}, [
  cityCategoryData,
  cityCategoryCity,
  cityCategoryCategory,
]);


/* =========================================================
   DISPLAY DATA

   No filter:
   → Top 40

   Filter:
   → All matching results
========================================================= */

const displayedCityCategoryData =
  cityCategoryCity ||
  cityCategoryCategory
    ? filteredCityCategoryData
    : filteredCityCategoryData.slice(0, 40);



  /* =========================================================
     BUSINESS STATUS DATA
  ========================================================= */

  const statusData = useMemo(() => {

    const map = {};

    businesses.forEach((business) => {

      const status =
        business.status || "unknown";

      if (!map[status]) {
        map[status] = 0;
      }

      map[status]++;

    });


    return Object.entries(map).map(
      ([status, count]) => ({
        status,
        count,
      })
    );

  }, [businesses]);


  /* =========================================================
     TOP BUSINESSES
  ========================================================= */

  const featuredBusinesses =
    useMemo(() => {

      return businesses
        .filter(
          (business) =>
            business.isFeatured
        )
        .slice(0, 20);

    }, [businesses]);


  /* =========================================================
     COLORS
  ========================================================= */

  const COLORS = [
    "#4f46e5",
    "#10b981",
    "#f97316",
    "#ef4444",
    "#eab308",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
    "#14b8a6",
    "#6366f1",
  ];


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {

    return (
      <div className="space-y-6">

        <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

          {Array(10)
            .fill(0)
            .map((_, index) => (

              <div
                key={index}
                className="
                  h-28
                  bg-gray-200
                  rounded-2xl
                  animate-pulse
                "
              />

            ))}

        </div>

      </div>
    );

  }


  if (error) {

    return (
      <div className="bg-red-50 text-red-600 p-5 rounded-xl">
        {error}
      </div>
    );

  }


  /* =========================================================
     CLICKABLE STAT CARD
  ========================================================= */

  const StatCard = ({
    title,
    value,
    icon,
    color,
    section,
  }) => {

    const active =
      activeSection === section;

    return (

      <button
        type="button"
        onClick={() =>
          setActiveSection(section)
        }
        className={`
          text-left
          w-full
          rounded-2xl
          p-4
          sm:p-5
          bg-gradient-to-r
          ${color}
          text-white
          shadow-md
          hover:shadow-xl
          transition-all
          duration-200
          active:scale-[0.98]
          ${
            active
              ? "ring-4 ring-blue-200 scale-[1.01]"
              : ""
          }
        `}
      >

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <p className="text-xs sm:text-sm opacity-80">
              {title}
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold mt-1">
              {value}
            </h2>

          </div>

          <div className="text-xl sm:text-2xl opacity-80">
            {icon}
          </div>

        </div>

        <p className="text-[10px] sm:text-xs opacity-70 mt-3">
          Click to view details →
        </p>

      </button>

    );

  };


  /* =========================================================
     DETAIL HEADER
  ========================================================= */

  const DetailHeader = ({
    icon,
    title,
    description,
  }) => (

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

      <div className="flex items-center gap-3">

        <div className="
          w-11
          h-11
          rounded-xl
          bg-indigo-100
          text-indigo-600
          flex
          items-center
          justify-center
          shrink-0
        ">
          {icon}
        </div>

        <div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-gray-500">
            {description}
          </p>

        </div>

      </div>

    </div>

  );


  /* =========================================================
     RENDER DETAILS
  ========================================================= */

  const renderDetails = () => {

    /* =====================================================
   CITY + CATEGORY
===================================================== */

if (activeSection === "cityCategories") {

  return (

    <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6">

      <DetailHeader
        icon={<FaFilter />}
        title="City + Category-wise Businesses"
        description="Business distribution across cities and service categories"
      />


      {cityCategoryData.length === 0 ? (

        <EmptyState
          text="No city + category business data available."
        />

      ) : (

        <>

          {/* =================================================
              CHART
          ================================================= */}

          <div className="w-full h-[320px] sm:h-[400px] min-w-0 min-h-0 relative">
  <ResponsiveContainer
    width="100%"
    height="100%"
    minWidth={0}
    minHeight={0}
  >

              <BarChart
                data={displayedCityCategoryData.slice(0, 40)}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 70,
                }}
              >

                <XAxis
                  dataKey="key"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={100}
                  tick={{
                    fontSize: 10,
                  }}
                />

                <YAxis />

                <Tooltip
                  formatter={(value) => [
                    value,
                    "Businesses",
                  ]}
                  labelFormatter={(label) => {

                    const item =
                      cityCategoryData.find(
                        (entry) =>
                          entry.key === label
                      );

                    if (!item) {
                      return label;
                    }

                    return `${item.cityName} — ${item.categoryName}`;

                  }}
                />

                <Bar
                  dataKey="count"
                  name="Businesses"
                  fill="#7c3aed"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>


          {/* =================================================
              DETAIL TABLE
          ================================================= */}

          <div className="mt-6">

            <div className="flex items-center justify-between mb-3">

              <div>

                <h3 className="font-semibold">

                  City + Category Details

                </h3>

                <p className="text-xs text-gray-500 mt-1">

                  Grouped using city slug and category slug

                </p>

              </div>

              <span className="
                text-xs
                px-3
                py-1
                rounded-full
                bg-indigo-50
                text-indigo-600
                font-medium
              ">

                {displayedCityCategoryData.length} combinations

              </span>

            </div>

            {/* =================================================
    SEARCH FILTERS
================================================= */}

<div className="
  grid
  grid-cols-1
  md:grid-cols-2
  gap-4
  mb-6
">

  {/* CITY */}

  <div>

    <label className="
      block
      text-sm
      font-medium
      text-gray-700
      mb-2
    ">
      Search City
    </label>

    <Select
      options={cityCategoryCityOptions}
      value={cityCategoryCity}
      onChange={setCityCategoryCity}
      isClearable
      isSearchable
      placeholder="Search city..."
      noOptionsMessage={() =>
        "City not found"
      }
    />

  </div>


  {/* CATEGORY */}

  <div>

    <label className="
      block
      text-sm
      font-medium
      text-gray-700
      mb-2
    ">
      Search Category
    </label>

    <Select
      options={cityCategoryCategoryOptions}
      value={cityCategoryCategory}
      onChange={setCityCategoryCategory}
      isClearable
      isSearchable
      placeholder="Search category..."
      noOptionsMessage={() =>
        "Category not found"
      }
    />

  </div>

</div>

<div className="
  flex
  flex-col
  sm:flex-row
  sm:items-center
  sm:justify-between
  gap-2
  mb-4
">

  <div>

    <h3 className="font-semibold">
      City + Category Details
    </h3>

    <p className="text-xs text-gray-500 mt-1">

      {cityCategoryCity || cityCategoryCategory
        ? `Showing ${filteredCityCategoryData.length} matching combinations`
        : "Showing top 40 combinations"}

    </p>

  </div>


  {(cityCategoryCity ||
    cityCategoryCategory) && (

    <button
      type="button"
      onClick={() => {
        setCityCategoryCity(null);
        setCityCategoryCategory(null);
      }}
      className="
        text-sm
        text-blue-600
        hover:text-blue-800
        font-medium
      "
    >
      Clear Filters
    </button>

  )}

</div>


            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>

                  <tr className="border-b bg-gray-50">

                    <th className="text-left p-3">
                      #
                    </th>

                    <th className="text-left p-3">
                      City
                    </th>

                    <th className="text-left p-3">
                      Category
                    </th>

                    <th className="text-left p-3">
                      City Slug
                    </th>

                    <th className="text-left p-3">
                      Category Slug
                    </th>

                    <th className="text-right p-3">
                      Businesses
                    </th>

                    <th className="text-right p-3">
                      Share
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {displayedCityCategoryData.map(
                    (item, index) => {

                      const percentage =
                        stats.businesses > 0
                          ? (
                              (item.count /
                                stats.businesses) *
                              100
                            ).toFixed(1)
                          : "0.0";


                      return (

                        <tr
                          key={item.key}
                          className="
                            border-b
                            last:border-0
                            hover:bg-gray-50
                          "
                        >

                          <td className="
                            p-3
                            text-gray-500
                          ">

                            {index + 1}

                          </td>


                          <td className="
                            p-3
                            font-medium
                          ">

                            {item.cityName}

                          </td>


                          <td className="
                            p-3
                            font-medium
                            text-blue-600
                          ">

                            {item.categoryName}

                          </td>


                          <td className="
                            p-3
                            text-xs
                            text-gray-500
                          ">

                            {item.citySlug}

                          </td>


                          <td className="
                            p-3
                            text-xs
                            text-gray-500
                          ">

                            {item.categorySlug}

                          </td>


                          <td className="
                            p-3
                            text-right
                            font-semibold
                          ">

                            {item.count}

                          </td>


                          <td className="
                            p-3
                            text-right
                            text-gray-500
                          ">

                            {percentage}%

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </>

      )}

    </div>

  );

}

    /* =====================================================
       CATEGORY
    ===================================================== */

    if (activeSection === "categories") {

      return (

        <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6">

          <DetailHeader
            icon={<FaLayerGroup />}
            title="Category-wise Businesses"
            description="Business distribution across categories"
          />


          {categoryData.length === 0 ? (

            <EmptyState text="No category data available." />

          ) : (

            <>

              {/* CHART */}

              <div className="w-full h-[320px] sm:h-[400px] min-w-0 min-h-0 relative">
  <ResponsiveContainer
    width="100%"
    height="100%"
    minWidth={0}
    minHeight={0}
  >

                  <BarChart
                    data={categoryData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: 0,
                      bottom: 50,
                    }}
                  >

                    <XAxis
                      dataKey="category"
                      angle={-35}
                      textAnchor="end"
                      interval={0}
                      height={80}
                      tick={{
                        fontSize: 11,
                      }}
                    />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="count"
                      name="Businesses"
                      fill="#4f46e5"
                      radius={[
                        6,
                        6,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>


              {/* DETAIL TABLE */}

              <div className="mt-6">

                <h3 className="font-semibold mb-3">
                  Category Details
                </h3>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead>

                      <tr className="border-b bg-gray-50">

                        <th className="text-left p-3">
                          #
                        </th>

                        <th className="text-left p-3">
                          Category
                        </th>

                        <th className="text-right p-3">
                          Businesses
                        </th>

                        <th className="text-right p-3">
                          Share
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {categoryData.map(
                        (item, index) => {

                          const percentage =
                            stats.businesses > 0
                              ? (
                                  (item.count /
                                    stats.businesses) *
                                  100
                                ).toFixed(1)
                              : "0.0";

                          return (

                            <tr
                              key={item.category}
                              className="border-b last:border-0 hover:bg-gray-50"
                            >

                              <td className="p-3 text-gray-500">
                                {index + 1}
                              </td>

                              <td className="p-3 font-medium">
                                {item.category}
                              </td>

                              <td className="p-3 text-right font-semibold">
                                {item.count}
                              </td>

                              <td className="p-3 text-right text-gray-500">
                                {percentage}%
                              </td>

                            </tr>

                          );

                        }
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </>

          )}

        </div>

      );

    }


    /* =====================================================
       CITY
    ===================================================== */

    if (activeSection === "cities") {

      return (

        <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6">

          <DetailHeader
            icon={<FaCity />}
            title="City-wise Businesses"
            description="Business distribution by city"
          />


          {cityData.length === 0 ? (

            <EmptyState text="No city-wise business data available." />

          ) : (

            <>

              <div className="w-full h-[320px] sm:h-[400px] min-w-0 min-h-0 relative">
  <ResponsiveContainer
    width="100%"
    height="100%"
    minWidth={0}
    minHeight={0}
  >

                  <BarChart
                    data={cityData.slice(0, 20)}
                    margin={{
                      bottom: 50,
                    }}
                  >

                    <XAxis
                      dataKey="city"
                      angle={-35}
                      textAnchor="end"
                      interval={0}
                      height={80}
                      tick={{
                        fontSize: 11,
                      }}
                    />

                    <YAxis />

                    <Tooltip />

                    <Bar
                      dataKey="count"
                      name="Businesses"
                      fill="#06b6d4"
                      radius={[
                        6,
                        6,
                        0,
                        0,
                      ]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>


              <div className="mt-6">

                <h3 className="font-semibold mb-3">
                  City Details
                </h3>

                <div className="overflow-x-auto">

                  <table className="w-full text-sm">

                    <thead>

                      <tr className="border-b bg-gray-50">

                        <th className="text-left p-3">
                          #
                        </th>

                        <th className="text-left p-3">
                          City
                        </th>

                        <th className="text-right p-3">
                          Businesses
                        </th>

                        <th className="text-right p-3">
                          Share
                        </th>

                      </tr>

                    </thead>

                    <tbody>

              {cityData.map(
  (item, index) => {

    const percentage =
      stats.businesses > 0
        ? (
            (item.count / stats.businesses) *
            100
          ).toFixed(1)
        : "0.0";

    return (
      <tr
        key={item.city}
        className="border-b last:border-0 hover:bg-gray-50"
      >

        <td className="p-3 text-gray-500">
          {index + 1}
        </td>

        <td className="p-3 font-medium">
          {item.city}
        </td>

        <td className="p-3 text-right font-semibold">
          {item.count}
        </td>

        <td className="p-3 text-right text-gray-500">
          {percentage}%
        </td>

      </tr>
    );

  }
)}

                    </tbody>

                  </table>

                </div>

              </div>

            </>

          )}

        </div>

      );

    }


    /* =====================================================
       BUSINESSES
    ===================================================== */

    if (activeSection === "businesses") {

      return (

        <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6">

          <DetailHeader
            icon={<FaStore />}
            title="Business Analytics"
            description="Business status and listing overview"
          />


          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">

            <MiniStat
              title="Total"
              value={stats.businesses}
            />

            <MiniStat
              title="Pending"
              value={stats.pending}
            />

            <MiniStat
              title="Featured"
              value={stats.featured}
            />

            <MiniStat
              title="Active"
              value={
                Math.max(
                  stats.businesses -
                    stats.pending,
                  0
                )
              }
            />

          </div>


          <div className="h-[300px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  outerRadius={100}
                  label
                >

                  {statusData.map(
                    (_, index) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      );

    }


    /* =====================================================
       USERS
    ===================================================== */

    if (activeSection === "users") {

      return (

        <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6">

          <DetailHeader
            icon={<FaUsers />}
            title="User Analytics"
            description="Registered users and role distribution"
          />


          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">

            <MiniStat
              title="Total Users"
              value={stats.users}
            />

            <MiniStat
              title="Admins"
              value={stats.admins}
            />

            <MiniStat
              title="Regular Users"
              value={
                Math.max(
                  stats.users -
                    stats.admins,
                  0
                )
              }
            />

          </div>


          {users.length > 0 && (

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>

                  <tr className="border-b bg-gray-50">

                    <th className="text-left p-3">
                      Name
                    </th>

                    <th className="text-left p-3">
                      Email
                    </th>

                    <th className="text-left p-3">
                      Role
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {users.slice(0, 50).map(
                    (user) => (

                      <tr
                        key={user._id}
                        className="border-b last:border-0"
                      >

                        <td className="p-3 font-medium">
                          {user.name ||
                            "—"}
                        </td>

                        <td className="p-3 text-gray-500">
                          {user.email ||
                            "—"}
                        </td>

                        <td className="p-3">

                          <span className="
                            px-2
                            py-1
                            rounded-full
                            bg-gray-100
                            text-xs
                            capitalize
                          ">
                            {user.role ||
                              "user"}
                          </span>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      );

    }


    /* =====================================================
       PENDING
    ===================================================== */

    if (activeSection === "pending") {

      const pendingBusinesses =
        businesses.filter(
          (b) =>
            b.status === "pending"
        );

      return (

        <BusinessList
          title="Pending Businesses"
          description="Businesses waiting for approval"
          businesses={
            pendingBusinesses
          }
          icon={<FaClock />}
        />

      );

    }


    /* =====================================================
       FEATURED
    ===================================================== */

    if (activeSection === "featured") {

      return (

        <BusinessList
          title="Featured Businesses"
          description="Businesses currently marked as featured"
          businesses={
            featuredBusinesses
          }
          icon={<FaStar />}
        />

      );

    }


    /* =====================================================
   ADS
===================================================== */

if (activeSection === "ads") {

  const totalAds = Number(stats.ads?.total || 0);
  const activeAds = Number(stats.ads?.active || 0);
  const expiredAds = Number(stats.ads?.expired || 0);
  const clicks = Number(stats.ads?.clicks || 0);

  const activeRate =
    totalAds > 0
      ? Math.min(100, (activeAds / totalAds) * 100)
      : 0;

  return (

    <div className="
      bg-white
      rounded-2xl
      shadow-sm
      border
      p-4
      sm:p-6
    ">

      <DetailHeader
        icon={<FaBullhorn />}
        title="Banner Ads Analytics"
        description="Monitor banner advertisements and their performance"
      />


      {/* =================================================
          ADS STATS
      ================================================= */}

      <div className="
        grid
        grid-cols-2
        sm:grid-cols-4
        gap-3
        sm:gap-4
      ">

        <MiniStat
          title="Total Banners"
          value={totalAds}
        />

        <MiniStat
          title="Active Banners"
          value={activeAds}
        />

        <MiniStat
          title="Inactive / Expired"
          value={expiredAds}
        />

        <MiniStat
          title="Ad Clicks"
          value={clicks}
        />

      </div>


      {/* =================================================
          ACTIVE BANNER RATE
      ================================================= */}

      <div className="mt-6">

        <div className="
          flex
          items-center
          justify-between
          mb-2
        ">

          <p className="text-sm font-medium text-gray-700">
            Active Banner Rate
          </p>

          <span className="text-sm font-semibold text-gray-900">
            {activeRate.toFixed(1)}%
          </span>

        </div>


        <div className="
          h-3
          bg-gray-100
          rounded-full
          overflow-hidden
        ">

          <div
            className="
              h-full
              bg-gradient-to-r
              from-pink-500
              to-rose-500
              rounded-full
              transition-all
              duration-500
            "
            style={{
              width: `${activeRate}%`,
            }}
          />

        </div>

      </div>


      {/* =================================================
          ADS PERFORMANCE
      ================================================= */}

      <div className="
        mt-6
        grid
        grid-cols-1
        sm:grid-cols-2
        gap-4
      ">

        {/* Active vs Inactive */}

        <div className="
          border
          rounded-xl
          p-4
          bg-gray-50
        ">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs text-gray-500">
                Banner Status
              </p>

              <p className="text-lg font-bold text-gray-900 mt-1">
                {activeAds} Active
              </p>

            </div>

            <div className="
              w-10
              h-10
              rounded-xl
              bg-green-100
              text-green-600
              flex
              items-center
              justify-center
            ">
              <FaBullhorn />
            </div>

          </div>

          <p className="text-xs text-gray-500 mt-2">
            {expiredAds} inactive / expired
          </p>

        </div>


        {/* Click Performance */}

        <div className="
          border
          rounded-xl
          p-4
          bg-gray-50
        ">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-xs text-gray-500">
                Total Ad Clicks
              </p>

              <p className="text-lg font-bold text-gray-900 mt-1">
                {clicks}
              </p>

            </div>

            <div className="
              w-10
              h-10
              rounded-xl
              bg-violet-100
              text-violet-600
              flex
              items-center
              justify-center
            ">
              <FaChartBar />
            </div>

          </div>

          <p className="text-xs text-gray-500 mt-2">
            Total recorded banner interactions
          </p>

        </div>

      </div>

    </div>

  );

}

    return null;

  };


  /* =========================================================
     PAGE
  ========================================================= */

  return (

    <div className="space-y-6 pb-10">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <div>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">

            <FaChartBar className="text-indigo-600" />

            Analytics Dashboard

          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Monitor your ServDial platform data and performance.
          </p>

        </div>

        <button
          onClick={fetchAnalytics}
          className="
            w-full
            sm:w-auto
            px-4
            py-2.5
            rounded-xl
            bg-gray-900
            text-white
            text-sm
            font-medium
            hover:bg-gray-800
            transition
          "
        >
          Refresh Data
        </button>

      </div>


      {/* =====================================================
          CLICKABLE TOP STATS
      ===================================================== */}

      <div className="
        grid
        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-5
        gap-3
        sm:gap-4
      ">

        <StatCard
          title="Businesses"
          value={stats.businesses}
          icon={<FaStore />}
          color="from-green-500 to-emerald-600"
          section="businesses"
        />

        <StatCard
          title="Users"
          value={stats.users}
          icon={<FaUsers />}
          color="from-blue-500 to-indigo-600"
          section="users"
        />

        <StatCard
          title="Cities"
          value={stats.cities}
          icon={<FaCity />}
          color="from-cyan-500 to-blue-500"
          section="cities"
        />

        <StatCard
          title="Categories"
          value={stats.categories}
          icon={<FaLayerGroup />}
          color="from-yellow-400 to-orange-500"
          section="categories"
        />

        <StatCard 
  title="City + Category" 
  value={cityCategoryData.length} 
  icon={<FaFilter />} 
  color="from-indigo-500 to-purple-600" 
  section="cityCategories" 
/>

        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<FaClock />}
          color="from-red-500 to-rose-600"
          section="pending"
        />

        <StatCard
          title="Featured"
          value={stats.featured}
          icon={<FaStar />}
          color="from-orange-500 to-amber-500"
          section="featured"
        />

        <StatCard
          title="Admins"
          value={stats.admins}
          icon={<FaUserShield />}
          color="from-purple-500 to-pink-600"
          section="users"
        />

        <StatCard
          title="Banner Ads"
          value={stats.ads.total}
          icon={<FaBullhorn />}
          color="from-pink-500 to-rose-600"
          section="ads"
        />

        <StatCard
          title="Active Ads"
          value={stats.ads.active}
          icon={<FaBullhorn />}
          color="from-teal-500 to-emerald-600"
          section="ads"
        />

        <StatCard
          title="Ad Clicks"
          value={stats.ads.clicks}
          icon={<FaChartBar />}
          color="from-violet-500 to-purple-600"
          section="ads"
        />

      </div>


      {/* =====================================================
          CURRENT SELECTION
      ===================================================== */}

      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">

        <FaList />

        Showing:

        <span className="font-semibold text-gray-900 capitalize">
          {activeSection}
        </span>

      </div>


      {/* =====================================================
          DETAILS
      ===================================================== */}

      {renderDetails()}

    </div>

  );

}


/* =========================================================
   MINI STAT
========================================================= */

const MiniStat = ({
  title,
  value,
}) => (

  <div className="
    bg-gray-50
    border
    rounded-xl
    p-4
  ">

    <p className="text-xs text-gray-500">
      {title}
    </p>

    <p className="text-xl font-bold text-gray-900 mt-1">
      {value}
    </p>

  </div>

);


/* =========================================================
   EMPTY
========================================================= */

const EmptyState = ({
  text,
}) => (

  <div className="
    py-16
    text-center
    text-gray-500
  ">

    <FaList className="
      mx-auto
      text-3xl
      text-gray-300
      mb-3
    " />

    <p>{text}</p>

  </div>

);


/* =========================================================
   BUSINESS LIST
========================================================= */

const BusinessList = ({
  title,
  description,
  businesses,
  icon,
}) => (

  <div className="
    bg-white
    rounded-2xl
    shadow-sm
    border
    p-4
    sm:p-6
  ">

    <div className="
      flex
      items-center
      gap-3
      mb-5
    ">

      <div className="
        w-11
        h-11
        rounded-xl
        bg-indigo-100
        text-indigo-600
        flex
        items-center
        justify-center
      ">
        {icon}
      </div>

      <div>

        <h2 className="text-lg sm:text-xl font-bold">
          {title}
        </h2>

        <p className="text-xs sm:text-sm text-gray-500">
          {description}
        </p>

      </div>

    </div>


    {businesses.length === 0 ? (

      <EmptyState text="No businesses found." />

    ) : (

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-4
      ">

        {businesses.map(
          (business) => (

            <div
              key={business._id}
              className="
                border
                rounded-xl
                p-4
                hover:shadow-md
                transition
              "
            >

              <h3 className="font-semibold text-gray-900 line-clamp-1">
                {business.name ||
                  "Business"}
              </h3>

              <p className="text-xs text-blue-600 mt-1">
                {
                  business.categoryId?.name ||
                  business.categoryName ||
                  "Category"
                }
              </p>

              <p className="
                text-xs
                text-gray-500
                mt-2
                flex
                items-center
                gap-1
              ">

                <FaMapMarkerAlt />

                {
                  business.cityId?.name ||
                  business.cityName ||
                  "City"
                }

              </p>

              <div className="mt-3">

                <span className="
                  text-[11px]
                  px-2
                  py-1
                  rounded-full
                  bg-gray-100
                  capitalize
                ">
                  {business.status ||
                    "unknown"}
                </span>

              </div>

            </div>

          )
        )}

      </div>

    )}

  </div>

);


export default Analytics;