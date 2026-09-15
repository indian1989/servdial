import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const MapSectionClient = ({
  businesses,
  center,
}) => {
  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: "400px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {businesses.map((b) => (
        <Marker
          key={b._id}
          position={[
            b.location.coordinates[1],
            b.location.coordinates[0],
          ]}
        >
          <Popup>
            <div className="font-semibold">
              {b.name}
            </div>

            <div>{b.category}</div>

            <div>{b.city?.name}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapSectionClient;