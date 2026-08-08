import { MapPin } from "lucide-react";
import {
  formatBusinessAddress,
  normalizeLocation
 } from "../../utils/addressHelper";


const titleCase = (str = "") =>
  str
    .toString()
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());


const BusinessAddressCard = ({ business }) => {


  const address = formatBusinessAddress(
    business?.address
  );


  const location = normalizeLocation(

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

  business.country || "India",
  business?.pincode

);



  const fullAddress = [
    address,
    location,
  ]
    .filter(Boolean)
    .join(", ");



  if (!fullAddress) return null;



  return (

    <div className="
      bg-white
      rounded-2xl
      border
      p-5
      shadow-sm
    ">

      <div className="flex items-start gap-3">


        <MapPin
          className="text-blue-600 mt-1"
          size={22}
        />


        <div>


          <h2 className="
            text-lg
            font-semibold
            text-gray-900
          ">
            Address
          </h2>


          <p className="
            text-gray-700
            mt-2
            leading-7
          ">
            {fullAddress}
          </p>


        </div>


      </div>


    </div>

  );

};


export default BusinessAddressCard;