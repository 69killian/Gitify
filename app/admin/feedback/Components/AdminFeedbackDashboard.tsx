"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import useSWR, { mutate } from 'swr';
import { ThumbsUp, AlertCircle, MessageSquare, Loader2, Check, Filter, Search, MoreHorizontal } from "lucide-react";
import Breadcrumb from '../../../Components/breadcrumb';
import Image from "next/image";

// Types
type FeedbackStatus = "pending" | "En cours" | "Résolu" | "Répondu";

interface Feedback {
  id: number;
  type: string;
  title: string;
  description: string;
  status: FeedbackStatus;
  date: string;
  screenshots?: string[];
  user?: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}

interface StatusModalProps {
  feedback: Feedback;
  onClose: () => void;
  onStatusChange: (id: number, status: FeedbackStatus) => void;
}

// Helper pour le fetcher
const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Composant de modal pour changer le statut
const StatusChangeModal = ({ feedback, onClose, onStatusChange }: StatusModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<FeedbackStatus>(feedback.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async () => {
    if (selectedStatus === feedback.status) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/feedback/${feedback.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Une erreur est survenue');
      }

      onStatusChange(feedback.id, selectedStatus);
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-[#0E0913] rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Changer le statut du feedback</h3>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <p className="font-medium">{feedback.title}</p>
          <p className="text-sm text-gray-400">ID: {feedback.id}</p>
        </div>
        
        <div className="space-y-2 mb-6">
          <p className="text-sm font-medium text-gray-400 mb-1">Statut actuel: 
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
              feedback.status === 'En cours'
                ? 'bg-yellow-500/20 text-yellow-400'
                : feedback.status === 'Résolu'
                ? 'bg-green-500/20 text-green-400'
                : feedback.status === 'Répondu'
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-gray-500/20 text-gray-400'
            }`}>
              {feedback.status}
            </span>
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Nouveau statut
            </label>
            <select 
              className="w-full bg-[#1A1523] border border-violet-900/20 rounded-lg px-4 py-2 focus:ring-2 focus:ring-violet-700 outline-none transition-all duration-200"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as FeedbackStatus)}
            >
              <option value="pending">En attente</option>
              <option value="En cours">En cours</option>
              <option value="Répondu">Répondu</option>
              <option value="Résolu">Résolu</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-violet-900/20 text-gray-400 hover:bg-violet-900/10 transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={handleStatusChange}
            className="btn-primary flex items-center gap-2"
            disabled={isSubmitting || selectedStatus === feedback.status}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Confirmer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant principal
const AdminFeedbackDashboard = () => {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState<number | null>(null);

  // Récupérer tous les feedbacks (admin uniquement)
  const { data: feedbacks, error: feedbacksError } = useSWR(
    session ? '/api/feedback/admin' : null,
    fetcher
  );

  const handleStatusChange = (id: number, newStatus: FeedbackStatus) => {
    // Mettre à jour localement les données
    if (feedbacks) {
      const updatedFeedbacks = feedbacks.map((feedback: Feedback) => 
        feedback.id === id ? { ...feedback, status: newStatus } : feedback
      );
      
      // Mettre à jour le cache SWR
      mutate('/api/feedback/admin', updatedFeedbacks, false);
    }
  };

  const openStatusModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedFeedback(null);
  };

  const toggleExpandFeedback = (id: number) => {
    if (expandedFeedback === id) {
      setExpandedFeedback(null);
    } else {
      setExpandedFeedback(id);
    }
  };

  // Filtrer les feedbacks
  const filteredFeedbacks = feedbacks ? feedbacks.filter((feedback: Feedback) => {
    const matchesSearch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          feedback.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || feedback.status === statusFilter;
    
    const matchesType = typeFilter === "all" || feedback.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }) : [];

  // Obtenir les types de feedback uniques pour le filtre
  const feedbackTypes = feedbacks ? 
    Array.from(new Set(feedbacks.map((feedback: Feedback) => feedback.type))) as string[] : 
    [];

  // Vérifier si l'utilisateur est un administrateur (github_id 145566954)
  const isAdmin = session?.user?.github_id === "145566954";

  if (!session) {
    return (
      <div className="card text-center p-6">
        <p className="text-gray-400">Connectez-vous pour accéder au tableau de bord administrateur</p>
        <button className="btn-primary mt-4">Se connecter</button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="card bg-red-500/10 border border-red-500/30 p-6 text-center">
        <p className="text-red-400">Vous n&apos;avez pas les autorisations nécessaires pour accéder à cette page</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <Breadcrumb pagename="admin/feedback"/>
        <h1 className="text-[25px] mb-4">
          Gestion des <span className="gradient">Feedbacks</span> 💬
        </h1>
        <p className="text-gray-400">
          Consultez et gérez tous les feedbacks soumis par les utilisateurs.
        </p>
      </div>

      <div className="card mb-6">
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Recherche */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-[#1A1523] border border-violet-900/20 rounded-lg focus:ring-2 focus:ring-violet-700 outline-none transition-all duration-200"
              placeholder="Rechercher un feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filtres */}
          <div className="flex gap-2">
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 bg-[#1A1523] border border-violet-900/20 rounded-lg focus:ring-2 focus:ring-violet-700 outline-none transition-all duration-200"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="En cours">En cours</option>
                <option value="Répondu">Répondu</option>
                <option value="Résolu">Résolu</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <select
                className="pl-10 pr-4 py-2 bg-[#1A1523] border border-violet-900/20 rounded-lg focus:ring-2 focus:ring-violet-700 outline-none transition-all duration-200"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Tous les types</option>
                {feedbackTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des feedbacks */}
        {feedbacksError ? (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
            <p className="text-red-400">Une erreur s&apos;est produite lors du chargement des feedbacks</p>
          </div>
        ) : !feedbacks ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="text-center p-6 border border-violet-900/20 rounded-lg">
            <p className="text-gray-400">Aucun feedback ne correspond à vos critères de recherche</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-violet-900/20">
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Titre</th>
                  <th className="px-4 py-3 text-left">Utilisateur</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.map((feedback: Feedback) => (
                  <tr 
                    key={feedback.id} 
                    className="border-b border-violet-900/20 hover:bg-violet-900/5 transition-colors"
                  >
                    <td className="px-4 py-3">#{feedback.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {feedback.type === "Suggestion" && (
                          <ThumbsUp className="w-5 h-5 text-violet-500 mr-2" />
                        )}
                        {feedback.type === "Bug" && (
                          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        )}
                        {feedback.type === "Question" && (
                          <MessageSquare className="w-5 h-5 text-blue-500 mr-2" />
                        )}
                        {feedback.type}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium">{feedback.title}</span>
                        {expandedFeedback === feedback.id && (
                          <p className="text-sm text-gray-400 mt-2">{feedback.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {feedback.user?.image ? (
                          <Image 
                            src={feedback.user.image} 
                            alt={feedback.user.name || "Utilisateur"} 
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full mr-2" 
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center mr-2">
                            <span className="text-violet-500 text-xs">
                              {feedback.user?.name?.charAt(0) || "U"}
                            </span>
                          </div>
                        )}
                        <span>{feedback.user?.name || "Utilisateur inconnu"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(feedback.date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        feedback.status === 'En cours'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : feedback.status === 'Résolu'
                          ? 'bg-green-500/20 text-green-400'
                          : feedback.status === 'Répondu'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {feedback.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleExpandFeedback(feedback.id)}
                          className="p-1 rounded hover:bg-violet-900/20 transition-colors"
                          title={expandedFeedback === feedback.id ? "Réduire" : "Détails"}
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </button>
                        <button
                          onClick={() => openStatusModal(feedback)}
                          className="p-1 rounded hover:bg-violet-900/20 transition-colors text-violet-400"
                          title="Changer le statut"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showStatusModal && selectedFeedback && (
        <StatusChangeModal 
          feedback={selectedFeedback} 
          onClose={closeStatusModal} 
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
};

export default AdminFeedbackDashboard; 