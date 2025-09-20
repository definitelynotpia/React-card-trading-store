import "../App.css";
import "../styles/auth.css";
import { FiArrowUpRight, FiEye, FiEyeOff } from "react-icons/fi";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (<div className="auth-form d-flex flex-column justify-content-center align-items-center">
        <div>
            <h3 className="text-center">Log in to your account</h3>
            <p className="text-center m-0">Welcome back! Please enter your details.</p>
        </div>
        <Form className="mb-3">
            <Form.Group className="mb-2" controlId="formGroupEmail">
                <Form.Label>Email address</Form.Label>
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
                    <Form.Check type="checkbox" label="Remember me" />
                </Form.Group>
                <Link to="" className="text-dark">Forgot password?</Link>
            </div>

            <Button variant="dark" type="submit" className="w-100">Login</Button>
        </Form>

        <hr className="w-25" />

        <Button variant="light" className="bg-white border-dark mt-3 px-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png"
                width="24px" />
            <span className="ms-3">Sign in with Google</span>
        </Button>

        <p className="prompt mt-5">Don't have an account?
            <Link to="/register" className="text-dark">Register now<FiArrowUpRight size={16} /></Link>
        </p>
    </div>);
}