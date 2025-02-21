import express from 'express';
import cors from 'cors';
import path from 'path';
import { FlashcardData } from '../../src/types';

const app = express();
const PORT = process.env.PORT || 8000;

// Sample flashcard data
const flashcards: FlashcardData[] = [
  { id: 1, character: '你好', pinyin: 'nǐ hǎo', english: 'hello' },
  { id: 2, character: '再见', pinyin: 'zài jiàn', english: 'goodbye' },
  { id: 3, character: '是', pinyin: 'shì', english: 'yes' },
  { id: 4, character: '不是', pinyin: 'bú shì', english: 'no' },
  { id: 5, character: '对不起', pinyin: 'duì bù qǐ', english: 'sorry' },
  { id: 6, character: '没关系', pinyin: 'méi guān xì', english: "it's okay" },
  { id: 7, character: '吃饭', pinyin: 'chī fàn', english: 'eat food' },
  { id: 8, character: '喝水', pinyin: 'hē shuǐ', english: 'drink water' },
  { id: 9, character: '学习', pinyin: 'xué xí', english: 'study' },
  { id: 10, character: '工作', pinyin: 'gōng zuò', english: 'work' },
  { id: 11, character: '朋友', pinyin: 'péng yǒu', english: 'friend' },
  { id: 12, character: '家人', pinyin: 'jiā rén', english: 'family' },
  { id: 13, character: '时间', pinyin: 'shí jiān', english: 'time' },
  { id: 14, character: '钱', pinyin: 'qián', english: 'money' },
  { id: 15, character: '手机', pinyin: 'shǒu jī', english: 'mobile phone' },
  { id: 16, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
/* TODO: Lesson 1 */
/* TODO: Lesson 2 */
/* TODO: Lesson 3 */
  /* Lesson 4 */
  { id: 17, character: '班', pinyin: 'bān', english: 'class' },
  { id: 18, character: '多少', pinyin: 'duō shao', english: 'how many' },
  { id: 19, character: '学习', pinyin: 'xuéxí', english: 'study' },
  { id: 20, character: '学', pinyin: 'xué', english: 'study' },
  { id: 21, character: '汉语', pinyin: 'Hànyǔ', english: 'Chinese' },
  { id: 22, character: '语', pinyin: 'yǔ', english: 'language' },
  { id: 23, character: '英语', pinyin: 'Yīngyǔ', english: 'English' },
  { id: 24, character: '难', pinyin: 'nán', english: 'difficult' },
  { id: 25, character: '同学', pinyin: 'tóngxué', english: 'classmate' },
  { id: 26, character: '男生', pinyin: 'nánshēng', english: 'boy student' },
  { id: 27, character: '男', pinyin: 'nán', english: 'boy/male' },
  { id: 28, character: '女生', pinyin: 'nǚ shēng', english: 'girl student' },
  { id: 29, character: '女', pinyin: 'nǚ', english: 'girl/female' },
  { id: 30, character: '都', pinyin: 'dōu', english: 'all' },
  { id: 31, character: '请', pinyin: 'qǐng', english: 'please' },
  { id: 32, character: '进', pinyin: 'jìn', english: 'enter' },
  { id: 33, character: '外国', pinyin: 'wàiguó', english: 'foreign country' },
  { id: 34, character: '朋友', pinyin: 'péngyou', english: 'friend' },
  { id: 35, character: '名字', pinyin: 'míngzi', english: 'name' },
  { id: 36, character: '哪', pinyin: 'nǎ/něi', english: 'which' },
  { id: 37, character: '国', pinyin: 'guó', english: 'country' },					
  /* Lesson 5 */
  { id: 38, character: '一月', pinyin:'yīyuè', english: 'January'},			
  { id: 39, character: '二月', pinyin:'èryuè', english: 'February'},			
  { id: 40, character: '三月', pinyin:'sānyuè', english: 'March'},				
  { id: 41, character: '四月', pinyin:'sìyuè', english: 'April'},				
  { id: 42, character: '五月', pinyin:'wǔyuè', english: 'May'},				
  { id: 43, character: '六月', pinyin:'liùyuè', english: 'June'},				
  { id: 44, character: '七月', pinyin:'qīyuè', english: 'July'},				
  { id: 45, character: '八月', pinyin:'bāyuè', english: 'August'},				
  { id: 46, character: '九月', pinyin:'jiǔyuè', english: 'September'},			
  { id: 47, character: '十月', pinyin:'shíyuè', english: 'October'},			
  { id: 48, character: '十一月', pinyin:'shíyīyuè', english: 'November'},				
  { id: 49, character: '十二月', pinyin:'shi’èryuè', english: 'December'},
  { id: 50, character: '星期', pinyin:'xīngqī', english: 'week'},
  { id: 51, character: '星期一', pinyin:'xīngqīyī', english: 'Monday'},
  { id: 52, character: '星期二', pinyin:'xīngqīèr', english: 'Tuesday'},
  { id: 53, character: '星期三', pinyin:'xīngqīsān', english: 'Wednesday'},
  { id: 54, character: '星期四', pinyin:'xīngqīsì', english: 'Thursday'},
  { id: 55, character: '星期五', pinyin:'xīngqīwǔ', english: 'Friday'},
  { id: 56, character: '星期六', pinyin:'xīngqīliù', english: 'Saturday'},
  { id: 57, character: '星期日/星期天', pinyin:'xīngqīrì/xīngqītiān', english: 'Sunday'},
  { id: 58, character: '今天', pinyin:'jīntiān', english: 'today'},
  { id: 59, character: '天', pinyin:'tiān', english: 'day'},
  { id: 60, character: '昨天', pinyin:'zuótiān', english: 'yesterday'},
  { id: 61, character: '明天', pinyin:'míngtiān', english: 'tomorrow'},
  { id: 62, character: '生日', pinyin:'shēngrì', english: 'birthday'},
  { id: 63, character: '祝', pinyin:'zhù', english: 'to wish'},
  { id: 64, character: '快乐', pinyin:'kuàilè', english: 'happy'},
  { id: 65, character: '谢谢', pinyin:'xièxie', english: 'thank you'},
  { id: 66, character: '不谢', pinyin:'bú xiè', english: 'You’re welcome'},
  { id: 67, character: '礼物', pinyin:'lǐwù', english: 'gift'},
  { id: 68, character: '对', pinyin:'duì', english: 'yes; right; correct'},
  { id: 69, character: '月', pinyin:'yuè', english: 'month'},
  { id: 70, character: '号/日', pinyin:'hào/rì', english: 'date in a month'},
  { id: 71, character: '送', pinyin:'sòng', english: 'to give as a gift'},
  { id: 72, character: '很', pinyin:'hěn', english: 'is'},
  { id: 73, character: '高兴', pinyin:'gāoxìng', english: 'happy; glad'},	
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