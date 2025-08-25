import "../App.css";
import { useState, useEffect } from "react";
import { playCardFlipSfx } from "../utils/sfx";
// api
import api from "../services/api";
import { generateAvatar } from "../utils/avatar";
// bootstrap
import { Container, Col, Row, Button, Card } from "react-bootstrap";

export default function FeaturedCarousel() {
    // set cursor mode on card hover
    const [grabbingCard, setGrabbingCard] = useState(null);
    const [fanCards, setFanCards] = useState(() => {
        const saved = localStorage.getItem("fanCards");
        return saved ? JSON.parse(saved) : [];
    });
    const [index, setIndex] = useState(0); // active center card

    const [avatarSvg, setAvatarSvg] = useState(null);

    useEffect(() => {
        generateAvatar().then((svg) => {
            console.log("Generated SVG:", svg); // Check if this logs valid SVG
            if (svg) setAvatarSvg(svg);
        });
    }, []);

    useEffect(() => {
        if (fanCards.length === 0) {
            api.get('/cards')
                .then(res => {
                    const allCards = res.data.data;
                    const shuffled = [...allCards].sort(() => 0.5 - Math.random());
                    const selected = shuffled.slice(0, 3);

                    setFanCards(selected);
                    localStorage.setItem("fanCards", JSON.stringify(selected));
                })
                .catch(err => console.error('Error:', err));
        }
    }, [fanCards]);

    const visibleCards = [
        fanCards[(index + 2) % 3], // left
        fanCards[index],           // center
        fanCards[(index + 1) % 3], // right
    ];

    if (fanCards.length < 3) {
        return <div>Loading cards...</div>;
    }

    return (
        <Container className="d-flex justify-content-center">
            <Row className="row-auto d-flex justify-content-center align-items-center">
                <div className="featured-carousel">
                    {visibleCards.map((card, i) => {
                        // if card is 2nd, set in middle
                        const position = i === 1 ? 'center' : i === 0 ? 'left' : 'right';
                        // if card is not center, set opacity to 75%
                        const opacity = i === 1 ? 100 : 25;

                        return (
                            <div
                                key={card.id}
                                className={`featured-card ${position} opacity-${opacity} ${grabbingCard === card.id ? 'grabbing' : ''}`}
                                onClick={() => {
                                    if (i !== 1) playCardFlipSfx(); // play card flip sfx
                                    if (i === 0) setIndex((index + 2) % 3); // move left
                                    else if (i === 2) setIndex((index + 1) % 3); // move right
                                }}
                                // change cursor appearance to grabbing when clicking
                                onMouseDown={() => setGrabbingCard(card.id)}
                                onMouseUp={() => setGrabbingCard(null)}
                                onMouseLeave={() => setGrabbingCard(null)} >

                                <Card className="featured-card-outer"
                                    style={{ width: "100%", height: "100%", borderRadius: "0.6rem" }}
                                >
                                    <Card className="featured-card-inner" bg="light"
                                        style={{ width: "100%", height: "100%", borderRadius: "0.6rem" }}
                                    >
                                        <Card.Img variant="top" src={card.images.large} alt={card.name}
                                            draggable="false" className={`img ${position}`}
                                            style={{ borderRadius: "0.6rem", margin: "auto" }}
                                        />

                                        <Row className="featured-label">
                                            <Col className="col-auto m-0 p-0">
                                                <p className="featured-title">Product title</p>
                                                <p className="featured-user">@User</p>
                                            </Col>
                                            <Col className="col-auto">
                                                <Row>
                                                    <div
                                                        className="avatar-container rounded-circle m-0 p-0"
                                                        dangerouslySetInnerHTML={{ __html: avatarSvg }}
                                                        style={{ width: "25px", height: "25px" }}
                                                    />
                                                </Row>
                                            </Col>
                                        </Row>

                                        <div className="featured-card-shadow"></div>
                                    </Card>

                                    <Container className="mt-3 mb-2">
                                        <Row className="featured-desc">
                                            <Col className="col-auto auction-title">Current bid</Col>
                                            <Col className="col-auto auction-title">Ending in</Col>
                                        </Row>
                                        <Row className="featured-desc">
                                            <Col className="col-auto auction-content">45,000 PHP</Col>
                                            <Col className="col-auto auction-content">00h 00m 00s</Col>
                                        </Row>
                                    </Container>

                                </Card>

                            </div>
                        );
                    })}
                </div>
            </Row>
        </Container>
    );
}
