import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function CardSearch() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [type, setType] = useState("");
  const [color, setColor] = useState("");
  const [rarity, setRarity] = useState("");
  const [cmc, setCmc] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Insert a name of a Card.");
      return;
    }

    setError("");
    // Monta query string com filtros
    let query = name.trim();
    if (type) query += ` type:${type}`;
    if (color) query += ` color:${color}`;
    if (rarity) query += ` rarity:${rarity}`;
    if (cmc) query += ` cmc=${cmc}`;
    navigate(`/search/${encodeURIComponent(query)}`);
  };

  return (
    <div className="card-search w-full max-w-lg p-6">
      <form
        onSubmit={handleSearch}
        className="relative mb-4 flex flex-col gap-4 w-full items-stretch"
        role="search"
      >
        {/* Filtros avançados */}
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          <select value={type} onChange={e => setType(e.target.value)}
            className="rounded-full px-4 py-2 bg-black text-white border-2 border-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all font-bold duration-200 hover:border-red-500"
          >
            <option value="">Type</option>
            <option value="creature">Creature</option>
            <option value="land">Land</option>
            <option value="instant">Instant</option>
            <option value="sorcery">Sorcery</option>
            <option value="artifact">Artifact</option>
            <option value="enchantment">Enchantment</option>
            <option value="planeswalker">Planeswalker</option>
          </select>
          <select value={color} onChange={e => setColor(e.target.value)}
            className="rounded-full px-4 py-2 bg-black text-white border-2 border-blue-400 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold transition-all duration-200 hover:border-blue-500"
          >
            <option value="">Color</option>
            <option value="w">White</option>
            <option value="u">Blue</option>
            <option value="b">Black</option>
            <option value="r">Red</option>
            <option value="g">Green</option>
            <option value="m">Multicolor</option>
            <option value="c">Colorless</option>
          </select>
          <select value={rarity} onChange={e => setRarity(e.target.value)}
            className="rounded-full px-4 py-2 bg-black text-white border-2 border-yellow-400 shadow focus:outline-none focus:ring-2 focus:ring-yellow-400 font-bold transition-all duration-200 hover:border-yellow-500"
          >
            <option value="">Rarity</option>
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="mythic">Mythic</option>
          </select>
        </div>
        <div className="relative w-full group">
          <div className={`absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-2xl blur-xl transition-all duration-300 ${isFocused ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}></div>
          <div className="relative">
            <input
              className={`w-full rounded-2xl border-2 bg-black/40 backdrop-blur-md px-6 py-4 pr-12 text-white placeholder-gray-400 transition-all duration-300 ${
                isFocused 
                  ? 'border-red-500/50 shadow-lg shadow-red-500/25 focus:ring-4 focus:ring-red-500/20' 
                  : 'border-gray-600/50 hover:border-gray-500/50'
              }`}
              placeholder="Insert Card Name..."
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              aria-label="Search Card Name"
              autoFocus
            />
            <button
              type="submit"
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-300 ${
                isFocused 
                  ? 'text-red-400 hover:text-red-300 hover:scale-110 hover:bg-red-500/10' 
                  : 'text-gray-400 hover:text-red-400'
              }`}
              aria-label="Search"
            >
              <FaSearch size={18} />
            </button>
          </div>
        </div>
        {error && (
          <div className="flex items-center justify-center">
            <p className="text-red-400 font-medium text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
              {error}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

export default CardSearch;
