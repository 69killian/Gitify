import Link from "next/link";
import { Github, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-black/60 backdrop-blur-md pt-16 pb-8 border-t border-indigo-950/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo et description */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent mb-4">
              Gitify.
            </h2>
            <p className="text-gray-400 mb-4 max-w-xs">
              Transformez votre expérience GitHub en un voyage ludique et motivant vers une productivité maximale.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-200">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          
          {/* Liens Produit */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produit</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#fonctionnement" className="text-gray-400 hover:text-indigo-300 transition-colors duration-200">
                  Fonctionnement
                </Link>
              </li>
              <li>
                <Link href="#avantages" className="text-gray-400 hover:text-indigo-300 transition-colors duration-200">
                  Avantages
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-300 transition-colors duration-200">
                  Tarification
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-300 transition-colors duration-200">
                  Guide d'utilisation
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Liens Entreprise */}
          <div>
            <h3 className="text-white font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-300 transition-colors duration-200">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-300 transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-300 transition-colors duration-200">
                  Carrières
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-300 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Liens Légaux */}
          <div>
            <h3 className="text-white font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-300 transition-colors duration-200">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-300 transition-colors duration-200">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-300 transition-colors duration-200">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-indigo-300 transition-colors duration-200">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Séparateur */}
        <div className="border-t border-indigo-950/30 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {currentYear} Gitify. Tous droits réservés.
            </p>
            <p className="text-gray-500 text-sm">
              Conçu avec ❤️ pour les développeurs passionnés
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 