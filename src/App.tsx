import React, { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';
import ResultScreen from './components/ResultScreen';
import AuthForm from './components/AuthForm';
import { FlashcardData, FlashcardStats, SavedProgress, User } from './types';

const App: React.FC = () => {
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [stats, setStats] = useState<FlashcardStats>({
    correct: 0,
    correctWithHint: 0,
    incorrect: 0,
    total: 0,
    incorrectWords: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const [resumed, setResumed] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.ok) {
          setUser(await response.json());
        }
      } catch {
        // Treat network errors as logged out
      } finally {
        setIsAuthChecked(true);
      }
    };
    checkAuth();
  }, []);
  
  useEffect(() => {
    if (user) {
      fetchCards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      setUser(null);
      setCards([]);
      setIsFinished(false);
      setError(null);
      setIsLoading(true);
    }
  };
  
  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/flashcards', { credentials: 'include' });
      
      if (!response.ok) {
        throw new Error('Failed to fetch flashcards');
      }
      
      const data = await response.json();
      
      setError(null);
      setSaveFailed(false);
      setResumed(false);
      
      // Try to resume the saved active session
      let saved: SavedProgress | null = null;
      try {
        const progressResponse = await fetch('/api/progress', { credentials: 'include' });
        if (progressResponse.ok) {
          saved = await progressResponse.json();
        } else {
          setSaveFailed(true);
        }
      } catch {
        setSaveFailed(true);
      }
      
      const session = saved?.activeSession;
      const byId = new Map<number, FlashcardData>(
        (data as FlashcardData[]).map(card => [card.id, card])
      );
      const restoredCards = session
        ? session.cardOrder.map(id => byId.get(id))
        : [];
      
      if (session && restoredCards.length > 0 && restoredCards.every(Boolean) &&
          session.currentIndex < restoredCards.length) {
        setCards(restoredCards as FlashcardData[]);
        setStats({
          correct: session.correct,
          correctWithHint: session.correctWithHint,
          incorrect: session.incorrect,
          total: restoredCards.length,
          incorrectWords: session.incorrectCardIds
            .map(id => byId.get(id))
            .filter((card): card is FlashcardData => card !== undefined)
        });
        setCurrentCardIndex(session.currentIndex);
        setResumed(true);
      } else {
        // Shuffle the cards
        const shuffledCards = [...data].sort(() => Math.random() - 0.5);
        
        setCards(shuffledCards);
        setStats({
          correct: 0,
          correctWithHint: 0,
          incorrect: 0,
          total: shuffledCards.length,
          incorrectWords: []
        });
        setCurrentCardIndex(0);
        
        fetch('/api/progress/session', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardOrder: shuffledCards.map((card: FlashcardData) => card.id) })
        })
          .then(res => {
            if (!res.ok) setSaveFailed(true);
          })
          .catch(() => setSaveFailed(true));
      }
      setIsFinished(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnswer = (result: 'correct' | 'correctWithHint' | 'incorrect') => {
    // Update stats
    setStats(prevStats => {
      const newStats = { ...prevStats };
      
      if (result === 'correct') {
        newStats.correct += 1;
      } else if (result === 'correctWithHint') {
        newStats.correctWithHint += 1;
      } else {
        newStats.incorrect += 1;
        newStats.incorrectWords = [
          ...newStats.incorrectWords,
          cards[currentCardIndex]
        ];
      }
      
      return newStats;
    });
    
    // Persist the answer without blocking the UI
    fetch('/api/progress/answer', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardId: cards[currentCardIndex].id, result })
    })
      .then(res => {
        if (!res.ok) setSaveFailed(true);
      })
      .catch(() => setSaveFailed(true));
    
    // Move to next card or finish
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setIsFinished(true);
    }
  };
  
  if (!isAuthChecked) {
    return <div className="text-center p-6">Loading...</div>;
  }
  
  if (!user) {
    return <AuthForm onAuthenticated={setUser} />;
  }
  
  if (isLoading) {
    return <div className="text-center p-6">Loading flashcards...</div>;
  }
  
  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        Error: {error}
        <button
          onClick={fetchCards}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (isFinished) {
    return <ResultScreen stats={stats} onRestart={fetchCards} />;
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end items-center gap-3 mb-4 text-sm text-gray-600">
        <span>{user.email}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Log out
        </button>
      </div>
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Mandarin Chinese Flashcards</h1>
        <p className="text-gray-600">
          Progress: {currentCardIndex + 1} / {cards.length}
        </p>
        {resumed && <p className="text-sm text-green-600">Resumed your last session</p>}
        {saveFailed && <p className="text-sm text-yellow-600">Progress not saved</p>}
      </header>
      
      {cards.length > 0 && (
        <Flashcard
          card={cards[currentCardIndex]}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
};

export default App;