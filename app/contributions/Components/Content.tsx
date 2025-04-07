"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Activity, CalendarDays, GitCommit, GitPullRequest, GitMerge } from 'lucide-react';
import FakeGitHubCalendar from './fakecalendar';
import profile from "../../Components/images/profile-test.jpg";
import LeftParticles from '../../Components/images/Group 194.svg';
import RightParticles from '../../Components/images/Group 191.svg';

const StreakPage = () => {
  const user = {
    username: "DevUser",
    avatarUrl: profile,
    yearContribution: 2025,
    totalCommits: 1.234,
    bestDay: "Samedi",
    challengesCompleted: 36,
    badgesUnlocked: 26,
    pullRequest: 156,
    Merges: 89,
    Repositories: 56,
  };

  return (
    <section className="px-4 md:px-8">
      <div className="flex flex-col items-center gap-6 py-8">
      <button className="z-1 bg-[#160E1E] h-[200px] w-[200px] rounded-full border-2 border-violet-700 overflow-hidden relative flex items-center justify-center">
        <Image
          src={user.avatarUrl}
          alt="User Avatar"
        />
      </button>
        <div>
          <h1 className="text-4xl font-bold flex items-center justify-center gradient">{user.username}</h1>
          <p className="text-gray-400">Continue à contribuer et débloque des récompenses exclusives !</p>
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <StatCard icon={<Activity size={40} />} title="Total de Commits" value={user.totalCommits} />
        <StatCard icon={<CalendarDays size={40} />} title="Pull requests" value={user.pullRequest} />
        <StatCard icon={<CalendarDays size={40} />} title="Merges" value={user.Merges} />
        <StatCard icon={<CalendarDays size={40} />} title="Repositories" value={user.pullRequest} />
      </div>

      {/* GitHub Calendar */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Tes contributions récentes</h2>
        <FakeGitHubCalendar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
  {/* Carte Contributions */}
  <div className="relative z-10 py-3 px-6 bg-[#1B1B1B] text-center transition-colors duration-300 rounded-[8px] shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-full h-auto rounded-[6px] border border-[#292929] text-[16px] flex flex-col justify-start items-start gap-4 p-4">
    <h2 className="text-xl font-semibold">Dernières contributions</h2>
    <div className="space-y-4 w-full">
      {[
        { repo: 'org/project-1', type: 'commit', message: 'Fix navigation bug', date: '2h ago' },
        { repo: 'org/project-2', type: 'pr', message: 'Add new feature', date: '5h ago' },
        { repo: 'org/project-3', type: 'merge', message: 'Merge develop into main', date: '1d ago' },
      ].map((contribution, index) => (
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
            <div className="text-sm font-medium">{contribution.repo}</div>
            <div className="text-sm text-gray-400">{contribution.message}</div>
            <div className="text-xs text-gray-500">{contribution.date}</div>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Carte Repositories */}
  <div className="relative z-10 py-3 px-6 bg-[#1B1B1B] text-center transition-colors duration-300 rounded-[8px] shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-full h-auto rounded-[6px] border border-[#292929] text-[16px] flex flex-col justify-start items-start gap-4 p-4">
    <h2 className="text-xl font-semibold">Top repositories</h2>
    <div className="space-y-4 w-full">
      {[
        { name: 'project-1', commits: 234, stars: 45 },
        { name: 'project-2', commits: 189, stars: 32 },
        { name: 'project-3', commits: 156, stars: 28 },
      ].map((repo) => (
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
      ))}
    </div>
  </div>
</div>


      {/* Call to Action */}
      <div className="mt-12 gap-5 text-center items-center flex flex-col mb-10">
        <h2 className="text-2xl font-semibold">Passe à la version <span className="gradient">Pro</span></h2>
        <p className="text-gray-400">Débloque des fonctionnalités avancées et améliore ton suivi de progression.</p>
          <button className="relative z-10 py-3 px-6 bg-[#1B1B1B] hover:bg-[#160E1E]  text-center transition-colors duration-300 rounded-[8px] p-1 shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-[280px] h-[52px] rounded-[6px] border border-[#292929] text-[16px] flex justify-center items-center">
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

const StatCard = ({ icon, title, value }: { icon: JSX.Element; title: string; value: number }) => {
  return (
    <div className="relative z-10 py-3 px-6 bg-[#1B1B1B]  text-center transition-colors duration-300 rounded-[8px] p-1 shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-full h-[92px] rounded-[6px] border border-[#292929] text-[16px] flex justify-center items-center gap-4 p-4">
      <div className="text-violet-500">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold gradient">{value}</p>
      </div>
    </div>
  );
};


export default StreakPage;
