import { useState } from "react";


const useBusinessShare = (business)=>{


const [
showShareMenu,
setShowShareMenu
]=useState(false);



const currentUrl =
typeof window !== "undefined"
? window.location.href
: "https://servdial.com";



const openShareMenu = ()=>{

setShowShareMenu(true);

};



const closeShareMenu = ()=>{

setShowShareMenu(false);

};



const shareData = {

title:
business?.name || "ServDial Business",

text:
`Check this business on ServDial - ${business?.name}`,

url: currentUrl

};



return {


showShareMenu,

setShowShareMenu,

openShareMenu,

closeShareMenu,

currentUrl,

shareData


};


};


export default useBusinessShare;