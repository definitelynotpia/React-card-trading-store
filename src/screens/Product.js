import "../App.css";
import "../styles/explore.css";
// react
import { playCardFlipSfx } from "../utils/sfx";
import { OverlayTrigger, Tooltip, Accordion } from "react-bootstrap";
import { CardFront, CardBack } from "../components/card.js";
// routing
import { useState } from "react";
import { useLocation } from "react-router-dom";
// card type icons
import DarknessIcon from "../assets/card-icons/dark.png";
import DragonIcon from "../assets/card-icons/dragon.png";
import FairyIcon from "../assets/card-icons/fairy.png";
import FightingIcon from "../assets/card-icons/fighting.png";
import FireIcon from "../assets/card-icons/fire.png";
import GrassIcon from "../assets/card-icons/grass.png";
import LightningIcon from "../assets/card-icons/electric.png";
import ColorlessIcon from "../assets/card-icons/normal.png";
import PsychicIcon from "../assets/card-icons/psychic.png";
import MetalIcon from "../assets/card-icons/steel.png";
import WaterIcon from "../assets/card-icons/water.png";

function Product() {
	const location = useLocation();
	const card = location.state?.card; // 👈 read card from Link state
	// card info
	const fetchedPrice = card.cardmarket?.prices.trendPrice;
	const convertedPrice = fetchedPrice * 63; // EUR to PHP manual conversion ?
	const price = (Math.round(convertedPrice * 100) / 100).toFixed(2);

	// ui state
	const typeIcons = {
		// map icon to card type
		Colorless: ColorlessIcon,
		Darkness: DarknessIcon,
		Dragon: DragonIcon,
		Fairy: FairyIcon,
		Fighting: FightingIcon,
		Fire: FireIcon,
		Grass: GrassIcon,
		Lightning: LightningIcon,
		Metal: MetalIcon,
		Psychic: PsychicIcon,
		Water: WaterIcon,
	};
	const [grabbingCard, setGrabbingCard] = useState(null);
	const [flippedCard, setFlippedCard] = useState(false);
	// accordion
	const [activeKey, setActiveKey] = useState("0");

	const toggleFlip = () => {
		setFlippedCard(prev => !prev);
	};

	if (!card) {
		return <div>No card data passed. (fallback: fetch from API)</div>;
	}

	return (<div className="listings-column d-flex flex-row">
		<Accordion className="product-column" activeKey={activeKey} onSelect={setActiveKey} >
			<Accordion.Item eventKey="0">
				<Accordion.Header >
					<p>{activeKey === "0" ? "Hide card" : "Show card"}</p>
				</Accordion.Header>
				<Accordion.Body>
					<div className={`flip-card ${grabbingCard === card.id ? 'grabbing' : ''} `}
						// toggle card flipping animation and play card flip sfx
						onClick={(event) => {
							event.stopPropagation();
							playCardFlipSfx();
							toggleFlip();
						}}
						// change cursor appearance to grabbing when clicking
						onMouseDown={() => setGrabbingCard(card.id)}
						onMouseUp={() => setGrabbingCard(null)}
						onMouseLeave={() => setGrabbingCard(null)} >
						<div className={`flip-card-inner ${flippedCard ? 'flipped' : ''}`}>
							<div className="flip-card-front">
								<CardFront card={card} />
							</div>
							<div className="flip-card-back">
								<CardBack card={card} />
							</div>
						</div>
					</div>
				</Accordion.Body>
			</Accordion.Item>

			<div className="product-info">
				<div className="d-flex flex-row justify-content-start align-items-center my-2 p-0">
					<h4 className="card-name fw-bold my-0 px-0 py-1"
						style={{ maxWidth: `calc(222px - ${28 * card.types.length}px)` }}
					>{card.name}</h4>
					{card.level && <p className="card-level ms-1 mx-2 my-0 px-0 py-1">Lvl {card.level}</p>}
				</div>

				<div className="d-flex flex-row justify-content-between align-items-center">
					<p className="me-2 attribute-name">Trend Price</p>
					<p className="custom-badge me-1">Php {price}</p>
				</div>

				<div className="d-flex flex-row justify-content-between align-items-center">
					<p className="me-2 attribute-name">Set</p>
					<p className="custom-badge me-1">{card.set?.name}</p>
				</div>

				<div className="d-flex flex-row justify-content-between align-items-center">
					<p className="me-2 attribute-name">Artist</p>
					<p className="card-artist custom-badge me-1">{card.artist || "Unknown"}</p>
				</div>

				<div className="d-flex flex-row justify-content-between align-items-center">
					<p className="me-2 attribute-name">Rarity</p>
					<p className="custom-badge me-1">{card.rarity || "Unknown"}</p>
				</div>

				<div className="d-flex flex-row justify-content-between align-items-center">
					<p className="me-2 attribute-name">Supertype</p>
					<p className="custom-badge me-1">{card.supertype}</p>
				</div>

				{card.subtypes && (
					<div className="d-flex flex-row justify-content-between align-items-center">
						<p className="me-2 attribute-name">Subtypes</p>
						<div className="d-flex flex-row flex-wrap justify-content-end">
							{card.subtypes.map((subtype, i) => (
								<p key={`${card.id}-subtype-${i}`} className="custom-gradient-badge me-1 my-1">
									{subtype}
								</p>
							))}
						</div>
					</div>
				)}

				{card.hp && (
					<div className="d-flex flex-row justify-content-between align-items-center">
						<p className="me-2 attribute-name">HP</p>
						<p className="custom-badge me-1">{card.hp}</p>
					</div>
				)}

				{card.types && (
					<div className="d-flex flex-row justify-content-between align-items-center">
						<p className="me-2 attribute-name">{card.types.length > 1 ? "Types" : "Type"}</p>
						<div className="d-flex flex-row flex-wrap justify-content-end align-items-center">
							{card.types.map((type, i) => (
								<p key={`${card.id}-type-${i}`} className="m-0 p-0">
									{card.types?.map((type, i) => (
										<OverlayTrigger key={`${card.id}-type-${i}`} placement="right"
											overlay={<Tooltip id={`tooltip-${card.id}-${i}`}>{type}</Tooltip>} >
											<img alt={type} src={typeIcons[type]} width="28px"
												className="card-type p-0 mx-0 my-1" />
										</OverlayTrigger>
									))}
								</p>
							))}
						</div>
					</div>
				)}

				{card.weaknesses && (
					<div className="d-flex flex-row justify-content-between align-items-center">
						<p className="me-2 attribute-name">{card.weaknesses.length > 1 ? "Weaknesses" : "Weakness"}</p>
						<div className="d-flex flex-row flex-wrap justify-content-end">
							{card.weaknesses.map((weakness, i) => (
								<OverlayTrigger key={`${card.id}-weakness-${i}`} placement="right"
									overlay={<Tooltip id={`tooltip-${card.id}-${i}`}>{weakness.type}</Tooltip>} >
									<div className={card.weaknesses.length > 1 && i < card.weaknesses.length ? "me-2" : ""}>
										<img alt={weakness.type} src={typeIcons[weakness.type]} width="28px"
											className="card-type p-0 mx-0 my-1" />
										{weakness.value}
									</div>
								</OverlayTrigger>
							))}
						</div>
					</div>
				)}

				{card.resistances && (
					<div className="d-flex flex-row justify-content-between align-items-center">
						<p className="me-2 attribute-name">Resistances</p>
						<div className="d-flex flex-row flex-wrap justify-content-end">
							{card.resistances.map((res, i) => (
								<p key={`${card.id}-res-${i}`} className="custom-gradient-badge me-1 my-1">
									{res.type} {res.value}
								</p>
							))}
						</div>
					</div>
				)}

				{card.retreatCost && (
					<div className="d-flex flex-row justify-content-between align-items-center">
						<p className="me-2 attribute-name">Retreat Cost</p>
						<div className="d-flex flex-row flex-wrap justify-content-end">
							{card.retreatCost.map((cost, i) => (
								<p key={`${card.id}-retreat-${i}`} className="custom-gradient-badge me-1 my-1">
									{cost}
								</p>
							))}
						</div>
					</div>
				)}

				{card.rules && (
					<div className="d-flex flex-column mt-2">
						<p className="attribute-name">Rules</p>
						{card.rules.map((rule, i) => (
							<p key={`${card.id}-rule-${i}`} className="small text-muted">
								{rule}
							</p>
						))}
					</div>
				)}
			</div>
		</Accordion>

		<div className="listings-table" style={{ flex: 1 }}>
			<h3>Seller Listings</h3>
			<p>🚧 Listings coming soon...</p>
		</div>
	</div>);
}

export default Product;