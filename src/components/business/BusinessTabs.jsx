
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Info,
  Briefcase,
  IndianRupee,
  CalendarCheck,
  Image,
  Star,
  Tag,
  Clock,
  MapPin,
  HelpCircle,
  Utensils,
} from "lucide-react";


const BusinessTabs = ({ business }) => {

  const [activeTab, setActiveTab] = useState("about");

  const tabBarRef = useRef(null);

  const tabRefs = useRef({});



  // =========================================================
  // FEATURE → TAB CONFIG
  // =========================================================

  const featureTabs = {

    services: {
      id: "services",
      label: "Services",
      icon: Briefcase,
    },

    pricing: {
      id: "pricing",
      label: "Pricing",
      icon: IndianRupee,
    },

    catalog: {
      id: "catalog",
      label: "Catalog",
      icon: Tag,
    },

    food_menu: {
      id: "food_menu",
      label: "Menu",
      icon: Utensils,
    },

    table_booking: {
      id: "booking",
      label: "Booking",
      icon: CalendarCheck,
    },

    room_booking: {
      id: "booking",
      label: "Booking",
      icon: CalendarCheck,
    },

    appointment_booking: {
      id: "booking",
      label: "Booking",
      icon: CalendarCheck,
    },

    party_booking: {
      id: "booking",
      label: "Booking",
      icon: CalendarCheck,
    },

    offers: {
      id: "offers",
      label: "Offers",
      icon: Tag,
    },

    business_hours: {
      id: "hours",
      label: "Hours",
      icon: Clock,
    },

    faq: {
      id: "faq",
      label: "FAQ",
      icon: HelpCircle,
    },

  };


  // =========================================================
  // AVAILABLE FEATURES
  // =========================================================

  const availableFeatures = useMemo(() => {

    const categoryFeatures = new Set(
  business?.categoryId?.features || []
);

const features = new Set(
  [...categoryFeatures].filter((feature) => {

    if (feature === "appointment_booking") {
      return business?.appointmentBooking?.enabled === true;
    }

    if (feature === "table_booking") {
      return business?.restaurantBooking?.enabled === true;
    }

    if (feature === "room_booking") {
      return business?.roomBooking?.enabled === true;
    }

    if (feature === "party_booking") {
      return business?.partyBooking?.enabled === true;
    }

    return true;
  })
);


    if (
      Array.isArray(business?.services) &&
      business.services.length
    ) {
      features.add("services");
    }


    if (
      Array.isArray(business?.pricing) &&
      business.pricing.length
    ) {
      features.add("pricing");
    }


    if (
      Array.isArray(business?.catalog) &&
      business.catalog.length
    ) {
      features.add("catalog");
    }


    if (
      Array.isArray(business?.menu) &&
      business.menu.length
    ) {
      features.add("food_menu");
    }


    if (
      business?.appointmentBooking?.enabled === true
    ) {
      features.add("appointment_booking");
    }


    if (
      business?.restaurantBooking?.enabled === true
    ) {
      features.add("table_booking");
    }


    if (
      business?.roomBooking?.enabled === true
    ) {
      features.add("room_booking");
    }


    if (
      business?.partyBooking?.enabled === true
    ) {
      features.add("party_booking");
    }


    if (
      Array.isArray(business?.offers) &&
      business.offers.length
    ) {
      features.add("offers");
    }


    if (
      business?.businessHours &&
      Object.keys(business.businessHours).length
    ) {
      features.add("business_hours");
    }


    if (
      Array.isArray(business?.faq) &&
      business.faq.length
    ) {
      features.add("faq");
    }


    return features;

  }, [business]);


  // =========================================================
  // FIXED TAB ORDER
  // =========================================================

  const TAB_ORDER = [
    "services",
    "pricing",
    "catalog",
    "food_menu",

    "table_booking",
    "room_booking",
    "appointment_booking",
    "party_booking",

    "offers",
    "business_hours",
    "faq",
  ];


  // =========================================================
  // DYNAMIC TABS
  // =========================================================

  const dynamicTabs = useMemo(() => {

    const result = TAB_ORDER
      .filter((feature) => {

        if (feature === "offers") {

          return (
            Array.isArray(business?.offers) &&
            business.offers.length > 0
          );

        }

        return availableFeatures.has(feature);

      })
      .map((feature) => featureTabs[feature])
      .filter(Boolean);


    /*
     * Booking ke multiple feature ho sakte hain,
     * lekin tab sirf ek hi rahega.
     */

    return Array.from(
      new Map(
        result.map((tab) => [
          tab.id,
          tab,
        ])
      ).values()
    );

  }, [
    availableFeatures,
    business,
  ]);


  // =========================================================
  // FINAL TABS
  // =========================================================

  const tabs = useMemo(() => {

    return [

      {
        id: "about",
        label: "About",
        icon: Info,
      },

      ...dynamicTabs,

      ...(business?.images?.length
        ? [
            {
              id: "photos",
              label: "Photos",
              icon: Image,
            },
          ]
        : []),

      {
        id: "reviews",
        label: "Reviews",
        icon: Star,
      },

      {
        id: "location",
        label: "Location",
        icon: MapPin,
      },

    ];

  }, [
    dynamicTabs,
    business?.images?.length,
  ]);


  // =========================================================
  // VALID SECTION MAP
  //
  // Only sections which actually exist in DOM are tracked.
  // =========================================================

  const getSectionMap = () => {

    const map = [];

    tabs.forEach((tab) => {

      const element =
        document.getElementById(tab.id);

      if (element) {

        map.push({
          id: tab.id,
          element,
        });

      }

    });

    return map;

  };


  // =========================================================
// KEEP ACTIVE TAB VISIBLE
//
// DESKTOP:
// Active tab ko smoothly center ke paas rakhta hai.
//
// MOBILE:
// Active tab ko sirf utna horizontal scroll karta hai
// jitna usko visible karne ke liye required hai.
// Unnecessary jumping nahi hoga.
// =========================================================

const ensureActiveTabVisible = (
  id,
  behavior = "smooth"
) => {

  const container = tabBarRef.current;
  const tab = tabRefs.current[id];

  if (!container || !tab) {
    return;
  }

  const containerRect =
    container.getBoundingClientRect();

  const tabRect =
    tab.getBoundingClientRect();

  const isMobile =
    window.innerWidth < 640;

  const edgeGap =
    isMobile ? 10 : 24;


  // =======================================================
  // ALREADY VISIBLE
  // =======================================================

  const isVisible =
    tabRect.left >=
      containerRect.left + edgeGap &&
    tabRect.right <=
      containerRect.right - edgeGap;


  if (isVisible) {
    return;
  }


  // =======================================================
  // MOBILE
  //
  // Only minimum required horizontal movement.
  // =======================================================

  if (isMobile) {

    let targetScroll =
      container.scrollLeft;


    // Tab left side se bahar hai
    if (
      tabRect.left <
      containerRect.left + edgeGap
    ) {

      targetScroll +=
        tabRect.left -
        (containerRect.left + edgeGap);

    }


    // Tab right side se bahar hai
    else if (
      tabRect.right >
      containerRect.right - edgeGap
    ) {

      targetScroll +=
        tabRect.right -
        (containerRect.right - edgeGap);

    }


    container.scrollTo({
      left: Math.max(0, targetScroll),
      behavior,
    });

    return;
  }


  // =======================================================
  // DESKTOP
  //
  // Existing centered behavior.
  // =======================================================

  const targetScroll =
    tab.offsetLeft -
    (
      container.clientWidth -
      tab.offsetWidth
    ) / 2;


  container.scrollTo({

    left: Math.max(
      0,
      targetScroll
    ),

    behavior,

  });

};

  // =========================================================
  // ACTIVE TAB CHANGE
  //
  // Whenever active tab changes:
  // automatically bring it into view.
  // =========================================================

  useEffect(() => {

    /*
     * Wait one frame so React has already
     * applied active class/ref.
     */

    const frame =
      requestAnimationFrame(() => {

        ensureActiveTabVisible(
          activeTab,
          "smooth"
        );

      });


    return () => {
      cancelAnimationFrame(frame);
    };

  }, [activeTab]);


  // =========================================================
  // SCROLL → ACTIVE SECTION
  //
  // Uses the section's distance from the sticky tab bar.
  //
  // This works both:
  //
  // DOWN:
  // About → Services → Reviews → Location
  //
  // UP:
  // Location → Reviews → Services → About
  // =========================================================

  useEffect(() => {

    let ticking = false;


    const updateActiveFromScroll = () => {

      ticking = false;



      const sections =
        getSectionMap();


      if (!sections.length) {
        return;
      }


      /*
       * Sticky header + tabs.
       *
       * The active section is the last section
       * whose top has crossed this line.
       */

      const stickyOffset = 120;


      let current =
        sections[0];


      for (const section of sections) {

        const top =
          section.element.getBoundingClientRect().top;


        if (top <= stickyOffset) {

          current = section;

        } else {

          break;

        }

      }


      if (!current?.id) {
        return;
      }


      setActiveTab((previous) => {

        if (previous === current.id) {
          return previous;
        }

        return current.id;

      });

    };


    const handleScroll = () => {

      if (ticking) {
        return;
      }


      ticking = true;


      requestAnimationFrame(
        updateActiveFromScroll
      );

    };


    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );


    /*
     * Initial state.
     */

    updateActiveFromScroll();


    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

  }, [tabs]);


  // =========================================================
// TAB CLICK
// =========================================================

const scrollToSection = (id) => {

  const element =
    document.getElementById(id);


  if (!element) {

    console.warn(
      `BusinessTabs: Section #${id} not found`
    );

    return;

  }


  // =======================================================
  // 1. TAB IMMEDIATELY ACTIVE
  // =======================================================

  setActiveTab(id);


  // =======================================================
  // 2. CLICKED TAB VISIBLE
  //
  // Small delay gives React time to apply active state.
  // =======================================================

  requestAnimationFrame(() => {

    ensureActiveTabVisible(
      id,
      "smooth"
    );

  });


  // =======================================================
  // 3. PAGE SCROLL
  // =======================================================

  const isMobile =
    window.innerWidth < 640;


  /*
   * Mobile par sticky header + tab bar
   * thoda different space le sakte hain.
   */

  const offset =
    isMobile
      ? 105
      : 100;


  const targetPosition =
    element.getBoundingClientRect().top +
    window.scrollY -
    offset;


  window.scrollTo({

    top: Math.max(
      0,
      targetPosition
    ),

    behavior: "smooth",

  });

};


  // =========================================================
  // BUSINESS CHANGED
  //
  // Reset active tab if current tab no longer exists.
  // =========================================================

  useEffect(() => {

    const exists =
      tabs.some(
        (tab) => tab.id === activeTab
      );


    if (!exists) {

      setActiveTab("about");

    }

  }, [tabs, activeTab]);


  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div
      ref={tabBarRef}
      className="
        sticky
        top-16
        z-40

        w-full

        bg-white

        border-b
        border-gray-200

        shadow-sm

        overflow-x-auto
        overflow-y-hidden

        scrollbar-hide
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto

          px-3
          sm:px-4

          flex
          items-center

          gap-1.5
          sm:gap-2

          py-2.5
          sm:py-3

          min-w-max
        "
      >

        {tabs.map((tab) => {

          const Icon =
            tab.icon;


          const isActive =
            activeTab === tab.id;


          return (

            <button
              key={tab.id}

              ref={(element) => {

                if (element) {

                  tabRefs.current[
                    tab.id
                  ] = element;

                } else {

                  delete tabRefs.current[
                    tab.id
                  ];

                }

              }}

              type="button"

              onClick={() =>
                scrollToSection(tab.id)
              }

              aria-current={
                isActive
                  ? "page"
                  : undefined
              }

              className={`
                flex
                items-center
                justify-center

                gap-1.5
                sm:gap-2

                px-2.5
                sm:px-4

                py-1.5
                sm:py-2

                rounded-full

                whitespace-nowrap

                flex-shrink-0

                text-xs
                sm:text-sm

                font-medium

                transition-all
                duration-200

                select-none

                ${
                  isActive
                    ? `
                      bg-blue-600
                      text-white
                      shadow-sm
                    `
                    : `
                      bg-transparent
                      text-gray-600
                      hover:bg-blue-50
                      hover:text-blue-600
                    `
                }
              `}
            >

              <Icon
                size={16}
                strokeWidth={
                  isActive
                    ? 2.4
                    : 2
                }
                className="
                  flex-shrink-0
                "
              />

              <span>
                {tab.label}
              </span>

            </button>

          );

        })}

      </div>

    </div>

  );

};


export default BusinessTabs;