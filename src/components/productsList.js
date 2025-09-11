import "../App.css";
// react
import { playCardFlipSfx } from "../utils/sfx";
import { Card } from "react-bootstrap";
import { CardFront, CardBack } from "../components/card.js";
import { useState } from "react";

export default function Products({ cards }) {
	const [grabbingCard, setGrabbingCard] = useState(null);
	const [flippedCards, setFlippedCards] = useState({});

	const toggleFlip = (cardId) => {
		setFlippedCards(prev => ({
			...prev,
			[cardId]: !prev[cardId]
		}));
	};

	return (
		<div className="products-grid">
			{cards.map(card => (
				<Card className="product-card">
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

					<div className="m-0 p-0">{card.name}</div>
					{card.subtypes.map(subtype => (
						<p>{subtype}</p>
					))}
					<div>{card.name}</div>
				</Card>
			))}
		</div>
	);
}