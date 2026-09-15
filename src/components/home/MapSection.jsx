import { useState, useEffect } from "react";

const MapSection = ({ businesses }) => {
  const [MapComponent, setMapComponent] = useState(null);
  const [center, setCenter] = useState([20.5937, 78.9629]);

  useEffect(() => {
    if (businesses.length > 0) {
      const lat = businesses[0].location.coordinates[1];
      const lng = businesses[0].location.coordinates[0];
      setCenter([lat, lng]);
    }
  }, [businesses]);

  useEffect(() => {
    let mounted = true;

    const loadMap = async () => {
      const module = await import(
        "../home/MapSectionClient.jsx"
      );

      if (mounted) {
        setMapComponent(() => module.default);
      }
    };

    loadMap();

    return () => {
      mounted = false;
    };
  }, []);

  if (!MapComponent) {
    return (
      <div
        className="w-full"
        style={{ height: "400px" }}
      />
    );
  }

  return (
    <MapComponent
      businesses={businesses}
      center={center}
    />
  );
};

export default MapSection;