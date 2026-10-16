export interface FlashcardData {
    id: number;
    character: string;
    pinyin: string;
    english: string;
  }
  
  export interface FlashcardStats {
    correct: number;
    correctWithHint: number;
    incorrect: number;
    total: number;
    incorrectWords: FlashcardData[];
  }

export interface SavedProgress {
  activeSession: {
    cardOrder: number[];
    currentIndex: number;
    correct: number;
    correctWithHint: number;
    incorrect: number;
    incorrectCardIds: number[];
  } | null;
}

export interface User {
  id: number;
  email: string;
}
