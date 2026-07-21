import { X } from "lucide-react";
import LeadForm from "./LeadForm";

const LeadModal = ({
  open,
  onClose,
  business,
  leadData,
  setLeadData,
  handleSubmit,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-4">

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">

        {/* Close */}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        {/* Lead Form */}

        <LeadForm
          business={business}
          leadData={leadData}
          setLeadData={setLeadData}
          handleSubmit={handleSubmit}
          loading={loading}
        />

      </div>

    </div>
  );
};

export default LeadModal;