import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Select from "react-select";


const Register = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({

    name:"",
    email:"",
    phone:"",
    password:"",
    confirmPassword:"",
    role:"user",

    businessName:"",
    categoryId:"",
    cityId:"",

    emailOtp:"",

    });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const [emailVerified, setEmailVerified] = useState(false);
  const [emailTimer,setEmailTimer] = useState(0);
  const [emailLoading,setEmailLoading] = useState(false);


    useEffect(()=>{

      if(emailTimer > 0){

      const timer = setTimeout(()=>{

      setEmailTimer(prev=>prev-1);

      },1000);


      return ()=>clearTimeout(timer);

      }

      },[emailTimer]);


      const [categories,setCategories] = useState([]);
      const [cities,setCities] = useState([]);

      
      const categoryOptions = categories.map(cat => ({
        value: cat._id,
        label: cat.name
      }));

      const cityOptions = cities.map(city => ({
        value: city._id,
        label: city.displayName
      }));

      useEffect(()=>{

      const loadOptions = async()=>{

      try{

      const [catRes,cityRes] = await Promise.all([

      API.get("/categories"),

      API.get("/cities")

      ]);


      const allCategories = catRes.data.data || [];

      const subCategories = allCategories.filter(
 cat =>
   cat.parentCategory !== null ||
   cat.level === 1
);

      setCategories(subCategories);


      setCities(
      (cityRes.data.data || []).map(city=>({
        ...city,
        displayName:`${city.name} (${city.state})`
      }))
      );


      }
      catch(err){

      console.log(
      "Dropdown load error",
      err
      );

      }

      };


      loadOptions();


      },[]);

      const handleChange = (e) => {

      const {
      name,
      value
      }=e.target;


      setFormData(prev=>({
      ...prev,
      [name]:value
      }));


      if(name==="email"){

        setEmailVerified(false);
        setEmailSent(false);
        setEmailTimer(0);

        setFormData(prev=>({
        ...prev,
        emailOtp:""
        }));

        }

      };

  const sendEmailOTP = async()=>{

    try{

    setEmailLoading(true);
    setError("");


    setFormData(prev=>({
    ...prev,
    emailOtp:""
    }));


    await API.post(
    "/auth/send-registration-otp",
    {
    email: formData.email
    }
    );

    setEmailSent(true);
    startTimer(setEmailTimer);


    toast.success(
    "Email OTP sent successfully"
    );


    }
    catch(err){

    setEmailSent(false);
    setEmailTimer(0);

    setError(
    err.response?.data?.message ||
    "Failed to send email OTP"
    );

    }
    finally{

    setEmailLoading(false);

    }

    };


  const verifyEmailOTP = async()=>{


  try{


  await API.post(
  "/auth/verify-otp",
  {
  email:formData.email,
  otp:formData.emailOtp,
  type:"email_verification"
  }
  );


  setEmailVerified(true);
  setEmailTimer(0);


  }
  catch(err){

  setError(
  err.response?.data?.message ||
  "Invalid email OTP"
  );

  }


  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if(!emailVerified){

  setError(
  "Please verify email first"
  );

  return;

  }


    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { data } = await API.post(
        "/auth/register",
        {

        name: formData.name,

        email: formData.email,

        phone:
        formData.phone
        .trim()
        .replace(/\D/g,"")
        .slice(-10),

        password: formData.password,

        role: formData.role,


        businessName:
        formData.businessName,

        categoryId:
        formData.role==="provider"
        ?
        formData.categoryId
        :
        undefined,

        cityId:
        formData.role==="provider"
        ?
        formData.cityId
        :
        undefined,

        emailOtp: formData.emailOtp

        }
        );

      toast.success(
  "Registration successful! Welcome to ServDial 🎉"
);
setError("");

localStorage.setItem(
  "servdial_user",
  JSON.stringify({
    token:data.token,
    user:data.user
  })
);


setUser(data.user);


setTimeout(()=>{

navigate("/");

},1500); // redirect to homepage

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create ServDial Account</h2>
     
      <p className="text-xs text-gray-500 mb-4">
        <span className="text-red-500">*</span> Required fields
      </p>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        <div className="flex gap-2">

        <input
        type="text"
        name="emailOtp"
        placeholder="Email OTP"
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2"
        />


        {
        !emailVerified && (

        <button
          type="button"
          disabled={
          emailLoading || emailVerified
          }
          onClick={
          emailSent
          ?
          verifyEmailOTP
          :
          sendEmailOTP
          }
          className="bg-blue-600 text-white px-4 rounded-lg disabled:bg-gray-400"
          >

          {
          emailLoading
          ?
          "Sending..."
          :
          emailSent
          ?
          "Verify"
          :
          "Send OTP"
          }

          </button>

        )

        }


        {
        emailSent && !emailVerified && emailTimer===0 && (

        <button
        type="button"
        onClick={sendEmailOTP}
        className="bg-green-600 text-white px-4 rounded-lg"
        >
        Resend OTP
        </button>

        )
        }


        {
        emailVerified && (

        <span className="text-green-600 font-semibold px-3 flex items-center">

        Verified ✅

        </span>

        )

        }


        </div>

        {
          emailTimer > 0 && !emailVerified && (
          <span className="text-sm text-gray-500 px-2">
          00:{emailTimer}
          </span>
          )
          }

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              placeholder="Enter 10-digit phone number"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1">Register As</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="user">User</option>
              <option value="provider">Provider</option>
            </select>
          </div>

          {/* Provider Details */}

        {
        formData.role==="provider" && (

        <div className="space-y-5">


        <div>
        <label className="block text-sm font-medium mb-1">
        Business Name <span className="text-red-500">*</span>
        </label>

        <input

        type="text"

        name="businessName"

        value={formData.businessName}

        onChange={handleChange}

        required

        className="w-full border rounded-lg px-3 py-2"

        />

        </div>

        <div>

        <label className="block text-sm font-medium mb-1">

        Business Category <span className="text-red-500">*</span>

        </label>


        <Select

          options={categoryOptions}

          value={
          categoryOptions.find(
          option =>
          option.value === formData.categoryId
          )
          }

          onChange={(selected)=>{

          setFormData(prev=>({

          ...prev,

          categoryId:selected?.value || ""

          }));

          }}

          placeholder="Search Category..."

          isSearchable

          />


        </div>



        <div>

        <label className="block text-sm font-medium mb-1">

        City <span className="text-red-500">*</span>

        </label>


        <Select

          options={cityOptions}

          value={
          cityOptions.find(
          option =>
          option.value === formData.cityId
          )
          }

          onChange={(selected)=>{

          setFormData(prev=>({

          ...prev,

          cityId:selected?.value || ""

          }));

          }}

          placeholder="Search City..."

          isSearchable

          />


        </div>

        </div>

        )
        }

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition ${
              loading ? "cursor-not-allowed bg-gray-400" : ""
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;