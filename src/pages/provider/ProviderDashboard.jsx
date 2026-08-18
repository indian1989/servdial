import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  RefreshCw,
  Building2,
  CheckCircle2,
  Clock3,
  XCircle,
  Users,
  Star,
  Trash2,
  Pencil,
} from "lucide-react";

import API from "../../api/axios";
import BusinessCard from "../../components/business/BusinessCard";

const ProviderDashboard = () => {
  const [businesses, setBusinesses] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    leads: 0,
    reviews: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("servdial_user") || "null"
  );

  // =========================================================
  // FETCH DASHBOARD DATA
  // =========================================================

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [bizRes, leadsRes, reviewsRes] =
        await Promise.all([
          API.get("/provider/businesses"),
          API.get("/provider/leads"),
          API.get("/provider/reviews"),
        ]);

      const bizList = Array.isArray(
        bizRes.data?.businesses
      )
        ? bizRes.data.businesses
        : [];

      const leads = Array.isArray(
        leadsRes.data?.leads
      )
        ? leadsRes.data.leads
        : [];

      const reviews = Array.isArray(
        reviewsRes.data?.reviews
      )
        ? reviewsRes.data.reviews
        : [];

      setBusinesses(bizList);

      setStats({
        total: bizList.length,

        approved: bizList.filter(
          (b) => b.status === "approved"
        ).length,

        pending: bizList.filter(
          (b) => b.status === "pending"
        ).length,

        rejected: bizList.filter(
          (b) => b.status === "rejected"
        ).length,

        leads: leads.length,
        reviews: reviews.length,
      });
    } catch (err) {
      console.error(
        "Provider dashboard fetch error:",
        err
      );

      setBusinesses([]);

      setStats({
        total: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        leads: 0,
        reviews: 0,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =========================================================
  // DELETE BUSINESS
  // =========================================================

  const deleteBusiness = async (id) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this business?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/business/${id}`);

      await fetchDashboardData(true);
    } catch (err) {
      console.error(
        "Delete business error:",
        err
      );

      alert(
        err?.response?.data?.message ||
          "Unable to delete business."
      );
    }
  };

  // =========================================================
  // AUTH
  // =========================================================

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center max-w-md w-full shadow-sm">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Building2 size={25} />
          </div>

          <h2 className="text-xl font-bold text-gray-900">
            Login Required
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Please login to access your provider dashboard.
          </p>

          <Link
            to="/login"
            className="
              inline-flex
              items-center
              justify-center
              mt-5
              px-5
              py-2.5
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              text-sm
              font-semibold
              transition
            "
          >
            Login
          </Link>

        </div>
      </div>
    );
  }

  // =========================================================
  // STAT CARD
  // =========================================================

  const StatCard = ({
    label,
    value,
    icon: Icon,
    iconBg,
    iconColor,
    valueColor = "text-gray-900",
  }) => (
    <div
      className="
        bg-white
        border
        border-gray-200
        rounded-2xl
        p-4
        sm:p-5
        shadow-sm
        hover:shadow-md
        transition
      "
    >
      <div className="flex items-center justify-between gap-3">

        <div className="min-w-0">

          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {label}
          </p>

          <p
            className={`
              text-2xl
              sm:text-3xl
              font-bold
              mt-1
              ${valueColor}
            `}
          >
            {value}
          </p>

        </div>

        <div
          className={`
            w-10
            h-10
            sm:w-11
            sm:h-11
            rounded-xl
            flex
            items-center
            justify-center
            shrink-0
            ${iconBg}
            ${iconColor}
          `}
        >
          <Icon size={20} />
        </div>

      </div>
    </div>
  );

  // =========================================================
  // LOADING SKELETON
  // =========================================================

  const BusinessSkeleton = () => (
    <div
      className="
        bg-white
        border
        border-gray-200
        rounded-3xl
        overflow-hidden
        animate-pulse
      "
    >
      <div className="h-48 bg-gray-200" />

      <div className="p-5 space-y-3">

        <div className="h-5 bg-gray-200 rounded w-3/4" />

        <div className="h-4 bg-gray-200 rounded w-1/2" />

        <div className="h-4 bg-gray-200 rounded w-2/3" />

        <div className="h-8 bg-gray-200 rounded mt-5" />

      </div>
    </div>
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-6 sm:mb-8">

          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div className="min-w-0">

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-11
                    h-11
                    sm:w-12
                    sm:h-12
                    rounded-2xl
                    bg-blue-600
                    text-white
                    flex
                    items-center
                    justify-center
                    shrink-0
                    shadow-sm
                  "
                >
                  <Building2 size={22} />
                </div>

                <div className="min-w-0">

                  <h1
                    className="
                      text-xl
                      sm:text-2xl
                      lg:text-3xl
                      font-bold
                      text-gray-900
                      truncate
                    "
                  >
                    Provider Dashboard
                  </h1>

                  <p className="text-sm text-gray-500 mt-0.5">
                    Manage your businesses and track your performance
                  </p>

                </div>

              </div>

            </div>


            {/* HEADER ACTIONS */}

            <div
              className="
                flex
                items-center
                gap-2
                w-full
                sm:w-auto
              "
            >

              <button
                type="button"
                onClick={() => fetchDashboardData(true)}
                disabled={refreshing}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  h-11
                  px-3
                  sm:px-4
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  hover:bg-gray-50
                  text-gray-700
                  text-sm
                  font-semibold
                  transition
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                "
              >

                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                <span className="hidden sm:inline">
                  Refresh
                </span>

              </button>


              <Link
                to="/provider/add-business"
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  h-11
                  px-4
                  sm:px-5
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  text-sm
                  font-semibold
                  transition
                  shadow-sm
                  flex-1
                  sm:flex-none
                "
              >

                <Plus size={17} />

                Add Business

              </Link>

            </div>

          </div>

        </div>


        {/* =====================================================
            STATS
        ===================================================== */}

        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-6
            gap-3
            sm:gap-4
            mb-7
          "
        >

          <StatCard
            label="Total"
            value={stats.total}
            icon={Building2}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />

          <StatCard
            label="Approved"
            value={stats.approved}
            icon={CheckCircle2}
            iconBg="bg-green-50"
            iconColor="text-green-600"
            valueColor="text-green-600"
          />

          <StatCard
            label="Pending"
            value={stats.pending}
            icon={Clock3}
            iconBg="bg-yellow-50"
            iconColor="text-yellow-600"
            valueColor="text-yellow-600"
          />

          <StatCard
            label="Rejected"
            value={stats.rejected}
            icon={XCircle}
            iconBg="bg-red-50"
            iconColor="text-red-600"
            valueColor="text-red-600"
          />

          <StatCard
            label="Leads"
            value={stats.leads}
            icon={Users}
            iconBg="bg-indigo-50"
            iconColor="text-indigo-600"
            valueColor="text-indigo-600"
          />

          <StatCard
            label="Reviews"
            value={stats.reviews}
            icon={Star}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
            valueColor="text-purple-600"
          />

        </div>


        {/* =====================================================
            BUSINESS SECTION HEADER
        ===================================================== */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-3
            mb-4
          "
        >

          <div>

            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              My Businesses
            </h2>

            <p className="text-sm text-gray-500 mt-0.5">
              Manage and monitor your business listings
            </p>

          </div>


          {!loading && businesses.length > 0 && (
            <div
              className="
                inline-flex
                items-center
                gap-2
                self-start
                sm:self-auto
                px-3
                py-1.5
                rounded-lg
                bg-white
                border
                border-gray-200
                text-xs
                sm:text-sm
                text-gray-600
              "
            >

              <span className="font-bold text-gray-900">
                {businesses.length}
              </span>

              <span>
                {businesses.length === 1
                  ? "Business"
                  : "Businesses"}
              </span>

            </div>
          )}

        </div>


        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-5
            "
          >
            <BusinessSkeleton />
            <BusinessSkeleton />
            <BusinessSkeleton />
          </div>
        )}


        {/* =====================================================
            EMPTY
        ===================================================== */}

        {!loading && businesses.length === 0 && (

          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-3xl
              p-7
              sm:p-12
              text-center
              shadow-sm
            "
          >

            <div
              className="
                w-16
                h-16
                mx-auto
                rounded-2xl
                bg-blue-50
                text-blue-600
                flex
                items-center
                justify-center
                mb-5
              "
            >
              <Building2 size={28} />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              No businesses yet
            </h3>

            <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
              Add your business to start receiving customers,
              calls, WhatsApp enquiries and reviews.
            </p>

            <Link
              to="/provider/add-business"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                mt-6
                px-5
                py-3
                rounded-xl
                bg-blue-600
                hover:bg-blue-700
                text-white
                text-sm
                font-semibold
                transition
              "
            >
              <Plus size={17} />
              Add Your First Business
            </Link>

          </div>

        )}


        {/* =====================================================
            BUSINESS GRID
        ===================================================== */}

        {!loading && businesses.length > 0 && (

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-5
              sm:gap-6
            "
          >

            {businesses.map((biz) => (

              <div
                key={biz._id}
                className="relative group"
              >

                {/* BUSINESS CARD */}

                <BusinessCard
                  business={biz}
                />


                {/* PROVIDER CONTROLS */}

                <div
                  className="
                    absolute
                    top-3
                    right-3
                    z-30
                    flex
                    items-center
                    gap-1.5
                    opacity-100
                    sm:opacity-0
                    sm:group-hover:opacity-100
                    transition-opacity
                  "
                >

                  <Link
                    to={`/provider/edit-business/${biz._id}`}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                    className="
                      w-9
                      h-9
                      rounded-xl
                      bg-white
                      border
                      border-gray-200
                      shadow-md
                      flex
                      items-center
                      justify-center
                      text-gray-700
                      hover:text-blue-600
                      hover:bg-blue-50
                      transition
                    "
                    title="Edit Business"
                  >
                    <Pencil size={15} />
                  </Link>


                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteBusiness(biz._id);
                    }}
                    className="
                      w-9
                      h-9
                      rounded-xl
                      bg-white
                      border
                      border-gray-200
                      shadow-md
                      flex
                      items-center
                      justify-center
                      text-gray-700
                      hover:text-red-600
                      hover:bg-red-50
                      transition
                    "
                    title="Delete Business"
                  >
                    <Trash2 size={15} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}


        {/* =====================================================
            FOOTER HINT
        ===================================================== */}

        {!loading && businesses.length > 0 && (
          <div
            className="
              mt-7
              text-center
              text-xs
              sm:text-sm
              text-gray-400
            "
          >
            Keep your business information, services,
            pricing and contact details updated.
          </div>
        )}

      </main>
    </div>
  );
};

export default ProviderDashboard;