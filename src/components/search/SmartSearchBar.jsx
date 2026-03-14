import { useNavigate } from "react-router-dom";

const SmartSearchBar = ({
  query,
  setQuery,
  onSearch
}) => {

const navigate = useNavigate();

const submitSearch = (e)=>{

e.preventDefault();

if(!query) return;

onSearch(query);

};

return(

<div className="relative w-full">

<form onSubmit={submitSearch}>

<input
value={query}
onChange={(e)=>setQuery(e.target.value)}
placeholder="Search for services, businesses..."
className="w-full outline-none"
/>

</form>

</div>

);

};

export default SmartSearchBar;