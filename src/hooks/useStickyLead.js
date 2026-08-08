import {
useState,
useEffect
} from "react";


const useStickyLead = (
threshold = 500
)=>{


const [
showStickyLead,
setShowStickyLead
]=useState(false);



useEffect(()=>{


const handleScroll = ()=>{


setShowStickyLead(
window.scrollY > threshold
);


};



window.addEventListener(
"scroll",
handleScroll
);



return ()=>{

window.removeEventListener(
"scroll",
handleScroll
);

};


},[
threshold
]);



return showStickyLead;


};


export default useStickyLead;