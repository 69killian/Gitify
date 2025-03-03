"use client";
import Breadcrumb from "../../Components/breadcrumb";
import Leaderboard from "./Leaderboard";
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
      
      <div className="mt-10 p-6 bg-gradient-to-r rounded-md from-black/30 via-transparent to-black/30 backdrop-blur-md bg-opacity-30">
        <h2 className="text-xl font-bold gradient-gold mb-4">✨ Classement ✨</h2>
        <Leaderboard />
      </div>
    </section>
  );
};

export default TrophyRoom;
