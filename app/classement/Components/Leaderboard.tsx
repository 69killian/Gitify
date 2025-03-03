import React from 'react';

const Leaderboard = () => {
  const contributors = [
    { rank: 1, username: "CodeMaster99", badge: "Code Legend", icon: "🏅", contributions: "1200 commits" },
    { rank: 2, username: "DevProX", badge: "Streak God", icon: "🏆🔥", contributions: "110 jours de streak" },
    { rank: 3, username: "MergeWizard", badge: "Open Source Champion", icon: "🏆", contributions: "25 PRs fusionnées" },
    { rank: 4, username: "NightOwl", badge: "Night Coder", icon: "🌙", contributions: "Code entre 2h et 4h du matin" },
    { rank: 5, username: "CommitStorm", badge: "One Day Madness", icon: "💥", contributions: "102 commits en 24h" },
    { rank: 6, username: "ForkLord", badge: "Forking Pro", icon: "🍴", contributions: "15 forks réalisés" },
    { rank: 7, username: "RepoKing", badge: "OSS Rockstar", icon: "🎸", contributions: "12 repos publics" },
    { rank: 8, username: "ChallengeBeast", badge: "Challenge King", icon: "👑", contributions: "12 challenges complétés" },
    { rank: 9, username: "WeekendHacker", badge: "Weekend Warrior", icon: "🏖️", contributions: "Code le week-end sans interruption" },
    { rank: 10, username: "BugFixer", badge: "PR Hero", icon: "🦸", contributions: "18 PRs fusionnées" },
  ];

  return (
    <div className="rounded-lg">
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full text-white">
          <thead>
            <tr className="border-b border-[#3B3B3B]/30">
              <th className="py-3 px-6 text-left text-[#7E7F81]">#</th>
              <th className="py-3 px-6 text-left text-[#7E7F81]">Pseudo</th>
              <th className="py-3 px-6 text-left text-[#7E7F81]">Badge</th>
              <th className="py-3 px-6 text-left text-[#7E7F81]">Contributions</th>
            </tr>
          </thead>
          <tbody>
            {contributors.map((contributor) => (
              <tr key={contributor.rank} className="border-b border-[#3B3B3B]/30">
                <td className="py-4 px-6 font-bold">{contributor.rank}</td>
                <td className="py-4 px-6 gradient2">{contributor.username}</td>
                <td className="py-4 px-6"><span className='text-[#000000]'>{contributor.icon}</span> {contributor.badge}</td>
                <td className="py-4 px-6">{contributor.contributions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
