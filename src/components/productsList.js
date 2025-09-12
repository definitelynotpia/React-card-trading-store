import "../App.css";
// react
import { playCardFlipSfx } from "../utils/sfx";
// import { Pagination, Card, Container } from "react-bootstrap";
import { Card, Container } from "react-bootstrap";
import { CardFront, CardBack } from "../components/card.js";
import { useState, useEffect, useRef } from "react";
// api fetch
// import { useCardsAll } from "../services/pokemonQueries";
import { useCards, useCardsInfinite } from "../services/pokemonQueries";
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

export default function Products() {
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

	// get screen width and number of cards in row that fits
	const [pageSize, setPageSize] = useState(15);
	const cardWidth = 242;
	const gap = 18;
	useEffect(() => {
		function updatePageSize() {
			const screenWidth = window.innerWidth;
			const cols = Math.floor((screenWidth + gap) / (cardWidth + gap)) * 3;
			setPageSize(cols);
		}
		updatePageSize();
		window.addEventListener("resize", updatePageSize);
		return () => window.removeEventListener("resize", updatePageSize);
	}, [cardWidth, gap]);

	// query all Pokemon cards
	const { data: infiniteData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		error } = useCardsInfinite(pageSize);
	const loadMoreRef = useRef();
	// flatten pages into one array for infinite scroll
	const cards = infiniteData?.pages.flatMap(page => page.data) || [];

	// preload next page
	useEffect(() => {
		if (hasNextPage) {
			// preload 2–3 pages ahead
			fetchNextPage();
		}
	}, [hasNextPage, fetchNextPage]);


	useEffect(() => {
		const node = loadMoreRef.current;
		if (!node) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				console.log("Intersecting?", entry.isIntersecting, hasNextPage, !isFetchingNextPage);
				if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{
				root: null, // viewport
				rootMargin: "0px 0px 300px 0px", // load 300px before bottom
				threshold: 0.1 // 10% of target visible
			}
		);
		observer.observe(node);
		return () => { if (node) observer.unobserve(node) };
	}, [loadMoreRef, fetchNextPage, hasNextPage, isFetchingNextPage]);

	// ui state
	const [grabbingCard, setGrabbingCard] = useState(null);
	const [flippedCards, setFlippedCards] = useState({});

	const toggleFlip = (cardId) => {
		setFlippedCards(prev => ({
			...prev,
			[cardId]: !prev[cardId]
		}));
	};

	// if (isAllLoading) { return (<>Loading all products...</>); }
	// if (isAllError) { return (<>Error: {errorAll.message}</>); }
	if (isLoading) { return (<>Loading all products...</>); }
	if (isError) { return (<>Error: {error.message}</>); }

	return (<div>
		<div className="products-grid">
			{(cards.map(card => (
				//  lazy scroll
				<Card key={card.id ?? card.name} className="product-card">
					<div className={`flip-card ${grabbingCard === card.id ? 'grabbing' : ''}`}
						// toggle card flipping animation and play card flip sfx
						onClick={event => {
							event.stopPropagation();
							playCardFlipSfx();
							toggleFlip(card.id);
						}}
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

					<Container className="mb-3">
						<div className="d-flex flex-row justify-content-between align-items-center my-1 mx-0">
							<div className="d-flex flex-row justify-content-end align-items-end">
								<h4 className="fw-bold mt-1 me-2 my-0 p-0">{card.name}</h4>
								{card.level && <p className="card-level m-0 p-0">Lvl {card.level}</p>}
							</div>
							<div className="d-flex flex-row justify-content-start align-items-center mt-1">
								{card.types?.map((type, i) => (
									<img key={`${card.id}-type-${i}`} alt={type} src={typeIcons[type]} width="35px" className="p-0 me-1" />
								))}
							</div>
						</div>

						<hr className="my-1 p-0" />

						<div className="d-flex flex-row justify-content-between align-items-center">
							<p className="me-2 attribute-name">Set</p>
							<p className="custom-badge me-1"> {card.set.name} </p>
						</div>
						<div className="d-flex flex-row justify-content-between align-items-center">
							<p className="me-2 attribute-name">Set</p>
							<p className="custom-badge me-1"> {card.set.name} </p>
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
					</Container>
				</Card>
			)))}
		</div>

		<div ref={loadMoreRef}>{isFetchingNextPage &&
			<h1 className="text-center w-100 py-5 my-5">
				Please wait a moment!</h1>}
		</div>
	</div >);
}