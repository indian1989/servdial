import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";

const ProviderOffers = () => {
  const [offers, setOffers] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    businessId: "",
    discountType: "percentage",
    discountValue: "",
    couponCode: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const stats = useMemo(() => {
    return {
      total: offers.length,
      active: offers.filter((o) => o.isActive).length,
      expired: offers.filter(
        (o) => new Date(o.endDate) < new Date()
      ).length,
    };
  }, [offers]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [offersRes, businessRes] = await Promise.all([
        API.get("/provider/offers"),
        API.get("/provider/businesses"),
      ]);

      setOffers(
        offersRes.data?.offers ||
          offersRes.data?.data ||
          []
      );

      setBusinesses(
        businessRes.data?.businesses ||
          businessRes.data?.data ||
          []
      );
    } catch (err) {
      console.error("Offer fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      businessId: "",
      discountType: "percentage",
      discountValue: "",
      couponCode: "",
      startDate: "",
      endDate: "",
      isActive: true,
    });
  };

  const createOffer = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
      };

      const res = await API.post(
        "/provider/offers",
        payload
      );

      const newOffer =
        res.data?.offer ||
        res.data?.data;

      if (newOffer) {
        setOffers((prev) => [
          newOffer,
          ...prev,
        ]);
      }

      resetForm();

      alert("Offer created successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to create offer");
    } finally {
      setSaving(false);
    }
  };

  const toggleOffer = async (id) => {
    try {
      const updated = offers.map((offer) =>
        offer._id === id
          ? {
              ...offer,
              isActive: !offer.isActive,
            }
          : offer
      );

      setOffers(updated);

      await API.put(
        `/provider/offers/${id}/toggle`
      );
    } catch (err) {
      console.error(err);
      fetchData();
    }
  };

  const deleteOffer = async (id) => {
    if (
      !window.confirm(
        "Delete this offer permanently?"
      )
    )
      return;

    try {
      await API.delete(
        `/provider/offers/${id}`
      );

      setOffers((prev) =>
        prev.filter(
          (offer) => offer._id !== id
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete offer");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Offers & Promotions
          </h1>

          <p className="text-gray-500 mt-1">
            Create discounts, coupons, and
            seasonal campaigns for your
            businesses.
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white border rounded-xl px-5 py-3 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Offers
            </p>
            <h3 className="text-2xl font-bold">
              {stats.total}
            </h3>
          </div>

          <div className="bg-white border rounded-xl px-5 py-3 shadow-sm">
            <p className="text-sm text-gray-500">
              Active
            </p>
            <h3 className="text-2xl font-bold text-green-600">
              {stats.active}
            </h3>
          </div>

          <div className="bg-white border rounded-xl px-5 py-3 shadow-sm">
            <p className="text-sm text-gray-500">
              Expired
            </p>
            <h3 className="text-2xl font-bold text-red-500">
              {stats.expired}
            </h3>
          </div>
        </div>
      </div>

      {/* CREATE OFFER */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">
          Create New Offer
        </h2>

        <form
          onSubmit={createOffer}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div>
            <label className="block text-sm font-medium mb-2">
              Offer Title *
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Summer Discount"
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Select Business *
            </label>

            <select
              name="businessId"
              value={form.businessId}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="">
                Select Business
              </option>

              {businesses.map((biz) => (
                <option
                  key={biz._id}
                  value={biz._id}
                >
                  {biz.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your offer..."
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Discount Type
            </label>

            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="percentage">
                Percentage (%)
              </option>

              <option value="flat">
                Flat Amount
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Discount Value *
            </label>

            <input
              type="number"
              name="discountValue"
              value={form.discountValue}
              onChange={handleChange}
              required
              placeholder="20"
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Coupon Code
            </label>

            <input
              type="text"
              name="couponCode"
              value={form.couponCode}
              onChange={handleChange}
              placeholder="SAVE20"
              className="w-full border rounded-lg px-4 py-3 uppercase"
            />
          </div>

          <div className="flex items-center gap-3 mt-8">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />

            <span className="text-sm">
              Activate immediately
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Start Date
            </label>

            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              End Date
            </label>

            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              {saving
                ? "Creating..."
                : "Create Offer"}
            </button>
          </div>
        </form>
      </div>

      {/* OFFER LIST */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            Your Offers
          </h2>
        </div>

        {loading && (
          <p>Loading offers...</p>
        )}

        {!loading &&
          offers.length === 0 && (
            <div className="text-center py-12 border rounded-xl">
              <p className="text-gray-500">
                No offers created yet.
              </p>
            </div>
          )}

        <div className="space-y-5">
          {offers.map((offer) => {
            const expired =
              new Date(offer.endDate) <
              new Date();

            return (
              <div
                key={offer._id}
                className="border rounded-xl p-5 hover:shadow-sm transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {offer.title}
                      </h3>

                      <span
                        className={`text-xs px-3 py-1 rounded-full text-white ${
                          expired
                            ? "bg-red-500"
                            : offer.isActive
                            ? "bg-green-600"
                            : "bg-gray-500"
                        }`}
                      >
                        {expired
                          ? "Expired"
                          : offer.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>

                    <p className="text-gray-600">
                      {
                        offer.description
                      }
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>
                        Discount:{" "}
                        <strong>
                          {
                            offer.discountValue
                          }
                          {offer.discountType ===
                          "percentage"
                            ? "%"
                            : "₹"}
                        </strong>
                      </span>

                      {offer.couponCode && (
                        <span>
                          Coupon:{" "}
                          <strong>
                            {
                              offer.couponCode
                            }
                          </strong>
                        </span>
                      )}

                      <span>
                        Ends:{" "}
                        {offer.endDate
                          ? new Date(
                              offer.endDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        toggleOffer(
                          offer._id
                        )
                      }
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      {offer.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      onClick={() =>
                        deleteOffer(
                          offer._id
                        )
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProviderOffers;