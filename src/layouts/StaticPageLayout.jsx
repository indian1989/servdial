import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const StaticPageLayout = ({
  title,
  subtitle,
  children,
  cta,
  path = "",

  // SEO
  description,
  keywords,

  // Policy support
  lastUpdated,
  showPolicyNotice = false,
}) => {


  return (

    <>
      <Helmet>

        <title>
          {title} | ServDial
        </title>

        {description && (
          <meta
            name="description"
            content={description}
          />
        )}

        {keywords && (
          <meta
            name="keywords"
            content={keywords}
          />
        )}

        <meta
          name="robots"
          content="index,follow"
        />

        {path && (
          <link
            rel="canonical"
            href={`https://www.servdial.com${path}`}
          />
        )}

        <meta
          property="og:title"
          content={`${title} | ServDial`}
        />

        {description && (
          <meta
            property="og:description"
            content={description}
          />
        )}

        {path && (
          <meta
            property="og:url"
            content={`https://www.servdial.com${path}`}
          />
        )}

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
          content={`${title} | ServDial`}
        />

        {description && (
          <meta
            name="twitter:description"
            content={description}
          />
        )}

        {path && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AboutPage",
              name: title,
              url: `https://www.servdial.com${path}`,
              description: description || "",
              breadcrumb: {
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
                    name: title,
                    item: `https://www.servdial.com${path}`,
                  },
                ],
              },
            })}
          </script>
        )}

      </Helmet>

      <div className="bg-[#f8fafc] min-h-screen">

      {/* ================= HERO ================= */}

      <section
        className="
        mx-4
        mt-6
        rounded-2xl
        bg-blue-600
        text-white
        "
      >

        <div
          className="
          max-w-6xl
          mx-auto
          px-6
          py-16
          "
        >


          {/* Breadcrumb */}

         <nav
  aria-label="Breadcrumb"
  className="
  mb-6
  text-sm
  "
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

    <li className="text-blue-200">
      &gt;
    </li>

    <li
      aria-current="page"
      className="font-medium text-white"
    >
      {title}
    </li>

  </ol>
</nav>

          <h1
          className="
          text-4xl
          md:text-5xl
          font-bold
          text-white
          mb-5
          "
          >

            {title}

          </h1>



          {
            subtitle &&

            <p
            className="
            text-lg
            text-blue-50
            max-w-3xl
            leading-relaxed
            "
            >

              {subtitle}

            </p>

          }


        </div>


      </section>





      {/* ================= CONTENT ================= */}


      <main
      className="
      max-w-6xl
      mx-auto
      px-6
      py-14
      "
      >


        <div
        className="
        bg-white
        rounded-3xl
        shadow-sm
        border
        p-6
        md:p-10

        text-gray-700
        leading-relaxed

        [&_h2]:
        text-2xl

        [&_h2]:
        font-semibold

        [&_h2]:
        text-gray-900

        [&_h2]:
        mt-8

        [&_h2]:
        mb-4


        [&_h3]:
        text-xl

        [&_h3]:
        font-semibold

        [&_h3]:
        text-gray-900


        [&_p]:
        mb-4


        [&_ul]:
        list-disc

        [&_ul]:
        ml-6

        [&_ul]:
        space-y-2

        "
        >


          {children}



          {/* Policy Notice */}

          {
          showPolicyNotice &&

          <div
          className="
          mt-10
          bg-indigo-50
          border
          border-indigo-100
          rounded-xl
          p-5
          text-sm
          text-gray-700
          "
          >

            <strong>
              Policy Updates:
            </strong>

            <p className="mt-2">

              ServDial reserves the right to
              update, modify, or revise these
              policies, terms, and guidelines
              at any time without prior notice.

              Users are encouraged to review
              this page periodically for the
              latest information.

            </p>


          </div>

          }



          {
          lastUpdated &&

          <div
          className="
          mt-8
          text-sm
          text-gray-500
          border-t
          pt-4
          "
          >

            Last Updated:
            {" "}
            {lastUpdated}

          </div>

          }


        </div>


      </main>







      {/* ================= CTA ================= */}


      {
      cta &&

      <section
      className="
      bg-gradient-to-r
      from-indigo-600
      to-purple-600
      text-white
      mt-16
      "
      >


        <div
        className="
        max-w-6xl
        mx-auto
        px-6
        py-16
        text-center
        "
        >


          <h2
          className="
          text-3xl
          font-semibold
          mb-4
          "
          >

            {cta.title}

          </h2>



          <p
          className="
          text-indigo-100
          max-w-xl
          mx-auto
          mb-7
          "
          >

            {cta.subtitle}

          </p>




          <div
          className="
          flex
          justify-center
          gap-4
          flex-wrap
          "
          >

            {
            cta.actions?.map(
              (btn,index)=>(

              <a

              key={index}

              href={btn.link}

              className={`
              px-6
              py-3
              rounded-xl
              font-medium
              transition

              ${
              btn.primary

              ?

              "bg-white text-indigo-700 hover:scale-105"

              :

              "border border-white hover:bg-white hover:text-indigo-700"

              }

              `}

              >

                {btn.label}

              </a>

              )

            )
            }


          </div>


        </div>


      </section>

      }

        </div>

    </>

  );

};


export default StaticPageLayout;