import {
useState,
useEffect
} from "react";

import API from "../api/axios";


const useCategoryBusinessCount = (business)=>{


const [categoryCount,setCategoryCount]=useState(null);



useEffect(()=>{


if(
!business?.categoryId?._id ||
!business?.cityId?._id
){

return;

}



const fetchCount=async()=>{


try{


const res = await API.get(
"/businesses/count/all",
{

params:{

categoryId:
business.categoryId._id,

cityId:
business.cityId._id

}

}
);


setCategoryCount(
res.data?.data?.count || 0
);



}catch(error){

console.log(
"Category count error",
error
);

}


};



fetchCount();



},[
business?.categoryId?._id,
business?.cityId?._id
]);



return categoryCount;


};


export default useCategoryBusinessCount;