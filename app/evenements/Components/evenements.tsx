"use client"
import { FaXTwitter } from 'react-icons/fa6';
import Link from 'next/link';
import LeftParticles from "../../Components/images/Group 194.svg"; 
import RightParticles from "../../Components/images/Group 191.svg"; 
import Image from 'next/image';

const FeedbackSupport = () => {

  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full p-8 bg-gradient-to-b from-[#0E0913] to-[#160E1E] transition-colors duration-300 rounded-[8px] p-1 shadow-md shadow-[#101010] border-t-2 border-gray-300/10 border border-[#292929] text-[16px]">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full p-8 bg-gradient-to-b from-[#0E0913] to-[#160E1E] transition-colors duration-300 rounded-[8px] shadow-md shadow-[#101010] border-t-2 border-gray-300/10 border border-[#292929] text-[16px]">
          <div className="flex justify-center relative">
            <div className="whitespace-nowrap font-poppins font-bold text-[35px] transition-all duration-200">🚧 En plein Chantier...</div>
          </div>
          <p className="text-center mt-2 text-gray-400 text-[18px] font-bold">
            Désolé ! Cette page n&apos;est pas (encore) disponible 👷‍♂️
          </p>
          <p className="text-center my-6 text-gray-400">
            Cette page future sera dédiée aux évènements à venir sur Gitify. Reste branché sur
          </p>



          <div className="mt-4 flex justify-center gap-4">
              <button className=" relative z-10 py-3 px-6 hover:bg-[#0E0913] bg-[#160E1E] text-center transition-colors duration-300 rounded-[8px] p-1 shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-[200px] h-[42px] rounded-[6px] border border-[#292929] text-[16px] flex justify-center items-center">
                <Image src={LeftParticles} alt="Left Particles" className="absolute left-0" />
                  <Link target='_blank' href="https://x.com/KillianCodes69" className="flex items-center gap-2 text-white">
                    <FaXTwitter size={20} />  {/* Icône GitHub de react-icons */}
                    <span className="gradient">Twitter</span>
                  </Link>
                <Image src={RightParticles} alt="Right Particles" className="absolute right-0" />
              </button>
            </div>

            <div className="whitespace-nowrap flex items-center mt-5 justify-center font-poppins cursor-pointer hover:text-violet-200 text-[15px] transition-all duration-200"><Link href={"/"}>Revenir sur Gitify</Link></div> 
        </div>
      </div>
    </>
  );
};

export default FeedbackSupport;
