import React from 'react';
import { SUBJECTS } from '../constants';
import { Subject, Conversation } from '../types';
import { XIcon, BookOpenIcon } from './icons';

interface SidebarProps {
  selectedSubject: Subject | null;
  onSelectSubject: (subject: Subject) => void;
  isOpen: boolean;
  onClose: () => void;
  history: Conversation[];
  onHistoryItemClick: (conversation: Conversation) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedSubject, onSelectSubject, isOpen, onClose, history, onHistoryItemClick }) => {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-60 z-30 lg:hidden" onClick={onClose} aria-hidden="true"></div>}
      
      <aside className={`fixed lg:static top-0 left-0 h-full bg-slate-800 text-white w-64 p-4 space-y-4 transform ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col pt-20 lg:pt-5`}>
        <div className="flex justify-between items-center lg:hidden mb-2">
           <div className="flex items-center text-lg font-display font-semibold text-slate-100">
            <BookOpenIcon className="w-6 h-6 mr-2 text-brand-light" /> 
            Learnova
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-light">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-shrink-0">
          <h2 className="px-3 text-lg font-display font-semibold text-slate-100 mb-2">Subjects</h2>
          <nav>
            <ul className="space-y-1.5">
              {SUBJECTS.map((subject) => (
                <li key={subject.id}>
                  <button
                    onClick={() => { onSelectSubject(subject); if (isOpen) onClose(); }}
                    className={`w-full flex items-center px-3 py-2.5 rounded-md text-left text-sm font-medium transition-all duration-150 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-brand-light focus:ring-opacity-50
                      ${selectedSubject?.id === subject.id 
                        ? 'bg-brand text-white shadow-lg' 
                        : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                      }`}
                  >
                    {React.cloneElement(subject.icon, { className: 'w-5 h-5 mr-3 flex-shrink-0' })}
                    {subject.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        {history.length > 0 && (
          <div className="flex-grow flex flex-col mt-4 pt-4 border-t border-slate-700 min-h-0">
            <h3 className="text-lg font-display font-semibold text-slate-200 mb-2 px-3">History</h3>
            <ul className="space-y-1.5 overflow-y-auto flex-grow pr-2 -mr-2">
              {history.map(item => (
                <li key={item.id}>
                  <button 
                    onClick={() => { onHistoryItemClick(item); if (isOpen) onClose(); }}
                    className="w-full text-left text-xs text-slate-400 hover:text-white hover:bg-slate-700 p-2 rounded-md truncate transition-colors"
                    title={item.question}
                  >
                    {item.question}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-slate-700 text-center">
            <p className="text-xs text-slate-400">© {new Date().getFullYear()} Learnova</p>
        </div>
      </aside>
    </>
  );
};