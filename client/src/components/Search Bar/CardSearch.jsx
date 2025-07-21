import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function CardSearch() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Insert a name of a Card.");
      return;
    }

    setError("");
    navigate(`/search/${encodeURIComponent(name.trim())}`);
  };

  return (
    <div className="card-search w-full max-w-lg p-6">
      <form
        onSubmit={handleSearch}
        className="relative mb-4 flex flex-col gap-4 w-full items-stretch"
        role="search"
      >
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-2 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent fonte-morisroman">
            Find your card
          </h1>

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
