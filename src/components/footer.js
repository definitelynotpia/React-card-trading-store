import "../App.css";
import { ReactComponent as FooterLogo } from "../logo-1.svg";
import * as Icon from 'react-bootstrap-icons';
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function CustomFooter() {
	return (
		<footer className="d-flex justify-content-center align-items-center">
			<Row className="d-flex justify-content-center align-items-start m-0">
				<Col className="d-flex flex-column justify-content-start me-5" sm="3">
					<FooterLogo width="12vw" height="auto" alt="TradeBall" className="mb-3" />
					<Row><p className="footer-desc w-100 mb-4">Every listing is backed by community trust, invite-only seller access, and secure escrow transactions. With TradeBall, your cards are always in safe hands.</p></Row>
					<div className="footer-socials d-flex justify-content-between w-50">
						<Icon.Facebook size={18} />
						<Icon.Instagram size={18} />
						<Icon.Linkedin size={18} />
						<Icon.Threads size={18} />
					</div>
				</Col>
				<Col className="col-auto mx-5">
					<h5>Marketplace</h5>
					<div className="footer-links">
						<p><Link to="/explore">Explore</Link></p>
						<p><Link to="/">About</Link></p>
						<p><Link to="/seller/onboard">Become a Seller</Link></p>
					</div>
				</Col>
				<Col className="col-auto me-5">
					<h5>Community</h5>
					<div className="footer-links">
						<p><Link to="">FAQs</Link></p>
						<p><Link to="">Seller Invite System</Link></p>
						<p><Link to="">Seller Directory</Link></p>
						<p><Link to="">Report a Scammer</Link></p>
					</div>
				</Col>
				<Col className="col-auto">
					<h5>About TradeBall</h5>
					<div className="footer-links">
						<p><Link to="">Our Mission</Link></p>
						<p><Link to="">Our Vision</Link></p>
						<p><Link to="">Resources</Link></p>
					</div>
				</Col>
			</Row>
		</footer>
	);
}