import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({

  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  role: "user",

  emailOtp: "",
  phoneOtp: ""

});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [phoneSent, setPhoneSent] = useState(false);

  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailTimer,setEmailTimer] = useState(0);
  const [phoneTimer,setPhoneTimer] = useState(0);
  const [emailLoading,setEmailLoading] = useState(false);
  const [phoneLoading,setPhoneLoading] = useState(false);


    useEffect(()=>{

      if(emailTimer > 0){

      const timer = setTimeout(()=>{

      setEmailTimer(prev=>prev-1);

      },1000);


      return ()=>clearTimeout(timer);

      }

      },[emailTimer]);


      useEffect(()=>{

      if(phoneTimer > 0){

      const timer = setTimeout(()=>{

      setPhoneTimer(prev=>prev-1);

      },1000);


      return ()=>clearTimeout(timer);

      }

      },[phoneTimer]);

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

      }


      if(name==="phone"){

      setPhoneVerified(false);
      setPhoneSent(false);
      setPhoneTimer(0);

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

  const sendPhoneOTP = async()=>{

    try{

    setPhoneLoading(true);
    setError("");


    setFormData(prev=>({
    ...prev,
    phoneOtp:""
    }));


    await API.post(
    "/auth/send-phone-otp",
    {
    phone:formData.phone
    }
    );

    setPhoneSent(true);
    startTimer(setPhoneTimer);

    toast.success(
    "Phone OTP sent successfully"
    );


    }
    catch(err){

    setPhoneSent(false);
    setPhoneTimer(0);


    setError(
    err.response?.data?.message ||
    "Failed to send phone OTP"
    );

    }
    finally{

    setPhoneLoading(false);

    }

    };


  const startTimer = (setter)=>{

    setter(60);

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


  }
  catch(err){

  setError(
  err.response?.data?.message ||
  "Invalid email OTP"
  );

  }


  };


  const verifyPhoneOTP = async()=>{


  try{


  await API.post(
  "/auth/verify-otp",
  {
  phone:formData.phone,
  otp:formData.phoneOtp,
  type:"phone_verification"
  }
  );


  setPhoneVerified(true);


  }
  catch(err){

  setError(
  err.response?.data?.message ||
  "Invalid phone OTP"
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


  if(!phoneVerified){

  setError(
  "Please verify phone first"
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

      phone: formData.phone,

      password: formData.password,

      role: formData.role,

      emailOtp: formData.emailOtp,

      phoneOtp: formData.phoneOtp

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

         <div className="flex gap-2">

          <input
          type="text"
          name="phoneOtp"
          placeholder="Phone OTP"
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2"
          />


          {
          !phoneVerified && (

          <button
            type="button"
            disabled={
            phoneLoading || phoneVerified
            }
            onClick={
            phoneSent
            ?
            verifyPhoneOTP
            :
            sendPhoneOTP
            }
            className="bg-blue-600 text-white px-4 rounded-lg disabled:bg-gray-400"
            >

            {
            phoneLoading
            ?
            "Sending..."
            :
            phoneSent
            ?
            "Verify"
            :
            "Send OTP"
            }

            </button>

          )

          }



          {
          phoneSent && !phoneVerified && phoneTimer===0 && (

          <button
          type="button"
          onClick={sendPhoneOTP}
          className="bg-green-600 text-white px-4 rounded-lg"
          >

          Resend OTP

          </button>

          )

          }



          {
          phoneVerified && (

          <span className="text-green-600 font-semibold px-3 flex items-center">

          Verified ✅

          </span>

          )

          }


          </div>

          {
            phoneTimer > 0 && !phoneVerified && (
            <span className="text-sm text-gray-500 px-2">
            00:{phoneTimer}
            </span>
            )
            }

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