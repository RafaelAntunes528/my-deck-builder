import CardSearch from "../components/Search Bar/CardSearch";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import NavBarHome from "../components/NavBarHome";
import { FaDiceD20 } from "react-icons/fa";
import LogoWithGlow from "../components/LogowithGlow";
import Footer from "../components/Footer";

// Memoize o Logo para evitar re-renderizações desnecessárias
const MemoLogoWithGlow = React.memo(LogoWithGlow);

function Home() {
  const navigate = useNavigate();
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <>
      <NavBarHome />
      <div
        className="relative min-h-screen flex flex-col items-center px-6 sm:px-10 lg:px-16 pt-0 bg-black/45 home-no-scroll"
      >

        <main className="flex-1 w-full flex flex-col">
          <div className="w-full max-w-4xl mx-auto my-12 text-center fonte-morisroman">
            <div className="text-center">
              {/* LOGOTIPO*/}
              <MemoLogoWithGlow />
            </div>
            <p className="mt-1 text-3xl sm:text-5xl font-semibold text-gray-200">
              Search your favorite cards, <br />
              or build your decks <br />
            </p>
          </div>

          {/* Componente de busca */}
          <div className="mb-8 flex justify-center">
            <CardSearch />
          </div>

          {/* New to Magic / Get started / Tools buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 relative fonte-morisroman pb-24 md:pb-0">
            <span className="text-lg sm:text-xl font-medium text-white select-none">
              New to Magic?
            </span>
            <button
              onClick={() => navigate("/tutorials")}
              className="px-8 py-3 bg-red-600 text-white text-2xl rounded-lg shadow hover:bg-red-700 hover:scale-105 transition-transform duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
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
                className="px-8 py-3 bg-white text-black text-2xl rounded-lg shadow hover:scale-105 hover:text-gray-900 transition-transform duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-400"
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
        </main>
      </div>
      <Footer leve />
    </>
  );
}

export default Home;
