"use client"
import Image from 'next/image';
import React from 'react';
import Breadcrumb from '../../Components/breadcrumb';
import profil from '../../Components/images/profile-test.jpg';
import { Paperclip } from 'lucide-react';
import { PenLine } from 'lucide-react';
import { Download } from 'lucide-react';
import LeftParticles from '../../Components/images/Group 194.svg';
import RightParticles from '../../Components/images/Group 191.svg';
import Link from 'next/link';

const Profile = () => {
  const profile = {
    githubId: "abc123herghedf2695982gberg",
    username: "devUser",
    avatarUrl: "https://via.placeholder.com/150",
    email: "devuser@example.com",
  };

  return (
    <section className="px-4 md:px-8">
      <Breadcrumb pagename="profil" />

      <div className='flex flex-col lg:flex-row gap-[100px] justify-center items-start'>

        {/* Profile Section */}
        <div className="flex flex-col items-center justify-center gap-4">
          <button className="z-1 bg-[#160E1E] h-[200px] w-[200px] rounded-full border-2 border-violet-700 overflow-hidden relative flex items-center justify-center">
            <Image 
              src={profil} 
              alt="Profile" 
              layout="fill" 
              className="object-cover rounded-full"
            />
          </button>
          <div className="text-[25px] text-white text-center flex items-center relative group">DevUser <PenLine className='right-[-30px] absolute hidden group-hover:block'/></div>
          <div className='flex items-center'>
            <Paperclip height={15}/> {profile.githubId}
          </div>
        </div>

        {/* Pro Version Benefits */}
        <div className='flex flex-col w-full'>
          <div className='flex mb-5'>
            <div className='text-[25px]'>Bénéfices de la version <span className='gradient'>Pro</span></div>
          </div>

          <div className='flex flex-wrap lg:flex-nowrap gap-8'>
            <div className='flex flex-col gap-5'>
              <div className='gradient text-[19px]'>Plus de fonctionnalités</div>
              <div className='text-[13px] text-gray-300'>Gestion de projet, financière, business sans limites</div>
            </div>

            <div className='flex flex-col gap-5'>
              <div className='gradient text-[19px]'>Habit tracker</div>
              <div className='text-[13px] text-gray-300'>Kanban et Todo List pour du développement de projet efficace</div>
            </div>

            <div className='flex flex-col gap-3'>
              <div className='gradient text-[19px]'>Priorité de support</div>
              <div className='text-[13px] text-gray-300'>Obtiens une réponse rapide et dédiée par l&apos;Assistance</div>
            </div>
          </div>

          <button className="mt-10 bg-[#1B1B1B] hover:bg-[#121212] transition-all duration-200 w-[276px] h-[52px] rounded-[6px] border border-1 border-[#292929] text-[15px] relative flex justify-center items-center">
            <Image src={LeftParticles} alt="Left Particles" className="absolute left-0" />
            <Link href="https://mighty-travel-887542.framer.app/pricing" target="_blank">
              Gestion des <span className="gradient">Abonnements</span>
            </Link>
            <Image src={RightParticles} alt="Right Particles" className="absolute right-0" />
          </button>

          {/* Separator */}
          <div className="border-b border-[#3B3B3B]/30 my-[70px]"></div>

          {/* Modify Profile Section */}
          <div className='flex mb-5'>
            <div className='text-[25px]'>Modifier mon Profil</div>
          </div>

          <div className='flex gap-2'>
            <div className='flex flex-col gap-0'>
              <div className=' text-[16px] text-gray-300'>Importe la photo de ton choix</div>
            </div>
          </div>

          <button className="text-[13.49px] mt-5 text-white cursor-pointer bg-violet-800 hover:bg-violet-600 transition-all duration-200 w-[109px] h-[42px] border border-1 border-violet-500 text-[12px] flex justify-center items-center">
            <Image src={LeftParticles} alt="Left Particles" className="absolute left-0" />
            <Link className='flex' href="https://mighty-travel-887542.framer.app/pricing" target="_blank">
              <Download height={17}/> Importer
            </Link>
            <Image src={RightParticles} alt="Right Particles" className="absolute right-0" />
          </button>

          <div className=' text-[16px] mt-8 text-gray-300'>Ajoute une adresse email</div>

          <div>
            <input
              type="email"
              value={profile.email}
              className="mt-5 mb-10 w-full sm:w-[509px] py-2 h-[40px] pl-4 pr-4 bg-[#0E0913] text-white text-sm rounded-md border border-[#1d1d1d] placeholder:text-neutral-500 focus:ring-2 focus:ring-violet-700 outline-none transition-all duration-200"
            />
          </div>

          {/* Separator HIDDEN */}
          <div className="border-b border-[#3B3B3B]/30 my-[70px] hidden"></div>

        </div>
      </div>

    </section>
  );
};

export default Profile;
