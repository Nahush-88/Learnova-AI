import React, { useEffect, useRef } from 'react';

export const AdsterraBanner: React.FC = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = adContainerRef.current;
    if (container) {
      // Clear previous ad scripts to handle React's fast refresh in development
      container.innerHTML = '';
      
      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      
      // Your new script URL for the main banner
      script.src = "//pl27115344.profitableratecpm.com/10e017a5429fa7ffabcdbb09cefba13f/invoke.js";
      
      container.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full flex justify-center my-4">
      {/* Your new container ID for the main banner */}
      <div ref={adContainerRef} id="container-10e017a5429fa7ffabcdbb09cefba13f"></div>
    </div>
  );
};