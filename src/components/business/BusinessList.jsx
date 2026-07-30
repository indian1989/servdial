import React, {
  useEffect,
  useState,
  useContext
} from "react";

import API from "../../api/axios";
import BusinessCard from "./BusinessCard";
import { AuthContext } from "../../context/AuthContext";


const BusinessList = () => {

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const { user } = useContext(AuthContext);

  const userRole = user?.role || "user";



  useEffect(() => {


    const fetchBusinesses = async () => {


      try {


        setLoading(true);
        setError(null);



        const res = await API.get("/businesses");

        const businessList =
          res.data?.data ||
          res.data?.businesses ||
          [];

        setBusinesses(
          Array.isArray(businessList)
            ? businessList
            : []
        );



      } catch (err) {


        console.error(
          "❌ FETCH BUSINESS ERROR:",
          err
        );


        console.error(
          "❌ ERROR RESPONSE:",
          err.response?.data
        );


        setError(
          "Unable to load businesses. Please try again later."
        );


      } finally {


        setLoading(false);


      }

    };



    fetchBusinesses();


  }, []);




  if (loading) {

    return (
      <div className="text-center py-10 text-gray-500">
        Loading businesses...
      </div>
    );

  }




  if (error) {

    return (
      <div className="text-center py-10 text-red-500">
        {error}
      </div>
    );

  }




  if (!businesses.length) {

    return (
      <div className="text-center py-10 text-gray-500">
        No businesses found.
      </div>
    );

  }




  return (

    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        gap-4
      "
    >


      {
        businesses.map((b)=>{


          console.log(
            "🔥 PASSING TO CARD:",
            b.name,
            b.location
          );



          return (

            <BusinessCard
              key={b._id}
              business={b}
              userRole={userRole}
            />

          );


        })
      }


    </div>

  );


};



export default BusinessList;