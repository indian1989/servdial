import { useState } from "react";

const GPSButton = () => {
  const [loading, setLoading] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse Geocoding using OpenStreetMap
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          const data = await response.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.state;

          if (city) {
            localStorage.setItem("servdial_city", city);
            window.location.reload(); // reload to reflect city change
          } else {
            alert("City not detected. Please select manually.");
          }

        } catch (error) {
          alert("Failed to detect city.");
        }

        setLoading(false);
      },
      (error) => {
        setLoading(false);

        if (error.code === 1) {
          alert("Location access denied.");
        } else {
          alert("Unable to fetch location.");
        }
      }
    );
  };

  return (
    <button
      onClick={detectLocation}
      disabled={loading}
      className={`px-3 py-2 rounded-md text-white transition ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {loading ? "Detecting..." : "📍 GPS"}
    </button>
  );
};

export default GPSButton;