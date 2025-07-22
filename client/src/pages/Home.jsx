import CardSearch from "../components/Search Bar/CardSearch";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import NavBarHome from "../components/NavBarHome";
import { FaDiceD20 } from "react-icons/fa";
import LogoWithGlow from "../components/LogoWithGlow";

// Pagina inicial do site, onde o usuario pode pesquisar cartas, ver as 3 cartas mais pesquisadas do dia e acessar o login e cadastro
// Importante: o servidor deve estar rodando na porta 3030 para que a API funcione corretamente

function Home() {
  const navigate = useNavigate();
  const [topCards, setTopCards] = useState([]); // Adicionado mas lembrar de adicionar depois
  const [toolsOpen, setToolsOpen] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3030/api/cards/top3") // Endpoint para buscar as 3 cartas mais pesquisadas do dia
      .then((res) => res.json())
      .then((data) => setTopCards(data))
      .catch((err) => console.error(err));
  }, []);

  // Header fixo no topo
  // const Header = () => (
  //   <header className="w-full flex justify-end items-center px-6 py-4 bg-transparent top-0 left-0 z-20">
  //     <div className="flex gap-4">
  //       <button
  //         onClick={() => navigate('/login')}
  //         className="px-6 py-3 bg-white text-black rounded-lg hover:bg-red-700 hover:scale-105 hover:text-white transition duration-300 font-medium shadow-lg"
  //       >
  //         Login
  //       </button>
  //       <button
  //         onClick={() => navigate('/signup')}
  //         className="px-5 py-2 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-gray-900 transition font-medium shadow"
  //       >
  //         Sign up
  //       </button>
  //     </div>
  //   </header>
  // );

  return (
    <>
      <div
        className="relative min-h-screen flex flex-col items-center justify-center px-6 sm:px-10 lg:px-16 py-12 pt-0 bg-black/45 home-no-scroll"
        style={{ height: '100vh', overflow: 'hidden' }}
      >
        <header>
          <NavBarHome />
        </header>

        <main>
          {/* escurecimento do fundo excluindo o footer */}

          <div className="w-full max-w-4xl mx-auto my-12 text-center fonte-morisroman">
            <div className=" text-center">
              {/* LOGOTIPO*/}
              <LogoWithGlow />
            </div>

            {/* Pseudo-main starts here */}
            <p className="mt-6 text-3xl sm:text-5xl font-semibold text-gray-200">
              Search for your favorite cards
            </p>
          </div>

          {/* Componente de busca */}
          <div className="mb-8 flex justify-center">
            <CardSearch />
          </div>

          {/* New to Magic / Get started / Tools buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 relative fonte-morisroman">
            <span className="text-lg sm:text-xl font-medium text-white select-none">
              New to Magic?
            </span>
            <button
              onClick={() => navigate("/tutorials")}
              className="px-8 py-3 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 hover:scale-105 transition-transform duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Get Started
            </button>
            <div
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                ref={(el) => (window._toolsBtn = el)}
                className="px-8 py-2 bg-white text-black rounded-lg shadow-lg hover:scale-105 hover:text-gray-900 transition-transform duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400"
                style={{ zIndex: 2, position: "relative", minWidth: 160 }}
              >
                Tools
              </button>
              {/* Dropdown */}
              <div
                className={`absolute left-0 top-full mt-0 bg-white/95 border border-red-700 rounded-b-xl shadow-md transition-all duration-300 z-20 overflow-hidden ${
                  toolsOpen
                    ? "opacity-100 visible translate-y-0 max-h-40"
                    : "opacity-0 invisible -translate-y-2 max-h-0"
                }`}
                style={{
                  width: "100%",
                  minWidth: 160,
                  transitionProperty: "opacity,transform,max-height",
                  transitionDuration: "300ms",
                }}
              >
                <button
                  className="w-full flex items-center gap-3 text-left px-6 py-2 text-black hover:bg-red-600 hover:text-white transition-all duration-200 font-semibold text-base focus:outline-none active:scale-95"
                  onClick={() => navigate("/lifecounter")}
                  style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                >
                  <FaDiceD20
                    className="text-red-500 drop-shadow-lg"
                    style={{ fontSize: "1.5rem", minWidth: "20px", minHeight: "20px" }}
                  />
                  Life Counter
                </button>
              </div>
            </div>
          </div>

          {/* Top 3 Cartas
      <div className="mt-12 w-full max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Top 3 Today's Searches</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          {topCards.map((card, idx) => (
            <div key={card.name} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg flex-1 text-center">
              <div className="text-lg font-bold text-white mb-2">{idx + 1}º - {card.name}</div>
              <img src={card.image} alt={card.name} className="mx-auto rounded shadow mb-2 h-40 object-contain" />
              <div className="text-gray-300 text-sm">Searches today: {card.usage}</div>
            </div>
          ))}
        </div>
      </div> */}
        </main>
        {/* Rodapé */}
        <footer className="mt-16 text-gray-500 text-sm text-center fonte-morisroman">
          © {new Date().getFullYear()} My Deck Builder. All rights reserved.
        </footer>
      </div>
    </>
  );
}

export default Home;
