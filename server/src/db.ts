import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(__dirname, '../flashcards.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS flashcards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character TEXT,
    pinyin TEXT,
    english TEXT
  )
`);

const { count } = db.prepare('SELECT COUNT(*) as count FROM flashcards').get() as { count: number };

if (count === 0) {
  const insert = db.prepare('INSERT INTO flashcards (character, pinyin, english) VALUES (?, ?, ?)');
  const seed = db.transaction((cards: { character: string; pinyin: string; english: string }[]) => {
    for (const card of cards) {
      insert.run(card.character, card.pinyin, card.english);
    }
  });

  seed([
    { character: '你好', pinyin: 'nǐ hǎo', english: 'hello' },
    { character: '再见', pinyin: 'zài jiàn', english: 'goodbye' },
    { character: '是', pinyin: 'shì', english: 'yes' },
    { character: '不是', pinyin: 'bú shì', english: 'no' },
    { character: '对不起', pinyin: 'duì bù qǐ', english: 'sorry' },
    { character: '没关系', pinyin: 'méi guān xì', english: "it's okay" },
    { character: '吃饭', pinyin: 'chī fàn', english: 'eat food' },
    { character: '喝水', pinyin: 'hē shuǐ', english: 'drink water' },
    { character: '学习', pinyin: 'xué xí', english: 'study' },
    { character: '工作', pinyin: 'gōng zuò', english: 'work' },
    { character: '朋友', pinyin: 'péng yǒu', english: 'friend' },
    { character: '家人', pinyin: 'jiā rén', english: 'family' },
    { character: '时间', pinyin: 'shí jiān', english: 'time' },
    { character: '钱', pinyin: 'qián', english: 'money' },
    { character: '手机', pinyin: 'shǒu jī', english: 'mobile phone' },
    { character: '电脑', pinyin: 'diàn nǎo', english: 'computer' },
    { character: '班', pinyin: 'bān', english: 'class' },
    { character: '多少', pinyin: 'duō shao', english: 'how many' },
    { character: '学习', pinyin: 'xuéxí', english: 'study' },
    { character: '学', pinyin: 'xué', english: 'study' },
    { character: '汉语', pinyin: 'Hànyǔ', english: 'Chinese' },
    { character: '语', pinyin: 'yǔ', english: 'language' },
    { character: '英语', pinyin: 'Yīngyǔ', english: 'English' },
    { character: '难', pinyin: 'nán', english: 'difficult' },
    { character: '同学', pinyin: 'tóngxué', english: 'classmate' },
    { character: '男生', pinyin: 'nánshēng', english: 'boy student' },
    { character: '男', pinyin: 'nán', english: 'boy/male' },
    { character: '女生', pinyin: 'nǚ shēng', english: 'girl student' },
    { character: '女', pinyin: 'nǚ', english: 'girl/female' },
    { character: '都', pinyin: 'dōu', english: 'all' },
    { character: '请', pinyin: 'qǐng', english: 'please' },
    { character: '进', pinyin: 'jìn', english: 'enter' },
    { character: '外国', pinyin: 'wàiguó', english: 'foreign country' },
    { character: '朋友', pinyin: 'péngyou', english: 'friend' },
    { character: '名字', pinyin: 'míngzi', english: 'name' },
    { character: '哪', pinyin: 'nǎ/něi', english: 'which' },
    { character: '国', pinyin: 'guó', english: 'country' },
    { character: '一月', pinyin: 'yīyuè', english: 'January' },
    { character: '二月', pinyin: 'èryuè', english: 'February' },
    { character: '三月', pinyin: 'sānyuè', english: 'March' },
    { character: '四月', pinyin: 'sìyuè', english: 'April' },
    { character: '五月', pinyin: 'wǔyuè', english: 'May' },
    { character: '六月', pinyin: 'liùyuè', english: 'June' },
    { character: '七月', pinyin: 'qīyuè', english: 'July' },
    { character: '八月', pinyin: 'bāyuè', english: 'August' },
    { character: '九月', pinyin: 'jiǔyuè', english: 'September' },
    { character: '十月', pinyin: 'shíyuè', english: 'October' },
    { character: '十一月', pinyin: 'shíyīyuè', english: 'November' },
    { character: '十二月', pinyin: 'shí’èryuè', english: 'December' },
    { character: '星期', pinyin: 'xīngqī', english: 'week' },
    { character: '星期一', pinyin: 'xīngqīyī', english: 'Monday' },
    { character: '星期二', pinyin: 'xīngqīèr', english: 'Tuesday' },
    { character: '星期三', pinyin: 'xīngqīsān', english: 'Wednesday' },
    { character: '星期四', pinyin: 'xīngqīsì', english: 'Thursday' },
    { character: '星期五', pinyin: 'xīngqīwǔ', english: 'Friday' },
    { character: '星期六', pinyin: 'xīngqīliù', english: 'Saturday' },
    { character: '星期日/星期天', pinyin: 'xīngqīrì/xīngqītiān', english: 'Sunday' },
    { character: '今天', pinyin: 'jīntiān', english: 'today' },
    { character: '天', pinyin: 'tiān', english: 'day' },
    { character: '昨天', pinyin: 'zuótiān', english: 'yesterday' },
    { character: '明天', pinyin: 'míngtiān', english: 'tomorrow' },
    { character: '生日', pinyin: 'shēngrì', english: 'birthday' },
    { character: '祝', pinyin: 'zhù', english: 'to wish' },
    { character: '快乐', pinyin: 'kuàilè', english: 'happy' },
    { character: '谢谢', pinyin: 'xièxie', english: 'thank you' },
    { character: '不谢', pinyin: 'bú xiè', english: 'You’re welcome' },
    { character: '礼物', pinyin: 'lǐwù', english: 'gift' },
    { character: '对', pinyin: 'duì', english: 'yes; right; correct' },
    { character: '月', pinyin: 'yuè', english: 'month' },
    { character: '号/日', pinyin: 'hào/rì', english: 'date in a month' },
    { character: '送', pinyin: 'sòng', english: 'to give as a gift' },
    { character: '很', pinyin: 'hěn', english: 'is' },
    { character: '高兴', pinyin: 'gāoxìng', english: 'happy; glad' },
  ]);
}

export default db;
