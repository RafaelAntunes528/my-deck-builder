import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import NavBarAndSearch from "../components/NavBarAndSearch";
import { motion, AnimatePresence } from "framer-motion";
import { FaFolderOpen } from "react-icons/fa";
import API_BASE from '../api';
import Footer from "../components/Footer";
import { MdOutlineMenuBook } from "react-icons/md";
import FloatingButtonDeck from "../components/FloatingButtonDeck";


// Componente para exibir cada resultado de carta
function CardResult({ card, onAdd, onRemove }) {
  const isDoubleFaced = Array.isArray(card.card_faces) && card.card_faces.length > 1;
  // Função utilitária para pegar a melhor imagem possível de uma face
  const getFaceImage = (face) =>
    face?.image_uris?.normal ||
    face?.image_uris?.large ||
    face?.image_uris?.art_crop ||
    face?.image_uris?.small ||
    "/default-card.png";
  return (
    <div
      className={`relative bg-white/10 p-4 rounded-xl shadow-md transition-transform hover:scale-105 hover:bg-white/20 group cursor-pointer border border-white/10 ${isDoubleFaced ? 'perspective' : ''}`}
      style={isDoubleFaced ? { perspective: '800px' } : {}}
    >
      <h2 className="text-sm font-bold mb-2 text-center text-white">
        {card.name}
      </h2>
      {isDoubleFaced ? (
        <div className="relative w-full h-56 mx-auto group" style={{ perspective: '800px' }}>
          <div className="absolute w-full h-full transition-transform duration-500 transform group-hover:rotate-y-180" style={{ transformStyle: 'preserve-3d' }}>
            {/* Frente */}
            <img
              src={getFaceImage(card.card_faces[0])}
              alt={card.card_faces[0]?.name || card.name}
              className="mx-auto rounded shadow-lg w-full h-56 object-cover absolute backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            />
            {/* Verso */}
            <img
              src={getFaceImage(card.card_faces[1])}
              alt={card.card_faces[1]?.name || card.name}
              className="mx-auto rounded shadow-lg w-full h-56 object-cover absolute rotate-y-180 backface-hidden"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            />
          </div>
        </div>
      ) : (
        <img
          src={card.card_faces ? getFaceImage(card.card_faces[0]) : (card.image_uris?.normal || card.image_uris?.large || card.image_uris?.art_crop || card.image_uris?.small || "/default-card.png")}
          alt={card.name}
          className="mx-auto rounded shadow-lg"
        />
      )}
      <div className="mt-2 flex justify-center gap-2">
        <button
          onClick={() => onAdd(card)}
          className="bg-green-600 px-4 py-1 rounded-full border border-white/10 transition-all duration-200 hover:bg-green-700 hover:scale-110 shadow hover:shadow-lg"
        >
          +
        </button>
        <button
          onClick={() => onRemove(card.id)}
          className="bg-red-600 px-4 py-1 rounded-full border border-white/10 transition-all duration-200 hover:bg-red-700 hover:scale-110 shadow hover:shadow-lg"
        >
          -
        </button>
      </div>
    </div>
  );
}

// Componente lateral (sidebar)
function DeckSidebar({ deckCards, onRemove, onSave, onClear, deckName, setDeckName, isMobile, onClose, format }) {
  // Agrupar cartas por tipo principal
  const groupByType = (cards) => {
    const types = {
      Creature: [],
      Land: [],
      Instant: [],
      Sorcery: [],
      Artifact: [],
      Enchantment: [],
      Planeswalker: [],
      Other: [],
    };
    cards.forEach(card => {
      if (card.type_line?.includes("Creature")) types.Creature.push(card);
      else if (card.type_line?.includes("Land")) types.Land.push(card);
      else if (card.type_line?.includes("Instant")) types.Instant.push(card);
      else if (card.type_line?.includes("Sorcery")) types.Sorcery.push(card);
      else if (card.type_line?.includes("Artifact")) types.Artifact.push(card);
      else if (card.type_line?.includes("Enchantment")) types.Enchantment.push(card);
      else if (card.type_line?.includes("Planeswalker")) types.Planeswalker.push(card);
      else types.Other.push(card);
    });
    return types;
  };
  const types = groupByType(deckCards);

  // Estatísticas do deck
  const manaCurve = Array(8).fill(0); // 0-6+, 7+ = index 7
  const colorCount = { W: 0, U: 0, B: 0, R: 0, G: 0, C: 0 };
  deckCards.forEach(card => {
    // Curva de mana
    let cmc = Math.round(Number(card.cmc) || 0);
    if (cmc > 7) cmc = 7;
    manaCurve[cmc]++;
    // Cores
    if (card.colors && card.colors.length > 0) {
      card.colors.forEach(c => {
        if (colorCount[c] !== undefined) colorCount[c]++;
      });
    } else {
      colorCount.C++;
    }
  });
  const colorNames = { W: 'White', U: 'Blue', B: 'Black', R: 'Red', G: 'Green', C: 'Colorless' };
  const totalCards = deckCards.length;
  const typeTotals = Object.fromEntries(Object.entries(types).map(([type, cards]) => [type, cards.length]));

  return (
    <aside className={`${isMobile ? "fixed top-0 right-0 h-full w-80 z-50" : "sticky top-24 hidden lg:block"} bg-black/60 backdrop-blur-xl border-l border-red-800 p-6 overflow-y-auto shadow-2xl min-w-[300px] rounded-l-3xl border-t border-b border-white/10 scrollbar-thin scrollbar-thumb-red-700/60 scrollbar-track-transparent`}>
      <h2 className="text-xl font-bold mb-4 border-b border-red-700 pb-2 text-white">Current Deck</h2>
      <input
        type="text"
        value={deckName}
        onChange={e => setDeckName(e.target.value)}
        className="w-full mb-4 px-4 py-2 rounded bg-black/60 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-400 placeholder-gray-400"
        placeholder="Enter deck name"
      />
      {/* Validação visual do deck */}
      {deckCards.length > 0 && (
        <div className="mb-4">
          {format === "Commander" && (
            <div className={`px-3 py-2 rounded font-bold text-sm ${deckCards.length === 100 ? "bg-green-800 text-white" : "bg-yellow-700 text-white"}`}>
              {deckCards.length === 100 ? "Valid Commander deck!" : `${100 - deckCards.length} cards left to 100.`}
            </div>
          )}
          {format === "Standard" && (
            <div className={`px-3 py-2 rounded font-bold text-sm ${deckCards.length >= 60 ? "bg-green-800 text-white" : "bg-yellow-700 text-white"}`}>
              {deckCards.length >= 60 ? "Valid Standard deck!" : `${60 - deckCards.length} cards left to 60.`}
            </div>
          )}
        </div>
      )}
      {/* Estatísticas do deck */}
      {deckCards.length > 0 && (
        <div className="mb-6 text-center flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-yellow-300 mb-2">Deck Stats</h3>
          <div className="mb-2">
            <span className="font-semibold text-white">Total cards:</span> {totalCards}
          </div>
          {/* Mana curve moderna na DeckSidebar */}
          <div className="mb-2">
            <span className="font-semibold text-white">Mana Curve:</span>
            <div className="flex gap-1 items-end h-24 mt-1 justify-center">
              {manaCurve.map((count, i) => {
                const colors = [
                  'bg-gray-200', // 0
                  'bg-blue-300', // 1
                  'bg-green-400', // 2
                  'bg-yellow-400', // 3
                  'bg-orange-500', // 4
                  'bg-red-500', // 5
                  'bg-purple-600', // 6
                  'bg-black' // 7+
                ];
                return (
                  <div key={i} className="flex flex-col items-center justify-end">
                    <div className={`w-6 rounded-t-lg shadow ${colors[i]}`} style={{ height: `${count * 10 + 8}px`, minHeight: 8, transition: 'height 0.3s' }}></div>
                    <span className="text-xs text-white mt-1 font-bold">{i < 7 ? i : '7+'}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-white">Colors:</span>
            <div className="flex gap-2 mt-1 justify-center flex-wrap">
              {Object.entries(colorCount).map(([c, count]) => count > 0 && (
                <span
                  key={c}
                  className={`px-3 py-1 rounded-full text-xs font-bold border border-white/20 flex items-center justify-center mx-1 my-1 shadow-md ${
                    c === 'W' ? 'bg-white text-black' :
                    c === 'U' ? 'bg-blue-300 text-blue-900' :
                    c === 'B' ? 'bg-gray-800 text-white' :
                    c === 'R' ? 'bg-red-400 text-red-900' :
                    c === 'G' ? 'bg-green-400 text-green-900' :
                    'bg-gray-200 text-gray-800'
                  }`}
                >
                  {colorNames[c]}: {count}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-2">
            <span className="font-semibold text-white">Types:</span>
            <div className="flex flex-wrap gap-2 mt-1 justify-center">
              {Object.entries(typeTotals).map(([type, count]) => count > 0 && (
                <span
                  key={type}
                  className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center justify-center mx-1 my-1 shadow-md"
                >
                  {type}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      {deckCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 animate-pulse">
          <span className="text-5xl text-white/30 mb-2">🃏</span>
          <p className="text-white/60 italic text-lg">No cards added yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mb-6">
          {Object.entries(types).map(([type, cards]) =>
            cards.length > 0 && (
              <div key={type}>
                <h3 className="text-lg font-bold text-red-400 mb-2">{type} ({cards.length})</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-1">
                  {cards.map((card, index) => (
                    <div key={`${card.id}-${index}-${type}`} className="relative bg-white/20/80 backdrop-blur-lg p-0 rounded-2xl shadow-xl transition-transform duration-200 hover:scale-105 hover:shadow-red-400/40 hover:z-10 group cursor-pointer border border-white/20 flex flex-col items-center justify-center w-40 h-56">
                      <motion.img
                        src={card.card_faces ? (card.card_faces[0]?.image_uris?.normal || card.card_faces[0]?.image_uris?.large) : (card.image_uris?.normal || card.image_uris?.large || "/default-card.png")}
                        alt={card.name}
                        className="mx-auto rounded shadow-lg w-40 h-56 object-cover"
                        initial={{ y: 0 }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 3 + Math.random(),
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut",
                        }}
                      />
                      <div className="w-full text-center text-xs font-semibold text-white mt-1 truncate px-1">
                        {card.name}
                      </div>
                      <button
                        onClick={() => onRemove(card.id)}
                        className="absolute top-1 right-1 bg-red-700 text-xs px-2 py-0.5 rounded-2xl opacity-80 group-hover:opacity-100 transition border border-white/20"
                        title="Remove card"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
      <div className="flex flex-col gap-3 items-center justify-center mt-4">
        <button
          onClick={onSave}
          className="w-40 py-2 rounded-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold shadow-lg transition-all duration-150 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-900 text-lg"
        >
          Save Deck
        </button>
        <button
          onClick={onClear}
          className="w-40 py-2 rounded-full bg-red-700 hover:bg-red-800 active:scale-95 text-white font-bold shadow-lg transition-all duration-150 border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-900 text-lg"
        >
          Delete All
        </button>
      </div>
      {isMobile && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-800 hover:bg-gray-900 active:scale-95 text-white px-4 py-2 rounded-full shadow-lg font-bold text-base border border-white/20 transition-all duration-150"
        >
          Close
        </button>
      )}
    </aside>
  );
}

function CreateDeck() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const username = searchParams.get("user");
  const cardParam = searchParams.get("card");
  const editId = searchParams.get("edit");
  const [deckName, setDeckName] = useState("");
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [deckCards, setDeckCards] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [format, setFormat] = useState("Standard"); // Novo estado para formato
  const [toast, setToast] = useState(null);
  const debounceTimeout = useRef();
 

  useEffect(() => {
    async function fetchFullCards(cards) {
      // Busca dados completos para cartas que não têm image_uris
      return Promise.all(
        cards.map(async (card) => {
          if (card.image_uris) return card;
          // Buscar na Scryfall pelo ID
          try {
            const res = await fetch(`https://api.scryfall.com/cards/${card.id}`);
            if (!res.ok) return card;
            const data = await res.json();
            return data;
          } catch {
            return card;
          }
        })
      );
    }
    if (editId) {
      fetch(`${API_BASE}/api/decks/${editId}`)
        .then(res => res.json())
        .then(async data => {
          setDeckName(data.name || "");
          if (Array.isArray(data.cards) && data.cards.length > 0) {
            const fullCards = await fetchFullCards(data.cards);
            setDeckCards(fullCards);
          } else {
            setDeckCards([]);
          }
        });
    }
  }, [editId]);

  useEffect(() => {
    if (cardParam) {
      // Buscar a carta na API Scryfall pelo nome
      fetch(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardParam)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.id) {
            setDeckCards(prev => {
              // Evitar duplicatas
              if (prev.some(card => card.id === data.id)) return prev;
              return [...prev, data];
            });
          }
        });
    }
  }, [cardParam]);

  const searchCards = async () => {
    const res = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`
    );
    let data;
    try {
      data = await res.json();
    } catch (e) {
      setToast({ type: "error", msg: "No card found or API error." });
      setSearchResults([]);
      return;
    }
    if (data?.data) {
      setSearchResults(data.data);
    } else {
      setToast({ type: "error", msg: data?.details || "No card found." });
      setSearchResults([]);
    }
  };

  // Busca automática ao digitar (debounce)
  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      searchCards();
    }, 500); // 500ms de delay
    return () => clearTimeout(debounceTimeout.current);
  }, [query]);

  // Função utilitária para saber se é terreno básico
  const isBasicLand = (card) => {
    if (!card.type_line) return false;
    return (
      card.type_line.includes("Basic Land") ||
      ["Plains", "Island", "Swamp", "Mountain", "Forest", "Wastes"].includes(card.name)
    );
  };

  // Validação de regras ao adicionar carta
  const handleAddCard = (card) => {
    const count = deckCards.filter((c) => c.id === card.id).length;
    // Commander: 100 cartas, sem repetidas (exceto terrenos básicos)
    if (format === "Commander") {
      if (deckCards.length >= 100) {
        setToast({ type: "error", msg: "Commander: The deck already has 100 cards!" });
        return;
      }
      if (!isBasicLand(card) && deckCards.some((c) => c.id === card.id)) {
        setToast({ type: "error", msg: "Commander: Cannot repeat cards (except basic lands)!" });
        return;
      }
    } else {
      // Standard, Modern, Pauper: máximo 4 cópias (exceto terrenos básicos)
      if (!isBasicLand(card) && count >= 4) {
        setToast({ type: "error", msg: "You cannot add more than 4 copies of the same card!" });
        return;
      }
      // Standard: mínimo 60 cartas
      if (format === "Standard" && deckCards.length >= 60 && !window.confirm("Standard: Decks usually have at least 60 cards. Do you want to continue adding?")) {
        return;
      }
    }
    setDeckCards((prev) => [...prev, card]);
    setToast({ type: "success", msg: `Added: ${card.name}` });
  };

  const handleRemoveCard = (cardId) => {
    const indexToRemove = deckCards.findIndex((card) => card.id === cardId);
    if (indexToRemove !== -1) {
      const removed = deckCards[indexToRemove];
      const newDeck = [...deckCards];
      newDeck.splice(indexToRemove, 1);
      setDeckCards(newDeck);
      setToast({ type: "info", msg: `Removed: ${removed.name}` });
    }
  };

  // Toast timeout
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const deck = {
      name: deckName,
      user: username,
      cards: deckCards,
      createdAt: new Date().toISOString(),
    };
    try {
      const url = editId
        ? `${API_BASE}/api/decks/${editId}`
        : `${API_BASE}/api/decks`;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deck),
      });
      if (res.ok) {
        setToast({ type: "success", msg: "Deck saved successfully!" });
        // Se o deck tiver mais de 10 cartas, redireciona para o perfil
        if (deckCards.length > 10 && username) {
          setTimeout(() => navigate(`/profile/${username}`), 1200);
        }
        // Redirecionar ou limpar formulário se quiser
      } else {
        setToast({ type: "error", msg: "Error saving deck!" });
      }
    } catch (err) {
      setToast({ type: "error", msg: "Error saving deck!" });
    }
  };

  // Adicionar handlers para salvar e limpar deck
  const handleSaveDeck = async () => {
    if (!deckName) {
      setToast({ type: "error", msg: "Please enter a deck name before saving." });
      return;
    }
    await handleSubmit({ preventDefault: () => { } });

  };
  const handleClearDeck = () => {
    if (window.confirm("Are you sure you want to remove all cards from this deck?")) {
      setToast({ type: "info", msg: "All cards removed from the deck." });
      setDeckCards([]);
    }
  };

  return (
    <>
    
    <NavBarAndSearch />
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-lg shadow-lg font-bold text-lg ${toast.type === "error" || toast.type === "info" ? "bg-red-700 text-white" : toast.type === "success" ? "bg-green-700 text-white" : "bg-blue-700 text-white"}`}
        >
          {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>

    {!isSidebarOpen && <FloatingButtonDeck onClick={() => setIsSidebarOpen(true)} />}

    {/* Sidebar/modal for mobile */}
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-0 z-[60] flex lg:hidden pointer-events-none"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[60] pointer-events-auto"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Sidebar */}
          <div className="relative ml-auto h-auto max-h-screen w-80 max-w-full bg-black/90 border-l-2 border-red-800 shadow-2xl rounded-l-3xl flex flex-col overflow-y-auto z-[70] pointer-events-auto">
            <DeckSidebar
              deckCards={deckCards}
              onRemove={handleRemoveCard}
              onSave={handleSaveDeck}
              onClear={handleClearDeck}
              deckName={deckName}
              setDeckName={setDeckName}
              isMobile={true}
              format={format}
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Main layout */}
    <div className="relative z-10 mb-24 mt-12 grid grid-cols-1 lg:grid-cols-2 min-h-screen text-white mx-3 gap-8">
      {/* Deck builder area */}
      <div className="p-8 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-4xl mx-auto border border-white/10 flex flex-col">
        <h1 className="text-3xl lg:text-5xl font-extrabold mb-8 text-center bg-clip-text drop-shadow-lg tracking-tight">
          Deck Builder<br /><span className="text-white/80 font-bold">{username}</span>
        </h1>

        {/* Seletor de formato sempre visível no desktop */}
        <div className="mb-4 flex flex-col sm:flex-row gap-4 items-center justify-center sticky top-0 z-30 bg-white/5 py-2 rounded-xl w-full max-w-md mx-auto">
          <label className="text-white font-semibold">Format:</label>
          <select
            value={format}
            onChange={e => setFormat(e.target.value)}
            className="px-4 py-2 rounded bg-black text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <option value="Standard">Standard</option>
            <option value="Commander">Commander</option>
            <option value="Modern">Modern</option>
            <option value="Pauper">Pauper</option>
          </select>
        </div>

        {/* Search input */}
        <div className="mb-8">
          <label className="block mb-2 font-semibold text-white/80">Search for cards:</label>
          <div className="flex gap-2 flex-col sm:flex-row">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-black px-4 py-2 rounded flex-1 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-900"
              placeholder="Type card name..."
            />
            {/* Botão de busca removido pois a busca agora é automática */}
          </div>
        </div>

        {/* Search results */}
        <div className="mb-6 text-center flex flex-col items-center justify-center">
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {query && query.split(' ').map((q, i) => (
              <span key={i} className="bg-red-600 text-white px-3 py-1 rounded-full font-semibold text-sm shadow border border-red-800">
                {q}
              </span>
            ))}
          </div>
          <p className="text-gray-300 text-base font-medium">
            {searchResults.length} card{searchResults.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {searchResults.map((card) => (
            <CardResult
              key={card.id}
              card={card}
              onAdd={handleAddCard}
              onRemove={handleRemoveCard}
            />
          ))}
        </div>
      </div>

      {/* Sidebar for desktop */}
      <DeckSidebar
        deckCards={deckCards}
        onRemove={handleRemoveCard}
        onSave={handleSaveDeck}
        onClear={handleClearDeck}
        deckName={deckName}
        setDeckName={setDeckName}
        isMobile={false}
        format={format}
      />
    </div>
    <Footer leve />
    </>
  );
}

export default CreateDeck;

