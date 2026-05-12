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

  /* ================= FETCH ================= */

useEffect(() => {
  const init = async () => {
    try {
      const [catRes, cityRes] = await Promise.all([
  API.get("/categories"),
  API.get("/cities"),
]);

      // ✅ FIX CATEGORY RESPONSE
      const rawCategories =
        catRes?.data?.data || [];

      const tree =
        buildCategoryTree(rawCategories);

      setCategories(flattenCategories(tree));

      // ✅ FIX CITY RESPONSE
      const cityRaw =
        cityRes?.data?.data?.cities || [];

      const normalizedCities = cityRaw.map(
        (c) => ({
          value: c._id,

          label: `${c.name} (${c.state})`,

          district: c.district || "",
          state: c.state || "",

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

  setForm({
    ...defaultBusinessForm,
    ...value,
  });
}, [value?._id]);

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

  /* ================= SELECT ================= */

  const handleSelect = (field, selected) => {
  if (!selected) return;

  if (field === "categoryId") {
    updateForm({
      ...form,
      categoryId: selected.value,
      categoryName: selected.label,
    });
    return;
  }

  if (field === "cityId") {
    updateForm({
      ...form,
      cityId: selected.value,
      cityName: selected.label,
      district: selected.district,
      state: selected.state,
      location: {
        type: "Point",
        coordinates: [
          selected.longitude,
          selected.latitude,
        ],
      },
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
  e.preventDefault();

  const validationErrors = validateBusinessForm(form);
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length) return;

  try {
    setLoading(true);

    const payload = { ...form };

    if (payload.website && !payload.website.startsWith("http")) {
      payload.website = `https://${payload.website}`;
    }

    await onSubmit(payload);

  } catch (err) {
    console.error(err);
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

        {/* LOCATION */}

        <FormSection
          title="Location Information"
          subtitle="Business address and geo data"
        >

          <FormField
            label="Address"
            required
            error={errors.address}
          >

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter full address"
              className="border rounded-xl p-3 w-full"
            />

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
                    c.value === form.cityId
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

          <div className="grid md:grid-cols-2 gap-4">

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

        {/* EXTRA */}

        {children}

        {/* SUBMIT */}

        <div className="sticky bottom-0 bg-white border-t p-4 rounded-t-2xl">

          <button
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