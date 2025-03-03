"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Breadcrumb from "../../Components/breadcrumb";

const badges = [
  { id: 1, title: "Streak Newbie", badge:"🔥", description: "Atteins 3 jours de streak.", reward: "🔥 Badge Streak Newbie" },
  { id: 2, title: "Streak Enthusiast", badge:"🔥🔥", description: "Atteins 7 jours de streak.", reward: "🔥🔥 Badge Streak Enthusiast" },
  { id: 3, title: "Streak Warrior", badge:"⚔️🔥", description: "Atteins 15 jours de streak.", reward: "⚔️🔥 Badge Streak Warrior" },
  { id: 4, title: "Streak Master", badge:"🏅🔥", description: "Atteins 30 jours de streak.", reward: "🏅🔥 Badge Streak Master" },
  { id: 5, title: "Streak God", badge:"🏆🔥", description: "Atteins 100 jours de streak.", reward: "🏆🔥 Badge Streak God" },
  { id: 6, title: "First Commit", badge:"✅", description: "Réalise ton premier commit.", reward: "✅ Badge First Commit" },
  { id: 7, title: "Contributor", badge:"📝", description: "Fais 10 commits.", reward: "📝 Badge Contributor" },
  { id: 8, title: "Code Machine", badge:"💻", description: "Atteins 100 commits.", reward: "💻 Badge Code Machine" },
  { id: 9, title: "Code Addict", badge:"🚀", description: "Atteins 500 commits.", reward: "🚀 Badge Code Addict" },
  { id: 10, title: "Code Legend", badge:"🏅", description: "Atteins 1000 commits.", reward: "🏅 Badge Code Legend" },
  { id: 11, title: "First PR", badge:"🔄", description: "Soumets ta première PR.", reward: "🔄 Badge First PR" },
  { id: 12, title: "Merge Master", badge:"🔥🔄", description: "Fais fusionner 5 PRs.", reward: "🔥🔄 Badge Merge Master" },
  { id: 13, title: "PR Hero", badge:"🦸", description: "Fais fusionner 10 PRs.", reward: "🦸 Badge PR Hero" },
  { id: 14, title: "Open Source Champion", badge:"🏆", description: "Fais fusionner 20 PRs.", reward: "🏆 Badge Open Source Champion" },
  { id: 15, title: "Public Repo", badge:"🌍", description: "Crée ton premier repo public.", reward: "🌍 Badge Public Repo" },
  { id: 16, title: "Open Source Addict", badge:"💾", description: "Publie 3 repos publics.", reward: "💾 Badge Open Source Addict" },
  { id: 17, title: "OSS Rockstar", badge:"🎸", description: "Publie 10 repos publics.", reward: "🎸 Badge OSS Rockstar" },
  { id: 18, title: "Weekly Challenge", badge:"🏁", description: "Complète un challenge.", reward: "🏁 Badge Weekly Challenge" },
  { id: 19, title: "Challenge Grinder", badge:"💪", description: "Complète 5 challenges.", reward: "💪 Badge Challenge Grinder" },
  { id: 20, title: "Challenge King", badge:"👑", description: "Complète 10 challenges.", reward: "👑 Badge Challenge King" },
  { id: 21, title: "Night Coder", badge:"🌙", description: "Code entre 2h et 4h du matin.", reward: "🌙 Badge Night Coder" },
  { id: 22, title: "Weekend Warrior", badge:"🏖️",  description: "Code un samedi et dimanche.", reward: "🏖️ Badge Weekend Warrior" },
  { id: 23, title: "One Day Madness", badge:"💥", description: "Fais 100 commits en 24h.", reward: "💥 Badge One Day Madness" },
  { id: 24, title: "Forking Pro", badge:"🍴", description: "Réalise 10 forks.", reward: "🍴 Badge Forking Pro" }
];

const StartChallenge = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevChallenge = () => {
    setCurrentIndex((prev) => (prev === 0 ? badges.length - 1 : prev - 1));
  };

  const nextChallenge = () => {
    setCurrentIndex((prev) => (prev === badges.length - 1 ? 0 : prev + 1));
  };

  const iconSize = badges[currentIndex].badge.length > 2 ? "text-7xl" : "text-9xl";

  return (
    <section className="px-4 md:px-8">
      <Breadcrumb pagename="Démarrer un défi" />
      
      <div className="mt-10 flex flex-col items-center">
        <h1 className="text-[60px] font-poppins drop-shadow-lg" style={{ fontFamily: "poppins, sans-serif" }}>
          <span className="gradient-gold">Choisis ton Défi</span> 🎯
        </h1>
      </div>
      
      <div className="relative mt-10 flex items-center justify-center h-[500px]">
        <button onClick={prevChallenge} className="absolute left-0 p-2 bg-[#0E0913] rounded-full shadow-md hover:bg-[#0E0913]/60">
          <ChevronLeft size={32} />
        </button>

        <motion.div
          key={badges[currentIndex].id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="flex flex-col items-center text-center"
        >
          {/* Using BadgeButton for each badge */}
          <BadgeButton text=''>
            <span className={`absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center ${iconSize}`}>
            {badges[currentIndex].badge}
            </span>
          </BadgeButton>
          
          <p className="mt-4 text-5xl font-extrabold gradient2 bg-clip-text drop-shadow-lg">
            {badges[currentIndex].title}
          </p>
          <p className="text-sm text-gray-300 italic relative">
            {badges[currentIndex].description}
            <span className="absolute inset-x-0 bottom-[-8px] h-[6px] bg-gradient-to-t from-black via-transparent to-transparent rounded-full shadow-lg"></span>
          </p>
          
          <p className="mt-4 text-xl font-semibold text-violet-400">
            Récompense : {badges[currentIndex].reward}
          </p>
          <button className="mt-6 px-6 py-3 text-white bg-violet-800 hover:bg-violet-600 transition-all duration-200 rounded-lg">
            Démarrer ce défi
          </button>
        </motion.div>

        <button onClick={nextChallenge} className="absolute right-0 p-2 bg-[#0E0913] rounded-full shadow-md hover:bg-[#0E0913]/60">
          <ChevronRight size={32} />
        </button>
      </div>
    </section>
  );
};

const BadgeButton = ({ text, children }: { text: string, children: React.ReactNode }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative px-[100px] py-[100px] border border-[12px] border-[#3A1C5C] text-white font-bold text-lg rounded-full bg-gradient-to-r from-purple-600 to-purple-800 shadow-lg overflow-hidden group"
    >
      <span className="absolute inset-0 bg-white opacity-10 transform scale-x-150 skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700"></span>
      {children}
      {text}
      <span className="absolute inset-0 opacity-20 group-hover:opacity-100 animate-shine"></span>
    </motion.button>
  );
};

export default StartChallenge;