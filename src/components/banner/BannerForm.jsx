import React, { useEffect, useState } from "react";
import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import Select from "react-select";

import API from "../../api/axios";

import {
  addBanner,
  getAllCategories,
  fetchCategories,
} from "../../api/adminAPI";

import { uploadImage } from "../../services/CloudinaryService";

import { buildCategoryTree } from "../../utils/adminUtils";

import Loader from "../common/Loader";

/* ================= SELECT STYLES ================= */

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "48px",
    borderRadius: "10px",
    borderColor: state.isFocused
      ? "#3b82f6"
      : "#d1d5db",
    boxShadow: "none",

    "&:hover": {
      borderColor: "#3b82f6",
    },
  }),
};

/* ================= CATEGORY FLATTEN ================= */

const flattenCategories = (tree = []) => {
  let result = [];

  tree.forEach((cat) => {
    const children = cat.subcategories || [];

    // ✅ ONLY LEAF CATEGORIES
    if (children.length === 0) {
      result.push({
        value: cat._id,
        label: cat.name,
      });
    }

    if (children.length > 0) {
      result = result.concat(
        flattenCategories(children)
      );
    }
  });

  return result;
};

/* ================= COMPONENT ================= */

const BannerForm = ({
  mode = "admin",
  onSuccess,
  initialPlacement = "",
}) => {
  const navigate = useNavigate();

  const isAdmin = mode === "admin";

  const [loading, setLoading] =
    useState(false);

  const [cities, setCities] = useState([]);
const [categories, setCategories] = useState([]);
const [businesses, setBusinesses] = useState([]);
const [searchParams] = useSearchParams();

const urlPlacement =
  searchParams.get("placement");

const urlDuration =
  Number(searchParams.get("duration"));

const validDurations = [1, 3, 6, 12];

const selectedDuration =
  validDurations.includes(urlDuration)
    ? urlDuration
    : 1;

 const [form, setForm] = useState({
  title: "",
  link: "",
  image: "",
  placement:
    urlPlacement ||
    initialPlacement ||
    "homepage_top",

  cityId: "",
  categoryId: "",
  businessId: "",

  durationMonths: selectedDuration,

  isActive: true,
});

// =====================================================
  // READ PLACEMENT + DURATION FROM URL
  // =====================================================


  useEffect(() => {
    const placement =
      searchParams.get("placement");

    const duration =
      Number(searchParams.get("duration"));

    setForm((prev) => ({
      ...prev,

      placement:
        placement ||
        initialPlacement ||
        "homepage_top",

      durationMonths:
        [1, 3, 6, 12].includes(duration)
          ? duration
          : 1,
    }));
  }, [
    searchParams,
    initialPlacement,
      ]);


useEffect(() => {
  if (
    initialPlacement &&
    [
      "homepage_top",
      "homepage_middle",
      "homepage_bottom",

      "city_page_top",
      "city_page_middle",
      "city_page_bottom",

      "category_page_top",
      "category_page_middle",
      "category_page_bottom",

      "featured_business_top",
      "featured_business_bottom",

      "top_rated_business_top",
      "top_rated_business_bottom",

      "latest_business_top",
      "latest_business_bottom",

      "search_results_top",
      "search_results_bottom",

      "business_detail_middle",
      "business_detail_bottom",
    ].includes(initialPlacement)
  ) {
    setForm((prev) => ({
      ...prev,
      placement: initialPlacement,
      businessId: [
        "business_detail_middle",
        "business_detail_bottom",
      ].includes(initialPlacement)
        ? prev.businessId
        : "",
    }));
  }
}, [initialPlacement]);

  /* ================= FETCH ================= */

  useEffect(() => {
    const init = async () => {
      try {
        const [catRes, cityRes] =
  await Promise.all([
    isAdmin
      ? getAllCategories()
      : fetchCategories(),

    API.get("/cities"),
  ]);

          console.log("🔥 CITY API RESPONSE:", cityRes);
console.log("🔥 CITY API DATA:", cityRes?.data);

        /* ===== CATEGORIES ===== */

        const rawCategories =
          catRes?.data?.data || [];

        const tree =
          buildCategoryTree(rawCategories);

        setCategories(
          flattenCategories(tree)
        );

        /* ===== CITIES ===== */

        const rawCities =
  cityRes?.data?.data || [];

        const normalizedCities =
  rawCities.map((c) => ({
    value: c._id,
    label: `${c.name} (${c.state})`,
  }));

setCities(normalizedCities);

      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, []);

  /* ================= FETCH BUSINESSES ================= */

useEffect(() => {
  const fetchBusinesses = async () => {
    // Business selection is only needed for business detail banners
    if (
      ![
        "business_detail_middle",
        "business_detail_bottom",
      ].includes(form.placement)
    ) {
      setBusinesses([]);
      return;
    }

    // City is required to safely narrow businesses
    if (!form.cityId) {
      setBusinesses([]);
      return;
    }

    try {
      const res = await API.get("/businesses", {
        params: {
          cityId: form.cityId,
          limit: 100,
        },
      });

      const rawBusinesses =
        res?.data?.data?.businesses ||
        res?.data?.data ||
        [];

      const normalizedBusinesses =
        rawBusinesses.map((business) => ({
          value: business._id,
          label: business.name,
          categoryId:
            business.categoryId?._id ||
            business.categoryId ||
            "",
        }));

      setBusinesses(normalizedBusinesses);

    } catch (err) {
      console.error(
        "Business fetch error:",
        err
      );

      setBusinesses([]);
    }
  };

  fetchBusinesses();
}, [form.cityId, form.placement]);

  /* ================= INPUT ================= */

  const updateForm = (key, value) => {
  setForm((prev) => {
    const next = {
      ...prev,
      [key]: value,
    };

    // City changed → selected business is no longer guaranteed valid
    if (key === "cityId") {
      next.businessId = "";
    }

    return next;
  });
};

  /* ================= IMAGE UPLOAD ================= */

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setLoading(true);

    try {
      const res = await uploadImage(file);

      updateForm(
        "image",
        res?.secure_url || ""
      );
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUBMIT ================= */

const handleSubmit = async () => {
  if (!form.title.trim()) {
    return alert("Title is required");
  }

  if (!form.image) {
    return alert("Banner image required");
  }

  // ================= TARGETING VALIDATION =================

  // User + Provider banners require city + category.
  if (
    !isAdmin &&
    (!form.cityId || !form.categoryId)
  ) {
    return alert(
      "Please select both city and category"
    );
  }

  // ================= BANNER DURATION VALIDATION =================

  if (
    !isAdmin &&
    ![1, 3, 6, 12].includes(
      Number(form.durationMonths)
    )
  ) {
    return alert(
      "Please select a valid banner duration"
    );
  }

  // ================= BUSINESS DETAIL VALIDATION =================

  const isBusinessDetailPlacement = [
    "business_detail_middle",
    "business_detail_bottom",
  ].includes(form.placement);

  if (
    isBusinessDetailPlacement &&
    !form.businessId
  ) {
    return alert(
      "Please select a business for business detail banner"
    );
  }

  setLoading(true);

  try {
    const payload = {
      title: form.title.trim(),
      link: form.link?.trim() || "",
      image: form.image,
      placement: form.placement,

      cityId: form.cityId || null,
      categoryId: form.categoryId || null,
      businessId: form.businessId || null,

      durationMonths: isAdmin
        ? undefined
        : Number(form.durationMonths),

      isActive: isAdmin
        ? form.isActive
        : true,
    };

    const res = await addBanner(payload);

    /* ===== GET CREATED BANNER ID ===== */

    const bannerId =
      res?.data?.data?._id;

    if (!isAdmin && !bannerId) {
      throw new Error(
        "Banner created but banner ID was not returned"
      );
    }

    /* ===== RESET ===== */

    setForm({
      title: "",
      link: "",
      image: "",
      placement: "homepage_top",

      cityId: "",
      categoryId: "",
      businessId: "",

      durationMonths: 1,

      isActive: true,
    });

    setBusinesses([]);

    /* =====================================================
       USER + PROVIDER PAYMENT FLOW
    ===================================================== */

    if (!isAdmin) {

      // ================= USER =================

      if (mode === "user") {
        navigate(
          `/user/banner/payment/${bannerId}`
        );

        return;
      }

      // ================= PROVIDER =================

      if (mode === "provider") {
        navigate(
          `/provider/banner/payment/${bannerId}`
        );

        return;
      }
    }

    /* ===== ADMIN FLOW ===== */

    onSuccess?.();

  } catch (err) {
    console.error(err);

    alert(
      err?.response?.data?.message ||
        err?.message ||
        "Failed to create banner"
    );

  } finally {
    setLoading(false);
  }
};

  /* ================= UI ================= */

  return (
    <div className="grid gap-4">

      {loading && <Loader />}

      {/* TITLE */}
      <input
        type="text"
        placeholder="Banner Title"
        value={form.title}
        onChange={(e) =>
          updateForm(
            "title",
            e.target.value
          )
        }
        className="border px-3 py-3 rounded-xl"
      />

      {/* LINK */}
      <input
        type="text"
        placeholder="Banner Link"
        value={form.link}
        onChange={(e) =>
          updateForm(
            "link",
            e.target.value
          )
        }
        className="border px-3 py-3 rounded-xl"
      />

      {/* IMAGE */}
      <div className="space-y-2">

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />

        {form.image && (
          <img
            src={form.image}
            alt="Banner"
            className="h-28 rounded-xl object-cover border"
          />
        )}

      </div>

      {/* PLACEMENT */}
      <select
  value={form.placement}
  onChange={(e) => {
    const newPlacement = e.target.value;

    setForm((prev) => ({
      ...prev,
      placement: newPlacement,

      // Business is relevant only for business-detail banners
      businessId:
        [
          "business_detail_middle",
          "business_detail_bottom",
        ].includes(newPlacement)
          ? prev.businessId
          : "",
    }));
  }}
  className="border px-3 py-3 rounded-xl"
>
        <option value="homepage_top">Homepage Top</option>
<option value="homepage_middle">Homepage Middle</option>
<option value="homepage_bottom">Homepage Bottom</option>

<option value="city_page_top">City Page Top</option>
<option value="city_page_middle">City Page Middle</option>
<option value="city_page_bottom">City Page Bottom</option>

<option value="category_page_top">Category Page Top</option>
<option value="category_page_middle">Category Page Middle</option>
<option value="category_page_bottom">Category Page Bottom</option>

<option value="featured_business_top">
  Featured Business Top
</option>
<option value="featured_business_bottom">
  Featured Business Bottom
</option>

<option value="top_rated_business_top">
  Top Rated Business Top
</option>
<option value="top_rated_business_bottom">
  Top Rated Business Bottom
</option>

<option value="latest_business_top">
  Latest Business Top
</option>
<option value="latest_business_bottom">
  Latest Business Bottom
</option>

<option value="search_results_top">
  Search Results Top
</option>
<option value="search_results_bottom">
  Search Results Bottom
</option>

<option value="business_detail_middle">
  Business Detail Middle
</option>
<option value="business_detail_bottom">
  Business Detail Bottom
</option>
      </select>

{/* ================= BANNER DURATION ================= */}

{!isAdmin && (
  <div>
    <label className="block text-sm font-medium mb-1">
      Banner Duration *
    </label>

    <Select
      options={[
        {
          value: 1,
          label: "1 Month",
        },
        {
          value: 3,
          label: "3 Months — 5% Discount",
        },
        {
          value: 6,
          label: "6 Months — 10% Discount",
        },
        {
          value: 12,
          label: "12 Months — 15% Discount",
        },
      ]}
      value={
        [
          {
            value: 1,
            label: "1 Month",
          },
          {
            value: 3,
            label: "3 Months — 5% Discount",
          },
          {
            value: 6,
            label: "6 Months — 10% Discount",
          },
          {
            value: 12,
            label: "12 Months — 15% Discount",
          },
        ].find(
          (option) =>
            option.value ===
            Number(form.durationMonths)
        ) || null
      }
      onChange={(selected) =>
        updateForm(
          "durationMonths",
          selected?.value || 1
        )
      }
      isClearable={false}
      placeholder="Select Duration"
      styles={selectStyles}
    />
  </div>
)}

      {/* CITY SELECT */}
<div>
  <label className="block text-sm font-medium mb-1">
    City {isAdmin ? "(optional)" : "*"}
  </label>

  <Select
    options={cities}
    value={
      cities.find(
        (c) => c.value === form.cityId
      ) || null
    }
    onChange={(selected) =>
      updateForm(
        "cityId",
        selected?.value || ""
      )
    }
    isClearable={isAdmin}
    placeholder={
      isAdmin
        ? "Select City (optional)"
        : "Select City"
    }
    styles={selectStyles}
  />
</div>

      {/* CATEGORY SELECT */}
<div>
  <label className="block text-sm font-medium mb-1">
    Category {isAdmin ? "(optional)" : "*"}
  </label>

  <Select
    options={categories}
    value={
      categories.find(
        (c) => c.value === form.categoryId
      ) || null
    }
    onChange={(selected) => {
      const newCategoryId =
        selected?.value || "";

      setForm((prev) => ({
        ...prev,
        categoryId: newCategoryId,

        businessId:
          prev.businessId &&
          businesses.some(
            (business) =>
              business.value === prev.businessId &&
              business.categoryId === newCategoryId
          )
            ? prev.businessId
            : "",
      }));
    }}
    isClearable={isAdmin}
    placeholder={
      isAdmin
        ? "Select Category (optional)"
        : "Select Category"
    }
    styles={selectStyles}
  />
</div>

    {/* ================= BUSINESS SELECT ================= */}

{[
  "business_detail_middle",
  "business_detail_bottom",
].includes(form.placement) && (
  <div>
    <label className="block text-sm font-medium mb-1">
      Business *
    </label>

    <Select
options={
  form.categoryId
    ? businesses.filter(
        (business) =>
          !business.categoryId ||
          business.categoryId === form.categoryId
      )
    : businesses
}

      value={
        businesses.find(
          (business) =>
            business.value === form.businessId
        ) || null
      }
      onChange={(selected) => {
        const selectedBusiness =
          businesses.find(
            (business) =>
              business.value === selected?.value
          );

        setForm((prev) => ({
          ...prev,

          businessId:
            selected?.value || "",

          // Automatically keep category aligned
          // when business provides categoryId.
          categoryId:
            selectedBusiness?.categoryId ||
            prev.categoryId,
        }));
      }}
      isClearable
      isDisabled={!form.cityId}
      placeholder={
        form.cityId
          ? "Select Business"
          : "Select City first"
      }
      styles={selectStyles}
      noOptionsMessage={() =>
        form.cityId
          ? "No businesses found"
          : "Select a city first"
      }
    />
  </div>
)}

      {/* ADMIN ONLY */}
      {isAdmin && (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              updateForm(
                "isActive",
                e.target.checked
              )
            }
          />

          <span>Active</span>
        </label>
      )}

      {/* SUBMIT */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium"
      >
        {loading
          ? "Processing..."
          : isAdmin
          ? "Create Banner"
          : "Continue to Payment"}
      </button>

    </div>
  );
};

export default BannerForm;