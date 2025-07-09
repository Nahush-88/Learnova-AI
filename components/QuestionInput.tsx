import React, { useRef } from 'react';
import { ExplanationLevel, ExplanationLevelOption } from '../types';
import { PhotographIcon, SparklesIcon, ChevronDownIcon, PaperClipIcon, XCircleIcon } from './icons';

interface QuestionInputProps {
  currentQuestion: string;
  onQuestionChange: (question: string) => void;
  onImageUpload: (file: File | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
  explanationLevels: ExplanationLevelOption[];
  currentExplanationLevel: ExplanationLevel;
  onExplanationLevelChange: (level: ExplanationLevel) => void;
  uploadedFileName?: string;
}

export const QuestionInput: React.FC<QuestionInputProps> = ({
  currentQuestion,
  onQuestionChange,
  onImageUpload,
  onSubmit,
  isLoading,
  explanationLevels = [], // THIS IS THE FIX: Prevents crash if prop is undefined
  currentExplanationLevel,
  onExplanationLevelChange,
  uploadedFileName,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    } else {
      onImageUpload(null);
    }
    if(event.target) {
        event.target.value = ""; 
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const removeUploadedFile = () => {
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  return (
    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl shadow-xl space-y-3 sm:space-y-4 border border-slate-200/80">
      <textarea
        value={currentQuestion}
        onChange={(e) => onQuestionChange(e.target.value)}
        placeholder="Type your study question here, or describe the image you're uploading..."
        className="w-full p-2.5 sm:p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-shadow duration-150 min-h-[80px] sm:min-h-[100px] resize-y text-slate-700 placeholder-slate-400 text-sm sm:text-base"
        rows={4}
        disabled={isLoading}
      />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={triggerFileInput}
            disabled={isLoading}
            className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors duration-150 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-brand-dark"
          >
            <PhotographIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 text-slate-500" />
            {uploadedFileName ? 'Change Image' : 'Upload Image'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/gif, image/webp"
            className="hidden"
            disabled={isLoading}
          />
          {uploadedFileName && (
            <div className="flex items-center text-xs text-slate-600 bg-slate-100 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-md border border-slate-200">
              <PaperClipIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-slate-500 flex-shrink-0"/> 
              <span className="truncate max-w-[100px] sm:max-w-[150px]">{uploadedFileName}</span>
              <button onClick={removeUploadedFile} className="ml-1 sm:ml-1.5 text-slate-400 hover:text-red-500" aria-label="Remove uploaded image">
                <XCircleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4"/>
              </button>
            </div>
          )}
        </div>

        <div className="relative mt-2 sm:mt-0">
          <select
            value={currentExplanationLevel}
            onChange={(e) => onExplanationLevelChange(e.target.value as ExplanationLevel)}
            disabled={isLoading}
            className="appearance-none w-full sm:w-auto pl-2.5 sm:pl-3 pr-7 sm:pr-8 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-colors duration-150 disabled:opacity-50"
          >
            {explanationLevels.map(level => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
          <ChevronDownIcon className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
      <button
        onClick={onSubmit}
        disabled={isLoading || (!currentQuestion && !uploadedFileName)}
        className="w-full flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed group"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Getting Answer...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" />
            Ask Learnova AI
          </>
        )}
      </button>
    </div>
  );
};