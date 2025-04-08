"use client"
import React from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa6';
import LeftParticles from "../../Components/images/Group 194.svg"; 
import RightParticles from "../../Components/images/Group 191.svg"; 
import Image from 'next/image';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const Content = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  console.log('Session in Content:', session);
  console.log('Status:', status);

  React.useEffect(() => {
    if (status === "authenticated") {
      router.push('/');
    }
  }, [status, router]);

  const handleSignIn = async () => {
    try {
      const result = await signIn('github', { 
        callbackUrl: '/',
        redirect: false 
      });
      
      if (result?.error) {
        console.error('Erreur de connexion:', result.error);
      } else if (result?.ok) {
        router.push('/');
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full p-8 bg-gradient-to-b from-[#0E0913] to-[#160E1E] transition-colors duration-300 rounded-[8px] p-1 shadow-md shadow-[#101010] border-t-2 border-gray-300/10 border border-[#292929] text-[16px]">
      <div className="flex justify-center relative">
        <div className="whitespace-nowrap font-poppins font-bold text-[45px] cursor-pointer transition-all duration-200 hover:text-violet-700">Gitify .</div>
      </div>
      <p className="text-center text-gray-400 text-[18px] font-bold">
        Connection à Gitify
      </p>
      <p className="text-center mb-6 text-gray-400">
        Bienvenue ! Connecte-toi pour continuer
      </p>
      <div className='flex justify-center gap-2'>
        <button 
          onClick={handleSignIn}
          className="relative z-10 py-3 px-6 hover:bg-[#0E0913] bg-[#160E1E] text-center transition-colors duration-300 rounded-[8px] p-1 shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-[200px] h-[42px] rounded-[6px] border border-[#292929] text-[16px] flex justify-center items-center"
        >
          <Image src={LeftParticles} alt="Left Particles" className="absolute left-0" />
          <div className="flex items-center gap-2 text-white">
            <FaGithub size={20} />
            <span className="gradient">GitHub</span>
          </div>
          <Image src={RightParticles} alt="Right Particles" className="absolute right-0" />
        </button>
        <button disabled className="cursor-not-allowed relative z-10 py-3 px-6 hover:bg-[#0E0913] bg-[#160E1E] text-center transition-colors duration-300 rounded-[8px] p-1 shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-[200px] h-[42px] rounded-[6px] border border-[#292929] text-[16px] flex justify-center items-center">
          <Image src={LeftParticles} alt="Left Particles" className="absolute left-0" />
          <div className="flex items-center gap-2 text-white cursor-not-allowed">
            <FaGoogle size={20} />
            <span className="gradient cursor-not-allowed">Google</span>
          </div>
          <Image src={RightParticles} alt="Right Particles" className="absolute right-0" />
        </button>
      </div>
    </div>
  );
};

export default Content;