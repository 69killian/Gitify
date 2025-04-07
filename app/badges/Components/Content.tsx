"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Trophy, Star, Award } from "lucide-react";
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

  const iconSize = badges[currentIndex].icon.length > 2 ? "text-7xl" : "text-9xl";

  return (
    <section className="px-4 md:px-8">
      <Breadcrumb pagename="badges" />
      
      <div className="mt-10 flex flex-col items-center">
        <h1 className="text-[60px] font-poppins gradient-gold drop-shadow-lg" style={{ fontFamily: "poppins, sans-serif" }}>
          ✨ Salle des Badges ✨
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
        <BadgeButton text=" ">
          <span className={`absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center ${iconSize}`}>
            {badges[currentIndex].icon}
          </span>
        </BadgeButton>
        <p className="mt-4 text-5xl font-extrabold gradient2 bg-clip-text drop-shadow-lg">
          {badges[currentIndex].badge}
        </p>
        <p className="text-sm text-gray-300 italic relative">
          {badges[currentIndex].description}
          {/* Ombre sous la description */}
          <span className="absolute inset-x-0 bottom-[-8px] h-[6px] bg-gradient-to-t from-black via-transparent to-transparent rounded-full shadow-lg"></span>
        </p>
      </motion.div>


        <button onClick={nextBadge} className="absolute right-0 p-2 bg-[#0E0913] rounded-full shadow-md hover:bg-[#0E0913]/60">
          <ChevronRight size={32} />
        </button>
      </div>

      <button className="text-[12.49px] mb-10 text-white cursor-pointer bg-violet-800 hover:bg-violet-600 transition-all duration-200 w-[200px] h-[42px] border border-1 border-violet-500 text-[12px] flex justify-center items-center">
          🎖️ Commencer un Défi &gt;
      </button>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Carte Badges débloqués */}
      <div className="relative z-10 py-3 px-6 bg-[#241730] rounded-sm border border-[#292929] transition-colors duration-300 shadow-md w-full h-[92px] rounded-[6px] flex items-center gap-4 p-4">
        <Trophy className="w-8 h-8 text-violet-500" />
        <div>
          <div className="text-2xl font-bold gradient">26</div>
          <div className="text-sm text-gray-400">Badges débloqués</div>
        </div>
      </div>

      {/* Carte Badges rares */}
      <div className="relative z-10 py-3 px-6 bg-[#241730] rounded-sm border border-[#292929] transition-colors duration-300 shadow-md w-full h-[92px] rounded-[6px] flex items-center gap-4 p-4">
        <Star className="w-8 h-8 text-violet-500" />
        <div>
          <div className="text-2xl font-bold gradient">12</div>
          <div className="text-sm text-gray-400">Badges rares</div>
        </div>
      </div>

      {/* Carte Progression */}
      <div className="relative z-10 py-3 px-6 bg-[#241730] rounded-sm border border-[#292929] transition-colors duration-300 shadow-md w-full h-[92px] rounded-[6px] flex items-center gap-4 p-4">
        <Award className="w-8 h-8 text-violet-500" />
        <div>
          <div className="text-2xl font-bold gradient">85%</div>
          <div className="text-sm text-gray-400">Progression totale</div>
        </div>
      </div>
    </div>

    {/* Section Badges en cours */}
    <div className="relative z-10 bg-[#241730] rounded-sm border border-[#292929] py-3 px-6 transition-colors duration-300 shadow-md border-t-2 w-full rounded-[6px] text-[16px] flex flex-col justify-start items-start gap-4 p-4 mb-8">
      <h2 className="text-xl font-semibold">Badges en cours</h2>
      <div className="space-y-6 w-full">
        {[
          { name: 'Streak Master', progress: 75, current: 23, target: 30 },
          { name: 'Code Legend', progress: 45, current: 450, target: 1000 },
          { name: 'PR Hero', progress: 60, current: 6, target: 10 },
        ].map((badge) => (
          <div key={badge.name} className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">{badge.name}</span>
              <span className="text-gray-400">
                {badge.current}/{badge.target}
              </span>
            </div>
            <div className="h-2 bg-violet-900/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-violet-500 rounded-full"
                style={{ width: `${badge.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

      
      <div className="mt-10 p-6  rounded-md from-black/30 via-transparent to-black/30 backdrop-blur-md bg-opacity-30">
        <h2 className="text-xl font-bold gradient-gold mb-4">
          ✨ Tous les Badges débloqués ✨
        </h2>
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
      className="relative px-[100px] py-[100px] border border-[12px] border-[#3A1C5C] text-white font-bold text-lg rounded-full bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg overflow-hidden group"
    >
      <span className="absolute inset-0 bg-white opacity-10 transform scale-x-150 skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700"></span>
      {children}
      {text}
      {/* Effet de brillance sur le survol */}
      <span className="absolute inset-0 opacity-20 group-hover:opacity-100 animate-shine"></span>
    </motion.button>
  );
};

export default TrophyRoom;
