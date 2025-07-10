import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { QuestionInput } from './components/QuestionInput';
import { AnswerDisplay } from './components/AnswerDisplay';
import { PremiumModal } from './components/PremiumModal';
import { Spinner } from './components/Spinner';
import { AuthModal } from './components/AuthModal';
import { GoogleAdsenseBanner } from './components/GoogleAdsenseBanner';
import { GoogleAdsenseStickyFooter } from './components/GoogleAdsenseStickyFooter';
import { ExplanationLevel, Subject, Conversation } from './types';
import { SUBJECTS, EXPLANATION_LEVEL_OPTIONS, FREE_USES_LIMIT, ANONYMOUS_USES_LIMIT, PDF_EXPORT_LIMIT, GEMINI_TEXT_MODEL_NAME, getSystemInstructionForLevel, PREMIUM_PRICE_INR } from './constants';
import { generateText, generateTextAndImage } from './services/geminiService';
import { exportElementAsPDF } from './services/pdfService';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, onSnapshot, collection, query, orderBy, Timestamp, addDoc } from 'firebase/firestore';
const App: React.FC = () => {
// STATE MANAGEMENT
const [isLoading, setIsLoading] = useState<boolean>(false);
const [error, setError] = useState<string | null>(null);
const [currentQuestion, setCurrentQuestion] = useState<string>('');
const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
const [aiAnswer, setAiAnswer] = useState<string>('');
const [currentExplanationLevel, setCurrentExplanationLevel] = useState<ExplanationLevel>(ExplanationLevel.GENERAL);
const [freeUsesRemaining, setFreeUsesRemaining] = useState<number>(FREE_USES_LIMIT);
const [anonymousUses, setAnonymousUses] = useState(() => parseInt(localStorage.getItem('anonymous_uses') || ${ANONYMOUS_USES_LIMIT}));
const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);
const [selectedSubject, setSelectedSubject] = useState<Subject | null>(SUBJECTS[0] || null);
const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
const [currentUser, setCurrentUser] = useState<User | null>(null);
const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
const [conversationHistory, setConversationHistory] = useState<Conversation[]>([]);
const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
const [pdfExportsToday, setPdfExportsToday] = useState<number>(0);
// HELPERS
const getTodaysDateString = () => new Date().toISOString().split('T')[0];
const getUserBaseRef = (userId: string) => doc(db, `artifacts/${(window as any).__app_id || 'default-app-id'}/users/${userId}`);

// AUTH & DATA LOADING EFFECT
useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            setCurrentUser(user);
            const userBaseRef = getUserBaseRef(user.uid);
            const settingsRef = doc(userBaseRef, 'userSettings', 'data');

            const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const today = getTodaysDateString();
                    let updates: { [key: string]: any } = {};

                    setIsPremiumUser(data.isPremiumUser || false);

                    if (data.lastUsedDate !== today) {
                        updates.freeUsesRemaining = FREE_USES_LIMIT;
                        updates.lastUsedDate = today;
                        setFreeUsesRemaining(FREE_USES_LIMIT);
                    } else {
                        setFreeUsesRemaining(data.freeUsesRemaining ?? FREE_USES_LIMIT);
                    }

                    if (data.lastExportDate !== today) {
                        updates.pdfExportsToday = 0;
                        updates.lastExportDate = today;
                        setPdfExportsToday(0);
                    } else {
                        setPdfExportsToday(data.pdfExportsToday ?? 0);
                    }

                    if (Object.keys(updates).length > 0) {
                        setDoc(settingsRef, updates, { merge: true });
                    }

                } else {
                    setDoc(settingsRef, {
                        isPremiumUser: false,
                        freeUsesRemaining: FREE_USES_LIMIT,
                        lastUsedDate: getTodaysDateString(),
                        pdfExportsToday: 0,
                        lastExportDate: getTodaysDateString()
                    });
                }
            }, error => console.error("Settings listener error:", error));

            const historyQuery = query(collection(userBaseRef, 'history'), orderBy('timestamp', 'desc'));
            const unsubHistory = onSnapshot(historyQuery, (snapshot) => {
                const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Conversation));
                setConversationHistory(history);
            });

            localStorage.removeItem('anonymous_uses');
            setIsAuthLoading(false);
            return () => { unsubSettings(); unsubHistory(); };

        } else {
            setCurrentUser(null);
            setIsPremiumUser(false);
            setConversationHistory([]);
            setPdfExportsToday(0);
            setAnonymousUses(parseInt(localStorage.getItem('anonymous_uses') || `${ANONYMOUS_USES_LIMIT}`));
            setIsAuthLoading(false);
        }
    });
    return () => unsubscribe();
}, []);

const handleQuestionSubmit = useCallback(async () => {
    if (!currentQuestion && !uploadedImageFile) return;
    if (isSpeaking) window.speechSynthesis.cancel();

    if (currentUser) {
        if (!isPremiumUser && freeUsesRemaining <= 0) {
            setError("You've used all your free queries for today.");
            setShowPremiumModal(true);
            return;
        }
    } else {
        if (anonymousUses <= 0) {
            setError("Please sign up to continue using Learnova.");
            setShowAuthModal(true);
            return;
        }
    }

    setIsLoading(true);
    setError(null);
    setAiAnswer('...');

    const systemInstruction = getSystemInstructionForLevel(currentExplanationLevel);
    let fullPrompt = currentQuestion;
    if (selectedSubject && selectedSubject.id !== 'general') {
        fullPrompt = `Subject: ${selectedSubject.name}. Question: ${currentQuestion}`;
    }

    try {
        const responseText = uploadedImageFile
            ? await generateTextAndImage(fullPrompt, await toBase64(uploadedImageFile), uploadedImageFile.type, systemInstruction)
            : await generateText(fullPrompt, systemInstruction);

        setAiAnswer(responseText);

        if (currentUser) {
            await addDoc(collection(getUserBaseRef(currentUser.uid), 'history'), {
                question: currentQuestion, answer: responseText, timestamp: Timestamp.now()
            });
            if (!isPremiumUser) {
                const newCount = Math.max(0, freeUsesRemaining - 1);
                setFreeUsesRemaining(newCount);
                await setDoc(doc(getUserBaseRef(currentUser.uid), 'userSettings', 'data'), { freeUsesRemaining: newCount, lastUsedDate: getTodaysDateString() }, { merge: true });
            }
        } else {
            const newCount = Math.max(0, anonymousUses - 1);
            setAnonymousUses(newCount);
            localStorage.setItem('anonymous_uses', newCount.toString());
        }

    } catch (apiError: any) {
        console.error("API Error:", apiError);
        setError(`Failed to get answer from AI. ${apiError.message}`);
        setAiAnswer('');
    } finally {
        setIsLoading(false);
    }
}, [currentUser, isPremiumUser, freeUsesRemaining, anonymousUses, currentQuestion, uploadedImageFile, currentExplanationLevel, selectedSubject, isSpeaking]);

const handlePdfExport = async () => {
    if (!currentUser) {
        setError("Please log in or sign up to export answers.");
        setShowAuthModal(true);
        return;
    }

    if (isPremiumUser) {
        exportElementAsPDF('answer-content-container', 'Learnova-Answer.pdf');
        return;
    }

    if (pdfExportsToday >= PDF_EXPORT_LIMIT) {
        setError(`You've reached your daily PDF export limit of ${PDF_EXPORT_LIMIT}. Upgrade to Premium for unlimited exports.`);
        setShowPremiumModal(true);
        return;
    }
    
    try {
        setError(null);
        await exportElementAsPDF('answer-content-container', 'Learnova-Answer.pdf');
        const newExportCount = pdfExportsToday + 1;
        setPdfExportsToday(newExportCount);
        await setDoc(doc(getUserBaseRef(currentUser.uid), 'userSettings', 'data'), {
            pdfExportsToday: newExportCount,
            lastExportDate: getTodaysDateString()
        }, { merge: true });

    } catch (e) {
        console.error("PDF Export failed:", e);
    }
};

const handleSpeak = useCallback(() => {
    if ('speechSynthesis' in window && aiAnswer) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(aiAnswer);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (event) => {
            setIsSpeaking(false);
            console.error("Text-to-speech engine error:", event);
        };
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    } else if (!('speechSynthesis' in window)) {
        setError("Sorry, your browser does not support text-to-speech.");
    }
}, [aiAnswer]);

const handleStopSpeak = useCallback(() => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    }
}, []);

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

const handleHistoryItemClick = (conversation: Conversation) => {
    if (isSpeaking) window.speechSynthesis.cancel();
    setCurrentQuestion(conversation.question);
    setAiAnswer(conversation.answer);
    setUploadedImageFile(null);
    if (sidebarOpen) setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

if (isAuthLoading) {
    return <div className="w-screen h-screen flex items-center justify-center bg-slate-100"><Spinner /></div>;
}

return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 font-sans">
        <Header onLoginClick={currentUser ? () => auth.signOut() : () => setShowAuthModal(true)} isPremiumUser={isPremiumUser} onMenuClick={() => setSidebarOpen(!sidebarOpen)} isLoggedIn={!!currentUser} />
        <div className="flex flex-1 overflow-hidden pt-16">
            <Sidebar selectedSubject={selectedSubject} onSelectSubject={setSelectedSubject} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} history={conversationHistory} onHistoryItemClick={handleHistoryItemClick} />
            <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto transition-all duration-300 ease-in-out pb-24">
                <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6">
                    
                    <GoogleAdsenseBanner />

                    <QuestionInput currentQuestion={currentQuestion} onQuestionChange={setCurrentQuestion} onImageUpload={setUploadedImageFile} onSubmit={handleQuestionSubmit} isLoading={isLoading} explanationLevels={EXPLANATION_LEVEL_OPTIONS} currentExplanationLevel={currentExplanationLevel} onExplanationLevelChange={setCurrentExplanationLevel} uploadedFileName={uploadedImageFile?.name} />
                    {isLoading && <Spinner />}
                    {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg shadow">{error}</div>}
                    
                    {aiAnswer && !isLoading && 
                        <AnswerDisplay 
                            answer={aiAnswer} 
                            onSpeak={handleSpeak} 
                            onStopSpeak={handleStopSpeak} 
                            onExportPdf={handlePdfExport}
                            isPremiumUser={isPremiumUser} 
                        />
                    }
                    
                    {!isPremiumUser && (
                        <div className="text-center text-sm text-slate-600 mt-4 p-3 bg-slate-200/70 rounded-lg shadow-inner">
                            {currentUser ? (
                                <>
                                    You have <span className="font-semibold text-brand-dark">{freeUsesRemaining}</span> free queries and <span className="font-semibold text-brand-dark">{Math.max(0, PDF_EXPORT_LIMIT - pdfExportsToday)}</span> PDF exports remaining today.
                                </>
                            ) : (
                                <>
                                    You have <span className="font-semibold text-brand-dark">{anonymousUses}</span> free queries remaining.
                                </>
                            )}
                            <button onClick={() => currentUser ? setShowPremiumModal(true) : setShowAuthModal(true)} className="ml-1 text-brand hover:underline font-medium">
                                {currentUser ? 'Upgrade to Premium' : 'Sign Up for More!'}
                            </button>
                        </div>
                    )}
                    {currentUser && (
                        <p className="text-xs text-slate-500 text-center mt-4">Logged in as: <span className="font-medium">{currentUser.email}</span></p>
                    )}
                </div>
            </main>
        </div>
        
        {showPremiumModal && currentUser && (
            <PremiumModal
                onClose={() => setShowPremiumModal(false)}
                currentUser={currentUser}
                onUpgradeSuccess={async () => {
                    if (currentUser) {
                        await setDoc(doc(getUserBaseRef(currentUser.uid), 'userSettings', 'data'), { isPremiumUser: true }, { merge: true });
                        setShowPremiumModal(false);
                        // Optionally, show a success alert or toast message here
                        alert("Upgrade successful! Welcome to Learnova Premium.");
                    }
                }}
            />
        )}
        
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        
        <GoogleAdsenseStickyFooter />
    </div>
);
export default App;