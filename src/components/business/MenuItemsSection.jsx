const MenuItemsSection = ({ business }) => {

  const menu = business?.menu || [];


  return (

<section
id="menu-items"
className="
bg-white
rounded-2xl
shadow
p-6
mt-6
"
>

<h2 className="text-xl font-bold">
🍽️ Menu Items
</h2>


{
menu.length === 0 ? (

<p className="text-gray-500 mt-4">

No menu added yet.

<br/>

Business owner can add menu items later.

</p>


) : (


<div className="
grid
grid-cols-1
md:grid-cols-2
gap-5
mt-5
">


{
menu
.filter(item=>item.isAvailable)
.map((item,index)=>(


<div
key={index}
className="
border
rounded-xl
overflow-hidden
"
>


{
item.image &&

<img

src={item.image}

alt={item.name}

className="
w-full
h-48
object-cover
"

/>

}


<div className="p-4">


<div className="
flex
justify-between
gap-3
">


<h3 className="
font-semibold
text-lg
">

{item.name}

</h3>


<span className="
font-bold
text-orange-600
">

₹{item.price}

</span>


</div>



{
item.category &&

<p className="
text-sm
text-gray-500
mt-1
">

{item.category}

</p>

}



<p className="
text-gray-600
mt-2
">

{item.description}

</p>



</div>


</div>


))

}


</div>


)


}


</section>

);

};


export default MenuItemsSection;