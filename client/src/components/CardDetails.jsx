import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { replaceManaSymbols } from "../utils/replaceManaSymbols";
import NavBarAndSearch from "./NavBarAndSearch";

// Componente que exibe os detalhes de uma carta específica
// Obtém o ID da carta da URL, faz uma requisição à API para buscar os detalhes da carta
// Exibe o nome, imagem, tipo, texto oracle, custo de mana e nome do conjunto
// Se a carta não for encontrada, exibe uma mensagem de erro
// Lembrar de estilizar e adicionar mais coisas depois

function CardDetails() {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // const cleanManaSymbols = (text) => {
  //   if (!text) return "N/A";
  //   return text.replace(/[{}]/g, "");
  // };

  useEffect(() => {
    fetch(`http://localhost:3030/api/cards/${cardId}`)
      .then((res) => res.json())
      .then((data) => setCard(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [cardId]);

  if (loading) {
    return (
      <>
        <NavBarAndSearch />
        <div className="flex items-center justify-center min-h-screen pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-white">Loading card...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavBarAndSearch />
        <div className="flex items-center justify-center min-h-screen pt-24">
          <div className="text-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-md">
              <p className="text-red-400 font-medium">Error: {error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!card) {
    return (
      <>
        <NavBarAndSearch />
        <div className="flex items-center justify-center min-h-screen pt-24">
          <div className="text-center">
            <div className="bg-white/5 rounded-lg p-6">
              <p className="text-white">Card not found</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Função utilitária para obter a imagem correta da carta (normal ou dupla face)
  const getCardImage = (card) => {
    if (card.image_uris) {
      return card.image_uris.normal || card.image_uris.large || card.image_uris.small || card.image_uris.art_crop;
    }
    if (card.card_faces && card.card_faces[0]?.image_uris) {
      return (
        card.card_faces[0].image_uris.normal ||
        card.card_faces[0].image_uris.large ||
        card.card_faces[0].image_uris.small ||
        card.card_faces[0].image_uris.art_crop
      );
    }
    // Tenta pegar da segunda face, se a primeira não tiver
    if (card.card_faces && card.card_faces[1]?.image_uris) {
      return (
        card.card_faces[1].image_uris.normal ||
        card.card_faces[1].image_uris.large ||
        card.card_faces[1].image_uris.small ||
        card.card_faces[1].image_uris.art_crop
      );
    }
    return null;
  };
  console.log("URL da imagem:", getCardImage(card));
  return (
    <>
      
      <NavBarAndSearch />
      <div className="min-h-screen pt-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Coluna da Imagem */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {card.card_faces ? (
                  <div className="flex flex-col gap-4 items-center justify-center">
                    {card.card_faces.map((face, idx) => (
                      <img
                        key={idx}
                        src={face.image_uris?.normal}
                        alt={face.name}
                        className="rounded-2xl shadow-2xl max-w-xs w-full h-auto"
                      />
                    ))}
                  </div>
                ) : (
                  <img
                    src={card.image_uris?.normal}
                    alt={card.name}
                    className="rounded-2xl shadow-2xl max-w-sm w-full h-auto"
                  />
                )}
              </div>
            </motion.div>

            {/* Coluna dos Detalhes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Título */}
              <div className="text-center lg:text-left">
                <h1 className="flex justify-center text-4xl lg:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  {card.name}
                </h1>
              </div>

              {/* Cards de Informações */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <h3 className="text-red-400 font-semibold text-sm uppercase tracking-wide mb-2">
                    Type
                  </h3>
                  <p className="text-white text-lg">{card.type_line}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <h3 className="text-red-400 font-semibold text-sm uppercase tracking-wide mb-2">
                    Mana Cost
                  </h3>
                  <p className="text-white text-lg font-mono">{replaceManaSymbols(card.mana_cost)}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <h3 className="text-red-400 font-semibold text-sm uppercase tracking-wide mb-2">
                    Set Name
                  </h3>
                  <p className="text-white text-lg">{card.set_name}</p>
                </motion.div>

                {card.oracle_text && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                  >
                    <h3 className="text-red-400 font-semibold text-sm uppercase tracking-wide mb-2">
                      Oracle Text
                    </h3>
                    <p className="text-white text-base leading-relaxed whitespace-pre-wrap">
                      {replaceManaSymbols(card.oracle_text)}
                    </p>
                  </motion.div>
                )}
              </div>
              <div className="flex justify-center mt-8">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 text-lg"
                  onClick={() => navigate(`/create-deck?card=${encodeURIComponent(card.name)}`)}
                >
                  Create a Deck with this card!
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
export default CardDetails;