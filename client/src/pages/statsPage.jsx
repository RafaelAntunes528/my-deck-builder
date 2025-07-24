//tenho que criar uma pagina que mostre 3 graficos: 
//cor mais usada
//carta mais usada
//top 5 cartas mais usadas

//ao clicar em botoes muda o gráfico

//os gráficos serão feitos com informação da conta do usuário
import React, { useState, useEffect } from 'react';
import NavBarAndSearch from "../components/NavBarAndSearch";
import { useParams } from "react-router-dom";
import API_BASE from '../api';
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
import Footer from '../components/Footer';


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
                const response = await fetch(`${API_BASE}/api/user-stats?user=${username}`);
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

    // Tooltip customizado
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/90 border border-red-700 rounded-lg px-4 py-2 text-white shadow-lg text-sm font-semibold">
                    <span className="block text-red-300 font-bold mb-1">{label}</span>
                    <span className="block">{payload[0].value} cards</span>
                </div>
            );
        }
        return null;
    };

    // Lista de botões e componentes associados

    const conteudo = [
        ['Cards by Color', (
            colorData.length === 0 ? (
                <p className="text-sm text-gray-400 italic">There is no data available yet.</p>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={colorOrder.map(name => colorData.find(c => c.name === name) || { name, value: 0 })}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" tick={{ fill: '#fff', fontFamily: 'MorisRoman, Cinzel, serif', fontWeight: 600, fontSize: 16, wordBreak: 'break-all', whiteSpace: 'normal' }} axisLine={false} tickLine={false} interval={0} />
                            <YAxis tick={{ fill: '#fff', fontFamily: 'MorisRoman, Cinzel, serif', fontWeight: 600 }} axisLine={false} tickLine={false} width={30} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(244,63,94,0.08)' }} />
                            <Bar dataKey="value" radius={[12, 12, 0, 0]} isAnimationActive={true}>
                                {colorOrder.map((name, index) => (
                                    <Cell key={name}
                                        fill={colorMap[name] || '#888888'}
                                        className="transition-all duration-200 hover:brightness-125 hover:drop-shadow-lg cursor-pointer"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </>
            ))],
        ['Cards by Type', (
            typeData.length === 0 ? (
                <p className="text-sm text-gray-400 italic">There is no data available yet.</p>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={typeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" tick={{ fill: '#fff', fontFamily: 'MorisRoman, Cinzel, serif', fontWeight: 600, fontSize: 14, wordBreak: 'break-all', whiteSpace: 'normal' }} axisLine={false} tickLine={false} interval={0} />
                            <YAxis tick={{ fill: '#fff', fontFamily: 'MorisRoman, Cinzel, serif', fontWeight: 600 }} axisLine={false} tickLine={false} width={30} tickFormatter={v => Number.isInteger(v) ? v : ''} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(244,63,94,0.08)' }} />
                            <Bar dataKey="value" radius={[12, 12, 0, 0]} isAnimationActive={true}>
                                {typeData.map((entry, index) => (
                                    <Cell key={entry.name}
                                        fill={typePalette[index % typePalette.length]}
                                        className="transition-all duration-200 hover:brightness-125 hover:drop-shadow-lg cursor-pointer"
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
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
            <NavBarAndSearch />
            <div id="stats-root" className="p-2 text-center mt-12 min-h-screen text-white flex flex-col items-center justify-center max-w-4xl mx-auto pt-24">
                <p className="text-gray-300 mb-4 text-3xl font-bold">Your Magic Stats</p>
                <div className="w-full bg-gradient-to-br from-gray-950/60 to-red-950/60 text-white p-6 mt-5 rounded-full shadow-2xl">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="w-full border-2 border-red-800 p-2 rounded shadow bg-gradient-to-br from-gray-950/70 to-red-950/70 flex items-center justify-between">
                            <h2 className="font-bold text-left flex items-center gap-2">Statistics</h2>
                        </div>
                        <div className="w-full max-h-60 border-2 border-red-800 p-4 rounded shadow flex flex-col gap-1">
                            <ul className="flex flex-col sm:flex-row justify-center items-center gap-4 list-none p-0 m-0">
                                {conteudo.map(([key], index) => (
                                    <li key={index} className="w-full sm:w-auto">
                                        <button
                                            className={`w-full text-left font-semibold px-4 py-2 rounded-lg transition duration-200 shadow border border-white/20 mb-1 ${activeIndex === index ? "bg-red-700 text-white scale-105" : "bg-white/5 text-gray-300 hover:bg-white/15 hover:text-gray-300 hover:scale-105 hover:shadow-lg"}`}
                                            onClick={() => setActiveIndex(index)}
                                            style={{ transition: 'all 0.18s cubic-bezier(.4,2,.6,1)' }}
                                        >
                                            {key}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-full border-2 border-red-800 p-2 rounded shadow bg-gradient-to-br from-gray-950/70 to-red-950/70 flex items-center justify-between">
                            <h2 className="font-bold text-left">Display</h2>
                        </div>
                        <div className="w-full max-h-64 border-2 border-red-800 p-4 rounded shadow relative bg-black/60 transition-all duration-300">
                            {activeIndex !== null ? conteudo[activeIndex][1] : (
                                <p className="text-left text-sm text-gray-500 italic">Select an option above to view.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer leve />
        </>
    );
}


export default StatsPage;