
import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-DEFAULT"></div>
      <p className="ml-3 text-slate-600 font-medium">Loading, please wait...</p>
    </div>
  );
};
