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