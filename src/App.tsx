import React, { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';
import ResultScreen from './components/ResultScreen';
import { FlashcardData, FlashcardStats } from './types';

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
  
  useEffect(() => {
    fetchCards();
  }, []);
  
  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/flashcards');
      
      if (!response.ok) {
        throw new Error('Failed to fetch flashcards');
      }
      
      const data = await response.json();
      
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
    
    // Move to next card or finish
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setIsFinished(true);
    }
  };
  
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
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Mandarin Chinese Flashcards</h1>
        <p className="text-gray-600">
          Progress: {currentCardIndex + 1} / {cards.length}
        </p>
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