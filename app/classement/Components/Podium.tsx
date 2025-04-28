"use client";

import useSWR from "swr";
import Image from "next/image";
import { Trophy, Award, Star, Target } from "lucide-react";

// Type pour un utilisateur du podium
interface PodiumUser {
  rank: number;
  id: string;
  name: string;
  username: string;
  avatar: string;
  points: number;
  streak: number;
  badges: number;
  challenges: number;
  score: number;
}

// Type pour les statistiques de l'utilisateur connecté
interface UserStats {
  id: string;
  username: string;
  name: string;
  avatar: string;
  rank: number;
  points: number;
  badges: number;
  challenges: number;
  score: number;
  currentStreak: number;
  longestStreak: number;
}

// Type pour les données retournées par l'API
interface PodiumData {
  podium: PodiumUser[];
  userStats: UserStats;
}

// Fonction fetcher pour SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  
  if (!res.ok) {
    const error = new Error("Une erreur est survenue lors de la récupération des données");
    throw error;
  }
  
  return res.json();
};

const Podium = () => {
  const { data, error, isLoading } = useSWR<PodiumData>("/api/podium", fetcher);

  // État de chargement
  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-8">
        <div className="text-lg text-gray-300">Chargement du classement...</div>
        <div className="mt-4 flex space-x-2">
          <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-150"></div>
          <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-300"></div>
        </div>
        
        {/* Skeleton pour le podium */}
        <div className="flex justify-center items-end gap-6 py-8 mt-8">
          {/* 2ème place */}
          <div className="flex flex-col items-center">
            <div className="w-[250px] h-[250px] rounded-full bg-[#321A47] animate-pulse border-[6px] border-violet-500"></div>
            <div className="w-32 h-6 bg-[#321A47] animate-pulse rounded mt-2 mx-auto"></div>
            <div className="w-24 h-4 bg-[#321A47] animate-pulse rounded mt-1 mx-auto"></div>
          </div>
          
          {/* 1ère place */}
          <div className="flex flex-col items-center">
            <div className="w-[350px] h-[350px] rounded-full bg-[#321A47] animate-pulse border-[10px] border-yellow-500"></div>
            <div className="w-48 h-8 bg-[#321A47] animate-pulse rounded mt-2 mx-auto"></div>
            <div className="w-32 h-4 bg-[#321A47] animate-pulse rounded mt-1 mx-auto"></div>
          </div>
          
          {/* 3ème place */}
          <div className="flex flex-col items-center">
            <div className="w-[250px] h-[250px] rounded-full bg-[#321A47] animate-pulse border-4 border-violet-500"></div>
            <div className="w-32 h-6 bg-[#321A47] animate-pulse rounded mt-2 mx-auto"></div>
            <div className="w-24 h-4 bg-[#321A47] animate-pulse rounded mt-1 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Gérer les erreurs
  if (error || !data) {
    return (
      <div className="text-center py-8 text-red-400">
        <p>Impossible de charger le classement pour le moment.</p>
        <p className="text-sm mt-2">Veuillez réessayer plus tard.</p>
      </div>
    );
  }

  // Réorganiser le podium pour afficher : 2ème (gauche) - 1er (milieu) - 3ème (droite)
  const podiumUsers = [...data.podium];
  // Assurer qu'on a au moins 3 utilisateurs
  while (podiumUsers.length < 3) {
    podiumUsers.push({
      rank: podiumUsers.length + 1,
      id: `placeholder-${podiumUsers.length}`,
      name: "---",
      username: "---",
      avatar: "https://avatars.githubusercontent.com/u/583231?v=4", // Image par défaut
      points: 0,
      streak: 0,
      badges: 0,
      challenges: 0,
      score: 0
    });
  }

  // Récupérer les utilisateurs par rang
  const first = podiumUsers.find(user => user.rank === 1);
  const second = podiumUsers.find(user => user.rank === 2);
  const third = podiumUsers.find(user => user.rank === 3);

  // Données des statistiques de l'utilisateur connecté
  const userStats = data.userStats;

  return (
    <>
      {/* Podium */}
      <div className="flex justify-center items-end gap-6 py-8">
        {/* 2ème place (à gauche) */}
        <div className="flex flex-col items-center">
          <Image
            src={second?.avatar || "https://avatars.githubusercontent.com/u/583231?v=4"} 
            alt={`Avatar de ${second?.name || 'utilisateur'}`} 
            width={250} 
            height={250}
            className="w-[250px] h-[250px] rounded-full border-[6px] border-violet-500" 
          />
          <h2 className="text-2xl font-bold text-white mt-2 gradient">{second?.name || "---"}</h2>
          <div className="flex items-center gap-2 text-gray-400">
            <Star className="w-4 h-4 text-violet-400" />
            <span>{second?.score || 0} pts</span>
          </div>
          <div className="flex space-x-3 mt-2">
            <div className="text-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600/20 text-violet-400 text-xs">
                {second?.streak || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">Streak</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400 text-xs">
                {second?.badges || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">Badges</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400 text-xs">
                {second?.challenges || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">Défis</div>
            </div>
          </div>
        </div>

        {/* 1ère place (au milieu) */}
        <div className="flex flex-col items-center">
          <Image
            src={first?.avatar || "https://avatars.githubusercontent.com/u/583231?v=4"} 
            alt={`Avatar de ${first?.name || 'utilisateur'}`}
            width={350} 
            height={350}
            className="w-[350px] h-[350px] rounded-full border-[10px] border-yellow-500" 
          />
          <h2 className="text-6xl font-bold text-white mt-2 gradient-gold">{first?.name || "---"}</h2>
          <div className="flex items-center gap-2 text-yellow-400 text-xl mt-1">
            <Star className="w-6 h-6 text-yellow-400" />
            <span>{first?.score || 0} pts</span>
          </div>
          <div className="flex space-x-6 mt-3">
            <div className="text-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-600/20 text-violet-400">
                {first?.streak || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">Streak</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400">
                {first?.badges || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">Badges</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400">
                {first?.challenges || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">Défis</div>
            </div>
          </div>
        </div>

        {/* 3ème place (à droite) */}
        <div className="flex flex-col items-center">
          <Image
            src={third?.avatar || "https://avatars.githubusercontent.com/u/583231?v=4"} 
            alt={`Avatar de ${third?.name || 'utilisateur'}`}
            width={250} 
            height={250} 
            className="w-[250px] h-[250px] rounded-full border-4 border-violet-500" 
          />
          <h2 className="text-lg font-bold text-white mt-2 gradient2">{third?.name || "---"}</h2>
          <div className="flex items-center gap-2 text-gray-400">
            <Star className="w-4 h-4 text-violet-400" />
            <span>{third?.score || 0} pts</span>
          </div>
          <div className="flex space-x-3 mt-2">
            <div className="text-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600/20 text-violet-400 text-xs">
                {third?.streak || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">Streak</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400 text-xs">
                {third?.badges || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">Badges</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400 text-xs">
                {third?.challenges || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">Défis</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques de l'utilisateur connecté */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 mt-12">
        {/* Rang de l'utilisateur */}
        <div className="card relative z-10 py-3 px-6 bg-[#241730] rounded-sm border border-[#292929] transition-colors duration-300 shadow-md w-full h-[92px] rounded-[6px] flex items-center gap-4 p-4">
          <div className="flex items-center gap-4">
            <Trophy className="w-8 h-8 text-violet-500" />
            <div>
              <div className="text-2xl font-bold gradient">#{userStats.rank}</div>
              <div className="text-sm text-gray-400">Votre rang</div>
            </div>
          </div>
        </div>

        {/* Score de l'utilisateur */}
        <div className="card relative z-10 py-3 px-6 bg-[#241730] rounded-sm border border-[#292929] transition-colors duration-300 shadow-md w-full h-[92px] rounded-[6px] flex items-center gap-4 p-4">
          <div className="flex items-center gap-4">
            <Star className="w-8 h-8 text-violet-500" />
            <div>
              <div className="text-2xl font-bold gradient">{userStats.score}</div>
              <div className="text-sm text-gray-400">Score total</div>
            </div>
          </div>
        </div>

        {/* Badges de l'utilisateur */}
        <div className="card relative z-10 py-3 px-6 bg-[#241730] rounded-sm border border-[#292929] transition-colors duration-300 shadow-md w-full h-[92px] rounded-[6px] flex items-center gap-4 p-4">
          <div className="flex items-center gap-4">
            <Award className="w-8 h-8 text-violet-500" />
            <div>
              <div className="text-2xl font-bold gradient">{userStats.badges}</div>
              <div className="text-sm text-gray-400">Badges</div>
            </div>
          </div>
        </div>

        {/* Défis de l'utilisateur */}
        <div className="card relative z-10 py-3 px-6 bg-[#241730] rounded-sm border border-[#292929] transition-colors duration-300 shadow-md w-full h-[92px] rounded-[6px] flex items-center gap-4 p-4">
          <div className="flex items-center gap-4">
            <Target className="w-8 h-8 text-violet-500" />
            <div>
              <div className="text-2xl font-bold gradient">{userStats.challenges}</div>
              <div className="text-sm text-gray-400">Défis commencés</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bouton pour commencer un défi */}
      <div className="flex justify-center">
        <button className="text-[12.49px] text-white cursor-pointer bg-violet-800 hover:bg-violet-600 transition-all duration-200 w-[200px] h-[42px] border border-1 border-violet-500 text-[12px] flex justify-center items-center">
          🎖️ Commencer un Défi &gt;
        </button>
      </div>
    </>
  );
};

export default Podium; 