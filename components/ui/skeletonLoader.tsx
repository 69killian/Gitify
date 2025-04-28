import React from 'react';

interface SkeletonLoaderProps {
  rows?: number;
  cols?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  rows = 7,  // Par défaut, nous affichons 7 rangées
  cols = 120  // Augmenté à 120 colonnes pour montrer beaucoup plus de contributions
}) => {
  // Création d'un tableau pour le nombre de cellules
  const cells = Array.from({ length: rows * cols }, (_, i) => i);
  
  return (
    <div className="bg-[#241730] transition-all duration-200 w-full h-[250px] rounded-[6px] border border-1 border-[#292929] flex justify-center items-center overflow-hidden">
      <div className="overflow-x-auto overflow-y-hidden h-[250px] w-full flex items-center pl-5">
        <div className="grid grid-cols-7 gap-1 rotate-90 py-4 px-6 min-w-max mx-auto">
          {cells.map((index) => (
            <div
              key={index}
              className="w-[25px] h-[25px] bg-[#321A47] animate-pulse rounded-md"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader; 