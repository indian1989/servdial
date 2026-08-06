import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";

import API from "../../api/axios";

import { buildCategoryTree } from "../../utils/adminUtils";

import FormSection from "./FormSection";
import FormField from "./FormField";

import {
  BUSINESS_NAME_MAX,
  DESCRIPTION_MAX,
  defaultBusinessForm,
  validateBusinessForm,
} from "./businessFormSchema";

import BusinessFeatureFields from "./BusinessFeatureFields";
import BusinessLocationPicker from "./BusinessLocationPicker";
import CreatableSelect from "react-select/creatable";

/* ================= SERVICE TYPE OPTIONS ================= */

const serviceTypeOptions = [
  {
    value: "home",
    label: "Home Service",
  },
  {
    value: "shop",
    label: "Shop / In-store",
  },
  {
    value: "online",
    label: "Online Service",
  },
  {
    value: "onsite",
    label: "On-site Visit",
  },
  {
    value: "pickup",
    label: "Pickup Available",
  },
  {
    value: "delivery",
    label: "Delivery Available",
  },
];

/* ================= FOOD TYPE OPTIONS ================= */ 

const foodTypeOptions = [
  {
    value: "veg",
    label: "Veg",
    color: "#16a34a",
  },
  
  {
    value: "non_veg",
    label: "Non Veg",
    color: "#dc2626",
  },
  {
    value: "both",
    label: "Veg & Non Veg",
    color: "#ea580c",
  },
];

/* ================= SERVICE OFFERED ================= */
const serviceSuggestionsByCategory = {

  electrician: [
    "Electrical Installation",
    "Fan Repair",
    "Wiring Work",
    "MCB Installation",
    "Switch Board Repair",
    "Inverter Installation",
  ],


  plumber: [
    "Leak Repair",
    "Tap Installation",
    "Pipe Fitting",
    "Bathroom Repair",
  ],


  salon: [
    "Hair Cut",
    "Facial",
    "Hair Spa",
    "Hair Coloring",
  ],

  restaurant: [
    "Dine In",
    "Takeaway",
    "Home Delivery",
    "Order Online",
    "Family Dining",
    "Party Orders",
    "Catering Service"
  ],


  default: [
    "Installation",
    "Repair",
    "Maintenance",
    "Consultation",
  ]

};

/* ================= CATEGORY FLATTEN ================= */

const flattenCategories = (
  tree = [],
  parent = ""
) => {
  let result = [];

  tree.forEach((cat) => {
    const children = cat.subcategories || [];

    const label = cat.name;

    // ONLY LEAF SUBCATEGORIES
    if (children.length === 0) {
      result.push({
        value: cat._id,
        label,
      });
    }

    if (children.length > 0) {
      result = result.concat(
        flattenCategories(children, cat.name)
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

const normalizeAddress = (address) => {

  if (!address) {
    return {
      street:"",
      area:"",
      landmark:"",
    };
  }


  if (typeof address === "string") {
    return {
      street: address,
      area:"",
      landmark:"",
    };
  }


  return {
    street: address.street || "",
    area: address.area || "",
    landmark: address.landmark || "",
  };

};


/* ================= COMPONENT ================= */

const BusinessForm = ({
  value = {},
  onChange,
  onSubmit,
  children,
  mode = "provider",
}) => {
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [form, setForm] = useState(defaultBusinessForm);


const selectedCategoryName =
form.categoryName ||
  categories.find(
    (c) => c.value === String(form.categoryId)
  )?.label ||
  "";


const currentCategory =
  selectedCategoryName
    .toLowerCase()
    .replace(/\s+/g, "");

const isRestaurant = [
  "restaurant",
  "cafe",
  "dhaba",
  "food",
  "fastfood",
  "bakery",
].includes(currentCategory);


const suggestedServices =
  serviceSuggestionsByCategory[currentCategory] ||
  (isRestaurant
    ? serviceSuggestionsByCategory.restaurant
    : serviceSuggestionsByCategory.default);


  const [restaurantBooking, setRestaurantBooking] = useState({
  enabled: false,
  totalTables: "",
  seatingCapacity: "",
  advanceBookingDays: "",
});

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

/* ================= INITIAL DATA ================= */
useEffect(() => {

  if (!value || !value._id) return;

console.log("EDIT BUSINESS VALUE:", value);

console.log(
  "EDIT SERVICE COVERAGE:",
  value.serviceCoverage
);

console.log(
  "EDIT SERVICE TYPES:",
  value.serviceTypes
);

console.log(
  "EDIT SERVICES:",
  value.services
);

  const updatedForm = {

    ...defaultBusinessForm,

    ...value,


    address: normalizeAddress(
      value.address
    ),

country:
 value.country || "India",

countryCode:
 value.countryCode || "IN",

    services:
      Array.isArray(value.services)
        ? value.services.map(service => ({
            name: service.name || "",
            description: service.description || "",
          }))
        : [],


    serviceTypes:
 Array.isArray(value.serviceTypes)
 ? value.serviceTypes
 : defaultBusinessForm.serviceTypes || [],


    serviceCoverage:
      value.serviceCoverage || {
        type:"",
        mode:"",
        cities:[],
        states:[],
        countries:[]
      },


    businessHours:
      value.businessHours &&
      Object.keys(value.businessHours).length > 0
        ? value.businessHours
        : defaultBusinessHours,

  };


  setForm(updatedForm);


  setRestaurantBooking(
    value.restaurantBooking || {
      enabled:false,
      totalTables:"",
      seatingCapacity:"",
      advanceBookingDays:""
    }
  );


}, [value, cities]);


useEffect(() => {

}, [form.businessHours]);

  /* ================= HELPERS ================= */

  const updateForm = (updated) => {
  setForm(updated);
  onChange?.(updated);
};

  /* ================= INPUT ================= */

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  let nextValue;

  if (type === "checkbox") {
    nextValue = checked;

  } else if (name === "phone" || name === "whatsapp") {
    nextValue = value.replace(/\D/g, "").slice(0, 10);

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

const generateBusinessCoordinates = async () => {

  let coordinates = [
    form.location?.coordinates?.[0],
    form.location?.coordinates?.[1],
  ];


  try {

    const response = await API.post(
      "/geocode",
      {

        address:[
          form.address?.street,
          form.address?.area,
          form.address?.landmark,
        ]
        .filter(Boolean)
        .join(", "),

        city: form.cityName,

        district: form.district,

        state: form.state,

        pincode: form.pincode,

      }
    );


    if(response.data?.location?.coordinates){

      coordinates =
      response.data.location.coordinates;


      console.log(
        "✅ UPDATED GEO:",
        coordinates
      );

    }


  } catch(err){

    console.log(
      "Geocode failed",
      err.message
    );

  }


  return coordinates;

};

  /* ================= SELECT ================= */

  const handleSelect = async (field, selected) => {

  if (!selected) return;


  if (field === "categoryId") {

    try {

      const res = await API.get(
        `/categories/${selected.value}`
      );


      const category =
        res.data.data || res.data;


      updateForm({

        ...form,

        categoryId: selected.value,

        categoryName: selected.label,

        categoryFeatures:
          category.features || [],

      });


    } catch(err) {

      console.log(
        "Category feature load error",
        err
      );


      updateForm({

        ...form,

        categoryId:selected.value,

        categoryName:selected.label,

        categoryFeatures:[]

      });

    }


    return;
  }



  if (field === "cityId") {


    const cityName =
      selected.label.split(" (")[0];


    let coordinates = [
      selected.longitude,
      selected.latitude
    ];

    try {

      const response = await API.post(
        "/geocode",
        {

          address:[
            form.address?.street,
            form.address?.area,
            form.address?.landmark,
          ]
          .filter(Boolean)
          .join(", "),


          city: cityName,

          district:selected.district,

          state:selected.state,

          pincode:form.pincode,

        }
      );



      if(
        response.data?.location?.coordinates
      ){

        coordinates =
          response.data.location.coordinates;


        console.log(
         "✅ EXACT BUSINESS LOCATION",
          coordinates
        );

      }


    } catch(err){


      console.log(
    "Geocode failed",
    err.message
   );


    }

    updateForm({

      ...form,

      cityId:selected.value,

      cityName,


      district:selected.district,

      state:selected.state,

      country:
        selected.country || "India",


      countryCode:
        selected.countryCode || "IN",


      location:{

        type:"Point",

        coordinates

      }


    });


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

    console.log(
      "❌ VALIDATION FAILED"
    );

    return;
  }


  try {

    setLoading(true);


    const payload = {

      ...form,

      address: normalizeAddress(form.address),


      serviceCoverage: {

        ...form.serviceCoverage,

        mode:
          form.serviceCoverage?.mode ||
          "selected",

      },

    };


    console.log(
      "FINAL SERVICES:",
      payload.services
    );


    console.log(
      "FINAL PAYLOAD:",
      payload
    );


    await onSubmit(payload);


  } catch (err) {

    console.error(
      "SUBMIT ERROR:",
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

{/* SERVICE COVERAGE */}
<div className="mt-6 space-y-4">
  
  <h3 className="font-semibold text-lg">
    Service Coverage
    </h3>

    {/* Coverage Type */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { value: "city", label: "Cities" },
        { value: "state", label: "States" },
        { value: "country", label: "Countries" },
        { value: "global", label: "Worldwide" },
      ].map((option) => (
      
      <label
      key={option.value}
      className="border rounded-xl p-3 flex items-center gap-2 cursor-pointer hover:border-indigo-500"
      >
        <input
        type="radio"
        name="coverageType"
        checked={form.serviceCoverage?.type === option.value}
        onChange={() =>
          updateForm({
            ...form,
            serviceCoverage: {
              ...form.serviceCoverage,
              type: option.value,
            },
            })
            }
            />
            <span className="text-sm font-medium">
              {option.label}
              </span>
              </label>
            ))}
            </div>


            {/* Mode */}
            {form.serviceCoverage?.type !== "global" && (
              <div className="flex items-center gap-3">
                
                <label className="flex items-center gap-2">

                  <input
                  type="radio"
                  checked={form.serviceCoverage?.mode === "selected"}
                  onChange={() =>
                    updateForm({
                      ...form,
                      serviceCoverage: {
                        ...form.serviceCoverage,
                        mode: "selected",
                      },
                    })
                  }
                  />

                  Selected
                  
                   </label>

                   <label className="flex items-center gap-2">
                    
                    <input
                    type="radio"
                    checked={form.serviceCoverage?.mode === "all"}
                    onChange={() =>
                    updateForm({
                      ...form,
                      serviceCoverage: {
                        ...form.serviceCoverage,
                        mode: "all",
                        },
                        })
                        }
                        />

                        All
                        
                        </label>

                        </div>
                        )}
                        
                        
                        {/* Cities */}
              {form.serviceCoverage?.type === "city" && (
                
                <Select
                isMulti
                options={cities}
                value={(form.serviceCoverage?.cities || []).map((c) => ({
                  value: c.cityId,
                  label: `${c.name} (${c.state})`,
                  district: c.district,
                  state: c.state,
                  country: c.country,
                  countryCode: c.countryCode,
                })
              )}
              onChange={(value) =>
                
                updateForm({

                  ...form,
                  
                  serviceCoverage: {
                    ...form.serviceCoverage,
                    cities: (value || []).map((city) => ({
                      cityId: city.value,
                      name: city.label.split(" (")[0],
                      district: city.district,
                      state: city.state,
                      country: city.country,
                      countryCode: city.countryCode,
                    })),
                    },
                  })
                }
                
                placeholder="Select cities"
                
                />
              )}
              
              
              {/* States */}
              
              {form.serviceCoverage?.type === "state" && (
                
                <CreatableSelect
                isMulti
                value={(form.serviceCoverage?.states || []).map((s) => ({
                  value: s.name,
                  label: s.name,
                })
              )}
              
              onChange={(value) =>
                updateForm({

                  ...form,

                  serviceCoverage: {
                    
                    ...form.serviceCoverage,
                    
                    states: (value || []).map((s) => ({
                      name: s.value,
                      country: form.country || "India",
                      countryCode: form.countryCode || "IN",
                    })),
                  },
                })
              }

              placeholder="Select or type states"

              />

              )}
              
              
              {/* Countries */}
              
              {form.serviceCoverage?.type === "country" && (
                <CreatableSelect

                isMulti
                value={(form.serviceCoverage?.countries || []).map((c) => ({
                  value: c.name,
                  label: c.name,
                })
              )}
              
              onChange={(value) =>
                
                updateForm({
                
                ...form,
                
                serviceCoverage: {
                  ...form.serviceCoverage,
                  countries: (value || []).map((c) => ({

                    name: c.value,
                    code: c.value.slice(0, 2).toUpperCase(),
                    })),
                    },
                    })
                    }
                    
                    placeholder="Select or type countries"
                    
                    />
                    )}
                    
                    {form.serviceCoverage?.type === "global" && (
                      
                      <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        
                        This business provides services worldwide.

                        </div>
                      )}
                      </div>




        {/* SERVICE TYPE */}

<div className="mt-6">

<h3 className="font-semibold mb-3">
  Service Type
</h3>


<Select

isMulti

options={serviceTypeOptions}


value={
  serviceTypeOptions.filter(
    (opt) =>
      form.serviceTypes?.includes(
        opt.value
      )
  )
}


onChange={(value)=>{

  updateForm({

    ...form,

    serviceTypes:
      value.map(
        (v)=>v.value
      ),

  });

}}


placeholder="Select service types"

/>


</div>

{isRestaurant && (
  <div className="mt-6">
    
    <h3 className="font-semibold mb-3">
      Food Type
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {foodTypeOptions.map((option) => {
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
            ${selected
              ? "border-gray-900 bg-gray-50 shadow-sm"
              : "border-gray-200 hover:border-gray-400"}
              `}
              >
                
                <span
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: option.color,
                }}
                />
                
                <span
                className="text-sm font-medium">
                  {option.label}
                  </span>
                  </button>
                );
                })}
                </div>
                </div>
              )}

{/* SERVICE OFFERED */}

<div className="mt-6">

<h3 className="font-semibold mb-3">
  Service Offered
</h3>


<CreatableSelect

isMulti

options={suggestedServices.map(s => ({
  value:s,
  label:s
}))}


value={
(form.services || [])
.filter(service => service?.name)
.map(service=>({
  value:service.name,
  label:service.name
}))
}


onChange={(value)=>{

const existing =
form.services || [];


const updatedServices =
value.map(v=>{

const old =
existing.find(
s=>s.name === v.value
);


return {
name:v.value,
description:old?.description || ""
};

});


console.log(
"SERVICE STATE UPDATE:",
updatedServices
);


updateForm({

...form,

services:updatedServices

});

}}


/>





{/* SERVICE DESCRIPTION */}

{
(form.services || []).map(
(service,index)=>(

<div
key={index}
className="
mt-3
border
rounded-xl
p-3
bg-gray-50
"
>


<label className="
text-sm
font-medium
"
>

{service.name} Description

</label>



<textarea

value={
service.description || ""
}

onChange={(e)=>{


const updated =
[...form.services];


updated[index] = {

...updated[index],

description:e.target.value

};


updateForm({

...form,

services:updated

});


}}


placeholder={`Describe ${service.name} service...`}

rows={2}

className="
border
rounded-lg
p-2
w-full
mt-2
"

/>


</div>

))
}


</div>

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
  onChange={(e)=>{

    updateForm({

      ...form,

      address:{
        ...form.address,

        street:e.target.value

      }

    });

  }}

  placeholder="Street / Road (e.g. Mahatma Gandhi Road)"
  className="border rounded-xl p-3 w-full"
/>


<input
  name="area"
  value={form.address?.area || ""}
  onChange={(e)=>{

    updateForm({
      ...form,
      address:{
        ...form.address,
        area:e.target.value
      }
    });

  }}
  placeholder="Area / Locality (e.g. Azad Nagar)"
  className="border rounded-xl p-3 w-full"
/>


<input
  name="landmark"
  value={form.address?.landmark || ""}
  onChange={(e)=>{

    updateForm({
      ...form,
      address:{
        ...form.address,
        landmark:e.target.value
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
          <FormField label="Adjust Exact Location">
            <BusinessLocationPicker
              value={form.location?.coordinates}
              onChange={(coordinates) =>
                updateForm({
                  ...form,
                  location: {
                    type: "Point",
                    coordinates,
                  },
                })
              }
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

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="border rounded-xl p-3 w-full"
            />

          </FormField>

          <FormField
            label="WhatsApp Number"
          >

            <input
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="Enter WhatsApp number"
              className="border rounded-xl p-3 w-full"
            />

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