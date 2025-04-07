"use client";
import Breadcrumb from "../../Components/breadcrumb";
import { Trophy, Medal, Award } from "lucide-react";
import Image from "next/image";
import profile from "../../Components/images/profile-test.jpg";

const TrophyRoom = () => {
  const users = [
    {
      username: "CoderPro",
      avatarUrl: profile,
      streakDays: 5200,
    },
    {
      username: "DevUser",
      avatarUrl: profile,
      streakDays: 4805,
    },
    {
      username: "CodeMaster",
      avatarUrl: profile,
      streakDays: 4500,
    },
  ];

  return (
    <section className="px-4 md:px-8">
      <Breadcrumb pagename="classement" />
      
      <div className="mt-10 flex flex-col items-center">
        <h1 className="text-[60px] font-poppins drop-shadow-lg" style={{ fontFamily: "poppins, sans-serif" }}>
          🏅 <span className="gradient-gold">Classement</span> 🏅
        </h1>
      </div>

      {/* Podium */}
      <div className="flex justify-center items-end gap-6 py-8">
        <div className="flex flex-col items-center">
          <Image src={users[0].avatarUrl} alt="Avatar" className="w-[250px] h-[250px] rounded-full border-[6px] border-violet-500" />
          <h2 className="text-2xl font-bold text-white mt-2 gradient">{users[0].username}</h2>
        </div>
        <div className="flex flex-col items-center">
          <Image src={users[1].avatarUrl} alt="Avatar" className="w-[350px] h-[350px] rounded-full border-[10px] border-yellow-500" />
          <h2 className="text-6xl font-bold text-white mt-2 gradient-gold">{users[1].username}</h2>
        </div>
        <div className="flex flex-col items-center">
          <Image src={users[2].avatarUrl} alt="Avatar" className="w-[250px] h-[250px] rounded-full border-4 border-violet-500" />
          <h2 className="text-lg font-bold text-white mt-2 gradient2">{users[2].username}</h2>
        </div>
      </div>

      <button className="text-[12.49px] text-white cursor-pointer bg-violet-800 hover:bg-violet-600 transition-all duration-200 w-[200px] h-[42px] border border-1 border-violet-500 text-[12px] flex justify-center items-center">
        🎖️ Commencer un Défi &gt;
      </button>
      
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-10">
      <div className="card relative z-10 py-3 px-6 bg-[#241730] rounded-sm border border-[#292929] transition-colors duration-300 shadow-md w-full h-[92px] rounded-[6px] flex items-center gap-4 p-4">
        <div className="flex items-center gap-4">
          <Trophy className="w-8 h-8 text-violet-500" />
          <div>
            <div className="text-2xl font-bold gradient">#42</div>
            <div className="text-sm text-gray-400">Votre rang</div>
          </div>
        </div>
      </div>

      <div className="card relative z-10 py-3 px-6 bg-[#241730] rounded-sm border border-[#292929] transition-colors duration-300 shadow-md w-full h-[92px] rounded-[6px] flex items-center gap-4 p-4">
        <div className="flex items-center gap-4">
          <Medal className="w-8 h-8 text-violet-500" />
          <div>
            <div className="text-2xl font-bold gradient">4.805</div>
            <div className="text-sm text-gray-400">Points</div>
          </div>
        </div>
      </div>

      <div className="card relative z-10 py-3 px-6 bg-[#241730] rounded-sm border border-[#292929] transition-colors duration-300 shadow-md w-full h-[92px] rounded-[6px] flex items-center gap-4 p-4">
        <div className="flex items-center gap-4">
          <Award className="w-8 h-8 text-violet-500" />
          <div>
            <div className="text-2xl font-bold gradient">26</div>
            <div className="text-sm text-gray-400">Badges</div>
          </div>
        </div>
      </div>
    </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#241730] rounded-sm border border-[#292929] p-8">
          <div className="card ">
            <h2 className="text-xl font-semibold mb-6">Top Contributeurs</h2>
            <div className="space-y-4 ">
              {[
                { rank: 1, name: "Sarah Chen", points: 12500, streak: 365, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80" },
                { rank: 2, name: "John Doe", points: 11200, streak: 280, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" },
                { rank: 3, name: "Marie Durant", points: 10800, streak: 245, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
                { rank: 4, name: "Alex Smith", points: 9500, streak: 210, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" },
                { rank: 5, name: "Lisa Wang", points: 9200, streak: 195, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb" }
              ].map((user) => (
                <div key={user.rank} className="flex items-center gap-4">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    user.rank === 1 
                      ? 'bg-yellow-500' 
                      : user.rank === 2
                      ? 'bg-gray-400'
                      : user.rank === 3
                      ? 'bg-amber-600'
                      : 'bg-violet-500/20'
                  }`}>
                    {user.rank}
                  </div>
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-400">{user.points} points</div>
                  </div>
                  <div className="text-right">
                    <div className="text-violet-400">{user.streak} jours</div>
                    <div className="text-sm text-gray-400">de streak</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card lg:col-span-2 bg-[#241730] rounded-sm border border-[#292929] p-8">
            <h2 className="text-xl font-semibold mb-6">Statistiques</h2>
            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-400 mb-2">Distribution des streaks</div>
                <div className="space-y-2">
                  {[
                    { range: "1-7 jours", count: 45 },
                    { range: "8-30 jours", count: 30 },
                    { range: "31-90 jours", count: 15 },
                    { range: "91+ jours", count: 10 }
                  ].map((stat) => (
                    <div key={stat.range}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{stat.range}</span>
                        <span>{stat.count}%</span>
                      </div>
                      <div className="h-2 bg-violet-900/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-violet-500 rounded-full"
                          style={{ width: `${stat.count}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-2">Top langages</div>
                <div className="space-y-2">
                  {[
                    { name: "JavaScript", percentage: 35 },
                    { name: "Python", percentage: 25 },
                    { name: "Java", percentage: 20 },
                    { name: "TypeScript", percentage: 15 }
                  ].map((language) => (
                    <div key={language.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{language.name}</span>
                        <span>{language.percentage}%</span>
                      </div>
                      <div className="h-2 bg-violet-900/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-violet-500 rounded-full"
                          style={{ width: `${language.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrophyRoom;
