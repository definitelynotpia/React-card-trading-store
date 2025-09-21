import "../App.css";
import "../styles/auth.css";
// react
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// firebase
import { auth, googleProvider, db } from "../services/firebase.js";
import { createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
// ui
import { FiArrowUpRight, FiEye, FiEyeOff, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Form, Button } from "react-bootstrap";
import { generateAvatar } from "../utils/avatar.js";
import { useAuth } from "../services/authContext.js";

export default function Register() {
    const {user, loading} = useAuth();
    const navigate = useNavigate();
    // default persistence

    // form state
    const [form, setForm] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [validated, setValidated] = useState(false);
    // default pfp

    // toggle password visibility
    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    // on change of form input value
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setValidated(true);
        await setPersistence(auth, browserLocalPersistence);

        try {
            if (!validEmail || !validUsernameLength || !form.password || !form.confirmPassword || !passwordsMatch) return;

            const res = await createUserWithEmailAndPassword(auth, form.email, form.password);
            const user = res.user;
            const DEFAULT_PROFILE_IMAGE = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${form.username}`;

            // set username and dp in Firebase Auth
            await updateProfile(user, {
                displayName: form.username,
                photoURL: DEFAULT_PROFILE_IMAGE,
            });
            // create user document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: form.email,
                username: form.username,
                photoURL: DEFAULT_PROFILE_IMAGE,
                role: "buyer",
                createdAt: Date.now(),
            });
            // go to store upon auth
            navigate("/explore");
        } catch (err) {
            console.error(err);
            alert(err.message);
        }

    };

    const handleGoogleRegister = async () => {
        try {
            const res = await signInWithPopup(auth, googleProvider);
            const user = res.user;
            const username = user.displayName || user.email.split("@")[0];
            const DEFAULT_PROFILE_IMAGE = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${username}`;

            // check if new user doc exists
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                username: username,
                photoURL: user.photoURL || DEFAULT_PROFILE_IMAGE,
                createdAt: Date.now(),
            }, { merge: true });

            // go to store upon auth
            navigate("/explore");
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    useEffect(() => {
        if (!loading && user) {
            const username = user.displayName;
            navigate(`/${username}/profile`);
        }
    }, [user, loading, navigate]);

    // check if inputs are conditionally valid
    const passwordsMatch = form.password && form.confirmPassword && form.password === form.confirmPassword;
    const validUsernameLength = form.username.length !== 0 && form.username.length >= 3;
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    return (
        <div className="auth-form d-flex flex-column justify-content-center align-items-center">
            <div>
                <h3 className="text-center">Register to TradeBall</h3>
                <p className="text-center m-0">Give us some info to start your journey!</p>
            </div>

            <Form className="mb-3" noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-1" controlId="formGroupEmail">
                    <Form.Label>Email address
                        {validated && !form.email ?
                            <span className="text-danger">This field is required</span> :
                            validated && !validEmail && <span className="text-danger">Email is invalid</span>}
                    </Form.Label>
                    <Form.Control required type="email" placeholder="Enter email" name="email"
                        value={form.email} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-1" controlId="formGroupUsername">
                    <Form.Label>Username
                        {validated && !validUsernameLength &&
                            <span className="text-danger">Username must be 3 or more characters</span>}
                    </Form.Label>
                    <Form.Control required type="text" placeholder="@Username" name="username"
                        value={form.username} onChange={handleChange} />
                </Form.Group>

                <div className="password d-flex flex-row justify-content-between align-items-center mb-1">
                    <Form.Group controlId="formGroupPassword">
                        <Form.Label>Password
                            {validated && !form.password ?
                                <span className="text-danger">This field is required</span> :
                                form.password && form.password.length < 8 ?
                                    <span className="text-danger">Weak</span> :
                                    form.password.length >= 8 && form.password.length < 16 ?
                                        <span className="text-warning">Average</span> :
                                        form.password.length >= 16 &&
                                        <span className="text-success">Strong</span>
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
                        <Form.Label>Confirm Password
                            {validated && (!passwordsMatch || !form.confirmPassword) &&
                                <span className="text-danger">Passwords must match</span>}
                        </Form.Label>
                        <Form.Control required type="password" name="confirmPassword"
                            value={form.confirmPassword} onChange={handleChange} />
                    </Form.Group>
                    <div className="ms-1">
                        {passwordsMatch ? <FiCheckCircle size={20} color="green" /> : <FiXCircle size={20} color="red" />}
                    </div>
                </div>

                <Button variant="dark" type="submit" className="mt-3 w-100">Register</Button>
            </Form>

            <hr className="w-25" />

            <Button variant="light" className="bg-white border-dark mt-3 px-3" onClick={handleGoogleRegister}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png"
                    width="24px" alt="Google logo" />
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
