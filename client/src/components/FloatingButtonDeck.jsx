import { MdOutlineMenuBook } from "react-icons/md";
import { useState } from "react";

export default function FloatingButtonDeck({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="sticky top-80 left-80  z-[100] px-6 py-4 bg-black/90 text-white rounded-full shadow-2xl border-2 border-white/20 flex items-center gap-3 text-lg font-bold hover:scale-105 hover:shadow-lg transition-all duration-200 lg:hidden"
      title="Open Deck"
      style={{ minWidth: 78 }}
    >
      <MdOutlineMenuBook className="text-2xl drop-shadow-lg" />
      <span className="hidden sm:inline">Open Deck</span>
    </button>
  );
}