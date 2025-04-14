"use client"
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { signIn, signOut } from 'next-auth/react';
import Breadcrumb from '../../Components/breadcrumb';
import { Trash2, Loader2 } from 'lucide-react';
import LeftParticles from '../../Components/images/Group 194.svg';
import RightParticles from '../../Components/images/Group 191.svg';
import Link from 'next/link';
import DoubleConfirmModal from '@/components/ui/DoubleConfirmModal';

interface Service {
  name: string;
  status: string;
  permissions: string;
  icon: string;
}

const Integrations = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  // Récupérer les intégrations depuis l'API
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const response = await fetch('/api/integrations');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des intégrations');
        }
        
        const data = await response.json();
        
        if (data.success && data.services) {
          setServices(data.services);
        } else {
          setError(data.error || 'Erreur inconnue');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIntegrations();
  }, []);

  // Gérer la connexion GitHub
  const handleConnect = (service: string) => {
    if (service === "GitHub") {
      signIn('github', { callbackUrl: '/integrations' });
    } else {
      // Pour les futurs services
      alert(`La connexion à ${service} n'est pas encore disponible.`);
    }
  };

  // Gérer la révocation GitHub
  const handleRevoke = () => {
    setModalOpen(true);
  };

  // Confirmer la révocation et supprimer le compte
  const confirmRevoke = async () => {
    setIsRevoking(true);
    
    try {
      const response = await fetch('/api/integrations/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Déconnexion de l'utilisateur après révocation réussie
        signOut({ callbackUrl: '/' });
      } else {
        setError(data.error || 'Erreur lors de la révocation');
        setIsRevoking(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setIsRevoking(false);
    }
  };

  return (
    <section className="px-4 md:px-8">
      <Breadcrumb pagename="integrations" />

      <div className='flex flex-col gap-10 items-start'>
        <div className='text-[25px] text-white'>Gérer mes <span className='gradient'>Intégrations</span></div>
        
        {isLoading ? (
          <div className="flex items-center justify-center w-full py-12">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 bg-red-500/10 rounded-lg w-full">
            {error}
          </div>
        ) : (
          <div className='flex flex-col gap-6 w-full'>
            {services.map((service, index) => (
              <div 
                key={index} 
                className='flex justify-between items-center py-3 px-6 bg-[#1B1B1B] hover:bg-[#160E1E] transition-colors duration-300 rounded-[8px] p-1 shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-[200px] h-[82px] rounded-[6px] border border-[#292929] w-full sm:w-[500px]'>
                <div className='flex items-center gap-4'>
                  <Image src={service.icon} alt={service.name} width={40} height={40} className='rounded-md'/>
                  <div>
                    <div className='text-white text-[18px]'>{service.name}</div>
                    <div className='text-gray-400 text-[14px]'>{service.permissions}</div>
                  </div>
                </div>
                <div>
                  {service.status === "Connecté" ? (
                    <button 
                      className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-all"
                      onClick={handleRevoke}
                      disabled={isRevoking}
                    >
                      {isRevoking ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18}/>
                      )}
                      Révoquer
                    </button>
                  ) : (
                    <button 
                      className="text-[13.49px] bg-violet-800 hover:bg-violet-600 transition-all duration-200 px-4 py-2 text-white rounded-md border border-violet-500"
                      onClick={() => handleConnect(service.name)}
                    >
                      Connecter
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Separator */}
        <div className="border-b border-[#3B3B3B]/30 my-[50px] w-full sm:w-[500px]"></div>

        <div className='text-[18px] text-gray-300'>Gère les autorisations et les accès accordés à Gitify.</div>
        <button disabled className="cursor-not-allowed relative z-10 py-3 px-6 bg-[#1B1B1B] hover:bg-[#160E1E]  text-center transition-colors duration-300 rounded-[8px] p-1 shadow-md shadow-[#101010] border-t-2 border-gray-300/10 w-[280px] h-[52px] rounded-[6px] border border-[#292929] text-[16px] flex justify-center items-center">
          <Image src={LeftParticles} alt="Left Particles" className="absolute left-0" />
          <Link href="https://github.com/settings/connections/applications/gitify" className="flex items-center gap-2 text-white cursor-not-allowed">
          Gérer les <span className="gradient cursor-not-allowed">Autorisations</span>
          </Link>
          <Image src={RightParticles} alt="Right Particles" className="absolute right-0" />
        </button>
      </div>

      {/* Modal de confirmation pour la révocation */}
      <DoubleConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmRevoke}
        title="Révoquer l'intégration GitHub"
        message="Êtes-vous sûr de vouloir révoquer l'intégration GitHub ? Cette action ne peut pas être annulée."
        confirmMessage="ATTENTION : La révocation de l'intégration GitHub entraînera la suppression complète de votre compte Gitify et de toutes vos données, y compris vos streaks, badges, et contributions."
        confirmLabel="Je comprends"
        finalConfirmLabel="Confirmer la suppression"
      />
    </section>
  );
};

export default Integrations;