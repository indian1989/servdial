import {
  FaTachometerAlt,
  FaPlusCircle,
  FaBuilding,
  FaUsers,
  FaStar,
  FaChartLine,
  FaTags,
  FaEnvelope,
  FaBell,
  FaCreditCard,
  FaUser,
  FaCog,
  FaImage,
  FaImages,
} from "react-icons/fa";

/**
 * ==================================================
 * 🧭 PROVIDER ROUTES (SSOT)
 * ==================================================
 * UI navigation registry only
 * No business logic
 * No permissions logic
 * No API logic
 * ==================================================
 */

export const providerRoutes = [
  // ================= DASHBOARD =================
  {
    path: "/provider/dashboard",
    key: "dashboard",
    label: "Dashboard",
    element: "ProviderDashboard",
    icon: FaTachometerAlt,
  },

  // ================= BUSINESSES =================
  {
    path: "/provider/businesses",
    key: "businesses",
    label: "My Businesses",
    element: "ProviderBusinesses",
    icon: FaBuilding,
  },

  {
    path: "/provider/add-business",
    key: "add-business",
    label: "Add Business",
    element: "ProviderAddBusiness",
    icon: FaPlusCircle,
  },

  // ================= BANNERS =================
  {
    path: "/provider/add-banner",
    key: "add-banner",
    label: "Add Banner Ad",
    element: "ProviderAddBanner",
    icon: FaImage,
  },

  {
    path: "/provider/manage-banners",
    key: "manage-banners",
    label: "Manage Banner Ads",
    element: "ProviderManageBanners",
    icon: FaImages,
  },

  // ================= LEADS =================
  {
    path: "/provider/leads",
    key: "leads",
    label: "Leads",
    element: "ProviderLeads",
    icon: FaUsers,
  },

  // ================= REVIEWS =================
  {
    path: "/provider/reviews",
    key: "reviews",
    label: "Reviews",
    element: "ProviderReviews",
    icon: FaStar,
  },

  // ================= ANALYTICS =================
  {
    path: "/provider/analytics",
    key: "analytics",
    label: "Analytics",
    element: "ProviderAnalytics",
    icon: FaChartLine,
  },

  // ================= OFFERS =================
  {
    path: "/provider/offers",
    key: "offers",
    label: "Offers / Promotions",
    element: "ProviderOffers",
    icon: FaTags,
  },

  // ================= MESSAGES =================
  {
    path: "/provider/messages",
    key: "messages",
    label: "Messages",
    element: "ProviderMessages",
    icon: FaEnvelope,
  },

  // ================= NOTIFICATIONS =================
  {
    path: "/provider/notifications",
    key: "notifications",
    label: "Notifications",
    element: "ProviderNotifications",
    icon: FaBell,
  },

  // ================= SUBSCRIPTION =================
  {
    path: "/provider/subscription",
    key: "subscription",
    label: "Subscription",
    element: "ProviderSubscription",
    icon: FaCreditCard,
  },

  // ================= PROFILE =================
  {
    path: "/provider/profile",
    key: "profile",
    label: "Profile",
    element: "ProviderProfile",
    icon: FaUser,
  },

  // ================= SETTINGS =================
  {
    path: "/provider/settings",
    key: "settings",
    label: "Settings",
    element: "ProviderSettings",
    icon: FaCog,
  },
];