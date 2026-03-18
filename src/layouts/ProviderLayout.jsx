import { Outlet } from "react-router-dom";
import ProviderSidebar from "../components/provider/ProviderSidebar"; // if you have a sidebar
import ProviderHeader from "../components/provider/ProviderHeader";   // optional header

const ProviderLayout = () => {
  return (
    <div className="flex min-h-screen">
      <ProviderSidebar />

      <div className="flex-1 flex flex-col">
        <ProviderHeader />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout;
