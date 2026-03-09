import { useEffect } from "react";
import API from "../../api/axios";

const TrackBusinessView = ({ businessId }) => {

useEffect(()=>{

API.post("/analytics/view",{
business:businessId
});

},[businessId]);

return null;

};

export default TrackBusinessView;