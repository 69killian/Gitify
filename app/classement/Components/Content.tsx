"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "../../Components/breadcrumb";
import Leaderboard from "./Leaderboard";
import Podium from "./Podium";

type StreakDistribution = {
  range: string;
  count: number;
};

const TrophyRoom = () => {
  const [streakDistribution, setStreakDistribution] = useState<StreakDistribution[]>([
    { range: "1-7 jours", count: 0 },
    { range: "8-30 jours", count: 0 },
    { range: "31-90 jours", count: 0 },
    { range: "91+ jours", count: 0 }
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

    fetchStreakDistribution();
  }, []);

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
        <div className="lg:col-span-2 bg-[#241730] rounded-sm border border-[#292929] p-8">
          <Leaderboard />
        </div>

        <div>
          <div className="card lg:col-span-2 bg-[#241730] rounded-sm border border-[#292929] p-8">
            <h2 className="text-xl font-semibold mb-6">Statistiques</h2>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-400 mb-2">Distribution des streaks</div>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-pulse text-violet-400">Chargement...</div>
                  </div>
                ) : error ? (
                  <div className="text-red-400 text-sm py-2">{error}</div>
                ) : (
                  <div className="space-y-2">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrophyRoom;