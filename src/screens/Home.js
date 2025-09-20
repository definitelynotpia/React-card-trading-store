import "../App.css";
import "../styles/home.css";
import { Button, Col, Row } from "react-bootstrap";
import FeaturedCarousel from "../components/featuredCarousel";
import Services from "../components/servicesList";
// routing
import { Link } from "react-router-dom";
// images
import Jigglypuff from "../assets/3D_Jigglypuff.webp";
import Pikachu from "../assets/3D_Pikachu.png";

export default function Home() {
	return (<>
		<div className="gradient-bg">
			<div className="hero-section">
				<div className="blob purple"></div>
				<div className="blob blue"></div>

				<div className="hero-anchored-text">
					<div className="hero-section-text">
						<span className="gradient-text header-1">Discover</span>
						<span className="header-1 me-3">,</span>
						<span className="gradient-text header-1">Collect</span>
						<span className="header-1 me-3">, and</span>
						<span className="gradient-text header-1">Buy</span>
					</div>

					<div className="hero-section-text">
						<span className="header-1 me-3">Pokemon Cards</span>
						<span className="gradient-text header-1">Securely!</span>
					</div>

					<Row className="subtitle-section d-flex justify-content-center align-items-center pt-3 mt-3">
						<Col className="col-auto p-0 m-0 align-self-center">
							<p className="subtitle">A trusted hub for the Pokemon<br />community. Gotta catch 'em all!</p>
						</Col>
						<Col className="col-auto p-0 m-0">
							<Link to="/explore">
								<Button variant="dark" className="rounded-pill ms-5">Shop now</Button>
							</Link>
							<Link to="/seller/onboard">
								<Button className="rounded-pill blue-outline-btn ms-3">I want to sell!</Button>
							</Link>
						</Col>
					</Row>
				</div>

				<FeaturedCarousel />
			</div>

			<div className="hero-section-platform">
				<img alt="Jigglypuff" className="hero-section-pokemon jigglypuff" src={Jigglypuff} draggable="false" onContextMenu={(e) => e.preventDefault()} />
				<img alt="Pikachu" id="hero-section-pokemon pikachu" className="hero-section-pokemon pikachu flip-image" src={Pikachu} draggable="false" onContextMenu={(e) => e.preventDefault()} />
			</div>
		</div>

		<div className="services-list d-flex justify-content-center align-items-center">
			<Services></Services>
		</div>
	</>);
}