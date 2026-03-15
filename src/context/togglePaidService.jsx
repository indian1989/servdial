import API from "../api/axios";

export const togglePaidService = async (id, serviceKey, businesses, setBusinesses) => {
  // Find current business
  const currentBusiness = businesses.find((b) => b._id === id);
  if (!currentBusiness) return;

  const updatedPaidServices = {
    ...currentBusiness.paidServices,
    [serviceKey]: !currentBusiness.paidServices?.[serviceKey],
  };

  // Optimistic UI Update
  setBusinesses((prev) =>
    prev.map((b) =>
      b._id === id ? { ...b, paidServices: updatedPaidServices } : b
    )
  );

  // Persist to Backend
  try {
    await API.put(`/business/${id}`, { paidServices: updatedPaidServices });
  } catch (err) {
    console.error("Failed to toggle paid service:", err);

    // Rollback on error
    setBusinesses((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, paidServices: currentBusiness.paidServices } : b
      )
    );
  }
};