"use client"
import { Send, ThumbsUp, AlertCircle, MessageSquare } from "lucide-react";
import Breadcrumb from '../../Components/breadcrumb';

const FeedbackSupport = () => {
  return (
    <>
      <div className="mb-8">
        <Breadcrumb pagename="support"/>
        <h1 className="text-[25px] mb-4">
          Gérer mes <span className="gradient">Feedback</span> 💬
        </h1>
        <p className="text-gray-400">
          Partagez vos suggestions et signalez des problèmes pour nous aider à améliorer Gitify.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-6">Envoyer un feedback</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Type de feedback
                </label>
                <select className="w-full bg-[#0E0913] border border-violet-900/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-700 outline-none transition-all duration-200">
                  <option>Suggestion</option>
                  <option>Bug</option>
                  <option>Question</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Sujet
                </label>
                <input
                  type="text"
                  className="w-full bg-[#0E0913] border border-violet-900/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-700 outline-none transition-all duration-200"
                  placeholder="Résumez votre feedback en quelques mots"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full bg-[#0E0913] border border-violet-900/20 rounded-lg px-4 py-2 h-32 focus:ring-2 focus:ring-violet-700 outline-none transition-all duration-200"
                  placeholder="Décrivez en détail votre feedback..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Captures d&rsquo;écran (optionnel)
                </label>
                <div className="border-2 border-dashed border-violet-900/20 rounded-lg p-8 text-center">
                  <p className="text-gray-400">
                    Glissez-déposez vos images ici ou
                    <button className="text-violet-400 ml-1">parcourez</button>
                  </p>
                </div>
              </div>
              <button type="submit" className="btn-primary flex items-center gap-2">
                <Send className="w-4 h-4" />
                Envoyer le feedback
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Mes feedbacks</h2>
            {[
              {
                type: "suggestion",
                title: "Ajout de nouveaux badges",
                status: "En cours",
                date: "Il y a 2 jours"
              },
              {
                type: "bug",
                title: "Problème d'affichage du calendrier",
                status: "Résolu",
                date: "Il y a 1 semaine"
              },
              {
                type: "question",
                title: "Comment configurer les webhooks ?",
                status: "Répondu",
                date: "Il y a 2 semaines"
              }
            ].map((feedback) => (
              <div key={feedback.title} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {feedback.type === "suggestion" && (
                      <ThumbsUp className="w-6 h-6 text-violet-500" />
                    )}
                    {feedback.type === "bug" && (
                      <AlertCircle className="w-6 h-6 text-red-500" />
                    )}
                    {feedback.type === "question" && (
                      <MessageSquare className="w-6 h-6 text-blue-500" />
                    )}
                    <div>
                      <h3 className="font-semibold">{feedback.title}</h3>
                      <p className="text-sm text-gray-400">{feedback.date}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    feedback.status === 'En cours'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : feedback.status === 'Résolu'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {feedback.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">FAQ</h3>
            <div className="space-y-4">
              {[
                {
                  question: "Comment fonctionne le système de badges ?",
                  answer: "Les badges sont débloqués automatiquement lorsque vous atteignez certains objectifs dans vos contributions."
                },
                {
                  question: "Comment synchroniser mon compte GitHub ?",
                  answer: "Allez dans les paramètres d'intégration et suivez les étapes de connexion GitHub."
                },
                {
                  question: "Comment participer aux événements ?",
                  answer: "Consultez la page Événements et inscrivez-vous aux événements qui vous intéressent."
                }
              ].map((item) => (
                <details key={item.question} className="group">
                  <summary className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm">{item.question}</span>
                    <span className="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shapeRendering="geometricPrecision"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-2 text-sm text-gray-400">
                    {item.answer}
                  </p>
                </details>
              
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Ressources utiles</h3>
            <div className="space-y-4">
              <a href="#" className="block p-4 bg-violet-900/20 rounded-lg hover:bg-violet-900/30 transition-colors">
                <h4 className="font-medium mb-1">Guide de démarrage</h4>
                <p className="text-sm text-gray-400">Apprenez les bases de Gitify</p>
              </a>
              <a href="#" className="block p-4 bg-violet-900/20 rounded-lg hover:bg-violet-900/30 transition-colors">
                <h4 className="font-medium mb-1">Documentation API</h4>
                <p className="text-sm text-gray-400">Intégrez Gitify à vos projets</p>
              </a>
              <a href="#" className="block p-4 bg-violet-900/20 rounded-lg hover:bg-violet-900/30 transition-colors">
                <h4 className="font-medium mb-1">Blog technique</h4>
                <p className="text-sm text-gray-400">Dernières actualités et tutoriels</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackSupport;
