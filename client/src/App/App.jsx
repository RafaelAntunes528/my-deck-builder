import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import LoginPage from "../pages/Login";
import SignUpPage from "../pages/Signup";
import SearchPage from "../pages/Search";
import Tutorials from "../pages/Tutorials";
import Profile from "../pages/Profile";
import MagicFireBackground from "../components/MagicFireBG/MagicFireBg";
import CreateDeck from "../pages/CreateDeck";
import CardDetails from "../components/CardDetails";
import StatsPage from "../pages/statsPage";
import UserCards from "../pages/userCards";
import LifeCounter from "../components/LifeCounter";
import CardSearch from "../components/Search Bar/CardSearch";
import NavBarHome from "../components/NavBarHome";


function App() {
  return (
  
    <Router>
      <div
        className="relative w-full min-h-screen bg-transparent bg-cover bg-center"
      >
        {/* Fagulhas entre o fundo e o conteúdo */}
        <MagicFireBackground />
        <div className="relative z-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/search/:name" element={<SearchPage />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/create-deck" element={<CreateDeck />} />
            <Route path="/card/:cardId" element={<CardDetails />} />

            <Route path="statsPage/:username" element={<StatsPage />} />
            
            <Route path="/userCards/:username" element={<UserCards />} />
            <Route path="/lifecounter" element={<LifeCounter />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
