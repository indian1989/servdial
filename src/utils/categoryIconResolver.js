import {
  Home,
  Hammer,
  Heart,
  GraduationCap,
  Utensils,
  Car,
  Building2,
  Plane,
  ShoppingBag,
  Scissors,
  PartyPopper,
  Laptop,
  Landmark,
  Scale,
  Factory,
  Plug,
  Sofa,
  Truck,
  Printer,
  Leaf,
  CircleHelp,
} from "lucide-react";

/* =========================
   🎨 CATEGORY THEME COLORS
   ========================= */
const categoryTheme = {
  "home-services": "bg-blue-50 text-blue-600",
  "construction-contractors": "bg-yellow-50 text-yellow-600",
  "health-medical": "bg-red-50 text-red-600",
  "education-training": "bg-indigo-50 text-indigo-600",
  "restaurants-food": "bg-orange-50 text-orange-600",
  automobiles: "bg-gray-100 text-gray-700",
  "real-estate": "bg-green-50 text-green-600",
  "travel-transport": "bg-sky-50 text-sky-600",
  "shopping-retail": "bg-pink-50 text-pink-600",
  "beauty-personal-care": "bg-rose-50 text-rose-600",
  "events-entertainment": "bg-purple-50 text-purple-600",
  "it-digital-services": "bg-blue-100 text-blue-700",
  "financial-services": "bg-emerald-50 text-emerald-600",
  "legal-services": "bg-slate-100 text-slate-700",
  "industrial-manufacturing": "bg-zinc-100 text-zinc-700",
  "electronics-repair": "bg-cyan-50 text-cyan-600",
  "furniture-interior": "bg-amber-50 text-amber-700",
  "courier-logistics": "bg-teal-50 text-teal-600",
  "printing-advertising": "bg-violet-50 text-violet-600",
  "agriculture-farming": "bg-lime-50 text-lime-700",
};

/* =========================
   🧠 ICON MAPPING (FALLBACK SYSTEM)
   ========================= */
const iconMap = {
  "home-services": Home,
  "construction-contractors": Hammer,
  "health-medical": Heart,
  "education-training": GraduationCap,
  "restaurants-food": Utensils,
  automobiles: Car,
  "real-estate": Building2,
  "travel-transport": Plane,
  "shopping-retail": ShoppingBag,
  "beauty-personal-care": Scissors,
  "events-entertainment": PartyPopper,
  "it-digital-services": Laptop,
  "financial-services": Landmark,
  "legal-services": Scale,
  "industrial-manufacturing": Factory,
  "electronics-repair": Plug,
  "furniture-interior": Sofa,
  "courier-logistics": Truck,
  "printing-advertising": Printer,
  "agriculture-farming": Leaf,
};

/* =========================
   🔥 MAIN RESOLVER (PUBLIC API)
   ========================= */
export const resolveCategoryUI = (cat = {}) => {
  const slug = cat.slug;

  return {
    Icon: iconMap[slug] || CircleHelp,
    color: categoryTheme[slug] || "bg-gray-50 text-gray-500",
  };
};