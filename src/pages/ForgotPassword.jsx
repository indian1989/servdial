import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";


const ForgotPassword = () => {

const navigate = useNavigate();


const [step,setStep] = useState(1);

const [email,setEmail] = useState("");
const [otp,setOtp] = useState("");

const [password,setPassword] = useState("");
const [confirmPassword,setConfirmPassword] = useState("");

const [message,setMessage] = useState("");
const [error,setError] = useState("");

const [loading,setLoading] = useState(false);



// ================= SEND OTP =================

const sendOTP = async(e)=>{

e.preventDefault();

setError("");
setMessage("");
setLoading(true);


try{


await API.post(
"/auth/send-forgot-password-otp",
{
email:email.trim().toLowerCase()
}
);


setMessage(
"OTP sent to your email"
);


setStep(2);


}
catch(err){

setError(
err.response?.data?.message ||
"Failed to send OTP"
);

}
finally{

setLoading(false);

}

};



// ================= VERIFY OTP =================

const verifyOTP = async(e)=>{

e.preventDefault();

setError("");
setLoading(true);


try{


await API.post(
"/auth/verify-forgot-password-otp",
{

email:
email.trim().toLowerCase(),

otp

}
);


setMessage(
"OTP verified"
);


setStep(3);


}
catch(err){

setError(
err.response?.data?.message ||
"Invalid OTP"
);

}
finally{

setLoading(false);

}

};



// ================= RESET PASSWORD =================

const resetPassword = async(e)=>{

e.preventDefault();


setError("");


if(password !== confirmPassword){

setError(
"Passwords do not match"
);

return;

}


setLoading(true);


try{


await API.post(
"/auth/reset-password",
{

email:
email.trim().toLowerCase(),

password

}
);



setMessage(
"Password updated successfully"
);



setTimeout(()=>{

navigate("/login");

},1500);



}
catch(err){

setError(
err.response?.data?.message ||
"Password update failed"
);

}
finally{

setLoading(false);

}

};



return (

<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">


<div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">


<h2 className="text-xl font-bold text-center mb-6">

Forgot Password

</h2>



{
message &&

<p className="text-green-600 text-center mb-4">

{message}

</p>

}



{
error &&

<p className="text-red-500 text-center mb-4">

{error}

</p>

}




{/* STEP 1 */}

{
step===1 &&

<form onSubmit={sendOTP}>


<input

type="email"

placeholder="Enter registered email"

value={email}

onChange={
e=>setEmail(e.target.value)
}

required

className="w-full border p-3 rounded mb-4"

/>


<button

disabled={loading}

className="w-full bg-blue-600 text-white p-3 rounded"

>


{
loading
?
"Sending OTP..."
:
"Send OTP"
}


</button>


</form>

}





{/* STEP 2 */}

{
step===2 &&


<form onSubmit={verifyOTP}>


<input

type="text"

placeholder="Enter OTP"

value={otp}

onChange={
e=>setOtp(e.target.value)
}

required

className="w-full border p-3 rounded mb-4"

/>


<button

disabled={loading}

className="w-full bg-blue-600 text-white p-3 rounded"

>


{
loading
?
"Verifying..."
:
"Verify OTP"
}


</button>


</form>

}




{/* STEP 3 */}

{
step===3 &&


<form onSubmit={resetPassword}>


<input

type="password"

placeholder="New Password"

value={password}

onChange={
e=>setPassword(e.target.value)
}

required

className="w-full border p-3 rounded mb-4"

/>




<input

type="password"

placeholder="Confirm Password"

value={confirmPassword}

onChange={
e=>setConfirmPassword(e.target.value)
}

required

className="w-full border p-3 rounded mb-4"

/>



<button

disabled={loading}

className="w-full bg-green-600 text-white p-3 rounded"

>


{
loading
?
"Updating..."
:
"Update Password"
}


</button>


</form>

}



</div>


</div>

);

};


export default ForgotPassword;