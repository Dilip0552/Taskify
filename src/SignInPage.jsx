import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useMutation } from "@tanstack/react-query";
import PopUp from "./PopUp";
import accountability from "./assets/accountability.png"
import searchGoogle from "./assets/search (2).png"
import remove from "./assets/remove.png"
import view from "./assets/view.png"
import hide from "./assets/hide.png"
import Loader from "./Loader";
function SignInPage({ setEntryPoint }) {
    const navigate = useNavigate();
    const [popStatus, setPopStatus] = useState("close");
    const [popupMsg, setPopupMsg] = useState("Please fill all the credentials correctly");
    const [siData, setSIData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);


    const handleChange = (event) => {
        setSIData({ ...siData, [event.target.name]: event.target.value });
    };

    const loginUser = async () => {
  const form = new URLSearchParams();
  form.append("username", siData.email); 
  form.append("password", siData.password);

  const res = await fetch("https://taskify-la02.onrender.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: form.toString()
  });

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
};



    const mutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
             setLoading(false);
            if (data.access_token) {
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user_id", data.user_id);
                navigate("/mytasks");
            } else {
                setPopStatus("open");
                setPopupMsg("Login failed. Invalid credentials.");
            }
        },
        onError: (error) => {
             setLoading(false);
            setPopStatus("open");
            setPopupMsg(error.message || "Something went wrong");
        }
    });

    const handleLogin = () => {
        if (siData.email.trim() === "" || siData.password.trim() === "") {
            setPopStatus("open");
        } else {
            setLoading(true);
            mutation.mutate();
        }
    };
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div id="outer-most">
            <div id="cp"><img src={accountability} alt="logo" /></div>
            <div id="top-bg"></div>

            <div id="bottom-bg">
                <div>Log in to your account</div>
                <div id="s-with-g">
                    <img src={searchGoogle} alt="google icon" />
                    <span>Sign in with Google</span>
                </div>
                <div id="hr-or">or</div>
                <div id="login-email-d" className="email-password">
                    <div>Email</div>
                    <div className="wrapper">
                        <input type="email" id="login-email" required className="m-inp" name="email" value={siData.email} onChange={handleChange} />
                        <img src={remove} id="email-r" className="input-icon" alt="icon" onClick={()=>{
                            setSIData({ ...siData, ["email"]: "" });
                        }}/>
                    </div>
                </div>
                <div id="login-password-d" className="email-password">
                    <div>Password</div>
                    <div className="wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="login-password"
                            required
                            className="m-inp"
                            name="password"
                            value={siData.password}
                            onChange={handleChange}
                        />

                        <img
                            src={showPassword ? view : hide}
                            id="password-v"
                            className="input-icon"
                            alt="icon"
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{ cursor: "pointer" }}
                        />
                        </div>

                </div>
                <div id="remember-fpass">
                    <div id="remember">
                        <label style={{ cursor: "pointer" }}>
                            <input type="checkbox" /> <span>Remember me</span>
                        </label>
                    </div>
                    <div id="fpass">
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>
                </div>
                <div id="login-div" className="login-sign-up">
                    <button id="login-btn" onClick={(event) => {
                        event.preventDefault();
                        handleLogin();
                    }}>Log in</button>
                </div>
                <div id="b-line">
                    <div>Don't have an account</div>
                    <Link to="/create-account" onClick={() => {
                        setEntryPoint("sign-up")
                    }}>Create</Link>
                </div>
            </div>
            {popStatus === "open" && <PopUp message={popupMsg} popStatus={setPopStatus} />}
            {/* {loading && <div style={{position:"absolute",top:"50%",right:"50%",transform:"translate(50%,-50%)"}}><Loader/></div>} */}
            {loading && <div style={{width:"100vw", height:"100vh",position:"absolute",top:"0",right:"0",display:"flex",alignItems:"center",zIndex:"999",justifyContent:"center",backgroundColor:"rgba(119, 119, 119, 0.5)"}}><Loader/></div>}
        </div>
    );
}

export default SignInPage;
