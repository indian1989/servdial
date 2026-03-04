const ProviderHome = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Total Leads</h3>
          <p className="text-2xl font-bold text-blue-600">24</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Total Reviews</h3>
          <p className="text-2xl font-bold text-green-600">18</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Profile Views</h3>
          <p className="text-2xl font-bold text-purple-600">142</p>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
            Edit Business
          </button>

          <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700">
            View Leads
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderHome;