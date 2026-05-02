import BusinessForm from "../../components/business/BusinessForm";
import BusinessSubmitter from "../../components/business/BusinessSubmitter";

const AdminAddBusiness = () => {
  return (
    <BusinessSubmitter mode="admin">
      {(submitBusiness) => (
        <BusinessForm
          mode="admin"
          onSubmit={submitBusiness}
        />
      )}
    </BusinessSubmitter>
  );
};

export default AdminAddBusiness;