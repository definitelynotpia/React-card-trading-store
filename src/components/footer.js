import "../App.css";
import { ReactComponent as FooterLogo } from "../logo-1.svg";
import * as Icon from 'react-bootstrap-icons';
import { Row, Col } from "react-bootstrap";

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
						<p>Explore</p>
						<p>Trending</p>
						<p>Shop</p>
						<p>Auctions</p>
					</div>
				</Col>
				<Col className="col-auto me-5">
					<h5>Community</h5>
					<div className="footer-links">
						<p>Forum</p>
						<p>Seller Invite System</p>
						<p>Seller Directory</p>
						<p>Report a Scammer</p>
					</div>
				</Col>
				<Col className="col-auto">
					<h5>About TradeBall</h5>
					<div className="footer-links">
						<p>Our Mission</p>
						<p>Our Vision</p>
					</div>
				</Col>
			</Row>
		</footer>
	);
}