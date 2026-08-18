// frontend/src/components/business/BusinessForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";

import API from "../../api/axios";

import { buildCategoryTree } from "../../utils/adminUtils";
import { normalizeAddress } from "../../utils/addressHelper";

import FormSection from "./FormSection";
import FormField from "./FormField";

import {
  BUSINESS_NAME_MAX,
  DESCRIPTION_MAX,
  defaultBusinessForm,
  defaultBusinessHours,
  validateBusinessForm,
} from "./businessFormSchema";

import BusinessFeatureFields from "./BusinessFeatureFields";
import BusinessLocationPicker from "./BusinessLocationPicker";
import BusinessHoursManager from "../BusinessHoursManager";
import BusinessServiceFields from "./service/BusinessServiceFields";
import { FOOD_TYPE_OPTIONS } from '../../utils/business/serviceConfig';
import {
  isRestaurantCategory,
  getSuggestedServices,
} from '../../utils/business/serviceHelpers';

import {
  COUNTRY_CODE_OPTIONS,
  DEFAULT_COUNTRY_CODE,
} from '../../constants/countryCodes';

/* ================= CATEGORY FLATTEN ================= */

const flattenCategories = (
  tree = [],
  parent = null
) => {
  let result = [];

  tree.forEach((cat) => {
    const children = cat.subcategories || [];

    if (children.length === 0) {
      result.push({
        value: cat._id,
        label: cat.name,

        parentName: parent?.name || "",
        parentSlug: parent?.slug || "",
      });
    }

    if (children.length > 0) {
      result = result.concat(
        flattenCategories(children, {
          name: cat.name,
          slug: cat.slug,
        })
      );
    }
  });

  return result;
};


/* ================= SELECT STYLE ================= */

const styles = {
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    borderRadius: "12px",
    borderColor: state.isFocused
      ? "#6366f1"
      : "#d1d5db",

    boxShadow: "none",

    "&:hover": {
      borderColor: "#6366f1",
    },
  }),
};


/* ================= COMPONENT ================= */

const EMPTY_OBJECT = {};

const BusinessForm = ({
  value,
  initialData,
  onChange,
  onSubmit,
  children,
  mode = "provider",
}) => {
  const safeValue = value || EMPTY_OBJECT;
  const safeInitialData = initialData || EMPTY_OBJECT;

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const [errors, setErrors] = useState({});

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState(() => ({
  ...defaultBusinessForm,
  ...safeInitialData,
}));

const selectedCategoryName =
form.categoryName ||
  categories.find(
    (c) => c.value === String(form.categoryId)
  )?.label ||
  "";


  const isRestaurant = isRestaurantCategory({
    categoryName: form.categoryName,
    parentName: form.categoryParentName,
    parentSlug: form.categoryParentSlug,
  });

const suggestedServices = getSuggestedServices({
  categoryName: form.categoryName,
  parentName: form.categoryParentName,
  parentSlug: form.categoryParentSlug,
});

// ================= APPOINTMENT BOOKING =================
const [appointmentBooking, setAppointmentBooking] = useState({
  enabled: false,
  consultationModes: [],
  slotDuration: 30,
  advanceBookingDays: 7,
  sameDayBooking: true,
  bufferBetweenAppointments: 0,
  contactNumber: "",
  notes: "",
});

const [restaurantBooking, setRestaurantBooking] = useState({
  enabled: false,
  totalTables: "",
  seatingCapacity: "",
  advanceBookingDays: "",
});

const [locationManuallyAdjusted, setLocationManuallyAdjusted] =
  useState(false);

  /* ================= FETCH ================= */

useEffect(() => {
  const init = async () => {
    try {
      const [catRes, cityRes] = await Promise.all([
  API.get("/categories"),
  API.get("/cities"),
]);
console.log("CITY RESPONSE:", cityRes.data);

      // ✅ FIX CATEGORY RESPONSE
      const rawCategories =
        catRes?.data?.data || [];

      const tree =
        buildCategoryTree(rawCategories);

      setCategories(flattenCategories(tree));


      // ✅ FIX CITY RESPONSE
      const cityRaw = cityRes.data?.data || [];

      const normalizedCities = cityRaw.map(
        (c) => ({
          value: c._id,

          label: `${c.name} (${c.state})`,

          district: c.district || "",
          state: c.state || "",

          country: c.country || "India",
          countryCode: c.countryCode || "IN",

          latitude: Number(c.latitude),
          longitude: Number(c.longitude),
        })
      );

      setCities(normalizedCities);

    } catch (err) {
      console.error(err);
    }
  };

  init();
}, []);

/* ================= INITIAL DATA / EDIT ================= */

useEffect(() => {
  // ADD MODE
  // AdminAddBusiness me value nahi hoti,
  // isliye yahan form ko dobara set nahi karna hai.
  if (!safeValue?._id) {
    return;
  }

  console.log("EDIT BUSINESS VALUE:", safeValue);

  const updatedForm = {
    ...defaultBusinessForm,

    ...safeValue,

    address: normalizeAddress(
      safeValue.address
    ),

    country:
      safeValue.country || "India",

    countryCode:
      safeValue.countryCode || "IN",

    services:
      Array.isArray(safeValue.services)
        ? safeValue.services.map((service) => ({
            name: service.name || "",
            description:
              service.description || "",
          }))
        : [],

    // ================= CATEGORY FEATURES =================

categoryFeatures:
  Array.isArray(safeValue.categoryFeatures)
    ? safeValue.categoryFeatures
    : Array.isArray(
        safeValue.categoryId?.features
      )
      ? safeValue.categoryId.features
      : [],

    // ================= FEATURE DATA =================
    pricing: Array.isArray(safeValue.pricing)
    ? safeValue.pricing
    : [],
    
    catalog: Array.isArray(safeValue.catalog)
    ? safeValue.catalog
    : [],
    
    menu: Array.isArray(safeValue.menu)
    ? safeValue.menu
    : [],

    faq: Array.isArray(safeValue.faq)
    ? safeValue.faq
    : [],
    
    offers: Array.isArray(safeValue.offers)
    ? safeValue.offers
    : [],

    serviceTypes:
      Array.isArray(safeValue.serviceTypes)
        ? safeValue.serviceTypes
        : [],

    serviceCoverage:
      safeValue.serviceCoverage || {
        type: "city",
        mode: "selected",
        cities: [],
        states: [],
        countries: [],
      },

    businessHours:
      safeValue.businessHours &&
      Object.keys(safeValue.businessHours).length > 0
        ? safeValue.businessHours
        : defaultBusinessHours,
  };

  setForm(updatedForm);

onChange?.(updatedForm);

setAppointmentBooking(
  safeValue.appointmentBooking || {
    enabled: false,
    consultationModes: [],
    slotDuration: 30,
    advanceBookingDays: 7,
    sameDayBooking: true,
    bufferBetweenAppointments: 0,
    contactNumber: "",
    notes: "",
  }
);

setRestaurantBooking(
  safeValue.restaurantBooking || {
    enabled: false,
    totalTables: "",
    seatingCapacity: "",
    advanceBookingDays: "",
  }
);

}, [safeValue?._id]);

  /* ================= HELPERS ================= */

const updateForm = (updates) => {
  setForm((prev) => {
    const next = {
      ...prev,
      ...updates,
    };

    onChange?.(next);

    return next;
  });
};


/* ================= BUSINESS COORDINATES ================= */

const generateBusinessCoordinates = async ({
  cityName = form.cityName,
  district = form.district,
  state = form.state,
  pincode = form.pincode,
  address = form.address,
} = {}) => {

  let coordinates = null;

  try {

    const response = await API.post(
      "/geocode",
      {
        address: [
          address?.street,
          address?.area,
          address?.landmark,
        ]
          .filter(Boolean)
          .join(", "),

        city: cityName,
        district,
        state,
        pincode,
      }
    );

    const geocodedCoordinates =
      response.data?.location?.coordinates;

    if (
      Array.isArray(geocodedCoordinates) &&
      geocodedCoordinates.length === 2 &&
      geocodedCoordinates.every(
        (value) => Number.isFinite(Number(value))
      )
    ) {
      coordinates = geocodedCoordinates;

      console.log(
        "✅ BUSINESS GEO:",
        coordinates
      );
    }

    console.log("📍 GEOCODE REQUEST:", {
  address,
  city: cityName,
  district,
  state,
  pincode,
});

  } catch (err) {

    console.error(
      "❌ Geocode failed:",
      err.message
    );

  }

  return coordinates;
};


const updateMapFromAddress = async () => {

  if (!form.cityName) {
    return;
  }

  setLocating(true);

  try {

    const coordinates =
      await generateBusinessCoordinates({
        cityName: form.cityName,
        district: form.district,
        state: form.state,
        pincode: form.pincode,
        address: form.address,
      });

    if (
      Array.isArray(coordinates) &&
      coordinates.length === 2 &&
      coordinates.every(
        (value) =>
          Number.isFinite(Number(value))
      )
    ) {

      setLocationManuallyAdjusted(false);

      updateForm({
        location: {
          type: "Point",
          coordinates,
        },
      });

      setErrors((prev) => ({
        ...prev,
        location: "",
      }));

      console.log(
        "📍 ADDRESS LOCATION UPDATED:",
        coordinates
      );

    } else {

      setErrors((prev) => ({
        ...prev,
        location:
          "We couldn't determine the exact location from the address. Please adjust the marker on the map or use GPS.",
      }));

    }

  } finally {

    setLocating(false);

  }
};

/* ================= FIND CURRENT LOCATION ================= */

const findCurrentLocation = () => {

  if (!navigator.geolocation) {
    setErrors((prev) => ({
      ...prev,
      location:
        "Geolocation is not supported by this browser.",
    }));

    return;
  }

  setLocating(true);

  navigator.geolocation.getCurrentPosition(

    (position) => {

      const lat =
        Number(position.coords.latitude);

      const lng =
        Number(position.coords.longitude);

      const accuracy =
        Number(position.coords.accuracy);

      console.log(
        "📍 CURRENT GPS LOCATION:",
        {
          latitude: lat,
          longitude: lng,
          accuracy,
        }
      );

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {

        setErrors((prev) => ({
          ...prev,
          location:
            "Unable to determine your current location.",
        }));

        setLocating(false);

        return;
      }

      /*
      ==========================================
      GPS LOCATION FOUND

      GPS accuracy may be 100m, 400m, 1000m etc.
      Do NOT reject it here.

      User can adjust the exact business
      location using the map marker.
      ==========================================
      */

      setLocationManuallyAdjusted(true);

      updateForm({
        location: {
          type: "Point",
          coordinates: [
            lng,
            lat,
          ],
        },
      });

      /*
      ==========================================
      CLEAR OLD LOCATION ERROR
      ==========================================
      */

      setErrors((prev) => ({
        ...prev,
        location: "",
      }));

      setLocating(false);

    },

    (error) => {

      console.error(
        "❌ GPS LOCATION ERROR:",
        error
      );

      let message =
        "Unable to get your current location.";

      if (error.code === 1) {

        message =
          "Location permission denied. Please allow location access.";

      } else if (error.code === 2) {

        message =
          "Current location is unavailable. Please try again.";

      } else if (error.code === 3) {

        message =
          "Location request timed out. Please try again.";

      }

      setErrors((prev) => ({
        ...prev,
        location: message,
      }));

      setLocating(false);
    },

    {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0,
    }

  );
};

/* ================= INPUT ================= */

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  // Address/pincode change means previous manual
  // map location may no longer be valid
  if (
    name === "pincode"
  ) {
    setLocationManuallyAdjusted(false);
  }

  let nextValue;

  if (type === "checkbox") {
    nextValue = checked;

  } else if (
  [
    "phone",
    "whatsapp",
    "alternatePhone",
    "landline",
  ].includes(name)
) {
  // allow international numbers
  nextValue = value.replace(/\D/g, "").slice(0, 15);


  } else if (name === "pincode") {
    nextValue = value.replace(/\D/g, "").slice(0, 6);

  } else {
    nextValue = value;
  }

  const updated = {
    ...form,
    [name]: nextValue,
  };

  if (name === "phone" && form.whatsapp === form.phone) {
    updated.whatsapp = nextValue;
  }

  updateForm(updated);
};


  /* ================= SELECT ================= */
const handleSelect = async (field, selected) => {

  if (!selected) return;


  /* ================= CATEGORY ================= */

  if (field === "categoryId") {
  try {
    const res = await API.get(
      `/categories/${selected.value}`
    );

    const category =
      res.data?.data || res.data || {};

    updateForm({
      ...form,

      categoryId: selected.value,

      categoryName:
        category.name || selected.label,

      categoryParentName:
        category.parentCategory?.name ||
        selected.parentName ||
        "",

      categoryParentSlug:
        category.parentCategory?.slug ||
        selected.parentSlug ||
        "",

      // ⭐ IMPORTANT:
      // Category ke features yahin se BusinessForm me aayenge
      categoryFeatures: Array.isArray(category.features)
        ? category.features
        : [],
    });

  } catch (err) {
    console.error(
      "Category feature load error:",
      err
    );

    // API fail hone par bhi existing category
    // selection break nahi honi chahiye.
    updateForm({
      ...form,

      categoryId: selected.value,

      categoryName:
        selected.label || "",

      categoryParentName:
        selected.parentName || "",

      categoryParentSlug:
        selected.parentSlug || "",

      categoryFeatures: [],
    });
  }

  return;
}


  /* ================= CITY ================= */

    if (field === "cityId") {

  setLocationManuallyAdjusted(false);

  const cityName =
    selected.label.split(" (")[0];

  const cityCoordinates = [
    Number(selected.longitude),
    Number(selected.latitude),
  ];

  updateForm({
    ...form,

    cityId: selected.value,

    cityName,

    district: selected.district || "",

    state: selected.state || "",

    country: selected.country || "India",

    countryCode: selected.countryCode || "IN",

    location: {
      type: "Point",
      coordinates: cityCoordinates,
    },
  });

  return;
}
};

  /* ================= SEO PREVIEW ================= */

  const slugify = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const seoPreview = useMemo(() => {
  const city =
    cities.find(
      (c) => c.value === form.cityId
    )?.label || "city";

  const category =
    categories.find(
      (c) => c.value === form.categoryId
    )?.label || "category";

  const businessSlug =
    slugify(form.name) || "business-name";

  return `servdial.com/${slugify(city)}/${slugify(category)}/${businessSlug}`;

}, [
  form.name,
  form.cityId,
  form.categoryId,
  cities,
  categories,
]);

  /* ================= SUBMIT ================= */

const handleSubmit = async (e) => {

  console.log("🔥 HANDLE SUBMIT START");

  e.preventDefault();

  const validationErrors = validateBusinessForm(form);

  console.log(
    "VALIDATION ERRORS:",
    validationErrors
  );

  setErrors(validationErrors);

  if (Object.keys(validationErrors).length) {
    console.log("❌ VALIDATION FAILED");
    return;
  }

  try {

    setLoading(true);

    /* ================= GENERATE EXACT BUSINESS COORDINATES ================= */

let coordinates = form.location?.coordinates || [];

if (!locationManuallyAdjusted) {

  coordinates =
    await generateBusinessCoordinates({
      cityName: form.cityName,
      district: form.district,
      state: form.state,
      pincode: form.pincode,
      address: form.address,
    });

  /*
  ==========================================
  IMPORTANT
  Geocoded coordinates ko FORM STATE mein
  bhi save karo.
  ==========================================
  */

  if (
    Array.isArray(coordinates) &&
    coordinates.length === 2
  ) {

    updateForm({
      location: {
        type: "Point",
        coordinates,
      },
    });

  }
}

if (
  !Array.isArray(coordinates) ||
  coordinates.length !== 2 ||
  coordinates.some(
    (value) => !Number.isFinite(Number(value))
  )
) {
  setErrors({
    ...validationErrors,
    location:
      "Unable to determine exact business location. Please adjust the location on the map.",
  });

  console.error(
    "❌ INVALID BUSINESS COORDINATES:",
    coordinates
  );

  return;
}

    /* ================= FINAL PAYLOAD ================= */

    const payload = {

      ...form,

      // ================= FEATURE DATA =================
      pricing: form.pricing || [],
      catalog: form.catalog || [],
      menu: form.menu || [],
      faq: form.faq || [],
      offers: form.offers || [],

      appointmentBooking: appointmentBooking || {},
      restaurantBooking: restaurantBooking || {},
      roomBooking: form.roomBooking || {},
      partyBooking: form.partyBooking || {},

      address: normalizeAddress(
        form.address
      ),

      
      location: {
        type: "Point",
        coordinates,
      },

      serviceCoverage: {

        ...form.serviceCoverage,

        mode:
          form.serviceCoverage?.mode ||
          "selected",

      },

    };


    console.log(
      "📦 FINAL SERVICES:",
      payload.services
    );

    console.log(
      "📍 FINAL LOCATION:",
      payload.location
    );

    console.log(
      "🚀 FINAL PAYLOAD:",
      payload
    );


    /* ================= SUBMIT ================= */

    await onSubmit(payload);

  } catch (err) {

    console.error(
      "❌ SUBMIT ERROR:",
      err
    );

  } finally {

    setLoading(false);

  }

};

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl mx-auto">

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* BUSINESS INFO */}

        <FormSection
          title="Business Information"
          subtitle="Primary business details"
        >

          <FormField
            label="Business Name"
            required
            error={errors.name}
          >

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              maxLength={BUSINESS_NAME_MAX}
              placeholder="Enter business name"
              className="border rounded-xl p-3 w-full"
            />

            <div className="text-xs text-gray-400 mt-1">
              {form.name.length}/
              {BUSINESS_NAME_MAX}
            </div>

          </FormField>

          <FormField
            label="Primary Category"
            required
            error={errors.categoryId}
          >

            <Select
              options={categories}
              value={
                categories.find(
                  (c) =>
                    c.value === form.categoryId
                ) || null
              }
              onChange={(v) =>
                handleSelect(
                  "categoryId",
                  v
                )
              }
              placeholder="Select Primary Category"
              styles={styles}
            />

          </FormField>

        </FormSection>

{/* ================= BUSINESS SERVICES ================= */}

<BusinessServiceFields
  serviceCoverage={form.serviceCoverage}
  serviceTypes={form.serviceTypes || []}
  services={form.services || []}

  cities={cities}

  country={form.country}
  countryCode={form.countryCode}

  suggestedServices={suggestedServices}

  onServiceCoverageChange={(serviceCoverage) =>
    updateForm({
      ...form,
      serviceCoverage,
    })
  }

  onServiceTypesChange={(serviceTypes) =>
    updateForm({
      ...form,
      serviceTypes,
    })
  }

  onServicesChange={(services) =>
    updateForm({
      ...form,
      services,
    })
  }
/>

{/* ================= FOOD TYPE ================= */}

{isRestaurant && (
  <div className="mt-6">

    <h3 className="font-semibold mb-3">
      Food Type
    </h3>

    <div className="flex flex-wrap gap-3">

      {FOOD_TYPE_OPTIONS.map((option) => {

        const selected =
          form.foodType === option.value;

        return (
          <button
            type="button"
            key={option.value}
            onClick={() =>
              updateForm({
                ...form,
                foodType: option.value,
              })
            }
            className={`
              flex items-center gap-2
              px-4 py-2 rounded-full border
              transition
              ${
                selected
                  ? "border-gray-900 bg-gray-50 shadow-sm"
                  : "border-gray-200 hover:border-gray-400"
              }
            `}
          >

            <span
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: option.color,
              }}
            />

            <span className="text-sm font-medium">
              {option.label}
            </span>

          </button>
        );

      })}

    </div>

  </div>
)}

<BusinessFeatureFields

features={
  form.categoryFeatures || []
}

form={form}

setForm={setForm}

pricing={
  form.pricing || []
}

setPricing={(value)=>
 updateForm({
   ...form,
   pricing:value
 })
}


services={
  form.services || []
}

setServices={(value)=>
 updateForm({
   ...form,
   services:value
 })
}


catalog={
  form.catalog || []
}

setCatalog={(value)=>
 updateForm({
   ...form,
   catalog:value
 })
}


menu={
  form.menu || []
}

setMenu={(value)=>
 updateForm({
   ...form,
   menu:value
 })
}

// ================= FAQ =================
faq={
  form.faq || []
}

setFaq={(value)=>
  updateForm({
    ...form,
    faq: value,
  })
}
// ================= OFFERS =================
offers={
  form.offers || []
}
setOffers={(value)=>
  updateForm({
    ...form,
    offers: value,
  })
}
// ================= ROOM BOOKING =================
roomBooking={
  form.roomBooking || null
}

setRoomBooking={(value)=>
  updateForm({
    ...form,
    roomBooking: value,
  })
}

// ================= PARTY BOOKING =================
partyBooking={
  form.partyBooking || null
}

setPartyBooking={(value)=>
  updateForm({
    ...form,
    partyBooking: value,
  })
}

// ================= APPOINTMENT BOOKING =================
appointmentBooking={appointmentBooking}

setAppointmentBooking={(value) => {
  setAppointmentBooking(value);

  updateForm({
    ...form,
    appointmentBooking: value,
  });
}}

hours={
  form.businessHours || {}
}

setHours={(value)=>
 updateForm({
   ...form,
   businessHours:value
 })
}

restaurantBooking={restaurantBooking}

setRestaurantBooking={(value)=>{

  setRestaurantBooking(value);

  updateForm({
    ...form,
    restaurantBooking:value
  });

}}

/>


        {/* LOCATION */}

        <FormSection
          title="Location Information"
          subtitle="Business address and geo data"
        >

        <FormField
  label="Business Location Address"
  required
  error={
 errors.address ||
 errors.area
}
>

<div className="space-y-3">

    <input
  name="street"
  value={form.address?.street || ""}
  onChange={(e) => {
    setLocationManuallyAdjusted(false);

    updateForm({
      ...form,
      address: {
        ...form.address,
        street: e.target.value,
      },
    });
  }}
  
  placeholder="Street / Road (e.g. Mahatma Gandhi Road)"
  className="border rounded-xl p-3 w-full"
/>


<input
  name="area"
  value={form.address?.area || ""}
  onChange={(e) => {

  setLocationManuallyAdjusted(false);

  updateForm({
    ...form,
    address: {
      ...form.address,
      area: e.target.value
    }
  });

}}
  
  placeholder="Area / Locality (e.g. Azad Nagar)"
  className="border rounded-xl p-3 w-full"
/>


<input
  name="landmark"
  value={form.address?.landmark || ""}
  onChange={(e) => {

  setLocationManuallyAdjusted(false);

  updateForm({
    ...form,
    address: {
      ...form.address,
      landmark: e.target.value
    }
  });

}}
  
  placeholder="Landmark (e.g. Near Taj Mahal)"
  className="border rounded-xl p-3 w-full"
/>

</div>

</FormField>

          <FormField
            label="City"
            required
            error={errors.cityId}
          >

            <Select
              options={cities}
              value={
                cities.find(
                  (c) =>
                    String(c.value) === String(form.cityId)
                ) || null
              }
              onChange={(v) =>
                handleSelect(
                  "cityId",
                  v
                )
              }
              placeholder="Select City"
              styles={styles}
            />

          </FormField>

          <div className="grid md:grid-cols-3 gap-4">

            <input
              value={form.district}
              readOnly
              placeholder="District"
              className="bg-gray-100 rounded-xl p-3"
            />

            <input
              value={form.state}
              readOnly
              placeholder="State"
              className="bg-gray-100 rounded-xl p-3"
            />

            <input
              type="text"
              value={form.country || ""}
              readOnly
              placeholder="Country"
              className="bg-gray-100 rounded-xl p-3"
            />

          </div>

          <FormField
            label="Pincode"
            required
            error={errors.pincode}
          >

            <input
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              
              placeholder="Enter pincode"
              className="border rounded-xl p-3 w-full"
            />

          </FormField>

        {form.cityId && (
  <FormField
    label="Exact Business Location"
    error={errors.location}
  >

    {/* =================================================
        LOCATION ACTIONS
    ================================================= */}

    <div className="flex flex-wrap items-center gap-3 mb-4">

      <button
        type="button"
        onClick={findCurrentLocation}
        disabled={locating}
        className="
          inline-flex
          items-center
          gap-2
          px-4
          py-2.5
          rounded-xl
          border
          border-indigo-200
          bg-indigo-50
          text-indigo-700
          font-medium
          hover:bg-indigo-100
          transition
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >

        <span className="text-lg">
          📍
        </span>

        {locating
          ? "Finding Location..."
          : "Use My Current Location"}

      </button>

      <button
        type="button"
        onClick={updateMapFromAddress}
        disabled={locating}
        className="
          inline-flex
          items-center
          gap-2
          px-4
          py-2.5
          rounded-xl
          border
          border-gray-200
          bg-white
          text-gray-700
          font-medium
          hover:bg-gray-50
          transition
          disabled:opacity-50
        "
      >

        <span>
          🧭
        </span>

        Find from Address

      </button>

    </div>

    <p className="text-xs text-gray-500 mb-4">
      Address se location automatically find karein,
      ya GPS se current location use karein.
      Map par marker drag karke exact business location
      bhi set kar sakte hain.
    </p>


    {/* =================================================
        MAP
    ================================================= */}

    <BusinessLocationPicker

      value={
        form.location?.coordinates || []
      }

      onChange={(coordinates) => {

        setLocationManuallyAdjusted(true);

        updateForm({
          location: {
            type: "Point",
            coordinates,
          },
        });

        setErrors((prev) => ({
          ...prev,
          location: "",
        }));

      }}

    />

  </FormField>
)}

        </FormSection>

        {/* CONTACT */}

        <FormSection
          title="Contact Information"
          subtitle="Customer contact details"
        >

          <FormField
  label="Phone Number"
  required
  error={errors.phone}
>
  <div className="flex gap-3">

    <div className="w-44 shrink-0">
      <Select
        options={COUNTRY_CODE_OPTIONS}
        value={
          COUNTRY_CODE_OPTIONS.find(
            (option) =>
              option.value ===
              (form.phoneCountryCode || DEFAULT_COUNTRY_CODE)
          )
        }
        onChange={(selected) =>
          updateForm({
            ...form,
            phoneCountryCode: selected?.value || DEFAULT_COUNTRY_CODE,
          })
        }
        isSearchable
        placeholder="Code"
        styles={styles}
      />
    </div>

    <input
      name="phone"
      value={form.phone || ""}
      onChange={handleChange}
      inputMode="numeric"
      placeholder="Mobile number"
      className="border rounded-xl p-3 flex-1"
    />

  </div>
</FormField>

          <FormField label="WhatsApp Number">
  <div className="flex gap-3">

    <div className="w-44 shrink-0">
      <Select
        options={COUNTRY_CODE_OPTIONS}
        value={
          COUNTRY_CODE_OPTIONS.find(
            (option) =>
              option.value ===
              (form.whatsappCountryCode || DEFAULT_COUNTRY_CODE)
          )
        }
        onChange={(selected) =>
          updateForm({
            ...form,
            whatsappCountryCode: selected?.value || DEFAULT_COUNTRY_CODE,
          })
        }
        isSearchable
        placeholder="Code"
        styles={styles}
      />
    </div>

    <input
      name="whatsapp"
      value={form.whatsapp || ""}
      onChange={handleChange}
      inputMode="numeric"
      placeholder="WhatsApp number"
      className="border rounded-xl p-3 flex-1"
    />

  </div>
</FormField>

        {/* ================= ALTERNATE MOBILE ================= */}

<FormField label="Alternate Mobile Number (Optional)">
  <div className="flex gap-3">

    <div className="w-44 shrink-0">
      <Select
        options={COUNTRY_CODE_OPTIONS}
        value={
          COUNTRY_CODE_OPTIONS.find(
            (option) =>
              option.value ===
              (form.alternatePhoneCountryCode || DEFAULT_COUNTRY_CODE)
          )
        }
        onChange={(selected) =>
          updateForm({
            ...form,
            alternatePhoneCountryCode:
              selected?.value || DEFAULT_COUNTRY_CODE,
          })
        }
        isSearchable
        placeholder="Code"
        styles={styles}
      />
    </div>

    <input
      name="alternatePhone"
      value={form.alternatePhone || ""}
      onChange={handleChange}
      inputMode="numeric"
      placeholder="Alternate mobile number"
      className="border rounded-xl p-3 flex-1"
    />

  </div>
</FormField>

{/* ================= LANDLINE ================= */}

<FormField label="Landline Number (Optional)">
  <div className="flex gap-3">

    <div className="w-44 shrink-0">
      <Select
        options={COUNTRY_CODE_OPTIONS}
        value={
          COUNTRY_CODE_OPTIONS.find(
            (option) =>
              option.value ===
              (form.landlineCountryCode || DEFAULT_COUNTRY_CODE)
          )
        }
        onChange={(selected) =>
          updateForm({
            ...form,
            landlineCountryCode:
              selected?.value || DEFAULT_COUNTRY_CODE,
          })
        }
        isSearchable
        placeholder="Code"
        styles={styles}
      />
    </div>

    <input
      name="landline"
      value={form.landline || ""}
      onChange={handleChange}
      inputMode="numeric"
      placeholder="STD / Landline number"
      className="border rounded-xl p-3 flex-1"
    />

  </div>
</FormField>

          <FormField
            label="Website"
            error={errors.website}
          >

            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="border rounded-xl p-3 w-full"
            />

          </FormField>

        </FormSection>

        {/* ================= BUSINESS HOURS ================= */}

          <BusinessHoursManager
            value={
              form.businessHours ||
              defaultBusinessHours
            }
            onChange={(businessHours) =>
              updateForm({
                ...form,
                businessHours,
              })
            }
          />


        {/* DESCRIPTION */}

        <FormSection
          title="Description"
          subtitle="Business overview"
        >

          <FormField
            label="Business Description"
            error={errors.description}
          >

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              maxLength={DESCRIPTION_MAX}
              placeholder="Describe your business"
              className="border rounded-xl p-3 w-full"
            />

            <div className="text-xs text-gray-400 mt-1">
              {form.description.length}/
              {DESCRIPTION_MAX}
            </div>

          </FormField>
          </FormSection>

        {/* SEO */}

        <FormSection
          title="SEO Preview"
          subtitle="Generated business URL"
        >

          <div className="bg-gray-100 rounded-xl p-3 text-sm break-all">
            {seoPreview}
          </div>

        </FormSection>

        {/* PROVIDER */}

        {mode === "provider" && (
          <FormSection
            title="Promotion"
            subtitle="Boost business visibility"
          >

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                name="boost"
                checked={form.boost}
                onChange={handleChange}
              />

              <span>
                Boost this business listing
              </span>

            </label>

          </FormSection>
        )}

        
{/* Extra Admin Components */}
{children}
        {/* SUBMIT */}

        <div className="sticky bottom-0 bg-white border-t p-4 rounded-t-2xl">

          <button
          type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-3 font-medium"
          >
            {loading
              ? "Saving..."
              : "Submit Business"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default BusinessForm;