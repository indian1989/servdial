import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";

import {
  FaUsers,
  FaUserShield,
  FaCity,
  FaLayerGroup,
  FaStore,
  FaClock,
  FaStar,
  FaBullhorn,
  FaChartLine,
  FaSyncAlt,
  FaArrowUp,
  FaMousePointer,
} from "react-icons/fa";

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


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function AdminDashboard() {

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

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");


  /* =========================================================
     FETCH DASHBOARD DATA
  ========================================================= */

  const fetchStats = async (manual = false) => {

    try {

      if (manual) {
        setRefreshing(true);
      }

      setError("");

      const [
        adminRes,
        businessRes,
        usersRes,
        adsRes,
        citiesRes,
      ] = await Promise.all([

        API.get("/admin/dashboard"),

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
         ADMIN
      ===================================================== */

      const adminResponse =
        adminRes?.data || {};

      const adminData =
        adminResponse?.stats ||
        adminResponse?.data ||
        adminResponse ||
        {};


      /* =====================================================
         USERS
      ===================================================== */

      const usersResponse =
        usersRes?.data || {};

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
         BANNERS
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
         BANNER STATS
      ===================================================== */

      const bannerStats =
        adsResponse?.stats ||
        {};


      const totalAds =
        typeof bannerStats.total === "number"
          ? bannerStats.total
          : safeBanners.length;


      const activeAds =
        typeof bannerStats.active === "number"
          ? bannerStats.active
          : safeBanners.filter(
              (banner) =>
                banner.isActive === true &&
                banner.status === "approved"
            ).length;


      const expiredAds =
        typeof bannerStats.expired === "number"
          ? bannerStats.expired
          : safeBanners.filter(
              (banner) =>
                banner.isActive !== true ||
                banner.status !== "approved"
            ).length;


      /*
       * IMPORTANT:
       * Banner model ka actual field = clicks
       */

      const totalClicks =
        typeof bannerStats.clicks === "number"
          ? bannerStats.clicks
          : safeBanners.reduce(
              (total, banner) =>
                total +
                Number(
                  banner?.clicks ??
                  banner?.totalClicks ??
                  banner?.clickCount ??
                  0
                ),
              0
            );


      /* =====================================================
         USER / ADMIN COUNTS
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


      const totalCities =
        typeof adminData.cities === "number"
          ? adminData.cities
          : safeCities.length;


      const totalCategories =
        typeof adminData.categories === "number"
          ? adminData.categories
          : 0;


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
         SAVE
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

          total: totalAds,

          active: activeAds,

          expired: expiredAds,

          clicks: totalClicks,

        },

      });

    } catch (err) {

      console.error(
        "Dashboard error:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Failed to load dashboard data."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };


  /* =========================================================
     INITIAL + AUTO REFRESH
  ========================================================= */

  useEffect(() => {

    fetchStats();

    const interval =
      setInterval(() => {
        fetchStats();
      }, 30000);

    return () =>
      clearInterval(interval);

  }, []);


  /* =========================================================
     DERIVED DATA
  ========================================================= */

  const activeBusinesses =
    Math.max(
      stats.businesses -
      stats.pending,
      0
    );


  const approvalRate =
    stats.businesses > 0
      ? Math.round(
          (activeBusinesses /
            stats.businesses) *
            100
        )
      : 0;


  const featuredRatio =
    stats.businesses > 0
      ? Math.round(
          (stats.featured /
            stats.businesses) *
            100
        )
      : 0;


  const activeAdRate =
    stats.ads.total > 0
      ? Math.round(
          (stats.ads.active /
            stats.ads.total) *
            100
        )
      : 0;


  const userAdminRatio =
    stats.admins > 0
      ? Math.round(
          stats.users /
          stats.admins
        )
      : stats.users;


  const totalEntities =
    stats.users +
    stats.admins +
    stats.cities +
    stats.categories +
    stats.businesses;


  /* =========================================================
     BAR DATA
  ========================================================= */

  const barData = useMemo(
    () => [

      {
        name: "Users",
        value: stats.users,
      },

      {
        name: "Admins",
        value: stats.admins,
      },

      {
        name: "Cities",
        value: stats.cities,
      },

      {
        name: "Categories",
        value: stats.categories,
      },

      {
        name: "Businesses",
        value: stats.businesses,
      },

    ],
    [stats]
  );


  /* =========================================================
     PIE DATA
  ========================================================= */

  const pieData = useMemo(
    () => [

      {
        name: "Pending",
        value: stats.pending,
      },

      {
        name: "Featured",
        value: stats.featured,
      },

      {
        name: "Others",
        value: Math.max(
          stats.businesses -
          stats.pending -
          stats.featured,
          0
        ),
      },

    ],
    [stats]
  );


  const COLORS = [
    "#ef4444",
    "#22c55e",
    "#6366f1",
  ];


  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return <DashboardSkeleton />;
  }


  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {

    return (

      <div className="
        min-h-[300px]
        flex
        items-center
        justify-center
        p-4
      ">

        <div className="
          w-full
          max-w-md
          bg-red-50
          border
          border-red-200
          rounded-2xl
          p-6
          text-center
        ">

          <p className="
            text-red-600
            font-medium
          ">
            {error}
          </p>

          <button
            onClick={() =>
              fetchStats(true)
            }
            className="
              mt-4
              px-5
              py-2.5
              rounded-xl
              bg-red-600
              text-white
              text-sm
              font-medium
              hover:bg-red-700
            "
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }


  /* =========================================================
     PAGE
  ========================================================= */

  return (

    <div className="
      w-full
      max-w-[1600px]
      mx-auto
      space-y-5
      sm:space-y-6
      pb-8
    ">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-4
      ">

        <div>

          <div className="
            flex
            items-center
            gap-2
          ">

            <div className="
              w-9
              h-9
              rounded-xl
              bg-indigo-100
              text-indigo-600
              flex
              items-center
              justify-center
            ">

              <FaChartLine />

            </div>

            <h1 className="
              text-xl
              sm:text-2xl
              font-bold
              text-gray-900
            ">
              Admin Dashboard
            </h1>

          </div>

          <p className="
            text-xs
            sm:text-sm
            text-gray-500
            mt-1
          ">
            Monitor your ServDial platform at a glance.
          </p>

        </div>


        <button
          onClick={() =>
            fetchStats(true)
          }
          disabled={refreshing}
          className="
            w-full
            sm:w-auto
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-xl
            bg-gray-900
            text-white
            text-sm
            font-medium
            hover:bg-gray-800
            disabled:opacity-60
            transition
          "
        >

          <FaSyncAlt
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh Data"}

        </button>

      </div>


      {/* =====================================================
          WELCOME BANNER
      ===================================================== */}

      <div className="
        relative
        overflow-hidden
        rounded-2xl
        bg-gradient-to-r
        from-indigo-600
        via-indigo-600
        to-purple-600
        text-white
        shadow-lg
      ">

        <div className="
          relative
          z-10
          p-5
          sm:p-6
          lg:p-7
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-5
        ">

          <div>

            <p className="
              text-xs
              sm:text-sm
              text-white/70
              mb-1
            ">
              ServDial Admin
            </p>

            <h2 className="
              text-xl
              sm:text-2xl
              font-bold
            ">
              Welcome back, Admin 👋
            </h2>

            <p className="
              text-xs
              sm:text-sm
              text-white/75
              mt-1
            ">
              Here's what's happening across your platform.
            </p>

          </div>


          <div className="
            bg-white/10
            border
            border-white/10
            backdrop-blur-sm
            rounded-2xl
            px-5
            py-3
            sm:min-w-[150px]
          ">

            <p className="
              text-[11px]
              sm:text-xs
              text-white/60
            ">
              Total Entities
            </p>

            <p className="
              text-2xl
              sm:text-3xl
              font-bold
              mt-0.5
            ">
              {totalEntities.toLocaleString()}
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          MAIN STAT CARDS
      ===================================================== */}

      <div className="
        grid
        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        gap-3
        sm:gap-4
      ">

        <Card
          title="Users"
          value={stats.users}
          icon={<FaUsers />}
          color="from-blue-500 to-indigo-600"
        />

        <Card
          title="Admins"
          value={stats.admins}
          icon={<FaUserShield />}
          color="from-purple-500 to-pink-600"
        />

        <Card
          title="Cities"
          value={stats.cities}
          icon={<FaCity />}
          color="from-cyan-500 to-blue-500"
        />

        <Card
          title="Categories"
          value={stats.categories}
          icon={<FaLayerGroup />}
          color="from-yellow-400 to-orange-500"
        />

        <Card
          title="Businesses"
          value={stats.businesses}
          icon={<FaStore />}
          color="from-green-500 to-emerald-600"
        />

        <Card
          title="Pending"
          value={stats.pending}
          icon={<FaClock />}
          color="from-red-500 to-rose-600"
        />

        <Card
          title="Featured"
          value={stats.featured}
          icon={<FaStar />}
          color="from-orange-500 to-amber-500"
        />

        <Card
          title="Banner Ads"
          value={stats.ads.total}
          icon={<FaBullhorn />}
          color="from-pink-500 to-rose-600"
        />

        <Card
          title="Active Ads"
          value={stats.ads.active}
          icon={<FaBullhorn />}
          color="from-teal-500 to-emerald-600"
        />

        <Card
          title="Ad Clicks"
          value={stats.ads.clicks}
          icon={<FaMousePointer />}
          color="from-violet-500 to-purple-600"
        />

      </div>


      {/* =====================================================
          KPI SECTION
      ===================================================== */}

      <div>

        <SectionTitle
          title="Performance Overview"
          icon={<FaChartLine />}
        />

        <div className="
          grid
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-5
          gap-3
          sm:gap-4
        ">

          <KPI
            title="Active Businesses"
            value={activeBusinesses}
            icon={<FaStore />}
          />

          <KPI
            title="Approval Rate"
            value={`${approvalRate}%`}
            icon={<FaArrowUp />}
          />

          <KPI
            title="Featured Ratio"
            value={`${featuredRatio}%`}
            icon={<FaStar />}
          />

          <KPI
            title="Ad Clicks"
            value={stats.ads.clicks}
            icon={<FaMousePointer />}
          />

          <KPI
            title="User / Admin"
            value={`${userAdminRatio}:1`}
            icon={<FaUsers />}
          />

        </div>

      </div>


      {/* =====================================================
          ADS PERFORMANCE
      ===================================================== */}

      <div className="
        bg-white
        border
        border-gray-100
        rounded-2xl
        shadow-sm
        p-4
        sm:p-5
      ">

        <div className="
          flex
          items-center
          justify-between
          gap-3
          mb-5
        ">

          <div className="
            flex
            items-center
            gap-3
          ">

            <div className="
              w-10
              h-10
              rounded-xl
              bg-pink-100
              text-pink-600
              flex
              items-center
              justify-center
            ">

              <FaBullhorn />

            </div>

            <div>

              <h3 className="
                font-semibold
                text-gray-900
              ">
                Ads Performance
              </h3>

              <p className="
                text-xs
                text-gray-500
              ">
                Banner advertising overview
              </p>

            </div>

          </div>

          <span className="
            text-xs
            font-semibold
            px-2.5
            py-1
            rounded-full
            bg-green-50
            text-green-600
          ">
            {activeAdRate}% Active
          </span>

        </div>


        <div className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-3
        ">

          <AdMetric
            label="Total"
            value={stats.ads.total}
          />

          <AdMetric
            label="Active"
            value={stats.ads.active}
          />

          <AdMetric
            label="Inactive"
            value={stats.ads.expired}
          />

          <AdMetric
            label="Clicks"
            value={stats.ads.clicks}
          />

        </div>


        <div className="mt-5">

          <div className="
            flex
            justify-between
            text-xs
            mb-2
          ">

            <span className="text-gray-500">
              Active banner rate
            </span>

            <span className="
              font-semibold
              text-gray-900
            ">
              {activeAdRate}%
            </span>

          </div>

          <div className="
            h-2.5
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
                width: `${activeAdRate}%`,
              }}
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          CHARTS
      ===================================================== */}

      <div>

        <SectionTitle
          title="Analytics"
          icon={<FaChartLine />}
        />


        <div className="
  grid
  grid-cols-1
  xl:grid-cols-2
  gap-4
  sm:gap-6
  min-w-0
">


          {/* SYSTEM OVERVIEW */}

          <ChartCard
            title="System Overview"
            description="Platform entity distribution"
          >

            <div className="
  h-[320px]
  sm:h-[400px]
  w-full
  min-w-0
">

              <ResponsiveContainer
    width="100%"
    height="100%"
    minWidth={1}
    minHeight={300}
  >

                <BarChart
                  data={barData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 5,
                  }}
                >

                  <XAxis
                    dataKey="name"
                    tick={{
                      fontSize: 11,
                    }}
                    interval={0}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 11,
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill: "#f3f4f6",
                    }}
                  />

                  <Bar
                    dataKey="value"
                    name="Count"
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

          </ChartCard>


          {/* BUSINESS DISTRIBUTION */}

          <ChartCard
            title="Business Distribution"
            description="Current business listing status"
          >

            <div className="
  h-[320px]
  sm:h-[400px]
  w-full
  min-w-0
">

              <ResponsiveContainer
    width="100%"
    height="100%"
    minWidth={1}
    minHeight={300}
  >

                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius="68%"
                    innerRadius="38%"
                    paddingAngle={3}
                  >

                    {pieData.map(
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

                  <Legend
                    verticalAlign="bottom"
                    height={30}
                  />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </ChartCard>

        </div>

      </div>


      {/* =====================================================
          QUICK SUMMARY
      ===================================================== */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-3
        gap-3
      ">

        <SummaryCard
          title="Businesses"
          value={stats.businesses}
          subtitle={`${activeBusinesses} active`}
          icon={<FaStore />}
        />

        <SummaryCard
          title="Pending Approval"
          value={stats.pending}
          subtitle="Needs admin attention"
          icon={<FaClock />}
        />

        <SummaryCard
          title="Banner Clicks"
          value={stats.ads.clicks}
          subtitle="Recorded interactions"
          icon={<FaMousePointer />}
        />

      </div>

    </div>

  );

}


/* =========================================================
   STAT CARD
========================================================= */

const Card = ({
  title,
  value,
  icon,
  color,
}) => (

  <div className={`
    bg-gradient-to-r
    ${color}
    text-white
    rounded-2xl
    shadow-sm
    p-4
    sm:p-5
    min-h-[105px]
    flex
    items-center
    justify-between
    gap-3
    overflow-hidden
  `}>

    <div className="min-w-0">

      <p className="
        text-[11px]
        sm:text-xs
        font-medium
        text-white/75
        truncate
      ">
        {title}
      </p>

      <h2 className="
        text-xl
        sm:text-2xl
        lg:text-3xl
        font-bold
        mt-1
      ">
        {Number(value || 0).toLocaleString()}
      </h2>

    </div>

    <div className="
      shrink-0
      text-xl
      sm:text-2xl
      opacity-80
    ">
      {icon}
    </div>

  </div>

);


/* =========================================================
   KPI
========================================================= */

const KPI = ({
  title,
  value,
  icon,
}) => (

  <div className="
    bg-white
    border
    border-gray-100
    rounded-2xl
    shadow-sm
    p-4
    sm:p-5
  ">

    <div className="
      flex
      items-center
      justify-between
      gap-2
    ">

      <p className="
        text-[11px]
        sm:text-xs
        text-gray-500
      ">
        {title}
      </p>

      <span className="
        text-gray-300
        text-sm
      ">
        {icon}
      </span>

    </div>

    <p className="
      text-xl
      sm:text-2xl
      font-bold
      text-gray-900
      mt-1
    ">
      {value}
    </p>

  </div>

);


/* =========================================================
   AD METRIC
========================================================= */

const AdMetric = ({
  label,
  value,
}) => (

  <div className="
    bg-gray-50
    border
    border-gray-100
    rounded-xl
    p-3
    sm:p-4
  ">

    <p className="
      text-[11px]
      text-gray-500
    ">
      {label}
    </p>

    <p className="
      text-lg
      sm:text-xl
      font-bold
      text-gray-900
      mt-1
    ">
      {Number(value || 0).toLocaleString()}
    </p>

  </div>

);


/* =========================================================
   CHART CARD
========================================================= */

const ChartCard = ({
  title,
  description,
  children,
}) => (

  <div className="
  bg-white
  border
  border-gray-100
  rounded-2xl
  shadow-sm
  p-4
  sm:p-5
  min-w-0
">

    <div className="mb-2">

      <h3 className="
        font-semibold
        text-gray-900
      ">
        {title}
      </h3>

      {description && (

        <p className="
          text-xs
          text-gray-500
          mt-0.5
        ">
          {description}
        </p>

      )}

    </div>

    {children}

  </div>

);


/* =========================================================
   SECTION TITLE
========================================================= */

const SectionTitle = ({
  title,
  icon,
}) => (

  <div className="
    flex
    items-center
    gap-2
    mb-3
  ">

    <span className="
      text-indigo-600
    ">
      {icon}
    </span>

    <h2 className="
      text-base
      sm:text-lg
      font-semibold
      text-gray-900
    ">
      {title}
    </h2>

  </div>

);


/* =========================================================
   SUMMARY CARD
========================================================= */

const SummaryCard = ({
  title,
  value,
  subtitle,
  icon,
}) => (

  <div className="
    bg-white
    border
    border-gray-100
    rounded-2xl
    shadow-sm
    p-4
    sm:p-5
    flex
    items-center
    justify-between
    gap-3
  ">

    <div>

      <p className="
        text-xs
        text-gray-500
      ">
        {title}
      </p>

      <p className="
        text-xl
        font-bold
        text-gray-900
        mt-1
      ">
        {Number(value || 0).toLocaleString()}
      </p>

      <p className="
        text-[11px]
        text-gray-400
        mt-1
      ">
        {subtitle}
      </p>

    </div>

    <div className="
      w-10
      h-10
      rounded-xl
      bg-indigo-50
      text-indigo-600
      flex
      items-center
      justify-center
      shrink-0
    ">
      {icon}
    </div>

  </div>

);


/* =========================================================
   LOADING SKELETON
========================================================= */

const DashboardSkeleton = () => (

  <div className="
    w-full
    space-y-5
    sm:space-y-6
  ">

    <div className="
      h-10
      w-56
      bg-gray-200
      rounded-lg
      animate-pulse
    " />

    <div className="
      h-32
      bg-gray-200
      rounded-2xl
      animate-pulse
    " />

    <div className="
      grid
      grid-cols-2
      sm:grid-cols-3
      lg:grid-cols-5
      gap-3
    ">

      {Array(10)
        .fill(null)
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

    <div className="
      grid
      grid-cols-2
      sm:grid-cols-3
      lg:grid-cols-5
      gap-3
    ">

      {Array(5)
        .fill(null)
        .map((_, index) => (

          <div
            key={index}
            className="
              h-24
              bg-gray-200
              rounded-2xl
              animate-pulse
            "
          />

        ))}

    </div>

    <div className="
      h-52
      bg-gray-200
      rounded-2xl
      animate-pulse
    " />

  </div>

);


export default AdminDashboard;