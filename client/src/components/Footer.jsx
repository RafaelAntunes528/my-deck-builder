import React from "react";

function Footer({ leve, children }) {
  return (
    <footer className={`w-full z-50 bg-black/80 border-t-2 border-gray-700 ${leve ? 'shadow-md' : 'shadow-lg shadow-red-900/30 backdrop-blur-md'} text-xs sm:text-sm text-center fonte-morisroman py-3`}>
      <div className={`max-w-7xl mx-auto flex flex-col ${children ? 'justify-center items-center text-center' : 'sm:flex-row sm:items-center sm:justify-between'} gap-2 px-4 sm:px-8`}>
        {children ? (
          <div className="font-semibold text-white text-center w-full">{children}</div>
        ) : (
          <>
            <div className="font-semibold text-white">
              My Deck Builder 2025 &copy; All rights reserved.
            </div>
            <div className="text-gray-400 text-[1em] sm:text-sm leading-snug sm:text-right">
              This site is not affiliated with, endorsed, sponsored, or specifically approved by Wizards of the Coast LLC. Magic: The Gathering and its logos are trademarks of Wizards of the Coast LLC. Card data and images are provided by the Scryfall API. All rights for card data and images belong to their respective owners.
            </div>
          </>
        )}
      </div>
    </footer>
  );
}

export default Footer;