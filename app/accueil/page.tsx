"use client"
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, ChevronDown, Zap, Shield, BarChart3, GitBranch, Award, Calendar, Trophy, Target } from "lucide-react";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
// Import dynamique pour éviter les erreurs SSR
const ShaderCanvas = dynamic(() => import("../Components/backgrond"), { ssr: false });

// Animation variants pour les éléments fade-in
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Accueil() {
  const [scrollY, setScrollY] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  
  // Gérer le défilement pour les effets de parallaxe
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    // Montrer le toast après 3 secondes
    const toastTimer = setTimeout(() => {
      setShowToast(true);
      
      // Cacher le toast après 5 secondes
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }, 3000);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(toastTimer);
    };
  }, []);
  
  // Animation des compteurs
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const isInView = scrollY > 300;
    
    if (isInView) {
      interval = setInterval(() => {
        setCount1(prev => prev < 75 ? prev + 1 : 75);
        setCount2(prev => prev < 90 ? prev + 1 : 90);
        setCount3(prev => prev < 45 ? prev + 1 : 45);
      }, 30);
    }
    
    return () => clearInterval(interval);
  }, [scrollY]);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden">
      {/* Background avec overlay radial gradient */}
      <div className="fixed inset-0 z-0">
        <ShaderCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/50"></div>
      </div>
      
      {/* Toast notification */}
      {showToast && (
        <motion.div 
          className="fixed top-24 right-4 z-50 bg-indigo-900/90 backdrop-blur-sm border border-indigo-700 p-4 rounded-lg shadow-lg max-w-xs"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
        >
          <div className="flex items-start gap-3">
            <div className="bg-indigo-600 rounded-full p-1 flex-shrink-0">
              <CheckCircle size={18} className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-white">+5 commits aujourd&apos;hui!</h4>
              <p className="text-xs text-indigo-200 mt-1">Vous avez gagné 25 points de contribution.</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/10 backdrop-blur-sm border-b border-indigo-950/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">Gitify.</h1>
            
            <nav className="hidden md:flex gap-8 items-center">
              <Link href="#fonctionnement" className="text-gray-300 hover:text-white transition-colors duration-200">
                Fonctionnement
              </Link>
              <Link href="#avantages" className="text-gray-300 hover:text-white transition-colors duration-200">
                Avantages
              </Link>
              <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors duration-200">
                Témoignages
              </Link>
              <Link href="#faq" className="text-gray-300 hover:text-white transition-colors duration-200">
                FAQ
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="#" className="text-indigo-300 hover:text-indigo-100 text-sm hidden md:inline-block">
              GitHub
            </Link>
            <Link href="/login">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-2 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_20px_rgba(99,102,241,0.7)]">
                Commencer à jouer
                <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Section Hero */}
      <section className="relative pt-32 pb-20 md:pt-[200px] md:pb-[200px] overflow-hidden">
        <div 
          className="container mx-auto px-4 relative z-10"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500 rounded-full filter blur-3xl opacity-10 translate-y-1/2 -translate-x-1/3"></div>
          
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-900/60 backdrop-blur-sm text-indigo-200 text-sm mb-6"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>GitHub, mais en plus fun.</span>
            </motion.div>
            
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { duration: 0.8, delay: 0.2 } 
                }
              }}
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight font-dm-sans"
            >
              <span className="block font-dm-sans font-thin gradient3">Transforme Ton GitHub en Terrain de Jeu <span className="block font-dm-sans font-thin gradient3">Et Deviens <span className="font-instrument-serif italic bg-gradient-to-r from-violet-400 to-blue-500 bg-clip-text text-transparent gradient3">Ultra-Productif.</span></span>
              </span>
            </motion.h1>
            
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { duration: 0.8, delay: 0.4 } 
                }
              }}
              className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              Code plus, progresse plus. Gagne des points et prouve ta discipline. Transforme tes contributions open source en expérience ludique et motivante.
            </motion.p>
            
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { duration: 0.8, delay: 0.6 } 
                }
              }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="#fonctionnement">
                <button className="bg-gradient-to-r from-indigo-900 to-indigo-800 hover:from-indigo-800 hover:to-indigo-700 text-white px-8 py-3 rounded-md font-medium transition-all duration-300 shadow-lg shadow-indigo-900/30 border border-indigo-700/30">
                  Découvrir le fonctionnement
                </button>
              </Link>
              <Link href="/login">
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-center px-6 py-3 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_20px_rgba(99,102,241,0.7)] border border-indigo-500/50">
                  Commencer à jouer
                </button>
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
          >
            <Link href="#fonctionnement" className="flex flex-col items-center text-gray-400 hover:text-white transition-colors duration-300">
              <span className="text-sm mb-2">En savoir plus</span>
              <ChevronDown size={24} className="animate-bounce" />
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Section Fonctionnement */}
      <section id="fonctionnement" className="relative py-20 md:py-32 bg-gradient-to-b from-black/60 to-black/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-900/40 backdrop-blur-sm text-blue-400 text-sm mb-3">
              Comment ça marche
            </span>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Unlock the Full Potential of Your GitHub
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Gitify transforme chaque commit, pull request et contribution en opportunité de progression. Découvrez comment notre plateforme gamifie votre expérience de développement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Carte 1 */}
            <motion.div 
              className="bg-gradient-to-b from-indigo-950/60 to-blue-950/40 backdrop-blur-sm rounded-xl p-6 border border-indigo-900/30 shadow-xl group hover:shadow-indigo-900/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 p-3 bg-blue-600/20 rounded-lg w-fit">
                <GitBranch size={28} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Connexion GitHub</h3>
              <p className="text-gray-300 mb-4">
                Liez votre compte GitHub en un clic. Nous synchronisons automatiquement vos contributions et activités pour vous offrir une expérience personnalisée.
              </p>
              <div className="mt-auto pt-4 border-t border-indigo-800/30">
                <p className="text-sm text-indigo-300 flex items-center">
                  <span>Sécurisé et instantané</span>
                  <Shield size={16} className="ml-2" />
                </p>
              </div>
            </motion.div>
            
            {/* Carte 2 */}
            <motion.div 
              className="bg-gradient-to-b from-indigo-950/60 to-blue-950/40 backdrop-blur-sm rounded-xl p-6 border border-indigo-900/30 shadow-xl group hover:shadow-indigo-900/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 p-3 bg-violet-600/20 rounded-lg w-fit">
                <Trophy size={28} className="text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Gagnez des Badges</h3>
              <p className="text-gray-300 mb-4">
                Complétez des défis quotidiens et débloquez des badges exclusifs qui reflètent vos compétences et votre constance dans le développement.
              </p>
              <div className="mt-auto pt-4 border-t border-indigo-800/30">
                <p className="text-sm text-indigo-300 flex items-center">
                  <span>Plus de 50 badges à collectionner</span>
                  <Award size={16} className="ml-2" />
                </p>
              </div>
            </motion.div>
            
            {/* Carte 3 */}
            <motion.div 
              className="bg-gradient-to-b from-indigo-950/60 to-blue-950/40 backdrop-blur-sm rounded-xl p-6 border border-indigo-900/30 shadow-xl group hover:shadow-indigo-900/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 p-3 bg-blue-600/20 rounded-lg w-fit">
                <BarChart3 size={28} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Suivez Votre Progression</h3>
              <p className="text-gray-300 mb-4">
                Visualisez votre évolution avec des dashboards interactifs. Suivez vos streaks, comparez vos performances et fixez de nouveaux objectifs.
              </p>
              <div className="mt-auto pt-4 border-t border-indigo-800/30">
                <p className="text-sm text-indigo-300 flex items-center">
                  <span>Analytiques en temps réel</span>
                  <Zap size={16} className="ml-2" />
                </p>
              </div>
            </motion.div>
          </div>
          
          {/* Statistiques animées */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-6 rounded-lg bg-indigo-900/20 backdrop-blur-sm border border-indigo-800/30"
            >
              <h3 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                {count1}%
              </h3>
              <p className="text-gray-300">Amélioration de la productivité</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-6 rounded-lg bg-blue-900/20 backdrop-blur-sm border border-blue-800/30"
            >
              <h3 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                {count2}%
              </h3>
              <p className="text-gray-300">Augmentation des contributions</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="p-6 rounded-lg bg-violet-900/20 backdrop-blur-sm border border-violet-800/30"
            >
              <h3 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-2">
                {count3}K+
              </h3>
              <p className="text-gray-300">Utilisateurs actifs</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Section Avantages - Avant/Après */}
      <section id="avantages" className="relative py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-violet-900/40 backdrop-blur-sm text-violet-400 text-sm mb-3">
              Avantages
            </span>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              GitHub + Gitify = Productivité Maximale
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Découvrez comment Gitify transforme votre expérience de développement quotidienne et maximise votre impact sur les projets open source.
            </p>
          </div>
          
          {/* Comparaison Avant/Après */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Avant */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-gray-900/60 to-gray-900/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800/30 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-gray-800 text-gray-300 px-3 py-1 text-xs font-medium">
                AVANT
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-300 mt-4">GitHub Standard</h3>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-400">
                  <div className="bg-gray-800 rounded-full p-1 mt-0.5">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">Contributions sans contexte</span>
                    <p className="text-sm mt-1">Calendrier de contributions basique sans métriques significatives.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <div className="bg-gray-800 rounded-full p-1 mt-0.5">
                    <Target size={16} />
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">Pas d&apos;objectifs spécifiques</span>
                    <p className="text-sm mt-1">Absence d&apos;objectifs clairs pour guider votre progression.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <div className="bg-gray-800 rounded-full p-1 mt-0.5">
                    <Award size={16} />
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">Pas de reconnaissance</span>
                    <p className="text-sm mt-1">Manque de reconnaissance pour vos efforts quotidiens.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-gray-400">
                  <div className="bg-gray-800 rounded-full p-1 mt-0.5">
                    <BarChart3 size={16} />
                  </div>
                  <div>
                    <span className="font-medium text-gray-300">Statistiques limitées</span>
                    <p className="text-sm mt-1">Analyse sommaire de vos contributions sans insights détaillés.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
            
            {/* Après */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="bg-gradient-to-b from-indigo-900/60 to-blue-900/40 backdrop-blur-sm rounded-xl p-6 border border-indigo-700/30 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1 text-xs font-medium">
                AVEC GITIFY
              </div>
              <h3 className="text-2xl font-semibold mb-6 text-white mt-4">GitHub Gamifié</h3>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-200">
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full p-1 mt-0.5">
                    <Calendar size={16} className="text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-white">Streaks motivants</span>
                    <p className="text-sm mt-1">Suivez vos séries de contribution avec des récompenses croissantes.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-gray-200">
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full p-1 mt-0.5">
                    <Target size={16} className="text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-white">Challenges quotidiens</span>
                    <p className="text-sm mt-1">Défis personnalisés pour stimuler votre productivité et créativité.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-gray-200">
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full p-1 mt-0.5">
                    <Award size={16} className="text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-white">Badges et récompenses</span>
                    <p className="text-sm mt-1">Collection de badges uniques pour célébrer vos accomplissements.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-gray-200">
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full p-1 mt-0.5">
                    <BarChart3 size={16} className="text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-white">Analytics avancés</span>
                    <p className="text-sm mt-1">Visualisez votre progression avec des tableaux de bord interactifs détaillés.</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center">
            <Link href="/login">
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-center px-6 py-3 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_20px_rgba(99,102,241,0.7)] border border-indigo-500/50">
                Commencer mon expérience Gitify
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <Testimonials />
      
      {/* Section FAQ */}
      <FAQ />
      
      {/* Footer */}
      <Footer />
    </main>
  );
} 