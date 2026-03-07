import Sidebar from "../../../components/admin/Sidebar";
import AdminHeader from "../../../components/admin/AdminHeader";
import { useAuth } from "../../../context/AuthContext";

const ManageBannerAds = () => {
  const { user } = useAuth();

  return (
    <div className="flex">
      <Sidebar role={user.role} />
      <div className="flex-1">
        <AdminHeader />

        <div className="p-6">
          <h1 className="text-2xl font-bold">Manage Banner Ads</h1>
        </div>
      </div>
    </div>
  );
};

export default ManageBannerAds;