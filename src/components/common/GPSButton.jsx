import { useState } from "react";
import { useCity } from "../../context/CityContext";

const GPSButton = () => {
  const [loading, setLoading] = useState(false);
  const { detectLocation } = useCity();

  const handleDetect = async () => {
    try {
      setLoading(true);
      await detectLocation();
    } catch (e) {
      alert("Failed to detect location");
      console.error("GPS detect failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDetect}
      disabled={loading}
      className={`px-3 py-2 rounded-md text-white transition ${
        loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {loading ? "Detecting..." : "📍 GPS"}
    </button>
  );
};

export default GPSButton;