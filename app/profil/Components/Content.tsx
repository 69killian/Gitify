"use client"
import Image from 'next/image';
import React from 'react';
import Breadcrumb from '../../Components/breadcrumb';
import { Paperclip } from 'lucide-react';
import { PenLine } from 'lucide-react';
import { Download } from 'lucide-react';
import LeftParticles from '../../Components/images/Group 194.svg';
import RightParticles from '../../Components/images/Group 191.svg';
import Link from 'next/link';
import { Mail, Github, Globe, Calendar, Settings, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';


const Profile = () => {
  const { data: session } = useSession();



  return (
    <section className="px-4 md:px-8">
      <Breadcrumb pagename="profil" />

      <div className='flex flex-col lg:flex-row gap-[100px] justify-center items-start'>

        {/* Profile Section */}
        <div className="flex flex-col items-center justify-center gap-4">
          <button className="z-1 bg-[#160E1E] h-[200px] w-[200px] rounded-full border-2 border-violet-700 overflow-hidden relative flex items-center justify-center">
            <Image
              src={session?.user?.image} 
              alt="Profile" 
              layout="fill" 
              className="object-cover rounded-full"
            />
          </button>
          <div className="text-[25px] text-white text-center flex items-center relative group">{session?.user?.name}<PenLine className='right-[-30px] absolute hidden group-hover:block'/></div>
          <div className='flex items-center'>
            <Paperclip height={15}/> {session?.user?.github_id}
          </div>

          {/* Hidden Change Photo button for now */}
          <button className="hidden text-[13.49px] my-2 text-white cursor-pointer bg-violet-800 hover:bg-violet-600 transition-all duration-200 w-[165px] h-[42px] border border-1 border-violet-500 text-[12px] flex justify-center items-center">
            <Image src={LeftParticles} alt="Left Particles" className="absolute left-0" />
            <Link className='flex' href="https://mighty-travel-887542.framer.app/pricing" target="_blank">
              <Download height={17}/> Changer de photo
            </Link>
            <Image src={RightParticles} alt="Right Particles" className="absolute right-0" />
          </button>

          {/* Information Card */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">Informations</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5" />
                <span>{session?.user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Github className="w-5 h-5" />
                <span>@{session?.user?.name}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Globe className="w-5 h-5" />
                <span>{session?.user?.website}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Calendar className="w-5 h-5" />
                <span> Membre depuis le&nbsp;
                {session?.user?.created_at 
                  ? new Date(session.user.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : ''}
              </span>
              </div>
            </div>
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
            <Link href="https://warmhearted-imagine-949567.framer.app/" target="_blank">
              Gestion des <span className="gradient">Abonnements</span>
            </Link>
            <Image src={RightParticles} alt="Right Particles" className="absolute right-0" />
          </button>

          {/* Separator */}
          <div className="border-b border-[#3B3B3B]/30 my-[70px]"></div>

          {/* Edit Profile Form */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <h3 className="text-lg  mb-4">Visualisez votre profil GitHub</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Nom d&rsquo;utilisateur
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#0E0913] border border-violet-900/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-700 outline-none transition-all duration-200"
                      value={session?.user?.name}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full bg-[#0E0913] border border-violet-900/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-700 outline-none transition-all duration-200"
                      value={session?.user?.email}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Site web
                    </label>
                    <input
                      type="url"
                      className="w-full bg-[#0E0913] border border-violet-900/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-700 outline-none transition-all duration-200"
                      value={session?.user?.website}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Bio
                  </label>
                  <textarea
                    className="w-full bg-[#0E0913] border border-violet-900/20 rounded-lg px-4 py-2 h-32 focus:ring-2 focus:ring-violet-700 outline-none transition-all duration-200"
                    value={session?.user?.bio}
                  />
                </div>
                {/* Hidden Save button for now */}
                <button type="submit" className="hidden text-[13.49px] my-2 text-white cursor-pointer bg-violet-800 hover:bg-violet-600 transition-all duration-200 w-[250px] h-[42px] border border-1 border-violet-500 text-[12px] flex justify-center items-center">
                  Sauvegarder les modifications
                </button>
              </form>
            </div>
          </div>

          {/* Preferences & Security HIDDEN */}
          <div className="hidden grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-6 h-6 text-violet-500" />
                <h3 className="text-lg font-semibold">Préférences</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Notifications email</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-violet-900/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Profil public</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-violet-900/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Mode sombre</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-violet-900/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                  </label>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-violet-500" />
                <h3 className="text-lg font-semibold">Sécurité</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Authentification à deux facteurs</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked />
                    <div className="w-11 h-6 bg-violet-900/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
