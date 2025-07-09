import React from 'react';
import { exportElementAsPDF } from '../services/pdfService';
import { SpeakerWaveIcon, DocumentDownloadIcon, LockClosedIcon, XIcon, StarIcon } from './icons';

interface AnswerDisplayProps {
  answer: string;
  onSpeak: () => void;
  onStopSpeak: () => void;
  onExportPdf: () => void;
  isPremiumUser: boolean;
}

// This markdown renderer is a bit more robust
const renderMarkdownToHTML = (markdown: string): string => {
    let html = markdown
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-3 mb-1.5 font-display">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2 font-display">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-5 mb-2.5 font-display">$1</h1>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/`([^`]+)`/gim, '<code class="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');

    html = html.split('\n\n').map(paragraph => {
        if (paragraph.match(/^\s*(\*|-|\+) /)) {
            const listItems = paragraph.split('\n').map(li => `<li>${li.replace(/^\s*(\*|-|\+) /, '')}</li>`).join('');
            return `<ul class="list-disc list-inside space-y-1 my-2 ml-4">${listItems}</ul>`;
        }
        if (paragraph.startsWith('<h') || paragraph.startsWith('<ul')) return paragraph;
        return `<p>${paragraph.replace(/\n/g, '<br/>')}</p>`;
    }).join('');

    return html;
};

export const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ answer, onSpeak, onStopSpeak, onExportPdf, isPremiumUser }) => {
    const formattedAnswer = renderMarkdownToHTML(answer);

    const handlePdfExportClick = () => {
        onExportPdf(); // The logic is now entirely handled in App.tsx
    };

    return (
        <div id="answer-content-container" className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200/80 animate-fadeInScaleUp">
            <h2 className="text-lg sm:text-xl font-display font-semibold text-slate-800 mb-3 sm:mb-4">Learnova's Answer:</h2>
            <div
                className="prose prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formattedAnswer }}
            />
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3">
                
                <button
                    onClick={onSpeak}
                    className="flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                    aria-label="Read answer aloud"
                >
                    <SpeakerWaveIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-slate-500" />
                    Read Aloud
                </button>
                <button
                    onClick={onStopSpeak}
                    className="flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-dark"
                    aria-label="Stop reading"
                >
                    <XIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-slate-500" />
                    Stop Reading
                </button>
                
                {/* --- THIS BUTTON IS NOW ENABLED FOR ALL LOGGED-IN USERS --- */}
                <button
                    onClick={handlePdfExportClick}
                    className={`flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 group relative
                        ${isPremiumUser 
                        ? 'text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-700' 
                        : 'text-slate-700 bg-slate-200 border border-slate-300 hover:bg-slate-300 focus:ring-brand-dark' 
                        }`}
                    // The disabled attribute is removed to allow clicks from non-premium users
                    aria-label={isPremiumUser ? "Export answer to PDF" : "Export to PDF (limited daily for free users)"}
                >
                    {isPremiumUser ? (
                        <StarIcon className="w-5 h-5 mr-2 text-yellow-300" />
                    ) : (
                        <DocumentDownloadIcon className="w-5 h-5 mr-2" />
                    )}
                    Export to PDF
                    {!isPremiumUser && 
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap bg-slate-700 text-white text-xs px-2 py-1 rounded-md shadow-lg">
                            10 free daily exports
                        </span>
                    }
                </button>
            </div>
        </div>
    );
};