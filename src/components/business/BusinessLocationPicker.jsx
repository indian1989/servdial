// src/components/business/BusinessLocationPicker.jsx

import { useEffect, useState } from "react";

/* =========================================================
   DEFAULT FALLBACK
   Patna fallback — only used when no coordinates exist
========================================================= */

const DEFAULT_COORDINATES = {
  lat: 25.6905702,
  lng: 85.2090351,
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
     CLIENT-ONLY MAP
  ======================================================= */

  const [MapComponent, setMapComponent] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadMap = async () => {
      const module = await import(
        "./BusinessLocationPickerClient.jsx"
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
    <div
      id="location"
      className="space-y-3"
    >

      {MapComponent ? (
  <MapComponent
    position={position}
    handleMapClick={handleMapClick}
    handleDragEnd={handleDragEnd}
  />
) : (
  <div
    className="w-full rounded-2xl overflow-hidden border"
    style={{ height: "320px" }}
  />
)}

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