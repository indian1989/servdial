import { MapPin, Navigation } from "lucide-react";
import {
  formatBusinessAddress,
  normalizeLocation
} from "../../utils/addressHelper";

const titleCase = (str = "") =>
  str
    .toString()
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());


const LocationMap = ({ business }) => {

  const lat = business?.location?.coordinates?.[1];
  const lng = business?.location?.coordinates?.[0];


  const hasLocation =
    typeof lat === "number" &&
    typeof lng === "number";


  const googleMapUrl = hasLocation
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : null;


  const osmEmbed = hasLocation
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${
        lng - 0.01
      },${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`
    : null;


const locationText = normalizeLocation(
    titleCase(
      business?.cityName ||
      business?.cityId?.name
    ),

    titleCase(
      business?.district
    ),

    titleCase(
      business?.state
    ),

    business?.country || "India",

    business?.pincode

  );



  return (

    <section
      id="location"
      className="bg-white rounded-xl shadow overflow-hidden"
    >


      {/* Header */}

      <div className="p-5 border-b">

        <h2 className="
          text-lg
          font-semibold
          flex
          items-center
          gap-2
        ">
          <MapPin size={20} />
          Location
        </h2>

      </div>



      {/* Address */}

      <div className="p-5">


        <p className="text-gray-700">

          {formatBusinessAddress(
            business?.address
          ) || "Address not available"}

        </p>



        <p className="
          text-sm
          text-gray-500
          mt-1
        ">
          {locationText}
        </p>


      </div>




      {/* Map */}

      {hasLocation ? (

        <>

          <iframe
            title="Business Location"
            src={osmEmbed}
            className="w-full h-80 border-0"
            loading="lazy"
          />


          <div className="p-5">

            <a
              href={googleMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                gap-2
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-4
                py-2
                rounded-lg
                transition
              "
            >

              <Navigation size={18} />

              Get Directions

            </a>

          </div>


        </>

      ) : (

        <div className="px-5 pb-5">

          <div className="
            bg-yellow-50
            border
            border-yellow-200
            rounded-lg
            p-4
            text-sm
            text-yellow-700
          ">

            Location coordinates are not available for this business.

          </div>

        </div>

      )}


    </section>

  );

};


export default LocationMap;