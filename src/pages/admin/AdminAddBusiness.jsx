// frontend/src/pages/admin/AdminAddBusiness.jsx

import { useState } from "react";
import BusinessForm from "../../components/business/BusinessForm";
import BusinessSubmitter from "../../components/business/BusinessSubmitter";
import BusinessMediaManager from "../../components/BusinessMediaManager";
import { formatBusinessAddress } from "../../utils/addressHelper";
import BusinessFeatureFields from "../../components/business/BusinessFeatureFields";

const AdminAddBusiness = () => {
const [images, setImages] = useState([]);
const [logo, setLogo] = useState("");

const [pricing, setPricing] = useState([]);
const [services, setServices] = useState([]);
const [catalog, setCatalog] = useState([]);
const [menu, setMenu] = useState([]);
const [faq, setFaq] = useState([]);
const [offers, setOffers] = useState([]);

const [hours, setHours] = useState({});

const [appointmentBooking, setAppointmentBooking] = useState(null);
const [restaurantBooking, setRestaurantBooking] = useState(null);
const [roomBooking, setRoomBooking] = useState(null);
const [partyBooking, setPartyBooking] = useState(null);

const [formData, setFormData] = useState({});

  const locationText = [
    formData.cityName || formData.cityId?.name,
    formData.district,
    formData.state,
    formData.country,
    formData.pincode,

]
  .filter(Boolean)
  .join(", ");

  return (
    <BusinessSubmitter mode="admin">
      {(submitBusiness) => (
        <div className="flex flex-col md:flex-row gap-6">

          {/* ================= LEFT ================= */}

          <div className="w-full md:w-2/3">

            <BusinessForm
  mode="admin"
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

      pricing,
      services,
      catalog,
      menu,
      faq,
      offers,

      businessHours: hours,

      appointmentBooking,
      restaurantBooking,
      roomBooking,
      partyBooking,
    })
  }
>
  <BusinessFeatureFields
    features={formData.categoryFeatures || []}

    pricing={pricing}
    setPricing={setPricing}

    services={services}
    setServices={setServices}

    catalog={catalog}
    setCatalog={setCatalog}

    menu={menu}
    setMenu={setMenu}

    faq={faq}
    setFaq={setFaq}

    offers={offers}
    setOffers={setOffers}

    hours={hours}
    setHours={setHours}

    appointmentBooking={appointmentBooking}
    setAppointmentBooking={setAppointmentBooking}

    restaurantBooking={restaurantBooking}
    setRestaurantBooking={setRestaurantBooking}

    roomBooking={roomBooking}
    setRoomBooking={setRoomBooking}

    partyBooking={partyBooking}
    setPartyBooking={setPartyBooking}
  />

          <BusinessMediaManager
                value={images}
                onChange={setImages}
                logo={logo}
                onLogoChange={setLogo}
              />
            </BusinessForm>

          </div>

          {/* ================= RIGHT ================= */}

          <div className="w-full md:w-1/3">

            <div className="sticky top-6 rounded-lg border bg-gray-50 p-4 max-h-[90vh] overflow-auto">

              <h3 className="text-lg font-bold mb-4">
                Live Preview
              </h3>

              {logo && (
                <img
                  src={logo}
                  alt="Logo"
                  className="w-20 h-20 rounded object-cover mb-4"
                />
              )}

              <div className="space-y-2">

                <p>
                  <b>Name:</b> {formData.name || "-"}
                </p>

                <p>
                  <b>Category:</b> {formData.categoryName || "-"}
                </p>

                <p>
  <b>City:</b>{" "}
  {
    formData.cityName ||
    formData.cityId?.name ||
    "-"
  }
</p>

                <p>
  <b>Address:</b>{" "}
  {[
    formData.address?.street,
    formData.address?.area,
    formData.address?.landmark,
  ]
    .filter(Boolean)
    .join(", ") || "-"}
</p>

<div className="mt-4">
  <h4 className="font-semibold mb-2">
    Location
    </h4>
    <p className="text-sm">
      <b>Address:</b> {locationText || "-"}
      </p>
      <p className="text-sm mt-1">
        <b>Coordinates:</b>{" "}
        {formData.location?.coordinates?.length === 2
        ? `${formData.location.coordinates[1].toFixed(6)},
        ${formData.location.coordinates[0].toFixed(6)}`
        : "-"}
        </p>
        </div>

              </div>

              <div className="mt-5">

                <h4 className="font-semibold mb-2">
                  Contact
                </h4>

                <p>
  <b>Phone:</b> {formData.phone || "-"}
</p>

<p>
  <b>WhatsApp:</b> {formData.whatsapp || "-"}
</p>

<p>
  <b>Alternate Mobile:</b>{" "}
  {formData.alternatePhone || "-"}
</p>

<p>
  <b>Landline:</b>{" "}
  {formData.landline || "-"}
</p>

<p>
  <b>Website:</b> {formData.website || "-"}
</p>

              </div>

              {formData.description && (
                <div className="mt-5">

                  <h4 className="font-semibold mb-2">
                    Description
                  </h4>

                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {formData.description}
                  </p>

                </div>
              )}


{/* ================= SERVICE AREAS PREVIEW ================= */}
<div className="mt-5">
  <h4 className="font-semibold mb-2">
    Service Areas
    </h4>
    
    {formData.serviceCoverage?.type === "all_india" ? (
      <p>
        All India
        </p>
      ) : formData.serviceCoverage?.type === "state" ? (
      <p>
        {formData.serviceCoverage?.states
        ?.map((s) => s.name)
        .join(", ") || "-"}
        </p>
      
      ) : formData.serviceCoverage?.type === "country" ? (
      <p>
        {formData.serviceCoverage?.countries
        ?.map((c) => c.name)
        .join(", ") || "-"}
        </p>
      ) : (
      <p>
        {formData.serviceCoverage?.cities
        ?.map((c) => c.name)
        .join(", ") || "-"}
        </p>
      )}
      </div>

              <div className="mt-5">

                <h4 className="font-semibold mb-2">
                  Images
                </h4>

                {images.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    No images uploaded
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">

                    {images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt=""
                        className="w-16 h-16 rounded object-cover"
                      />
                    ))}

                  </div>
                )}

              </div>

            </div>

          </div>

        </div>
      )}
    </BusinessSubmitter>
  );
};

export default AdminAddBusiness;