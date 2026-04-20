import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import L from "leaflet";

const MapSection = ({ businesses }) => {
  const [center, setCenter] = useState([20.5937, 78.9629]);

  useEffect(() => {
    if (businesses.length > 0) {
      const lat = businesses[0].location.coordinates[1];
      const lng = businesses[0].location.coordinates[0];
      setCenter([lat, lng]);
    }
  }, [businesses]);

  return (
    <MapContainer center={center} zoom={5} style={{ height: "400px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {businesses.map((b) => (
        <Marker
          key={b._id}
          position={[b.location.coordinates[1], b.location.coordinates[0]]}
        >
          <Popup>
            <div className="font-semibold">{b.name}</div>
            <div>{b.category}</div>
            <div>{b.city?.name}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapSection;