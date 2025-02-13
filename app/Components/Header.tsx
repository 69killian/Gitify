"use client"

import React, { useState } from "react";
import Image from "next/image";
import Tiret from "./images/tiret.svg";
import { CommandDemo } from "./command";
import { Menu, X } from "lucide-react";

const  Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed bg-[#0E0913] h-[60px] right-0 left-0 flex justify-between sm:justify-between md:justify-between items-center px-4 lg:px-8 border-b border-white/15 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <div className="whitespace-nowrap font-poppins font-bold text-[25px] cursor-pointer transition-all duration-200 hover:text-violet-700">Gitify .</div>
      </div>

      
      {/* Desktop Menu */}
      <div className="hidden md:flex gap-[20px] lg:gap-[84px] items-center">
      <Image src={Tiret} alt="Tiret" className="hidden md:block" />
        <div className="flex gap-10 justify-center">
        
            <div className="text-violet-700">Accueil</div>
            <div className="text-white transition duration-300 hover:text-violet-700 cursor-pointer">
            Guide
            </div>
            <div className="text-white transition duration-300 hover:text-violet-700 cursor-pointer">
            Twitter
            </div>
        </div>
        <Image src={Tiret} alt="Tiret" className="hidden lg:block" />
        <CommandDemo />
        <Image src={Tiret} alt="Tiret" className="hidden lg:block" />
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-white p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-[85px] left-0 w-full bg-[#121212] p-4 flex flex-col gap-4 text-white md:hidden">
          <div className="text-white">Library</div>
          <div className="text-[#7E7F81] transition duration-300 hover:text-white cursor-pointer">
            Extensions
          </div>
          <div className="text-[#7E7F81] transition duration-300 hover:text-white cursor-pointer">
            Community
          </div>
          <div className="text-[#7E7F81] transition duration-300 hover:text-white cursor-pointer">
            Membership
          </div>
          <CommandDemo />
        </div>
      )}

      {/* User Dropdown */}
        <button className=" bg-[#160E1E] h-10 w-10 rounded-full hover:bg-[#160E1E] transition duration-300 border border-[#1d1d1d] text-white rounded-sm px-2 pt-2 pb-1 focus:outline-none focus:ring-2 focus:ring-violet-700">
        </button>
    </nav>
  );
};

export default Header;
