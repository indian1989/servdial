import { Smartphone } from "lucide-react";

const DownloadApp = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-20 mb-10">

      <div className="bg-gray-100 rounded-2xl p-10 flex flex-col lg:flex-row items-center justify-between gap-8">

        {/* LEFT CONTENT */}
        <div className="max-w-lg">

          <div className="flex items-center gap-2 mb-3">
            <Smartphone className="text-blue-600" size={28} />
            <h2 className="text-2xl md:text-3xl font-bold">
              Get the ServDial App
            </h2>
          </div>

          <p className="text-gray-600 mb-6">
            Search and connect with trusted local businesses faster using the ServDial mobile app.  
            Discover services, call providers instantly, and explore nearby businesses on the go.
          </p>

          {/* DOWNLOAD BUTTONS */}
          <div className="flex flex-wrap gap-4">

            <button
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition text-sm font-medium"
            >
              Download on App Store
            </button>

            <button
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition text-sm font-medium"
            >
              Get it on Google Play
            </button>

          </div>

        </div>

        {/* RIGHT SIDE MOCK PHONE */}
        <div className="hidden lg:flex items-center justify-center">

          <div className="w-48 h-96 bg-white border rounded-3xl shadow-lg flex items-center justify-center">

            <p className="text-gray-400 text-center text-sm px-4">
              ServDial App Preview
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default DownloadApp;