"use client"
import React from 'react';
import FakeGitHubCalendar from './fakecalendar';
import Breadcrumb from './breadcrumb';
import Tables from './Tables';
import { useSession } from 'next-auth/react';
const Content = () => {
  const { data: session } = useSession();
  return (
    <>
      <section className="px-4 md:px-8">
          <Breadcrumb pagename="Overview"/>
        {/* Hero Section */}
        <div className="flex flex-col justify-between gap-4">
          {/* Left Content */}
          <div className="md:w-1/2">
          <div className="text-[46px] mb-[20px]">
              Bienvenue, <span className='gradient'>{session?.user?.name}</span> 🖐️ {/*Put username here */}
            </div>
            <div className="text-[26px] mb-[20px]">
              Mes <span className="gradient">Contributions</span>
            </div>
            <div className="text-[14px] text-[#7E7F81] mb-[40px] md:mb-[150px] lg:mb-[150px] xl:mb-[26px]">
            Ce calendrier interactif te permet de visualiser tes contributions récentes sur GitHub de manière simple. <br className="hidden" /> Chaque carré représente un jour, et la couleur indique si tu as effectué une contribution ce jour-là. Plus la couleur est foncée, plus tu as de contibutions.
            </div>
            
          </div>
          <FakeGitHubCalendar />
        </div>

        {/* Divider */}
        <div className="border-none border-[#1D1D1D] my-[50px]"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-[40px]">

        <div className="text-[14px] flex items-center gap-4">
        <div className="text-[75px] gradient">4.805</div>
        <div className="grid gap-2">
          <div className="text-[#7E7F81]">Jours de Streak</div>
          <div className="text-violet-400 inline-block w-[60px] whitespace-nowrap bg-violet-900/40 rounded-full border border-violet-500">
            {"+ 4.804"}
          </div>
        </div>
      </div>


          <div className='text-[14px] flex items-center gap-4'>
            <div className='text-[75px] gradient'>365</div>
            <div className='grid gap-2'>
              <div className='text-[#7E7F81]'>Record de Streak</div>
              <div className="text-violet-400 inline-block w-[60px] whitespace-nowrap bg-violet-900/40 rounded-full border border-violet-500 px-1">
            {"+ 365"}
          </div>
            </div>
          </div>

          <div className='text-[14px] flex items-center gap-4'>
            <div className='text-[75px] gradient'>36</div>
            <div className='grid gap-2'>
              <div className='text-[#7E7F81]'>Défis Réalisés</div>
              <div className="text-violet-400 inline-block w-[60px] whitespace-nowrap bg-violet-900/40 rounded-full border border-violet-500 px-1">
            {"+ 35"}
          </div>
            </div>
          </div>

          <div className='text-[14px] flex items-center gap-4'>
            <div className='text-[75px] gradient'>26</div>
            <div className='grid gap-2'>
              <div className='text-[#7E7F81]'>Badges débloqués</div>
              <div className="text-violet-400 inline-block w-[60px] whitespace-nowrap bg-violet-900/40 rounded-full border border-violet-500 px-1">
            {"+ 26"}
          </div>
            </div>
          </div>
        </div>


        {/* Other Sections */}
        <div className="mt-[30px] mb-[30px] flex items-center justify-between">
          <div className="text-[20px] md:text-[26px] gradient-gold" style={{ fontFamily: "poppins, sans-serif" }}>
          ✨ Tous les Badges que tu as débloqué ✨
          </div>
          <button className="text-[12.49px] text-white cursor-pointer bg-violet-800 hover:bg-violet-600 transition-all duration-200 w-[169px] h-[42px] border border-1 border-violet-500 text-[12px] flex justify-center items-center">
          🎖️ Voir tous mes Badges &gt;
          </button>
        </div>

        <Tables/>

      </section>
    </>
  );
}

export default Content;
