import "../App.css";
import "../styles/auth.css";
import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../services/authContext";

export default function SellerOnboarding() {
	const [code, setCode] = useState("");
	const { user } = useAuth();

	return (<div className="auth-form d-flex justify-content-center align-items-center">
		<div className="seller-form">
			<Form>
				<div>
					<h3 className="fw-bold m-0">Got cards to trade?</h3>
					<p className="m-0">Be a seller in just a few steps!</p>
				</div>

				<Form.Group controlId="formGroupPassword">
					<Form.Control required type="password" placeholder="Enter seller code here" size="lg"
						value={code} onChange={(e) => setCode(e.target.value)} />
				</Form.Group>

				<Button type="submit" className="blue-btn w-25 align-self-center">VERIFY</Button>

				<div className="align-self-center">
					<p className="prompt m-1 text-center">
						<Link to={`/${user.displayName}/seller/invite-request`} className="text-dark me-1">
							Request an Invitation
						</Link>
						from the TradeBall Team!
					</p>
					<p className="prompt m-1 text-center">
						<Link to="/" className="text-dark me-1">
							Learn more
						</Link>
						about our invitation-based market system
					</p>
				</div>
			</Form>

			{/* <p>Ready to showcase your products to a the local audience? Tap into the excitement of auctions, connect with eager buyers, and turn your items into extraordinary finds for Pokemon TCG players!</p> */}
			<img src="https://heute-at-prod-images.imgix.net/2025/05/14/7f5fb9d5-b895-491d-91da-c1298ec6ccec.jpeg?auto=format"
				alt="Hand holding Pokemon cards" onContextMenu={(e) => { e.preventDefault(); }} />
		</div>
	</div>);
}