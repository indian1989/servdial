// frontend/src/pages/admin/ManageBusinesses.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import Select from "react-select";

import {
  getAllBusinesses,
  approveBusiness,
  rejectBusiness,
  updateBusiness,
  approveClaim,
  rejectClaim,
  toggleFeatured,
  toggleVerified,
  deleteBusiness,
  updateBusinessPlan,
} from "../../api/adminAPI";

import {
  FaTrash,
  FaStar,
  FaEdit,
  FaCheck,
  FaCheckCircle,
  FaTimes
} from "react-icons/fa";

import BusinessForm from "../../components/business/BusinessForm";
import { normalizeBusinessPayload } from "../../components/business/BusinessMapper";
import ImageModal from "../../components/admin/modals/ImageModal";
import { toBusinessEditDTO } from "../../dto/businessDTO";
import BusinessMediaManager from "../../components/BusinessMediaManager";
import BusinessHoursManager from "../../components/BusinessHoursManager";
import { formatBusinessAddress } from "../../utils/addressHelper";


const defaultHours = {
  monday: { open: "", close: "", closed: false, open24h: false },
  tuesday: { open: "", close: "", closed: false, open24h: false },
  wednesday: { open: "", close: "", closed: false, open24h: false },
  thursday: { open: "", close: "", closed: false, open24h: false },
  friday: { open: "", close: "", closed: false, open24h: false },
  saturday: { open: "", close: "", closed: false, open24h: false },
  sunday: { open: "", close: "", closed: false, open24h: false },
};

const PAGE_SIZE = 10;

const ManageBusinesses = () => {
  console.log("🔥 ManageBusinesses LOADED");
  // ================= STATE =================
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);

const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
const [cityFilter, setCityFilter] = useState("all");
const [categoryFilter, setCategoryFilter] = useState("all");
const [planFilter, setPlanFilter] = useState("all");
const [featureFilter, setFeatureFilter] = useState("all");

const [selectedIds, setSelectedIds] = useState([]);
const [cityOptions, setCityOptions] = useState([]);
const [categoryOptions, setCategoryOptions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [logo, setLogo] = useState("");
  // ✅ SINGLE SOURCE OF TRUTH FOR EDIT
  const [editBusiness, setEditBusiness] = useState(null);

  const openEdit = (b) => {

  const dto = toBusinessEditDTO(b);

  setLogo(dto.logo || "");

  setEditBusiness({
    ...dto,

    image: dto.image,
    logo: dto.logo,
    pricing: dto.pricing || [],
    services: dto.services || [],
    catalog: dto.catalog || [],
    faq: dto.faq || [],
    offers: dto.offers || [],
    menu: dto.menu || [],
    businessHours: dto.businessHours || defaultHours,
  });
};

  // ================= FETCH =================
  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const res = await getAllBusinesses();

      const data =
        res?.data?.businesses ||
        res?.data?.data ||
        [];

      setBusinesses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch businesses", err);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

fetchBusinesses();

fetchFilterOptions();

}, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // ================= LOCAL UPDATE HELPER =================
  const updateLocal = (id, updater) => {
    setBusinesses((prev) =>
      prev.map((b) => (b._id === id ? updater(b) : b))
    );
  };

  // ================= ACTIONS =================
  const handleApprove = async (id) => {
  updateLocal(id, (b) => ({
    ...b,
    status: "approved"
  }));

  await approveBusiness(id);

  fetchBusinesses();
};

  const handleReject = async (id) => {
    updateLocal(id, (b) => ({ ...b, status: "rejected" }));
    await rejectBusiness(id);
  };

  const handleApproveClaim = async (id) => {

  try {

    await approveClaim(id);

    fetchBusinesses();

  } catch(err){

    console.error(
      "Claim approve failed",
      err
    );

    alert(
      err?.response?.data?.message ||
      "Claim approval failed"
    );
  }

};


const handleRejectClaim = async (id) => {

  try {

    await rejectClaim(id);

    fetchBusinesses();

  } catch(err){

    console.error(
      "Claim reject failed",
      err
    );

  }

};

const handlePlanChange = async (id, plan) => {
  try {

    const res = await updateBusinessPlan(id, plan);

    console.log(
      "PLAN UPDATED:",
      res.data
    );

    fetchBusinesses();

  } catch (error) {

    console.error(
      "Plan update failed:",
      error
    );

  }
};

const handleBulkApprove = async()=>{

try{

await Promise.all(
selectedIds.map(id =>
approveBusiness(id)
)
);

setSelectedIds([]);

fetchBusinesses();


}catch(error){

console.error(error);

}

};

  const handleFeature = async (id) => {
    const original = businesses.find(b => b._id === id);

    updateLocal(id, (b) => ({
      ...b,
      isFeatured: !b.isFeatured
    }));

    try {
      await toggleFeatured(id);
    } catch (err) {
      console.error("Feature toggle failed", err);
      updateLocal(id, () => original);
    }
  };

  const handleVerify = async (id) => {
  const business = businesses.find((b) => b._id === id);

  // Once verified, never unverify from this screen
  if (business?.isVerified) {
    alert("This business is already permanently verified.");
    return;
  }

  updateLocal(id, (b) => ({
    ...b,
    isVerified: true,
  }));

  try {
    await toggleVerified(id);
  } catch (err) {
    console.error("Verify failed", err);
    updateLocal(id, () => business);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this business?")) return;

    setBusinesses((prev) =>
      prev.filter((b) => b._id !== id)
    );

    await deleteBusiness(id);
  };

  // ================= FULL EDIT SAVE =================
  const handleUpdateBusiness = async (formData) => {
  try {
    console.log(
      "🔥 UPDATE FORM HOURS BEFORE NORMALIZE:",
      formData.businessHours
    );

    const payload = normalizeBusinessPayload({
      ...formData,

      // ✅ MEDIA FROM EDIT STATE
      images: editBusiness?.images || formData.images || [],
      logo: editBusiness?.logo || logo || formData.logo || "",

      pricing: formData.pricing || [],
      services: formData.services || [],
      catalog: formData.catalog || [],
      faq: formData.faq || [],
      offers: formData.offers || [],
      menu: formData.menu || [],

      businessHours:
        formData.businessHours || defaultHours,
    });

    console.log(
      "🔥 FINAL PAYLOAD IMAGES:",
      payload.images
    );

    console.log(
      "🔥 FINAL PAYLOAD LOGO:",
      payload.logo
    );

    console.log(
      "🔥 FINAL PAYLOAD HOURS:",
      payload.businessHours
    );

    const res = await updateBusiness(
      editBusiness._id,
      payload
    );

    const updated =
      res?.data?.data ||
      res?.data?.business;

    setBusinesses((prev) =>
      prev.map((b) =>
        b._id === updated._id
          ? updated
          : b
      )
    );

    setEditBusiness(null);

  } catch (err) {
    console.error(err);

    alert(
      err?.response?.data?.message ||
      "Update failed"
    );
  }
};

        const handleBulkPlan = async(plan)=>{

        try{

        await Promise.all(
        selectedIds.map(id =>
        updateBusinessPlan(id,plan)
        )
        );


        setSelectedIds([]);

        fetchBusinesses();


        }catch(error){

        console.error(error);

        }

        };

  // ================= FILTER =================
  const searchTerm = search.toLowerCase();

    const fetchFilterOptions = async()=>{

    try{

    const cityRes =
    await API.get("/admin/cities");


    const categoryRes =
    await API.get("/admin/categories");


    setCityOptions(
    (cityRes.data.data || []).map(city=>({

    label:
    `${city.name} (${city.district}, ${city.state})`,

    value:
    city._id,

    cityId:
    city._id

    }))
    );


    setCategoryOptions(
    (categoryRes.data.data || []).map(cat=>({
    label:cat.name,
    value:cat.name
    }))
    );


    }catch(error){

    console.error(
    "Filter options error",
    error
    );

    }

    };


// ================= FILTERED BUSINESSES =================

const filtered = businesses
  .filter((b) => {
    if (statusFilter === "claim-pending") {
      return b.claimStatus === "pending";
    }

    return statusFilter === "all"
      ? true
      : b.status === statusFilter;
  })
  .filter((b) => {
    return cityFilter === "all"
      ? true
      : String(
        b.cityId?._id || b.cityId
        )
        ===
        String(cityFilter)
  })
  .filter((b) => {
    return categoryFilter === "all"
      ? true
      :(
        b.categoryId?.name ||
        b.categoryName) === categoryFilter
  })  
  .filter((b) => {
    return planFilter === "all"
      ? true
      : (b.plan || "free") === planFilter;
  })
  .filter((b) => {
    if (featureFilter === "featured") return b.isFeatured;
    if (featureFilter === "verified") return b.isVerified;
    if (featureFilter === "claimed") return b.isClaimed;
    if (featureFilter === "trusted") return b.plan==="trusted";
    if (featureFilter === "premium") return b.plan==="premium";
    
    
    
    return true;
  })
  .filter((b) =>
    (b.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // ================= STATUS CHIP =================
  const StatusChip = ({ status }) => {
    const map = {
      approved: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      rejected: "bg-red-100 text-red-700"
    };

    const safeStatus = status || "pending";

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${map[safeStatus]}`}>
        {safeStatus}
      </span>
    );
  };

    // ================= UI =================
  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="bg-white rounded-xl shadow p-4 mb-4 space-y-4">
  <div className="flex flex-col lg:flex-row gap-3">
    <input
      className="border px-3 py-2 rounded-lg flex-1"
      placeholder="Search business..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <Select

      placeholder="Search City..."

      isClearable

      options={cityOptions}

      value={
      cityOptions.find(
      (c)=>c.value===cityFilter
      )
      || null
      }

      onChange={(option)=>{

      setCityFilter(
      option?.value || "all"
      );

      }}

      className="min-w-[200px]"

      />

    <Select

      placeholder="Search Category..."

      isClearable

      options={categoryOptions}

      value={
      categoryFilter==="all"
      ?
      null
      :
      {
      label:categoryFilter,
      value:categoryFilter
      }
      }

      onChange={(option)=>{

      setCategoryFilter(
      option?.value || "all"
      );

      }}

      className="min-w-[200px]"

      />
  </div>

  <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
    <div className="flex flex-wrap gap-3">
      <select
        className="border px-3 py-2 rounded-lg"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="claim-pending">Claim Pending</option>
      </select>

      <select
        className="border px-3 py-2 rounded-lg"
        value={planFilter}
        onChange={(e) => setPlanFilter(e.target.value)}
      >
        <option value="all">All Plans</option>
        <option value="free">Free</option>
        <option value="trusted">Trusted</option>
        <option value="premium">Premium</option>
      </select>

      <select
        className="border px-3 py-2 rounded-lg"
        value={featureFilter}
        onChange={(e) => setFeatureFilter(e.target.value)}
      >
        <option value="all">All Features</option>
        <option value="featured">Featured</option>
        <option value="verified">Verified</option>
        <option value="claimed">Claimed</option>
        <option value="trusted">Trusted</option>
        <option value="premium">Premium</option>
      </select>
    </div>

    <button
      onClick={() => {
        setSearch("");
        setStatusFilter("all");
        setCityFilter("all");
        setCategoryFilter("all");
        setPlanFilter("all");
        setFeatureFilter("all");
      }}
      className="border px-4 py-2 rounded-lg hover:bg-gray-50"
    >
      Reset
    </button>
  </div>
</div>

      {/* ================= FULL EDIT MODAL ================= */}
      {editBusiness && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-3xl p-6 rounded-xl overflow-y-auto max-h-[90vh]">

            <h2 className="text-xl font-bold mb-4">
              Edit Business
            </h2>

 <BusinessForm
  value={editBusiness}
  mode="edit"

  onChange={(data) =>
    setEditBusiness((prev) => ({
      ...prev,
      ...data,
    }))
  }

  onSubmit={handleUpdateBusiness}
>
  {/* MEDIA */}
  <BusinessMediaManager
    value={editBusiness?.images || []}
    onChange={(imgs) =>
      setEditBusiness((prev) => ({
        ...prev,
        images: imgs
      }))
    }
    logo={logo}
    onLogoChange={(newLogo) => {
      setLogo(newLogo);

      setEditBusiness((prev) => ({
        ...prev,
        logo: newLogo,
        }));
        }}
  />

  
</BusinessForm>

            <button
              onClick={() => setEditBusiness(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>

          </div>
        </div>
      )}

      {selectedIds.length > 0 && (
  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
    <div className="font-medium text-indigo-700">
      {selectedIds.length} businesses selected
    </div>

    <div className="flex flex-wrap gap-2">

  <button
    onClick={handleBulkApprove}
    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
  >
    Approve
  </button>


  <button
    onClick={()=>handleBulkPlan("trusted")}
    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
  >
    🛡 Make Trusted
  </button>


  <button
    onClick={()=>handleBulkPlan("premium")}
    className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
  >
    👑 Make Premium
  </button>

</div>
  </div>
)}

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">

        <table className="min-w-[900px] w-full text-sm">

          <thead className="bg-gray-100 text-left">
            <tr>

              <th className="p-3">Checkbox</th>
              <th className="p-3">Business</th>
              <th className="p-3">Category</th>
              <th className="p-3">City</th>
              <th className="p-3">Claim</th>
              <th className="p-3">Status</th>
              <th className="p-3">Featured</th>
              <th className="p-3">Verified</th>
              <th className="p-3">Plan</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="p-3" colSpan="6">
                    <div className="h-6 bg-gray-200 animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No businesses found
                </td>
              </tr>
            ) : (

              paginated.map((b) => (
                <tr key={b._id} className="border-t hover:bg-gray-50">

                   <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(b._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds((prev) => [...prev, b._id]);
                        } else {
                          setSelectedIds((prev) =>
                            prev.filter((id) => id !== b._id)
                          );
                        }
                      }}
                    />
                  </td>
                  {/* BUSINESS */}
                  <td className="p-3">
                    <div className="flex items-start gap-3">
                    <img
                      src={b.images?.[0] || "/placeholder.png"}
                      className="w-10 h-10 rounded cursor-pointer object-cover"
                      onClick={() => setSelectedImage(b.images?.[0])}
                    />

                    
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {b.name}
                      </div>

                      <div className="text-xs text-gray-500 truncate mt-1">
                        {formatBusinessAddress(b.address) || "Address not available"}
                      </div>

                    {b.isClaimed && b.status === "pending" && (
                      <div className="text-xs text-orange-600 font-semibold">
                        Claim Pending Approval
                      </div>
                    )}
                    </div>
                    </div>
                  </td>


                  {/* CATEGORY */}
                  <td className="p-3">
                    {b.categoryId?.name || "N/A"}
                  </td>

                  {/* CITY */}
                  <td className="p-3">
                    {b.cityId?.name || "N/A"}
                  </td>

                    {/* CLAIM */}
                  <td className="p-3">

                    {
                    b.claimStatus === "pending" ?

                    <span className="text-orange-600 font-semibold">
                    Pending
                    </span>

                    :

                    b.claimStatus === "approved"?

                    <span className="text-green-600">
                    Approved
                    </span>

                    :

                    "-"

                    }

                    </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <StatusChip status={b.status} />
                  </td>

                  {/* FEATURE */}
                  <td className="p-3">
                    <button
                      onClick={() => handleFeature(b._id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                      b.isFeatured
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                      }`}
                     >
                     ⭐ {b.isFeatured ? "Featured" : "Not Featured"}
                    </button>
                  </td>

                  <td className="p-3">
                  <button
                    onClick={() => handleVerify(b._id)}
                    disabled={b.isVerified}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      b.isVerified
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    ✔ {b.isVerified ? "Verified" : "Verify"}
                  </button>
                  </td>

                  {/* PLAN */}

                  <td className="p-3">

                  <select
                    value={b.plan || "free"}
                    onChange={(e) => handlePlanChange(b._id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="free">Free</option>
                    <option value="trusted">🛡 Trusted</option>
                    <option value="premium">👑 Premium</option>
                  </select>


                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() => openEdit(b)}
                        className="p-2 bg-blue-500 text-white rounded"
                      >
                        <FaEdit />
                      </button>

                      {/* CLAIM APPROVAL */}

                    {b.claimStatus === "pending" ? (

                    <button
                      onClick={() => handleApproveClaim(b._id)}
                      className="px-3 py-2 bg-purple-600 text-white rounded text-xs"
                    >
                      Approve Claim
                    </button>

                    ) : (

                    <button
                      onClick={() => handleApprove(b._id)}
                      className="px-3 py-2 bg-green-500 text-white rounded text-xs"
                    >
                      <FaCheck />
                    </button>

                    )}

                      <button
                        onClick={() => handleReject(b._id)}
                        className="p-2 bg-yellow-500 text-white rounded"
                      >
                        <FaTimes />
                      </button>

                      <button
                        onClick={() => handleDelete(b._id)}
                        className="p-2 bg-red-500 text-white rounded"
                      >
                        <FaTrash />
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-indigo-500 text-white"
                  : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* ================= IMAGE MODAL ================= */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

    </div>
  );
};

export default ManageBusinesses;