import { useState } from "react";
import BusinessForm from "../../components/business/BusinessForm";
import BusinessSubmitter from "../../components/business/BusinessSubmitter";
import BusinessMediaManager from "../../components/BusinessMediaManager";

const AdminAddBusiness = () => {
  const [images, setImages] = useState([]);
  const [logo, setLogo] = useState("");
  const [formData, setFormData] = useState({});

  return (
    <BusinessSubmitter mode="admin">
      {(submitBusiness) => (
        <div className="flex flex-col md:flex-row gap-6">

          {/* LEFT: FORM */}
          <div className="md:w-2/3 w-full">
            <BusinessForm
              mode="admin"
              initialData={{ isVerified: true }}
              onChange={(data) =>
              setFormData((prev) => ({
                ...prev,
                ...data,
              }))
            }
              onSubmit={(data) =>
                submitBusiness({
                  ...data,
                  images,
                  logo,
                })
              }
            >
              <BusinessMediaManager value={images} onChange={setImages} />
            </BusinessForm>
          </div>

          {/* RIGHT: PREVIEW */}
          <div className="md:w-1/3 w-full">
            <div className="sticky top-6 border p-4 rounded bg-gray-50 max-h-[90vh] overflow-auto">

              <h3 className="font-bold mb-3 text-lg">Live Preview</h3>

              {/* LOGO */}
              {logo && (
                <img
                  src={logo}
                  alt="logo"
                  className="w-20 h-20 object-cover rounded mb-3"
                />
              )}

              {/* BASIC */}
              <p><b>Name:</b> {formData.name || "-"}</p>
              <p><b>Category:</b> {formData.categoryName || "-"}</p>
              <p><b>City:</b> {formData.cityName || "-"}</p>
              <p><b>Address:</b> {formData.address || "-"}</p>

              {/* CONTACT */}
              <div className="mt-3">
                <p><b>Phone:</b> {formData.phone || "-"}</p>
                <p><b>WhatsApp:</b> {formData.whatsapp || "-"}</p>
                <p><b>Website:</b> {formData.website || "-"}</p>
              </div>

              {/* DESCRIPTION */}
              {formData.description && (
                <div className="mt-3">
                  <p><b>Description:</b></p>
                  <p className="text-sm text-gray-700">
                    {formData.description}
                  </p>
                </div>
              )}

              {/* IMAGES */}
              <div className="mt-3">
                <p><b>Images:</b></p>
                <div className="flex gap-2 flex-wrap mt-1">
                  {images.length > 0 ? (
                    images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        className="w-16 h-16 rounded object-cover"
                      />
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No images</p>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}
    </BusinessSubmitter>
  );
};

export default AdminAddBusiness;