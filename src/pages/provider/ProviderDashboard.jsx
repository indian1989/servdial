import { useState } from "react";
import ProviderSidebar from "../../components/provider/ProviderSidebar";
import ProviderHome from "../../components/provider/ProviderHome";

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <ProviderSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === "dashboard" && <ProviderHome />}
      </div>

    </div>
  );
};

export default ProviderDashboard;