import React, { useEffect, useState } from "react";
import NavBarAndSearch from "../components/NavBarAndSearch";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

function UserCards() {
  const { username } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!username) return;

    async function fetchCards() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3030/api/decks?user=${username}`);
        const decks = await res.json();

        // Monta um array de cartas com referência ao deckId e ao índice da carta
        const allCards = [];
        decks.forEach(deck => {
          if (Array.isArray(deck.cards)) {
            deck.cards.forEach((card, idx) => {
              allCards.push({ ...card, deckId: deck._id, cardIndex: idx });
            });
          }
        });

        setCards(allCards);
      } catch (error) {
        setCards([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, [username]);

  const handleRemoveCard = async (deckId, cardIndex) => {
    try {
      // Busque o deck do backend
      const res = await fetch(`http://localhost:3030/api/decks/${deckId}`);
      const deck = await res.json();
      if (!deck || !Array.isArray(deck.cards)) return;

      // Remove a carta do array
      const newCards = [...deck.cards];
      newCards.splice(cardIndex, 1);

      // Atualize o deck no backend
      await fetch(`http://localhost:3030/api/decks/${deckId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: deck.name,
          user: deck.user,
          cards: newCards,
          // outros campos do deck, mas nunca _id!
        }),
      });

      // Atualize o estado local removendo a carta
      setCards(prev => prev.filter(card => !(card.deckId === deckId && card.cardIndex === cardIndex)));
    } catch (err) {
      alert("Erro ao remover carta do deck!");
    }
  };

  return (
    <>
      <NavBarAndSearch />
      <div className="pt-24 max-w-6xl mx-auto p-6">
        <h1 className="text-2xl text-center font-bold text-white mb-6">All My Cards</h1>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-white">Loading cards...</p>
            </div>
          </div>
        ) : cards.length === 0 ? (
          <p className="text-white">No cards found in your decks.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {cards.map((card, index) => (
              <motion.div
                key={`${card.deckId}-${card.cardIndex}`}
                className="group relative"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2 },
                }}>
                {/* Botão X para remover carta */}
                <button
                  className="absolute top-2 right-2 z-10 bg-black/70 text-red-400 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 hover:text-white"
                  onClick={() => handleRemoveCard(card.deckId, card.cardIndex)}
                  title="Remove card"
                >
                  <FaTimes size={14} />
                </button>
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20 cursor-pointer hover:border-red-400/50 hover:bg-white/15 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200"
                  onClick={() => navigate(`/card/${card.id}`)}>
                  <h3 className="font-bold mb-4 text-white text-center text-sm">
                    {card.name}
                  </h3>

                  {/* Imagem + overlay com movimento sincronizado */}
                  <motion.div
                    className="relative rounded-lg"
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 3 + Math.random(),
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    }}
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <img
                      src={card.image_uris?.normal}
                      alt={card.name}
                      className="mx-auto rounded shadow-lg"
                    />

                    {/* Overlay que acompanha a imagem */}
                    <div className="absolute inset-[-1px] bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-lg pointer-events-none">
                      <div className="absolute bottom-2 left-2 right-2 text-center">
                        <span className="text-white text-xs font-medium bg-black/70 px-2 py-1 rounded">
                          Click to see details
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div >
    </>
  );
}

export default UserCards;
