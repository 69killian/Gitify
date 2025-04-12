"use client"
import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

// Questions et réponses pour la FAQ
const faqItems = [
  {
    question: "Comment Gitify se connecte-t-il à mon compte GitHub ?",
    answer: "Gitify utilise l'API OAuth de GitHub pour se connecter de manière sécurisée à votre compte. Nous ne stockons jamais vos informations d'identification GitHub, et vous pouvez révoquer l'accès à tout moment depuis vos paramètres GitHub."
  },
  {
    question: "Est-ce que Gitify est gratuit ?",
    answer: "Oui, Gitify est entièrement gratuit pour tous les utilisateurs. Nous proposons toutes les fonctionnalités de base sans aucune limitation. À l'avenir, nous pourrions introduire un plan premium avec des fonctionnalités supplémentaires."
  },
  {
    question: "Comment les badges sont-ils débloqués ?",
    answer: "Les badges sont débloqués en fonction de vos activités sur GitHub et de l'accomplissement de défis spécifiques. Par exemple, vous pouvez obtenir des badges pour maintenir un streak de contribution, pour contribuer à des projets open source, ou pour atteindre un certain nombre de pull requests."
  },
  {
    question: "Mes données GitHub sont-elles sécurisées avec Gitify ?",
    answer: "Absolument. Nous prenons la sécurité très au sérieux. Gitify n'accède qu'aux données publiques de votre profil GitHub et n'a jamais accès à votre code privé. Nous utilisons le chiffrement de bout en bout pour toutes les communications."
  },
  {
    question: "Puis-je utiliser Gitify avec d'autres plateformes que GitHub ?",
    answer: "Actuellement, Gitify est optimisé pour GitHub uniquement. Cependant, nous envisageons d'ajouter le support pour GitLab et Bitbucket dans le futur, selon les demandes de notre communauté."
  }
];

export default function FAQ() {
  // État pour suivre quelle question est ouverte
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // Fonction pour basculer l'état d'ouverture d'une question
  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section id="faq" className="relative py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-violet-900/40 backdrop-blur-sm text-violet-400 text-sm mb-3">
            FAQ
          </span>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            Questions Fréquentes
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur Gitify et comment il peut transformer votre expérience de développement.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <button
                className={`w-full text-left p-5 rounded-xl bg-gradient-to-b ${
                  openIndex === index 
                    ? "from-indigo-900/80 to-blue-900/60 border-b border-indigo-700/50" 
                    : "from-indigo-950/60 to-blue-950/40"
                } backdrop-blur-sm border border-indigo-900/30 transition-all duration-300 hover:shadow-md hover:shadow-indigo-900/10`}
                onClick={() => toggleQuestion(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HelpCircle size={20} className="text-indigo-400" />
                    <h3 className="font-medium text-white">{item.question}</h3>
                  </div>
                  <ChevronDown 
                    size={20} 
                    className={`text-indigo-400 transition-transform duration-300 ${
                      openIndex === index ? "transform rotate-180" : ""
                    }`} 
                  />
                </div>
                
                {openIndex === index && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pl-8 text-gray-300"
                  >
                    <p>{item.answer}</p>
                  </motion.div>
                )}
              </button>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Vous ne trouvez pas la réponse à votre question ?</p>
          <a 
            href="mailto:support@gitify.com" 
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
          >
            <span>Contactez notre support</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
} 