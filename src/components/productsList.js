import "../App.css";
// react
import { playCardFlipSfx } from "../utils/sfx";
import { Pagination, Card } from "react-bootstrap";
import { CardFront, CardBack } from "../components/card.js";
import { useState } from "react";
// api fetch
import { useCardsAll } from "../services/pokemonQueries";
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

	// query first 250 Pokemon cards
	const { data,
		fetchNextPage,
		fetchPreviousPage,
		hasNextPage,
		hasPreviousPage,
		isFetching,
		isLoading,
		isError,
		error } = useCardsAll();

	// get recently fetched pages
	const lastPage = data?.pages[data.pages.length - 1];
	const currentPage = lastPage?.page ?? 1;
	const totalPages = lastPage ? Math.ceil((lastPage.totalCount ?? 0) / (lastPage.pageSize ?? 1)) : 1;
	// get cards of current page
	const cards = Array.isArray(lastPage?.data) ? lastPage.data : [];

	// ui state
	const [grabbingCard, setGrabbingCard] = useState(null);
	const [flippedCards, setFlippedCards] = useState({});

	const toggleFlip = (cardId) => {
		setFlippedCards(prev => ({
			...prev,
			[cardId]: !prev[cardId]
		}));
	};

	if (isLoading) { return (<h4 className="w-100 my-5 py-5 text-center">Stocking the store. Please wait...</h4>); }
	if (isError) { return (<h4 className="w-100 my-5 py-5 text-center">Error: {error.message}</h4>); }

	return (<div>
		<div className="products-grid">
			{isFetching ? (<h4 className="w-100 h-75 text-center">Fetching page...</h4>) :
				(cards.map(card => (
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
					</Card>
				)))}
		</div>

		<Pagination className="mt-5 mx-auto d-flex w-100 justify-items-center align-items-center">
			<Pagination.First
				onClick={() => fetchPreviousPage({ pageParam: 1 })}
				disabled={currentPage === 1 || isFetching} />
			<Pagination.Prev
				onClick={() => fetchPreviousPage()}
				disabled={!hasPreviousPage || isFetching} />

			<Pagination.Next
				onClick={() => fetchNextPage()}
				disabled={!hasNextPage || isFetching} />
			<Pagination.Last
				onClick={() => fetchNextPage({ pageParam: totalPages })}
				disabled={currentPage === totalPages || isFetching} />
		</Pagination>
	</div >);
}