"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Breadcrumb from "../../Components/breadcrumb";
import Tables from "../../Components/Tables";

const badges = [
  { id: 1, badge: "Streak Newbie", description: "Premier streak atteint", condition: "3 jours de streak", icon: "🔥", category: "🔥 Streaks" },
  { id: 2, badge: "Streak Enthusiast", description: "Tu commences à être sérieux", condition: "7 jours de streak", icon: "🔥🔥", category: "🔥 Streaks" },
  { id: 3, badge: "Streak Warrior", description: "La régularité paie !", condition: "15 jours de streak", icon: "⚔️🔥", category: "🔥 Streaks" },
  { id: 4, badge: "Streak Master", description: "Tu es un vrai grinder", condition: "30 jours de streak", icon: "🏅🔥", category: "🔥 Streaks" },
  { id: 5, badge: "Streak God", description: "Plus déterminé que jamais", condition: "100 jours de streak", icon: "🏆🔥", category: "🔥 Streaks" }
];

const TrophyRoom = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevBadge = () => {
    setCurrentIndex((prev) => (prev === 0 ? badges.length - 1 : prev - 1));
  };

  const nextBadge = () => {
    setCurrentIndex((prev) => (prev === badges.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="px-4 md:px-8">
      <Breadcrumb pagename="badges" />
      
      <div className="mt-10 flex flex-col items-center">
        <h1 className="text-[26px] font-bold" style={{ fontFamily: "Aeonik, sans-serif" }}>
          Salle des Trophées
        </h1>
      </div>
      
      <div className="relative mt-10 flex items-center justify-center h-[500px]">
        <button onClick={prevBadge} className="absolute left-0 p-2 bg-[#0E0913] rounded-full shadow-md hover:bg-[#0E0913]/60">
          <ChevronLeft size={32} />
        </button>
        <motion.div
          key={badges[currentIndex].id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="flex flex-col items-center text-center"
        >
          <BadgeButton>
            <span className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-9xl">
              {badges[currentIndex].icon}
            </span>
          </BadgeButton>
          <p className="mt-4 text-lg font-semibold">{badges[currentIndex].badge}</p>
          <p className="text-sm text-gray-500">{badges[currentIndex].description}</p>
        </motion.div>

        <button onClick={nextBadge} className="absolute right-0 p-2 bg-[#0E0913] rounded-full shadow-md hover:bg-[#0E0913]/60">
          <ChevronRight size={32} />
        </button>
      </div>
      
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Tous les Badges débloqués</h2>
        <Tables />
      </div>
    </section>
  );
};



export const BadgeButton = ({ text, children }: { text: string, children: React.ReactNode }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative px-[100px] py-[100px] text-white font-bold text-lg rounded-full bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg overflow-hidden"
    >
      {/* Effet de brillance */}
      <span className="absolute inset-0 bg-white opacity-10 transform scale-x-150 skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700"></span>

      {/* Le badge est positionné ici */}
      {children}

      {/* Le texte sur le bouton */}
      {text}
    </motion.button>
  );
};


export default TrophyRoom;