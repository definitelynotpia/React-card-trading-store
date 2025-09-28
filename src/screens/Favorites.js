import "../App.css";
import "../styles/explore.css";
// firebase
import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../services/authContext";
// react
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// ui
import { playCardFlipSfx } from "../utils/sfx";
import { Button, Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { CardBack, CardFront } from "../components/card";
import { FaHeart } from "react-icons/fa";
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

export default function Favorites() {
	// get user favorites from db
	const { user } = useAuth();
	const navigate = useNavigate();
	const [favCards, setFavCards] = useState({});

	useEffect(() => {
		// if not authenticated
		if (!user) navigate("/login");

		const favRef = collection(db, "users", user.uid, "favorites");
		// real-time fetch of collection
		const unsubscribe = onSnapshot(favRef, (snapshot) => {
			const favs = {};
			snapshot.forEach((doc) => {
				favs[doc.id] = doc.data();
			});
			setFavCards(favs);
		});

		return () => unsubscribe();
	}, [user, navigate]);

	// ui state
	const [grabbingCard, setGrabbingCard] = useState(null);
	const [flippedCards, setFlippedCards] = useState({});
	// map icon to card type
	const typeIcons = {
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

	const toggleFlip = (cardId) => {
		setFlippedCards(prev => ({
			...prev,
			[cardId]: !prev[cardId]
		}));
	};

	const toggleFav = async (card) => {
		const favRef = doc(db, "users", user.uid, "favorites", card.id);
		const isFav = !!favCards[card.id];
		if (isFav) {
			// update local state
			setFavCards((prev) => {
				const updated = { ...prev };
				delete updated[card.id];
				return updated;
			});
			// remove from Firestore
			await deleteDoc(favRef);
			alert("Removed", card.name, "to Favorites!");
		} else {
			// update local state
			setFavCards((prev) => ({ ...prev, [card.id]: card }));
			// add to Firestore
			await setDoc(favRef, card);
			alert("Added", card.name, "to Favorites!");
		}
	};

	return (<div className="content products-grid">
		{Object.values(favCards).map((card) => (
			<Card key={card.id ?? card.name} className="product-card">
				<div className={`flip-card ${grabbingCard === card.id ? 'grabbing' : ''}`}
					// toggle card flipping animation and play card flip sfx
					onClick={() => { playCardFlipSfx(); toggleFlip(card.id); }}
					// change cursor appearance to grabbing when clicking
					onMouseDown={() => setGrabbingCard(card.id)}
					onMouseUp={() => setGrabbingCard(null)}
					onMouseLeave={() => setGrabbingCard(null)} >
					<div className={`flip-card-inner ${flippedCards[card.id] ? 'flipped' : ''}`}>
						<div className="flip-card-front">
							<CardFront card={card} />
						</div>
						<div className="flip-card-back">
							<CardBack card={card} />
						</div>
					</div>
				</div>

				<div className="mx-2 mb-2">
					{/* <div className="d-flex flex-row justify-content-between align-items-center m-0 p-0">
								<p className="seller-username m-0 p-0">Seller.username</p>
								<p className="m-0 p-0">
									<span className="price-value">{price}</span>
									<span className="price-tag">PHP</span>
								</p>
							</div> */}

					<div className="d-flex flex-row justify-content-between align-items-center my-1 p-0">
						<div className="d-flex flex-row justify-content-end align-items-end">
							<h4 className="card-name fw-bold my-0 px-0 py-1"
								style={{ maxWidth: `calc(222px - ${28 * (card.types.length || 0)}px)` }}
							>{card.name}</h4>
							{card.level && <p className="card-level ms-1 mx-2 my-0 px-0 py-1">Lvl {card.level}</p>}
						</div>
						<div className="d-flex flex-row justify-content-start align-items-center">
							{card.types?.map((type, i) => (
								<OverlayTrigger key={`${card.id}-type-${i}`} placement="left"
									overlay={<Tooltip id={`tooltip-${card.id}-${i}`}>{type}</Tooltip>} >
									<img alt={type} src={typeIcons[type]} width="28px"
										className="card-type p-0 m-0" />
								</OverlayTrigger>
							))}
						</div>
					</div>

					<hr className="my-1 p-0" />

					<div className="d-flex flex-row justify-content-between align-items-center">
						<p className="me-2 attribute-name">Set</p>
						<p className="custom-badge me-1"> {card.set.name} </p>
					</div>
					<div className="d-flex flex-row justify-content-between align-items-center">
						<p className="me-2 attribute-name">Artist</p>
						<p className="card-artist custom-badge me-1"> {card.artist} </p>
					</div>
					<div className="d-flex flex-row justify-content-between align-items-center">
						<p className="me-2 attribute-name">Rarity</p>
						<p className="custom-badge me-1"> {card.rarity || "Unknown"} </p>
					</div>
					<div className="d-flex flex-row justify-content-between align-items-center">
						<p className="me-2 attribute-name">Supertype</p>
						<p className="custom-badge me-1"> {card.supertype} </p>
					</div>
					<div className="d-flex flex-row justify-content-between align-items-center">
						<p className="me-2 attribute-name">Subtypes</p>
						<div className="d-flex flex-row justify-content-end">
							{card.subtypes?.map((subtype, i) => (
								<p key={`${card.id}-subtype-${i}`} className="custom-gradient-badge me-1">
									{subtype}
								</p>
							))}
						</div>
					</div>

					<div className="d-flex flex-row justify-content-center align-items-center mt-3 mb-1">
						{favCards[card.id] ?
							<FaHeart onClick={() => toggleFav(card)} size={28} color="red" /> :
							<FaHeart onClick={() => toggleFav(card)} size={28} color="#0000003d" />}
						<Link to={`/explore/${card.id}`} state={{ card }} className="listings w-100 ms-2">
							<Button variant="outline-dark" className="w-100">View Listings</Button>
						</Link>
					</div>
				</div>
			</Card>
		))}
	</div>);
}