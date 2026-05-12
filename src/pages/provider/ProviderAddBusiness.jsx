import { useState } from "react";

import BusinessForm from "../../components/business/BusinessForm";
import BusinessSubmitter from "../../components/business/BusinessSubmitter";

import BusinessHoursManager from "../../components/BusinessHoursManager";
import BusinessMediaManager from "../../components/BusinessMediaManager";

const ProviderAddBusiness = () => {
  const [hours, setHours] = useState({});
  const [images, setImages] = useState([]);
  const [logo, setLogo] = useState("");

  const [formData, setFormData] = useState({});

  return (
    <BusinessSubmitter mode="provider">
      {(submitBusiness) => (
        <div className="max-w-7xl mx-auto p-4 md:p-6">

          {/* PAGE HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Add New Business
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Submit your business listing to ServDial
            </p>
          </div>

          {/* MAIN GRID */}
          <div className="flex flex-col md:flex-row gap-6">

  {/* LEFT */}
  <div className="md:w-2/3 w-full">
    <div className="bg-white border rounded-2xl shadow-sm p-4 md:p-6">

      <BusinessForm
        mode="provider"
        initialData={{ boost: false }}
        onChange={(data) =>
          setFormData((prev) => ({
            ...prev,
            ...data,
          }))
        }
        onSubmit={(data) =>
          submitBusiness({
            ...data,
            logo,
            images,
            businessHours: hours,
          })
        }
      >
        <BusinessMediaManager
          value={images}
          onChange={setImages}
        />

        <BusinessHoursManager
          value={hours}
          onChange={setHours}
        />
      </BusinessForm>

    </div>
  </div>

            {/* ================= RIGHT PREVIEW ================= */}
            <div className="lg:col-span-1">

              <div className="sticky top-6 bg-white border rounded-2xl shadow-sm overflow-hidden">

                {/* COVER */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600" />

                {/* CONTENT */}
                <div className="p-5 -mt-10 relative">

                  {/* LOGO */}
                  <div className="mb-4">
                    {logo ? (
                      <img
                        src={logo}
                        alt="logo"
                        className="w-20 h-20 rounded-2xl border-4 border-white object-cover bg-white shadow"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl border-4 border-white bg-gray-100 shadow" />
                    )}
                  </div>

                  {/* NAME */}
                  <h2 className="text-xl font-bold text-gray-900">
                    {formData.name || "Business Name"}
                  </h2>

                  {/* CATEGORY + CITY */}
                  <div className="flex flex-wrap gap-2 mt-2">

                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {formData.categoryName || "Category"}
                    </span>

                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {formData.cityName || "City"}
                    </span>

                  </div>

                  {/* DESCRIPTION */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {formData.description ||
                        "Business description preview will appear here."}
                    </p>
                  </div>

                  {/* CONTACT */}
                  <div className="mt-5 space-y-2 text-sm">

                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">
                        Phone
                      </span>

                      <span className="font-medium text-gray-800">
                        {formData.phone || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">
                        WhatsApp
                      </span>

                      <span className="font-medium text-gray-800">
                        {formData.whatsapp || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-gray-500">
                        Website
                      </span>

                      <span className="font-medium text-gray-800 truncate">
                        {formData.website || "-"}
                      </span>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-gray-500 text-xs mb-1">
                        Address
                      </p>

                      <p className="text-sm text-gray-800">
                        {formData.address || "-"}
                      </p>
                    </div>

                  </div>

                  {/* IMAGES */}
                  <div className="mt-6">

                    <h3 className="font-semibold text-gray-900 mb-2">
                      Gallery
                    </h3>

                    <div className="grid grid-cols-3 gap-2">

                      {images.length > 0 ? (
                        images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt=""
                            className="w-full h-20 rounded-xl object-cover border"
                          />
                        ))
                      ) : (
                        <div className="col-span-3 text-sm text-gray-400">
                          No images uploaded
                        </div>
                      )}

                    </div>

                  </div>

                  {/* BUSINESS HOURS */}
                  <div className="mt-6">

                    <h3 className="font-semibold text-gray-900 mb-3">
                      Business Hours
                    </h3>

                    <div className="space-y-2 text-sm">

                      {[
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday",
                        "sunday",
                      ].map((day) => {
                        const d = hours?.[day] || {};

                        let text = "Closed";

                        if (d?.open24h) {
                          text = "Open 24 Hours";
                        } else if (
                          !d?.closed &&
                          d?.open &&
                          d?.close
                        ) {
                          text = `${d.open} - ${d.close}`;
                        }

                        return (
                          <div
                            key={day}
                            className="flex justify-between border-b pb-1"
                          >
                            <span className="capitalize text-gray-500">
                              {day}
                            </span>

                            <span className="font-medium text-gray-800">
                              {text}
                            </span>
                          </div>
                        );
                      })}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      )}
    </BusinessSubmitter>
  );
};

export default ProviderAddBusiness;