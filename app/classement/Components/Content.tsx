"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "../../Components/breadcrumb";
import Leaderboard from "./Leaderboard";
import Podium from "./Podium";
import SkeletonLoader from "@/components/ui/skeletonLoader";

type StreakDistribution = {
  range: string;
  count: number;
};

type TopStreak = {
  userId: string;
  name: string;
  username: string;
  streak: number;
};

const TrophyRoom = () => {
  const [streakDistribution, setStreakDistribution] = useState<StreakDistribution[]>([
    { range: "1-7 jours", count: 0 },
    { range: "8-30 jours", count: 0 },
    { range: "31-90 jours", count: 0 },
    { range: "91+ jours", count: 0 }
  ]);
  const [topStreaks, setTopStreaks] = useState<TopStreak[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingStreaks, setLoadingStreaks] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [streaksError, setStreaksError] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer les distributions de streak
    const fetchStreakDistribution = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats/streak-distribution');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données de distribution');
        }
        
        const data = await response.json();
        setStreakDistribution(data.distributions);
        setError(null);
      } catch (err) {
        console.error('Erreur de chargement des distributions:', err);
        setError('Impossible de charger les statistiques de distribution');
      } finally {
        setLoading(false);
      }
    };

    // Récupérer les meilleurs streaks du mois
    const fetchTopStreaks = async () => {
      try {
        setLoadingStreaks(true);
        const response = await fetch('/api/stats/top-streaks');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des meilleurs streaks');
        }
        
        const data = await response.json();
        setTopStreaks(data.topStreaks);
        setStreaksError(null);
      } catch (err) {
        console.error('Erreur de chargement des meilleurs streaks:', err);
        setStreaksError('Impossible de charger les meilleurs streaks');
      } finally {
        setLoadingStreaks(false);
      }
    };

    fetchStreakDistribution();
    fetchTopStreaks();
  }, []);

  // Fonction pour obtenir l'emoji de médaille selon le rang
  const getMedalEmoji = (index: number): string => {
    switch (index) {
      case 0: return '🏆';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '🔹';
    }
  };

  return (
    <section className="px-4 md:px-8">
      <Breadcrumb pagename="classement" />
      
      <div className="mt-10 flex flex-col items-center">
        <h1 className="text-[60px] font-poppins drop-shadow-lg" style={{ fontFamily: "poppins, sans-serif" }}>
          🏅 <span className="gradient-gold">Classement</span> 🏅
        </h1>
      </div>

      {/* Intégration du composant Podium dynamique */}
      <Podium />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Leaderboard */}
        <div className="lg:col-span-2">
          <Leaderboard />
        </div>

        {/* Statistiques */}
        <div>
          <div className="card bg-[#241730] rounded-sm border border-[#292929] p-8">
            <h2 className="text-xl font-semibold mb-6">Statistiques</h2>
            
            {/* Statistiques du classement */}
            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-400 mb-2">Distribution des streaks</div>
                {loading ? (
                  <div className="space-y-3">
                    <SkeletonLoader variant="text" width="100%" height="24px" />
                    <SkeletonLoader variant="text" width="100%" height="24px" />
                    <SkeletonLoader variant="text" width="100%" height="24px" />
                    <SkeletonLoader variant="text" width="100%" height="24px" />
                  </div>
                ) : error ? (
                  <div className="text-red-400 text-sm py-2">{error}</div>
                ) : (
                  <div className="space-y-4">
                    {streakDistribution.map((stat) => (
                      <div key={stat.range}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{stat.range}</span>
                          <span>{stat.count}%</span>
                        </div>
                        <div className="h-2 bg-violet-900/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-violet-500 rounded-full"
                            style={{ width: `${stat.count}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Meilleurs streaks du mois */}
            <div className="mt-8">
              <h3 className="text-sm text-gray-400 mb-4">Meilleurs streaks du mois</h3>
              {loadingStreaks ? (
                <div className="space-y-3">
                  <SkeletonLoader variant="text" width="100%" height="32px" />
                  <SkeletonLoader variant="text" width="100%" height="32px" />
                  <SkeletonLoader variant="text" width="100%" height="32px" />
                </div>
              ) : streaksError ? (
                <div className="text-red-400 text-sm py-2">{streaksError}</div>
              ) : topStreaks.length === 0 ? (
                <div className="bg-[#1A1024] p-4 rounded-md">
                  <p className="text-sm text-gray-400">Aucun streak enregistré ce mois-ci</p>
                </div>
              ) : (
                <div className="bg-[#1A1024] p-4 rounded-md space-y-2">
                  {topStreaks.slice(0, 5).map((streak, index) => (
                    <p key={streak.userId} className="text-sm">
                      {getMedalEmoji(index)} <span className="text-violet-400">{streak.streak} jours</span> - {streak.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrophyRoom;