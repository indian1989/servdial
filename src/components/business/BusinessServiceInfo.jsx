import {
  Briefcase,
  Truck,
  MapPin,
  Globe,
} from "lucide-react";

import BusinessSection from "./BusinessSection";


const serviceTypeLabels = {

  home: "Home Service",

  shop: "Shop / In-store",

  online: "Online Service",

  onsite: "On-site Visit",

  pickup: "Pickup Available",

  delivery: "Delivery Available",

};



const BusinessServiceInfo = ({ business }) => {


  const services =
    business?.services || [];


  const serviceTypes =
    business?.serviceTypes || [];


  const coverage =
    business?.serviceCoverage || {};



  const hasCoverage =
    coverage?.type === "global" ||
    coverage?.cities?.length > 0 ||
    coverage?.states?.length > 0 ||
    coverage?.countries?.length > 0;



  if (
    !services.length &&
    !serviceTypes.length &&
    !hasCoverage
  ) {

    return null;

  }



  return (

    <BusinessSection id="services">


      <h2 className="text-xl font-bold mb-6">
        Services
      </h2>



 {/* ================= SERVICES OFFERED ================= */}

{
  services?.length > 0 && (

    <div className="mb-8">


      <div className="flex items-center gap-2 mb-4">

        <Briefcase
          size={20}
          className="text-blue-600"
        />

        <h3 className="font-semibold text-lg">
          Services Offered
        </h3>

      </div>



      <div className="
        grid
        sm:grid-cols-2
        lg:grid-cols-3
        gap-3
      ">


        {
          services.map((service,index)=>(

            <div
              key={index}
              className="
                px-4
                py-3
                rounded-xl
                bg-blue-50
                text-blue-700
                text-sm
                font-medium
                border
                border-blue-100
              "
            >

              <div>
                {service.name}
              </div>


              {
                service.description && (

                  <p className="
                    text-xs
                    text-gray-500
                    mt-1
                  ">
                    {service.description}
                  </p>

                )
              }


            </div>

          ))
        }


      </div>


    </div>

  )
}


      {/* ================= SERVICE TYPES ================= */}


      {
        serviceTypes.length > 0 && (

          <div className="mb-8">


            <div className="flex items-center gap-2 mb-4">


              <Truck
                size={20}
                className="text-indigo-600"
              />


              <h3 className="font-semibold text-lg">
                Service Type
              </h3>


            </div>



            <div className="flex flex-wrap gap-3">


              {
                serviceTypes.map(
                  (type,index)=>(

                  <span

                    key={index}

                    className="
                    px-4
                    py-2
                    rounded-full
                    bg-indigo-50
                    text-indigo-700
                    text-sm
                    font-medium
                    "

                  >

                    {
                      serviceTypeLabels[type]
                      ||
                      type
                    }

                  </span>


                ))
              }


            </div>


          </div>

        )
      }





      {/* ================= SERVICE COVERAGE ================= */}


      {
        hasCoverage && (

          <div>


            <div className="flex items-center gap-2 mb-4">


              <MapPin
                size={20}
                className="text-green-600"
              />


              <h3 className="font-semibold text-lg">
                Service Coverage
              </h3>


            </div>




            {
              coverage.type === "global" ? (

                <div
                  className="
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-green-50
                  border
                  border-green-200
                  p-4
                  text-green-700
                  "
                >

                  <Globe size={18}/>

                  Worldwide Service Available


                </div>


              ) : (


                <div className="flex flex-wrap gap-3">



                  {
                    coverage.cities?.map(
                      (city,index)=>(

                      <span

                        key={`city-${index}`}

                        className="
                        px-4
                        py-2
                        rounded-full
                        bg-green-50
                        text-green-700
                        text-sm
                        "

                      >

                        {city.name}


                      </span>

                    ))
                  }




                  {
                    coverage.states?.map(
                      (state,index)=>(

                      <span

                        key={`state-${index}`}

                        className="
                        px-4
                        py-2
                        rounded-full
                        bg-yellow-50
                        text-yellow-700
                        text-sm
                        "

                      >

                        {state.name}


                      </span>

                    ))
                  }





                  {
                    coverage.countries?.map(
                      (country,index)=>(

                      <span

                        key={`country-${index}`}

                        className="
                        px-4
                        py-2
                        rounded-full
                        bg-blue-50
                        text-blue-700
                        text-sm
                        "

                      >

                        {country.name}


                      </span>

                    ))
                  }


                </div>


              )
            }


          </div>

        )
      }



    </BusinessSection>

  );

};


export default BusinessServiceInfo;