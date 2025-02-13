"use client"
import React from 'react';

const Tables = () => {
  const badges = [
    // Streaks
    { id: 1, badge: "Streak Newbie", description: "Premier streak atteint", condition: "3 jours de streak", icon: "🔥", category: "🔥 Streaks" },
    { id: 2, badge: "Streak Enthusiast", description: "Tu commences à être sérieux", condition: "7 jours de streak", icon: "🔥🔥", category: "🔥 Streaks" },
    { id: 3, badge: "Streak Warrior", description: "La régularité paie !", condition: "15 jours de streak", icon: "⚔️🔥", category: "🔥 Streaks" },
    { id: 4, badge: "Streak Master", description: "Tu es un vrai grinder", condition: "30 jours de streak", icon: "🏅🔥", category: "🔥 Streaks" },
    { id: 5, badge: "Streak God", description: "Plus déterminé que jamais", condition: "100 jours de streak", icon: "🏆🔥", category: "🔥 Streaks" },
    // Contributions
    { id: 6, badge: "First Commit", description: "Premier commit enregistré", condition: "1 commit", icon: "✅", category: "🚀 Contributions" },
    { id: 7, badge: "Contributor", description: "Un bon début", condition: "10 commits", icon: "📝", category: "🚀 Contributions" },
    { id: 8, badge: "Code Machine", description: "Tu carbures !", condition: "100 commits", icon: "💻", category: "🚀 Contributions" },
    { id: 9, badge: "Code Addict", description: "Impossible de t’arrêter", condition: "500 commits", icon: "🚀", category: "🚀 Contributions" },
    { id: 10, badge: "Code Legend", description: "Inarrêtable.", condition: "1000 commits", icon: "🏅", category: "🚀 Contributions" },
    // Pull Requests
    { id: 11, badge: "First PR", description: "Première pull request soumise", condition: "1 PR", icon: "🔄", category: "🔁 Pull Requests" },
    { id: 12, badge: "Merge Master", description: "Les PRs, c’est ton truc", condition: "5 PRs fusionnées", icon: "🔥🔄", category: "🔁 Pull Requests" },
    { id: 13, badge: "PR Hero", description: "Tu rends GitHub meilleur", condition: "10 PRs fusionnées", icon: "🦸", category: "🔁 Pull Requests" },
    { id: 14, badge: "Open Source Champion", description: "Tes PRs aident la communauté", condition: "20 PRs fusionnées", icon: "🏆", category: "🔁 Pull Requests" },
    // Open Source
    { id: 15, badge: "Public Repo", description: "Premier repo public créé", condition: "1 repo public", icon: "🌍", category: "🌍 Open Source" },
    { id: 16, badge: "Open Source Addict", description: "Tes projets aident le monde", condition: "3 repos publics", icon: "💾", category: "🌍 Open Source" },
    { id: 17, badge: "OSS Rockstar", description: "Contribution massive au code open source", condition: "10 repos publics", icon: "🎸", category: "🌍 Open Source" },
    // Challenges
    { id: 18, badge: "Weekly Challenge", description: "Participation à un défi", condition: "Compléter un challenge", icon: "🏁", category: "🏅 Challenges" },
    { id: 19, badge: "Challenge Grinder", description: "Tu aimes la compétition", condition: "5 challenges complétés", icon: "💪", category: "🏅 Challenges" },
    { id: 20, badge: "Challenge King", description: "Champion des défis", condition: "10 challenges complétés", icon: "👑", category: "🏅 Challenges" },
    // Badges Secrets
    { id: 21, badge: "Night Coder", description: "Tu codes tard la nuit", condition: "Commit entre 2h et 4h du matin", icon: "🌙", category: "🎭 Badges Secrets" },
    { id: 22, badge: "Weekend Warrior", description: "Tu ne t’arrêtes jamais", condition: "Commit un samedi et dimanche", icon: "🏖️", category: "🎭 Badges Secrets" },
    { id: 23, badge: "One Day Madness", description: "100 commits en un jour", condition: "100 commits en 24h", icon: "💥", category: "🎭 Badges Secrets" },
    { id: 24, badge: "Forking Pro", description: "Tu sais comment tirer parti du code des autres", condition: "10 forks réalisés", icon: "🍴", category: "🎭 Badges Secrets" }
  ];

  return (
    <div className=" rounded-lg">
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full text-white">
          <thead>
            <tr className="border-b border-[#3B3B3B]/30">
              <th className="py-3 px-6 text-left text-[#7E7F81]">Nom du Badge</th>
              <th className="py-3 px-6 text-left text-[#7E7F81]">Description</th>
              <th className="py-3 px-6 text-left text-[#7E7F81]">Condition</th>
              <th className="py-3 px-6 text-left text-[#7E7F81]">Catégorie</th>
            </tr>
          </thead>
          <tbody>
            {badges.map((badge) => (
              <tr key={badge.id} className="border-b border-[#3B3B3B]/30">
                <td className="py-4 px-6 gradient2"><span className='text-[#000000]'>{badge.icon}</span>{badge.badge}</td>
                <td className="py-4 px-6">{badge.description}</td>
                <td className="py-4 px-6">{badge.condition}</td>
                <td className="py-4 px-6">{badge.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tables;
