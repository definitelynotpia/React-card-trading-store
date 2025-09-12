import "../App.css";
import { useState, useEffect } from "react";
import { playCardFlipSfx } from "../utils/sfx";
import CardBack from "../assets/card-back.png";
// api
import { useCards } from "../services/pokemonQueries";
import { generateAvatar } from "../utils/avatar";
// bootstrap
import { Container, Col, Row, Button, Card } from "react-bootstrap";

export default function FeaturedCarousel() {
    // query cards
    const { data: featuredCards = [], isLoading, isError, error } = useCards(3);

    // carousel ui states
    const [grabbingCard, setGrabbingCard] = useState(null);
    const [index, setIndex] = useState(0); // active center card
    const [paused, setPaused] = useState(false);
    const [visibleCards, setVisibleCards] = useState([]);

    // placeholder avatar
    const [avatarSvg, setAvatarSvg] = useState(null);
    useEffect(() => {
        generateAvatar().then((svg) => {
            if (svg) setAvatarSvg(svg);
        });
    }, []);

    useEffect(() => {
        if (featuredCards.length >= 3) {
            setVisibleCards([
                featuredCards[(index + 2) % 3], // left
                featuredCards[index],           // center
                featuredCards[(index + 1) % 3], // right
            ]);
        }
    }, [featuredCards, index]);

    // autoplay carousel, pause on hover
    useEffect(() => {
        // if paused or no cards, do not play
        if (paused === 0) return;
        // else, cycle through cards by interval
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % (visibleCards.length || 3));
        }, 1250);
        return () => clearInterval(interval);
    }, [paused, featuredCards.length, visibleCards.length]);

    if (isLoading) {
        return (
            <Container className="d-flex justify-content-center">
                <Row className="row-auto d-flex justify-content-center align-items-center">
                    <div className="featured-carousel"
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}>
                        {Array(3).fill(true).map((card, i) => {
                            // if card is 2nd, set in middle
                            const position = i === 1 ? 'center' : i === 0 ? 'left' : 'right';
                            // if card is not center, set opacity to 75%
                            const opacity = i === 1 ? 100 : 50;

                            return (<div
                                className={`featured-card ${position} opacity-${opacity} ${grabbingCard === card.id ? 'grabbing' : ''}`}
                                onClick={() => {
                                    if (i !== 1) playCardFlipSfx(); // play card flip sfx
                                    setIndex((prevIndex) => (prevIndex + 1) % featuredCards.length);
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
                                        <Card.Img variant="top" src={CardBack} alt="Pokemon card back image"
                                            draggable="false" className={`img ${position}`}
                                            style={{ borderRadius: "0.6rem", margin: "auto" }}
                                        />

                                        <div className="featured-card-shadow"></div>
                                    </Card>

                                    <Container className="mt-3 mb-2 d-flex flex-column justify-content-center">
                                        <h6 className="p-0 m-0 text-center">Creating magic for you...</h6>
                                        <p className="p-0 m-0 text-center">Please wait a moment.</p>
                                    </Container>
                                </Card>

                            </div>);
                        })}
                    </div>
                </Row>
            </Container>);
    }

    if (isError) { return <div>Error: {error.message}</div>; }

    return (
        <Container className="d-flex justify-content-center">
            <Row className="row-auto d-flex justify-content-center align-items-center">
                <div className="featured-carousel"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}>
                    {visibleCards.map((card, i) => {
                        // if card is 2nd, set in middle
                        const position = i === 1 ? 'center' : i === 0 ? 'left' : 'right';
                        // if card is not center, set opacity to 75%
                        const opacity = i === 1 ? 100 : 50;

                        return (
                            <div
                                key={card.id}
                                className={`featured-card ${position} opacity-${opacity} ${grabbingCard === card.id ? 'grabbing' : ''}`}
                                onClick={() => {
                                    if (i !== 1) playCardFlipSfx(); // play card flip sfx
                                    setIndex((prevIndex) => (prevIndex + 1) % featuredCards.length);
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

                                        <Button className="m-0 py-1 blue-outline-btn align-self-center" style={{ scale: "0.8" }} onClick={(event) => {
                                            event.stopPropagation(); // prevent carousel next
                                            // insert redirect here
                                        }}>View Card</Button>

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
