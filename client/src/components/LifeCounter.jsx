import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LogoWithGlow from "./LogoWithGlow";

const PLAYER_COLORS = [
  "#fefbd6", // white mana
  "#bfddf3", // babyblue
  "#d0f0c0", // green forest
  "#fa7f72", // red salmon
  "#a9a9a9", // black gray
];
const COLOR_NAMES = [
  "White",
  "Blue",
  "Green",
  "Red",
  "Gray",
];

function getPolygonPositions(n, radius = 180, center = 200) {
  // Retorna posições em círculo/hexágono para n jogadores
  const angleStep = (2 * Math.PI) / n;
  return Array.from({ length: n }, (_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    return {
      left: center + radius * Math.cos(angle),
      top: center + radius * Math.sin(angle),
    };
  });
}

export default function LifeCounter() {
  const [step, setStep] = useState(0); // 0: seleção, 1: jogo
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerColors, setPlayerColors] = useState([0, 1, 2, 3, 4]);
  const [lifes, setLifes] = useState([20, 20, 20, 20, 20]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Atualiza número de jogadores e reseta cores/vidas
  const handleNumPlayers = (n) => {
    // Gera um array de índices de cor aleatórios, sem repetir se possível
    let colorIndices = Array.from({ length: PLAYER_COLORS.length }, (_, i) => i);
    // Embaralha o array
    for (let i = colorIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colorIndices[i], colorIndices[j]] = [colorIndices[j], colorIndices[i]];
    }
    // Seleciona as cores para o número de jogadores
    setNumPlayers(n);
    setPlayerColors(colorIndices.slice(0, n));
    setLifes(Array(n).fill(20));
    setStep(1);
  };

  // Troca cor ao clicar no quadrado
  const handleColorCycle = (idx) => {
    setPlayerColors((prev) =>
      prev.map((c, i) => (i === idx ? (c + 1) % PLAYER_COLORS.length : c))
    );
  };

  // Atualiza vida de um jogador
  const handleLife = (idx, delta) => {
    setLifes((prev) => prev.map((v, i) => (i === idx ? v + delta : v)));
  };

  // Reset
  const handleReset = () => {
    setLifes(Array(numPlayers).fill(20));
  };

  // Layout positions
  const positions = getPolygonPositions(
    numPlayers,
    numPlayers === 5 ? 180 : 160,
    220
  );

  return (

    <><div className="w-full max-w-4xl mx-auto my-12 text-center fonte-morisroman">
      <div className=" text-center">
        {/* LOGOTIPO*/}
        <LogoWithGlow />
      </div>
    </div><div className="fixed inset-0 w-screen h-screen bg-black text-white flex flex-col items-center justify-center gap-8 p-0 overflow-hidden z-0">
        {/* Menu sanduíche central só aparece após escolher jogadores */}
        {step === 1 && (
          <>
            <button
              className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-black border-2 border-grey-700 rounded-full p-4 shadow-lg hover:bg-red-900 transition-all duration-200"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open menu"
              style={{ boxShadow: "0 0 16px 2px #0008" }}
            >
              <FaBars className="text-3xl text-white" />
            </button>
            {menuOpen && (
              <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-12 flex flex-col items-center gap-6 animate-fade-in min-w-[280px]">
                {/* Botão de fechar (X) no canto superior direito */}
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="absolute right-1 top-1 w-10 h-10 flex items-center justify-center rounded-full bg-gray-500 text-2xl text-white hover:text-red-500 focus:outline-none z-10"
                  style={{ border: 'none' }}
                >
                  ×
                </button>
                <HoverButton
                  onClick={() => {
                    handleReset();
                    setMenuOpen(false);
                  } }
                  defaultColor="#2d2d2d"
                  hoverColor="#1a1a1a"
                  textColor="#fff"
                  hoverTextColor="#fff"
                  borderColor="#4b5563"
                  hoverScale={1.08}
                  style={{ marginBottom: '0.5rem' }}
                >
                  Reset
                </HoverButton>
                <HoverButton
                  onClick={() => {
                    setStep(0);
                    setMenuOpen(false);
                  } }
                  defaultColor="#b91c1c"
                  hoverColor="#7f1d1d"
                  textColor="#fff"
                  hoverTextColor="#fff"
                  borderColor="#7f1d1d"
                  hoverScale={1.08}
                  style={{ marginBottom: '0.5rem' }}
                >
                  Back
                </HoverButton>
                <HoverButton
                  onClick={() => {
                    navigate("/");
                    setMenuOpen(false);
                  } }
                  defaultColor="#fff"
                  hoverColor="#000"
                  textColor="#000"
                  hoverTextColor="#fff"
                  borderColor="#e5e7eb"
                  hoverScale={1.12}
                  style={{ marginBottom: '0.5rem' }}
                >
                  Main Page
                </HoverButton>
              </div>
            )}
          </>
        )}
        {step === 0 && (
          <div className="flex flex-col items-center gap-8 justify-center min-h-screen px-2 w-full">
            <h2 className="text-xl font-semibold mb-2 text-white drop-shadow-lg">
              Choose number of players
            </h2>
            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-4 sm:gap-6 w-full max-w-xs sm:max-w-none justify-center">
              {[2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => handleNumPlayers(n)}
                  className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 text-white font-bold px-6 py-4 text-xl sm:text-2xl shadow-2xl transition-all duration-200 w-full sm:w-auto hover:scale-105 hover:bg-white/30"
                >
                  {n} Players
                </button>
              ))}
            </div>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 text-lg"
            >
              Back to Home Page
            </button>
          </div>
        )}
        {step === 1 && numPlayers === 2 && (
          <div className="flex w-screen h-screen min-h-screen gap-0">
            {[0, 1].map((idx) => {
              const color = PLAYER_COLORS[playerColors[idx]];
              const isHex = color.startsWith('#');
              return (
                <div
                  key={idx}
                  className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-4 border-white/30 ${!isHex ? color : ''}`}
                  style={isHex ? { backgroundColor: color } : undefined}
                  onClick={() => handleColorCycle(idx)}
                >
                  <span className="text-lg text-gray-800 font-bold mb-2 select-none">
                    Player {idx + 1}
                  </span>
                  <div className="text-6xl text-gray-800 font-extrabold mb-4 select-none">
                    {lifes[idx]}
                  </div>
                  <div className="flex gap-6">
                    <button
                      onClick={e => { e.stopPropagation(); handleLife(idx, 1); } }
                      className="bg-gray-700/70 hover:bg-gray-700/90 text-gray-800 px-5 py-2 rounded text-3xl font-bold"
                    >
                      +
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleLife(idx, -1); } }
                      className="bg-gray-700/70 hover:bg-gray-700/90 text-gray-800 px-5 py-2 rounded text-3xl font-bold"
                    >
                      −
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {step === 1 && numPlayers === 3 && (
          <div className="w-screen h-screen min-h-screen flex flex-row p-0">
            {/* Jogador 1: metade esquerda */}
            <div
              className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-4 border-white/30 ${!PLAYER_COLORS[playerColors[0]].startsWith('#') ? PLAYER_COLORS[playerColors[0]] : ''}`}
              onClick={() => handleColorCycle(0)}
              style={{
                width: "50%",
                minWidth: 0,
                minHeight: 0,
                height: "100vh",
                boxSizing: "border-box",
                margin: 0,
                padding: 0,
                ...(PLAYER_COLORS[playerColors[0]].startsWith('#') ? { backgroundColor: PLAYER_COLORS[playerColors[0]] } : {})
              }}
            >
              <span className="text-lg text-gray-800 font-bold mb-2 select-none">Player 1</span>
              <div className="text-6xl text-gray-800 font-extrabold mb-4 select-none">
                {lifes[0]}
              </div>
              <div className="flex gap-6">
                <button
                  onClick={e => { e.stopPropagation(); handleLife(0, 1); } }
                  className="bg-gray-700/70 hover:bg-gray-700/90 text-gray-800 px-5 py-2 rounded text-3xl font-bold"
                >
                  +
                </button>
                <button
                  onClick={e => { e.stopPropagation(); handleLife(0, -1); } }
                  className="bg-gray-700/70 hover:bg-gray-700/90 text-gray-800 px-5 py-2 rounded text-3xl font-bold"
                >
                  −
                </button>
              </div>
            </div>
            {/* Jogadores 2 e 3: metade direita, dividida em cima e baixo */}
            <div className="flex flex-col flex-1 h-full">
              {/* Jogador 2 */}
              <div
                className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-4 border-white/30 ${!PLAYER_COLORS[playerColors[1]].startsWith('#') ? PLAYER_COLORS[playerColors[1]] : ''}`}
                onClick={() => handleColorCycle(1)}
                style={{
                  minWidth: 0,
                  minHeight: 0,
                  width: "100%",
                  height: "50%",
                  boxSizing: "border-box",
                  margin: 0,
                  padding: 0,
                  ...(PLAYER_COLORS[playerColors[1]].startsWith('#') ? { backgroundColor: PLAYER_COLORS[playerColors[1]] } : {})
                }}
              >
                <span className="text-lg text-gray-800 font-bold mb-2 select-none">
                  Player 2
                </span>
                <div className="text-6xl text-gray-800 font-extrabold mb-4 select-none">
                  {lifes[1]}
                </div>
                <div className="flex gap-6">
                  <button
                    onClick={e => { e.stopPropagation(); handleLife(1, 1); } }
                    className="bg-gray-700/70 hover:bg-gray-700/90 text-gray-800 px-5 py-2 rounded text-3xl font-bold"
                  >
                    +
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); handleLife(1, -1); } }
                    className="bg-gray-700/70 hover:bg-gray-700/90 text-gray-800 px-5 py-2 rounded text-3xl font-bold"
                  >
                    −
                  </button>
                </div>
              </div>
              {/* Jogador 3 */}
              <div
                className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-4 border-white/30 ${!PLAYER_COLORS[playerColors[2]].startsWith('#') ? PLAYER_COLORS[playerColors[2]] : ''}`}
                onClick={() => handleColorCycle(2)}
                style={{
                  minWidth: 0,
                  minHeight: 0,
                  width: "100%",
                  height: "50%",
                  boxSizing: "border-box",
                  margin: 0,
                  padding: 0,
                  ...(PLAYER_COLORS[playerColors[2]].startsWith('#') ? { backgroundColor: PLAYER_COLORS[playerColors[2]] } : {})
                }}
              >
                <span className="text-lg text-gray-800 font-bold mb-2 select-none">
                  Player 3
                </span>
                <div className="text-6xl text-gray-800 font-extrabold mb-4 select-none">
                  {lifes[2]}
                </div>
                <div className="flex gap-6">
                  <button
                    onClick={e => { e.stopPropagation(); handleLife(2, 1); } }
                    className="bg-gray-700/70 hover:bg-gray-700/90 text-gray-800 px-5 py-2 rounded text-3xl font-bold"
                  >
                    +
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); handleLife(2, -1); } }
                    className="bg-gray-700/70 hover:bg-gray-700/90 text-gray-800 px-5 py-2 rounded text-3xl font-bold"
                  >
                    −
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {step === 1 && numPlayers === 4 && (
          <div className="w-screen h-screen min-h-screen flex flex-wrap p-0">
            {Array.from({ length: 4 }).map((_, idx) => {
              const color = PLAYER_COLORS[playerColors[idx]];
              const isHex = color.startsWith('#');
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-4 border-white/30 ${!isHex ? color : ''}`}
                  style={{
                    flex: "1 0 50%",
                    minWidth: 0,
                    minHeight: 0,
                    width: "50%",
                    height: "50%",
                    boxSizing: "border-box",
                    margin: 0,
                    padding: 0,
                    ...(isHex ? { backgroundColor: color } : {})
                  }}
                  onClick={() => handleColorCycle(idx)}
                >
                  <span className="text-lg text-gray-800 font-bold mb-2 select-none">
                    Player {idx + 1}
                  </span>
                  <div className="text-6xl text-gray-800 font-extrabold mb-4 select-none">
                    {lifes[idx]}
                  </div>
                  <div className="flex gap-6">
                    <button
                      onClick={e => { e.stopPropagation(); handleLife(idx, 1); } }
                      className="bg-gray-700/70 hover:bg-gray-700/90 text-gray-800 px-5 py-2 rounded text-3xl font-bold"
                    >
                      +
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleLife(idx, -1); } }
                      className="bg-gray-700/70 hover:bg-gray-700/90 text-gray-800 px-5 py-2 rounded text-3xl font-bold"
                    >
                      −
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {step === 1 && numPlayers === 5 && (
          <div className="w-screen h-screen min-h-screen flex flex-col bg-black overflow-hidden">
            {/* Linha 1: J1 e J2 */}
            <div className="flex flex-row flex-1">
              {[0, 1].map((idx) => {
                const color = PLAYER_COLORS[playerColors[idx]];
                const isHex = color.startsWith('#');
                return (
                  <div
                    key={idx}
                    className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-4 border-white/30 ${!isHex ? color : ''}`}
                    style={{ minWidth: 0, minHeight: 0, ...(isHex ? { backgroundColor: color } : {}) }}
                    onClick={() => handleColorCycle(idx)}
                  >
                    <span className="text-lg text-gray-800 font-bold mb-2 select-none">
                      Player {idx + 1}
                    </span>
                    <div className="text-5xl text-gray-800 font-extrabold mb-2 select-none">
                      {lifes[idx]}
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={e => { e.stopPropagation(); handleLife(idx, 1); } }
                        className="bg-gray-700/70 hover:bg-gray-700/90 text-gray-800 px-3 py-1 rounded text-2xl font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleLife(idx, -1); } }
                        className="bg-gray-700/70 hover:bg-gray-700/90 text-gray-800 px-3 py-1 rounded text-2xl font-bold"
                      >
                        −
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Linha 2: J3 e J4 */}
            <div className="flex flex-row flex-1">
              {[2, 3].map((idx) => {
                const color = PLAYER_COLORS[playerColors[idx]];
                const isHex = color.startsWith('#');
                return (
                  <div
                    key={idx}
                    className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-4 border-white/30 ${!isHex ? color : ''}`}
                    style={{ minWidth: 0, minHeight: 0, ...(isHex ? { backgroundColor: color } : {}) }}
                    onClick={() => handleColorCycle(idx)}
                  >
                    <span className="text-lg text-gray-800 font-bold mb-2 select-none">
                      Player {idx + 1}
                    </span>
                    <div className="text-5xl text-gray-800 font-extrabold mb-2 select-none">
                      {lifes[idx]}
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={e => { e.stopPropagation(); handleLife(idx, 1); } }
                        className="bg-gray-700/70 hover:bg-gray-700/90 text-gray-800 px-3 py-1 rounded text-2xl font-bold"
                      >
                        +
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleLife(idx, -1); } }
                        className="bg-gray-700/70 hover:bg-gray-700/90 text-gray-800 px-3 py-1 rounded text-2xl font-bold"
                      >
                        −
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Linha 3: J5 ocupa toda a largura */}
            <div className="flex flex-row flex-1">
              <div
                className={`flex-1 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border-4 border-white/30 ${PLAYER_COLORS[playerColors[4]]}`}
                style={{ minWidth: 0, minHeight: 0, backgroundColor: PLAYER_COLORS[playerColors[4]] }}
                onClick={() => handleColorCycle(4)}
              >
                <span className="text-lg text-gray-800 font-bold mb-2 select-none">
                  Player 5
                </span>
                <div className="text-5xl text-gray-800 font-extrabold mb-2 select-none">
                  {lifes[4]}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={e => { e.stopPropagation(); handleLife(4, 1); } }
                    className="bg-gray-700/70 hover:bg-gray-700/90 text-gray-800 px-3 py-1 rounded text-2xl font-bold"
                  >
                    +
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); handleLife(4, -1); } }
                    className="bg-gray-700/70 hover:bg-gray-700/90 text-gray-800 px-3 py-1 rounded text-2xl font-bold"
                  >
                    −
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div></>
  );
}

// Novo componente SVG para pentágono fullscreen
function PentagonLifeCounterSVG({
  lifes,
  playerColors,
  handleColorCycle,
  handleLife,
}) {
  const [size, setSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  React.useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const { width, height } = size;
  // Centro da tela
  const cx = width / 2;
  const cy = height / 2;
  // Raio X e Y para ocupar toda a tela
  const rx = width / 2;
  const ry = height / 2;
  // Calcula os 5 vértices igualmente espaçados ao redor da elipse
  const points = Array.from({ length: 5 }).map((_, i) => {
    const angle = (2 * Math.PI * i) / 5 - Math.PI / 2;
    return [cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)];
  });
  // Função para gerar path de cada setor
  function sectorPath(idx) {
    const p0 = [cx, cy];
    const p1 = points[idx];
    const p2 = points[(idx + 1) % 5];
    return `M${p0[0]},${p0[1]} L${p1[0]},${p1[1]} L${p2[0]},${p2[1]} Z`;
  }
  // Posição do conteúdo: média dos pontos do setor
  function contentPos(idx) {
    const p1 = points[idx];
    const p2 = points[(idx + 1) % 5];
    return [(cx + p1[0] + p2[0]) / 3, (cy + p1[1] + p2[1]) / 3];
  }
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
      }}
    >
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
        }}
      >
        {Array.from({ length: 5 }).map((_, idx) => {
          const color = PLAYER_COLORS[playerColors[idx]];
          const isHex = color.startsWith('#');
          return (
            <path
              key={idx}
              d={sectorPath(idx)}
              fill={getTailwindColor(playerColors[idx])}
              style={{ cursor: "pointer" }}
              onClick={() => handleColorCycle(idx)}
              pointerEvents="auto"
            />
          );
        })}
      </svg>
      {Array.from({ length: 5 }).map((_, idx) => {
        const [x, y] = contentPos(idx);
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
              zIndex: 2,
              pointerEvents: "auto",
            }}
          >
            <div className="flex flex-col items-center justify-center w-40 h-40">
              <span className="text-lg font-bold mb-2 select-none">
                Player {idx + 1}
              </span>
              <div className="text-5xl font-extrabold mb-2 select-none">
                {lifes[idx]}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={e => { e.stopPropagation(); handleLife(idx, 1); }}
                  className="bg-white/20 hover:bg-white/40 text-white px-3 py-1 rounded text-2xl font-bold"
                >
                  +
                </button>
                <button
                  onClick={e => { e.stopPropagation(); handleLife(idx, -1); }}
                  className="bg-white/20 hover:bg-white/40 text-white px-3 py-1 rounded text-2xl font-bold"
                >
                  −
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Função utilitária para converter índice de cor Tailwind para cor hex/SVG
function getTailwindColor(idx) {
  // Cores aproximadas do Tailwind para SVG
  const colors = [
    "#faf8f7", // white
    "#bfddf3", // babyblue
    "#d0f0c0", // green forest
    "#fa7f72", // red salmon
    "#a9a9a9", // black gray
  ];
  return colors[idx % colors.length];
}

// Componente de botão com hover customizado
function HoverButton({ onClick, defaultColor, hoverColor, textColor, hoverTextColor, borderColor, style, hoverScale, children }) {
  const [bg, setBg] = useState(defaultColor);
  const [color, setColor] = useState(textColor);
  const [scale, setScale] = useState(1);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => {
        setBg(hoverColor);
        if (hoverTextColor) setColor(hoverTextColor);
        if (hoverScale) setScale(hoverScale);
      }}
      onMouseLeave={() => {
        setBg(defaultColor);
        setColor(textColor);
        setScale(1);
      }}
      style={{
        width: '100%',
        background: bg,
        color: color,
        fontWeight: '600',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        border: `1px solid ${borderColor}`,
        fontSize: '1rem',
        transition: 'background 0.2s, color 0.2s, transform 0.2s',
        transform: `scale(${scale})`,
        ...style
      }}
    >
      {children}
    </button>
  );
}
