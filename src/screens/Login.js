// ui
import "../App.css";
import "../styles/auth.css";
import { FiArrowUpRight, FiEye, FiEyeOff } from "react-icons/fi";
import { Form, Button } from "react-bootstrap";
// react
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// firebase
import { auth, googleProvider } from "../services/firebase.js";
import { signInWithEmailAndPassword, signInWithPopup, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { useAuth } from "../services/authContext.js";

export default function Login() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    // form states
    const [showPassword, setShowPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
        stayLoggedIn: false,
    });

    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };


    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        // if user wants to stay logged in, set auth persistence to local
        await setPersistence(auth, form.stayLoggedIn ? browserLocalPersistence : browserSessionPersistence);

        try {
            if (!validEmail || !form.password) return;
            // if inputs valid, sign in
            await signInWithEmailAndPassword(auth, form.email, form.password);
            // go to store upon auth
            navigate("/explore");
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            // go to store upon auth
            navigate("/explore");
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    useEffect(() => {
        if (!loading && user) {
            const username = user.displayName;
            navigate(`/${username}/profile`);
        }
    }, [user, loading, navigate]);

    return (<div className="auth-form d-flex flex-column justify-content-center align-items-center">
        <div>
            <h3 className="text-center">Log in to your account</h3>
            <p className="text-center m-0">Welcome back! Please enter your details.</p>
        </div>

        <Form className="mb-3" noValidate validated={submitted} onSubmit={handleSubmit}>
            <Form.Group className="mb-2" controlId="formGroupEmail">
                <Form.Label>Email address
                    {submitted && !form.email ?
                        <span className="text-danger">This field is required</span> :
                        submitted && !validEmail && <span className="text-danger">Email is invalid</span>}
                </Form.Label>
                <Form.Control required type="email" placeholder="Enter email" name="email"
                    value={form.email} onChange={handleChange} />
            </Form.Group>

            <div className="password d-flex flex-row justify-content-between align-items-center mb-1">
                <Form.Group controlId="formGroupPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type={showPassword ? "text" : "password"} name="password"
                        value={form.password} onChange={handleChange} />
                </Form.Group>
                <div className="password-toggle ms-1">
                    {showPassword ? (
                        <FiEyeOff size={20} onClick={toggleShowPassword} />
                    ) : (
                        <FiEye size={20} onClick={toggleShowPassword} />
                    )}
                </div>
            </div>

            <div className="d-flex flex-row justify-content-between align-items-center my-4">
                <Form.Group id="formGridCheckbox">
                    <Form.Check type="checkbox" label="Keep me logged in" name="stayLoggedIn" checked={form.stayLoggedIn}
                        onChange={handleChange} />
                </Form.Group>
                <Link to="" className="text-dark">Forgot password?</Link>
            </div>

            <Button variant="dark" type="submit" className="w-100">Login</Button>
        </Form>

        <hr className="w-25" />

        <Button variant="light" className="bg-white border-dark mt-3 px-3" onClick={handleGoogleLogin}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png"
                width="24px" alt="Google logo" />
            <span className="ms-3">Sign in with Google</span>
        </Button>

        <p className="prompt mt-5">Don't have an account?
            <Link to="/register" className="text-dark">Register now<FiArrowUpRight size={16} /></Link>
        </p>
    </div>);
}