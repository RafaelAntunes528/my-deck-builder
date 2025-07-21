import React, { useEffect, useState } from "react";

function Cartas() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento de dados (substitua por fetch real se necessário)
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white">Carregando cartas...</p>
        </div>
      </div>
    );
  }

  return <div>Visualização de cartas aqui.</div>;
}

export default Cartas;