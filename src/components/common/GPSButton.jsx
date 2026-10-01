import { useState } from "react";
import { useCity } from "../../context/CityContext";

const GPSButton = () => {
  const [loading, setLoading] = useState(false);

  const { detectLocation } = useCity();

  const handleDetect = async () => {
    console.log("🔥 GPS BUTTON CLICKED");

    try {
      setLoading(true);

      console.log(
        "🔥 CALLING detectLocation:",
        detectLocation
      );

      const result = await detectLocation();

      console.log(
        "🔥 detectLocation RESULT:",
        result
      );

    } catch (e) {
      console.error(
        "❌ GPS detect failed:",
        e
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDetect}
      disabled={loading}
      className={`px-3 py-2 rounded-md text-white transition ${
        loading
          ? "bg-gray-400"
          : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {loading ? "Detecting..." : "📍 GPS"}
    </button>
  );
};

export default GPSButton;