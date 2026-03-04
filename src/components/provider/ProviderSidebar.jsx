const ProviderSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "business", label: "My Business" },
    { id: "leads", label: "Leads" },
    { id: "reviews", label: "Reviews" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="w-64 bg-white shadow-lg p-5">
      <h2 className="text-2xl font-bold text-blue-600 mb-8">
        ServDial Provider
      </h2>

      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`cursor-pointer px-4 py-2 rounded-lg transition ${
              activeTab === item.id
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProviderSidebar;