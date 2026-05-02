import { useState } from "react";
import { useCity } from "../../context/CityContext";

const GPSButton = () => {
  const [loading, setLoading] = useState(false);
  const { detectLocation } = useCity();

  const handleDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await detectLocation(); 
          alert("Location detected. Please select your city if not auto-selected.");
        } catch (e) {
          alert("Failed to detect city");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);

        if (error.code === 1) {
          alert("Location permission denied");
        } else {
          alert("Unable to fetch location");
        }
      }
    );
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