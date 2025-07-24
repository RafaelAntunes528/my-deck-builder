import React from "react";
import mdb_logo from "../../public/images/mdb_logo_white.svg";
export default function LogoWithGlow() {
  return (
    <div className="relative inline-block p-6 w-fit" style={{ background: "#000" }}>
      <img
        src={mdb_logo}
        className="img-glow w-56 sm:w-64 md:w-72"
        style={{
          filter:  ""
        }}
        alt="Logo with Glow"
      />
    </div>
  );
}
