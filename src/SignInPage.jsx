import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useMutation } from "@tanstack/react-query";
import PopUp from "./PopUp";

function SignInPage({ setEntryPoint }) {
    const navigate = useNavigate();
    const [popStatus, setPopStatus] = useState("close");
    const [popupMsg, setPopupMsg] = useState("Please fill all the credentials correctly");
    const [siData, setSIData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (event) => {
        setSIData({ ...siData, [event.target.name]: event.target.value });
    };

    const loginUser = async () => {
  const form = new URLSearchParams();
  form.append("username", siData.email); 
  form.append("password", siData.password);

  const res = await fetch("http://127.0.0.1:8000/api/token", {
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
            setPopStatus("open");
            setPopupMsg(error.message || "Something went wrong");
        }
    });

    const handleLogin = () => {
        if (siData.email.trim() === "" || siData.password.trim() === "") {
            setPopStatus("open");
        } else {
            mutation.mutate();
        }
    };
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div id="outer-most">
            <div id="cp"><img src="src/assets/accountability.png" alt="logo" /></div>
            <div id="top-bg"></div>

            <div id="bottom-bg">
                <div>Log in to your account</div>
                <div id="s-with-g">
                    <img src="src/assets/search (2).png" alt="google icon" />
                    <span>Sign in with Google</span>
                </div>
                <div id="hr-or">or</div>
                <div id="login-email-d" className="email-password">
                    <div>Email</div>
                    <div className="wrapper">
                        <input type="email" id="login-email" required className="m-inp" name="email" value={siData.email} onChange={handleChange} />
                        <img src="src/assets/remove.png" id="email-r" className="input-icon" alt="icon" onClick={()=>{
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
                            src={showPassword ? "src/assets/view.png" : "src/assets/hide.png"}
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
        </div>
    );
}

export default SignInPage;
