import { Link } from "react-router-dom";

const ProviderSidebar = () => {

const user = JSON.parse(localStorage.getItem("servdial_user"));

return (

<div className="w-64 bg-white border-r p-6">

<h2 className="text-xl font-bold mb-6">
Provider Panel
</h2>

<p className="text-sm text-gray-500 mb-6">
{user?.name}
</p>

<nav className="flex flex-col gap-3">

<Link
to="/provider/dashboard"
className="hover:bg-gray-100 p-2 rounded"
>
Dashboard
</Link>

<Link
to="/provider/businesses"
className="hover:bg-gray-100 p-2 rounded"
>
My Businesses
</Link>

<Link
to="/provider/add-business"
className="hover:bg-gray-100 p-2 rounded"
>
Add Business
</Link>

</nav>

</div>

);

};

export default ProviderSidebar;