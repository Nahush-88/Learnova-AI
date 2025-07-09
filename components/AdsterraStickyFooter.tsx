import React from 'react';

/**
 * NOTE: For a real-world scenario, you would likely need a *different* 
 * ad unit code from Adsterra for a sticky footer ad. 
 * This component creates the styled, sticky container.
 * You would then place the corresponding Adsterra code inside it,
 * similar to the AdsterraBanner component.
 */
export const AdsterraStickyFooter: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 flex justify-center items-center p-2 h-[72px]">
      {/* 
        This is a placeholder. You would replace this with the actual 
        Adsterra banner component if they provide a separate tag for a 
        sticky unit (e.g., 320x50 or 728x90). 
        For now, we'll simulate the space.
      */}
      <div className="text-sm text-slate-500">
        {/* For demonstration, we'll just show a placeholder. In a real app,
            you'd put another <AdsterraBanner> here with a *different* ad ID. */}
        Ad Placeholder
      </div>
    </div>
  );
};