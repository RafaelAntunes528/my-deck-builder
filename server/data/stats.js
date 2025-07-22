const { getUserDecks } = require("./decks.js");

function getColorFromCard(card) {
  // Verifica se a carta é válida e se possui o campo 'colors' como array
  if (!card || typeof card !== "object" || !Array.isArray(card.colors)) {
    console.warn("Carta inválida ou sem propriedade 'colors':", card);
    return "Unknown";
  }

  const colors = card.colors;

  if (colors.length === 0) return "Colorless";
  if (colors.length > 1) return "Multicolor";

  // Cor única
  const colorCode = colors[0];
  switch (colorCode) {
    case "W": return "White";
    case "U": return "Blue";
    case "B": return "Black";
    case "R": return "Red";
    case "G": return "Green";
    default: return "Unknown";
  }
}

async function getStatsForUser(user) {
  const decks = await getUserDecks(user);

  if (!Array.isArray(decks)) {
    console.warn("Nenhum deck encontrado para o utilizador:", user);
    return { colorData: [], typeData: [], topCards: [] };
  }

  const colorMap = {};
  const typeMap = {};
  const cardCount = {};

  decks.forEach(deck => {
    (deck.cards || []).forEach(card => {
      // Proteção contra estruturas malformadas
      if (!card || typeof card !== "object") {
        console.warn("Carta inválida detectada:", card);
        return;
      }

      const color = getColorFromCard(card);
      if (color) colorMap[color] = (colorMap[color] || 0) + 1;

      if (typeof card.type_line === "string") {
        typeMap[card.type_line] = (typeMap[card.type_line] || 0) + 1;
      }

      if (typeof card.name === "string") {
        cardCount[card.name] = (cardCount[card.name] || 0) + 1;
      }
    });
  });

  const colorData = Object.entries(colorMap).map(([name, value]) => ({ name, value }));
  const typeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));
  const topCards = Object.entries(cardCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return { colorData, typeData, topCards };
}

// Se precisares disto no frontend, podes usar algo assim:
// export async function getUserStats(token) {
//   const res = await fetch(`/api/user-stats?user=${username}`, {
//     headers: { 'Authorization': `Bearer ${token}` }
//   });
//   if (!res.ok) throw new Error('Erro ao buscar estatísticas');
//   return res.json();
// }

module.exports = { getStatsForUser };
