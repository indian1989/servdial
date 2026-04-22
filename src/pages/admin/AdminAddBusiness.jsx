import BusinessForm from "../../components/business/BusinessForm";
import { addBusiness } from "../../api/adminAPI";
import { normalizeBusinessPayload } from "../../components/business/businessMapper";

const AdminAddBusiness = () => {
  return (
    <BusinessForm
      mode="admin"
      onSubmit={async (data) => {
        await addBusiness(normalizeBusinessPayload(data, "admin"));
        alert("Business added successfully!");
      }}
    />
  );
};

export default AdminAddBusiness;