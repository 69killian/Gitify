"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Flame, Medal, Activity, CalendarDays } from 'lucide-react';
import FakeGitHubCalendar from './fakecalendar';
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

      {/* GitHub Calendar HIDDEN AND STATIC */}
      <div className="mt-6 hidden">
        <h2 className="text-2xl font-semibold mb-4">Tes contributions récentes</h2>
        <FakeGitHubCalendar />
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        <StatCard icon={<Flame size={40} />} title="Jours de Streak" value={user.streakDays} />
        <StatCard icon={<CalendarDays size={40} />} title="Record de Streak" value={user.recordStreak} />
        <StatCard icon={<Activity size={40} />} title="Total de Commits" value={user.totalCommits} />
        <StatCard icon={<Medal size={40} />} title="Badges Débloqués" value={user.badgesUnlocked} />
      </div>

      {/* Call to Action */}
      <div className="mt-12 gap-5 text-center items-center flex flex-col">
        <h2 className="text-2xl font-semibold">Passe à la version <span className="gradient">Pro</span></h2>
        <p className="text-gray-400">Débloque des fonctionnalités avancées et améliore ton suivi de progression.</p>
          <button className="bg-[#1B1B1B] hover:bg-[#121212] transition-all duration-200 w-[186px] h-[32px] rounded-[6px] border border-1 border-[#292929] text-[12px] relative flex justify-center items-center">
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
    <div className="flex items-center gap-4 p-4 bg-[#1B1B1B] rounded-lg border border-[#292929] shadow-lg">
      <div className="text-violet-500">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold gradient">{value}</p>
      </div>
    </div>
  );
};


export default StreakPage;
