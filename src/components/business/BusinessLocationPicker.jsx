// src/components/business/BusinessLocationPicker.jsx

import { useEffect, useState } from "react";
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
   DEFAULT FALLBACK
   Patna fallback — only used when no coordinates exist
========================================================= */

const DEFAULT_COORDINATES = {
  lat: 25.6905702,
  lng: 85.2090351,
};

/* =========================================================
   MAP VIEW CONTROLLER
========================================================= */

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

    /*
    ==========================================
    IMPORTANT

    Agar location genuinely change hui hai,
    map ko new coordinates par move karo.
    ==========================================
    */

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

const BusinessLocationPicker = ({
  value,
  onChange,
}) => {

  /* =======================================================
     NORMALIZE VALUE
  ======================================================= */

  const getValidCoordinates = (coordinates) => {
    if (
      !Array.isArray(coordinates) ||
      coordinates.length !== 2
    ) {
      return [
        DEFAULT_COORDINATES.lng,
        DEFAULT_COORDINATES.lat,
      ];
    }

    const lng = Number(coordinates[0]);
    const lat = Number(coordinates[1]);

    if (
      !Number.isFinite(lng) ||
      !Number.isFinite(lat)
    ) {
      return [
        DEFAULT_COORDINATES.lng,
        DEFAULT_COORDINATES.lat,
      ];
    }

    return [lng, lat];
  };

  /* =======================================================
     INITIAL POSITION
  ======================================================= */

  const initialCoordinates =
    getValidCoordinates(value);

  const [position, setPosition] = useState({
    lat: initialCoordinates[1],
    lng: initialCoordinates[0],
  });

  /* =======================================================
     SYNC PARENT → MAP
  ======================================================= */

  useEffect(() => {

    const coordinates =
      getValidCoordinates(value);

    const lng = coordinates[0];
    const lat = coordinates[1];

    setPosition({
      lat,
      lng,
    });

  }, [value]);

  /* =======================================================
     LOCATION UPDATE
  ======================================================= */

  const updateLocation = (lng, lat) => {

  if (
    !Number.isFinite(Number(lng)) ||
    !Number.isFinite(Number(lat))
  ) {
    return;
  }

  const nextLng = Number(lng);
  const nextLat = Number(lat);

  console.log("📍 MAP LOCATION UPDATED:", {
    latitude: nextLat,
    longitude: nextLng,
    coordinates: [nextLng, nextLat],
  });

  setPosition({
    lat: nextLat,
    lng: nextLng,
  });

  onChange?.([
    nextLng,
    nextLat,
  ]);
};

  /* =======================================================
     MARKER DRAG
  ======================================================= */

  const handleDragEnd = (event) => {

    const marker =
      event.target;

    const latlng =
      marker.getLatLng();

    updateLocation(
      latlng.lng,
      latlng.lat
    );
  };

  /* =======================================================
     MAP CLICK
  ======================================================= */

  const handleMapClick = (coordinates) => {

    const lng = coordinates[0];
    const lat = coordinates[1];

    updateLocation(
      lng,
      lat
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-3">

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

      {/* ===================================================
          COORDINATES
      =================================================== */}

      <div className="grid md:grid-cols-2 gap-3">

        {/* LATITUDE */}

        <div>

          <label className="text-sm font-medium text-gray-600">
            Latitude
          </label>

          <input
            type="number"
            step="any"
            value={position.lat}
            onChange={(e) => {

              const lat =
                Number(e.target.value);

              if (
                !Number.isFinite(lat)
              ) {
                return;
              }

              updateLocation(
                position.lng,
                lat
              );
            }}
            className="border rounded-xl p-3 w-full mt-1"
          />

        </div>

        {/* LONGITUDE */}

        <div>

          <label className="text-sm font-medium text-gray-600">
            Longitude
          </label>

          <input
            type="number"
            step="any"
            value={position.lng}
            onChange={(e) => {

              const lng =
                Number(e.target.value);

              if (
                !Number.isFinite(lng)
              ) {
                return;
              }

              updateLocation(
                lng,
                position.lat
              );
            }}
            className="border rounded-xl p-3 w-full mt-1"
          />

        </div>

      </div>

      <p className="text-xs text-gray-500">
        Marker ko drag karke ya map par click karke
        exact business location set karein.
      </p>

    </div>
  );
};

export default BusinessLocationPicker;