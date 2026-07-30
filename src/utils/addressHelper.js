// frontend/src/utils/addressHelper.js
export const normalizeAddress = (address) => {
if (!address) {

return {
     street: "",
     area: "",
     landmark: "",
   };
}

//Old string data
if (typeof address === "string") {
  return {
    street: address,
     area: "",
     landmark: "",
   };
}

// New object data
return {
  street: address.street || "",
  area: address.area || "",
  landmark: address.landmark || "",
  };
 };


 
export const formatBusinessAddress = (address = {}) => {

  if (!address) return "";


  // New object structure
  if (typeof address === "object") {

    return [
      address.street,
      address.area,
      address.landmark,
    ]
      .filter(
        item =>
          item &&
          typeof item === "string" &&
          item.trim()
      )
      .join(", ");
  }


  // Old string data compatibility
  if (typeof address === "string") {
    return address.trim();
  }


  return "";

};