// frontend/src/pages/admin/AdminLeads.jsx

import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";

import { formatLocationDisplay } from "../../utils/addressHelper";

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [savingNotesId, setSavingNotesId] = useState(null);
  const [notes, setNotes] = useState({});
  const [editingNotes, setEditingNotes] = useState({});

  // ================================
  // FETCH ALL LEADS
  // ================================

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const res = await API.get("/leads");

      const fetchedLeads = res.data?.leads || [];

      setLeads(fetchedLeads);

      const initialNotes = {};

      fetchedLeads.forEach((lead) => {
        initialNotes[lead._id] = lead.notes || "";
      });

      setNotes(initialNotes);
    } catch (error) {
      console.error(
        "Admin leads error:",
        error?.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // ================================
  // STATUS LABEL
  // ================================

  const getStatusLabel = (status) => {
    const labels = {
      new: "New",
      contacted: "Contacted",
      follow_up: "Follow Up",
      converted: "Converted",
      closed: "Closed",
      cancelled: "Cancelled",
    };

    return labels[status] || "New";
  };

  // ================================
  // STATUS CLASS
  // ================================

  const getStatusClass = (status) => {
    const classes = {
      new: "bg-blue-100 text-blue-700",
      contacted: "bg-yellow-100 text-yellow-700",
      follow_up: "bg-orange-100 text-orange-700",
      converted: "bg-green-100 text-green-700",
      closed: "bg-gray-100 text-gray-700",
      cancelled: "bg-red-100 text-red-700",
    };

    return classes[status] || classes.new;
  };

  // ================================
  // TYPE LABEL
  // ================================

  const getTypeLabel = (type) => {
    const labels = {
      enquiry: "General Enquiry",
      table_booking: "Table Booking",
      room_booking: "Room Booking",
      service_booking: "Service Booking",
      appointment: "Appointment",
      party_booking: "Party Booking",
    };

    return labels[type] || "General Enquiry";
  };

  // ================================
  // UPDATE STATUS
  // ================================

  const updateStatus = async (leadId, status) => {
    try {
      setUpdatingId(leadId);

      /*
       * Admin lead status update ke liye
       * admin API endpoint use hoga.
       *
       * Agar admin-specific endpoint abhi nahi bana hai,
       * next backend step mein banayenge.
       */

      await API.put(`/admin/leads/${leadId}/status`, {
        status,
      });

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === leadId
            ? {
                ...lead,
                status,
                lastContactedAt:
                  status === "contacted" ||
                  status === "converted"
                    ? lead.lastContactedAt || new Date().toISOString()
                    : lead.lastContactedAt,
                closedAt:
                  status === "closed"
                    ? new Date().toISOString()
                    : null,
                cancelledAt:
                  status === "cancelled"
                    ? new Date().toISOString()
                    : null,
              }
            : lead
        )
      );
    } catch (error) {
      console.error(
        "Admin lead status update error:",
        error?.response?.data || error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to update lead status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ================================
  // SAVE NOTES
  // ================================

  const saveNotes = async (leadId) => {
    try {
      setSavingNotesId(leadId);

      const noteValue = notes[leadId] || "";

      await API.put(`/admin/leads/${leadId}/notes`, {
        notes: noteValue,
      });

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === leadId
            ? {
                ...lead,
                notes: noteValue,
              }
            : lead
        )
      );
    } catch (error) {
      console.error(
        "Admin lead notes error:",
        error?.response?.data || error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to save notes"
      );
    } finally {
      setSavingNotesId(null);
    }
  };

  // ================================
  // FILTER + SEARCH
  // ================================

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesStatus =
        filter === "all" ||
        lead.status === filter;

      if (!matchesStatus) {
        return false;
      }

      if (!query) {
        return true;
      }

      const businessName =
        lead.business?.name || "";

      const customerName =
        lead.name || "";

      const phone =
        lead.phone || "";

      const email =
        lead.email || "";

      const city = formatLocationDisplay(
        lead.cityName || lead.business?.cityName,
        lead.state || lead.business?.state,
        lead.country || lead.business?.country
        );

      return (
        businessName.toLowerCase().includes(query) ||
        customerName.toLowerCase().includes(query) ||
        phone.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        city.toLowerCase().includes(query)
      );
    });
  }, [leads, filter, search]);

  // ================================
  // STATS
  // ================================

  const stats = useMemo(() => {
    return {
      total: leads.length,

      new: leads.filter(
        (lead) => lead.status === "new"
      ).length,

      contacted: leads.filter(
        (lead) => lead.status === "contacted"
      ).length,

      follow_up: leads.filter(
        (lead) => lead.status === "follow_up"
      ).length,

      converted: leads.filter(
        (lead) => lead.status === "converted"
      ).length,

      closed: leads.filter(
        (lead) => lead.status === "closed"
      ).length,

      cancelled: leads.filter(
        (lead) => lead.status === "cancelled"
      ).length,
    };
  }, [leads]);

  // ================================
  // WORLDWIDE WHATSAPP NUMBER
  // ================================

  const getWhatsAppNumber = (lead) => {
    /*
     * Future-proof approach:
     *
     * Backend se normalized international number
     * aaye to wahi use hoga.
     *
     * Example:
     * +919876543210
     * +14155552671
     * +447911123456
     */

    const value =
      lead?.phoneInternational ||
      lead?.phone ||
      "";

    if (!value) {
      return "";
    }

    return String(value).replace(/\D/g, "");
  };

  // ================================
  // DATE FORMAT
  // ================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString();
  };

  // ================================
  // RENDER
  // ================================

  return (
    <div className="min-h-screen">

      {/* ================= HEADER ================= */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Lead Management
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage customer enquiries and booking
          requests across all businesses.
        </p>
      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">

        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-gray-500">
            Total
          </p>

          <p className="text-2xl font-bold mt-1">
            {stats.total}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-gray-500">
            New
          </p>

          <p className="text-2xl font-bold text-blue-600 mt-1">
            {stats.new}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-gray-500">
            Contacted
          </p>

          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {stats.contacted}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-gray-500">
            Follow Up
          </p>

          <p className="text-2xl font-bold text-orange-600 mt-1">
            {stats.follow_up}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-gray-500">
            Converted
          </p>

          <p className="text-2xl font-bold text-green-600 mt-1">
            {stats.converted}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-gray-500">
            Closed
          </p>

          <p className="text-2xl font-bold text-gray-600 mt-1">
            {stats.closed}
          </p>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <p className="text-xs text-gray-500">
            Cancelled
          </p>

          <p className="text-2xl font-bold text-red-600 mt-1">
            {stats.cancelled}
          </p>
        </div>

      </div>

      {/* ================= SEARCH ================= */}

      <div className="bg-white border rounded-xl p-4 mb-5">

        <input
          type="search"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search business, customer, phone, email or city..."
          className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      {/* ================= FILTER ================= */}

      <div className="flex flex-wrap gap-2 mb-6">

        {[
          ["all", "All"],
          ["new", "New"],
          ["contacted", "Contacted"],
          ["follow_up", "Follow Up"],
          ["converted", "Converted"],
          ["closed", "Closed"],
          ["cancelled", "Cancelled"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() =>
              setFilter(value)
            }
            className={`px-4 py-2 rounded-lg border text-sm transition ${
              filter === value
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}

      </div>

      {/* ================= LOADING ================= */}

      {loading && (
        <div className="bg-white border rounded-xl p-10 text-center">
          <p className="text-gray-500">
            Loading leads...
          </p>
        </div>
      )}

      {/* ================= EMPTY ================= */}

      {!loading &&
        filteredLeads.length === 0 && (
          <div className="bg-white border rounded-xl p-10 text-center">

            <div className="text-4xl mb-3">
              📩
            </div>

            <h3 className="font-semibold text-gray-900">
              No leads found
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Try changing the search or status filter.
            </p>

          </div>
        )}

      {/* ================= LEADS ================= */}

      {!loading &&
        filteredLeads.length > 0 && (
          <div className="space-y-4">

            {filteredLeads.map((lead) => {

              const whatsappNumber =
                getWhatsAppNumber(lead);

              return (
                <div
                  key={lead._id}
                  className="bg-white border rounded-xl p-5 shadow-sm"
                >

                  {/* ================= TOP ================= */}

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                    <div>

                      <p className="text-xs text-gray-500 mb-1">
                        Business
                      </p>

                      <h3 className="font-semibold text-lg text-gray-900">
                        {lead.business?.name ||
                          "Business"}
                      </h3>

                      <p className="font-medium text-gray-800 mt-3">
                        {lead.name ||
                          "Customer"}
                      </p>

                      {lead.phone && (
                        <p className="text-gray-600 mt-1">
                          📞 {lead.phone}
                        </p>
                      )}

                      {lead.email && (
                        <p className="text-gray-600 mt-1">
                          ✉️ {lead.email}
                        </p>
                      )}

                    </div>

                    <span
                      className={`self-start px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        lead.status
                      )}`}
                    >
                      {getStatusLabel(
                        lead.status
                      )}
                    </span>

                  </div>

                  {/* ================= DETAILS ================= */}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 text-sm">

                    <div>
                      <span className="font-medium text-gray-700">
                        Type:
                      </span>{" "}
                      <span className="text-gray-600">
                        {getTypeLabel(
                          lead.bookingType
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="font-medium text-gray-700">
                        Source:
                      </span>{" "}
                      <span className="text-gray-600 capitalize">
                        {lead.source || "form"}
                      </span>
                    </div>

             <div>
                <span className="font-medium text-gray-700">
                    Location:
                </span>{" "}
                <span className="text-gray-600">
                    {formatLocationDisplay(
                    lead.cityName || lead.business?.cityName,
                    lead.state || lead.business?.state,
                    lead.country || lead.business?.country
                    ) || "—"}
                </span>
                </div>

                </div>

                  {/* ================= MESSAGE ================= */}

                  {lead.message && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-3">

                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Customer Message
                      </p>

                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {lead.message}
                      </p>

                    </div>
                  )}

                  {/* ================= BOOKING DETAILS ================= */}

                  {(lead.service ||
                    lead.bookingDate ||
                    lead.bookingTime ||
                    lead.guests ||
                    lead.budget) && (
                    <div className="mt-4 border-t pt-4">

                      <p className="text-sm font-semibold text-gray-800 mb-3">
                        Booking Details
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">

                        {lead.service && (
                          <p>
                            <span className="font-medium">
                              Service:
                            </span>{" "}
                            {lead.service}
                          </p>
                        )}

                        {lead.bookingDate && (
                          <p>
                            <span className="font-medium">
                              Date:
                            </span>{" "}
                            {lead.bookingDate}
                          </p>
                        )}

                        {lead.bookingTime && (
                          <p>
                            <span className="font-medium">
                              Time:
                            </span>{" "}
                            {lead.bookingTime}
                          </p>
                        )}

                        {lead.guests !== null &&
                          lead.guests !== undefined && (
                            <p>
                              <span className="font-medium">
                                Guests:
                              </span>{" "}
                              {lead.guests}
                            </p>
                          )}

                        {lead.budget !== null &&
                          lead.budget !== undefined && (
                            <p>
                              <span className="font-medium">
                                Budget:
                              </span>{" "}
                              {lead.budget}
                            </p>
                          )}

                      </div>

                    </div>
                  )}

    
{/* ================= NOTES ================= */}

<div className="mt-5 border-t pt-4">

  <label className="block text-sm font-semibold text-gray-800 mb-2">
    Admin Notes / Remarks
  </label>

  {editingNotes[lead._id] ? (
    <>
      <textarea
        rows={3}
        value={notes[lead._id] ?? ""}
        onChange={(e) =>
          setNotes((prev) => ({
            ...prev,
            [lead._id]: e.target.value,
          }))
        }
        placeholder="Add internal notes or remarks..."
        className="w-full border rounded-lg p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-2 mt-2">

        <button
          type="button"
          disabled={savingNotesId === lead._id}
          onClick={() => saveNotes(lead._id)}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400"
        >
          {savingNotesId === lead._id
            ? "Saving..."
            : "Save Notes"}
        </button>

        <button
          type="button"
          disabled={savingNotesId === lead._id}
          onClick={() =>
            setEditingNotes((prev) => ({
              ...prev,
              [lead._id]: false,
            }))
          }
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>

      </div>
    </>
  ) : (
    <>
      {lead.notes ? (
        <div className="bg-gray-50 border rounded-lg p-3">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {lead.notes}
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          No notes added.
        </p>
      )}

      <button
        type="button"
        onClick={() =>
          setEditingNotes((prev) => ({
            ...prev,
            [lead._id]: true,
          }))
        }
        className="mt-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
      >
        {lead.notes ? "Edit Notes" : "Add Notes"}
      </button>
    </>
  )}

</div>

    {/* ================= ACTIONS ================= */}

                  <div className="flex flex-wrap items-center gap-2 mt-5">

                    {/* CALL */}

                    {lead.phone && (
                      <a
                        href={`tel:${lead.phone}`}
                        className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700"
                      >
                        📞 Call
                      </a>
                    )}

                    {/* WHATSAPP */}

                    {whatsappNumber && (
                      <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600"
                      >
                        WhatsApp
                      </a>
                    )}

                    {/* STATUS */}

                    <select
                      value={
                        lead.status || "new"
                      }
                      disabled={
                        updatingId ===
                        lead._id
                      }
                      onChange={(e) =>
                        updateStatus(
                          lead._id,
                          e.target.value
                        )
                      }
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white disabled:bg-gray-100"
                    >
                      <option value="new">
                        New
                      </option>

                      <option value="contacted">
                        Contacted
                      </option>

                      <option value="follow_up">
                        Follow Up
                      </option>

                      <option value="converted">
                        Converted
                      </option>

                      <option value="closed">
                        Closed
                      </option>

                      <option value="cancelled">
                        Cancelled
                      </option>
                    </select>

                  </div>

                  {/* ================= ACTIVITY ================= */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 text-xs text-gray-500">

                    <p>
                      Created:{" "}
                      {formatDate(
                        lead.createdAt
                      )}
                    </p>

                    {lead.lastContactedAt && (
                      <p>
                        Last Contacted:{" "}
                        {formatDate(
                          lead.lastContactedAt
                        )}
                      </p>
                    )}

                    {lead.closedAt && (
                      <p>
                        Closed:{" "}
                        {formatDate(
                          lead.closedAt
                        )}
                      </p>
                    )}

                    {lead.cancelledAt && (
                      <p>
                        Cancelled:{" "}
                        {formatDate(
                          lead.cancelledAt
                        )}
                      </p>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

    </div>
  );
};

export default AdminLeads;