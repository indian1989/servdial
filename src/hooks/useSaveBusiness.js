import { useState } from "react";
import API from "../api/axios";

const useSaveBusiness = ({
  businessId,
  navigate,
  showToastMsg
}) => {

const [isSaved,setIsSaved] = useState(false);
const [saving,setSaving] = useState(false);


const handleSave = async()=>{

try{

const user = JSON.parse(
localStorage.getItem("servdial_user")
);


if(!user){
 navigate("/login");
 return;
}


setSaving(true);


if(isSaved){

const res = await API.post(
"/user/remove-saved-business",
{
businessId
}
);


if(res.data.success){

setIsSaved(false);

showToastMsg(
"Removed from saved"
);

}


}else{


const res = await API.post(
"/user/save-business",
{
businessId
}
);


if(res.data.success){

setIsSaved(true);

showToastMsg(
"Business saved ❤️"
);

}

}


}catch(error){

console.log(error);

showToastMsg(
"Save failed"
);

}
finally{

setSaving(false);

}

};



return {
isSaved,
setIsSaved,
saving,
handleSave
};


};


export default useSaveBusiness;