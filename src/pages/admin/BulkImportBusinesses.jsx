
import { useRef, useState } from "react";
import {
  FaCloudUploadAlt,
  FaDownload,
  FaFileCsv,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

import {
  bulkImportBusinesses,
  getBulkImportProgress,
} from "../../api/adminAPI";

const CSV_HEADERS = [
  "Business Name",
  "Parent Category",
  "Subcategory",
  "Leaf Category 1",
  "Leaf Category 2",
  "Leaf Category 3",
  "Leaf Category 4",
  "Leaf Category 5",
  "Service Area",
  "Service Type",
  "Services List",
  "Street",
  "Area",
  "Landmark",
  "City",
  "District",
  "State",
  "Pincode",
  "Google Map Coordinates",
  "Mobile",
  "WhatsApp",
  "Alternate Mobile",
  "Landline",
  "Website",
  "Description",
  "Food Type",
  "Monday Open",
  "Monday Close",
  "Monday Closed",
  "Tuesday Open",
  "Tuesday Close",
  "Tuesday Closed",
  "Wednesday Open",
  "Wednesday Close",
  "Wednesday Closed",
  "Thursday Open",
  "Thursday Close",
  "Thursday Closed",
  "Friday Open",
  "Friday Close",
  "Friday Closed",
  "Saturday Open",
  "Saturday Close",
  "Saturday Closed",
  "Sunday Open",
  "Sunday Close",
  "Sunday Closed",
  "Confirm Duplicate Contact",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_BUSINESS_ROWS = 500;

function escapeCsv(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function downloadCsv(filename, rows) {
  const csvContent = rows
    .map((row) => row.map(escapeCsv).join(","))
    .join("\r\n");

  const blob = new Blob(["\uFEFF", csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Allow the browser to start the download before releasing the URL.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadCsvTemplate() {
  const examples = {
    "Business Name": "Example Business",
    "Parent Category": "Services",
    Subcategory: "Electrician",
    "Leaf Category 1": "Residential Electrician",
    City: "Hajipur",
    District: "Vaishali",
    State: "Bihar",
    Pincode: "844101",
    "Google Map Coordinates": "25.6858,85.2146",
    Mobile: "9876543210",
    "Services List": "Wiring; Electrical Repairs",
    "Monday Open": "09:00",
    "Monday Close": "18:00",
    "Monday Closed": "FALSE",
    "Confirm Duplicate Contact": "FALSE",
  };

  const sampleRow = CSV_HEADERS.map(
    (header) => examples[header] ?? ""
  );

  downloadCsv("servdial-business-import-template.csv", [
    CSV_HEADERS,
    sampleRow,
  ]);
}

function getStatusKind(status) {
  const normalized = String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (
    ["created", "success", "successful", "imported"].includes(normalized)
  ) {
    return "created";
  }

  if (
    normalized.includes("skip") ||
    normalized.includes("duplicate")
  ) {
    return "skipped";
  }

  if (
    ["failed", "failure", "error", "invalid"].includes(normalized)
  ) {
    return "failed";
  }

  return "unknown";
}

function getStatusLabel(status) {
  const kind = getStatusKind(status);

  if (kind === "created") return "Created";
  if (kind === "skipped") return "Skipped";
  if (kind === "failed") return "Failed";

  return status
    ? String(status).replace(/[_-]+/g, " ")
    : "Unknown";
}

function getStatusClasses(status) {
  const kind = getStatusKind(status);

  if (kind === "created") {
    return "bg-green-50 text-green-700";
  }

  if (kind === "skipped") {
    return "bg-amber-50 text-amber-800";
  }

  if (kind === "failed") {
    return "bg-red-50 text-red-700";
  }

  return "bg-gray-100 text-gray-700";
}

function getStatusIcon(status) {
  const kind = getStatusKind(status);

  if (kind === "created") return <FaCheckCircle />;
  if (kind === "skipped") return <FaExclamationTriangle />;
  if (kind === "failed") return <FaTimesCircle />;

  return <FaExclamationTriangle />;
}

function getRowCounts(results = []) {
  return results.reduce(
    (counts, item) => {
      const kind = getStatusKind(item.status);

      if (kind === "created") counts.created += 1;
      else if (kind === "skipped") counts.skipped += 1;
      else if (kind === "failed") counts.failed += 1;

      return counts;
    },
    { created: 0, skipped: 0, failed: 0 }
  );
}

export default function BulkImportBusinesses() {
  const fileInputRef = useRef(null);
  const uploadLockRef = useRef(false);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);

  const [liveProgress, setLiveProgress] = useState(null);
  const progressPollingRef = useRef(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setError("");
    setReport(null);
    setUploadProgress(0);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setFile(null);
      setError("Please select a CSV file.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setError("File size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size === 0) {
      setFile(null);
      setError("The selected CSV file is empty.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  
const handleUpload = async (event) => {
  event.preventDefault();

  if (uploadLockRef.current || loading) return;

  if (!file) {
    setError("Please select a CSV file first.");
    return;
  }

  uploadLockRef.current = true;
  progressPollingRef.current = true;

  setLoading(true);
  setUploadProgress(0);
  setLiveProgress(null);
  setLiveProgress({
  status: "starting",
  total: null,
  processed: 0,
  created: 0,
  skipped: 0,
  failed: 0,
  pending: null,
  percentage: 0,
  message: "Connecting to the server and preparing the import...",
  results: [],
});
  setError("");
  setReport(null);

  const requestId =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `import-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const formData = new FormData();
  formData.append("file", file);

  // Poll the backend while the upload/import request is running.
  const pollProgress = async () => {
    while (progressPollingRef.current) {
      try {
        const response = await getBulkImportProgress(requestId);
        const progress = response?.data?.progress;

        if (progress) {
          setLiveProgress(progress);

          if (
            progress.status === "completed" ||
            progress.status === "failed"
          ) {
            break;
          }
        }
      } catch {
        // The backend job may not exist until the upload begins.
        // Retry while the import request is still running.
      }

      await new Promise((resolve) => window.setTimeout(resolve, 100));
    }
  };

  const pollingTask = pollProgress();

  try {
    const response = await bulkImportBusinesses(formData, {
      headers: {
        "x-request-id": requestId,
      },
      onUploadProgress: (event) => {
        if (event.total && event.total > 0) {
          const percent = Math.round(
            (event.loaded / event.total) * 100
          );

          setUploadProgress(Math.min(100, percent));
        }
      },
    });

    const data = response?.data;

    if (!data || typeof data !== "object") {
      throw new Error("The server returned an invalid import response.");
    }

    setReport(data);
    setUploadProgress(100);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setFile(null);
  } catch (err) {
    const responseData = err.response?.data;

    if (
      responseData?.summary &&
      Array.isArray(responseData?.results)
    ) {
      setReport(responseData);
    } else {
      setError(
        responseData?.message ||
          err.message ||
          "CSV import failed. Please try again."
      );
    }
  } finally {
    progressPollingRef.current = false;
    await pollingTask;

    uploadLockRef.current = false;
    setLoading(false);
  }
};


  const summary = report?.summary;
  const results = Array.isArray(report?.results)
    ? report.results
    : [];

  const rowCounts = getRowCounts(results);
  const liveResults = Array.isArray(liveProgress?.results)
  ? liveProgress.results
  : [];

  const totalRows =
    summary?.totalRows ?? results.length;

  const createdCount =
    summary?.created ?? rowCounts.created;

  const skippedCount =
    summary?.skipped ??
    summary?.duplicates ??
    rowCounts.skipped;

  const failedCount =
    summary?.failed ?? rowCounts.failed;

  const hasFailures = Number(failedCount) > 0;

  const handleDownloadReport = () => {
    const rows = [
      ["CSV Row", "Business Name", "Status", "Details", "Business ID"],
      ...results.map((item) => [
        item.row ?? "",
        item.businessName ?? "",
        getStatusLabel(item.status),
        item.message ?? "",
        item.businessId ?? "",
      ]),
    ];

    downloadCsv("servdial-business-import-report.csv", rows);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* PAGE HEADER */}
        <header>
          <p className="text-sm font-semibold text-indigo-600">
            BUSINESS ENGINE
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Bulk Import Businesses
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Import multiple business listings into ServDial using a CSV file.
          </p>
        </header>

        {/* STEP 1: TEMPLATE */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FaFileCsv size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-gray-900">
                Step 1: Download CSV template
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                Use the exact column headings provided in the template.
                Keep the header row unchanged.
              </p>

              <button
                type="button"
                onClick={downloadCsvTemplate}
                className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <FaDownload />
                Download CSV Template
              </button>
            </div>
          </div>
        </section>

        {/* IMPORT INSTRUCTIONS */}
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <FaExclamationTriangle className="mt-1 shrink-0 text-amber-600" />

            <div className="text-sm leading-6 text-amber-950">
              <h2 className="font-semibold">Before importing</h2>

              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Maximum file size: 5 MB.</li>
                <li>Maximum 500 business rows per upload.</li>
                <li>
                  Parent Category, Subcategory, City, District and State must
                  match active records in ServDial.
                </li>
                <li>
                  At least one valid Mobile or Landline number is required.
                </li>
                <li>
                  Leaf categories must belong to the selected Subcategory.
                </li>
                <li>
                  Coordinates must use latitude,longitude format.
                </li>
                <li>
                  Existing duplicate contacts must follow the backend's
                  duplicate-confirmation rules.
                </li>
                <li>
                  Imported listings follow the current backend controller's
                  approval and verification rules.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* STEP 2: UPLOAD */}
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-gray-900">
            Step 2: Upload your CSV
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Select the completed CSV file and start the import.
          </p>

          <form onSubmit={handleUpload} className="mt-5 space-y-4">
            <label
              htmlFor="business-csv"
              className={`flex min-h-36 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition ${
                loading
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40"
              }`}
            >
              {loading ? (
                <FaSpinner
                  size={30}
                  className="animate-spin text-indigo-600"
                />
              ) : (
                <FaCloudUploadAlt
                  size={30}
                  className="text-indigo-600"
                />
              )}

              <span className="mt-3 text-sm font-semibold text-gray-800">
                {loading ? "Uploading CSV..." : "Choose a CSV file"}
              </span>

              <span className="mt-1 break-all text-xs text-gray-500">
                {file ? file.name : "CSV format · Maximum 5 MB"}
              </span>

              <input
                ref={fileInputRef}
                id="business-csv"
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                disabled={loading}
                className="sr-only"
              />
            </label>

            {/* SELECTED FILE */}
            {file && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-50 p-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <FaFileCsv className="shrink-0 text-indigo-600" />

                  <span className="break-all text-gray-700">
                    {file.name}
                  </span>

                  <span className="shrink-0 text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setFile(null);
                    setError("");
                    setReport(null);
                    setUploadProgress(0);

                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Remove file
                </button>
              </div>
            )}

            {/* UPLOAD PROGRESS */}
            {loading && (
              <div
                className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4"
                aria-live="polite"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    {uploadProgress < 100
                      ? "Uploading CSV file..."
                      : "Upload complete. Waiting for server response..."}
                  </span>

                  <span className="text-sm font-bold tabular-nums text-indigo-700">
                    {uploadProgress}%
                  </span>
                </div>

                <div
                  className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200"
                  role="progressbar"
                  aria-label="CSV file upload progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={uploadProgress}
                >
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-200 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  {uploadProgress < 100
                    ? "Please keep this page open and do not submit the same file again."
                    : "The server may still be validating and importing business records. The percentage above measures file upload, not row processing."}
                </p>
              </div>
            )}

            
{/* LIVE ROW PROCESSING PROGRESS */}
{liveProgress && (
  <div
    className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm"
    aria-live="polite"
  >
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h3 className="font-semibold text-gray-900">
        Import Processing
      </h3>

      <span className="text-sm font-semibold text-indigo-700">
        {liveProgress.percentage ?? 0}%
      </span>
    </div>

    <p className="mt-1 text-sm text-gray-600">
      {liveProgress.message || "Processing business records..."}
    </p>

    <div
      className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-200"
      role="progressbar"
      aria-label="Business row processing progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={liveProgress.percentage ?? 0}
    >
      <div
        className="h-full rounded-full bg-indigo-600 transition-all duration-300"
        style={{
          width: `${liveProgress.percentage ?? 0}%`,
        }}
      />
    </div>

    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <SummaryCard
        label="Processed"
        value={`${liveProgress.processed ?? 0} / ${liveProgress.total ?? "—"}`}
        className="bg-gray-50"
      />

      <SummaryCard
        label="Created"
        value={liveProgress.created ?? 0}
        className="bg-green-50"
        valueClass="text-green-700"
      />

      <SummaryCard
        label="Skipped"
        value={liveProgress.skipped ?? 0}
        className="bg-amber-50"
        valueClass="text-amber-800"
      />

      <SummaryCard
        label="Failed"
        value={liveProgress.failed ?? 0}
        className="bg-red-50"
        valueClass="text-red-700"
      />

      <SummaryCard
        label="Pending"
        value={liveProgress.pending ?? "—"}
        className="bg-indigo-50"
        valueClass="text-indigo-700"
      />

      
{liveResults.length > 0 && (
  <div className="mt-5">
    <h4 className="mb-3 font-semibold text-gray-900">
      Live Row-wise Results ({liveResults.length})
    </h4>

    <div className="max-h-[420px] overflow-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="sticky top-0 bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
          <tr>
            <th className="px-4 py-3">CSV Row</th>
            <th className="px-4 py-3">Business Name</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Details</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {liveResults.map((item, index) => (
            <tr
              key={`${item.row ?? index}-${item.businessId ?? index}`}
              className="align-top"
            >
              <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                {item.row ?? "—"}
              </td>

              <td className="px-4 py-3 font-medium text-gray-900">
                {item.businessName || "—"}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                    item.status
                  )}`}
                >
                  {getStatusIcon(item.status)}
                  {getStatusLabel(item.status)}
                </span>
              </td>

              <td className="max-w-md whitespace-normal break-words px-4 py-3 leading-5 text-gray-600">
                {item.message || "Processing..."}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

    </div>
  </div>
)}


            {/* ERROR */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <FaTimesCircle className="mt-0.5 shrink-0" />
                <span className="break-words">{error}</span>
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={!file || loading}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {loading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaCloudUploadAlt />
              )}

              {loading ? "Importing businesses..." : "Upload & Import"}
            </button>

            <p className="text-xs leading-5 text-gray-500">
              Do not retry an import just because the server is taking time to
              respond. A timed-out request may already have created records.
              Check the report and existing listings before retrying.
            </p>
          </form>
        </section>

        {/* IMPORT REPORT */}
        {report && (
          <section className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              {hasFailures ? (
                <FaExclamationTriangle
                  size={24}
                  className="mt-1 shrink-0 text-amber-600"
                />
              ) : (
                <FaCheckCircle
                  size={24}
                  className="mt-1 shrink-0 text-green-600"
                />
              )}

              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-gray-900">
                  Import Report
                </h2>

                <p className="mt-1 break-words text-sm text-gray-600">
                  {report.message || "The server returned an import report."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                label="Total Rows"
                value={totalRows}
                className="bg-gray-50"
              />

              <SummaryCard
                label="Created"
                value={createdCount}
                className="bg-green-50"
                valueClass="text-green-700"
              />

              <SummaryCard
                label="Skipped / Duplicates"
                value={skippedCount}
                className="bg-amber-50"
                valueClass="text-amber-800"
              />

              <SummaryCard
                label="Failed"
                value={failedCount}
                className="bg-red-50"
                valueClass="text-red-700"
              />
            </div>

            {results.length > 0 ? (
              <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900">
                    Row-wise Results ({results.length})
                  </h3>

                  <button
                    type="button"
                    onClick={handleDownloadReport}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <FaDownload />
                    Download Report CSV
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                      <tr>
                        <th className="px-4 py-3">CSV Row</th>
                        <th className="px-4 py-3">Business Name</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Details</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {results.map((item, index) => (
                        <tr
                          key={`${item.row ?? index}-${item.businessId ?? index}`}
                          className="align-top"
                        >
                          <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                            {item.row ?? "—"}
                          </td>

                          <td className="px-4 py-3 font-medium text-gray-900">
                            {item.businessName || "—"}
                          </td>

                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                                item.status
                              )}`}
                            >
                              {getStatusIcon(item.status)}
                              {getStatusLabel(item.status)}
                            </span>
                          </td>

                          <td className="max-w-md whitespace-normal break-words px-4 py-3 leading-5 text-gray-600">
                            {item.message || "—"}

                            {item.businessId && (
                              <p className="mt-1 break-all text-xs text-gray-400">
                                ID: {item.businessId}
                              </p>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                No row-wise results were returned by the server.
              </p>
            )}

            {report && (
              <p className="text-xs leading-5 text-gray-500">
                Counts are based on the server summary when provided; otherwise,
                they are estimated from the row-wise results. Unknown status
                values are displayed as returned and are not automatically
                classified as failures.
              </p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  className = "",
  valueClass = "text-gray-900",
}) {
  return (
    <div className={`rounded-xl p-4 ${className}`}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}
