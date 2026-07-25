import { useState } from "react";


const MenuManager = ({
  value = [],
  onChange,
}) => {


const [item,setItem] = useState({

name:"",
description:"",
price:"",
category:"",
image:"",
isAvailable:true

});



const handleChange=(e)=>{

setItem(prev=>({

...prev,
[e.target.name]:e.target.value

}));

};



const addItem=()=>{


if(!item.name || !item.price)
return;


onChange([
...value,
{
...item,
price:Number(item.price)
}
]);


setItem({

name:"",
description:"",
price:"",
category:"",
image:"",
isAvailable:true

});


};



const removeItem=(index)=>{

const updated=value.filter(
(_,i)=>i!==index
);

onChange(updated);

};



return (

<div className="mt-6 border rounded-xl p-5">


<h3 className="text-lg font-semibold mb-4">
🍽 Food Menu
</h3>



<div className="grid gap-3">


<input
name="name"
value={item.name}
onChange={handleChange}
placeholder="Food Name"
className="border rounded-lg p-3"
/>



<input
name="category"
value={item.category}
onChange={handleChange}
placeholder="Category (Pizza, Starter...)"
className="border rounded-lg p-3"
/>



<input
name="price"
type="number"
value={item.price}
onChange={handleChange}
placeholder="Price"
className="border rounded-lg p-3"
/>



<input
name="image"
value={item.image}
onChange={handleChange}
placeholder="Image URL"
className="border rounded-lg p-3"
/>



<textarea
name="description"
value={item.description}
onChange={handleChange}
placeholder="Description"
className="border rounded-lg p-3"
/>



<button
type="button"
onClick={addItem}
className="
bg-orange-600
text-white
rounded-lg
py-2
"
>

+ Add Menu Item

</button>


</div>



<div className="mt-6 space-y-3">


{
value.length===0 ?

<p className="text-gray-400">
No menu items added
</p>


:

value.map((menu,index)=>(


<div
key={index}
className="
border
rounded-xl
p-3
flex
gap-4
items-center
"
>


{
menu.image &&

<img
src={menu.image}
className="
w-20
h-20
rounded-lg
object-cover
"
/>

}



<div className="flex-1">

<h4 className="font-semibold">
{menu.name}
</h4>


<p className="text-sm text-gray-500">
{menu.category}
</p>


<p className="text-orange-600 font-bold">
₹{menu.price}
</p>

</div>



<button
type="button"
onClick={()=>removeItem(index)}
className="text-red-500"
>

Delete

</button>


</div>


))

}


</div>


</div>

);

};


export default MenuManager;