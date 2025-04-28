"use client";
import React, { useState } from "react";
import Image from "next/image";
import Chevron from "./images/chevron-down.svg";
import Flash from "./images/icon(2).svg";
import Squares from "./images/icon(3).svg";
import Stars from "./images/icon(4).svg";
import Link from "next/link";
import LeftParticles from './images/Group 194.svg';
import RightParticles from './images/Group 191.svg';


const Sidebar = () => {
  const [openAccordions, setOpenAccordions] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
    setOpenAccordions((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const accordionData = [
    {
      title: "🔥 Profil & Progression",
      content: [
        { type: "link", label: "🏆 Mon Streak", href: "/streak" },
        { type: "link", label: "📊 Mes Contributions", href: "/contributions" },
        { type: "link", label: "🎖️ Mes Badges", href: "/badges" }
      ],
      icon: Flash,
      link: "https://gitify.framer.website/"
    },
    {
      title: "🎯 Défis & Compétitions",
      content: [
        { type: "link", label: "⚡ Mes Défis", href: "/defis" },
        { type: "link", label: "🏅 Classement", href: "/classement" },
        { type: "link", label: "📅 Événements", href: "/evenements" }
      ],
      icon: Squares,
      link: "https://gitify.framer.website/"
    },
    {
      title: "⚙️ Paramètres",
      content: [
        { type: "link", label: "👤 Mon Profil", href: "/profil" },
        { type: "link", label: "🔄 Intégrations", href: "/integrations" },
        { type: "link", label: "📢 Feedback & Support", href: "/support" }
      ],
      icon: Stars,
      link: "https://gitify.framer.website/"
    },
  ];

  return (
    <nav className="hidden lg:block bg-[#0E0913] z-10 w-[250px] fixed bottom-0 top-[60px] text-white p-8 transition-all border-r border-r-1 border-white/15">
      {accordionData.map((accordion, index) => {
        const isOpen = openAccordions.includes(index);
        const isSections = accordion.title === "SECTIONS";
        return (
            <div
            key={index}
            className={`mb-4 border-b border-dashed border-b-2 border-[#333333] ${accordion.title === "PLAN" ? "border-none" : ""}`}
          >
            <div
              className="w-full text-left flex justify-between items-center cursor-pointer pb-0 pt-0"
              onClick={() => toggleAccordion(index)}
            >
              <div className="flex items-center gap-3 mb-2 mt-2">
                <h2 className={`transition-colors text-[14px] ${isOpen ? "text-white" : "text-[#7E7F81]"}`}>
                  {accordion.title}
                </h2>
              </div>
              <Image
                src={Chevron}
                alt="chevron-down"
                className={`transform transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
            <div
              className={`border-l border-[#333333] mb-5 ml-0 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                isOpen ? "max-h-[500px]" : "max-h-0"
              }`}
            >
              <div className="mt-0 pl-5 text-sm rounded-md">
                {accordion.content.map((item, itemIndex) => (
                  <div key={itemIndex} className="mb-3 last:mb-0 flex items-center gap-3">
                    {item.type === "link" && (
                      <Link 
                        href={item.href} 
                        className="text-[#7E7F81] hover:text-white cursor-pointer transition-all duration-100 py-2"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {isOpen && isSections && ( // Show "Show more +" only if it's the SECTIONS accordion
              <div className="text-[#7E7F81] text-[14px] pb-5 mt-2">
                Show more +
              </div>
            )}
          </div>
        );
      })}
      {/* Hidden Pro Version Button for now */}
      <button className="hidden bg-[#1B1B1B] hover:bg-[#121212] transition-all duration-200 w-[186px] h-[32px] rounded-[6px] border border-1 border-[#292929] text-[12px] relative flex justify-center items-center">
        <Image src={LeftParticles} alt="Left Particles" className="absolute left-0" />
        <Link href="https://warmhearted-imagine-949567.framer.app/" target="_blank">
        Upgrade to <span className="gradient">Pro</span>
        </Link>
        <Image src={RightParticles} alt="Right Particles" className="absolute right-0" />
      </button>
    </nav>
  );
};

export default Sidebar;
