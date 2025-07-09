import React from 'react';
import { BookOpenIcon, UserCircleIcon, MenuIcon, StarIcon } from './icons';

interface HeaderProps {
  onLoginClick: () => void;
  isPremiumUser: boolean;
  onMenuClick: () => void;
  isLoggedIn: boolean; // New prop to indicate login status
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick, isPremiumUser, onMenuClick, isLoggedIn }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md fixed top-0 left-0 right-0 z-50 h-14 sm:h-16 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={onMenuClick} className="lg:hidden mr-2 sm:mr-3 text-slate-600 hover:text-brand-dark p-1.5 sm:p-2 rounded-full hover:bg-slate-100">
            <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="flex items-center text-xl sm:text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            <BookOpenIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-1.5 sm:mr-2 text-brand" />
            Learnova
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {isPremiumUser && (
            <div className="flex items-center px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-full shadow-sm">
              <StarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-yellow-500" />
              Premium
            </div>
          )}
          <button 
            onClick={onLoginClick} 
            className="flex items-center px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-150"
          >
            <UserCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">{isLoggedIn ? 'Logout' : 'Login / Signup'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
