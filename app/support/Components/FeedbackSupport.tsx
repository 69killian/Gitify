"use client"
import React, { useState } from 'react';
import { FaXTwitter } from 'react-icons/fa6';
import Link from 'next/link';
import LeftParticles from "../../Components/images/Group 194.svg"; 
import RightParticles from "../../Components/images/Group 191.svg"; 
import Image from 'next/image';

const FeedbackSupport = () => {
  const [feedback, setFeedback] = useState('');

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle feedback submission (could be an API call or email)
    alert('Merci pour ton retour !');
    setFeedback('');
  };

  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full p-8 bg-gradient-to-b from-[#0E0913] to-[#160E1E] transition-colors duration-300 rounded-[8px] p-1 shadow-md shadow-[#101010] border-t-2 border-gray-300/10 border border-[#292929] text-[16px]">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full p-8 bg-gradient-to-b from-[#0E0913] to-[#160E1E] transition-colors duration-300 rounded-[8px] shadow-md shadow-[#101010] border-t-2 border-gray-300/10 border border-[#292929] text-[16px]">
          <div className="flex justify-center relative">
            <div className="whitespace-nowrap font-poppins font-bold text-[35px] transition-all duration-200">Feedback & Support</div>
          </div>
          <p className="text-center text-gray-400 text-[18px] font-bold">
            Suggestions, Bugs, Contact
          </p>
          <p className="text-center mb-6 text-gray-400">
            Ton avis compte ! Laisse-nous un retour ou contacte-nous pour toute question.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <textarea
                value={feedback}
                onChange={handleFeedbackChange}
                placeholder="Décris-nous ta suggestion ou ton problème..."
                className="w-full h-[150px] p-4 rounded-[8px] border border-[#292929] bg-[#1A141D] text-gray-400 focus:outline-none"
                rows="5"
              ></textarea>
            </div>
            <div className="flex justify-center gap-2">
              <button type="submit" className=" relative z-10 py-3 px-6 hover:bg-[#0E0913] bg-[#160E1E] text-center transition-colors duration-300 rounded-[8px] p-1 shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-[250px] h-[42px] rounded-[6px] border border-[#292929] text-[16px] flex justify-center items-center">
                <Image src={LeftParticles} alt="Left Particles" className="absolute left-0" />
                Envoyer ton&nbsp;<span className="gradient">feedback</span>
                <Image src={RightParticles} alt="Right Particles" className="absolute right-0" />
              </button>
            </div>
          </form>
          <div className="whitespace-nowrap flex items-center mt-10 justify-center font-poppins cursor-pointer hover:text-violet-200 text-[15px] transition-all duration-200"><Link href={"/"}>Revenir sur Gitify</Link></div> 
          <div className="mt-8 text-center text-gray-400">
            <p className="font-bold">Ou contacte-nous directement sur</p>
            <div className="mt-4 flex justify-center gap-4">
              <button className=" relative z-10 py-3 px-6 hover:bg-[#0E0913] bg-[#160E1E] text-center transition-colors duration-300 rounded-[8px] p-1 shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-[200px] h-[42px] rounded-[6px] border border-[#292929] text-[16px] flex justify-center items-center">
                <Image src={LeftParticles} alt="Left Particles" className="absolute left-0" />
                  <Link target='_blank' href="https://x.com/KillianCodes69" className="flex items-center gap-2 text-white">
                    <FaXTwitter size={20} />  {/* Icône GitHub */}
                    <span className="gradient">Twitter</span>
                  </Link>
                <Image src={RightParticles} alt="Right Particles" className="absolute right-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackSupport;
