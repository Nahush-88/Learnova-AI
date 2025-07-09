import React, { useState } from 'react';
import { XIcon, UserCircleIcon, SparklesIcon } from './icons';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // <-- MODIFIED LINE: Import auth from firebase.ts

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 'auth' is now imported directly from firebase.ts, no need for getAuth(app) here
  // const auth = getAuth(app); 

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose(); // Close modal on successful sign-in
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      setError(err.message || "Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onClose(); // Close modal on successful auth
    } catch (err: any) {
      console.error("Email Auth Error:", err);
      setError(err.message || "Authentication failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 max-w-md w-full transform transition-all animate-fadeInScaleUp">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div className="flex items-center">
            <UserCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-brand-DEFAULT mr-2 sm:mr-3" />
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-800 leading-tight">
              {isLoginMode ? 'Login to Learnova' : 'Sign Up for Learnova'}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300">
            <XIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {error && (
          <div className="p-2 sm:p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-shadow duration-150 text-slate-700"
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand transition-shadow duration-150 text-slate-700"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleEmailAuth}
            disabled={isLoading || !email || !password}
            className="w-full flex items-center justify-center px-4 py-2.5 text-base font-medium text-white bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-dark transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isLoginMode ? 'Login' : 'Sign Up'
            )}
          </button>

          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-slate-300"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-sm">OR</span>
            <div className="flex-grow border-t border-slate-300"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2.5 text-base font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-md hover:bg-slate-50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-5 h-5 mr-2" />
                Continue with Google
              </>
            )}
          </button>

          <p className="text-center text-sm text-slate-600 mt-4">
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError(null);
                setEmail('');
                setPassword('');
              }}
              className="text-brand hover:underline font-medium"
              disabled={isLoading}
            >
              {isLoginMode ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

