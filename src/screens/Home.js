import "../App.css";
import "../styles/home.css";
import { Button, Col, Row } from "react-bootstrap";
import FeaturedCarousel from "../components/featuredCarousel";
import Services from "../components/servicesList";
// images
import Jigglypuff from "../assets/3D_Jigglypuff.webp";
import Pikachu from "../assets/3D_Pikachu.png";

export default function Home() {
	return (<>
		<div className="gradient-bg">
			<div className="hero-section">
				<div className="blob blue"></div>
				<div className="hero-anchored-text">
					<h1 className="hero-section-text"><span className="gradient-text h1">Discover</span>,&nbsp;<span className="gradient-text h1">Collect</span>, and&nbsp;<span className="gradient-text h1">Buy</span></h1>
					<h1 className="hero-section-text">Pokemon Cards&nbsp;<span className="gradient-text h1">Securely!</span></h1>
					<Row className="subtitle-section d-flex justify-content-center align-items-center pt-3">
						<Col className="col-auto p-0 m-0 align-self-center">
							<p className="subtitle">A trusted hub for the Pokemon<br />community. Gotta catch 'em all!</p>
						</Col>
						<Col className="col-auto p-0 m-0">
							<Button variant="dark" className="rounded-pill ms-5">Shop now</Button>
							<Button className="rounded-pill blue-outline-btn ms-3">I want to sell!</Button>
						</Col>
					</Row>
				</div>
				<FeaturedCarousel></FeaturedCarousel>
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