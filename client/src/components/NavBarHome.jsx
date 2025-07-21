import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mtg_logo_monocolor from "../../public/images/mtg_logo_monocolor.svg";
import { FaUserCircle, FaSignOutAlt, FaChartBar, FaLayerGroup, FaQuestionCircle, FaBars, FaRegClone } from "react-icons/fa";
import profilePhoto from "../../public/images/profile_photo.jpg";

export default function NavBarHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const hasValidUser = isLoggedIn && username && username !== "null" && username !== "undefined";
  const [avatar, setAvatar] = useState(() => localStorage.getItem('profilePhoto') || profilePhoto);

  useEffect(() => {
    function updateAvatar() {
      setAvatar(localStorage.getItem('profilePhoto') || profilePhoto);
    }
    window.addEventListener('storage', updateAvatar);
    window.addEventListener('profilePhotoChanged', updateAvatar);
    return () => {
      window.removeEventListener('storage', updateAvatar);
      window.removeEventListener('profilePhotoChanged', updateAvatar);
    };
  }, []);

  const menuItems = [
    { label: "Cards", icon: <FaRegClone />, path: `/userCards/${username}`},
    { label: "Decks", icon: <FaLayerGroup />, path: `/profile/${username}#my-decks` },
    { label: "Help", icon: <FaQuestionCircle />, path: "#" },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsMenuOpen(false);
    setUserDropdown(false);
    navigate('/login');
  };

  const MtgLogo = () => (
    <div className="flex items-center gap-2 m-2 cursor-pointer select-none" onClick={() => navigate("/")}>
      <img
        src={mtg_logo_monocolor}
        alt="MtG Deck Builder Logo"
        className="h-12 w-auto drop-shadow-[0_0px_4px_rgba(255,0,0,0.60)]"
      />
      <span className="text-xl font-extrabold tracking-tight font-magic bg-gradient-to-r from-red-500 to-yellow-300 bg-clip-text text-transparent drop-shadow" style={{ letterSpacing: '0.04em', textShadow: '0 1px 4px #000' }}>My Deck Builder</span>
    </div>
  );

  return (
    <nav
      className="navbar-cinzel fixed top-0 left-0 w-full z-50 bg-black/80 border-b-2 border-gray-700 shadow-lg shadow-red-900/30 backdrop-blur-md"
    >
      <div className="w-full flex items-center h-14">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-4 flex-1 min-w-0 justify-start pl-0 ml-0">
          <button
            className="md:hidden text-3xl text-red-400 hover:text-red-500 transition-all duration-200 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Open menu"
          >
            <FaBars />
          </button>
          <div className="hidden md:flex">
            <MtgLogo />
          </div>
          <span className="md:hidden text-lg leading-none font-extrabold font-magic bg-clip-text text-transparent animate-gradient-bg bg-gradient-to-r from-red-500 via-yellow-400 to-orange-500" style={{ letterSpacing: '0.04em', textShadow: '0 1px 4px #000' }} >Magic Deck Builder</span>
        </div>

        {/* Center: Menu (desktop) */}
        <div className="hidden md:flex gap-2 items-center flex-1 justify-center">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-2 bg-transparent text-red-200 font-semibold px-4 py-2 rounded-lg hover:bg-white hover:text-black hover:scale-105 focus:bg-white focus:text-black focus:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Right: Auth/User */}
        <div className="flex items-center gap-2 relative flex-1 justify-end m-2">
          {!isLoggedIn && (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-red-700 text-white text-center font-semibold px-3.5 py-1 rounded-lg hover:bg-black hover:text-white hover:scale-105 focus:bg-black focus:text-white focus:scale-105 transition duration-200 shadow border border-red-800"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-white text-red-700 text-center font-semibold px-3 py-1 rounded-lg hover:bg-red-700 hover:text-white hover:scale-105 focus:bg-red-700 focus:text-white focus:scale-105 transition duration-200 shadow border border-red-800"
              >
                Sign Up
              </button>
            </>
          )}
          {isLoggedIn && (
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 hover:bg-white hover:text-black text-red-200 font-semibold shadow transition-all duration-200 focus:outline-none border border-red-900 focus:bg-white focus:text-black"
                onClick={() => setUserDropdown((v) => !v)}
              >
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-orange-500 p-[2px] flex items-center justify-center">
                  <img src={avatar} alt="profile" className="rounded-full w-full h-full object-cover" />
                </span>
                <span className="hidden sm:inline">{username}</span>
              </button>
              {/* Dropdown */}
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-black/95 border border-red-800 rounded-xl shadow-lg z-50 animate-fade-in">
                  <button
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-200 hover:bg-white hover:text-black transition-colors duration-200 font-semibold rounded-t-xl"
                    onClick={() => navigate(`/profile/${username}`)}
                  >
                    <FaUserCircle /> Profile
                  </button>

                  <button
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-200 hover:bg-white hover:text-black transition-colors duration-200 font-semibold"
                    onClick={() => navigate(`/userCards/${username}`)}
                  >
                    <FaRegClone /> Cards
                  </button>

                  <button
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-200 hover:bg-white hover:text-black transition-colors duration-200 font-semibold"
                    onClick={() => navigate(`/profile/${username}#my-decks`)}
                  >
                    <FaLayerGroup /> Decks
                  </button>

                  <button
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-200 hover:bg-white hover:text-black transition-colors duration-200 font-semibold"
                    onClick={() => navigate("#")}
                  >
                    <FaQuestionCircle /> Settings
                  </button>
                  
                  <button
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-white hover:text-black transition-colors duration-200 font-semibold rounded-b-xl"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Menu (mobile) */}
      <div
        className={`fixed top-0 left-0 h-fit w-64 z-[60] bg-black/95 text-red-200  shadow-2xl border-r-2 border-red-800 rounded-r-2xl transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-2 mb-8">
          <MtgLogo />
        </div>
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => { setIsMenuOpen(false); navigate(item.path); }}
            className="flex items-center gap-3 w-full text-lg font-semibold px-4 py-3 rounded-lg hover:bg-white hover:text-black transition-colors duration-200 mb-2"
          >
            {item.icon} {item.label}
          </button>
        ))}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-lg font-semibold px-4 py-3 rounded-lg hover:bg-white hover:text-black transition-colors duration-200 mt-8 text-red-400"
          >
            <FaSignOutAlt /> Logout
          </button>
        )}
      </div>
      {/* Overlay for sidebar */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
}
