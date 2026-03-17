import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* Header */}
      <Header />

      {/* Page Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default PublicLayout;