import "../App.css";
import "../styles/explore.css";
// react
import { playCardFlipSfx } from "../utils/sfx.js";
import { OverlayTrigger, Tooltip, Accordion } from "react-bootstrap";
import { CardFront, CardBack } from "../components/card.js";
import { IoMdStar } from "react-icons/io";
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

export default function Listings() {
	const location = useLocation();
	const card = location.state?.card; // 👈 read card from Link state

	// card info
	const fetchedUsdPrice = card.tcgPlayer?.prices?.holofoil?.market || card.tcgPlayer?.prices?.reverseHolofoil?.market || 0;
	const fetchedEurPrice = card.cardmarket?.prices.trendPrice;
	const priceEur = (Math.round(fetchedEurPrice * 100) / 100).toFixed(2); // EUR to PHP manual conversion ?
	const priceUsd = (Math.round(fetchedUsdPrice * 100) / 100).toFixed(2); // USD to PHP manual conversion ?
	const convertedEurPrice = (Math.round((fetchedEurPrice * 63) * 100) / 100).toFixed(2); // EUR to PHP manual conversion ?
	const convertedUsdPrice = (Math.round((fetchedUsdPrice * 51) * 100) / 100).toFixed(2); // USD to PHP manual conversion ?

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
	const [showCard, setShowCard] = useState("0");
	const [listingActiveKey, setListingActiveKey] = useState("0");

	const toggleFlip = () => {
		setFlippedCard(prev => !prev);
	};

	if (!card) {
		return <div>No card data passed. (fallback: fetch from API)</div>;
	}

	return (<div className="listings-column d-flex flex-row">
		<Accordion className="product-column pb-4" activeKey={showCard} onSelect={setShowCard} >
			<Accordion.Item eventKey="0">
				<Accordion.Header >
					<p>{showCard === "0" ? "Hide card" : "Show card"}</p>
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
				<div className={`product-name fw-bold p-0 mb-2 ${showCard === "0" ? "mt-0" : "mt-3"}`}>{card.name}</div>

				<div className="d-flex flex-row justify-content-between align-items-center p-0">
					{card.hp && <div className="d-flex flex-row align-items-center">
						<p className="attribute-name m-0 p-0 me-1">HP</p>
						<p className="product-hp m-0 p-0">{card.hp}</p>
					</div>}
					{card.level && <div className="d-flex flex-row align-items-center">
						<p className="attribute-name m-0 p-0 me-1">LVL</p>
						<p className="product-level m-0 p-0">{card.level}</p>
					</div>}

					{card.types && (
						<div className="d-flex flex-row align-items-center">
							<p className="me-2 attribute-name">{card.types.length > 1 ? "TYPES" : "TYPE"}</p>
							<div className="d-flex flex-row flex-wrap justify-content-end align-items-center">
								{card.types?.map((type, i) => (
									<OverlayTrigger key={`${card.id}-type-${i}`} placement="right"
										overlay={<Tooltip id={`tooltip-${card.id}-${i}`}>{type}</Tooltip>} >
										<img alt={type} src={typeIcons[type]} width="28px"
											className="card-type p-0 mx-0 my-1" />
									</OverlayTrigger>
								))}
							</div>
						</div>
					)}
				</div>

				<div className="d-flex flex-row justify-content-between align-items-center">
					<p className="attribute-name">Trend Price</p>
					<div>
						<OverlayTrigger placement="right" className="m-0 p-0" overlay={<Tooltip>based on global trend</Tooltip>} >
							<p className="m-0 p-0">€{priceEur}
								<span className="ms-1" style={{ fontWeight: "500" }}>(₱{convertedEurPrice})</span>
							</p>
						</OverlayTrigger>
						{priceUsd !== 0 ?? <p className="m-0 p-0">${priceUsd}
							<span className="ms-1" style={{ fontWeight: "500" }}>(₱{convertedUsdPrice})</span>
						</p>}
					</div>
				</div>

				<div className="d-flex flex-row justify-content-between align-items-center">
					<p className="me-2 attribute-name">Set</p>
					<p className="m-0 p-0">{card.set?.name}</p>
				</div>

				<div className="d-flex flex-row justify-content-between align-items-center">
					<p className="me-2 attribute-name">Rarity</p>
					<p className="m-0 p-0">{card.rarity || "Unknown"}</p>
				</div>

				<div className="d-flex flex-row justify-content-between align-items-center">
					<p className="me-2 attribute-name">Supertype</p>
					<p className="m-0 p-0">{card.supertype}</p>
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

				{card.weaknesses && (
					<div className="d-flex flex-row justify-content-between align-items-center">
						<p className="me-2 attribute-name">Weaknesses</p>
						<div className="d-flex flex-row flex-wrap justify-content-end">
							{card.weaknesses.map((weakness, i) => (
								<OverlayTrigger key={`${card.id}-weakness-${i}`} placement="right"
									overlay={<Tooltip id={`tooltip-${card.id}-${i}`}>{weakness.type}</Tooltip>} >
									<div className={card.weaknesses.length > 1 && i < (card.weaknesses.length - 1) ? "me-2" : ""}>
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
							{card.resistances.map((resistance, i) => (
								<OverlayTrigger key={`${card.id}-resistance-${i}`} placement="right"
									overlay={<Tooltip id={`tooltip-${card.id}-${i}`}>{resistance.type}</Tooltip>} >
									<div className={card.resistances.length > 1 && i < (card.resistances.length - 1) ? "me-2" : ""}>
										<img alt={resistance.type} src={typeIcons[resistance.type]} width="28px"
											className="card-type p-0 mx-0 my-1" />
										{resistance.value}
									</div>
								</OverlayTrigger>
							))}
						</div>
					</div>
				)}

				{card.retreatCost && (
					<div className="d-flex flex-row justify-content-between align-items-center">
						<p className="me-2 attribute-name">Retreat Cost</p>
						<div className="d-flex flex-row flex-wrap justify-content-end">
							{card.retreatCost.map((cost, i) => (
								<OverlayTrigger key={`${card.id}-retreatCost-${i}`} placement="right"
									overlay={<Tooltip id={`tooltip-${card.id}-${i}`}>{cost}</Tooltip>} >
									<img alt={cost} src={typeIcons[cost]} width="28px" className="card-type p-0 mx-0 my-1" />
								</OverlayTrigger>
							))}
						</div>
					</div>
				)}

				<div className="d-flex flex-row justify-content-between align-items-center">
					<p className="me-2 attribute-name">Artist</p>
					<p className="m-0 p-0">{card.artist || "Unknown"}</p>
				</div>

				{card.rules && (
					<div className="d-flex flex-column">
						<p className="attribute-name mt-2 mb-1">{card.rules.length > 1 ? "Card Rules" : "Card Rule"}</p>
						{card.rules.map((rule, i) => (
							<div className="d-flex flex-row justify-content-start align-items-start pt-2">
								<IoMdStar size={15} color="#7932b7" className="me-1" />
								<p key={`${card.id}-rule-${i}`} className="product-rule">{rule}</p>
							</div>
						))}
					</div>
				)}
			</div>
		</Accordion>

		<Accordion className="listings-table" activeKey={listingActiveKey} onSelect={setListingActiveKey} >
			{Array.from({ length: 20 }, (listing, i) => (
				<Accordion.Item eventKey={i}>
					<Accordion.Header>Listing #{i + 1}</Accordion.Header>
					<Accordion.Body>Listing #{i + 1}</Accordion.Body>
				</Accordion.Item>
			))}
		</Accordion>
	</div>);
}