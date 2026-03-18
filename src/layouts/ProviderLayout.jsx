import { Outlet } from "react-router-dom";
import ProviderSidebar from "../components/provider/ProviderSidebar"; // if you have a sidebar
import ProviderHeader from "../components/provider/ProviderHeader";   // optional header

const ProviderLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Optional Sidebar */}
      {Sidebar && <ProviderSidebar />}

      <div className="flex-1 flex flex-col">
        {/* Optional Header */}
        {Header && <ProviderHeader />}

        {/* Nested routes will render here */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProviderLayout;
