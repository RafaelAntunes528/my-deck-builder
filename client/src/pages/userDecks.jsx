import React, { useEffect, useState } from "react";
import NavBarAndSearch from "../components/NavBarAndSearch";
import ListButton from '../components/list_btn.jsx';
import axios from "axios";
import API_BASE from '../api';
import Footer from "../components/Footer";

function UserDecks() {
    // Usar o username do localStorage, que é o mesmo usado na criação do deck
    const username = localStorage.getItem('username');
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/decks?user=${username}`);
                setDecks(res.data);
            } catch (err) {
                console.error("Erro ao carregar decks", err);
            } finally {
                setLoading(false);
            }
        };
        if (username) fetchDecks();
    }, [username]);

    return (
        <>
            <NavBarAndSearch />
            <div className="p-8 text-center min-h-screen text-white pt-24">
                <h1 className="font-bold text-3xl mb-6 text-white">Your owned Decks</h1>
                {loading ? (
                  <p className="text-white/70">Loading...</p>
                ) : decks.length === 0 ? (
                  <p className="text-white/70">No decks found for this user.</p>
                ) : (
                  <div className="m-10 flex flex-col justify-center">
                    {decks.map((deck, index) => (
                        <ListButton
                            key={deck._id || index}
                            text={deck.name}
                            link={`/decks/${deck._id}`}
                        />
                        
                    ))}
                  </div>
                )}
            </div>
            <Footer leve />
        </>
    );
}
export default UserDecks;