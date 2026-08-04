import React, { useEffect } from "react";

const StaticPageLayout = ({
  title,
  subtitle,
  children,
  cta,

  // SEO
  description,
  keywords,

  // Policy support
  lastUpdated,
  showPolicyNotice = false,
}) => {


  useEffect(() => {

    document.title = `${title} | ServDial`;


    if(description){

      const metaDescription =
        document.querySelector(
          'meta[name="description"]'
        );

      if(metaDescription){
        metaDescription.setAttribute(
          "content",
          description
        );
      }

    }


    if(keywords){

      let metaKeywords =
        document.querySelector(
          'meta[name="keywords"]'
        );


      if(!metaKeywords){

        metaKeywords =
          document.createElement("meta");

        metaKeywords.name="keywords";

        document.head.appendChild(
          metaKeywords
        );

      }


      metaKeywords.content = keywords;

    }


  },[
    title,
    description,
    keywords
  ]);



  return (

    <div className="bg-[#f8fafc] min-h-screen">


      {/* ================= HERO ================= */}

      <section
        className="
        bg-gradient-to-br
        from-indigo-50
        via-white
        to-purple-50
        border-b
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

          <div
          className="
          text-sm
          text-gray-500
          mb-5
          "
          >

            Home
            <span className="mx-2">
              /
            </span>

            {title}

          </div>



          <h1
          className="
          text-4xl
          md:text-5xl
          font-bold
          text-gray-900
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
            text-gray-600
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

  );

};


export default StaticPageLayout;