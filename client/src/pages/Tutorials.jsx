import '../index.css';
import { useState } from 'react';
import NavBarHome from "../components/NavBarHome";
import { FaChevronLeft, FaChevronRight, FaBookOpen } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import url from 'url';

function Tutorials() {
    const [activeIndex, setActiveIndex] = useState(0); // Começa no primeiro tópico
    const [expanded, setExpanded] = useState(true);
    const navigate = useNavigate();

    const conteudo = Array.from(new Map([
        ["What is Magic: The Gathering?",
            "Welcome to Magic: The Gathering! Magic is a collectible card game where players summon incredible creatures and cast powerful spells to defeat their opponents. The game has thousands of cards, so you'll always find a unique way to express your style on the battlefield."],
        ["Card Types",
            `There are several types of cards in Magic: The Gathering:\n- Creature\n- Sorcery\n- Instant\n- Enchantment\n- Artifact\n- Planeswalker\n- Land\nEach type has its own rules and effects.\n\nExample of mana symbols: <span class='inline-flex gap-1 align-middle'><img src='/images/mtg_icons/W.svg' alt='White' class='inline w-6 h-6'/><img src='/images/mtg_icons/U.svg' alt='Blue' class='inline w-6 h-6'/><img src='/images/mtg_icons/B.svg' alt='Black' class='inline w-6 h-6'/><img src='/images/mtg_icons/R.svg' alt='Red' class='inline w-6 h-6'/><img src='/images/mtg_icons/G.svg' alt='Green' class='inline w-6 h-6'/></span>`],
        ["The Stack & Priority",
            `The stack is where spells and abilities wait to resolve. Players can respond to spells on the stack before they resolve.\nPriority determines who can act next. Usually, after you do something, your opponent gets a chance to respond.\n\n<img src='/images/mtg_icons/U.svg' alt='Blue Mana' class='inline w-6 h-6'/> Instants and abilities can be played in response to other spells!`],
        ["Mulligan Rules",
            `If you don't like your starting hand, you can take a mulligan. Shuffle your hand back into your deck and draw a new hand with one less card.\n\nYou can mulligan multiple times, but always draw one less card each time.`],
        ["Deck Construction & Formats",
            `There are many ways to build a deck!\n- Standard: 60+ cards, only recent sets\n- Commander: 100 cards, no duplicates except basic lands\n- Modern, Legacy, Pauper, etc.\n\nEach format has its own rules and banned cards.`],
        ["Mana & Colors",
            `There are five colors of mana in Magic: White, Blue, Black, Red, and Green.\nEach color has its own strengths and weaknesses.\n\n<span class='inline-flex gap-1 align-middle'><img src='/images/mtg_icons/W.svg' alt='White' class='inline w-6 h-6'/><img src='/images/mtg_icons/U.svg' alt='Blue' class='inline w-6 h-6'/><img src='/images/mtg_icons/B.svg' alt='Black' class='inline w-6 h-6'/><img src='/images/mtg_icons/R.svg' alt='Red' class='inline w-6 h-6'/><img src='/images/mtg_icons/G.svg' alt='Green' class='inline w-6 h-6'/></span>`],
        ["Life Counter Example",
            `You can use a life counter to track your life points.\n\n<img src='/src/images/profile_photo.jpg' alt='Life Counter Example' class='rounded-full w-20 h-20 mx-auto my-2 border-4 border-yellow-400 shadow'/>`],
        ["How to start", "Each player shuffles their own deck and places it face down in front of them. Then, each draws a hand of seven cards from their library. If you don’t like your starting hand, you can choose to mulligan. Hand: Your hand represents the cards available to play. These must remain hidden — don’t show them to your opponent.\nLibrary: Your deck of cards is called your library.\nMulligan: To mulligan, shuffle your hand back into the library and draw seven new cards. Then, put one card of your choice on the bottom of the library for each time you mulligan during that game."],
        ["Tracking your life points", "Choose a method for tracking your life points and decide who goes first. The player who starts does not draw a card on the first turn. Don’t forget to keep track — to win, you must reduce your opponent’s life total to zero!\nTracking life points: Common methods include pen and paper or a twenty-sided die."],
        ["Casting Spells", "To use a card, you need to cast it."],
        ["Paying Mana", "To cast a spell, you must pay an amount of mana equal to the symbols in the upper-right corner of the card. Generic mana costs are represented by a number.\nMana: Mana is the magical energy used to cast spells. There are five colors of mana, each with unique characteristics and abilities.\nGeneric mana: A card with {4} requires four mana of any color, plus any specific costs shown."],
        ["Tap and Untap", "To generate mana, you must tap a land. Lands produce mana of the color shown on the card. Lands are not spells. You may play one land per turn for free.\nTap: Tapping means turning a card sideways on the battlefield."],
        ["Permanents", "After being cast, permanent spells — such as creatures, artifacts, and enchantments — remain on the battlefield.\nPermanent: A permanent is a card that remains in play after being cast.\nBattlefield: This is where your permanents stay. They can be targeted by other spells — for good or ill."],
        ["Graveyard", "Instant and sorcery spells go to the graveyard after taking effect.\nGraveyard: The graveyard is a face-up discard pile. Creatures go there when they die, and instants and sorceries go there after being used."],
        ["Taking a turn", "Each turn is divided into five phases:"],
        ["Beginning Phase", "Beginning Phase\nUntap your cards, resolve any upkeep effects, then draw a card. \nUntap: Return cards to an upright position. \nUpkeep: Some cards have effects that happen during upkeep.\nDraw: Take the top card of your library and add it to your hand. Don’t show it to your opponent."],
        ["First Main Phase", "First Main Phase\nYou may play a land and cast any spells in your hand."],
        ["Combat Phase", "Combat Phase\nTime to attack your opponent. \nttack: Your creatures attempt to deal damage to your opponent."],
        ["Second Main Phase", "Second Main Phase\nSame as the first. If you already played a land this turn, you can’t play another now."],
        ["End Step", "End Step\nRemove damage from creatures still in play, resolve any end-of-turn effects, and pass the turn."],
        ["Combat", "The combat phase has three steps, always in the same order."],
        ["Declare Attackers", "Declare Attackers\nChoose which creatures to attack with and tap them."],
        ["Declare Blockers", "Declare Blockers\nThe defending player may choose untapped creatures to block the attackers.\nBlock: A blocked creature deals damage to the blocking creature — and vice versa — instead of to the defending player."],
        ["Calculate Damage", "Assign Damage\nAttacking and blocking creatures deal damage to each other. Unblocked creatures deal damage to the opponent. If a creature takes damage equal to or greater than its toughness, it dies and goes to the graveyard.\nPower: The first number in the lower-right corner of the card indicates how much damage a creature deals. \nToughness: The second number shows how much damage it can take before dying."],
        ["What is the Graveyard?",
            `The graveyard is where used spells and destroyed creatures go. Some cards can interact with the graveyard!`],
        ["What is the Battlefield?",
            `The battlefield is where permanents (creatures, artifacts, enchantments, etc) stay after being cast.`],
        ["What is the Command Zone?",
            `In Commander format, your commander starts in the command zone. You can cast it from there, but each time it returns, it costs 2 more mana.`],
        ["What is the Exile?",
            `Exile is a special zone. Cards in exile are out of the game unless something brings them back.`],
        ["What is a Token?",
            `Tokens are creatures or permanents created by effects. They are not real cards, but they act like them until they leave the battlefield.`],
        ["What is a Legendary Permanent?",
            `Legendary permanents are unique. You can't control two legendary permanents with the same name at the same time.`],
        ["What is a Planeswalker?",
            `Planeswalkers are powerful allies. They have loyalty points and can use one ability per turn. Opponents can attack your planeswalkers!`],
        ["What is a Triggered Ability?",
            `Triggered abilities start with "when", "whenever", or "at". They go on the stack and can be responded to.`],
        ["What is a Static Ability?",
            `Static abilities are always "on" as long as the card is on the battlefield.`],
        ["What is an Activated Ability?",
            `Activated abilities use a cost and a colon, like "Tap: Draw a card." You can use them as long as you can pay the cost.`],
    ]));
    const total = conteudo.length;
    const handlePrev = () => setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    const handleNext = () => setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : prev));

    return (
        <>
        <header><NavBarHome/></header>
        <div id="tutorials-root" className="p-8 text-center mt-12 min-h-screen text-white flex flex-col items-center justify-center max-w-2xl mx-auto">
            <p className="text-gray-300 mb-4 text-3xl font-bold">Learn how to play the game</p>

            <div className="w-full bg-gradient-to-br from-gray-950/60 to-red-950/60 text-white p-6 mt-5 border-[10px] border-black rounded-2xl shadow-2xl">
                <div className="grid grid-cols-1 gap-4">
                    <div className="w-full border-2 border-red-800 p-2 rounded shadow bg-gradient-to-br from-gray-950/70 to-red-950/70 flex items-center justify-between">
                        <h2 className="font-bold text-left flex items-center gap-2"><FaBookOpen className="text-red-400"/> Content</h2>
                        <span className="text-xs text-gray-400">{activeIndex + 1}/{total}</span>
                    </div>

                    <div className="w-full max-h-60 overflow-y-scroll border-2 border-red-800 p-4 rounded shadow flex flex-col gap-1">
                        {conteudo.map(([key], index) => (
                            <button
                                key={index}
                                className={`w-full text-left font-semibold px-4 py-2 rounded-lg transition duration-200 shadow border border-white/20 mb-1 ${activeIndex === index ? "bg-red-700 text-white scale-105" : "bg-white/5 text-gray-300 hover:bg-white/15 hover:text-gray-300 hover:scale-105 hover:shadow-lg"}`}
                                onClick={() => { setActiveIndex(index); setExpanded(true); }}
                                style={{ transition: 'all 0.18s cubic-bezier(.4,2,.6,1)' }}
                            >
                                {key}
                            </button>
                        ))}
                    </div>

                    <div className="w-full border-2 border-red-800 p-2 rounded shadow bg-gradient-to-br from-gray-950/70 to-red-950/70 flex items-center justify-between">
                        <h2 className="font-bold text-left">Description</h2>
                        <div className="flex gap-2">
                            <button onClick={handlePrev} disabled={activeIndex === 0} className={`rounded-full p-2 text-lg ${activeIndex === 0 ? 'text-gray-500' : 'text-red-400 hover:bg-red-900/30'}`}><FaChevronLeft/></button>
                            <button onClick={handleNext} disabled={activeIndex === total - 1} className={`rounded-full p-2 text-lg ${activeIndex === total - 1 ? 'text-gray-500' : 'text-red-400 hover:bg-red-900/30'}`}><FaChevronRight/></button>
                        </div>
                    </div>

                    <div className="w-full max-h-64 overflow-y-scroll border-2 border-red-800 p-4 rounded shadow relative bg-black/60 transition-all duration-300">
                        <button
                            className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-red-900/70 text-white hover:bg-red-700/80 focus:outline-none border border-red-800"
                            onClick={() => setExpanded((v) => !v)}
                        >
                            {expanded ? 'Hide' : 'Show'}
                        </button>
                        <AnimatePresence mode="wait">
                        {expanded && (
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.35, type: 'spring' }}
                                className="animate-fade-in"
                            >
                                {conteudo[activeIndex][1].split('\n').filter(linha => linha.trim().length > 0).map((linha, index) => (
                                    <p key={index} className="text-left text-base text-gray-200 font-semibold bg-white/10 border border-white/20 rounded-lg px-3 py-1 shadow-sm mb-1" dangerouslySetInnerHTML={{ __html: linha.trim() }} />
                                ))}
                            </motion.div>
                        )}
                        {!expanded && (
                            <motion.div
                                key={activeIndex + '-collapsed'}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center text-gray-400 text-sm mt-8"
                            >Description collapsed</motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-8">
              <button
                className="px-8 py-3 rounded-xl font-bold text-lg bg-red-700 text-white shadow-lg border-2 border-white/20 hover:scale-105 hover:shadow-2xl hover:bg-red-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                onClick={() => {
                  const token = localStorage.getItem('token');
                  const username = localStorage.getItem('username');
                  if (token && username && username !== 'null' && username !== 'undefined') {
                    navigate(`/create-deck?user=${username}`);
                  } else {
                    navigate('/login');
                  }
                }}
              >
                Try to build a deck now
              </button>
            </div>
        </div>

        <footer className="mt-4 text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} My Deck Builder. All rights reserved.
      </footer>
      </>
    )
}

export default Tutorials;
