import React from 'react';
import Breadcrumb from '../../Components/breadcrumb';

const Content = () => {
  return (
    <>
      <section className="px-4 md:px-8">
        <Breadcrumb pagename={"guide"}/>
        {/* Hero Section */}
        <div className="flex flex-col justify-between gap-4">
          <div className="md:w-1/2">
            <div className="text-[46px] mb-[20px]">
              Bienvenue sur <span className="gradient">Gitify .</span>
            </div>
            <div className="text-[14px] text-[#7E7F81] mb-[40px] md:mb-[150px] lg:mb-[150px] xl:mb-[26px]">
              Avant de commencer, voici quelques informations importantes. Gitify est un SaaS entièrement gratuit, conçu pour rendre l&apos;utilisation de GitHub plus accessible et amusante. 
              En réalisant des commits réguliers, tu peux obtenir des badges qui servent de défis. 
              <br /><br />
              Ces badges ont une double vocation : montrer que l&apos;on peut relever des défis tout en développant des projets open source, mais aussi aider à devenir plus productif et régulier dans le développement web.
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-none border-[#1D1D1D] my-[30px]"></div>

        {/* Fonctionnement */}
        <div className="text-[20px] md:text-[26px] mb-6">
          Comment ça marche ?
        </div>
        <div className="text-[14px] text-[#7E7F81] mb-[40px]">
          Gitify repose sur un système simple de badges basés sur des règles et objectifs précis. 
          Lorsqu&apos;un objectif est atteint, un badge est débloqué et visible sur ta page dédiée, un peu comme une salle de trophées.
          <br /><br />
          Il te suffit de connecter ton compte GitHub pour commencer à utiliser la plateforme.
        </div>

        {/* Classements et Fonctionnalités */}
        <div className="text-[20px] md:text-[26px] mb-6">
          Fonctionnalités
        </div>
        <div className="text-[14px] text-[#7E7F81] mb-[60px]">
          Gitify propose également des classements pour voir qui sont les développeurs les plus réguliers, des événements (en développement), des défis, une gestion de profil, et une page dédiée aux feedbacks. 
          <br /><br />
          Ton avis est précieux pour améliorer la plateforme et ajouter de nouvelles fonctionnalités dans les prochaines versions !
        </div>

        {/* FAQ */}
        <div className="text-[20px] md:text-[26px] mb-6">
          FAQ
        </div>
        <div className="space-y-4">
          <div>
            <div className="font-semibold">Comment je me lance dans l&apos;aventure Gitify ?</div>
            <div className="text-[14px] text-[#7E7F81]">Il te suffit de te connecter via ton compte GitHub, et tu pourras commencer à gagner des badges immédiatement.</div>
          </div>
          <div>
            <div className="font-semibold">Y a-t-il d&apos;autres récompenses pour les défis réalisés ?</div>
            <div className="text-[14px] text-[#7E7F81]">Pour le moment non, mais c&apos;est en développement !</div>
          </div>
          <div>
            <div className="font-semibold">Est-ce que Gitify fonctionne avec des organisations GitHub ?</div>
            <div className="text-[14px] text-[#7E7F81]">Pas encore, mais nous prévoyons d&apos;ajouter cette fonctionnalité dans une future mise à jour.</div>
          </div>
          <div>
            <div className="font-semibold">Les badges sont-ils visibles publiquement ?</div>
            <div className="text-[14px] text-[#7E7F81]">Oui, chaque utilisateur a une page dédiée affichant les badges obtenus.</div>
          </div>
          <div>
            <div className="font-semibold">Puis-je supprimer mon compte Gitify ?</div>
            <div className="text-[14px] text-[#7E7F81]">Oui, une option dans les paramètres te permet de supprimer ton compte et toutes tes données.</div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Content;
