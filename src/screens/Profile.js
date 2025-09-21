import "../App.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
// firebase
import { useAuth } from "../services/authContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { Button } from "react-bootstrap";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

export default function Profile() {
	const navigate = useNavigate();
	const { user, loading } = useAuth();

	const handleLogout = async () => {
		try {
			const uid = auth.currentUser?.uid;
			if (uid) {
				await updateDoc(doc(db, "users", uid), {
					isOnline: false,
					lastSeen: serverTimestamp(),
				});
			}
			await signOut(auth);
		} catch (error) {
			console.log("Sign out error:", error);
			alert("Sign out error:", error);
		}
	};

	useEffect(() => {
		if (!loading && !user) {
			navigate("/login");
		}
	}, [user, loading, navigate]);


	return (<div className="content">
		{user ?
			<>
				<img src={user.photoURL} alt={`${user.displayName} profile`} className="profile-img"
					onContextMenu={(e) => { e.preventDefault() }} />
				<p>{user.displayName}</p>
				<p>{user.email}</p>
				<Button onClick={handleLogout}>Logout</Button>
			</> :
			<></>
		}
	</div>);
}