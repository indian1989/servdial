import React, { useEffect } from "react";

const StaticPageLayout = ({
  title,
  subtitle,
  children,
  cta,
}) => {

  // ✅ SEO Meta
  useEffect(() => {
    document.title = `${title} | ServDial`;
  }, [title]);

  return (
    <div className="bg-[#f8fafc] min-h-screen">

      {/* ================= HERO ================= */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-b">
        <div className="max-w-6xl mx-auto px-6 py-14">

          {/* Breadcrumb */}
          <p className="text-sm text-gray-500 mb-3">
            Home / {title}
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h1>

          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl">
              {subtitle}
            </p>
          )}

        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-6xl mx-auto px-6 py-14">

        <div className="space-y-14 text-gray-600 leading-relaxed text-[16.5px]">

          <div className="
            [&_h2]:text-2xl 
            [&_h2]:font-semibold 
            [&_h2]:text-gray-900 
            [&_h2]:mb-3

            [&_h3]:text-lg 
            [&_h3]:font-semibold 
            [&_h3]:text-gray-800 
            [&_h3]:mb-2

            [&_p]:mb-3
            [&_ul]:list-disc 
            [&_ul]:ml-6 
            [&_ul]:space-y-2
          ">
            {children}
          </div>

        </div>

      </div>

      {/* ================= CTA ================= */}
      {cta && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white mt-20">
          <div className="max-w-6xl mx-auto px-6 py-16 text-center">

            <h2 className="text-3xl font-semibold mb-4">
              {cta.title}
            </h2>

            <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
              {cta.subtitle}
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              {cta.actions?.map((btn, i) => (
                <a
                  key={i}
                  href={btn.link}
                  className={`px-6 py-3 rounded-lg font-medium transition ${
                    btn.primary
                      ? "bg-white text-indigo-700 hover:scale-105"
                      : "border border-white hover:bg-white hover:text-indigo-700"
                  }`}
                >
                  {btn.label}
                </a>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default StaticPageLayout;