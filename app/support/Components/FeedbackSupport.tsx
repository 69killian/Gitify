"use client"
import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Send, ThumbsUp, AlertCircle, MessageSquare, Upload, Loader2, Check, ShieldCheck } from "lucide-react";
import Breadcrumb from '../../Components/breadcrumb';
import { useSession } from "next-auth/react";
import useSWR, { mutate } from 'swr';
import Link from 'next/link';

type FeedbackType = "Suggestion" | "Bug" | "Question" | "Autre";
type FeedbackStatus = "pending" | "En cours" | "Résolu" | "Répondu";

interface FeedbackItem {
  id: number;
  type: string;
  title: string;
  description: string;
  status: FeedbackStatus;
  date: string;
  screenshots?: string[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const FeedbackSupport = () => {
  const { data: session } = useSession();
  const { data: feedbackData, error: feedbackError } = useSWR(
    session ? '/api/feedback' : null,
    fetcher
  );

  // Vérifier si l'utilisateur est un administrateur (github_id 145566954)
  const isAdmin = session?.user?.github_id === "145566954";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [type, setType] = useState<FeedbackType>("Suggestion");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation des champs
    if (!title.trim()) {
      setSubmitError("Le sujet est requis");
      return;
    }
    
    if (!description.trim()) {
      setSubmitError("La description est requise");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Gestion des images
      let screenshotUrls: string[] = [];
      
      if (files.length > 0) {
        // Dans une implémentation réelle, vous téléchargeriez les fichiers sur un service comme Cloudinary
        // et récupéreriez les URLs. Ici, nous simulons ce processus.
        screenshotUrls = files.map(file => URL.createObjectURL(file));
      }
      
      const feedbackData = {
        type,
        title,
        description,
        screenshots: screenshotUrls
      };
      
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du feedback');
      }
      
      // Réinitialiser le formulaire
      setType("Suggestion");
      setTitle("");
      setDescription("");
      setFiles([]);
      setSubmitSuccess(true);
      
      // Rafraîchir les données des feedbacks
      mutate('/api/feedback');
      
      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Erreur:', error);
      setSubmitError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <Breadcrumb pagename="support"/>
        <div className="flex justify-between items-center">
          <h1 className="text-[25px] mb-4">
            Gérer mes <span className="gradient">Feedback</span> 💬
          </h1>
          
          {isAdmin && (
            <Link href="/admin/feedback" className="btn-primary bg-gray-900 px-4 py-2 rounded-md border border-violet-700 hover:bg-gray-900/80 transition-all duration-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span className="gradient inline-flex whitespace-nowrap">
                Accéder à l&apos;espace admin
              </span>
            </Link>
          )}
        </div>
        <p className="text-gray-400">
          Partagez vos suggestions et signalez des problèmes pour nous aider à améliorer Gitify.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-6">Envoyer un feedback</h2>
            {!session ? (
              <div className="text-center p-6 border border-violet-900/20 rounded-lg">
                <p className="text-gray-400 mb-4">Connectez-vous pour soumettre un feedback</p>
                <button className="btn-primary">Se connecter</button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                {submitError && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg">
                    {submitError}
                  </div>
                )}
                
                {submitSuccess && (
                  <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-3 rounded-lg flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Votre feedback a été envoyé avec succès!
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Type de feedback
                  </label>
                  <select 
                    className="w-full bg-[#0E0913] border border-violet-900/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-700 outline-none transition-all duration-200"
                    value={type}
                    onChange={(e) => setType(e.target.value as FeedbackType)}
                  >
                    <option value="Suggestion">Suggestion</option>
                    <option value="Bug">Bug</option>
                    <option value="Question">Question</option>
                    <option value="Autre">Autre</option>
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
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full bg-[#0E0913] border border-violet-900/20 rounded-lg px-4 py-2 h-32 focus:ring-2 focus:ring-violet-700 outline-none transition-all duration-200"
                    placeholder="Décrivez en détail votre feedback..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Captures d&rsquo;écran (optionnel)
                  </label>
                  <div 
                    className="border-2 border-dashed border-violet-900/20 rounded-lg p-8 text-center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                    
                    {files.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <Upload className="w-4 h-4 text-violet-400" />
                          <span className="text-violet-400">{files.length} fichier(s) sélectionné(s)</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 justify-center">
                          {files.map((file, index) => (
                            <div key={index} className="relative w-16 h-16 rounded-md overflow-hidden">
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        
                        <button 
                          type="button" 
                          onClick={handleBrowseClick}
                          className="text-violet-400 text-sm"
                        >
                          Ajouter plus
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-400">
                        Glissez-déposez vos images ici ou
                        <button 
                          type="button"
                          onClick={handleBrowseClick} 
                          className="text-violet-400 ml-1"
                        >
                          parcourez
                        </button>
                      </p>
                    )}
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="btn-primary bg-gray-900 px-4 py-2 rounded-md border border-violet-700 hover:bg-gray-900/80 transition-all duration-200 flex items-center gap-2" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-violet-400" />
                      <span className="gradient whitespace-nowrap">Envoyer le feedback</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Mes feedbacks</h2>
            {!session ? (
              <div className="card text-center p-6">
                <p className="text-gray-400">Connectez-vous pour voir vos feedbacks</p>
              </div>
            ) : feedbackError ? (
              <div className="card bg-red-500/10 border border-red-500/30">
                <p className="text-red-400">Une erreur s&apos;est produite lors du chargement de vos feedbacks</p>
              </div>
            ) : !feedbackData ? (
              <div className="card p-8 flex justify-center">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
              </div>
            ) : feedbackData.length === 0 ? (
              <div className="card text-center p-6">
                <p className="text-gray-400">Vous n&apos;avez pas encore envoyé de feedback</p>
              </div>
            ) : (
              feedbackData.map((feedback: FeedbackItem) => (
                <div key={feedback.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      {feedback.type === "Suggestion" && (
                        <ThumbsUp className="w-6 h-6 text-violet-500" />
                      )}
                      {feedback.type === "Bug" && (
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      )}
                      {feedback.type === "Question" && (
                        <MessageSquare className="w-6 h-6 text-blue-500" />
                      )}
                      <div>
                        <h3 className="font-semibold">{feedback.title}</h3>
                        <p className="text-sm text-gray-400">{new Date(feedback.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      feedback.status === 'En cours'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : feedback.status === 'Résolu'
                        ? 'bg-green-500/20 text-green-400'
                        : feedback.status === 'Répondu'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {feedback.status}
                    </div>
                  </div>
                </div>
              ))
            )}
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
