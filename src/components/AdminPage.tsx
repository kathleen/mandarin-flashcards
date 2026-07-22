import React, { useState, useEffect } from 'react';
import { FlashcardData } from '../types';

const AdminPage: React.FC = () => {
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ character: '', pinyin: '', english: '' });
  const [addForm, setAddForm] = useState({ character: '', pinyin: '', english: '' });

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/flashcards');
      if (!response.ok) throw new Error('Failed to fetch flashcards');
      const data = await response.json();
      setCards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addForm),
    });
    if (response.ok) {
      setAddForm({ character: '', pinyin: '', english: '' });
      fetchCards();
    }
  };

  const startEdit = (card: FlashcardData) => {
    setEditingId(card.id);
    setEditForm({ character: card.character, pinyin: card.pinyin, english: card.english });
  };

  const handleEdit = async (id: number) => {
    const response = await fetch(`/api/flashcards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    if (response.ok) {
      setEditingId(null);
      fetchCards();
    }
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/flashcards/${id}`, { method: 'DELETE' });
    if (response.ok) {
      setCards(cards.filter(c => c.id !== id));
    }
  };

  if (isLoading) return <div className="text-center p-6">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Admin — Manage Flashcards</h2>

      <form onSubmit={handleAdd} className="mb-8 p-4 bg-white rounded-lg shadow flex gap-2 items-end flex-wrap">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Character</label>
          <input
            className="border border-gray-300 rounded px-2 py-1"
            value={addForm.character}
            onChange={e => setAddForm({ ...addForm, character: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Pinyin</label>
          <input
            className="border border-gray-300 rounded px-2 py-1"
            value={addForm.pinyin}
            onChange={e => setAddForm({ ...addForm, pinyin: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">English</label>
          <input
            className="border border-gray-300 rounded px-2 py-1"
            value={addForm.english}
            onChange={e => setAddForm({ ...addForm, english: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add card
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-sm font-semibold text-gray-600">ID</th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-600">Character</th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-600">Pinyin</th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-600">English</th>
              <th className="px-4 py-2 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map(card => (
              <tr key={card.id} className="border-t border-gray-100">
                <td className="px-4 py-2 text-gray-500 text-sm">{card.id}</td>
                {editingId === card.id ? (
                  <>
                    <td className="px-4 py-2">
                      <input
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        value={editForm.character}
                        onChange={e => setEditForm({ ...editForm, character: e.target.value })}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        value={editForm.pinyin}
                        onChange={e => setEditForm({ ...editForm, pinyin: e.target.value })}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        value={editForm.english}
                        onChange={e => setEditForm({ ...editForm, english: e.target.value })}
                      />
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(card.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-2 text-2xl">{card.character}</td>
                    <td className="px-4 py-2">{card.pinyin}</td>
                    <td className="px-4 py-2">{card.english}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => startEdit(card)}
                        className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(card.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
