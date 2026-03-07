import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const SearchBar = ({ city, cities }) => {

  const navigate = useNavigate();

  const [query,setQuery] = useState("");
  const [suggestions,setSuggestions] = useState([]);
  const [show,setShow] = useState(false);

  useEffect(()=>{

    const fetchSuggestions = async ()=>{

      if(query.length < 2){
        setSuggestions([]);
        return;
      }

      try{

        const { data } = await axios.get(
          `/api/business/suggest?q=${query}`
        );

        setSuggestions(data.suggestions || []);

      }catch(err){
        console.log(err);
      }

    };

    const delay = setTimeout(fetchSuggestions,300);

    return ()=> clearTimeout(delay);

  },[query]);


  const handleSearch = (service)=>{

    if(!city) return alert("Please select city");

    const keyword = service || query;

    navigate(`/${city}/${keyword.toLowerCase()}`);

    setShow(false);
  };


  return (

    <div className="relative w-full max-w-xl mx-auto">

      <div className="flex gap-2">

        {/* CITY SELECT */}

        <select
          className="p-3 rounded text-black"
          value={city}
        >

          <option value="">City</option>

          {cities.map((c)=>(
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}

        </select>


        {/* SEARCH INPUT */}

        <input
          type="text"
          placeholder="Search plumber, doctor, electrician..."
          value={query}
          onChange={(e)=>{
            setQuery(e.target.value);
            setShow(true);
          }}
          className="flex-1 p-3 rounded text-black"
        />


        <button
          onClick={()=>handleSearch()}
          className="bg-yellow-400 text-black px-6 rounded font-semibold"
        >
          Search
        </button>

      </div>


      {/* SUGGESTIONS */}

      {show && suggestions.length > 0 && (

        <div className="absolute left-0 right-0 bg-white shadow-lg mt-2 rounded z-50">

          {suggestions.map((s,index)=>(
            <div
              key={index}
              onClick={()=>handleSearch(s)}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
            >
              🔍 {s}
            </div>
          ))}

        </div>

      )}

    </div>

  );
};

export default SearchBar;