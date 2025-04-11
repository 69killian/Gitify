"use client"
import React from 'react';
import GitHubCalendar from './githubCalendar';
import Breadcrumb from './breadcrumb';
import Tables from './Tables';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import Link from 'next/link';

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

interface UserBadgeType {
  id: number;
  user_id: string;
  badge_id: number;
  unlocked_at: string;
  badge: Badge;
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
  const { data: session } = useSession();
  const { data: userBadges, error, isLoading } = useSWR<UserBadgeType[]>('/api/userbadges', fetcher);

  // Si aucun badge n'est chargé, utiliser les badges statiques pour la démo
  const displayBadges = !isLoading && !error && userBadges && userBadges.length > 0 
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

  return (
    <>
      <section className="px-4 md:px-8">
          <Breadcrumb pagename="Overview"/>
        {/* Hero Section */}
        <div className="flex flex-col justify-between gap-4">
          {/* Left Content */}
          <div className="md:w-1/2">
          <div className="text-[44px] mb-[20px]">
              Bienvenue, <span className='gradient'>{session?.user?.name}</span> 🖐️ {/*Put username here */}
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

        {/* Divider */}
        <div className="border-none border-[#1D1D1D] my-[50px]"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-[40px]">

        <div className="text-[14px] flex items-center gap-4">
        <div className="text-[75px] gradient">4.805</div>
        <div className="grid gap-2">
          <div className="text-[#7E7F81]">Jours de Streak</div>
          <div className="text-violet-400 inline-block w-[60px] whitespace-nowrap bg-violet-900/40 rounded-full border border-violet-500">
            {"+ 4.804"}
          </div>
        </div>
      </div>


          <div className='text-[14px] flex items-center gap-4'>
            <div className='text-[75px] gradient'>365</div>
            <div className='grid gap-2'>
              <div className='text-[#7E7F81]'>Record de Streak</div>
              <div className="text-violet-400 inline-block w-[60px] whitespace-nowrap bg-violet-900/40 rounded-full border border-violet-500 px-1">
            {"+ 365"}
          </div>
            </div>
          </div>

          <div className='text-[14px] flex items-center gap-4'>
            <div className='text-[75px] gradient'>36</div>
            <div className='grid gap-2'>
              <div className='text-[#7E7F81]'>Défis Réalisés</div>
              <div className="text-violet-400 inline-block w-[60px] whitespace-nowrap bg-violet-900/40 rounded-full border border-violet-500 px-1">
            {"+ 35"}
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

        <div className="mt-10  rounded-md from-black/30 via-transparent to-black/30 backdrop-blur-md bg-opacity-30">
        
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
      </div>

      </section>
    </>
  );
}

export default Content;
