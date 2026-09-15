// src/components/business/BusinessLocationPickerClient.jsx

import { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* =========================================================
   FIX LEAFLET DEFAULT MARKER ICON
========================================================= */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* =========================================================
   MAP VIEW CONTROLLER
========================================================= */

const MapViewController = ({ coordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (
      !Array.isArray(coordinates) ||
      coordinates.length !== 2
    ) {
      return;
    }

    const lng = Number(coordinates[0]);
    const lat = Number(coordinates[1]);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return;
    }

    const current = map.getCenter();

    const distance =
      Math.abs(current.lat - lat) +
      Math.abs(current.lng - lng);

    if (distance > 0.000001) {
      map.flyTo(
        [lat, lng],
        17,
        {
          animate: true,
          duration: 0.8,
        }
      );
    }
  }, [coordinates, map]);

  return null;
};

/* =========================================================
   MAP CLICK HANDLER
========================================================= */

const MapClickHandler = ({ onLocationChange }) => {
  useMapEvents({
    click(event) {
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;

      onLocationChange([lng, lat]);
    },
  });

  return null;
};

/* =========================================================
   COMPONENT
========================================================= */

const BusinessLocationPickerClient = ({
  position,
  handleMapClick,
  handleDragEnd,
}) => {
  return (
    <div className="rounded-2xl overflow-hidden border">

      <MapContainer
        center={[
          position.lat,
          position.lng,
        ]}
        zoom={17}
        style={{
          height: "320px",
          width: "100%",
        }}
      >

        <MapViewController
          coordinates={[
            position.lng,
            position.lat,
          ]}
        />

        <MapClickHandler
          onLocationChange={
            handleMapClick
          }
        />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[
            position.lat,
            position.lng,
          ]}
          draggable={true}
          eventHandlers={{
            dragend: handleDragEnd,
          }}
        />

      </MapContainer>

    </div>
  );
};

export default BusinessLocationPickerClient;