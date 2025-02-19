import React from 'react';
import { FlashcardStats } from '../types';

interface ResultScreenProps {
  stats: FlashcardStats;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ stats, onRestart }) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Results</h2>
      
      <div className="mb-6">
        <p>Total words reviewed: {stats.total}</p>
        <p>Correct without hint: {stats.correct}</p>
        <p>Correct with hint: {stats.correctWithHint}</p>
        <p>Didn't know: {stats.incorrect}</p>
      </div>
      
      {stats.incorrectWords.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Words to review:</h3>
          
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Character</th>
                <th className="border p-2 text-left">Pinyin</th>
                <th className="border p-2 text-left">English</th>
              </tr>
            </thead>
            <tbody>
              {stats.incorrectWords.map((word) => (
                <tr key={word.id}>
                  <td className="border p-2">{word.character}</td>
                  <td className="border p-2">{word.pinyin}</td>
                  <td className="border p-2">{word.english}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <button
        onClick={onRestart}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Study Again
      </button>
    </div>
  );
};

export default ResultScreen;