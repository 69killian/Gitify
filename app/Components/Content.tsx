"use client"
import React, { useState } from 'react';
import GitHubCalendar from './githubCalendar';
import Breadcrumb from './breadcrumb';
import { useSession } from 'next-auth/react';
import useSWR, { mutate } from 'swr';
import Link from 'next/link';
import SkeletonLoader from '../../components/ui/skeletonLoader';

// Type pour les badges de l'utilisateur
interface Badge {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  category: string | null;
  condition: string;
  created_at: Date;
}

interface Challenge {
  id: number;
  name: string;
  description: string | null;
  difficulty: string | null;
  duration: number | null;
  reward_badge_id: number | null;
  created_at: Date;
}

interface UserBadgeType {
  id: number;
  user_id: string;
  badge_id: number;
  unlocked_at: string;
  badge: Badge;
}

interface StreakType {
  id: number;
  user_id: string;
  start_date: string;
  end_date: string | null;
  current_streak: number;
  longest_streak: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserChallengeType {
  id: number;
  user_id: string;
  challenge_id: number;
  start_date: string;
  end_date: string | null;
  progress: number;
  status: string;
  created_at: string;
  challenge: Challenge;
}

interface ProgressDataType {
  streak: StreakType | null;
  inProgressChallenges: UserChallengeType[];
  completedChallenges: UserChallengeType[];
  userBadges: UserBadgeType[];
}

// Données statiques pour le fallback
const staticBadges: UserBadgeType[] = [
  { 
    id: 1, 
    user_id: "static-user", 
    badge_id: 1, 
    unlocked_at: new Date().toISOString(), 
    badge: { 
      id: 1, 
      name: "Streak Newbie", 
      description: "Premier streak atteint", 
      condition: "3 jours de streak", 
      icon: "🔥", 
      category: "🔥 Streaks", 
      created_at: new Date() 
    } 
  },
  { 
    id: 2, 
    user_id: "static-user", 
    badge_id: 2, 
    unlocked_at: new Date().toISOString(), 
    badge: { 
      id: 2, 
      name: "Streak Enthusiast", 
      description: "Tu commences à être sérieux", 
      condition: "7 jours de streak", 
      icon: "🔥🔥", 
      category: "🔥 Streaks", 
      created_at: new Date() 
    } 
  },
  { 
    id: 3, 
    user_id: "static-user", 
    badge_id: 3, 
    unlocked_at: new Date().toISOString(), 
    badge: { 
      id: 3, 
      name: "Streak Warrior", 
      description: "La régularité paie !", 
      condition: "15 jours de streak", 
      icon: "⚔️🔥", 
      category: "🔥 Streaks", 
      created_at: new Date() 
    } 
  },
];

// Fonction pour récupérer les données
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Content = () => {
  const { data: session, status: sessionStatus } = useSession();
  const { data: userBadges, error, isLoading: isLoadingBadges } = useSWR<UserBadgeType[]>('/api/userbadges', fetcher);
  
  // Récupération des données de progression
  const { data: progressData, isLoading: isLoadingProgress } = 
    useSWR<ProgressDataType>(session ? '/api/progress' : null, fetcher);
  
  // État pour le chargement de la mise à jour de la progression
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  // Déterminer si les données sont en cours de chargement
  const isLoading = isLoadingBadges || isLoadingProgress || sessionStatus === "loading";

  // Si aucun badge n'est chargé, utiliser les badges statiques pour la démo
  const displayBadges = !isLoadingBadges && !error && userBadges && userBadges.length > 0 
    ? userBadges 
    : staticBadges;

  // Regrouper les badges par catégorie
  type GroupedBadgesType = Record<string, UserBadgeType[]>;
  
  const groupedBadges = displayBadges.reduce<GroupedBadgesType>((acc, userBadge) => {
    const category = userBadge.badge.category || "Non catégorisé";
    if (!acc[category]) acc[category] = [];
    acc[category].push(userBadge);
    return acc;
  }, {});

  // Nombre total de badges débloqués réels
  const totalBadges = userBadges?.length || displayBadges.length;
  
  // Statistiques de progression
  const currentStreak = progressData?.streak?.current_streak || 0;
  const longestStreak = progressData?.streak?.longest_streak || 0;
  const completedChallengesCount = progressData?.completedChallenges?.length || 0;
  
  // Fonction pour mettre à jour la progression
  const updateProgress = async () => {
    if (!session || isUpdatingProgress) return;
    
    try {
      setIsUpdatingProgress(true);
      
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }
      
      // Afficher les notifications pour les badges obtenus
      if (data.awardedBadges && data.awardedBadges.length > 0) {
        data.awardedBadges.forEach((badge: Badge) => {
          window.showToast(
            `🎉 Nouveau badge débloqué : ${badge.name}`,
            'success',
            6000
          );
        });
      }
      
      // Afficher les notifications pour les challenges complétés
      if (data.completedChallenges && data.completedChallenges.length > 0) {
        data.completedChallenges.forEach((challenge: Challenge) => {
          window.showToast(
            `🏆 Challenge terminé : ${challenge.name}`,
            'success',
            6000
          );
        });
      }
      
      // Si aucun nouveau badge ou challenge, afficher un message neutre
      if ((!data.awardedBadges || data.awardedBadges.length === 0) && 
          (!data.completedChallenges || data.completedChallenges.length === 0)) {
        window.showToast(
          `✅ Progression mise à jour !`,
          'info',
          3000
        );
      }
      
      // Rafraîchir les données affichées
      mutate('/api/userbadges');
      mutate('/api/progress');
      
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la progression:", error);
      window.showToast(
        error instanceof Error ? error.message : "Erreur lors de la mise à jour",
        'error',
        5000
      );
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  return (
    <>
      <section className="px-4 md:px-8">
          <Breadcrumb pagename="Overview"/>
        {/* Hero Section */}
        <div className="flex flex-col justify-between gap-4">
          {/* Left Content */}
          <div className="md:w-1/2">
          <div className="text-[44px] mb-[20px]">
              {isLoading ? (
                <SkeletonLoader variant="text" width="300px" height="50px" />
              ) : (
                <>Bienvenue, <span className='gradient'>{session?.user?.name}</span> 🖐️</>
              )}
            </div>
            <div className="text-[26px] mb-[20px]">
              Mes <span className="gradient">Contributions</span>
            </div>
            <div className="text-[14px] text-[#7E7F81] mb-[40px] md:mb-[150px] lg:mb-[150px] xl:mb-[26px]">
            Ce calendrier interactif te permet de visualiser tes contributions récentes sur GitHub de manière simple. <br className="hidden" /> Chaque carré représente un jour, et la couleur indique si tu as effectué une contribution ce jour-là. Plus la couleur est foncée, plus tu as de contibutions.
            </div>
            
          </div>
          <GitHubCalendar />
        </div>

        {/* Bouton de mise à jour de la progression */}
        <div className="flex justify-center mt-4">
          <button
            onClick={updateProgress}
            disabled={isUpdatingProgress || !session}
            className={`text-white py-2 px-4 rounded-md flex items-center justify-center ${
              isUpdatingProgress 
                ? 'bg-violet-700 opacity-70 cursor-not-allowed' 
                : 'bg-violet-700 hover:bg-violet-600 cursor-pointer'
            }`}
          >
            {isUpdatingProgress ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mise à jour en cours...
              </>
            ) : (
              <>🔄 Mise à jour du Streak</>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="border-none border-[#1D1D1D] my-[50px]"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-[40px]">
          {isLoading ? (
            // Afficher des skeleton loaders pour les statistiques
            <>
              <SkeletonLoader variant="stat" />
              <SkeletonLoader variant="stat" />
              <SkeletonLoader variant="stat" />
              <SkeletonLoader variant="stat" />
            </>
          ) : (
            // Afficher les statistiques réelles
            <>
              <div className="text-[14px] flex items-center gap-4">
                <div className="text-[75px] gradient">{currentStreak}</div>
                <div className="grid gap-2">
                  <div className="text-[#7E7F81]">Jours de Streak</div>
                  <div className="text-violet-400 inline-block w-[60px] whitespace-nowrap bg-violet-900/40 rounded-full border border-violet-500">
                    {"+ " + currentStreak}
                  </div>
                </div>
              </div>

              <div className='text-[14px] flex items-center gap-4'>
                <div className='text-[75px] gradient'>{longestStreak}</div>
                <div className='grid gap-2'>
                  <div className='text-[#7E7F81]'>Record de Streak</div>
                  <div className="text-violet-400 inline-block w-[60px] whitespace-nowrap bg-violet-900/40 rounded-full border border-violet-500 px-1">
                    {"+ " + longestStreak}
                  </div>
                </div>
              </div>

              <div className='text-[14px] flex items-center gap-4'>
                <div className='text-[75px] gradient'>{completedChallengesCount}</div>
                <div className='grid gap-2'>
                  <div className='text-[#7E7F81]'>Défis Réalisés</div>
                  <div className="text-violet-400 inline-block w-[60px] whitespace-nowrap bg-violet-900/40 rounded-full border border-violet-500 px-1">
                    {"+ " + completedChallengesCount}
                  </div>
                </div>
              </div>

              <div className='text-[14px] flex items-center gap-4'>
                <div className='text-[75px] gradient'>{totalBadges}</div>
                <div className='grid gap-2'>
                  <div className='text-[#7E7F81]'>Badges débloqués</div>
                  <div className="text-violet-400 inline-block w-[60px] whitespace-nowrap bg-violet-900/40 rounded-full border border-violet-500 px-1">
                    {"+ " + totalBadges}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Section des badges récents */}
        <div className="mt-[30px] mb-[30px] flex items-center justify-between">
          <div className="text-[20px] md:text-[26px] gradient-gold" style={{ fontFamily: "poppins, sans-serif" }}>
          ✨ Tous les Badges que tu as débloqué ✨
          </div>
          <Link href="/badges">
            <button className="text-[12.49px] text-white cursor-pointer bg-violet-800 hover:bg-violet-600 transition-all duration-200 w-[169px] h-[42px] border border-1 border-violet-500 text-[12px] flex justify-center items-center">
            🎖️ Voir tous mes Badges &gt;
            </button>
          </Link>
        </div>

        <div className="mt-10 rounded-md from-black/30 via-transparent to-black/30 backdrop-blur-md bg-opacity-30">
          {isLoading ? (
            // Afficher des skeleton loaders pour les badges
            <div className="space-y-10">
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-violet-300">
                  <SkeletonLoader variant="text" width="150px" height="24px" />
                </h3>
                <SkeletonLoader variant="badge" count={8} />
              </div>
            </div>
          ) : (
            // Afficher les badges réels
            <>
              {Object.keys(groupedBadges).length === 0 ? (
                <p className="text-center text-gray-400 py-10">Aucun badge débloqué pour le moment</p>
              ) : (
                <div className="space-y-10">
                  {Object.entries(groupedBadges).map(([category, badges]) => (
                    <div key={category} className="mb-8">
                      <h3 className="text-lg font-semibold mb-4 text-violet-300">{category}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {badges.map((userBadge) => (
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
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default Content;
