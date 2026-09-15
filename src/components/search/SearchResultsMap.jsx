import {
  MapContainer,
  TileLayer,
  Marker,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const SearchResultsMap = ({
  businesses,
  mapCenter,
  filters,
  onBusinessSelect,
}) => {
  return (
    <div className="h-[75vh] mt-4 rounded-xl overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={
          Number.isFinite(Number(filters.lat)) &&
          Number.isFinite(Number(filters.lng))
            ? 14
            : 5
        }
        key={`${mapCenter[0]}-${mapCenter[1]}`}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {businesses.map((business) => {
          const lat = Number(
            business.location?.coordinates?.[1]
          );

          const lng = Number(
            business.location?.coordinates?.[0]
          );

          if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lng)
          ) {
            return null;
          }

          return (
            <Marker
              key={business._id}
              position={[lat, lng]}
              icon={markerIcon}
              eventHandlers={{
                click: () => {
                  onBusinessSelect?.(business);
                },
              }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default SearchResultsMap;