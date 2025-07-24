import React, { useEffect, useState } from "react";

function Toast({ message, type = "info", onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 350); // tempo igual ao da transição
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Cores de borda por tipo
  const borderColor = type === "error" ? "border-red-400" : type === "success" ? "border-green-400" : "border-gray-400/60";

  return (
    <div
      className={`fixed left-1/2 top-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl shadow-md font-bold text-white transition-all duration-350
        bg-black/70 backdrop-blur-sm border ${borderColor}
        ${type === "error" ? "text-red-200" : type === "success" ? "text-green-200" : "text-white/90"}
        ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      style={{ minWidth: 220, maxWidth: 400 }}
    >
      {message}
    </div>
  );
}

export default Toast; 