import React, { useState, useEffect } from 'react';
import { FlashcardData } from '../types';

interface FlashcardProps {
  card: FlashcardData;
  onAnswer: (result: 'correct' | 'correctWithHint' | 'incorrect') => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, onAnswer }) => {
  const [showHint, setShowHint] = useState(false);
  const [answer, setAnswer] = useState('');
  
  // Reset state when a new card is presented
  useEffect(() => {
    setShowHint(false);
    setAnswer('');
  }, [card]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (answer.toLowerCase().trim() === card.english.toLowerCase().trim()) {
      onAnswer(showHint ? 'correctWithHint' : 'correct');
    } else {
      onAnswer('incorrect');
    }
  };
  
  const handleDontKnow = () => {
    onAnswer('incorrect');
  };
  
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-5xl font-bold text-center mb-6">{card.character}</h2>
      
      {showHint && (
        <p className="text-lg text-center text-gray-600 mb-4">{card.pinyin}</p>
      )}
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter English meaning"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setShowHint(true)}
            disabled={showHint}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Show Hint
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
          
          <button
            type="button"
            onClick={handleDontKnow}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            I Don't Know
          </button>
        </div>
      </form>
    </div>
  );
};

export default Flashcard;