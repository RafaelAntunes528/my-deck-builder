import React from "react";
import mtgLogo from "../../public/images/mtg_logo_monocolor.svg"
export default function LogoWithGlow() {
  return (
    <div className="relative inline-block p-4 w-fit">
      {/* Filtro SVG invisível */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="glowFilter">
            <feGaussianBlur stdDeviation="0" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* SVG com glow aplicado */}
      <img src={mtgLogo} className="img-glow w-56 sm:w-64 md:w-72 overflow-visible" ></img>
      {/* <LogoSVG className="glow-stroke w-56 sm:w-64 md:w-72 overflow-visible" /> */}
    </div>
  );
}
