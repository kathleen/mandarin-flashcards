import express from 'express';
import cors from 'cors';
import path from 'path';
import { FlashcardData } from '../../src/types';

const app = express();
const PORT = process.env.PORT || 8000;

// Sample flashcard data
const flashcards: FlashcardData[] = [
  { id: 1, character: '你好', pinyin: 'nǐ hǎo', english: 'hello' },
  { id: 2, character: '谢谢', pinyin: 'xiè xiè', english: 'thank you' },
  { id: 3, character: '再见', pinyin: 'zài jiàn', english: 'goodbye' },
  { id: 4, character: '是', pinyin: 'shì', english: 'yes' },
  { id: 5, character: '不是', pinyin: 'bú shì', english: 'no' },
  { id: 6, character: '对不起', pinyin: 'duì bù qǐ', english: 'sorry' },
  { id: 7, character: '没关系', pinyin: 'méi guān xì', english: "it's okay" },
  { id: 8, character: '吃饭', pinyin: 'chī fàn', english: 'eat (a meal)' },
  { id: 9, character: '喝水', pinyin: 'hē shuǐ', english: 'drink water' },
  { id: 10, character: '学习', pinyin: 'xué xí', english: 'study' },
  { id: 11, character: '工作', pinyin: 'gōng zuò', english: 'work' },
  { id: 12, character: '朋友', pinyin: 'péng yǒu', english: 'friend' },
  { id: 13, character: '家人', pinyin: 'jiā rén', english: 'family' },
  { id: 14, character: '时间', pinyin: 'shí jiān', english: 'time' },
  { id: 15, character: '今天', pinyin: 'jīn tiān', english: 'today' },
  { id: 16, character: '明天', pinyin: 'míng tiān', english: 'tomorrow' },
  { id: 17, character: '昨天', pinyin: 'zuó tiān', english: 'yesterday' },
  { id: 18, character: '钱', pinyin: 'qián', english: 'money' },
  { id: 19, character: '手机', pinyin: 'shǒu jī', english: 'mobile phone' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
];

// Middleware
app.use(cors());
app.use(express.json());

// API endpoints
app.get('/api/flashcards', (req, res) => {
  res.json(flashcards);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});