import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PopUp from './PopUp';
import { useMutation } from '@tanstack/react-query';

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
        const res = await fetch("http://127.0.0.1:8000/api/register", {
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
            setPopupMsg(data.message);
            setPopStatus("open");
            setErrors(false);
        },
        onError: (err) => {
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

        mutation.mutate();
    };

    return (
        <div id="outer-most">
            <div id="top-bg">
                <div id="cp"><img src="src/assets/accountability.png" alt="logo" /></div>
            </div>

            <div id="bottom-bg">
                <div>Log in to your account</div>
                <div id="s-with-g">
                    <img src="src/assets/search (2).png" alt="google icon" />
                    <span>Sign Up with Google</span>
                </div>
                <div id="hr-or">or</div>

                <div id="fname-d" className="email-password">
                    <div>Full Name</div>
                    <div className="wrapper">
                        <input type="text" id="full-name" required className="m-inp" name="fullName" value={suData.fullName} onChange={handleChange} />
                        <img src="src/assets/remove.png" id="fname-r" className="input-icon" alt="icon" />
                    </div>
                </div>

                <div id="email-d" className="email-password">
                    <div>Email</div>
                    <div className="wrapper">
                        <input type="email" id="email" required className="m-inp" name="email" value={suData.email} onChange={handleChange} />
                        <img src="src/assets/remove.png" id="email-r" className="input-icon" alt="icon" />
                    </div>
                </div>

                <div style={{ color: "yellow", fontSize: "14px", marginTop: "6px", fontWeight: 500 }}>
                    {validateEmail(suData.email) || suData.email === "" ? "" : "Invalid Email"}
                </div>

                <div id="password-d" className="email-password">
                    <div>Password</div>
                    <div className="wrapper">
                        <input type="password" id="password" required className="m-inp" name="password" value={suData.password} onChange={handleChange} />
                        <img src="src/assets/hide.png" id="password-v" className="input-icon" alt="icon" />
                    </div>
                </div>

                <div id="password-d" className="email-password">
                    <div>Confirm Password</div>
                    <div className="wrapper">
                        <input type="password" id="cnf-password" required className="m-inp" name="cnfPassword" value={suData.cnfPassword} onChange={handleChange} />
                        <img src="src/assets/hide.png" id="cnf-password-v" className="input-icon" alt="icon" />
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
        </div>
    );
}

export default SignUpPage;
