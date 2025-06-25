import "../App.css";
import { Card, Badge, ListGroup } from 'react-bootstrap';

const typeIcons = {
    Colorless: "card-icons/normal.png",
    Fire: "card-icons/fire.png",
    Water: "card-icons/water.png",
    Lightning: "card-icons/electric.png",
    Grass: "card-icons/grass.png",
    Ice: "card-icons/ice.png",
    Fighting: "card-icons/fighting.png",
    Poison: "card-icons/poison.png",
    Ground: "card-icons/ground.png",
    Flying: "card-icons/flying.png",
    Psychic: "card-icons/psychic.png",
    Bug: "card-icons/bug.png",
    Rock: "card-icons/rock.png",
    Ghost: "card-icons/ghost.png",
    Dragon: "card-icons/dragon.png",
    Darkness: "card-icons/dark.png",
    Metal: "card-icons/steel.png",
    Fairy: "card-icons/fairy.png",
};

const CardInfo = ({ card }) => {
    return (
        <Card className="p-3" style={{ minHeight: '100%', border: 'none' }}>
            <Card.Title>{card.name} {card.level && <Badge bg="secondary">Lv. {card.level}</Badge>}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{card.supertype} {card.subtypes?.join(', ')}</Card.Subtitle>
            <Card.Text><strong>HP:</strong> {card.hp}</Card.Text>
            {card.types?.length > 0 && (
                <Card.Text>
                    <strong>Type:</strong>
                    {card.types.map((type, idx) => (
                        <div>
                            <img key={idx} src={typeIcons[type]} alt={type} title={type} style={{ height: "30px" }} />
                            {type}
                        </div>
                    ))}
                </Card.Text>
            )}

            <ListGroup variant="flush">
                {card.evolvesFrom && (
                    <ListGroup.Item><strong>Evolves From:</strong> {card.evolvesFrom}</ListGroup.Item>
                )}
                {card.evolvesTo?.length > 0 && (
                    <ListGroup.Item><strong>Evolves To:</strong> {card.evolvesTo.join(', ')}</ListGroup.Item>
                )}
                {card.rules?.length > 0 && (
                    <ListGroup.Item>
                        <strong>Rules:</strong>
                        <ul>{card.rules.map((rule, idx) => <li key={idx}>{rule}</li>)}</ul>
                    </ListGroup.Item>
                )}
                {card.ancientTrait && (
                    <ListGroup.Item>
                        <strong>Ancient Trait:</strong> <em>{card.ancientTrait.name}</em><br />
                        {card.ancientTrait.text}
                    </ListGroup.Item>
                )}
                {card.abilities?.length > 0 && (
                    <ListGroup.Item>
                        <strong>Abilities:</strong>
                        <ul>
                            {card.abilities.map((ability, idx) => (
                                <li key={idx}><strong>{ability.name}</strong>: {ability.text}</li>
                            ))}
                        </ul>
                    </ListGroup.Item>
                )}
                {card.attacks?.length > 0 && (
                    <ListGroup.Item>
                        <strong>Attacks:</strong>
                        <ul>
                            {card.attacks.map((attack, idx) => (
                                <li key={idx}>
                                    <strong>{attack.name}</strong> ({attack.cost?.join(', ')}) – {attack.damage}<br />
                                    <small>{attack.text}</small>
                                </li>
                            ))}
                        </ul>
                    </ListGroup.Item>
                )}
                {card.weaknesses?.length > 0 && (
                    <ListGroup.Item>
                        <strong>Weaknesses:</strong> {card.weaknesses.map(w => `${w.type} ×${w.value}`).join(', ')}
                    </ListGroup.Item>
                )}
                {card.resistances?.length > 0 && (
                    <ListGroup.Item>
                        <strong>Resistances:</strong> {card.resistances.map(r => `${r.type} −${r.value}`).join(', ')}
                    </ListGroup.Item>
                )}
                {card.retreatCost?.length > 0 && (
                    <ListGroup.Item>
                        <strong>Retreat Cost:</strong> {card.retreatCost.join(', ')} ({card.convertedRetreatCost})
                    </ListGroup.Item>
                )}
                <ListGroup.Item>
                    <strong>Set:</strong> {card.set?.name} | <strong>#{card.number}</strong><br />
                    <strong>Rarity:</strong> {card.rarity} | <strong>Illustrator:</strong> {card.artist}
                </ListGroup.Item>
                {card.flavorText && (
                    <ListGroup.Item>
                        <em>"{card.flavorText}"</em>
                    </ListGroup.Item>
                )}
                <ListGroup.Item>
                    <strong>Legalities:</strong>{" "}
                    {Object.entries(card.legalities || {}).map(([format, status]) => (
                        <Badge key={format} bg={status === 'Legal' ? 'success' : 'secondary'} className="me-1">
                            {format}: {status}
                        </Badge>
                    ))}
                </ListGroup.Item>
            </ListGroup>
        </Card>
    );
};

const CardFront = ({ card }) => {
    return (
        <Card className="border-0" style={{ width: "100%", height: "100%", borderRadius: "0.58rem" }}>
            <Card.Img variant="top" src={card.images.large} alt={card.name} draggable="false" style={{ minHeight: "105%", borderRadius: "0.58rem", margin: "auto" }} />
            <div className="card-shadow"></div>
        </Card>
    );
};

const CardBack = ({ card }) => {
    return (
        <Card className="border-0" style={{ width: "100%", height: "100%", borderRadius: "0.58rem" }}>
            <Card.Img variant="top" src="card-back.png" alt={card.name} draggable="false" style={{ minHeight: "105%", borderRadius: "0.58rem", margin: "auto" }} />
            <div className="card-shadow"></div>
        </Card>
    );
};

export { CardInfo, CardFront, CardBack };