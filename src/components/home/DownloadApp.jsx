import {
  Smartphone,
  Search,
  Home,
  HeartPulse,
  Utensils,
  Car,
  GraduationCap,
  Sparkles,
  Hotel,
  MoreHorizontal,
} from "lucide-react";

const DownloadApp = () => {
  const appCategories = [
    {
      name: "Home Services",
      icon: Home,
    },
    {
      name: "Health & Medical",
      icon: HeartPulse,
    },
    {
      name: "Restaurants & Food",
      icon: Utensils,
    },
    {
      name: "Automobiles",
      icon: Car,
    },
    {
      name: "Education & Training",
      icon: GraduationCap,
    },
    {
      name: "Beauty & Personal Care",
      icon: Sparkles,
    },
    {
      name: "Hotels & Accommodation",
      icon: Hotel,
    },
    {
      name: "More",
      icon: MoreHorizontal,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 mt-20 mb-10">

      <div className="bg-gray-100 rounded-2xl p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden">

        {/* =====================================================
            LEFT CONTENT
        ===================================================== */}
        <div className="max-w-xl">

          {/* TITLE */}
          <div className="flex items-center gap-2 mb-3">
            <Smartphone
              className="text-blue-600"
              size={28}
            />

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Get the ServDial App
            </h2>
          </div>

          {/* COMING SOON BADGE */}
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            Coming Soon
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-600 leading-7 mb-6">
            Search and connect with trusted local businesses faster
            using the upcoming ServDial mobile app. Discover services,
            find nearby businesses, connect with providers, and explore
            trusted local services wherever you go.
          </p>

          {/* FEATURES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Discover local businesses
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Find services near you
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Connect with providers
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Explore trusted businesses
            </div>

          </div>

          {/* =================================================
              STORE BUTTONS
          ================================================= */}
          <div className="flex flex-wrap gap-4">

            {/* APP STORE */}
            <button
              type="button"
              disabled
              className="bg-gray-900 text-white px-5 py-3 rounded-lg text-sm font-medium opacity-80 cursor-not-allowed"
            >
              <span className="block text-xs text-gray-300">
                Coming Soon
              </span>

              <span className="font-semibold">
                App Store
              </span>
            </button>

            {/* GOOGLE PLAY */}
            <button
              type="button"
              disabled
              className="bg-gray-900 text-white px-5 py-3 rounded-lg text-sm font-medium opacity-80 cursor-not-allowed"
            >
              <span className="block text-xs text-gray-300">
                Coming Soon
              </span>

              <span className="font-semibold">
                Google Play
              </span>
            </button>

          </div>

        </div>


        {/* =====================================================
            RIGHT SIDE — SERVdial MOBILE PREVIEW
        ===================================================== */}
        <div className="flex items-center justify-center lg:min-w-[320px]">

          {/* PHONE FRAME */}
          <div className="relative w-[220px] h-[440px] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">

            {/* PHONE SCREEN */}
            <div className="relative w-full h-full bg-white rounded-[2rem] overflow-hidden">

              {/* TOP HEADER */}
              <div className="bg-white px-4 pt-5 pb-3 border-b">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-1.5">

                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
                      <Search
                        size={15}
                        className="text-white"
                      />
                    </div>

                    <span className="text-sm font-bold">
                      <span className="text-blue-700">
                        Serv
                      </span>
                      <span className="text-orange-500">
                        Dial
                      </span>
                    </span>

                  </div>

                  <div className="flex gap-1">
                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                    <span className="w-1 h-1 rounded-full bg-gray-400" />
                  </div>

                </div>

              </div>


              {/* SEARCH AREA */}
              <div className="px-4 pt-4">

                <h3 className="text-lg font-bold leading-5 text-gray-900">
                  Find the Best
                  <br />
                  <span className="text-orange-500">
                    Businesses Near You
                  </span>
                </h3>

                <div className="mt-3 bg-gray-100 rounded-full h-8 flex items-center px-3">

                  <Search
                    size={13}
                    className="text-gray-400"
                  />

                  <span className="text-[8px] text-gray-400 ml-2">
                    Search services or businesses...
                  </span>

                </div>

              </div>


              {/* CATEGORIES */}
              <div className="px-3 pt-4">

                <p className="text-[10px] font-semibold text-gray-700 mb-3">
                  Explore Categories
                </p>

                <div className="grid grid-cols-2 gap-2">

                  {appCategories.map((category) => {
                    const Icon = category.icon;

                    return (
                      <div
                        key={category.name}
                        className="bg-gray-50 border border-gray-100 rounded-xl p-2 flex flex-col items-center justify-center text-center min-h-[62px]"
                      >

                        <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center mb-1">
                          <Icon
                            size={14}
                            className="text-blue-600"
                          />
                        </div>

                        <span className="text-[8px] leading-3 font-medium text-gray-700">
                          {category.name}
                        </span>

                      </div>
                    );
                  })}

                </div>

              </div>


              {/* BOTTOM NAV */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t px-5 py-3 flex items-center justify-between">

                <div className="flex flex-col items-center">
                  <Home
                    size={15}
                    className="text-blue-600"
                  />
                  <span className="text-[7px] text-blue-600 mt-1">
                    Home
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <Search
                    size={15}
                    className="text-gray-400"
                  />
                  <span className="text-[7px] text-gray-400 mt-1">
                    Search
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <HeartPulse
                    size={15}
                    className="text-gray-400"
                  />
                  <span className="text-[7px] text-gray-400 mt-1">
                    Services
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default DownloadApp;