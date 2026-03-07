import Sidebar from "../../../components/admin/Sidebar";
import AdminHeader from "../../../components/admin/AdminHeader";
import { useAuth } from "../../../context/AuthContext";

const ManageCities = () => {
  const { user } = useAuth();

  return (
    <div className="flex">
      <Sidebar role={user.role} />
      <div className="flex-1">
        <AdminHeader />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Manage Cities</h1>

          <p>City management system will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default ManageCities;