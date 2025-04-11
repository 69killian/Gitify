"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Activity, GitCommit, GitPullRequest, GitMerge, Folder, RefreshCw } from 'lucide-react';
import GitHubCalendar from '../../Components/githubCalendar';
import profile from "../../Components/images/profile-test.jpg";
import LeftParticles from '../../Components/images/Group 194.svg';
import RightParticles from '../../Components/images/Group 191.svg';
import { useSession } from 'next-auth/react';
import useSWR, { mutate } from 'swr';

// Interfaces
interface Contribution {
  type: string;
  repository: string | null;
  message: string | null;
  date: string;
}

interface Repository {
  name: string | null;
  commits: number;
  stars: number;
}

// Fonctions utilitaires
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Formatage de la date relative (ex: "2h ago", "5d ago")
const formatRelativeTime = (date: string) => {
  const now = new Date();
  const contributionDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - contributionDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const StreakPage = () => {
  const { data: session } = useSession();
  const { data, error, isLoading } = useSWR('/api/contributions', fetcher);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Fonction pour synchroniser les contributions
  const syncGitHubContributions = async () => {
    if (syncing) return;
    
    setSyncing(true);
    setSyncMessage("Synchronisation en cours...");
    
    try {
      const response = await fetch('/api/sync-github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSyncMessage(`${result.message}`);
        // Rafraîchir les données après la synchronisation
        mutate('/api/contributions');
      } else {
        setSyncMessage(`Erreur: ${result.error}`);
      }
    } catch (error) {
      setSyncMessage("Une erreur est survenue lors de la synchronisation");
      console.error("Erreur de synchronisation:", error);
    } finally {
      // Réinitialiser l'état après 5 secondes
      setTimeout(() => {
        setSyncing(false);
        setSyncMessage(null);
      }, 5000);
    }
  };

  // Valeurs statiques pour l'affichage pendant le chargement des données
  const fallbackUser = {
    username: session?.user?.name || "DevUser",
    avatarUrl: session?.user?.image || profile,
    yearContribution: 0,
    totalCommits: 0,
    bestDay: "Samedi",
    challengesCompleted: 0,
    badgesUnlocked: 0,
    pullRequest: 0,
    Merges: 0,
    Repositories: 0,
  };

  // Récupération des données dynamiques une fois chargées
  const statsData = !isLoading && !error && data ? {
    totalCommits: data.totalCommits || 0,
    totalPullRequests: data.totalPullRequests || 0,
    totalMerges: data.totalMerges || 0,
    totalRepos: data.totalRepos || 0,
    lastContributions: data.lastContributions || [],
    topRepositories: data.topRepositories || []
  } : {
    totalCommits: fallbackUser.totalCommits,
    totalPullRequests: fallbackUser.pullRequest,
    totalMerges: fallbackUser.Merges,
    totalRepos: fallbackUser.Repositories,
    lastContributions: [],
    topRepositories: []
  };

  return (
    <section className="px-4 md:px-8">
      <div className="flex flex-col items-center gap-6 py-8">
        <button className="z-1 bg-[#160E1E] h-[200px] w-[200px] rounded-full border-2 border-violet-700 overflow-hidden relative flex items-center justify-center">
          <img
            src={String(session?.user?.image || fallbackUser.avatarUrl)}
            alt="User Avatar"
            width={200}
            height={200}
          />
        </button>
        <div>
          <h1 className="text-4xl font-bold flex items-center justify-center gradient">{session?.user?.name || fallbackUser.username}</h1>
          <p className="text-gray-400">Continue à contribuer et débloque des récompenses exclusives !</p>
        </div>
        
        {/* Bouton de synchronisation */}
        <div className="mt-2 flex flex-col items-center">
          <button
            onClick={syncGitHubContributions}
            disabled={syncing}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${syncing 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-violet-600 hover:bg-violet-700'}`}
          >
            <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Synchronisation...' : 'Synchroniser avec GitHub'}
          </button>
          {syncMessage && (
            <p className={`mt-2 text-sm ${syncMessage.includes('Erreur') ? 'text-red-400' : 'text-green-400'}`}>
              {syncMessage}
            </p>
          )}
        </div>
      </div>

      {/* Affichage des statistiques */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <StatCard icon={<Activity size={40} />} title="Total de Commits" value={0} isLoading={true} />
          <StatCard icon={<GitPullRequest size={40} />} title="Pull requests" value={0} isLoading={true} />
          <StatCard icon={<GitMerge size={40} />} title="Merges" value={0} isLoading={true} />
          <StatCard icon={<Folder size={40} />} title="Repositories" value={0} isLoading={true} />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4 bg-red-100/10 rounded-lg">
          Erreur lors du chargement des données. Veuillez réessayer.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <StatCard icon={<Activity size={40} />} title="Total de Commits" value={statsData.totalCommits} />
          <StatCard icon={<GitPullRequest size={40} />} title="Pull requests" value={statsData.totalPullRequests} />
          <StatCard icon={<GitMerge size={40} />} title="Merges" value={statsData.totalMerges} />
          <StatCard icon={<Folder size={40} />} title="Repositories" value={statsData.totalRepos} />
        </div>
      )}

      {/* GitHub Calendar */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Tes contributions récentes</h2>
        <GitHubCalendar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {/* Carte Dernières Contributions */}
        <div className="relative z-10 py-3 px-6 bg-[#1B1B1B] text-center transition-colors duration-300 rounded-[8px] shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-full h-auto rounded-[6px] border border-[#292929] text-[16px] flex flex-col justify-start items-start gap-4 p-4">
          <h2 className="text-xl font-semibold">Dernières contributions</h2>
          <div className="space-y-4 w-full">
            {isLoading ? (
              <div className="text-center w-full p-4 text-gray-400">Chargement des contributions...</div>
            ) : error ? (
              <div className="text-center w-full p-4 text-red-400">Impossible de charger les contributions</div>
            ) : statsData.lastContributions.length === 0 ? (
              <div className="text-center w-full p-4 text-gray-400">Aucune contribution récente</div>
            ) : (
              statsData.lastContributions.map((contribution: Contribution, index: number) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    contribution.type === 'commit' 
                      ? 'bg-violet-500/20' 
                      : contribution.type === 'pr'
                      ? 'bg-green-500/20'
                      : 'bg-blue-500/20'
                  }`}>
                    {contribution.type === 'commit' && <GitCommit className="w-4 h-4" />}
                    {contribution.type === 'pr' && <GitPullRequest className="w-4 h-4" />}
                    {contribution.type === 'merge' && <GitMerge className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{contribution.repository || 'Unknown'}</div>
                    <div className="text-sm text-gray-400">{contribution.message || 'No message'}</div>
                    <div className="text-xs text-gray-500">{formatRelativeTime(contribution.date)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Carte Top Repositories */}
        <div className="relative z-10 py-3 px-6 bg-[#1B1B1B] text-center transition-colors duration-300 rounded-[8px] shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-full h-auto rounded-[6px] border border-[#292929] text-[16px] flex flex-col justify-start items-start gap-4 p-4">
          <h2 className="text-xl font-semibold">Top repositories</h2>
          <div className="space-y-4 w-full">
            {isLoading ? (
              <div className="text-center w-full p-4 text-gray-400">Chargement des repositories...</div>
            ) : error ? (
              <div className="text-center w-full p-4 text-red-400">Impossible de charger les repositories</div>
            ) : statsData.topRepositories.length === 0 ? (
              <div className="text-center w-full p-4 text-gray-400">Aucun repository trouvé</div>
            ) : (
              statsData.topRepositories.map((repo: Repository) => (
                <div key={repo.name} className="flex items-center justify-between w-full">
                  <div>
                    <div className="text-sm font-medium">{repo.name}</div>
                    <div className="text-xs text-gray-400">{repo.commits} commits</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm">{repo.stars}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 gap-5 text-center items-center flex flex-col mb-10">
        <h2 className="text-2xl font-semibold">Passe à la version <span className="gradient">Pro</span></h2>
        <p className="text-gray-400">Débloque des fonctionnalités avancées et améliore ton suivi de progression.</p>
        <button className="relative z-10 py-3 px-6 bg-[#1B1B1B] hover:bg-[#160E1E] text-center transition-colors duration-300 rounded-[8px] p-1 shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-[280px] h-[52px] rounded-[6px] border border-[#292929] text-[16px] flex justify-center items-center">
          <Image src={LeftParticles} alt="Left Particles" className="absolute left-0" />
          <Link href="https://gitify.framer.website/" target="_blank">
            Upgrade to <span className="gradient">Pro</span>
          </Link>
          <Image src={RightParticles} alt="Right Particles" className="absolute right-0" />
        </button>
      </div>
    </section>
  );
};

// Composant StatCard amélioré avec état de chargement
const StatCard = ({ 
  icon, 
  title, 
  value, 
  isLoading = false 
}: { 
  icon: React.ReactElement; 
  title: string; 
  value: number;
  isLoading?: boolean;
}) => {
  return (
    <div className="relative z-10 py-3 px-6 bg-[#1B1B1B] text-center transition-colors duration-300 rounded-[8px] p-1 shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-full h-[92px] rounded-[6px] border border-[#292929] text-[16px] flex justify-center items-center gap-4 p-4">
      <div className="text-violet-500">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className={`text-2xl font-bold ${isLoading ? 'text-gray-600' : 'gradient'}`}>
          {isLoading ? "..." : value}
        </p>
      </div>
    </div>
  );
};

export default StreakPage;
