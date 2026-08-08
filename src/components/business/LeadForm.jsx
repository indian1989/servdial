import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
} from "libphonenumber-js";
import { X } from "lucide-react";
import { useMemo, useState } from "react";

const LeadForm = ({
  business,
  leadData,
  setLeadData,
  loading = false,
  handleSubmit,
}) => {
  const [phoneError, setPhoneError] = useState("");

  // ===============================
  // WORLDWIDE COUNTRY LIST
  // ===============================
  const countries = useMemo(() => {
    return getCountries()
      .map((country) => ({
        country,
        code: `+${getCountryCallingCode(country)}`,
      }))
      .sort((a, b) =>
        a.country.localeCompare(b.country)
      );
  }, []);

  // ===============================
  // DEFAULT COUNTRY
  // ===============================
  const selectedCountry =
    leadData.country || "IN";

  const selectedDialCode =
    countries.find(
      (item) =>
        item.country === selectedCountry
    )?.code || "+91";

  // ===============================
  // FIELD UPDATE
  // ===============================
  const updateField = (field, value) => {
    setLeadData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ===============================
  // COUNTRY CHANGE
  // ===============================
  const handleCountryChange = (e) => {
    const country = e.target.value;

    setPhoneError("");

    setLeadData((prev) => ({
      ...prev,
      country,
      countryCode:
        `+${getCountryCallingCode(country)}`,
      phone: "",
    }));
  };

  // ===============================
  // PHONE CHANGE
  // ===============================
  const handlePhoneChange = (e) => {
    const value = e.target.value;

    // Allow only numbers, spaces, -, (, )
    const cleaned = value.replace(
      /[^\d\s\-()]/g,
      ""
    );

    setPhoneError("");

    setLeadData((prev) => ({
      ...prev,
      phone: cleaned,
      country: selectedCountry,
      countryCode: selectedDialCode,
    }));
  };

  // ===============================
  // SUBMIT
  // ===============================
  const submitForm = () => {
    const phone = leadData.phone?.trim();

    if (!phone) {
      setPhoneError(
        "Please enter your phone number."
      );
      return;
    }

    const internationalPhone =
      `${selectedDialCode}${phone.replace(/\D/g, "")}`;

    try {
      const valid = isValidPhoneNumber(
        internationalPhone
      );

      if (!valid) {
        setPhoneError(
          "Please enter a valid phone number."
        );
        return;
      }
    } catch {
      setPhoneError(
        "Please enter a valid phone number."
      );
      return;
    }

    /*
     * Backend ko E.164-style number bhejna.
     * Example:
     * +919876543210
     */
    setLeadData((prev) => ({
      ...prev,
      phone: internationalPhone,
      country: selectedCountry,
      countryCode: selectedDialCode,
    }));

    /*
     * IMPORTANT:
     * React state update asynchronous hai.
     * Isliye direct handleSubmit ko updated
     * phone dena better hai.
     */
    handleSubmit({
      ...leadData,
      phone: internationalPhone,
      country: selectedCountry,
      countryCode: selectedDialCode,
    });
  };

  return (
    <div className="space-y-4">

      {/* ================= HEADER ================= */}

      <div className="pr-8">

        <h2 className="text-xl font-semibold text-gray-900">
          Get Best Deal
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Send your enquiry to{" "}
          <span className="font-medium text-gray-700">
            {business?.name || "this business"}
          </span>
        </p>

      </div>

      {/* ================= NAME ================= */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>

        <input
          type="text"
          placeholder="Enter your name"
          value={leadData.name || ""}
          onChange={(e) =>
            updateField(
              "name",
              e.target.value
            )
          }
          className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

      </div>

      {/* ================= EMAIL ================= */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
          <span className="text-gray-400 font-normal">
            {" "} (optional)
          </span>
        </label>

        <input
          type="email"
          placeholder="you@example.com"
          value={leadData.email || ""}
          onChange={(e) =>
            updateField(
              "email",
              e.target.value
            )
          }
          className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

      </div>

      {/* ================= PHONE ================= */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>

        <div className="flex gap-2">

          {/* COUNTRY */}

          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="w-[145px] shrink-0 border border-gray-300 rounded-lg px-2 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
          >

            {countries.map(
              ({
                country,
                code,
              }) => (
                <option
                  key={country}
                  value={country}
                >
                  {country} ({code})
                </option>
              )
            )}

          </select>

          {/* PHONE */}

          <div className="flex-1 relative">

            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
              {selectedDialCode}
            </div>

            <input
              type="tel"
              inputMode="tel"
              placeholder="Phone number"
              value={
                leadData.phone || ""
              }
              onChange={
                handlePhoneChange
              }
              className="w-full border border-gray-300 rounded-lg p-3 pl-14 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

          </div>

        </div>

        {phoneError && (
          <p className="text-sm text-red-600 mt-1">
            {phoneError}
          </p>
        )}

        <p className="text-xs text-gray-400 mt-1">
          Select your country and enter your
          phone number.
        </p>

      </div>

      {/* ================= MESSAGE ================= */}

      <div>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Requirement
        </label>

        <textarea
          rows={4}
          placeholder="Describe your requirement..."
          value={
            leadData.message || ""
          }
          onChange={(e) =>
            updateField(
              "message",
              e.target.value
            )
          }
          className="w-full border border-gray-300 rounded-lg p-3 resize-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

      </div>

      {/* ================= SUBMIT ================= */}

      <button
        type="button"
        disabled={loading}
        onClick={submitForm}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition"
      >
        {loading
          ? "Sending..."
          : "Send Request"}
      </button>

    </div>
  );
};

export default LeadForm;