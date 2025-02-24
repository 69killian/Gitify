"use client"
import Image from 'next/image';
import React from 'react';
import Breadcrumb from '../../Components/breadcrumb';
import { Trash2 } from 'lucide-react';
import LeftParticles from '../../Components/images/Group 194.svg';
import RightParticles from '../../Components/images/Group 191.svg';
import Link from 'next/link';

const Integrations = () => {
  const services = [
    {
      name: "GitHub",
      status: "Connecté",
      permissions: "Lecture et écriture des dépôts publics",
      icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    },
    {
      name: "Discord",
      status: "Non connecté",
      permissions: "Aucune autorisation accordée",
      icon: "https://www.svgrepo.com/show/353655/discord-icon.svg",
    },
    {
      name: "X",
      status: "Non connecté",
      permissions: "Aucune autorisation accordée",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/X_logo_2023_original.svg/300px-X_logo_2023_original.svg.png?20230728155658",
    },
  ];

  return (
    <section className="px-4 md:px-8">
      <Breadcrumb pagename="integrations" />

      <div className='flex flex-col gap-10 items-start'>
        <div className='text-[25px] text-white'>Gérer mes <span className='gradient'>Intégrations</span></div>
        
        <div className='flex flex-col gap-6 w-full'>
          {services.map((service, index) => (
            <div 
              key={index} 
              className='flex justify-between items-center py-3 px-6 bg-[#1B1B1B] hover:bg-[#160E1E] transition-colors duration-300 rounded-[8px] p-1 shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-[200px] h-[82px] rounded-[6px] border border-[#292929] w-full sm:w-[500px]'>
              <div className='flex items-center gap-4'>
                <Image src={service.icon} alt={service.name} width={40} height={40} className='rounded-md'/>
                <div>
                  <div className='text-white text-[18px]'>{service.name}</div>
                  <div className='text-gray-400 text-[14px]'>{service.permissions}</div>
                </div>
              </div>
              <div>
                {service.status === "Connecté" ? (
                  <button className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-all">
                    <Trash2 size={18}/> Révoquer
                  </button>
                ) : (
                  <button className="text-[13.49px] bg-violet-800 hover:bg-violet-600 transition-all duration-200 px-4 py-2 text-white rounded-md border border-violet-500">
                    Connecter
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="border-b border-[#3B3B3B]/30 my-[50px] w-full sm:w-[500px]"></div>

        <div className='text-[18px] text-gray-300'>Gère les autorisations et les accès accordés à Gitify.</div>
        <button disabled className="cursor-not-allowed relative z-10 py-3 px-6 bg-[#1B1B1B] hover:bg-[#160E1E]  text-center transition-colors duration-300 rounded-[8px] p-1 shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-[280px] h-[52px] rounded-[6px] border border-[#292929] text-[16px] flex justify-center items-center">
          <Image src={LeftParticles} alt="Left Particles" className="absolute left-0" />
          <Link href="https://github.com/settings/connections/applications/gitify" className="flex items-center gap-2 text-white cursor-not-allowed">
          Gérer les <span className="gradient cursor-not-allowed">Autorisations</span>
          </Link>
          <Image src={RightParticles} alt="Right Particles" className="absolute right-0" />
        </button>
      </div>
    </section>
  );
};

export default Integrations;