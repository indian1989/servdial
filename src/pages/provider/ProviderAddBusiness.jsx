import { useState } from "react";
import API from "../../api/axios";
import BusinessForm from "../../components/business/BusinessForm";
import BusinessHoursManager from "../../components/BusinessHoursManager";
import BusinessMediaManager from "../../components/BusinessMediaManager";
import { normalizeBusinessPayload } from "../../components/business/BusinessMapper";

const ProviderAddBusiness = () => {
  const [hours, setHours] = useState({});
  const [images, setImages] = useState([]);
  const [logo, setLogo] = useState("");

  const handleSubmit = async (data) => {
    try {
      const user = JSON.parse(localStorage.getItem("servdial_user"));

      const payload = normalizeBusinessPayload(
        {
          ...data,
          logo,
          images,
          businessHours: hours,
        },
        "provider"
      );

      await API.post("/provider/businesses", payload, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      alert("Business added successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to add business");
    }
  };

  return (
    <BusinessForm
      mode="provider"
      onSubmit={handleSubmit}
      initialData={{
        boost: false,
      }}
    >
      {/* PROVIDER ONLY FEATURES */}

      <BusinessMediaManager value={images} onChange={setImages} />

      <BusinessHoursManager value={hours} onChange={setHours} />
    </BusinessForm>
  );
};

export default ProviderAddBusiness;