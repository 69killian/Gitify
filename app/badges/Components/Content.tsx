"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Trophy, Star, Award } from "lucide-react";
import Breadcrumb from "../../Components/breadcrumb";
import useSWR from "swr";
import { useSession } from "next-auth/react";

// Type pour les badges de l'utilisateur
interface Badge {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  category: string | null;
  condition: string;
  created_at: string;
}

interface UserBadgeType {
  id: number;
  user_id: string;
  badge_id: number;
  unlocked_at: string;
  badge: Badge;
}

// Type pour les badges en progression
interface BadgeProgress {
  name: string;
  current: number;
  target: number;
  progress: number;
  icon?: string | null;
  description?: string | null;
}

// Réponse de l'API pour les badges en progression
interface BadgesProgressResponse {
  badgesInProgress: BadgeProgress[];
  totalProgress: number;
}

// Pour le développement, utilisation des badges statiques en fallback
const staticBadges = [
  { id: 1, badge: "Streak Newbie", description: "Premier streak atteint", condition: "3 jours de streak", icon: "🔥", category: "🔥 Streaks" },
  { id: 2, badge: "Streak Enthusiast", description: "Tu commences à être sérieux", condition: "7 jours de streak", icon: "🔥🔥", category: "🔥 Streaks" },
  { id: 3, badge: "Streak Warrior", description: "La régularité paie !", condition: "15 jours de streak", icon: "⚔️🔥", category: "🔥 Streaks" },
  { id: 4, badge: "Streak Master", description: "Tu es un vrai grinder", condition: "30 jours de streak", icon: "🏅🔥", category: "🔥 Streaks" },
  { id: 5, badge: "Streak God", description: "Plus déterminé que jamais", condition: "100 jours de streak", icon: "🏆🔥", category: "🔥 Streaks" }
];

// Fonction pour récupérer les données
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TrophyRoom = () => {
  // useSession est nécessaire pour l'authentification des API
  useSession();
  
  const { data: userBadges, error, isLoading } = useSWR<UserBadgeType[]>('/api/userbadges', fetcher);
  const { 
    data: badgesProgressData, 
    error: progressError, 
    isLoading: isLoadingProgress 
  } = useSWR<BadgesProgressResponse>('/api/badges/in-progress', fetcher);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // Si aucun badge n'est chargé, utiliser les badges statiques pour la démo
  const displayBadges = !isLoading && !error && userBadges && userBadges.length > 0 
    ? userBadges 
    : staticBadges.map(badge => ({
        id: badge.id,
        badge: {
          id: badge.id,
          name: badge.badge,
          description: badge.description,
          icon: badge.icon,
          category: badge.category,
          condition: badge.condition,
          created_at: new Date().toISOString()
        }
      }));

  // Réinitialiser l'index quand les badges changent
  useEffect(() => {
    setCurrentIndex(0);
  }, [userBadges]);

  const prevBadge = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayBadges.length - 1 : prev - 1));
  };

  const nextBadge = () => {
    setCurrentIndex((prev) => (prev === displayBadges.length - 1 ? 0 : prev + 1));
  };

  // Regrouper les badges par catégorie
  type GroupedBadgesType = Record<string, Array<typeof displayBadges[0]>>;
  
  const groupedBadges = displayBadges.reduce<GroupedBadgesType>((acc, userBadge) => {
    const category = userBadge.badge.category || "Non catégorisé";
    if (!acc[category]) acc[category] = [];
    acc[category].push(userBadge);
    return acc;
  }, {});

  // Déterminer la taille de l'icône en fonction de sa longueur
  const currentBadge = displayBadges[currentIndex]?.badge || null;
  const iconSize = currentBadge?.icon?.length && currentBadge.icon.length > 2 ? "text-7xl" : "text-9xl";
  
  // Nombre total de badges débloqués
  const totalBadges = displayBadges.length;
  
  // Utiliser la progression totale de l'API ou une valeur par défaut
  const totalProgressPercentage = !isLoadingProgress && !progressError && badgesProgressData 
    ? badgesProgressData.totalProgress 
    : Math.min(Math.round((totalBadges / 50) * 100), 100); // Fallback: 50 badges max

  // Simuler les badges rares
  const rareBadges = Math.round(totalBadges * 0.4); // 40% des badges sont considérés comme rares

  // Fallback pour les badges en progression si l'API échoue
  const fallbackBadgesInProgress = [
    { name: 'Streak Master', progress: 75, current: 23, target: 30, icon: '🏅🔥', description: null },
    { name: 'Code Legend', progress: 45, current: 450, target: 1000, icon: '👑', description: null },
    { name: 'PR Hero', progress: 60, current: 6, target: 10, icon: '🦸', description: null },
  ];

  // Utiliser les données dynamiques ou le fallback
  const badgesInProgress = (!isLoadingProgress && !progressError && badgesProgressData?.badgesInProgress) 
    ? badgesProgressData.badgesInProgress 
    : fallbackBadgesInProgress;

  return (
    <section className="px-4 md:px-8">
      <Breadcrumb pagename="badges" />
      
      <div className="mt-10 flex flex-col items-center">
        <h1 className="text-[60px] font-poppins gradient-gold drop-shadow-lg" style={{ fontFamily: "poppins, sans-serif" }}>
          ✨ Salle des Badges ✨
        </h1>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[500px]">
          <p className="text-2xl text-gray-400">Chargement de vos badges...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-[500px]">
          <p className="text-2xl text-red-500">Erreur lors du chargement des badges</p>
        </div>
      ) : displayBadges.length === 0 ? (
        <div className="flex items-center justify-center h-[500px]">
          <p className="text-2xl text-gray-400">Vous n&apos;avez pas encore débloqué de badges</p>
        </div>
      ) : (
        <div className="relative mt-10 flex items-center justify-center h-[500px]">
          <button onClick={prevBadge} className="absolute left-0 p-2 bg-[#0E0913] rounded-full shadow-md hover:bg-[#0E0913]/60">
            <ChevronLeft size={32} />
          </button>
          <motion.div
            key={displayBadges[currentIndex]?.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col items-center text-center"
          >
            <BadgeButton text=" ">
              <span className={`absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center ${iconSize}`}>
                {currentBadge?.icon}
              </span>
            </BadgeButton>
            <p className="mt-4 text-5xl font-extrabold gradient2 bg-clip-text drop-shadow-lg">
              {currentBadge?.name}
            </p>
            <p className="text-sm text-gray-300 italic relative">
              {currentBadge?.description}
              <span className="absolute inset-x-0 bottom-[-8px] h-[6px] bg-gradient-to-t from-black via-transparent to-transparent rounded-full shadow-lg"></span>
            </p>
          </motion.div>
          <button onClick={nextBadge} className="absolute right-0 p-2 bg-[#0E0913] rounded-full shadow-md hover:bg-[#0E0913]/60">
            <ChevronRight size={32} />
          </button>
        </div>
      )}

      <button className="text-[12.49px] mb-10 text-white cursor-pointer bg-violet-800 hover:bg-violet-600 transition-all duration-200 w-[200px] h-[42px] border border-1 border-violet-500 text-[12px] flex justify-center items-center">
          🎖️ Commencer un Défi &gt;
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Carte Badges débloqués */}
        <div className="relative z-10 py-3 px-6 bg-[#241730] rounded-sm border border-[#292929] transition-colors duration-300 shadow-md w-full h-[92px] rounded-[6px] flex items-center gap-4 p-4">
          <Trophy className="w-8 h-8 text-violet-500" />
          <div>
            <div className="text-2xl font-bold gradient">{totalBadges}</div>
            <div className="text-sm text-gray-400">Badges débloqués</div>
          </div>
        </div>

        {/* Carte Badges rares */}
        <div className="relative z-10 py-3 px-6 bg-[#241730] rounded-sm border border-[#292929] transition-colors duration-300 shadow-md w-full h-[92px] rounded-[6px] flex items-center gap-4 p-4">
          <Star className="w-8 h-8 text-violet-500" />
          <div>
            <div className="text-2xl font-bold gradient">{rareBadges}</div>
            <div className="text-sm text-gray-400">Badges rares</div>
          </div>
        </div>

        {/* Carte Progression */}
        <div className="relative z-10 py-3 px-6 bg-[#241730] rounded-sm border border-[#292929] transition-colors duration-300 shadow-md w-full h-[92px] rounded-[6px] flex items-center gap-4 p-4">
          <Award className="w-8 h-8 text-violet-500" />
          <div>
            <div className="text-2xl font-bold gradient">{totalProgressPercentage || 0}%</div>
            <div className="text-sm text-gray-400">Progression totale</div>
          </div>
        </div>
      </div>

      {/* Section Badges en cours */}
      <div className="relative z-10 bg-[#241730] rounded-sm border border-[#292929] py-3 px-6 transition-colors duration-300 shadow-md border-t-2 w-full rounded-[6px] text-[16px] flex flex-col justify-start items-start gap-4 p-4 mb-8">
        <h2 className="text-xl font-semibold">Badges en cours</h2>
        {isLoadingProgress ? (
          <div className="flex justify-center w-full py-4">
            <div className="animate-pulse text-violet-400">Chargement des progressions...</div>
          </div>
        ) : progressError ? (
          <div className="text-red-400 text-sm py-2">Erreur lors du chargement des progressions</div>
        ) : badgesInProgress.length === 0 ? (
          <div className="w-full text-center py-4 text-gray-400">
            <p>Aucun badge en cours pour le moment</p>
            <p className="text-sm mt-2">Continuez à contribuer pour progresser vers de nouveaux badges !</p>
          </div>
        ) : (
          <div className="space-y-6 w-full">
            {badgesInProgress.map((badge) => (
              <div key={badge.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium flex items-center gap-2">
                    {badge.icon && <span className="text-xl">{badge.icon}</span>}
                    {badge.name}
                  </span>
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
                {badge.description && (
                  <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Vue d'ensemble par catégorie */}
      <div className="mt-10 p-6 rounded-md from-black/30 via-transparent to-black/30 backdrop-blur-md bg-opacity-30">
        <h2 className="text-xl font-bold gradient-gold mb-6">
          ✨ Badges débloqués par catégorie ✨
        </h2>
        
        {Object.keys(groupedBadges).length === 0 ? (
          <p className="text-center text-gray-400 py-10">Aucun badge débloqué pour le moment</p>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedBadges).map(([category, badges]) => (
              <div key={category} className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-violet-300">{category}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {badges.map((userBadge: typeof displayBadges[0]) => (
                    <div 
                      key={userBadge.id} 
                      className="bg-[#241730] border border-violet-900/30 p-4 rounded-md shadow-md flex flex-col items-center text-center"
                    >
                      <div className="text-4xl mb-2">{userBadge.badge.icon}</div>
                      <div className="font-semibold text-sm">{userBadge.badge.name}</div>
                      <div className="text-xs text-violet-400 mt-1">{userBadge.badge.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
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
