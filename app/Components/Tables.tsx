"use client"
import React from 'react';

const Tables = () => {
  const badges = [
    {
      category: "🔥 Streaks",
      items: [
        { name: "Streak Newbie", description: "Premier streak atteint", condition: "3 jours de streak", icon: "🔥" },
        { name: "Streak Enthusiast", description: "Tu commences à être sérieux", condition: "7 jours de streak", icon: "🔥🔥" },
        { name: "Streak Warrior", description: "La régularité paie !", condition: "15 jours de streak", icon: "⚔️🔥" },
        { name: "Streak Master", description: "Tu es un vrai grinder", condition: "30 jours de streak", icon: "🏅🔥" },
        { name: "Streak God", description: "Plus déterminé que jamais", condition: "100 jours de streak", icon: "🏆🔥" }
      ]
    },
    {
      category: "🚀 Contributions",
      items: [
        { name: "First Commit", description: "Premier commit enregistré", condition: "1 commit", icon: "✅" },
        { name: "Contributor", description: "Un bon début", condition: "10 commits", icon: "📝" },
        { name: "Code Machine", description: "Tu carbures !", condition: "100 commits", icon: "💻" },
        { name: "Code Addict", description: "Impossible de t’arrêter", condition: "500 commits", icon: "🚀" },
        { name: "Code Legend", description: "Inarrêtable.", condition: "1000 commits", icon: "🏅" }
      ]
    },
    {
      category: "🔁 Pull Requests",
      items: [
        { name: "First PR", description: "Première pull request soumise", condition: "1 PR", icon: "🔄" },
        { name: "Merge Master", description: "Les PRs, c’est ton truc", condition: "5 PRs fusionnées", icon: "🔥🔄" },
        { name: "PR Hero", description: "Tu rends GitHub meilleur", condition: "10 PRs fusionnées", icon: "🦸" },
        { name: "Open Source Champion", description: "Tes PRs aident la communauté", condition: "20 PRs fusionnées", icon: "🏆" }
      ]
    },
    {
      category: "🌍 Open Source",
      items: [
        { name: "Public Repo", description: "Premier repo public créé", condition: "1 repo public", icon: "🌍" },
        { name: "Open Source Addict", description: "Tes projets aident le monde", condition: "3 repos publics", icon: "💾" },
        { name: "OSS Rockstar", description: "Contribution massive au code open source", condition: "10 repos publics", icon: "🎸" }
      ]
    },
    {
      category: "🏅 Challenges",
      items: [
        { name: "Weekly Challenge", description: "Participation à un défi", condition: "Compléter un challenge", icon: "🏁" },
        { name: "Challenge Grinder", description: "Tu aimes la compétition", condition: "5 challenges complétés", icon: "💪" },
        { name: "Challenge King", description: "Champion des défis", condition: "10 challenges complétés", icon: "👑" }
      ]
    },
    {
      category: "🎭 Badges Secrets",
      items: [
        { name: "Night Coder", description: "Tu codes tard la nuit", condition: "Commit entre 2h et 4h du matin", icon: "🌙" },
        { name: "Weekend Warrior", description: "Tu ne t’arrêtes jamais", condition: "Commit un samedi et dimanche", icon: "🏖️" },
        { name: "One Day Madness", description: "100 commits en un jour", condition: "100 commits en 24h", icon: "💥" },
        { name: "Forking Pro", description: "Tu sais comment tirer parti du code des autres", condition: "10 forks réalisés", icon: "🍴" }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {badges.map((category) => (
        <div key={category.category} className="space-y-4">
          <h3 className="text-xl font-semibold">{category.category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.items.map((badge) => (
              <div key={badge.name} className=" p-4 bg-[#241730] rounded-sm border border-[#292929]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{badge.icon}</span>
                  <h4 className="font-semibold">{badge.name}</h4>
                </div>
                <p className="text-sm text-gray-400 mb-2">{badge.description}</p>
                <p className="text-xs text-violet-400">{badge.condition}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tables;
