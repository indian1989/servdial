import { Outlet } from "react-router-dom";
import ProviderSidebar from "../components/provider/ProviderSidebar";

const ProviderLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <ProviderSidebar />

      {/* CONTENT */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
};

export default ProviderLayout;