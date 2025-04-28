"use client";
import { useState } from "react";
import useSWR from "swr";
import Breadcrumb from "../../Components/breadcrumb";
import { Trophy, Star, Award, Timer, ChevronRight, ChevronLeft, CheckCircle, X } from "lucide-react";
import SkeletonLoader from '../../../components/ui/skeletonLoader';

// Définition des types
type ChallengeDifficulty = "Facile" | "Moyenne" | "Difficile" | "Extrême";

interface ChallengeBase {
  id: number;
  title: string;
  description: string;
  badge: string;
  reward: string;
}

interface AvailableChallenge extends ChallengeBase {
  difficulty: ChallengeDifficulty;
  duration: string;
}

interface InProgressChallenge extends ChallengeBase {
  progress: number;
  timeLeft: string;
  startDate: string;
  challengeId: number;
}

interface CompletedChallenge extends ChallengeBase {
  completedDate: string | null;
  challengeId: number;
}

interface ChallengesData {
  available: AvailableChallenge[];
  inProgress: InProgressChallenge[];
  completed: CompletedChallenge[];
  stats: {
    completedCount: number;
    inProgressCount: number;
    badgesEarned: number;
  };
}

// Fonction pour récupérer les données via l'API
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Une erreur est survenue lors de la récupération des défis");
  }
  return res.json();
};

const Content = () => {
  // État pour la pagination des défis disponibles
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  
  // État pour gérer les défis en cours de démarrage (pour l'UX)
  const [startingChallengeId, setStartingChallengeId] = useState<number | null>(null);
  
  // État pour les messages de notification
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // État pour le modal de confirmation
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<AvailableChallenge | null>(null);

  // Récupération des données avec SWR
  const { data, error, isLoading, mutate } = useSWR<ChallengesData>("/api/challenges", fetcher);

  // Calcul des index pour la pagination des défis disponibles
  const totalAvailableChallenges = data?.available?.length || 0;
  const totalPages = Math.ceil(totalAvailableChallenges / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalAvailableChallenges);
  
  // Pagination : page suivante
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Pagination : page précédente
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Fonction pour ouvrir le modal de confirmation
  const openConfirmModal = (challenge: AvailableChallenge) => {
    setSelectedChallenge(challenge);
    setModalOpen(true);
  };
  
  // Fonction pour fermer le modal de confirmation
  const closeConfirmModal = () => {
    setModalOpen(false);
    setSelectedChallenge(null);
  };

  // Fonction pour démarrer un défi
  const startChallenge = async (challengeId: number) => {
    try {
      closeConfirmModal();
      setStartingChallengeId(challengeId);
      
      const response = await fetch('/api/challenges/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ challengeId }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Erreur lors du démarrage du défi");
      }
      
      // Afficher une notification de succès
      setNotification({
        message: "Défi démarré avec succès !",
        type: 'success'
      });
      
      // Rafraîchir les données
      await mutate();
      
      // Si le nombre total de défis disponibles est égal à itemsPerPage,
      // et qu'on démarre le dernier défi de la page, retourner à la page précédente
      if (data?.available.length === itemsPerPage && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
      
    } catch (error) {
      console.error("Erreur:", error);
      setNotification({
        message: error instanceof Error ? error.message : "Erreur lors du démarrage du défi",
        type: 'error'
      });
    } finally {
      setStartingChallengeId(null);
      
      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  // Défis à afficher pour la page courante
  const currentChallenges = data?.available?.slice(startIndex, endIndex) || [];

  // Rendu du composant pendant le chargement
  if (isLoading) {
    return (
      <section className="px-4 md:px-8">
        <Breadcrumb pagename="Démarrer un défi" />
        <div className="mt-10 flex flex-col items-center">
          <h1 className="text-[60px] font-poppins drop-shadow-lg" style={{ fontFamily: "poppins, sans-serif" }}>
            <span className="gradient-gold">Choisis ton Défi</span> 🎯
          </h1>
          <p className="text-gray-400 mt-2 text-center">
            Relevez des défis quotidiens et hebdomadaires pour gagner des récompenses exclusives.
          </p>
        </div>

        {/* Skeleton pour les statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <SkeletonLoader variant="stat" />
          <SkeletonLoader variant="stat" />
          <SkeletonLoader variant="stat" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-10">
          {/* Skeleton pour les défis en cours */}
          <div className="space-y-6 bg-[#241730] rounded-sm border border-[#292929] p-10">
            <h2 className="text-2xl font-semibold">Challenges actifs</h2>
            
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <SkeletonLoader variant="text" width="180px" height="20px" />
                    <SkeletonLoader variant="text" width="280px" height="16px" />
                  </div>
                  <SkeletonLoader variant="text" width="100px" height="18px" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <SkeletonLoader variant="text" width="100px" height="14px" />
                    <SkeletonLoader variant="text" width="40px" height="14px" />
                  </div>
                  <div className="h-2 bg-violet-900/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#321A47] animate-pulse rounded-full" style={{ width: `${50 + index * 20}%` }} />
                  </div>
                </div>
                <div className="mt-4">
                  <SkeletonLoader variant="text" width="200px" height="14px" />
                </div>
              </div>
            ))}
          </div>

          {/* Skeleton pour les défis complétés */}
          <div className="space-y-6 bg-[#241730] rounded-sm border border-[#292929] p-10">
            <h2 className="text-2xl font-semibold">Challenges complétés</h2>
            
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <SkeletonLoader variant="text" width="180px" height="20px" />
                    <SkeletonLoader variant="text" width="280px" height="16px" />
                  </div>
                  <SkeletonLoader variant="text" width="30px" height="30px" />
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <SkeletonLoader variant="text" width="180px" height="14px" />
                  <SkeletonLoader variant="text" width="100px" height="14px" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton pour les défis disponibles */}
        <div className="space-y-6 bg-[#241730] rounded-sm border border-[#292929] p-10 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Challenges disponibles</h2>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#321A47] animate-pulse rounded-full"></div>
              <SkeletonLoader variant="text" width="60px" height="16px" />
              <div className="w-8 h-8 bg-[#321A47] animate-pulse rounded-full"></div>
            </div>
          </div>
          
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <SkeletonLoader variant="text" width="30px" height="30px" />
                    <SkeletonLoader variant="text" width="180px" height="20px" />
                  </div>
                  <SkeletonLoader variant="text" width="280px" height="16px" />
                </div>
                <SkeletonLoader variant="text" width="70px" height="24px" />
              </div>
              <div className="flex justify-between items-center mt-4">
                <SkeletonLoader variant="text" width="120px" height="16px" />
                <div className="w-[200px] h-[42px] bg-[#321A47] animate-pulse rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Rendu du composant en cas d'erreur
  if (error) {
    return (
      <section className="px-4 md:px-8">
        <Breadcrumb pagename="Démarrer un défi" />
        <div className="mt-10 flex flex-col items-center">
          <h1 className="text-[60px] font-poppins drop-shadow-lg" style={{ fontFamily: "poppins, sans-serif" }}>
            <span className="gradient-gold">Choisis ton Défi</span> 🎯
          </h1>
          <div className="mt-10 p-6 bg-red-900/20 text-red-400 rounded-md">
            <p>Une erreur est survenue lors du chargement des défis.</p>
            <p className="text-sm mt-2">Veuillez réessayer ultérieurement.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-8">
      <Breadcrumb pagename="Démarrer un défi" />
      
      <div className="mt-10 flex flex-col items-center">
        <h1 className="text-[60px] font-poppins drop-shadow-lg" style={{ fontFamily: "poppins, sans-serif" }}>
          <span className="gradient-gold">Choisis ton Défi</span> 🎯
        </h1>
        <p className="text-gray-400 mt-2 text-center">
          Relevez des défis quotidiens et hebdomadaires pour gagner des récompenses exclusives.
        </p>
      </div>
      
      {/* Modal de confirmation */}
      {modalOpen && selectedChallenge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#160E1E] border border-[#292929] rounded-md max-w-md w-full p-6 relative animate-fadeIn">
            <button 
              onClick={closeConfirmModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <span className="text-2xl">{selectedChallenge.badge}</span>
              {selectedChallenge.title}
            </h3>
            
            <p className="text-gray-400 mb-4">{selectedChallenge.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Difficulté</p>
                <div className={`mt-1 inline-block px-2 py-1 rounded-full text-xs ${
                  selectedChallenge.difficulty === 'Facile'
                    ? 'bg-green-500/20 text-green-400'
                    : selectedChallenge.difficulty === 'Moyenne'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : selectedChallenge.difficulty === 'Difficile'
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {selectedChallenge.difficulty}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Durée</p>
                <p className="mt-1 text-sm text-gray-300">{selectedChallenge.duration}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500">Récompense</p>
              <p className="mt-1 text-violet-400">{selectedChallenge.reward}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button 
                onClick={closeConfirmModal}
                className="text-gray-300 border border-gray-700 py-2 px-4 rounded-md hover:bg-gray-800"
              >
                Annuler
              </button>
              <button 
                onClick={() => startChallenge(selectedChallenge.id)}
                className="bg-violet-700 text-white py-2 px-4 rounded-md hover:bg-violet-600"
              >
                Commencer le défi
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg animate-fadeIn z-50 ${
          notification.type === 'success' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
        }`}>
          {notification.message}
        </div>
      )}
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <StatCard 
          icon={<Trophy size={40} />} 
          title="Défis complétés" 
          value={data?.stats.completedCount || 0} 
        />
        <StatCard 
          icon={<Star size={40} />} 
          title="Défis en cours" 
          value={data?.stats.inProgressCount || 0} 
        />
        <StatCard 
          icon={<Award size={40} />} 
          title="Badges gagnés" 
          value={data?.stats.badgesEarned || 0} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-10">
        {/* Défis en cours */}
        <div className="space-y-6 bg-[#241730] rounded-sm border border-[#292929] p-10">
          <h2 className="text-2xl font-semibold">Challenges actifs</h2>
          
          {data?.inProgress && data.inProgress.length > 0 ? (
            data.inProgress.map((challenge) => (
              <div key={challenge.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{challenge.title}</h3>
                    <p className="text-gray-400 text-sm">{challenge.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-violet-400">
                    <Timer className="w-4 h-4" />
                    {challenge.timeLeft}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progression</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <div className="h-2 bg-violet-900/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-500 rounded-full"
                      style={{ width: `${challenge.progress}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                  Récompense: {challenge.reward}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400">
              <p>Vous n&apos;avez pas de défis en cours.</p>
              <p className="text-sm mt-2">Commencez un nouveau défi ci-dessous !</p>
            </div>
          )}
        </div>

        {/* Défis complétés */}
        <div className="space-y-6 bg-[#241730] rounded-sm border border-[#292929] p-10">
          <h2 className="text-2xl font-semibold">Challenges complétés</h2>
          
          {data?.completed && data.completed.length > 0 ? (
            data.completed.map((challenge) => (
              <div key={challenge.id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{challenge.title}</h3>
                    <p className="text-gray-400 text-sm">{challenge.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-400">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    Récompense: {challenge.reward}
                  </div>
                  <div className="text-sm text-gray-400">
                    {challenge.completedDate ? new Date(challenge.completedDate).toLocaleDateString() : "Complété"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-400">
              <p>Vous n&apos;avez pas encore complété de défis.</p>
              <p className="text-sm mt-2">Commencez dès maintenant !</p>
            </div>
          )}
        </div>
      </div>

      {/* Défis disponibles avec pagination */}
      <div className="space-y-6 bg-[#241730] rounded-sm border border-[#292929] p-10 mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Challenges disponibles</h2>
          {totalAvailableChallenges > itemsPerPage && (
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`p-2 rounded-full ${currentPage === 0 ? 'text-gray-600' : 'text-violet-400 hover:bg-violet-900/20'}`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-400">
                Page {currentPage + 1} / {totalPages}
              </span>
              <button 
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                className={`p-2 rounded-full ${currentPage >= totalPages - 1 ? 'text-gray-600' : 'text-violet-400 hover:bg-violet-900/20'}`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        {currentChallenges.length > 0 ? (
          currentChallenges.map((challenge) => (
            <div key={challenge.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{challenge.badge}</span>
                    <h3 className="text-lg font-semibold">{challenge.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm">{challenge.description}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  challenge.difficulty === 'Facile'
                    ? 'bg-green-500/20 text-green-400'
                    : challenge.difficulty === 'Moyenne'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : challenge.difficulty === 'Difficile'
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {challenge.difficulty}
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-400">
                  Durée: {challenge.duration}
                </div>
                <button 
                  onClick={() => openConfirmModal(challenge)}
                  disabled={startingChallengeId === challenge.id}
                  className="text-[12.49px] text-white cursor-pointer bg-violet-800 hover:bg-violet-600 transition-all duration-200 w-[200px] h-[42px] border border-1 border-violet-500 text-[12px] flex justify-center items-center"
                >
                  {startingChallengeId === challenge.id ? (
                    <>
                      <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                      Démarrage...
                    </>
                  ) : (
                    'Commencer le Challenge'
                  )}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-400">
            <p>Aucun défi disponible pour le moment.</p>
            <p className="text-sm mt-2">Revenez bientôt pour découvrir de nouveaux défis !</p>
          </div>
        )}
        
        {/* Bouton de pagination pour mobile */}
        {totalAvailableChallenges > itemsPerPage && (
          <div className="flex justify-center mt-6 lg:hidden">
            <button 
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className={`p-2 rounded-md border ${currentPage === 0 ? 'border-gray-700 text-gray-600' : 'border-violet-500 text-violet-400'} mr-2`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              className={`p-2 rounded-md border ${currentPage >= totalPages - 1 ? 'border-gray-700 text-gray-600' : 'border-violet-500 text-violet-400'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// Composant StatCard typé correctement
const StatCard = ({ icon, title, value }: { icon: React.ReactNode; title: string; value: number }) => {
  return (
    <div className="relative z-10 py-3 px-6 bg-[#241730] rounded-sm border border-[#292929] transition-colors duration-300 shadow-md w-full h-[92px] rounded-[6px] flex items-center gap-4 p-4">
      <div className="text-violet-500">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold gradient">{value}</p>
      </div>
    </div>
  );
};

export default Content;