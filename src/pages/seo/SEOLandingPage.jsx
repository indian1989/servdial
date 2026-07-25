import {
  useParams
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import {
  Helmet
} from "react-helmet-async";

import API from "../../api/axios";

import BusinessCard from "../../components/business/BusinessCard";



const SEOLandingPage = () => {


  const {
    citySlug,
    categorySlug
  } = useParams();



  const [
    businesses,
    setBusinesses
  ] = useState([]);



  const [
    cityName,
    setCityName
  ] = useState("");



  const [
    categoryName,
    setCategoryName
  ] = useState("");



  const [
    loading,
    setLoading
  ] = useState(true);



  const [
    error,
    setError
  ] = useState("");




  /* ================= FETCH SEO DATA ================= */


  useEffect(() => {


    const fetchSEOData = async () => {


      try {


        setLoading(true);

        setError("");



        const res =
          await API.get(
            "/businesses/search",
            {
              params:{
                citySlug,
                categorySlug
              }
            }
          );



        const list =
          res.data?.data || [];



        setBusinesses(list);



        /*
        ============================
        Extract SEO Names
        From First Business
        ============================
        */


        if(list.length > 0){


          const first =
            list[0];



          setCityName(

            first.cityId?.name

            ? [

                first.cityId.name,

                first.district,

                first.state

              ]
              .filter(Boolean)
              .join(", ")

            : ""

          );



          setCategoryName(
            first.categoryId?.name || ""
          );


        }
        else {


          // fallback slug

          setCityName(
            citySlug
              ?.replaceAll("-", " ")
          );


          setCategoryName(
            categorySlug
              ?.replaceAll("-", " ")
          );


        }



      }
      catch(err){


        console.error(
          "SEO Landing Error:",
          err
        );


        setError(
          "Unable to load businesses"
        );


      }
      finally{


        setLoading(false);


      }


    };



    if(
      citySlug &&
      categorySlug
    ){

      fetchSEOData();

    }



  },[
    citySlug,
    categorySlug
  ]);





  /* ================= SEO ================= */


  const pageTitle =
    `${categoryName || "Businesses"} in ${cityName || ""} | ServDial`;



  const pageDescription =
    `Find trusted ${categoryName || "local businesses"} in ${
      cityName || "your city"
    }. Browse verified businesses, services, contact details and reviews on ServDial.`;





  const schema = {

    "@context":
      "https://schema.org",


    "@type":
      "CollectionPage",


    "name":
      pageTitle,


    "description":
      pageDescription,


    "url":
      window.location.href

  };






  return (

    <>


      <Helmet>


        <title>
          {pageTitle}
        </title>



        <meta
          name="description"
          content={pageDescription}
        />



        <link
          rel="canonical"
          href={window.location.href}
        />



        <script type="application/ld+json">

          {
            JSON.stringify(schema)
          }

        </script>



      </Helmet>





      <div
        className="
        max-w-7xl
        mx-auto
        px-4
        py-10
        "
      >




        {/* Breadcrumb */}

        <div
          className="
          text-sm
          text-gray-500
          mb-4
          "
        >

          Home

          {" / "}

          {cityName}

          {" / "}

          {categoryName}


        </div>





        <h1
          className="
          text-3xl
          font-bold
          mb-4
          capitalize
          "
        >

          {categoryName}

          {" in "}

          {cityName}

          {" | ServDial"}

        </h1>





        <p
          className="
          text-gray-600
          mb-8
          "
        >

          Discover verified and trusted{" "}

          {categoryName}

          {" "}
          businesses near you in{" "}

          {cityName}.

        </p>





        {
          loading && (

            <p>
              Loading businesses...
            </p>

          )
        }






        {
          error && (

            <p
              className="text-red-500"
            >
              {error}
            </p>

          )
        }





        {
          !loading &&
          !error &&
          businesses.length === 0 && (

            <div
              className="
              text-center
              py-10
              text-gray-500
              "
            >

              No businesses found.

            </div>

          )

        }






        {
          businesses.length > 0 && (


            <>


            <h2
              className="
              text-xl
              font-semibold
              mb-5
              "
            >

              Top {categoryName} Businesses in {cityName}

            </h2>





            <div
              className="
              grid
              md:grid-cols-3
              gap-6
              "
            >


              {
                businesses.map(
                  (biz)=>(


                    <BusinessCard

                      key={
                        biz._id
                      }

                      business={
                        biz
                      }

                    />


                  )
                )
              }


            </div>


            </>


          )
        }





      </div>


    </>

  );

};


export default SEOLandingPage;