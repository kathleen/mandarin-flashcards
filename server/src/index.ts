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
/* TODO: Lesson 4 */
/**
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
  { id: 20, character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },

 * 班	class			bān
多少	how many		duō shao
学习	study			xuéxí
学	study			xué
汉语	Chinese		Hànyǔ
语	language		yǔ
英语	English		Yīngyǔ
难	difficult			nán
同学	classmate		tóngxué
男生	boy student		nánshēng
男	boy/male		nán
女生 	girl student		nǚ shēng
女	girl/female		nǚ
都	all			dōu
请	please			qǐng
进	enter			jìn
外国	foreign country	wàiguó
朋友	friend			péngyou
名字	name			míngzi
哪	which			nǎ/něi
国	country		guó
 */
  /* Lesson 5 */
  { id: 21, character: '一月', pinyin:'yīyuè', english: 'January'},			
  { id: 22, character: '二月', pinyin:'èryuè', english: 'February'},			
  { id: 23, character: '三月', pinyin:'sānyuè', english: 'March'},				
  { id: 24, character: '四月', pinyin:'sìyuè', english: 'April'},				
  { id: 25, character: '五月', pinyin:'wǔyuè', english: 'May'},				
  { id: 26, character: '六月', pinyin:'liùyuè', english: 'June'},				
  { id: 27, character: '七月', pinyin:'qīyuè', english: 'July'},				
  { id: 28, character: '八月', pinyin:'bāyuè', english: 'August'},				
  { id: 29, character: '九月', pinyin:'jiǔyuè', english: 'September'},			
  { id: 30, character: '十月', pinyin:'shíyuè', english: 'October'},			
  { id: 31, character: '十一月', pinyin:'shíyīyuè', english: 'November'},				
  { id: 32, character: '十二月', pinyin:'shi’èryuè', english: 'December'},
  { id: 33, character: '星期', pinyin:'xīngqī', english: 'week'},
  { id: 34, character: '星期一', pinyin:'xīngqīyī', english: 'Monday'},
  { id: 35, character: '星期二', pinyin:'xīngqīèr', english: 'Tuesday'},
  { id: 36, character: '星期三', pinyin:'xīngqīsān', english: 'Wednesday'},
  { id: 37, character: '星期四', pinyin:'xīngqīsì', english: 'Thursday'},
  { id: 38, character: '星期五', pinyin:'xīngqīwǔ', english: 'Friday'},
  { id: 39, character: '星期六', pinyin:'xīngqīliù', english: 'Saturday'},
  { id: 40, character: '星期日/星期天', pinyin:'xīngqīrì/xīngqītiān', english: 'Sunday'},
  { id: 41, character: '今天', pinyin:'jīntiān', english: 'today'},
  { id: 42, character: '天', pinyin:'tiān', english: 'day'},
  { id: 43, character: '昨天', pinyin:'zuótiān', english: 'yesterday'},
  { id: 44, character: '明天', pinyin:'míngtiān', english: 'tomorrow'},
  { id: 45, character: '生日', pinyin:'shēngrì', english: 'birthday'},
  { id: 46, character: '祝', pinyin:'zhù', english: 'to wish'},
  { id: 47, character: '快乐', pinyin:'kuàilè', english: 'happy'},
  { id: 48, character: '谢谢', pinyin:'xièxie', english: 'thank you'},
  { id: 49, character: '不谢', pinyin:'bú xiè', english: 'You’re welcome'},
  { id: 50, character: '礼物', pinyin:'lǐwù', english: 'gift'},
  { id: 51, character: '对', pinyin:'duì', english: 'yes; right; correct'},
  { id: 52, character: '月', pinyin:'yuè', english: 'month'},
  { id: 53, character: '号/日', pinyin:'hào/rì', english: 'date in a month'},
  { id: 54, character: '送', pinyin:'sòng', english: 'to give as a gift'},
  { id: 55, character: '很', pinyin:'hěn', english: 'is'},
  { id: 56, character: '高兴', pinyin:'gāoxìng', english: 'happy; glad'},	
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