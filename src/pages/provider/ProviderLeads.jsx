// frontend/src/pages/provider/ProviderLeads.jsx

import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";

import { formatLocationDisplay } from "../../utils/addressHelper";

const STATUS_OPTIONS = [
  {
    value: "new",
    label: "New",
  },
  {
    value: "contacted",
    label: "Contacted",
  },
  {
    value: "follow_up",
    label: "Follow Up",
  },
  {
    value: "converted",
    label: "Converted",
  },
  {
    value: "closed",
    label: "Closed",
  },
  {
    value: "cancelled",
    label: "Cancelled",
  },
];

const ProviderLeads = () => {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    follow_up: 0,
    converted: 0,
    closed: 0,
    cancelled: 0,
  });

  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("all");

  const [updatingStatus, setUpdatingStatus] =
    useState(null);

  const [savingNotes, setSavingNotes] =
    useState(null);

  const [expandedNotes, setExpandedNotes] =
    useState({});

  const [noteValues, setNoteValues] =
    useState({});

  const [actionLoading, setActionLoading] =
    useState(null);

  const [error, setError] = useState("");


  // ============================================================
  // FETCH LEADS
  // ============================================================

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const res =
        await API.get("/provider/leads");

      const fetchedLeads =
        res.data?.leads || [];

      setLeads(fetchedLeads);

      setStats({
        total:
          res.data?.stats?.total ??
          fetchedLeads.length,

        new:
          res.data?.stats?.new ?? 0,

        contacted:
          res.data?.stats?.contacted ?? 0,

        follow_up:
          res.data?.stats?.follow_up ?? 0,

        converted:
          res.data?.stats?.converted ?? 0,

        closed:
          res.data?.stats?.closed ?? 0,

        cancelled:
          res.data?.stats?.cancelled ?? 0,
      });

      // Existing notes ko local editing state mein load karein.
      const notes = {};

      fetchedLeads.forEach((lead) => {
        notes[lead._id] =
          lead.notes || "";
      });

      setNoteValues(notes);

    } catch (error) {
      console.error(
        "Provider leads error:",
        error?.response?.data ||
          error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to load enquiries."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchLeads();
  }, []);


  // ============================================================
  // UPDATE STATUS
  // ============================================================

  const updateStatus = async (
    leadId,
    status
  ) => {
    try {
      setUpdatingStatus(leadId);
      setError("");

      const res =
        await API.put(
          `/provider/leads/${leadId}/status`,
          {
            status,
          }
        );

      const updatedLead =
        res.data?.lead;

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === leadId
            ? {
                ...lead,
                ...(updatedLead || {}),
                status,
              }
            : lead
        )
      );

      /*
       * Backend updated lead return kare to
       * usko use karenge.
       *
       * Otherwise stats locally recalculate
       * karenge.
       */
      setStats((prev) => {
        const nextLeads =
          leads.map((lead) =>
            lead._id === leadId
              ? {
                  ...lead,
                  status,
                }
              : lead
          );

        return calculateStats(
          nextLeads
        );
      });

    } catch (error) {
      console.error(
        "Lead status update error:",
        error?.response?.data ||
          error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to update lead status."
      );
    } finally {
      setUpdatingStatus(null);
    }
  };


  // ============================================================
  // SAVE NOTES
  // ============================================================

  const saveNotes = async (
    leadId
  ) => {
    try {
      setSavingNotes(leadId);
      setError("");

      const notes =
        noteValues[leadId] || "";

      const res =
        await API.put(
          `/provider/leads/${leadId}/notes`,
          {
            notes,
          }
        );

      const updatedLead =
        res.data?.lead;

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === leadId
            ? {
                ...lead,
                ...(updatedLead || {}),
                notes,
              }
            : lead
        )
      );

    } catch (error) {
      console.error(
        "Lead notes update error:",
        error?.response?.data ||
          error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to save notes."
      );
    } finally {
      setSavingNotes(null);
    }
  };


  // ============================================================
  // CLOSE LEAD
  // ============================================================

  const closeLead = async (
    leadId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to close this enquiry?"
      );

    if (!confirmed) return;

    try {
      setActionLoading(
        `${leadId}-close`
      );

      setError("");

      const res =
        await API.put(
          `/provider/leads/${leadId}/close`
        );

      const updatedLead =
        res.data?.lead;

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === leadId
            ? {
                ...lead,
                ...(updatedLead || {}),
                status: "closed",
              }
            : lead
        )
      );

      await fetchLeads();

    } catch (error) {
      console.error(
        "Close lead error:",
        error?.response?.data ||
          error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to close lead."
      );
    } finally {
      setActionLoading(null);
    }
  };


  // ============================================================
  // CANCEL LEAD
  // ============================================================

  const cancelLead = async (
    leadId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this enquiry?"
      );

    if (!confirmed) return;

    try {
      setActionLoading(
        `${leadId}-cancel`
      );

      setError("");

      const res =
        await API.put(
          `/provider/leads/${leadId}/cancel`
        );

      const updatedLead =
        res.data?.lead;

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === leadId
            ? {
                ...lead,
                ...(updatedLead || {}),
                status: "cancelled",
              }
            : lead
        )
      );

      await fetchLeads();

    } catch (error) {
      console.error(
        "Cancel lead error:",
        error?.response?.data ||
          error
      );

      setError(
        error?.response?.data?.message ||
          "Unable to cancel lead."
      );
    } finally {
      setActionLoading(null);
    }
  };


  // ============================================================
  // FILTER
  // ============================================================

  const filteredLeads =
    useMemo(() => {
      if (filter === "all") {
        return leads;
      }

      return leads.filter(
        (lead) =>
          lead.status === filter
      );
    }, [leads, filter]);


  // ============================================================
  // HELPERS
  // ============================================================

  const getStatusLabel = (
    status
  ) => {
    const labels = {
      new: "New",
      contacted: "Contacted",
      follow_up: "Follow Up",
      converted: "Converted",
      closed: "Closed",
      cancelled: "Cancelled",
    };

    return (
      labels[status] ||
      "New"
    );
  };


  const getTypeLabel = (
    type
  ) => {
    const labels = {
      enquiry: "General Enquiry",
      table_booking: "Table Booking",
      room_booking: "Room Booking",
      service_booking:
        "Service Booking",
      appointment: "Appointment",
      party_booking:
        "Party Booking",
    };

    return (
      labels[type] ||
      "General Enquiry"
    );
  };


  const getStatusClass = (
    status
  ) => {
    const classes = {
      new:
        "bg-blue-100 text-blue-700",

      contacted:
        "bg-yellow-100 text-yellow-700",

      follow_up:
        "bg-orange-100 text-orange-700",

      converted:
        "bg-green-100 text-green-700",

      closed:
        "bg-gray-100 text-gray-700",

      cancelled:
        "bg-red-100 text-red-700",
    };

    return (
      classes[status] ||
      classes.new
    );
  };


  const formatDate = (
    value
  ) => {
    if (!value) return "";

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "";
    }

    return date.toLocaleString();
  };


  // ============================================================
  // WORLDWIDE WHATSAPP NUMBER
  // ============================================================

  const getWhatsAppNumber = (
    phone
  ) => {
    if (!phone) return "";

    const value =
      String(phone).trim();

    if (!value) return "";

    /*
     * New leads:
     *
     * +916200152506
     *
     * WhatsApp requires:
     *
     * 916200152506
     *
     * Existing old leads:
     *
     * 6200152506
     *
     * We DO NOT add +91 here because
     * we cannot safely guess country.
     */

    return value
      .replace(/^\+/, "")
      .replace(/\D/g, "");
  };


  // ============================================================
  // STATS HELPER
  // ============================================================

  const calculateStats = (
    items
  ) => {
    return {
      total: items.length,

      new: items.filter(
        (lead) =>
          lead.status === "new"
      ).length,

      contacted: items.filter(
        (lead) =>
          lead.status ===
          "contacted"
      ).length,

      follow_up: items.filter(
        (lead) =>
          lead.status ===
          "follow_up"
      ).length,

      converted: items.filter(
        (lead) =>
          lead.status ===
          "converted"
      ).length,

      closed: items.filter(
        (lead) =>
          lead.status ===
          "closed"
      ).length,

      cancelled: items.filter(
        (lead) =>
          lead.status ===
          "cancelled"
      ).length,
    };
  };


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="w-full">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Customer Enquiries
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage enquiries and booking
          requests from your customers.
        </p>
      </div>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start justify-between gap-4">

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="font-semibold"
          >
            ×
          </button>

        </div>
      )}


      {/* ======================================================
          STATS
      ====================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        {/* TOTAL */}

        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Total
          </p>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {stats.total}
          </p>
        </div>


        {/* NEW */}

        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">
            New
          </p>

          <p className="text-2xl font-bold text-blue-600 mt-1">
            {stats.new}
          </p>
        </div>


        {/* FOLLOW UP */}

        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Follow Up
          </p>

          <p className="text-2xl font-bold text-orange-600 mt-1">
            {stats.follow_up}
          </p>
        </div>


        {/* CONVERTED */}

        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-gray-500">
            Converted
          </p>

          <p className="text-2xl font-bold text-green-600 mt-1">
            {stats.converted}
          </p>
        </div>

      </div>


      {/* ======================================================
          FILTER
      ====================================================== */}

      <div className="flex flex-wrap gap-2 mb-6">

        {[
          ["all", "All"],
          ["new", "New"],
          ["contacted", "Contacted"],
          ["follow_up", "Follow Up"],
          ["converted", "Converted"],
          ["closed", "Closed"],
          ["cancelled", "Cancelled"],
        ].map(
          ([value, label]) => (
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

              {value !== "all" && (
                <span className="ml-2 opacity-70">
                  {stats[value] ?? 0}
                </span>
              )}
            </button>
          )
        )}

      </div>


      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="bg-white border rounded-xl p-10 text-center">

          <div className="animate-pulse text-gray-500">
            Loading enquiries...
          </div>

        </div>
      )}


      {/* ======================================================
          EMPTY
      ====================================================== */}

      {!loading &&
        filteredLeads.length === 0 && (
          <div className="bg-white border rounded-xl p-10 text-center">

            <div className="text-4xl mb-3">
              📩
            </div>

            <h3 className="font-semibold text-gray-900">
              No enquiries found
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Customer enquiries will
              appear here.
            </p>

          </div>
        )}


      {/* ======================================================
          LEADS
      ====================================================== */}

      {!loading &&
        filteredLeads.length > 0 && (
          <div className="space-y-4">

            {filteredLeads.map(
              (lead) => {

                const whatsappNumber =
                  getWhatsAppNumber(
                    lead.phone
                  );

                const isUpdating =
                  updatingStatus ===
                  lead._id;

                const isSavingNotes =
                  savingNotes ===
                  lead._id;

                const notesOpen =
                  !!expandedNotes[
                    lead._id
                  ];

                return (
                  <div
                    key={lead._id}
                    className="bg-white border rounded-xl p-5 shadow-sm"
                  >

                    {/* =========================================
                        TOP
                    ========================================= */}

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                      <div className="min-w-0">

                        <h3 className="font-semibold text-lg text-gray-900">
                          {lead.business?.name ||
                            "Business"}
                        </h3>

                        <p className="font-medium text-gray-800 mt-2">
                          {lead.name ||
                            "Customer"}
                        </p>

                        {lead.phone && (
                          <p className="text-gray-600 mt-1 break-all">
                            📞{" "}
                            {lead.phone}
                          </p>
                        )}

                        {lead.email && (
                          <p className="text-sm text-gray-500 mt-1 break-all">
                            ✉️{" "}
                            {lead.email}
                          </p>
                        )}

                      </div>


                      {/* STATUS */}

                      <div className="flex items-center gap-2">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            lead.status
                          )}`}
                        >
                          {getStatusLabel(
                            lead.status
                          )}
                        </span>

                      </div>

                    </div>


                    {/* =========================================
                        DETAILS
                    ========================================= */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5 text-sm">

                      <div>
                        <span className="font-medium text-gray-700">
                          Enquiry Type:
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
                          {lead.source ||
                            "form"}
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


                    {/* =========================================
                        CUSTOMER MESSAGE
                    ========================================= */}

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


                    {/* =========================================
                        BOOKING DETAILS
                    ========================================= */}

                    {(lead.service ||
                      lead.bookingDate ||
                      lead.bookingTime ||
                      lead.guests ||
                      lead.budget !== null) && (
                      <div className="mt-4 border-t pt-4">

                        <p className="text-sm font-semibold text-gray-800 mb-3">
                          Booking Details
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">

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
                            lead.guests !==
                              undefined && (
                              <p>
                                <span className="font-medium">
                                  Guests:
                                </span>{" "}
                                {lead.guests}
                              </p>
                            )}

                          {lead.budget !== null &&
                            lead.budget !==
                              undefined && (
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


                    {/* =========================================
                        PROVIDER NOTES
                    ========================================= */}

                    <div className="mt-5 border-t pt-4">

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedNotes(
                            (prev) => ({
                              ...prev,
                              [lead._id]:
                                !prev[
                                  lead._id
                                ],
                            })
                          )
                        }
                        className="text-sm font-semibold text-gray-800 hover:text-blue-600"
                      >
                        📝{" "}
                        {notesOpen
                          ? "Hide Notes"
                          : "Provider Notes"}

                        {lead.notes && (
                          <span className="ml-2 text-xs font-normal text-gray-400">
                            Saved
                          </span>
                        )}
                      </button>


                      {notesOpen && (
                        <div className="mt-3">

                          <textarea
                            value={
                              noteValues[
                                lead._id
                              ] ??
                              lead.notes ??
                              ""
                            }
                            onChange={(e) =>
                              setNoteValues(
                                (prev) => ({
                                  ...prev,
                                  [lead._id]:
                                    e.target
                                      .value,
                                })
                              )
                            }
                            rows={3}
                            placeholder="Add internal remarks about this customer..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />

                          <div className="flex justify-end mt-2">

                            <button
                              type="button"
                              disabled={
                                isSavingNotes
                              }
                              onClick={() =>
                                saveNotes(
                                  lead._id
                                )
                              }
                              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                            >
                              {isSavingNotes
                                ? "Saving..."
                                : "Save Notes"}
                            </button>

                          </div>

                        </div>
                      )}

                    </div>


                    {/* =========================================
                        ACTIVITY
                    ========================================= */}

                    {(lead.lastContactedAt ||
                      lead.closedAt ||
                      lead.cancelledAt) && (
                      <div className="mt-4 bg-gray-50 rounded-lg p-3 text-xs text-gray-500 space-y-1">

                        {lead.lastContactedAt && (
                          <p>
                            📞 Last contacted:{" "}
                            {formatDate(
                              lead.lastContactedAt
                            )}
                          </p>
                        )}

                        {lead.closedAt && (
                          <p>
                            ✅ Closed:{" "}
                            {formatDate(
                              lead.closedAt
                            )}
                          </p>
                        )}

                        {lead.cancelledAt && (
                          <p>
                            ❌ Cancelled:{" "}
                            {formatDate(
                              lead.cancelledAt
                            )}
                          </p>
                        )}

                      </div>
                    )}


                    {/* =========================================
                        ACTIONS
                    ========================================= */}

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
                          lead.status ||
                          "new"
                        }
                        disabled={
                          isUpdating
                        }
                        onChange={(e) =>
                          updateStatus(
                            lead._id,
                            e.target
                              .value
                          )
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map(
                          (option) => (
                            <option
                              key={
                                option.value
                              }
                              value={
                                option.value
                              }
                            >
                              {option.label}
                            </option>
                          )
                        )}
                      </select>


                      {/* CLOSE */}

                      {lead.status !==
                        "closed" &&
                        lead.status !==
                          "cancelled" && (
                          <button
                            type="button"
                            disabled={
                              actionLoading ===
                              `${lead._id}-close`
                            }
                            onClick={() =>
                              closeLead(
                                lead._id
                              )
                            }
                            className="px-4 py-2 rounded-lg bg-gray-700 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                          >
                            {actionLoading ===
                            `${lead._id}-close`
                              ? "Closing..."
                              : "Close"}
                          </button>
                        )}


                      {/* CANCEL */}

                      {lead.status !==
                        "cancelled" &&
                        lead.status !==
                          "closed" && (
                          <button
                            type="button"
                            disabled={
                              actionLoading ===
                              `${lead._id}-cancel`
                            }
                            onClick={() =>
                              cancelLead(
                                lead._id
                              )
                            }
                            className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                          >
                            {actionLoading ===
                            `${lead._id}-cancel`
                              ? "Cancelling..."
                              : "Cancel"}
                          </button>
                        )}

                    </div>


                    {/* =========================================
                        CREATED DATE
                    ========================================= */}

                    <p className="text-xs text-gray-400 mt-4">
                      Received:{" "}
                      {formatDate(
                        lead.createdAt
                      )}
                    </p>

                  </div>
                );
              }
            )}

          </div>
        )}

    </div>
  );
};


// ============================================================
// EXPORT
// ============================================================

export default ProviderLeads;