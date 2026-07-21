import { useNavigate } from "react-router-dom";
import { BadgeCheck } from "lucide-react";

const ClaimBusinessBanner = ({ business, user }) => {

  const navigate = useNavigate();

  if (!business || business.isClaimed || !user) {
    return null;
  }


  return (
    <div
      className="
      bg-yellow-100
      border
      border-yellow-300
      p-4
      rounded-xl
      flex
      justify-between
      items-center
      gap-4
      "
    >

      <div className="flex items-center gap-3">

        <BadgeCheck
          className="text-yellow-600"
          size={24}
        />

        <div>

          <h3 className="font-semibold">
            Own this business?
          </h3>

          <p className="text-sm text-gray-600">
            Claim your listing and manage your profile.
          </p>

        </div>

      </div>


      <button
        onClick={() =>
          navigate(`/claim-business/${business._id}`)
        }
        className="
        bg-black
        text-white
        px-4
        py-2
        rounded-lg
        text-sm
        "
      >
        Claim Now
      </button>


    </div>
  );
};


export default ClaimBusinessBanner;