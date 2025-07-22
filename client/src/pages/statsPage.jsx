//tenho que criar uma pagina que mostre 3 graficos: 
//cor mais usada
//carta mais usada
//top 5 cartas mais usadas

//ao clicar em botoes muda o gráfico

//os gráficos serão feitos com informação da conta do usuário
import React, { useState, useEffect } from 'react';
import NavBarAndSearch from "../components/NavBarAndSearch";
import { useParams } from "react-router-dom";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Cell,
} from 'recharts';


function StatsPage() {
    const { username: paramUsername } = useParams();
    const username = paramUsername || localStorage.getItem('username');
    const [activeIndex, setActiveIndex] = useState(null);
    const [colorData, setColorData] = useState([]);
    const [typeData, setTypeData] = useState([]);
    const [topCards, setTopCards] = useState([]);

    console.log("Username usado para buscar stats:", username);

    useEffect(() => {
        if (!username) return;
        async function fetchUserStats() {
            try {
                const response = await fetch(`http://localhost:3030/api/user-stats?user=${username}`);
                const data = await response.json();
                console.log("Dados recebidos:", data);
                // Corrige se algum campo vier como undefined
                setColorData(Array.isArray(data.colorData) ? data.colorData : []);
                setTypeData(Array.isArray(data.typeData) ? data.typeData : []);
                setTopCards(Array.isArray(data.topCards) ? data.topCards : []);
            } catch (error) {
                console.error("Erro ao buscar estatísticas do utilizador:", error);
            }
        }
        fetchUserStats();
    }, [username]);


    // Cores oficiais de Magic: Branco, Azul, Preto, Vermelho, Verde, Incolor
    const colorMap = {
        'White': '#FFF9C4', // Branco
        'Blue': '#2196F3', // Azul
        'Black': '#212121', // Preto
        'Red': '#F44336', // Vermelho
        'Green': '#4CAF50', // Verde
        'Colorless': '#BDBDBD', // Incolor
        'Multicolor': '#FFD700', // Dourado
        // Adicione outros nomes se necessário
    };
    // Ordem para exibir as cores
    const colorOrder = ['White', 'Blue', 'Black', 'Red', 'Green', 'Colorless', 'Multicolor'];

    // Paleta para tipos de carta
    const typePalette = [
        '#FFD700', // Amarelo
        '#90CAF9', // Azul claro
        '#A1887F', // Marrom
        '#E57373', // Vermelho claro
        '#81C784', // Verde claro
        '#CE93D8', // Roxo
        '#FFB300', // Laranja
        '#B0BEC5', // Cinza
        '#F06292', // Rosa
        '#64B5F6', // Azul médio
    ];

    // Lista de botões e componentes associados

    const conteudo = [
        ['Cards by Color', (
            colorData.length === 0 ? (
                <p className="text-sm text-gray-400 italic">There is no data available yet.</p>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={colorOrder.map(name => colorData.find(c => c.name === name) || { name, value: 0 })}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value">
                                {colorOrder.map((name, index) => (
                                    <Cell key={name} fill={colorMap[name] || '#888888'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    {/* Legenda das cores */}
                    <div className="flex flex-wrap justify-center gap-3 mt-2">
                        {colorOrder.map(name => (
                            <span key={name} className="flex items-center gap-1 text-sm">
                                <span style={{ background: colorMap[name] || '#888', width: 16, height: 16, display: 'inline-block', borderRadius: 4, border: '1px solid #222' }}></span>
                                {name}
                            </span>
                        ))}
                    </div>
                </>
            ))],
        ['Cards by Type', (
            typeData.length === 0 ? (
                <p className="text-sm text-gray-400 italic">There is no data available yet.</p>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={typeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value">
                                {typeData.map((entry, index) => (
                                    <Cell key={entry.name} fill={typePalette[index % typePalette.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    {/* Legenda dos tipos */}
                    <div className="flex flex-wrap justify-left text-xs gap-2 mt-2">
                        {typeData.map((entry, index) => (
                            <span key={entry.name} className="flex items-center gap-1 text-sm">
                                <span style={{ background: typePalette[index % typePalette.length], width: 16, height: 16, display: 'inline-block', borderRadius: 4, border: '1px solid #222' }}></span>
                                {entry.name}
                            </span>
                        ))}
                    </div>
                </>
            ))],
        ['Top 5 Cards', (
            topCards.length === 0 ? (
                <p className="text-sm text-gray-400 italic">There is no data available yet.</p>
            ) : (
                <ul className="text-left text-white text-lg">
                    {topCards.map((card, index) => (
                        <li key={index} className="mb-1">{card.name} — {card.count}x</li>
                    ))}
                </ul>
            ))],
    ];

    if (!username) {
        return (
            <div className="p-8 text-center mt-12 min-h-screen text-white flex flex-col justify-center items-center">
                <h1 className="font-bold text-3xl mb-6 text-white">Statistics</h1>
                <p className="text-red-400">User not found. Login again.</p>
            </div>
        );
    }


    return (
        <>
            <header>
                <NavBarAndSearch />
            </header>

            {/* Contêiner centralizado */}
            <main className="min-h-screen flex flex-col justify-center items-center bg-black/50 px-4">
                <div className="p-8 text-center text-white flex flex-col max-w-2xl w-full">
                    <h1 className="font-bold text-3xl mb-6 text-white">Statistics</h1>
                    <p className="text-gray-300 mb-4">View statistics for your decks: colors, types, and most used cards.</p>

                    <div className="max-h-fit bg-gradient-to-br from-gray-950/60 to-red-950/60 text-white p-5 mt-5 border-[10px] border-black rounded-lg">
                        <div className="grid grid-cols-1 gap-4">

                            {/* Título da secção do gráfico */}
                            <div className="w-full border-2 border-red-800 p-2 rounded shadow bg-gradient-to-br from-gray-950/70 to-red-950/70">
                                <h2 className="font-bold text-left">Graphic Display</h2>
                            </div>

                            {/* Gráfico renderizado */}
                            <div className="w-full border-2 border-red-800 p-4 rounded shadow bg-gray-950/25 text-center">
                                {activeIndex !== null ? conteudo[activeIndex][1] : (
                                    <p className="text-left text-sm text-gray-500 italic">Select an option below to view.</p>
                                )}
                            </div>

                            {/* Título da secção dos botões */}
                            <div className="w-full border-2 border-red-800 p-2 rounded shadow bg-gradient-to-br from-gray-950/70 to-red-950/70">
                                <h2 className="font-bold text-left">Charts</h2>
                            </div>

                            {/* Botões de seleção */}
                            <div className="w-full border-2 border-red-800 p-4 rounded shadow bg-gray-950/25">
                                <ul className="text-left pl-0 list-none">
                                    {conteudo.map(([key], index) => (
                                        <li key={index} className="mb-2">
                                            <button
                                                className={`w-full text-left font-semibold px-4 py-2 rounded transition duration-200 ${activeIndex === index
                                                    ? "bg-red-700 text-white"
                                                    : "bg-red-950 text-gray-400 hover:bg-gray-300 hover:text-black"
                                                    }`}
                                                onClick={() => setActiveIndex(index)}
                                            >
                                                {key}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-4 text-gray-500 text-sm text-center">
                © {new Date().getFullYear()} Magic Deck Builder created by Group 5 - Bytes4Future
            </footer>
        </>
    );
}


export default StatsPage;