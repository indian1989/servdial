import { useState } from "react";
import BusinessForm from "../../components/business/BusinessForm";
import BusinessSubmitter from "../../components/business/BusinessSubmitter";
import BusinessHoursManager from "../../components/BusinessHoursManager";
import BusinessMediaManager from "../../components/BusinessMediaManager";

const ProviderAddBusiness = () => {
  const [hours, setHours] = useState({});
  const [images, setImages] = useState([]);
  const [logo, setLogo] = useState("");

  return (
    <BusinessSubmitter mode="provider">
      {(submitBusiness) => (
        <BusinessForm
          mode="provider"
          onSubmit={(data) =>
            submitBusiness({
              ...data,
              logo,
              images,
              businessHours: hours,
            })
          }
          initialData={{
            boost: false,
          }}
        >
          <BusinessMediaManager value={images} onChange={setImages} />
          <BusinessHoursManager value={hours} onChange={setHours} />
        </BusinessForm>
      )}
    </BusinessSubmitter>
  );
};

export default ProviderAddBusiness;