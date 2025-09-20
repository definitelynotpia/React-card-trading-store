import "../App.css";
import "../styles/auth.css";
import { FiArrowUpRight, FiEye, FiEyeOff, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [validated, setValidated] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidated(true);

        // All fields required
        if (!form.email || !form.username || !form.password || !form.confirmPassword) {
            return;
        }

        // Passwords must match
        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // ✅ Proceed (you can replace with API call)
        console.log("Registering user:", form);
    };

    const passwordsMatch = form.password && form.confirmPassword && form.password === form.confirmPassword;

    return (
        <div className="auth-form d-flex flex-column justify-content-center align-items-center">
            <div>
                <h3 className="text-center">Register to TradeBall</h3>
                <p className="text-center m-0">Give us some info to start your journey!</p>
            </div>

            <Form className="mb-3" noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-1" controlId="formGroupEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control required type="email" placeholder="Enter email" name="email"
                        value={form.email} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-1" controlId="formGroupUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control required type="text" placeholder="@Username" name="username"
                        value={form.username} onChange={handleChange} />
                </Form.Group>

                <div className="password d-flex flex-row justify-content-between align-items-center mb-1">
                    <Form.Group controlId="formGroupPassword">
                        <Form.Label>Password
                            {form.password.length > 0 && form.password.length < 16 ?
                                <span className="text-danger">Weak</span> :
                                form.password.length >= 16 && <span className="text-success">Strong</span>
                            }
                        </Form.Label>
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
                <div className="password d-flex flex-row justify-content-between align-items-center mb-1">
                    <Form.Group controlId="formGroupConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control required type="password" name="confirmPassword"
                            value={form.confirmPassword} onChange={handleChange}
                            isInvalid={validated && form.password !== form.confirmPassword} />
                        <Form.Control.Feedback type="invalid">
                            Passwords must match.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <div className="ms-1">
                        {passwordsMatch ? <FiCheckCircle size={20} color="green" /> : <FiXCircle size={20} color="red" />}
                    </div>
                </div>

                <Button variant="dark" type="submit" className="mt-3 w-100">Register</Button>
            </Form>

            <hr className="w-25" />

            <Button variant="light" className="bg-white border-dark mt-3 px-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png"
                    width="24px" />
                <span className="ms-3">Sign in with Google</span>
            </Button>

            <p className="prompt mt-5">
                Already have an account?
                <Link to="/login" className="text-dark">
                    Login <FiArrowUpRight size={16} />
                </Link>
            </p>
        </div>
    );
}
