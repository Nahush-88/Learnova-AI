import React, { useEffect } from 'react';
// This component requires the AdSense script to be loaded. It's added in index.html.
declare global {
interface Window {
adsbygoogle: any[];
}
}
export const GoogleAdsenseBanner: React.FC = () => {
useEffect(() => {
try {
(window.adsbygoogle = window.adsbygoogle || []).push({});
} catch (e) {
console.error("Adsense error:", e);
}
}, []);
return (
<div className="w-full flex justify-center my-4 min-h-[100px] items-center bg-slate-200/50 rounded-lg">
<ins
className="adsbygoogle"
style={{ display: 'block' }}
data-ad-client="ca-pub-4899012716770343"
// IMPORTANT: Replace this with your actual Ad Slot ID for the banner unit
data-ad-slot="YOUR_AD_SLOT_ID_HERE"
data-ad-format="auto"
data-full-width-responsive="true"
></ins>
</div>
);
};