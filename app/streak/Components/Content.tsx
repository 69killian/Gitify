"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, Medal, Activity, CalendarDays } from 'lucide-react';
import GitHubCalendar from '../../Components/githubCalendar';
import profile from "../../Components/images/profile-test.jpg";
import LeftParticles from '../../Components/images/Group 194.svg';
import RightParticles from '../../Components/images/Group 191.svg';

const StreakPage = () => {
  const user = {
    username: "DevUser",
    avatarUrl: profile,
    streakDays: 4805,
    recordStreak: 365,
    totalCommits: 10234,
    bestDay: "Samedi",
    challengesCompleted: 36,
    badgesUnlocked: 26,
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
          <p className="text-gray-400">Continue ta streak et débloque des récompenses exclusives !</p>
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <StatCard icon={<Flame size={40} />} title="Streak Actuelle" value={user.streakDays} />
        <StatCard icon={<CalendarDays size={40} />} title="Record de Streak" value={user.recordStreak} />
        <StatCard icon={<Activity size={40} />} title="Total de Commits" value={user.totalCommits} />
        <StatCard icon={<Medal size={40} />} title="Badges Débloqués" value={user.badgesUnlocked} />
      </div>

      {/* GitHub Calendar HIDDEN AND STATIC */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Tes contributions récentes</h2>
        <GitHubCalendar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
  {/* Carte Objectifs */}
  <div className="relative z-10 py-3 px-6 bg-[#1B1B1B] text-center transition-colors duration-300 rounded-[8px] shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-full h-auto rounded-[6px] border border-[#292929] text-[16px] flex flex-col justify-start items-start gap-4 p-4">
    <h2 className="text-xl font-semibold">Prochains objectifs</h2>
    <div className="space-y-4 w-full">
      {[
        { name: 'Streak de 5 jours', progress: 80 },
        { name: 'Streak de 10 jours', progress: 50 },
        { name: 'Streak de 30 jours', progress: 20 },
      ].map((goal) => (
        <div key={goal.name} className="w-full">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-400">{goal.name}</span>
            <span className="text-violet-400">{goal.progress}%</span>
          </div>
          <div className="h-2 bg-violet-900/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-violet-500 rounded-full"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Carte Historique */}
  <div className="relative z-10 py-3 px-6 bg-[#1B1B1B] text-center transition-colors duration-300 rounded-[8px] shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-full h-auto rounded-[6px] border border-[#292929] text-[16px] flex flex-col justify-start items-start gap-4 p-4">
    <h2 className="text-xl font-semibold">Historique des streaks</h2>
    <div className="space-y-4 w-full">
      {[
        { date: '2024-03-15', days: 365, status: 'En cours' },
        { date: '2023-12-31', days: 180, status: 'Terminé' },
        { date: '2023-06-15', days: 90, status: 'Terminé' },
      ].map((streak) => (
        <div key={streak.date} className="flex items-center justify-between w-full">
          <div className="text-left">
            <div className="text-sm">{streak.date}</div>
            <div className="text-sm text-gray-400">{streak.days} jours</div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs ${
            streak.status === 'En cours' 
              ? 'bg-violet-500/20 text-violet-400' 
              : 'bg-gray-500/20 text-gray-400'
          }`}>
            {streak.status}
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
