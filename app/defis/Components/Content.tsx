"use client";
import Breadcrumb from "../../Components/breadcrumb";
import { Trophy, Star, Award, Timer } from "lucide-react";

const challenge = [
  { id: 1, title: "Streak Newbie", badge:"🔥", description: "Atteins 3 jours de streak.", reward: "🔥 Badge Streak Newbie" },
  { id: 2, title: "Streak Enthusiast", badge:"🔥🔥", description: "Atteins 7 jours de streak.", reward: "🔥🔥 Badge Streak Enthusiast" },
  { id: 3, title: "Streak Warrior", badge:"⚔️🔥", description: "Atteins 15 jours de streak.", reward: "⚔️🔥 Badge Streak Warrior" },
  { id: 4, title: "Streak Master", badge:"🏅🔥", description: "Atteins 30 jours de streak.", reward: "🏅🔥 Badge Streak Master" },
  { id: 5, title: "Streak God", badge:"🏆🔥", description: "Atteins 100 jours de streak.", reward: "🏆🔥 Badge Streak God" },
  { id: 6, title: "First Commit", badge:"✅", description: "Réalise ton premier commit.", reward: "✅ Badge First Commit" },
  { id: 7, title: "Contributor", badge:"📝", description: "Fais 10 commits.", reward: "📝 Badge Contributor" },
  { id: 8, title: "Code Machine", badge:"💻", description: "Atteins 100 commits.", reward: "💻 Badge Code Machine" },
  { id: 9, title: "Code Addict", badge:"🚀", description: "Atteins 500 commits.", reward: "🚀 Badge Code Addict" },
  { id: 10, title: "Code Legend", badge:"🏅", description: "Atteins 1000 commits.", reward: "🏅 Badge Code Legend" },
  { id: 11, title: "First PR", badge:"🔄", description: "Soumets ta première PR.", reward: "🔄 Badge First PR" },
  { id: 12, title: "Merge Master", badge:"🔥🔄", description: "Fais fusionner 5 PRs.", reward: "🔥🔄 Badge Merge Master" },
  { id: 13, title: "PR Hero", badge:"🦸", description: "Fais fusionner 10 PRs.", reward: "🦸 Badge PR Hero" },
  { id: 14, title: "Open Source Champion", badge:"🏆", description: "Fais fusionner 20 PRs.", reward: "🏆 Badge Open Source Champion" },
  { id: 15, title: "Public Repo", badge:"🌍", description: "Crée ton premier repo public.", reward: "🌍 Badge Public Repo" },
  { id: 16, title: "Open Source Addict", badge:"💾", description: "Publie 3 repos publics.", reward: "💾 Badge Open Source Addict" },
  { id: 17, title: "OSS Rockstar", badge:"🎸", description: "Publie 10 repos publics.", reward: "🎸 Badge OSS Rockstar" },
  { id: 18, title: "Weekly Challenge", badge:"🏁", description: "Complète un challenge.", reward: "🏁 Badge Weekly Challenge" },
  { id: 19, title: "Challenge Grinder", badge:"💪", description: "Complète 5 challenges.", reward: "💪 Badge Challenge Grinder" },
  { id: 20, title: "Challenge King", badge:"👑", description: "Complète 10 challenges.", reward: "👑 Badge Challenge King" },
  { id: 21, title: "Night Coder", badge:"🌙", description: "Code entre 2h et 4h du matin.", reward: "🌙 Badge Night Coder" },
  { id: 22, title: "Weekend Warrior", badge:"🏖️",  description: "Code un samedi et dimanche.", reward: "🏖️ Badge Weekend Warrior" },
  { id: 23, title: "One Day Madness", badge:"💥", description: "Fais 100 commits en 24h.", reward: "💥 Badge One Day Madness" },
  { id: 24, title: "Forking Pro", badge:"🍴", description: "Réalise 10 forks.", reward: "🍴 Badge Forking Pro" }
];

const user = {
  username: "DevUser",
  yearContribution: 2025,
  totalCommits: 1.234,
  bestDay: "Samedi",
  challengesCompleted: 36,
  badgesUnlocked: 26,
  pullRequest: 156,
  Badges: 12,
  Repositories: 56,
  challengeInProcess: 5,
};


const Content = () => {

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


      
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        <StatCard icon={<Trophy size={40} />} title="Défis complétés" value={user.challengesCompleted} />
        <StatCard icon={<Star size={40} />} title="Défis en cours" value={user.challengeInProcess} />
        <StatCard icon={<Award size={40} />} title="Badges gagnés" value={user.Badges} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-10">
        <div className="space-y-6  bg-[#241730] rounded-sm border border-[#292929] p-10">
          <h2 className="text-2xl font-semibold">Challenges actifs</h2>
          {[
            {
              title: "Sprint de la semaine",
              description: "Réalisez 20 commits en 7 jours",
              progress: 75,
              timeLeft: "3 jours",
              reward: "Badge Sprint Master"
            },
            {
              title: "Contributeur du mois",
              description: "Maintenez un streak de 30 jours",
              progress: 60,
              timeLeft: "15 jours",
              reward: "Badge Streak Legend"
            },
            {
              title: "PR Champion",
              description: "Créez 5 pull requests",
              progress: 40,
              timeLeft: "5 jours",
              reward: "Badge PR Hero"
            }
          ].map((challenge) => (
            <div key={challenge.title} className="card">
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
          ))}
        </div>

        <div className="space-y-6  bg-[#241730] rounded-sm border border-[#292929] p-10">
          <h2 className="text-2xl font-semibold">Challenges disponibles</h2>
          {[
            {
              title: "Explorateur Open Source",
              description: "Contribuez à 3 nouveaux projets",
              difficulty: "Facile",
              reward: "Badge Explorer",
              duration: "7 jours"
            },
            {
              title: "Code Review Master",
              description: "Reviewez 10 pull requests",
              difficulty: "Moyen",
              reward: "Badge Reviewer",
              duration: "14 jours"
            },
            {
              title: "Bug Hunter",
              description: "Résolvez 5 issues marquées 'bug'",
              difficulty: "Difficile",
              reward: "Badge Debug Hero",
              duration: "30 jours"
            }
          ].map((challenge) => (
            <div key={challenge.title} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{challenge.title}</h3>
                  <p className="text-gray-400 text-sm">{challenge.description}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  challenge.difficulty === 'Facile'
                    ? 'bg-green-500/20 text-green-400'
                    : challenge.difficulty === 'Moyen'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {challenge.difficulty}
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-400">
                  Durée: {challenge.duration}
                </div>
                <button className="text-[12.49px] mb-10 text-white cursor-pointer bg-violet-800 hover:bg-violet-600 transition-all duration-200 w-[200px] h-[42px] border border-1 border-violet-500 text-[12px] flex justify-center items-center">
                   Commencer le Challenge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ icon, title, value }: { icon: JSX.Element; title: string; value: number }) => {
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