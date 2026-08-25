import { MapPin } from "lucide-react";

import {
  formatFullBusinessAddress,
} from "../../utils/addressHelper";


const BusinessAddressCard = ({ business }) => {

  const address =
    business?.address || "";


  const fullAddress =
    formatFullBusinessAddress({

      address:
        typeof address === "string"
          ? address
          : [
              address?.street,
              address?.area,
              address?.landmark,
            ]
              .filter(Boolean)
              .join(", "),

      city:
        business?.cityName ||
        business?.cityId?.name ||
        "",

      district:
        business?.district ||
        "",

      state:
        business?.state ||
        "",

      country:
        business?.country ||
        "India",

      pincode:
        business?.pincode ||
        "",

    });


  if (!fullAddress) {
    return null;
  }


  return (

    <div
      className="
        bg-white
        rounded-2xl
        border
        p-5
        shadow-sm
      "
    >

      <div className="flex items-start gap-3">

        <MapPin
          className="text-blue-600 mt-1 flex-shrink-0"
          size={22}
        />

        <div>

          <h2
            className="
              text-lg
              font-semibold
              text-gray-900
            "
          >
            Address
          </h2>


          <p
            className="
              text-gray-700
              mt-2
              leading-7
            "
          >
            {fullAddress}
          </p>

        </div>

      </div>

    </div>

  );

};


export default BusinessAddressCard;