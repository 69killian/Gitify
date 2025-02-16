import React from 'react';
import Breadcrumb from '@/app/Components/breadcrumb';
import { FaXTwitter } from 'react-icons/fa6';
import Link from 'next/link';
import LeftParticles from "../../Components/images/Group 194.svg"; 
import RightParticles from "../../Components/images/Group 191.svg"; 
import Image from 'next/image';

const Content = () => {
  return (
    <section className="px-4 md:px-8 text-center">
      <Breadcrumb pagename={"reseaux"} />
      
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center gap-4 mt-10">
        <h1 className="text-[26px] font-bold">Rejoins-moi sur <span className="gradient">X</span> !</h1>
        <p className="text-[14px] text-[#7E7F81] max-w-lg">
          Je partage chaque jour des astuces, du contenu tech et des avancées sur mes projets.
          Si tu veux progresser en développement et suivre l&apos;évolution de <span className="font-semibold">Gitify</span>, c&apos;est ici que ça se passe !
        </p>
        <button className="bg-[#1B1B1B] hover:bg-[#121212] transition-all duration-200 w-[196px] h-[42px] rounded-[6px] border border-[#292929] text-[16px] relative flex justify-center items-center">
      <Image src={LeftParticles} alt="Left Particles" className="absolute left-0" />
      <Link href="https://x.com/KillianCodes69" target="_blank" className="flex items-center gap-2 text-white">
        <FaXTwitter size={14} />
        Suis-moi sur <span className="gradient">X</span>
      </Link>
      <Image src={RightParticles} alt="Right Particles" className="absolute right-0" />
    </button>
      </div>

      {/* Pourquoi me suivre ? */}
      <div className="mt-12 text-left max-w-2xl mx-auto flex flex-col items-center justify-center">
        <h2 className="text-[20px] md:text-[26px] font-semibold mb-4">Pourquoi me suivre ?</h2>
        <ul className="list-disc list-inside text-[14px] text-[#7E7F81]">
          <li>🔥 Des conseils et astuces pour devenir un meilleur dev</li>
          <li>🚀 Les coulisses du développement de <span className="font-semibold">Gitify</span></li>
          <li>📢 Des annonces exclusives sur mes projets et futurs SaaS</li>
          <li>💡 Un échange avec la communauté et du feedback en temps réel</li>
        </ul>
      </div>
    </section>
  );
};

export default Content;
