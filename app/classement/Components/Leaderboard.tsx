"use client";
import useSWR from "swr";
import Image from "next/image";

interface Contributor {
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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Leaderboard = () => {
  const { data, error, isLoading } = useSWR<Contributor[]>("/api/leaderboard", fetcher);

  // Afficher un placeholder pendant le chargement
  if (isLoading) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Classement Gitify</h2>
        <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-[#241730] rounded-lg">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#321A47] animate-pulse"></div>
              <div className="w-10 h-10 rounded-full bg-[#321A47] animate-pulse"></div>
              <div className="flex-1">
                <div className="w-24 h-4 bg-[#321A47] animate-pulse rounded"></div>
                <div className="w-16 h-3 bg-[#321A47] animate-pulse rounded mt-2"></div>
              </div>
              <div className="flex space-x-3">
                <div className="text-center">
                  <div className="w-8 h-8 bg-[#321A47] animate-pulse rounded-full mx-auto"></div>
                  <div className="w-12 h-3 bg-[#321A47] animate-pulse rounded mt-1 mx-auto"></div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-[#321A47] animate-pulse rounded-full mx-auto"></div>
                  <div className="w-12 h-3 bg-[#321A47] animate-pulse rounded mt-1 mx-auto"></div>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-[#321A47] animate-pulse rounded-full mx-auto"></div>
                  <div className="w-12 h-3 bg-[#321A47] animate-pulse rounded mt-1 mx-auto"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="w-16 h-4 bg-[#321A47] animate-pulse rounded ml-auto"></div>
                <div className="w-12 h-3 bg-[#321A47] animate-pulse rounded mt-1 ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Afficher un message d'erreur en cas d'échec
  if (error) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Classement Gitify</h2>
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-md text-red-400">
          Une erreur est survenue lors du chargement des données
        </div>
      </div>
    );
  }

  // Afficher les données
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6">Classement Gitify</h2>
      <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4">
        {data?.map((user) => (
          <div key={user.id} className="flex items-center gap-4 p-3 bg-[#241730] rounded-lg hover:bg-[#2A1A38] transition-colors">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                user.rank === 1
                  ? "bg-yellow-500"
                  : user.rank === 2
                  ? "bg-gray-400"
                  : user.rank === 3
                  ? "bg-amber-600"
                  : "bg-violet-500/20"
              }`}
            >
              {user.rank}
            </div>
            {/* Pour l'avatar, on utilise Next Image pour optimiser le chargement */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              <Image
                src={user.avatar}
                alt={user.name}
                className="object-cover"
                width={40}
                height={40}
                priority={user.rank <= 5}
              />
            </div>
            <div className="flex-1">
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-400">@{user.username}</div>
            </div>
            
            {/* Statistiques du contributeur en icônes */}
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600/20 text-violet-400">
                  <span>{user.streak}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">Streak</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400">
                  <span>{user.badges}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">Badges</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600/20 text-blue-400">
                  <span>{user.challenges}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">Défis</div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-violet-400 font-medium">{user.score} pts</div>
              <div className="text-xs text-gray-400">Score total</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard; 