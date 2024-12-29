import React, { useState, useEffect } from "react";

function DeckOfCards() {
    const [deckId, setDeckId] = useState(null);
    const [cards, setCards] = useState([]);
    const [message, setMessage] = useState('');
    const [remaining, setRemaining] = useState(0);
    const [shuffled, setShuffled] = useState(false);

    useEffect(() => {
        async function fetchDeck() {
            const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/");
            const data = await response.json();
            setDeckId(data.deck_id);
            setRemaining(data.remaining);
        }
        fetchDeck();
    }, []);

    const drawCard = async () => {
        if (remaining <= 0) {
            setMessage("Error: no cards remaining!");
            return;
        }

        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
        const data = await response.json();
        if (data.cards.length > 0) {
            const newCard = data.cards[0];
            setCards((prevCards) => [
                ...prevCards,
                { card: newCard, angle: Math.floor(Math.random() * 60) - 30 }
            ]);
            setRemaining(data.remaining - 1);
            setMessage('');
        }
    };

    const shuffleDeck = async () => {
        setShuffled(true);
        setCards([]);

        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
        const data = await response.json();

        if (data.success) {
            setRemaining(data.remaining);
            setMessage('Deck shuffled!  Start drawing cards again.');
        }

        setShuffled(false);
    }

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                height: "100vh",
                backgroundColor: "green",
                padding: "40px",
                position: "relative",
            }}
        >
            <h1 style={{ color: 'white' }}>Deck of Cards</h1>
            <button 
                style={{ 
                    backgroundColor: 'darkslategray', color: 'white', 
                    padding: '10px 10px', 
                    marginBottom: '30px', 
                    cursor: 'pointer'
                }} 
                onClick={drawCard}
                disabled={shuffled}>GIMME A CARD!
            </button>

            <button
                style={{
                    backgroundColor: 'darkblue',
                    color: 'white',
                    padding: '10px 10px',
                    marginBottom: '25px',
                    cursor: 'pointer'
                }}
                onClick={shuffleDeck}
                disabled={shuffled}>SHUFFLE THE DECK
            </button>

            {message && (
                <div 
                    style={{ 
                        color: 'red', 
                        padding: "10px",
                        fontSize: '28px',
                        fontWeight: 'bold' 
                    }}
                >
                    {message}
                </div>
            )}

            <div style={{ position: "relative", width: "200px", height: "300px", marginTop: "30px" }}>
                {cards.length > 0 && cards.map((cardData, index) => {
                    return (
                        <div
                            key={index}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                zIndex: index,
                                transform: `rotate(${cardData.angle}deg)`,
                                transition: "transform 0.3s ease",
                            }}
                        >
                            <img
                                src={cardData.card.image} 
                                alt={`${cardData.card.value} of ${cardData.card.suit}`}
                                style={{ width: "100%", height: "auto" }} 
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );    
}

export default DeckOfCards;
