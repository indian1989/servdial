import { useCallback, useRef } from "react";
import API from "../api/axios";


const useBusinessAnalytics = (businessId)=>{

const analyticsRef = useRef({});


const trackEvent = useCallback(
(type)=>{

if(!businessId) return;


const key = `${businessId}-${type}`;


if(
 analyticsRef.current[key] &&
 Date.now() - analyticsRef.current[key] < 10000
){
 return;
}


analyticsRef.current[key]=Date.now();



API.post(
 `/businesses/analytics/${businessId}`,
 {
  type
 }
)
.catch(()=>{});


},
[businessId]
);


return {
 trackEvent
};

};


export default useBusinessAnalytics;