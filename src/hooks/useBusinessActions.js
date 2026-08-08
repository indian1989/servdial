import {
useState
} from "react";


const useBusinessActions = ({
business,
trackEvent,
showToastMsg
})=>{


const [
phoneRevealed,
setPhoneRevealed
]=useState(false);



const whatsappNumber =
(
business?.whatsapp ||
business?.phone ||
""
)
.replace(/\D/g,"");



const handleCall = ()=>{


trackEvent("call");



if(!phoneRevealed){

setPhoneRevealed(true);

showToastMsg(
"Number revealed 👇"
);

return;

}



if(business?.phone){


showToastMsg(
"Connecting..."
);



setTimeout(()=>{


window.location.href =
`tel:${business.phone}`;


},500);


}


};



const handleWhatsApp = ()=>{


trackEvent("whatsapp");



if(whatsappNumber){


window.open(

`https://wa.me/91${whatsappNumber}`,

"_blank"

);


}


};



return {

handleCall,

handleWhatsApp,

phoneRevealed

};


};


export default useBusinessActions;