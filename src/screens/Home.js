import "../App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { playCardFlipSfx } from "../utils/sfx";
import api from "../services/api";
import { CardInfo, CardFront, CardBack } from "../components/card";
import { Container, Col, Row, Card } from "react-bootstrap";

export default function Home({ cards }) {
    // track card flipping
    const [flippedCards, setFlippedCards] = useState({});
    // set cursor mode on card hover
    const [grabbingCard, setGrabbingCard] = useState(null);
    // shuffle cards for display in hero section
    const [fanCards, setFanCards] = useState([]);
    // loader to wait for fan display
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/cards')
            .then(res => {
                const allCards = res.data.data;
                const shuffled = [...allCards].sort(() => 0.5 - Math.random());
                const randomFive = shuffled.slice(0, 5);
                setFanCards(randomFive);
            })
            .catch(err => console.error('Error fetching cards:', err))
            // show card front when loaded
            .finally(() => setLoading(false));
    }, []);


    // Rotation settings
    const totalCards = fanCards.length;
    const maxRotation = 40; // degrees, total spread from left to right
    const angleStep = totalCards > 1 ? maxRotation / (totalCards - 1) : 0;
    const startAngle = -maxRotation / 2;

    const toggleFlip = (cardId) => {
        setFlippedCards(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    return (<div className="gradient-bg">
        <div className="hero-section">

            <div className="fan-layout">
                {fanCards.map((card, index) => {
                    const rotation = startAngle + index * angleStep;
                    const zIndex = fanCards.length - Math.abs(index - Math.floor(fanCards.length / 2));

                    return (
                        <div
                            key={card.id}
                            className="fan-card"
                            style={{
                                left: "50%",
                                top: "50%",
                                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                                zIndex,
                                "--rotation": `${rotation}deg`
                            }}
                        >

                            <Card className="border-0" style={{ width: "100%", height: "100%" }}>
                                <Card.Img variant="top" src={loading ? "card-back.png" : card.images.small} alt={card.name} draggable="false" />
                                <div className="fan-card-shadow"></div>
                            </Card>
                        </div>
                    );
                })}
            </div>


            <Container>
                <Row>
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
                </Row>
            </Container>
        </div>
    </div>);
}