import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PopUp from './PopUp';
import { useMutation } from '@tanstack/react-query';
import accountability from "./assets/accountability.png"
import searchGoogle from "./assets/search (2).png"
import remove from "./assets/remove.png"
import view from "./assets/view.png"
import hide from "./assets/hide.png"
import Loader from './Loader';
function SignUpPage({ setEntryPoint }) {
    const navigate = useNavigate();
    const [suData, setSUData] = useState({
        fullName: "",
        email: "",
        password: "",
        cnfPassword: ""
    });
    const [errors, setErrors] = useState(true);
    const [popStatus, setPopStatus] = useState("close");
    const [popupMsg, setPopupMsg] = useState("Please fill all the credentials correctly");

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleChange = (event) => {
        const updatedData = {
            ...suData,
            [event.target.name]: event.target.value,
        };

        setSUData(updatedData);

        if (
            updatedData.fullName !== "" &&
            validateEmail(updatedData.email) &&
            updatedData.password === updatedData.cnfPassword &&
            updatedData.password !== ""
        ) {
            setErrors(false);
        } else {
            setErrors(true);
        }
    };

    const registerUser = async () => {
        const res = await fetch("https://taskify-la02.onrender.com/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fullName: suData.fullName,
                email: suData.email,
                password: suData.password
            })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Registration failed");
        }

        return data;
    };

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            setLoading(false);
            setPopupMsg(data.message);
            setPopStatus("open");
            setErrors(false);
        },
        onError: (err) => {
            setLoading(false);
            setPopupMsg(err.message || "Something went wrong");
            setPopStatus("open");
            setErrors(true);
        }
    });

    const handleRegister = () => {
        if (errors) {
            setPopupMsg("Please fill all the credentials correctly");
            setPopStatus("open");
            return;
        }
        setLoading(true);

        mutation.mutate();
    };
    const [showPassword, setShowPassword] = useState(false);
    const [showCnfPassword, setShowCnfPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    return (
        <div id="outer-most">
                <div id="cp"><img src={accountability} alt="logo" /></div>
            <div id="top-bg">
            </div>

            <div id="bottom-bg">
                <div style={{marginTop:"20px"}}>Sign Up to your account</div>
                {/* <div id="s-with-g" onClick={()=>{
                    navigate("/sign-in-with-google")
                }}>
                    <img src={searchGoogle} alt="google icon" />
                    <span>Sign Up with Google</span>
                </div>
                <div id="hr-or">or</div> */}

                <div id="fname-d" className="email-password">
                    <div>Full Name</div>
                    <div className="wrapper">
                        <input type="text" id="full-name" required className="m-inp" name="fullName" value={suData.fullName} onChange={handleChange} />
                        <img src={remove} id="fname-r" className="input-icon" alt="icon" onClick={()=>{
                            setSUData({ ...suData, ["fullName"]: "" });
                        }}/>
                    </div>
                </div>

                <div id="email-d" className="email-password">
                    <div>Email</div>
                    <div className="wrapper">
                        <input type="email" id="email" required className="m-inp" name="email" value={suData.email} onChange={handleChange} />
                        <img src={remove} id="email-r" className="input-icon" alt="icon" onClick={()=>{
                            setSUData({ ...suData, ["email"]: "" });
                        }}/>
                    </div>
                </div>

                <div style={{ color: "yellow", fontSize: "14px", marginTop: "6px", fontWeight: 500 }}>
                    {validateEmail(suData.email) || suData.email === "" ? "" : "Invalid Email"}
                </div>

                <div id="password-d" className="email-password">
                <div>Password</div>
                <div className="wrapper">
                    <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    className="m-inp"
                    name="password"
                    value={suData.password}
                    onChange={handleChange}
                    />
                    <img
                    src={showPassword ? view :hide}
                    id="password-v"
                    className="input-icon"
                    alt="toggle password"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword((prev) => !prev)}
                    />
                </div>
                </div>

                {/* ✅ Confirm Password */}
                <div id="password-d" className="email-password">
                <div>Confirm Password</div>
                <div className="wrapper">
                    <input
                    type={showCnfPassword ? "text" : "password"}
                    id="cnf-password"
                    required
                    className="m-inp"
                    name="cnfPassword"
                    value={suData.cnfPassword}
                    onChange={handleChange}
                    />
                    <img
                    src={showCnfPassword ? view : hide}
                    id="cnf-password-v"
                    className="input-icon"
                    alt="toggle confirm password"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowCnfPassword((prev) => !prev)}
                    />
                </div>
                </div>


                <div style={{ color: "yellow", fontSize: "14px", marginTop: "6px", fontWeight: 500 }}>
                    {suData.password === suData.cnfPassword ? "" : "Passwords do not match"}
                </div>

                <div id="sign-up-div" className="login-sign-up">
                    <button id="sign-up-btn" onClick={(event) => {
                        event.preventDefault();
                        handleRegister();
                    }}>Sign Up</button>

                    {popStatus === "open" && (
                        <PopUp
                            message={popupMsg}
                            popStatus={setPopStatus}
                            navig={errors ? "" : "/login"}
                        />
                    )}
                </div>

                <div id="b-line">
                    <div>Already have an account?</div>
                    <Link to="/" onClick={() => {
                        setEntryPoint("sign-in")
                    }}>Log in</Link>
                </div>
            </div>
            {loading && <div style={{width:"100vw", height:"100vh",position:"absolute",top:"0",right:"0",display:"flex",alignItems:"center",zIndex:"999",justifyContent:"center",backgroundColor:"rgba(119, 119, 119, 0.5)"}}><Loader/></div>}
        </div>
    );
}

export default SignUpPage;
