"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, RefreshCcw } from "lucide-react";

// Types pour les données de statistiques
interface StreakDistribution {
  range: string;
  count: number;
}

interface TopLanguage {
  name: string;
  percentage: number;
}

interface StatisticsData {
  streakDistribution: StreakDistribution[];
  topLanguages: TopLanguage[];
}

// Données de fallback en cas d'erreur
const fallbackData: StatisticsData = {
  streakDistribution: [
    { range: "1-7 jours", count: 45 },
    { range: "8-30 jours", count: 30 },
    { range: "31-90 jours", count: 15 },
    { range: "91+ jours", count: 10 }
  ],
  topLanguages: [
    { name: "JavaScript", percentage: 35 },
    { name: "Python", percentage: 25 },
    { name: "Java", percentage: 20 },
    { name: "TypeScript", percentage: 15 }
  ]
};

/**
 * Composant affichant les statistiques globales
 * - Distribution des streaks
 * - Top langages de programmation
 */
const Statistics = () => {
  // États pour gérer les données et les différents états d'affichage
  const [data, setData] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fonction pour récupérer les statistiques
  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Récupération des statistiques depuis l'API...");
      const response = await fetch("/api/statistics", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        }
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Erreur de l'API:", errorData);
        throw new Error(`Erreur ${response.status}: ${errorData}`);
      }
      
      const statisticsData = await response.json();
      console.log("Données statistiques reçues:", statisticsData);
      
      if (!statisticsData.streakDistribution || !statisticsData.topLanguages) {
        console.error("Format de données invalide:", statisticsData);
        throw new Error("Format de données invalide");
      }
      
      setData(statisticsData);
    } catch (err) {
      console.error("Erreur de récupération:", err);
      setError(err instanceof Error ? err.message : "Impossible de charger les statistiques");
      // Si après 3 tentatives on échoue toujours, on utilise les données de fallback
      if (retryCount >= 2) {
        console.log("Utilisation des données de fallback après échecs multiples");
        setData(fallbackData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Récupération des données au chargement du composant
  useEffect(() => {
    fetchStatistics();
  }, [retryCount]);

  // Fonction pour réessayer en cas d'erreur
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className="card bg-[#241730] rounded-sm border border-[#292929] p-8">
        <h2 className="text-xl font-semibold mb-6">Statistiques</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-violet-500" />
        </div>
      </div>
    );
  }

  // Affichage en cas d'erreur
  if (error && !data) {
    return (
      <div className="card bg-[#241730] rounded-sm border border-[#292929] p-8">
        <h2 className="text-xl font-semibold mb-6">Statistiques</h2>
        <div className="text-red-400 text-center py-4 flex flex-col items-center">
          <AlertCircle className="h-8 w-8 mb-2" />
          <span className="mb-4">{error}</span>
          <button 
            onClick={handleRetry}
            className="flex items-center gap-2 px-4 py-2 bg-violet-700 text-white rounded-md hover:bg-violet-600 transition-colors"
          >
            <RefreshCcw className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Affichage si aucune donnée n'est disponible
  if (!data) {
    return (
      <div className="card bg-[#241730] rounded-sm border border-[#292929] p-8">
        <h2 className="text-xl font-semibold mb-6">Statistiques</h2>
        <div className="text-gray-400 text-center py-4">
          Aucune statistique disponible
        </div>
      </div>
    );
  }

  // Affichage des statistiques
  return (
    <div className="card bg-[#241730] rounded-sm border border-[#292929] p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Statistiques</h2>
        {error && (
          <button 
            onClick={handleRetry}
            className="text-violet-400 hover:text-violet-300 transition-colors"
            title="Actualiser les données"
          >
            <RefreshCcw className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="space-y-6">
        {/* Distribution des streaks */}
        <div>
          <div className="text-sm text-gray-400 mb-2">Distribution des streaks</div>
          <div className="space-y-2">
            {data.streakDistribution.map((stat) => (
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
        </div>

        {/* Top langages */}
        <div>
          <div className="text-sm text-gray-400 mb-2">Top langages</div>
          <div className="space-y-2">
            {data.topLanguages.map((language) => (
              <div key={language.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{language.name}</span>
                  <span>{language.percentage}%</span>
                </div>
                <div className="h-2 bg-violet-900/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-500 rounded-full"
                    style={{ width: `${language.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics; 