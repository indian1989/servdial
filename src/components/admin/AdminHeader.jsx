import { Bell } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminHeader = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

      <h1 className="text-lg font-semibold">
        Admin Panel
      </h1>

      <div className="flex items-center gap-6">

        {/* Notification */}
        <button className="relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full">
            {user?.name?.charAt(0)}
          </div>
          <span className="text-sm font-medium">{user?.name}</span>
        </div>

      </div>
    </header>
  );
};

export default AdminHeader;