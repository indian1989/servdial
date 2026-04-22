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
  FaCog 
} from "react-icons/fa";

export const providerRoutes = [
  {
    path: "/provider/dashboard",
    name: "Dashboard",
    element: "ProviderDashboard",
    icon: FaTachometerAlt,
  },
  {
    path: "/provider/businesses",
    name: "My Businesses",
    element: "ProviderBusinesses",
    icon: FaBuilding,
  },
  {
    path: "/provider/add-business",
    name: "Add Business",
    element: "ProviderAddBusiness",
    icon: FaPlusCircle,
  },
  {
    path: "/provider/leads",
    name: "Leads",
    element: "ProviderLeads",
    icon: FaUsers,
  },
  {
    path: "/provider/reviews",
    name: "Reviews",
    element: "ProviderReviews",
    icon: FaStar,
  },
  {
    path: "/provider/analytics",
    name: "Analytics",
    element: "ProviderAnalytics",
    icon: FaChartLine,
  },
  {
    path: "/provider/offers",
    name: "Offers / Promotions",
    element: "ProviderOffers",
    icon: FaTags,
  },
  {
    path: "/provider/messages",
    name: "Messages",
    element: "ProviderMessages",
    icon: FaEnvelope,
  },
  {
    path: "/provider/notifications",
    name: "Notifications",
    element: "ProviderNotifications",
    icon: FaBell,
  },
  {
    path: "/provider/subscription",
    name: "Subscription",
    element: "ProviderSubscription",
    icon: FaCreditCard,
  },
  {
    path: "/provider/profile",
    name: "Profile",
    element: "ProviderProfile",
    icon: FaUser,
  },
  {
    path: "/provider/settings",
    name: "Settings",
    element: "ProviderSettings",
    icon: FaCog,
  },
];