import React from 'react';

interface TooltipProps {
  content: React.ReactNode;
  visible: boolean;
  x: number;
  y: number;
  offset?: { x: number; y: number };
}

const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  visible, 
  x, 
  y, 
  offset = { x: 15, y: 15 } 
}) => {
  if (!visible) return null;

  return (
    <div
      className="fixed z-50 px-3 py-2 text-sm text-white bg-[#321A47] rounded-md shadow-md pointer-events-none border border-[#523469]"
      style={{
        left: `${x + offset.x}px`,
        top: `${y + offset.y}px`,
        transform: 'translate(0, -50%)',
        maxWidth: '250px',
      }}
    >
      {content}
    </div>
  );
};

export default Tooltip; 