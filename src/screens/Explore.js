import "../App.css";
import * as Icon from 'react-bootstrap-icons';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { playCardFlipSfx } from "../utils/sfx";
import api from "../services/api";
// import { CardFront, CardBack } from "../components/card";
import { Button, Container, Col, Row, Card, Carousel } from "react-bootstrap";
import FeaturedCarousel from "../components/featuredCarousel";
import Services from "../components/servicesList";

export default function Home({ cards }) {
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

    return (<div>

        <div className="gradient-bg">
            <div className="hero-section">
                <div className="blob blue"></div>
                <FeaturedCarousel></FeaturedCarousel>
                <div className="hero-anchored-text">
                    <h1 className="hero-section-text"><span className="gradient-text">Discover</span>,&nbsp;<span className="gradient-text">Collect</span>, and&nbsp;<span className="gradient-text">Buy</span></h1>
                    <h1 className="hero-section-text">Pokemon Cards&nbsp;<span className="gradient-text">Securely!</span></h1>
                    <Row className="subtitle-section d-flex justify-content-center align-items-center pt-3">
                        <Col className="col-auto p-0 m-0 align-self-center">
                            <p className="subtitle">A trusted hub for the Pokemon<br />community. Gotta catch 'em all!</p>
                        </Col>
                        <Col className="col-auto p-0 m-0">
                            <Button variant="dark" className="rounded-pill ms-5">Shop now</Button>
                            <Button className="rounded-pill custom-btn-color ms-3">I want to sell!</Button>
                        </Col>
                    </Row>
                </div>
            </div>

            <div className="hero-section-platform">
                <img className="hero-section-pokemon jigglypuff" src="./assets/Pokemons/3D_Jigglypuff.webp" draggable="false" />
                <img id="hero-section-pokemon pikachu" className="hero-section-pokemon pikachu flip-image" src="./assets/Pokemons/3D_Pikachu.png" draggable="false" />
            </div>
        </div>

        <div className="services-list d-flex justify-content-center align-items-center">
            <Services></Services>
        </div>

        {/* <Row>
                {cards.slice(0, 16).map(card => (
                    // 4x4 grid of cards
                    <Col key={card.id} md={3} className="my-4">
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
                    </Col>
                ))}
            </Row> */}
    </div >);
}