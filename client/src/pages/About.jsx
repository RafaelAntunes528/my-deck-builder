import React from "react";
import NavBarHome from "../components/NavBarHome";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <NavBarHome />
      <main className="min-h-screen flex flex-col items-center justify-center bg-black/50 px-4 py-12 pt-24">
        <div className="max-w-2xl w-full bg-black/70 rounded-xl shadow-lg p-8 text-white text-center border border-gray-700">
          <h1 className="text-3xl font-bold mb-6 text-white">About & Legal Disclaimer</h1>
          <p className="mb-4 text-base text-gray-300">
            My Deck Builder is not affiliated with, endorsed, sponsored, or specifically approved by Wizards of the Coast LLC.<br /><br />
            <span className="font-semibold">Magic: The Gathering™</span>, as well as its logos, names, and trademarks, are the property of Wizards of the Coast LLC, a subsidiary of Hasbro, Inc.<br /><br />
            All card data and images are provided by the Scryfall API and belong to their respective copyright holders.<br /><br />
            The use of names, images, and information related to Magic: The Gathering on this site is solely for informational and entertainment purposes for the player community, with no commercial intent.<br /><br />
            If you are a rights holder and wish to request the removal of any content, please contact us and we will comply promptly.
          </p>
        </div>
      </main>

      {/* Footer children apenas para a página about*/}
      <Footer><b>My Deck Builder 2025 &copy; All rights reserved.</b></Footer>
    </>
  );
}

export default About; 