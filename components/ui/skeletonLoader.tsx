import React from 'react';

interface SkeletonLoaderProps {
  rows?: number;
  cols?: number;
  variant?: 'calendar' | 'text' | 'stat' | 'badge';
  width?: string;
  height?: string;
  count?: number;
}

// Composant pour le skeleton loader du calendrier
const CalendarSkeleton: React.FC<{ rows: number; cols: number }> = ({ rows, cols }) => {
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

// Composant pour le skeleton loader de texte (bienvenue)
const TextSkeleton: React.FC<{ width: string; height: string }> = ({ width, height }) => {
  return (
    <div 
      className={`bg-[#321A47] animate-pulse rounded-md`}
      style={{ width, height }}
    ></div>
  );
};

// Composant pour le skeleton loader des statistiques
const StatSkeleton: React.FC = () => {
  return (
    <div className="text-[14px] flex items-center gap-4">
      <div className="w-[75px] h-[75px] bg-[#321A47] animate-pulse rounded-md"></div>
      <div className="grid gap-2">
        <div className="w-[100px] h-[20px] bg-[#321A47] animate-pulse rounded-md"></div>
        <div className="w-[60px] h-[24px] bg-[#321A47] animate-pulse rounded-full"></div>
      </div>
    </div>
  );
};

// Composant pour le skeleton loader des badges
const BadgesSkeleton: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <div 
          key={i}
          className="bg-[#241730] border border-violet-900/30 p-4 rounded-md shadow-md flex flex-col items-center text-center h-[150px]"
        >
          <div className="w-[40px] h-[40px] bg-[#321A47] animate-pulse rounded-md mb-2"></div>
          <div className="w-[100px] h-[16px] bg-[#321A47] animate-pulse rounded-md"></div>
          <div className="w-[120px] h-[12px] bg-[#321A47] animate-pulse rounded-md mt-2"></div>
        </div>
      ))}
    </div>
  );
};

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  rows = 7,
  cols = 120,
  variant = 'calendar',
  width = '100%',
  height = '20px',
  count = 4
}) => {
  switch (variant) {
    case 'text':
      return <TextSkeleton width={width} height={height} />;
    case 'stat':
      return <StatSkeleton />;
    case 'badge':
      return <BadgesSkeleton count={count} />;
    case 'calendar':
    default:
      return <CalendarSkeleton rows={rows} cols={cols} />;
  }
};

export default SkeletonLoader; 