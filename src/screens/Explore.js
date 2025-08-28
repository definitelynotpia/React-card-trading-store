import "../App.css";
import "../styles/explore.css";
// icons
import * as Icon from 'react-icons/ri';
import GradientIcon from "../utils/gradientIcons.js";
// react
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { playCardFlipSfx } from "../utils/sfx";
import api from "../services/api";
import { Button, Container, Col, Row, Card, Carousel } from "react-bootstrap";
import { CardFront, CardBack } from "../components/card.js";

export default function Explore({ cards }) {
    // track card flipping
    const [flippedCards, setFlippedCards] = useState({});
    // set cursor mode on card hover
    const [grabbingCard, setGrabbingCard] = useState(null);

    const toggleFlip = (cardId) => {
        setFlippedCards(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    return (<div className="content">
        <div className="page-title d-flex flex-row align-items-center">
            <GradientIcon size={35} Icon={Icon.RiMenuSearchLine } />
            <h1 className="gradient-text">Explore</h1>
        </div>
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
    </div>);
}