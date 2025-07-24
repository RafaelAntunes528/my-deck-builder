import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import mdb_logo from "../../public/images/mdb_logo_white.svg";
import { FaUserCircle, FaSignOutAlt, FaChartBar, FaLayerGroup, FaQuestionCircle, FaRegClone, FaTimes } from "react-icons/fa";
import { HiMenuAlt3 } from "react-icons/hi";
import profilePhoto from "../../public/images/profile_photo.jpg";
import { ToastContext } from "../App/App";

export default function NavBarHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const hasValidUser = isLoggedIn && username && username !== "null" && username !== "undefined";
  const [avatar, setAvatar] = useState(() => localStorage.getItem('profilePhoto') || profilePhoto);
  const showToast = useContext(ToastContext);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 40) {
        setShowNavbar(true);
        setLastScrollY(window.scrollY);
        return;
      }
      if (window.scrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const menuItems = [
    ...(isLoggedIn ? [
      { label: "Cards", icon: <FaRegClone />, path: `/userCards/${username}`},
      { label: "Decks", icon: <FaLayerGroup />, path: `/profile/${username}#my-decks` },
    ] : []),
    { label: "About", icon: <FaQuestionCircle />, path: "/about" },
  ];

  // Função para navegação protegida
  function handleProtectedNav(path) {
    if (!isLoggedIn) {
      if (showToast) showToast('You need to be logged in in order to save your cards/decks', 'error');
      navigate('/login');
    } else {
      navigate(path);
    }
  }

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
        src={mdb_logo}
        alt="My Deck Builder Logo"
        className="h-12 w-auto"
      />
      <span className="text-xl font-extrabold tracking-tight fonte-morisroman bg-clip-text text-red-600 drop-shadow" style={{ letterSpacing: '0.04em', textShadow: '0 1px 4px #000' }}>My Deck Builder</span>
    </div>
  );

  return (
    <nav
      className={`sticky top-0 left-0 w-full z-50 bg-black/80 border-b-2 border-gray-700 shadow-lg shadow-red-900/30 backdrop-blur-md transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="w-full flex items-center h-14">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-4 flex-1 min-w-0 justify-start pl-0 ml-0">
          <button
            className="md:hidden text-4xl text-red-400 hover:text-red-500 transition-all duration-200 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Open menu"
          >
            <HiMenuAlt3 />
          </button>
          <div className="hidden md:flex">
            <MtgLogo />
          </div>
          <div className="flex md:hidden flex-1 justify-center items-center absolute left-0 right-0 pointer-events-none">
            <img src={mdb_logo} alt="Logo" className="h-12 w-auto drop-shadow-lg" />
          </div>
        </div>

        {/* Center: Menu (desktop) */}
        <div className="hidden md:flex gap-2 items-center flex-1 justify-center">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === "Cards" || item.label === "Decks") {
                  handleProtectedNav(item.path);
                } else {
                  navigate(item.path);
                }
              }}
              className="flex items-center gap-2 bg-transparent text-red-200 font-semibold px-4 py-2 rounded-lg hover:bg-white hover:text-black hover:scale-105 focus:bg-white focus:text-black focus:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 fonte-morisroman"
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* Right: Auth/User */}
        <div className="hidden md:flex items-center gap-2 relative flex-1 justify-end m-2">
          {!isLoggedIn && (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-red-700 text-white text-center font-semibold px-3.5 py-1 rounded-lg hover:bg-black hover:text-white hover:scale-105 focus:bg-black focus:text-white focus:scale-105 transition duration-200 shadow border border-red-800 fonte-morisroman"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-white text-red-700 text-center font-semibold px-3 py-1 rounded-lg hover:bg-red-700 hover:text-white hover:scale-105 focus:bg-red-700 focus:text-white focus:scale-105 transition duration-200 shadow border border-red-800 fonte-morisroman"
              >
                Sign Up
              </button>
            </>
          )}
          {isLoggedIn && (
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-black hover:bg-white hover:text-black text-red-200 font-semibold shadow transition-all duration-200 focus:outline-none border border-red-900 focus:bg-white focus:text-black"
                onClick={() => setUserDropdown((v) => !v)}
              >
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-orange-500 p-[2px] flex items-center justify-center">
                  <img src={avatar} alt="profile" className="rounded-full w-full h-full object-cover" />
                </span>
                <span className="hidden sm:inline">{username}</span>
              </button>
              {/* Dropdown */}
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-44 border border-red-800 rounded-xl shadow-lg z-50 animate-fade-in">
                  <button
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-200 hover:bg-white hover:text-black hover:shadow-lg hover:border hover:border-red-400 duration-200 font-semibold rounded-t-xl"
                    onClick={() => navigate(`/profile/${username}`)}
                  >
                    <FaUserCircle /> Profile
                  </button>

                  <button
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-200 hover:bg-white hover:text-black hover:shadow-lg hover:border hover:border-red-400 transition-colors duration-200 font-semibold"
                    onClick={() => navigate(`/userCards/${username}`)}
                  >
                    <FaRegClone /> Cards
                  </button>

                  <button
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-200 hover:bg-white hover:text-black hover:shadow-lg hover:border hover:border-red-400 transition-colors duration-200 font-semibold"
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
                    className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-white hover:text-red-700 hover:shadow-lg hover:border hover:border-red-400 transition-colors duration-200 font-semibold rounded-b-xl"
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
        className={`menu-lateral fixed top-0 left-0 h-screen w-72 max-w-full z-[60] text-red-200 shadow-xl border-r-2 border-red-800 rounded-r-2xl transition-transform duration-500 ease-[cubic-bezier(.4,2,.6,1)] flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          minWidth: 240,
          background: 'linear-gradient(135deg, rgba(30,30,40,0.98) 60%, rgba(244,63,94,0.12) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
          zIndex: 60,
          position: 'fixed',
        }}
      >
        <div className="flex flex-col items-center gap-2 mb-2 px-4 pt-4">
          <button
            className="self-end text-3xl text-red-400 hover:text-white hover:bg-red-700/20 rounded-full p-2 transition-all duration-200 focus:outline-none mb-2"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            style={{ marginRight: '-0.5rem', marginTop: '-0.5rem' }}
          >
            <FaTimes />
          </button>
          <div className="flex flex-col items-center">
            <img src={mdb_logo} alt="Logo" className="h-12 w-auto mx-auto drop-shadow-lg" />
          </div>
        </div>
        {isLoggedIn && (
          <div className="flex flex-col items-center gap-2 px-4">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setTimeout(() => {
                  navigate(`/profile/${username}`);
                }, 150);
              }}
              className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-orange-500 p-[3px] flex items-center justify-center shadow-lg animate-gradient-bg focus:outline-none"
              style={{ border: 'none', background: 'none', padding: 0 }}
            >
              <img src={avatar} alt="profile" className="rounded-full w-full h-full object-cover shadow-xl" />
            </button>
            <span className="text-lg font-bold text-white mt-1 break-all text-center">{username}</span>
          </div>
        )}
        <div className="flex flex-col gap-3 flex-1 px-2 w-full mt-2">
          {isLoggedIn ? (
            menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setIsMenuOpen(false);
                  setTimeout(() => {
                    if (item.label === "Cards" || item.label === "Decks") {
                      handleProtectedNav(item.path);
                    } else {
                      navigate(item.path);
                    }
                  }, 100);
                }}
                className="flex items-center gap-5 w-full text-lg font-semibold px-6 py-3 rounded-2xl hover:bg-red-700/20 hover:text-white transition-all duration-200 mb-1 focus:outline-none focus:ring-2 focus:ring-red-500 text-left shadow-sm bg-black/10"
              >
                <span className={`text-3xl ${item.label === 'Cards' ? 'text-blue-400' : item.label === 'Decks' ? 'text-yellow-400' : item.label === 'About' ? 'text-red-400' : 'text-red-300'}`}>{item.icon}</span> {item.label}
              </button>
            ))
          ) : (
            <>
              {location.pathname !== '/login' && (
                <button
                  onClick={() => { setIsMenuOpen(false); setTimeout(() => navigate('/login'), 100); }}
                  className="flex items-center gap-5 w-full text-lg font-semibold px-6 py-3 rounded-2xl hover:bg-red-700/20 hover:text-white transition-all duration-200 mb-1 focus:outline-none focus:ring-2 focus:ring-red-500 text-left shadow-sm bg-black/10"
                >
                  <span className="text-3xl text-red-400"><FaSignOutAlt /></span> Login
                </button>
              )}
              {location.pathname !== '/signup' && (
                <button
                  onClick={() => { setIsMenuOpen(false); setTimeout(() => navigate('/signup'), 100); }}
                  className="flex items-center gap-5 w-full text-lg font-semibold px-6 py-3 rounded-2xl hover:bg-yellow-400/20 hover:text-white transition-all duration-200 mb-1 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-left shadow-sm bg-black/10"
                >
                  <span className="text-3xl text-yellow-400"><FaUserCircle /></span> Sign Up
                </button>
              )}
              {location.pathname !== '/about' && menuItems.filter(item => item.label === 'About').map((item) => (
                <button
                  key={item.label}
                  onClick={() => { setIsMenuOpen(false); setTimeout(() => navigate(item.path), 100); }}
                  className="flex items-center gap-5 w-full text-lg font-semibold px-6 py-3 rounded-2xl hover:bg-red-700/20 hover:text-white transition-all duration-200 mb-1 focus:outline-none focus:ring-2 focus:ring-red-500 text-left shadow-sm bg-black/10"
                >
                  <span className="text-3xl text-red-400">{item.icon}</span> {item.label}
                </button>
              ))}
            </>
          )}
        </div>
        {isLoggedIn && (
          <button
            onClick={() => { setIsMenuOpen(false); setTimeout(handleLogout, 100); }}
            className="flex items-center gap-4 w-full text-lg font-bold px-6 py-3 rounded-2xl hover:bg-red-700/80 hover:text-white transition-all duration-200 mt-8 mb-4 text-red-300 border-t border-red-900 shadow-lg bg-black/20"
          >
            <FaSignOutAlt className="text-3xl" /> Logout
          </button>
        )}
      </div>
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[59] backdrop-blur-sm transition-all duration-300"
          style={{ background: 'rgba(0,0,0,0.7)', pointerEvents: 'auto' }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
}
