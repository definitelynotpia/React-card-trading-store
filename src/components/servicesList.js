import "../App.css";
import "../styles/home.css";
import * as Icon from "react-bootstrap-icons";
import { Button, Col, Row, Card } from "react-bootstrap";

export default function Services() {
	const cards = [
		{
			title: ["Middleman", "Payment System"],
			highlightColor: "highlight-white",
			backgroundColor: "white",
			iconColor: "black",
			image: "https://picsum.photos/200/120"
		},
		{
			title: ["Two-Way", "Feedback System"],
			highlightColor: "highlight-black",
			backgroundColor: "black",
			iconColor: "#76bfc8",
			image: "https://picsum.photos/200/121"
		},
		{
			title: ["Transaction", "History"],
			highlightColor: "highlight-blue",
			backgroundColor: "blue",
			iconColor: "#191a23",
			image: "https://picsum.photos/200/122"
		},
		{
			title: ["Invite-Only", "Seller Access"],
			highlightColor: "highlight-blue",
			backgroundColor: "blue",
			iconColor: "#191a23",
			image: "https://picsum.photos/200/123"
		},
		{
			title: ["Tiered Community", "Badges"],
			highlightColor: "highlight-white",
			backgroundColor: "white",
			iconColor: "black",
			image: "https://picsum.photos/200/124"
		},
		{
			title: ["Reporting &", "Fraud Flagging"],
			highlightColor: "highlight-black",
			backgroundColor: "black",
			iconColor: "#76bfc8",
			image: "https://picsum.photos/200/125"
		},
	];

	return (
		<div className="services-list">
			<div className="card-grid">
				{cards.map((card, i) => (
					<Card key={i} className={`service-card ${card.backgroundColor} h-100`}>
						<Row className="h-100">
							<Col className="service-desc d-flex flex-column justify-content-between align-items-start w-50">
								{card.title.map((line, id) => (
									<div key={id}><span className={`service-title ${card.highlightColor}`}>{line}</span></div>
								))}
								<p className="service-subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum semper diam vitae libero feugiat.</p>
								<Button className={`service-card-btn d-flex justify-items-between align-items-center justify-self-end p-0 m-0 ${card.backgroundColor === "black" ? 'text-white' : 'text-black'}`}>
									<Icon.ArrowUpRightCircleFill size={20} color={card.iconColor} className="me-2" />
									Learn more
								</Button>
							</Col>
							<Col className="d-flex align-items-center w-50">
								<Card.Img width="100%" height="100%" src={card.image} alt="Placeholder Image" className="service-img" />
							</Col>
						</Row>
					</Card>
				))}
			</div>
		</div>
	);
}