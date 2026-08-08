import { useState } from "react";
import API from "../api/axios";


const useBusinessReview = ({
 businessId,
 user,
 navigate,
 refresh
}) => {


const [showLoginPrompt,setShowLoginPrompt]=useState(false);

const [pendingReview,setPendingReview]=useState(null);



const handleReviewSubmit = async(data)=>{


if(!user){

setPendingReview(data);

setShowLoginPrompt(true);

return;

}


try{


await API.post("/reviews",{

businessId,

...data

});


refresh?.();


}catch(error){

console.log(
"Review submit error",
error
);

}


};



const handleLoginRedirect=()=>{


setShowLoginPrompt(false);


navigate("/login",{

state:{

from:window.location.pathname,

pendingReview

}

});


};



return {


showLoginPrompt,

setShowLoginPrompt,


pendingReview,


handleReviewSubmit,


handleLoginRedirect


};


};


export default useBusinessReview;