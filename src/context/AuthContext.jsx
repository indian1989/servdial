import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  const [user,setUser] = useState(null);
  const [loading,setLoading] = useState(true);



  // ================= LOAD USER =================

  useEffect(()=>{

    try{

      const saved =
      localStorage.getItem("servdial_user");


      if(saved){

        const parsed =
        JSON.parse(saved);


        if(parsed?.token && parsed?.user){

          setUser(parsed.user);

        }
        else{

          localStorage.removeItem(
            "servdial_user"
          );

        }

      }


    }
    catch(error){

      localStorage.removeItem(
        "servdial_user"
      );

    }
    finally{

      setLoading(false);

    }


  },[]);





  // ================= LOGIN =================

  const login = async(credentials)=>{

    try{

      const {data}=await API.post(
        "/auth/login",
        credentials
      );


      const token=data?.token;
      const userData=data?.user;


      if(!token || !userData){

        return {
          success:false,
          message:"Invalid login response"
        };

      }



      const payload={
        token,
        user:userData
      };



      localStorage.setItem(
        "servdial_user",
        JSON.stringify(payload)
      );


      setUser(userData);



      return {
        success:true,
        user:userData
      };


    }
    catch(error){

      return {

        success:false,

        message:
        error.response?.data?.message ||
        "Login failed"

      };

    }

  };






  // ================= REGISTER =================

  const register = async(formData)=>{


    try{


      const {data}=await API.post(
        "/auth/register",
        formData
      );


      const token=data?.token;
      const userData=data?.user;



      if(!token || !userData){

        return {
          success:false,
          message:"Invalid register response"
        };

      }



      const payload={

        token,

        user:userData

      };



      localStorage.setItem(
        "servdial_user",
        JSON.stringify(payload)
      );



      setUser(userData);



      return {

        success:true,

        user:userData

      };



    }
    catch(error){


      return {

        success:false,

        message:
        error.response?.data?.message ||
        "Registration failed"

      };


    }


  };






  // ================= LOGOUT =================

  const logout=()=>{

    localStorage.removeItem(
      "servdial_user"
    );


    setUser(null);

  };






  const value={

    user,

    setUser,

    login,

    register,

    logout,

    loading,

    isAuthenticated:!!user

  };



  return (

    <AuthContext.Provider value={value}>

      {!loading && children}

    </AuthContext.Provider>

  );

};




export const useAuth=()=>useContext(AuthContext);