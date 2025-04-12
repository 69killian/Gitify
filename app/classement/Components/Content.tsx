"use client";
import Breadcrumb from "../../Components/breadcrumb";
import Leaderboard from "./Leaderboard";
import Podium from "./Podium";

const TrophyRoom = () => {
  return (
    <section className="px-4 md:px-8">
      <Breadcrumb pagename="classement" />
      
      <div className="mt-10 flex flex-col items-center">
        <h1 className="text-[60px] font-poppins drop-shadow-lg" style={{ fontFamily: "poppins, sans-serif" }}>
          🏅 <span className="gradient-gold">Classement</span> 🏅
        </h1>
      </div>

      {/* Intégration du composant Podium dynamique */}
      <Podium />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        <div className="lg:col-span-2 bg-[#241730] rounded-sm border border-[#292929] p-8">
          <Leaderboard />
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
