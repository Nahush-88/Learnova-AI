import React, { useEffect } from 'react';

// This component requires the AdSense script to be loaded. It's added in index.html.
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const GoogleAdsenseStickyFooter: React.FC = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense sticky footer error:", e);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 flex justify-center items-center p-1 min-h-[50px] sm:min-h-[72px]">
      {/*
        NOTE: For a sticky footer (anchor ad), AdSense might handle this automatically if enabled in your AdSense account's Auto Ads settings.
        If you are using a specific display ad unit here, ensure its size is appropriate (e.g., 320x50 or 728x90).
      */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client="ca-pub-4899012716770343"
        // IMPORTANT: Replace with your Ad Slot ID for the footer/anchor unit
        data-ad-slot="YOUR_FOOTER_AD_SLOT_ID_HERE"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};