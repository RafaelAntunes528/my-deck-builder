import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import NavBarSearch from "../components/NavBarAndSearch";

function SearchResult() {
  const { name } = useParams();
  const [cards, setCards] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


//   function NavbarSearchBar() {
//   return (
//     <div className="w-full max-w-6xl mx-auto px-6 pt-6">
//       <NavBarHome />
//       <div className="mt-6">
//         <CardSearch />
//       </div>
//     </div>
//   );
// }

  useEffect(() => {
    async function fetchCards() {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3030/api/cards?name=${encodeURIComponent(name)}`);
        setCards(res.data);
        setError("");
      } catch (err) {
        setCards([]);
        setError("No card found.");
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, [name]);

  if (loading) {
    return (
      <>
        <NavBarSearch />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-white">Searching for Cards...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBarSearch />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-md">
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
    
    
      <NavBarSearch />
      <div className="w-full max-w-6xl mx-auto p-6 pt-24">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Results for: <span className="text-red-400">{name}</span>
          </h1>
          <p className="text-gray-300">
            {cards.length} Card{cards.length !== 1 ? "s" : ""} found{cards.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {cards.length === 0 && (
            <div className="col-span-full text-center py-8">
              <div className="bg-white/5 rounded-lg p-6">
                <p className="text-white">No Card found.</p>
              </div>
            </div>
          )}

          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              className="group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
              }}
              whileHover={{
                y: -4,
                transition: { duration: 0.2 },
              }}
            >
              <div
                className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20 cursor-pointer hover:border-red-400/50 hover:bg-white/15 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200"
                onClick={() => navigate(`/card/${card.id}`)}
              >
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
      </div>

      <footer className="mt-6 text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} My Deck Builder. All rights reserved.
      </footer>
    </>
  );
}

export default SearchResult;

