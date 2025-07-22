import { useState } from 'react';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CardSearch from '../components/Search Bar/CardSearch.jsx';
import profilePhoto from '../../public/images/profile_photo.jpg';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NavBarAndSearch from "../components/NavBarAndSearch";
import axios from "axios";
import { motion } from "framer-motion";
import { useRef } from 'react';


// Componente de perfil do usuário, que exibe informações do usuário e permite navegar para outras páginas
// O username é obtido da URL, por exemplo, /profile/testuser
// O usuário pode criar um novo deck, ver suas cartas, estatísticas e tutoriais
// O componente também inclui uma barra de pesquisa para buscar cartas

function Profile() {
  const { username } = useParams(); //
  const navigate = useNavigate(); // hook para navegar entre paginas
  const [decks, setDecks] = useState([]);
  const [loadingDecks, setLoadingDecks] = useState(true);
  const allCards = decks.flatMap(deck => deck.cards || []);
  const totalCards = allCards.length;
  const fileInputRef = useRef();
  const [profileImg, setProfileImg] = useState(() => {
    return localStorage.getItem('profilePhoto') || profilePhoto;
  });

  const handleCreateDeck = () => {
    navigate(`/create-deck?user=${username}`); // Navega para a página de criação de deck com o username como parâmetro
  };

  // Exemplo de dados rápidos (mock)
  const quickStats = [
    { label: "Decks", value: decks.length },
    { label: "Shared Decks, coming soon", value: 0,}, // Adicionar depois essa funcionalidade
    { label: "Cards", value: totalCards },
  ];

  const menuItems = [
    { text: "Statistics", link: `/statsPage/${username}` },
    { text: "My Cards", link: `/userCards/${username}` },
    { text: "Create New Deck", link: "#", onClick: () => handleCreateDeck() },
    { text: "Tutorials", link: "/Tutorials/" },
  ];

  const handleChangePhoto = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImg(ev.target.result);
        localStorage.setItem('profilePhoto', ev.target.result);
        window.dispatchEvent(new Event('profilePhotoChanged'));
      };
      reader.readAsDataURL(file);
    }
  };

  // Buscar decks do usuário
  React.useEffect(() => {
    const fetchDecks = async () => {
      setLoadingDecks(true);
      try {
        const res = await axios.get(`http://localhost:3030/api/decks?user=${username}`);
        setDecks(res.data);
      } catch (err) {
        setDecks([]);
      } finally {
        setLoadingDecks(false);
      }
    };
    if (username) fetchDecks();

    const anchor = window.location.hash;
    if (anchor === "#my-decks") {
      const target = document.getElementById("my-decks");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [username]);

  // Excluir deck
  const handleDeleteDeck = async (deckId) => {
    if (!window.confirm("Are you sure you want to delete this deck?")) return;
    try {
      await axios.delete(`http://localhost:3030/api/decks/${deckId}`);
      setDecks((prev) => prev.filter((d) => d._id !== deckId));
    } catch (err) {
      alert("Erro ao excluir deck!");
    }
  };

  // Editar deck (mock)
  const handleEditDeck = (deckId) => {
    navigate(`/create-deck?edit=${deckId}&user=${username}`);
  };

  return (
    <>
      <header>
        <NavBarAndSearch />
      </header>
      <main className="w-full min-h-screen pt-24 pb-8 bg-transparent">
        {/* Imagem de perfil centralizada */}
        <div className="flex flex-col items-center mt-4 mb-2">
          <div className="relative">
            <div className="w-40 h-40 rounded-full p-[2px] bg-gradient-to-r from-red-500 via-yellow-400 to-orange-500 glow-gradient-image mx-auto">
              <img
                src={profileImg}
                alt="user-profile-photo"
                className="rounded-full w-full h-full object-cover"
              />
            </div>

            <button
              onClick={handleChangePhoto}
              className="absolute bottom-2 right-2 bg-black/80 text-white px-3 py-1 rounded-full text-xs border border-white/30 hover:bg-red-700 transition hover:font-semibold hover:border-white/50"
            >
              Edit Photo
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
          <h2
            className="mt-8 text-3xl font-extrabold tracking-tight font-magic text-center select-text bg-clip-text text-transparent animate-gradient-bg bg-gradient-to-r from-red-500 via-yellow-400 to-orange-500"
          >{username}
          </h2>
        </div>

        {/* Quick stats */}
        <div className="flex flex-wrap justify-center gap-6 my-6 mx-4">
          {quickStats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center bg-white/10 rounded-xl px-7 py-3 shadow border border-white/20 min-w-[90px]">
              <span className="text-xl font-bold text-white">{stat.value}</span>
              <span className="text-xs text-gray-300 uppercase tracking-wide">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Menu com botões em linha */}
        <div className="flex flex-wrap justify-center gap-4 w-full px-2 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.text}
              onClick={item.onClick ? item.onClick : () => navigate(item.link)}
              className="py-2 px-5 rounded-lg bg-red-800/10 text-white font-semibold text-base shadow hover:bg-red-700/20 border border-white/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
              style={{ letterSpacing: '0.02em' }}>
              {item.text}
            </button>
          ))}
        </div>


        {/* Decks do usuário */}
        <div id="my-decks" className="w-full max-w-4xl mx-auto mt-2">
          <h3 className="text-xl font-bold text-white m-4 flex justify-center">My Decks</h3>
          {loadingDecks ? (
            <p className="text-white/70">Loading decks...</p>
          ) : decks.length === 0 ? (
            <p className="text-white/70">You better create a deck, now!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
              {decks.map((deck) => (
                <div key={deck._id} className="bg-white/10 rounded-xl m-2 p-4 shadow border border-white/10 flex flex-col gap-2">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-1 truncate">{deck.name}</h4>
                    <p className="text-sm text-gray-300 mb-2">Cards: {deck.cards?.length ?? 0}</p>

                    {/* Prévia das 3 primeiras cartas */}
                    {Array.isArray(deck.cards) && deck.cards.length > 0 && (
                      <div className="flex justify-center gap-2 my-3">
                        {deck.cards.slice(0, 3).map((card, idx) => (
                          <motion.img
                            key={card.id || idx}
                            src={card.image_uris?.small || card.image_uris?.normal || card.image_uris?.large}
                            alt={card.name}
                            className="w-20 h-28 object-cover rounded border border-white/10 shadow"
                            title={card.name}
                            initial={{ y: 0 }}
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                              duration: 3 + Math.random(), // entre 3 e 4 segundos
                              repeat: Infinity,
                              repeatType: "loop",
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditDeck(deck._id)}
                      className="flex-1 py-1 px-3 rounded bg-blue-950 hover:bg-blue-900 text-white text-sm font-semibold transition"
                    >Edit</button>
                    <button
                      onClick={() => handleDeleteDeck(deck._id)}
                      className="flex-1 py-1 px-3 rounded bg-red-900 hover:bg-red-700 text-white text-sm font-semibold transition"
                    >Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="mt-8 text-gray-500 text-sm text-center p-1">
        © {new Date().getFullYear()} My Deck Builder. All rights reserved.
      </footer>
    </>
  );
}

export default Profile;
