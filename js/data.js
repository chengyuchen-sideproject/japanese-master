// ============================================================================
// 日語隨身通 Nihongo Go — 零基礎到日常對話 & JLPT N5~N1 完整教材資料庫
// ============================================================================

const ROADMAP_STAGES = [
  {
    id: "stage0",
    badge: "STAGE 0 · 零基礎起步",
    level: "zero",
    title: "五十音與發音直覺養成",
    period: "建議第 1 ~ 2 週",
    goal: "看字能讀出正確發音，掌握平假名、片假名、濁音、促音與長音規則",
    actionTab: "kana",
    actionLabel: "前往五十音互動表",
    checkpoints: [
      "平假名 46 清音：利用「字源聯想口訣」3 天內認熟（例：あ＝安、い＝以）",
      "片假名 46 清音：專拼外來語（コーヒー Coffee、ホテル Hotel、コンビニ 超商）",
      "濁音（がざだば）、半濁音（ぱ）、促音（っ 停頓一拍）、拗音（きゃ/しゃ/ちゃ）"
    ]
  },
  {
    id: "stage1",
    badge: "STAGE 1 · 開口說日語 (JLPT N5)",
    level: "N5",
    title: "生存會話與核心助詞突破",
    period: "建議第 3 ~ 8 週",
    goal: "能用日文打招呼、自我介紹、餐廳點餐、超商結帳、車站問路",
    actionTab: "conv",
    actionLabel: "練習生存情境對話",
    checkpoints: [
      "萬用句型：「A は B です（A 是 B）」、「～をください（請給我～）」、「～はどこですか（～在哪裡？）」",
      "核心助詞：は（主題）、の（的）、を（受詞）、に（時間/目的地）、で（場所/工具）",
      "掌握 800 個 N5 核心生存單字與數字、時間、價錢讀法"
    ]
  },
  {
    id: "stage2",
    badge: "STAGE 2 · 日常對話流利 (JLPT N4)",
    level: "N4",
    title: "動詞變化與生活自由交談",
    period: "建議第 3 ~ 5 個月",
    goal: "掌握動詞ます形、て形、ない形、た形，能與日本朋友聊興趣、旅遊與想法",
    actionTab: "conv",
    actionLabel: "練習日常交友對話",
    checkpoints: [
      "動詞「て形」連用：～てください（請做～）、～ています（正在～）、～てもいいですか（可以～嗎）",
      "常體（朋友口語）與敬體（ます/です）自然切換",
      "表達原因（～から / ～ので）、轉折（～が / ～けど）與經驗（～たことがあります）"
    ]
  },
  {
    id: "stage3",
    badge: "STAGE 3 · 進階社交與職場 (JLPT N3)",
    level: "N3",
    title: "日常新聞、書信與三大敬語",
    period: "建議第 6 ~ 9 個月",
    goal: "聽懂無字幕日常日劇 70%，掌握尊敬語與謙讓語，能處理生活突發狀況",
    actionTab: "cards",
    actionLabel: "複習 N3 單字與文法",
    checkpoints: [
      "三大敬語體系：丁寧語（です/ます）、尊敬語（いらっしゃる/お～になる）、謙讓語（伺う/お～する）",
      "推測與傳聞分辨：～そうだ（聽說/看起來）、～ようだ（好像）、～らしい（據說）",
      "被動形（～られる）與使役受身形在日常委婉表達中的運用"
    ]
  },
  {
    id: "stage4",
    badge: "STAGE 4 · 商務與新聞思辨 (JLPT N2)",
    level: "N2",
    title: "高頻商務溝通與邏輯評論",
    period: "建議第 10 ~ 14 個月",
    goal: "能流利閱讀 NHK 新聞與商業書信，進行商務會議與深度話題討論",
    actionTab: "cards",
    actionLabel: "挑戰 N2 核心閃卡",
    checkpoints: [
      "N2 關鍵書面句型：～に関して（關於）、～ざるを得ない（不得不）、～に違いない（必定是）",
      "掌握 6,000 個詞彙與複合動詞（～出す、～込む、～抜く、～切る）",
      "長篇閱讀因果轉折與聽解即時反應訓練"
    ]
  },
  {
    id: "stage5",
    badge: "STAGE 5 · 母語級精熟攻頂 (JLPT N1)",
    level: "N1",
    title: "JLPT N1 高階文語與抽象論述",
    period: "建議第 15 ~ 20 個月",
    goal: "掌握 10,000+ 詞彙與 200 條 N1 文語句型，高分通過 JLPT N1 檢定",
    actionTab: "quiz",
    actionLabel: "挑戰 N1 模擬測驗",
    checkpoints: [
      "N1 古典殘留與正式文語：～を余儀なくされる（被迫）、～たりとも～ない（連一點也～不）、～ならでは（唯有～才）",
      "N1 易混淆漢字音讀與訓讀精準辨析、四字熟語與慣用表現",
      "社論評論文長文速讀與高階商務/學術聽解"
    ]
  }
];

// 五十音完整資料（清音 46 + 濁音/半濁音 25 + 拗音代表）
const KANA_DATA = {
  seion: [
    // あ行
    { h: "あ", k: "ア", r: "a",  row: "あ行", mnemonic: "源自漢字「安」，女生盤腿坐很安心 → a", word: "あさ (朝)", wordZh: "早上" },
    { h: "い", k: "イ", r: "i",  row: "あ行", mnemonic: "源自漢字「以」左半，片假名イ像單人旁「伊」 → i", word: "いぬ (犬)", wordZh: "狗" },
    { h: "う", k: "ウ", r: "u",  row: "あ行", mnemonic: "源自漢字「宇」，像被踢肚子嗚(u)一聲彎腰", word: "うみ (海)", wordZh: "大海" },
    { h: "え", k: "エ", r: "e",  row: "あ行", mnemonic: "源自漢字「衣」，片假名エ就是「工」字 → e", word: "えき (駅)", wordZh: "車站" },
    { h: "お", k: "オ", r: "o",  row: "あ行", mnemonic: "源自漢字「於」，片假名オ像「才」字 → o", word: "おちゃ (お茶)", wordZh: "茶" },
    // か行
    { h: "か", k: "カ", r: "ka", row: "か行", mnemonic: "源自漢字「加」，出力氣「卡(ka)」住", word: "かさ (傘)", wordZh: "雨傘" },
    { h: "き", k: "キ", r: "ki", row: "か行", mnemonic: "長得像一把鑰匙 Key (ki)", word: "きっぷ (切符)", wordZh: "車票" },
    { h: "く", k: "ク", r: "ku", row: "か行", mnemonic: "小於符號 < 像委屈哭(ku)扁的嘴角", word: "くるま (車)", wordZh: "汽車" },
    { h: "け", k: "ケ", r: "ke", row: "か行", mnemonic: "源自漢字「計」，片假名ケ像竹字頭一半 → ke", word: "けいたいでんわ", wordZh: "手機" },
    { h: "こ", k: "コ", r: "ko", row: "か行", mnemonic: "源自漢字「己」，上下兩條線像嘴巴張開 ko", word: "ここ", wordZh: "這裡" },
    // さ行
    { h: "さ", k: "サ", r: "sa", row: "さ行", mnemonic: "源自「左」，片假名サ像草字頭「薩(sa)」", word: "さくら (桜)", wordZh: "櫻花" },
    { h: "し", k: "シ", r: "shi",row: "さ行", mnemonic: "像彎彎的吸(shi)管；片假名シ像三點水", word: "しお (塩)", wordZh: "鹽巴" },
    { h: "す", k: "ス", r: "su", row: "さ行", mnemonic: "一橫掛著圓圈像盪鞦韆「咻(su)」", word: "すし (寿司)", wordZh: "壽司" },
    { h: "せ", k: "セ", r: "se", row: "さ行", mnemonic: "源自漢字「世」少一筆 → se", word: "せんせい (先生)", wordZh: "老師/醫師" },
    { h: "そ", k: "ソ", r: "so", row: "さ行", mnemonic: "源自漢字「曾」上半部 Z+C → so", word: "そら (空)", wordZh: "天空" },
    // た行
    { h: "た", k: "タ", r: "ta", row: "た行", mnemonic: "源自「太」，片假名タ就是夕陽的「夕(ta)」", word: "たべもの (食べ物)", wordZh: "食物" },
    { h: "ち", k: "チ", r: "chi",row: "た行", mnemonic: "長得像阿拉伯數字 5，片假名チ像「千(chi)」", word: "ちかてつ (地下鉄)", wordZh: "地鐵" },
    { h: "つ", k: "ツ", r: "tsu",row: "た行", mnemonic: "源自「川」，像刺(tsu)蝟捲起身體", word: "つくえ (机)", wordZh: "書桌" },
    { h: "て", k: "テ", r: "te", row: "た行", mnemonic: "源自「天」，像手掌張開「手(te)」", word: "てがみ (手紙)", wordZh: "信件" },
    { h: "と", k: "ト", r: "to", row: "た行", mnemonic: "源自「止」，片假名ト就是蘿蔔「卜(to)」", word: "ともだち (友達)", wordZh: "朋友" },
    // な行
    { h: "な", k: "ナ", r: "na", row: "な行", mnemonic: "源自漢字「奈」，大+點+打結 → na", word: "なつ (夏)", wordZh: "夏天" },
    { h: "に", k: "ニ", r: "ni", row: "な行", mnemonic: "源自漢字「仁」，片假名ニ就是數字「二(ni)」", word: "にほん (日本)", wordZh: "日本" },
    { h: "ぬ", k: "ヌ", r: "nu", row: "な行", mnemonic: "源自漢字「奴」，片假名ヌ像「又」字 → nu", word: "ぬいぐるみ", wordZh: "絨毛玩偶" },
    { h: "ね", k: "ネ", r: "ne", row: "な行", mnemonic: "源自「祢」，片假名ネ像示字旁「禮(ne)」", word: "ねこ (猫)", wordZh: "貓咪" },
    { h: "の", k: "ノ", r: "no", row: "な行", mnemonic: "源自「乃」，最常見的「の(的)」，片假名ノ是一撇", word: "のみもの (飲み物)", wordZh: "飲料" },
    // は行
    { h: "は", k: "ハ", r: "ha", row: "は行", mnemonic: "源自「波」，片假名ハ像八字鬍「哈(ha)」", word: "はな (花)", wordZh: "花朵" },
    { h: "ひ", k: "ヒ", r: "hi", row: "は行", mnemonic: "像笑彎的大嘴巴「嘻(hi)」，片假名ヒ是「比」右邊", word: "ひこうき (飛行機)", wordZh: "飛機" },
    { h: "ふ", k: "フ", r: "fu", row: "は行", mnemonic: "源自「不」，像富士山輪廓「呼(fu)」", word: "ふゆ (冬)", wordZh: "冬天" },
    { h: "へ", k: "ヘ", r: "he", row: "は行", mnemonic: "平片假名長一樣，像笑咪咪的眉毛「嘿(he)」", word: "へや (部屋)", wordZh: "房間" },
    { h: "ほ", k: "ホ", r: "ho", row: "は行", mnemonic: "源自「保」，片假名ホ就是「木」字加兩點 → ho", word: "ほん (本)", wordZh: "書本" },
    // ま行
    { h: "ま", k: "マ", r: "ma", row: "ま行", mnemonic: "源自「末」，媽(ma)媽兩橫打結", word: "まち (町)", wordZh: "城鎮/街道" },
    { h: "み", k: "ミ", r: "mi", row: "ま行", mnemonic: "源自「美」，片假名ミ像貓咪(mi)三根鬍鬚", word: "みず (水)", wordZh: "水" },
    { h: "む", k: "ム", r: "mu", row: "ま行", mnemonic: "源自「武」，片假名ム就是「牟(mu)」上半部", word: "むし (虫)", wordZh: "蟲" },
    { h: "め", k: "メ", r: "me", row: "ま行", mnemonic: "源自「女」，美女的眼睛「目(me)」", word: "めがね (眼鏡)", wordZh: "眼鏡" },
    { h: "も", k: "モ", r: "mo", row: "ま行", mnemonic: "源自「毛」少一撇 → mo", word: "もも (桃)", wordZh: "水蜜桃" },
    // や行
    { h: "や", k: "ヤ", r: "ya", row: "や行", mnemonic: "源自漢字「也」 → ya", word: "やま (山)", wordZh: "山" },
    { h: "",   k: "",   r: "",   row: "や行", empty: true },
    { h: "ゆ", k: "ユ", r: "yu", row: "や行", mnemonic: "源自「由」，像熱水澡堂布簾上的「ゆ(湯 yu)」", word: "ゆき (雪)", wordZh: "雪" },
    { h: "",   k: "",   r: "",   row: "や行", empty: true },
    { h: "よ", k: "ヨ", r: "yo", row: "や行", mnemonic: "源自「與」，片假名ヨ像倒過來的 E → yo", word: "よる (夜)", wordZh: "夜晚" },
    // ら行
    { h: "ら", k: "ラ", r: "ra", row: "ら行", mnemonic: "源自「良」，像數字 5 上面加一點 → ra", word: "らいねん (来年)", wordZh: "明年" },
    { h: "り", k: "リ", r: "ri", row: "ら行", mnemonic: "源自「利」的立刀旁 → ri", word: "りんご (林檎)", wordZh: "蘋果" },
    { h: "る", k: "ル", r: "ru", row: "ら行", mnemonic: "源自「留」，結尾捲一個小圈圈 → ru", word: "るす (留守)", wordZh: "不在家" },
    { h: "れ", k: "レ", r: "re", row: "ら行", mnemonic: "源自「礼」，片假名レ像打勾勾 → re", word: "れきし (歴史)", wordZh: "歷史" },
    { h: "ろ", k: "ロ", r: "ro", row: "ら行", mnemonic: "源自「呂」，片假名ロ就是「口(ro)」", word: "ろく (六)", wordZh: "數字六" },
    // わ行 + ん
    { h: "わ", k: "ワ", r: "wa", row: "わ行", mnemonic: "源自「和」，肚子圓圓「哇(wa)」", word: "わたし (私)", wordZh: "我" },
    { h: "",   k: "",   r: "",   row: "わ行", empty: true },
    { h: "を", k: "ヲ", r: "wo", row: "わ行", mnemonic: "源自「遠」，專門當受格助詞（發音同お o）", word: "みずをのむ", wordZh: "喝水" },
    { h: "",   k: "",   r: "",   row: "わ行", empty: true },
    { h: "ん", k: "ン", r: "n",  row: "鼻音", mnemonic: "像英文字母 n，閉嘴鼻音「嗯(n)」", word: "かばん (鞄)", wordZh: "包包" }
  ],
  dakuon: [
    { h: "が", k: "ガ", r: "ga", row: "が行", mnemonic: "か(ka) 右上加兩點變濁音 ga", word: "がっこう (学校)", wordZh: "學校" },
    { h: "ぎ", k: "ギ", r: "gi", row: "が行", mnemonic: "き(ki) 加兩點變 gi", word: "ぎんこう (銀行)", wordZh: "銀行" },
    { h: "ぐ", k: "グ", r: "gu", row: "が行", mnemonic: "く(ku) 加兩點變 gu", word: "ぐあい (具合)", wordZh: "身體狀況" },
    { h: "げ", k: "ゲ", r: "ge", row: "が行", mnemonic: "け(ke) 加兩點變 ge", word: "げんき (元気)", wordZh: "有精神/健康" },
    { h: "ご", k: "ゴ", r: "go", row: "が行", mnemonic: "こ(ko) 加兩點變 go", word: "ごはん (ご飯)", wordZh: "白飯/餐點" },

    { h: "ざ", k: "ザ", r: "za", row: "ざ行", mnemonic: "さ(sa) 加兩點變 za", word: "ざっし (雑誌)", wordZh: "雜誌" },
    { h: "じ", k: "ジ", r: "ji", row: "ざ行", mnemonic: "し(shi) 加兩點變 ji", word: "じかん (時間)", wordZh: "時間" },
    { h: "ず", k: "ズ", r: "zu", row: "ざ行", mnemonic: "す(su) 加兩點變 zu", word: "ちず (地図)", wordZh: "地圖" },
    { h: "ぜ", k: "ゼ", r: "ze", row: "ざ行", mnemonic: "せ(se) 加兩點變 ze", word: "ぜんぶ (全部)", wordZh: "全部" },
    { h: "ぞ", k: "ゾ", r: "zo", row: "ざ行", mnemonic: "そ(so) 加兩點變 zo", word: "かぞく (家族)", wordZh: "家人" },

    { h: "だ", k: "ダ", r: "da", row: "だ行", mnemonic: "た(ta) 加兩點變 da", word: "だいがく (大学)", wordZh: "大學" },
    { h: "ぢ", k: "ヂ", r: "ji", row: "だ行", mnemonic: "ち(chi) 加兩點（發音同じ ji）", word: "はなぢ (鼻血)", wordZh: "鼻血" },
    { h: "づ", k: "ヅ", r: "zu", row: "だ行", mnemonic: "つ(tsu) 加兩點（發音同ず zu）", word: "つづく (続く)", wordZh: "繼續" },
    { h: "で", k: "デ", r: "de", row: "だ行", mnemonic: "て(te) 加兩點變 de", word: "でんしゃ (電車)", wordZh: "電車" },
    { h: "ど", k: "ド", r: "do", row: "だ行", mnemonic: "と(to) 加兩點變 do", word: "どこ", wordZh: "哪裡" },

    { h: "ば", k: "バ", r: "ba", row: "ば行", mnemonic: "は(ha) 加兩點變 ba", word: "バス", wordZh: "公車 (Bus)" },
    { h: "び", k: "ビ", r: "bi", row: "ば行", mnemonic: "ひ(hi) 加兩點變 bi", word: "コンビニ", wordZh: "便利商店" },
    { h: "ぶ", k: "ブ", r: "bu", row: "ば行", mnemonic: "ふ(fu) 加兩點變 bu", word: "ぶたにく (豚肉)", wordZh: "豬肉" },
    { h: "べ", k: "ベ", r: "be", row: "ば行", mnemonic: "へ(he) 加兩點變 be", word: "べんきょう (勉強)", wordZh: "學習/讀書" },
    { h: "ぼ", k: "ボ", r: "bo", row: "ば行", mnemonic: "ほ(ho) 加兩點變 bo", word: "ぼうし (帽子)", wordZh: "帽子" },

    { h: "ぱ", k: "パ", r: "pa", row: "ぱ行", mnemonic: "は(ha) 右上加小圓圈變半濁音 pa", word: "パン", wordZh: "麵包" },
    { h: "ぴ", k: "ピ", r: "pi", row: "ぱ行", mnemonic: "ひ(hi) 加小圓圈變 pi", word: "ピンク", wordZh: "粉紅色" },
    { h: "ぷ", k: "プ", r: "pu", row: "ぱ行", mnemonic: "ふ(fu) 加小圓圈變 pu", word: "プレゼント", wordZh: "禮物" },
    { h: "ぺ", k: "ペ", r: "pe", row: "ぱ行", mnemonic: "へ(he) 加小圓圈變 pe", word: "ペン", wordZh: "筆 (Pen)" },
    { h: "ぽ", k: "ポ", r: "po", row: "ぱ行", mnemonic: "ほ(ho) 加小圓圈變 po", word: "さんぽ (散歩)", wordZh: "散步" }
  ],
  yoon: [
    { h: "きゃ", k: "キャ", r: "kya", row: "拗音", mnemonic: "き + 小や 連讀成一拍 kya", word: "きゃく (客)", wordZh: "客人" },
    { h: "きゅ", k: "キュ", r: "kyu", row: "拗音", mnemonic: "き + 小ゆ 連讀成 kyu", word: "きゅうり", wordZh: "小黃瓜" },
    { h: "きょ", k: "キョ", r: "kyo", row: "拗音", mnemonic: "き + 小よ 連讀成 kyo", word: "きょう (今日)", wordZh: "今天" },
    { h: "しゃ", k: "シャ", r: "sha", row: "拗音", mnemonic: "し + 小や 連讀成 sha", word: "しゃしん (写真)", wordZh: "照片" },
    { h: "しゅ", k: "シュ", r: "shu", row: "拗音", mnemonic: "し + 小ゆ 連讀成 shu", word: "しゅみ (趣味)", wordZh: "興趣" },
    { h: "しょ", k: "ショ", r: "sho", row: "拗音", mnemonic: "し + 小よ 連讀成 sho", word: "しょくじ (食事)", wordZh: "用餐" },
    { h: "ちゃ", k: "チャ", r: "cha", row: "拗音", mnemonic: "ち + 小や 連讀成 cha", word: "おちゃ (お茶)", wordZh: "茶" },
    { h: "ちゅ", k: "チュ", r: "chu", row: "拗音", mnemonic: "ち + 小ゆ 連讀成 chu", word: "ちゅうもん (注文)", wordZh: "點餐/訂購" },
    { h: "ちょ", k: "チョ", r: "cho", row: "拗音", mnemonic: "ち + 小よ 連讀成 cho", word: "ちょっと", wordZh: "稍微/一下" },
    { h: "りゃ", k: "リャ", r: "rya", row: "拗音", mnemonic: "り + 小や 連讀成 rya", word: "りゃくご (略語)", wordZh: "簡稱" },
    { h: "りゅ", k: "リュ", r: "ryu", row: "拗音", mnemonic: "り + 小ゆ 連讀成 ryu", word: "りゅうがく (留学)", wordZh: "留學" },
    { h: "りょ", k: "リョ", r: "ryo", row: "拗音", mnemonic: "り + 小よ 連讀成 ryo", word: "りょこう (旅行)", wordZh: "旅行" }
  ]
};

// 8 大真實情境對話（從零基礎生存對話到商務敬語）
const CONVERSATIONS = [
  {
    id: "intro",
    level: "N5",
    title: "1. 初次見面與自我介紹",
    situation: "認識日本新朋友或同事時最實用的第一段對話",
    lines: [
      {
        speaker: "你 (You)",
        role: "B",
        jp: "はじめまして。台湾から来ました。よろしくお願いします。",
        kana: "はじめまして。たいわんから きました。よろしく おねがいします。",
        romaji: "Hajimemashite. Taiwan kara kimashita. Yoroshiku onegaishimasu.",
        zh: "初次見面。我從台灣來。請多多指教。",
        tip: "「～から来ました (kara kimashita)」表示「從～來」，把台灣換成任何城市都通用！"
      },
      {
        speaker: "田中さん (Tanaka)",
        role: "A",
        jp: "はじめまして、田中です。日本語がお上手ですね！",
        kana: "はじめまして、たなかです。にほんごが おじょうずですね！",
        romaji: "Hajimemashite, Tanaka desu. Nihongo ga ojouzu desu ne!",
        zh: "初次見面，我是田中。您的日文真好呢！",
        tip: "日本人常稱讚「お上手ですね (很厲害呢)」，這時謙虛回答「いいえ、まだまだです」最自然。"
      },
      {
        speaker: "你 (You)",
        role: "B",
        jp: "いいえ、まだまだです。いま一生懸命勉強しています。",
        kana: "いいえ、まだまだです。いま いっしょうけんめい べんきょうしています。",
        romaji: "Iie, madamada desu. Ima isshoukenmei benkyou shite imasu.",
        zh: "哪裡，還差得遠呢。現在正在努力學習中。",
        tip: "「まだまだです (madamada desu)」＝還差得遠；「勉強しています」＝正在學習。"
      }
    ]
  },
  {
    id: "restaurant",
    level: "N5",
    title: "2. 餐廳點餐與結帳",
    situation: "走進日本餐廳從入座、點餐到買單必備句型",
    lines: [
      {
        speaker: "店員 (Staff)",
        role: "A",
        jp: "いらっしゃいませ。何名様ですか？",
        kana: "いらっしゃいませ。なんめいさま ですか？",
        romaji: "Irasshaimase. Nanmeisama desu ka?",
        zh: "歡迎光臨。請問幾位呢？",
        tip: "1位＝ひとり (hitori)、2位＝ふたり (futari)、3位＝さんにん (sannin)。"
      },
      {
        speaker: "你 (You)",
        role: "B",
        jp: "二人です。すみません、これと生ビールを一つください。",
        kana: "ふたりです。すみません、これと なまビールを ひとつ ください。",
        romaji: "Futari desu. Sumimasen, kore to nama biiru wo hitotsu kudasai.",
        zh: "兩位。不好意思，請給我這個，還有一杯生啤酒。",
        tip: "手指菜單說「これをください (請給我這個)」是零基礎最好用的點餐神句！"
      },
      {
        speaker: "你 (You)",
        role: "B",
        jp: "ごちそうさまでした。お会計をお願いします。カードで払えますか？",
        kana: "ごちそうさまでした。おかいけいを おねがいします。カードで はらえますか？",
        romaji: "Gochisousama deshita. Okaikei wo onegaishimasu. Kaado de haraemasu ka?",
        zh: "多謝款待。麻煩結帳。請問可以刷卡嗎？",
        tip: "結帳說「お会計 (okaikei) をお願いします」；「カードで (用信用卡)」＋「払えますか (能付嗎)」。"
      }
    ]
  },
  {
    id: "station",
    level: "N5",
    title: "3. 車站問路與搭電車",
    situation: "在東京/大阪車站找不到月台或出口時的救命對話",
    lines: [
      {
        speaker: "你 (You)",
        role: "B",
        jp: "すみません、新宿駅へ行きたいんですが、どの電車に乗ればいいですか？",
        kana: "すみません、しんじゅくえきへ いきたいんですが、どの でんしゃに のれば いいですか？",
        romaji: "Sumimasen, Shinjuku-eki e ikitain desu ga, dono densha ni noreba ii desu ka?",
        zh: "不好意思，我想去新宿站，請問搭哪班電車好呢？",
        tip: "「～へ行きたいんですが (我想去～)」語氣委婉自然，後面可接任何問題。"
      },
      {
        speaker: "駅員 (Station Staff)",
        role: "A",
        jp: "山手線の３番ホームから乗ってください。約１０分で着きますよ。",
        kana: "やまのてせんの さんばんホームから のって ください。やく じゅっぷんで つきますよ。",
        romaji: "Yamanote-sen no san-ban hoomu kara notte kudasai. Yaku juppun de tsukimasu yo.",
        zh: "請從山手線的 3 號月台搭乘。大約 10 分鐘就會到囉。",
        tip: "「ホーム (hoomu / Platform)」是月台；「乗ってください」＝請搭乘。"
      },
      {
        speaker: "你 (You)",
        role: "B",
        jp: "ありがとうございます！とても助かりました。",
        kana: "ありがとうございます！とても たすかりました。",
        romaji: "Arigatou gozaimasu! Totemo tasukarimashita.",
        zh: "非常謝謝您！真是幫了大忙。",
        tip: "受人幫助時加一句「助かりました (幫了大忙)」，日本人會覺得你非常道地有禮貌！"
      }
    ]
  },
  {
    id: "shopping",
    level: "N4",
    title: "4. 藥妝店購物與免稅退稅",
    situation: "詢問庫存、試穿尺寸與辦理免稅 (Tax-Free)",
    lines: [
      {
        speaker: "你 (You)",
        role: "B",
        jp: "すみません、この商品の新しい在庫はありますか？",
        kana: "すみません、この しょうひんの あたらしい ざいこは ありますか？",
        romaji: "Sumimasen, kono shouhin no atarashii zaiko wa arimasu ka?",
        zh: "不好意思，請問這個商品有新的庫存嗎？",
        tip: "拿著手機照片問店員：「これ、ありますか？ (請問有這個嗎？)」也能一秒溝通！"
      },
      {
        speaker: "店員 (Staff)",
        role: "A",
        jp: "はい、ございます。免税（タックスフリー）になさいますか？",
        kana: "はい、ございます。めんぜい（タックスフリー）に なさいますか？",
        romaji: "Hai, gozaimasu. Menzei (takkusu furii) ni nasaimasu ka?",
        zh: "有的。請問您要辦理免稅嗎？",
        tip: "「ございます」是「あります」的禮貌敬語；「なさいますか」＝您要做～嗎？"
      },
      {
        speaker: "你 (You)",
        role: "B",
        jp: "はい、免税でお願いします。パスポートはこちらです。",
        kana: "はい、めんぜいで おねがいします。パスポートは こちらです。",
        romaji: "Hai, menzei de onegaishimasu. Pasupooto wa kochira desu.",
        zh: "好的，麻煩辦理免稅。護照在這裡。",
        tip: "遞東西給對方時說「こちらです (在這裡)」，比「これです」更優雅得體。"
      }
    ]
  },
  {
    id: "hotel",
    level: "N4",
    title: "5. 飯店入住與寄放行李",
    situation: "抵達飯店 Check-in、詢問早餐時間與寄放行李",
    lines: [
      {
        speaker: "你 (You)",
        role: "B",
        jp: "こんにちは。今日から二泊予約しているチェンです。チェックインをお願いします。",
        kana: "こんにちは。きょうから にはく よやくしている チェンです。チェックインを おねがいします。",
        romaji: "Konnichiwa. Kyou kara nihaku yoyaku shite iru Chen desu. Chekku-in wo onegaishimasu.",
        zh: "您好。我是預約今天起住兩晚的陳。麻煩幫我辦理入住。",
        tip: "一晚＝一泊 (ippaku)、兩晚＝二泊 (nihaku)；「予約している＋名字」＝已預約的某某。"
      },
      {
        speaker: "フロント (Front Desk)",
        role: "A",
        jp: "チェン様ですね。ご予約を確認いたしました。朝食は朝７時から９時半までです。",
        kana: "チェンさまですね。ごよやくを かくにん いたしました。ちょうしょくは あさ しちじから くじはん までです。",
        romaji: "Chen-sama desu ne. Goyoyaku wo kakunin itashimashita. Choushoku wa asa shichiji kara kujihan made desu.",
        zh: "陳先生/小姐是嗎。已確認您的預約。早餐從早上 7 點到 9 點半。",
        tip: "「～から～まで (kara ~ made)」＝從～到～。"
      },
      {
        speaker: "你 (You)",
        role: "B",
        jp: "わかりました。チェックアウトの後、荷物を預かってもらえますか？",
        kana: "わかりました。チェックアウトの あと、にもつを あずかって もらえますか？",
        romaji: "Wakarimashita. Chekku-auto no ato, nimotsu wo azukatte moraemasu ka?",
        zh: "我明白了。請問退房之後，可以幫我保管行李嗎？",
        tip: "「荷物を預かってもらえますか (nimotsu wo azukatte moraemasu ka)」是旅遊寄放行李必背句！"
      }
    ]
  },
  {
    id: "friends",
    level: "N4",
    title: "6. 朋友閒聊：興趣與週末邀約",
    situation: "與日本朋友拉近距離、聊日常興趣並約吃飯",
    lines: [
      {
        speaker: "佐藤 (Sato)",
        role: "A",
        jp: "休みの日はいつも何をしていますか？趣味は何ですか？",
        kana: "やすみの ひは いつも なにを していますか？しゅみは なんですか？",
        romaji: "Yasumi no hi wa itsumo nani wo shite imasu ka? Shumi wa nan desu ka?",
        zh: "放假的日子你平常都在做什麼呢？興趣是什麼？",
        tip: "「休みの日 (yasumi no hi)」＝假日；「趣味 (shumi)」＝興趣。"
      },
      {
        speaker: "你 (You)",
        role: "B",
        jp: "日本のアニメを見たり、カフェでコーヒーを飲んだりしています。",
        kana: "にほんの アニメを みたり、カフェで コーヒーを のんだり しています。",
        romaji: "Nihon no anime wo mitari, kafe de koohii wo nondari shite imasu.",
        zh: "我會看看日本動漫、在咖啡廳喝喝咖啡之類的。",
        tip: "N4 必學句型「～たり、～たりしています」用來列舉平常做的兩三個代表動作！"
      },
      {
        speaker: "你 (You)",
        role: "B",
        jp: "今度の週末、もし時間があったら、一緒にラーメンを食べに行きませんか？",
        kana: "こんどの しゅうまつ、もし じかんが あったら、いっしょに ラーメンを たべに いきませんか？",
        romaji: "Kondo no shuumatsu, moshi jikan ga attara, issho ni raamen wo tabe ni ikimasen ka?",
        zh: "這個週末如果時間方便的話，要不要一起去吃拉麵呢？",
        tip: "邀約對方用否定疑問「～ませんか (要不要一起～呢？)」非常自然又不會給對方壓力。"
      }
    ]
  },
  {
    id: "pharmacy",
    level: "N3",
    title: "7. 身體不適與藥局買藥",
    situation: "旅途中感冒、頭痛或腸胃不適時向藥劑師說明症狀",
    lines: [
      {
        speaker: "你 (You)",
        role: "B",
        jp: "すみません、昨日の夜から喉が痛くて、少し熱があるみたいです。",
        kana: "すみません、きのうの よるから のどが いたくて、すこし ねつが あるみたいです。",
        romaji: "Sumimasen, kinou no yoru kara nodo ga itakute, sukoshi netsu ga aru mitai desu.",
        zh: "不好意思，我從昨晚開始喉嚨痛，而且好像有點發燒。",
        tip: "「喉が痛い (喉嚨痛)」、「頭が痛い (頭痛)」、「お腹が痛い (肚子痛)」；「～みたいです」＝好像～。 "
      },
      {
        speaker: "薬剤師 (Pharmacist)",
        role: "A",
        jp: "それはいけませんね。眠くなりにくい風邪薬をお出ししましょうか？",
        kana: "それは いけませんね。ねむく なりにくい かぜぐすりを おだし しましょうか？",
        romaji: "Sore wa ikemasen ne. Nemuku narinikui kazegusuri wo odashi shimashou ka?",
        zh: "那可糟了呢。我拿比較不會想睡覺的感冒藥給您好嗎？",
        tip: "「眠くなりにくい (比較不會嗜睡)」在買日本感冒藥或鼻炎藥時超常聽到！"
      },
      {
        speaker: "你 (You)",
        role: "B",
        jp: "はい、お願いします。食後に一日三回飲めばよろしいでしょうか？",
        kana: "はい、おねがいします。しょくごに いちにち さんかい のめば よろしいでしょうか？",
        romaji: "Hai, onegaishimasu. Shokugo ni ichinichi sankai nomeba yoroshii deshou ka?",
        zh: "好的，麻煩您了。請問是飯後一天吃三次就可以了嗎？",
        tip: "日文「薬を飲む (喝藥＝吃藥)」動詞用「飲む (nomu)」！飯前＝食前，飯後＝食後。"
      }
    ]
  },
  {
    id: "business",
    level: "N1",
    title: "8. 職場商務談判與高階敬語 (N3~N1)",
    situation: "與日本客戶開會、表達感謝與商務提案的高階應對",
    lines: [
      {
        speaker: "你 (You)",
        role: "B",
        jp: "平素は格別のご高配を賜り、厚く御礼申し上げます。",
        kana: "へいそは かくべつの ごこうはいを たまわり、あつく おんれい もうしあげます。",
        romaji: "Heiso wa kakubetsu no gokouhai wo tamawari, atsuku onrei moushiagemasu.",
        zh: "平素承蒙您格外關照，謹致上最深切的謝意。",
        tip: "N1 商務頂級寒暄：「賜る (tamawaru＝蒙受恩惠)」、「御礼申し上げます (致上謝意)」。"
      },
      {
        speaker: "取引先 (Client)",
        role: "A",
        jp: "こちらこそ、御社のご提案に即して検討を進めた結果、非常に前向きな評価となっております。",
        kana: "こちらこそ、おんしゃの ごていあんに そくして けんとうを すすめた けっか、ひじょうに まえむきな ひょうかと なって おります。",
        romaji: "Kochira koso, onsha no goteian ni sokushite kentou wo susumeta kekka, hijou ni maemuki na hyouka to natte orimasu.",
        zh: "彼此彼此，我們根據貴公司的提案進行評估後，目前獲得非常正面的評價。",
        tip: "N1 核心句型「～に即して (ni sokushite)」＝切合、符合、根據（事實/提案/規章）。"
      },
      {
        speaker: "你 (You)",
        role: "B",
        jp: "恐れ入ります。詳細につきましては、追って資料を添付のうえメールにてご報告いたします。",
        kana: "おそれいります。しょうさいに つきましては、おって しりょうを てんぷの うえ メールにて ごほうこく いたします。",
        romaji: "Osoreirimasu. Shousai ni tsukimashite wa, otte shiryou wo tenpu no ue meeru nite gohoukoku itashimasu.",
        zh: "感激不盡。關於細節部分，稍後會附上資料並透過電子郵件向您報告。",
        tip: "「恐れ入ります」商務萬用謙遜致謝；「～のうえ (在～之後)」、「お～いたします (謙讓語)」。"
      }
    ]
  }
];

// SRS 單字庫（涵蓋 ZERO 零基礎生存 -> N5 -> N4 -> N3 -> N2 -> N1）
const VOCAB_LIST = [
  // ZERO 零基礎生存必背
  { id: "v_z1", level: "zero", word: "ありがとうございます", reading: "ありがとうございます", romaji: "arigatou gozaimasu", pos: "寒暄", meaning: "非常謝謝（禮貌）", exJp: "いつもありがとうございます。", exZh: "一直以來非常感謝您。" },
  { id: "v_z2", level: "zero", word: "すみません", reading: "すみません", romaji: "sumimasen", pos: "寒暄", meaning: "不好意思 / 對不起 / 借過", exJp: "すみません、注文をお願いします。", exZh: "不好意思，我要點餐。" },
  { id: "v_z3", level: "zero", word: "お願いします", reading: "おねがいします", romaji: "onegaishimasu", pos: "寒暄", meaning: "麻煩您了 / 拜託了", exJp: "お会計をお願いします。", exZh: "麻煩幫我結帳。" },
  { id: "v_z4", level: "zero", word: "大丈夫です", reading: "だいじょうぶです", romaji: "daijoubu desu", pos: "常用句", meaning: "沒問題 / 不用，謝謝（委婉拒絕）", exJp: "レジ袋は大丈夫です。", exZh: "不用塑膠袋，謝謝。" },
  { id: "v_z5", level: "zero", word: "トイレ", reading: "トイレ", romaji: "toire", pos: "名詞", meaning: "洗手間 / 廁所", exJp: "すみません、トイレはどこですか？", exZh: "不好意思，請問洗手間在哪裡？" },
  { id: "v_z6", level: "zero", word: "いくらですか", reading: "いくらですか", romaji: "ikura desu ka", pos: "疑問句", meaning: "請問多少錢？", exJp: "すみません、これはいくらですか？", exZh: "不好意思，請問這個多少錢？" },

  // JLPT N5
  { id: "v_n5_1", level: "N5", word: "食べる", reading: "たべる [2]", romaji: "taberu", pos: "動詞 II", meaning: "吃", exJp: "朝ご飯にパンを食べます。", exZh: "早餐吃麵包。" },
  { id: "v_n5_2", level: "N5", word: "飲む", reading: "のむ [1]", romaji: "nomu", pos: "動詞 I", meaning: "喝、服用(藥)", exJp: "毎朝コーヒーを飲みます。", exZh: "每天早上喝咖啡。" },
  { id: "v_n5_3", level: "N5", word: "行く", reading: "いく [0]", romaji: "iku", pos: "動詞 I", meaning: "去、前往", exJp: "来月、日本へ行きます。", exZh: "下個月要去日本。" },
  { id: "v_n5_4", level: "N5", word: "美味しい", reading: "おいしい [3]", romaji: "oishii", pos: "い形容詞", meaning: "好吃的、美味的", exJp: "このラーメンはとても美味しいです。", exZh: "這碗拉麵非常好吃。" },
  { id: "v_n5_5", level: "N5", word: "便利", reading: "べんり [1]", romaji: "benri", pos: "な形容詞", meaning: "方便的、便利的", exJp: "地下鉄は速くて便利です。", exZh: "地鐵又快又方便。" },
  { id: "v_n5_6", level: "N5", word: "時間", reading: "じかん [0]", romaji: "jikan", pos: "名詞", meaning: "時間、小時", exJp: "いま少し時間がありますか？", exZh: "現在有一點時間嗎？" },

  // JLPT N4
  { id: "v_n4_1", level: "N4", word: "予約", reading: "よやく [0]", romaji: "yoyaku", pos: "名詞/スル動詞", meaning: "預約、預訂", exJp: "ホテルをインターネットで予約しました。", exZh: "在網路上預訂了飯店。" },
  { id: "v_n4_2", level: "N4", word: "間に合う", reading: "まにあう [3]", romaji: "maniau", pos: "動詞 I", meaning: "來得及、趕得上", exJp: "走れば終電に間に合いますよ。", exZh: "用跑的話還趕得上末班車喔。" },
  { id: "v_n4_3", level: "N4", word: "相談", reading: "そうだん [0]", romaji: "soudan", pos: "名詞/スル動詞", meaning: "商量、諮詢", exJp: "友達に旅行の計画を相談しました。", exZh: "和朋友商量了旅行計畫。" },
  { id: "v_n4_4", level: "N4", word: "丁寧", reading: "ていねい [1]", romaji: "teinei", pos: "な形容詞", meaning: "有禮貌的、仔細周到的", exJp: "店員さんが丁寧に説明してくれました。", exZh: "店員很仔細有禮貌地為我說明。" },
  { id: "v_n4_5", level: "N4", word: "乗り換える", reading: "のりかえる [4]", romaji: "norikaeru", pos: "動詞 II", meaning: "換車、轉乘", exJp: "東京駅で新幹線に乗り換えます。", exZh: "在東京站轉乘新幹線。" },
  { id: "v_n4_6", level: "N4", word: "用意", reading: "ようい [1]", romaji: "youi", pos: "名詞/スル動詞", meaning: "準備", exJp: "食事の用意ができました。", exZh: "餐點已經準備好了。" },

  // JLPT N3
  { id: "v_n3_1", level: "N3", word: "伺う", reading: "うかがう [0]", romaji: "ukagau", pos: "動詞 I (謙讓)", meaning: "拜訪、請教、聽說（いく/きく的謙讓語）", exJp: "明日、御社へ伺います。", exZh: "明天我將前往貴公司拜訪。" },
  { id: "v_n3_2", level: "N3", word: "影響", reading: "えいきょう [0]", romaji: "eikyou", pos: "名詞/スル動詞", meaning: "影響", exJp: "台風の影響で電車が遅れています。", exZh: "受颱風影響，電車正在誤點。" },
  { id: "v_n3_3", level: "N3", word: "確認", reading: "かくにん [0]", romaji: "kakunin", pos: "名詞/スル動詞", meaning: "確認、核對", exJp: "日程を確認してから返事します。", exZh: "確認行程之後再回覆您。" },
  { id: "v_n3_4", level: "N3", word: "我慢", reading: "がまん [1]", romaji: "gaman", pos: "名詞/スル動詞", meaning: "忍耐、克制", exJp: "痛みを我慢して病院へ行きました。", exZh: "忍著疼痛去了醫院。" },
  { id: "v_n3_5", level: "N3", word: "偶然", reading: "ぐうぜん [0]", romaji: "guuzen", pos: "名詞/副詞", meaning: "偶然、碰巧", exJp: "駅で偶然昔の友達に会った。", exZh: "在車站碰巧遇到以前的朋友。" },
  { id: "v_n3_6", level: "N3", word: "雰囲気", reading: "ふんいき [3]", romaji: "fun'iki", pos: "名詞", meaning: "氣氛、氛圍", exJp: "このカフェは落ち着いた雰囲気がある。", exZh: "這家咖啡廳有沉穩的氛圍。" },

  // JLPT N2
  { id: "v_n2_1", level: "N2", word: "妥協", reading: "だきょう [0]", romaji: "dakyou", pos: "名詞/スル動詞", meaning: "妥協、讓步", exJp: "品質に関しては一切妥協しない。", exZh: "關於品質方面絕不妥協。" },
  { id: "v_n2_2", level: "N2", word: "契機", reading: "けいき [1]", romaji: "keiki", pos: "名詞", meaning: "契機、轉機", exJp: "留学を契機に日本語の勉強を本格的に始めた。", exZh: "以留學為契機，正式開始學習日語。" },
  { id: "v_n2_3", level: "N2", word: "把握", reading: "はあく [0]", romaji: "haaku", pos: "名詞/スル動詞", meaning: "掌握、理解", exJp: "現状の問題点を正確に把握する必要がある。", exZh: "有必要準確掌握現狀的問題點。" },
  { id: "v_n2_4", level: "N2", word: "迅速", reading: "じんそく [0]", romaji: "jinsoku", pos: "な形容詞", meaning: "迅速、敏捷", exJp: "トラブルに対して迅速な対応が求められる。", exZh: "面對突發狀況需要迅速的應對。" },
  { id: "v_n2_5", level: "N2", word: "矛盾", reading: "むじゅん [0]", romaji: "mujun", pos: "名詞/スル動詞", meaning: "矛盾、前後不一", exJp: "彼の発言は事実と矛盾している。", exZh: "他的發言與事實自相矛盾。" },
  { id: "v_n2_6", level: "N2", word: "抜本的", reading: "ばっぽんてき [0]", romaji: "bapponteki", pos: "な形容詞", meaning: "根本性的、徹底的", exJp: "制度の抜本的な見直しが必要だ。", exZh: "必須對制度進行根本性的重新檢討。" },

  // JLPT N1
  { id: "v_n1_1", level: "N1", word: "網羅", reading: "もうら [1]", romaji: "moura", pos: "名詞/スル動詞", meaning: "網羅、囊括、涵蓋全部", exJp: "この一冊でN1の重要文法を網羅している。", exZh: "這一本書就完整囊括了 N1 的重要文法。" },
  { id: "v_n1_2", level: "N1", word: "顕著", reading: "けんちょ [1]", romaji: "kencho", pos: "な形容詞", meaning: "顯著的、明顯的", exJp: "都市部と地方の格差が顕著になっている。", exZh: "都市與偏鄉的差距變得十分顯著。" },
  { id: "v_n1_3", level: "N1", word: "踏襲", reading: "とうしゅう [0]", romaji: "toushuu", pos: "名詞/スル動詞", meaning: "沿襲、繼承（前人方針或傳統）", exJp: "新社長も前任者の経営方針を踏襲する見込みだ。", exZh: "新社長預計也將沿襲前任的經營方針。" },
  { id: "v_n1_4", level: "N1", word: "錯綜", reading: "さくそう [0]", romaji: "sakusou", pos: "名詞/スル動詞", meaning: "錯綜複雜、訊息混亂交錯", exJp: "現場では情報が錯綜し、混乱が続いている。", exZh: "現場資訊錯綜複雜，混亂持續中。" },
  { id: "v_n1_5", level: "N1", word: "凌駕", reading: "りょうが [1]", romaji: "ryouga", pos: "名詞/スル動詞", meaning: "凌駕、超越", exJp: "若手選手の活躍がベテランを凌駕している。", exZh: "年輕選手的活躍表現已經凌駕於老將之上。" },
  { id: "v_n1_6", level: "N1", word: "淘汰", reading: "とうた [1]", romaji: "touta", pos: "名詞/スル動詞", meaning: "淘汰、篩選", exJp: "激しい競争の中で対応できない企業は淘汰される。", exZh: "在激烈競爭中無法應變的企業將被淘汰。" },
  { id: "v_n1_7", level: "N1", word: "培う", reading: "つちかう [3]", romaji: "tsuchikau", pos: "動詞 I", meaning: "培養、孕育（實力/經驗/技術）", exJp: "長年培った技術力を新製品に活かす。", exZh: "將長年培養累積的技術力活用於新產品。" },
  { id: "v_n1_8", level: "N1", word: "稀有", reading: "けう [1]", romaji: "keu", pos: "な形容詞", meaning: "罕見的、稀有的（N1 高頻特殊讀音）", exJp: "彼は現代では稀有な才能の持ち主だ。", exZh: "他是當代罕見的奇才。" }
];

// JLPT N5 ~ N1 核心文法百科
const GRAMMAR_LIST = [
  {
    id: "g_n5_1",
    level: "N5",
    pattern: "名詞 A は 名詞 B です",
    connection: "名詞 ＋ は ＋ 名詞 ＋ です",
    meaning: "A 是 B（日語最核心的肯定判斷句）",
    nuance: "「は」讀作 wa（提示主題），句尾「です」表禮貌肯定；疑問句在句尾加「か」即可。",
    exJp: "私は台湾出身のエンジニアです。",
    exZh: "我是來自台灣的工程師。"
  },
  {
    id: "g_n5_2",
    level: "N5",
    pattern: "～をください / ～をお願いします",
    connection: "名詞 ＋ をください / をお願いします",
    meaning: "請給我～ / 麻煩您～",
    nuance: "點餐、買東西時向對方索取具體物品用「をください」；請求服務（如結帳、入住）用「をお願いします」。",
    exJp: "ホットコーヒーを一つください。",
    exZh: "請給我一杯熱咖啡。"
  },
  {
    id: "g_n4_1",
    level: "N4",
    pattern: "～たり、～たりする",
    connection: "動詞た形（去た＋たり）＋ 動詞た形（去た＋たり）＋ する",
    meaning: "又做～又做～ / 有時～有時～（列舉代表性動作）",
    nuance: "不需把所有動作說完，只要舉出 1~2 個代表性活動，就能自然描述週末或假日的日常。",
    exJp: "休日は映画を見たり、音楽を聴いたりします。",
    exZh: "假日我會看看電影、聽聽音樂之類的。"
  },
  {
    id: "g_n4_2",
    level: "N4",
    pattern: "～てもいいですか / ～てはいけません",
    connection: "動詞て形 ＋ もいいですか（請求許可） / はいけません（禁止）",
    meaning: "請問可以～嗎？ / 不可以～",
    nuance: "在日本拍照、入座或試穿前，問一句「～てもいいですか」是最萬用的禮貌詢問。",
    exJp: "ここで写真を撮ってもいいですか？",
    exZh: "請問可以在這裡拍照嗎？"
  },
  {
    id: "g_n3_1",
    level: "N3",
    pattern: "お / ご ～ になる（尊敬語） vs お / ご ～ する（謙讓語）",
    connection: "お＋和語動詞ます形去ます＋になる/する；ご＋漢語名詞＋になる/する",
    meaning: "尊敬語（抬高對方動作） vs 謙讓語（壓低自己動作以向對方致敬）",
    nuance: "對方做的動作用「お～になる」（例：お待ちになる）；自己為對方做的動作用「お～する」（例：お持ちする）。",
    exJp: "社長はすでにお帰りになりました。お荷物は私がお持ちします。",
    exZh: "社長已經回去了。您的行李由我來幫您拿。"
  },
  {
    id: "g_n3_2",
    level: "N3",
    pattern: "～おかげで / ～せいで",
    connection: "動詞・形容詞普通形 / 名詞＋の ＋ おかげで（正面感謝） / せいで（負面怪罪）",
    meaning: "多虧了～（好結果） / 都是因為～（壞結果）",
    nuance: "同樣表達原因，「おかげで」帶有感謝正面語氣；「せいで」則帶有抱怨或歸咎的負面語氣。",
    exJp: "毎日アプリで練習したおかげで、日本語で会話できるようになった。",
    exZh: "多虧每天用 APP 練習，現在已經能用日文對話了。"
  },
  {
    id: "g_n2_1",
    level: "N2",
    pattern: "～ざるを得ない（ざるをえない）",
    connection: "動詞ない形（去掉ない）＋ ざるを得ない（※する → せざるを得ない）",
    meaning: "不得不～、只好～（雖然無奈但別無選擇）",
    nuance: "N2 高頻必考句型！用於客觀情勢或職責所逼，就算不想做也必須做。",
    exJp: "台風が接近しているため、明日のイベントは中止せざるを得ない。",
    exZh: "由於颱風逼近，明天的活動不得不取消。"
  },
  {
    id: "g_n2_2",
    level: "N2",
    pattern: "～に越したことはない（にこしたことはない）",
    connection: "動詞辭書形 / 形容詞普通形 / 名詞 ＋ に越したことはない",
    meaning: "莫過於～、最好還是～（雖然不是絕對必要，但能這樣最好）",
    nuance: "常用於給出常識性建議，例如「早點準備最好」、「有備無患最好」。",
    exJp: "旅行の準備は早いに越したことはない。",
    exZh: "旅行的準備還是越早越好。"
  },
  {
    id: "g_n1_1",
    level: "N1",
    pattern: "～を余儀なくされる（をよぎなくされる）",
    connection: "動作性名詞（変更・閉鎖・撤退・辞任等）＋ を余儀なくされる",
    meaning: "被迫～、不得不～（因外部不可抗力而陷入別無選擇的處境）",
    nuance: "JLPT N1 歷屆超高頻句型！比「ざるを得ない」更正式、更強調受到外在環境或重大變故逼迫。",
    exJp: "原材料費の高騰により、多くの企業が価格改定を余儀なくされた。",
    exZh: "由於原物料價格飆漲，許多企業被迫調整價格。"
  },
  {
    id: "g_n1_2",
    level: "N1",
    pattern: "～ならでは（の）",
    connection: "名詞 ＋ ならでは（の ＋ 名詞） / ならではの～だ",
    meaning: "唯有～才有的、只有～才能做到的（高度正面評價其獨特性）",
    nuance: "N1 聽解、讀解與商業文案極常出現！強調「別處絕對沒有，只有這個地方/人物才具備的特色」。",
    exJp: "京都ならではの伝統的な街並みを散策する。",
    exZh: "漫步於唯有京都才有的傳統街道風光。"
  },
  {
    id: "g_n1_3",
    level: "N1",
    pattern: "～を皮切りに（して）/ ～を皮切りとして",
    connection: "名詞 ＋ を皮切りに（して）",
    meaning: "以～為開端、從～開始（後續接連展開一連串同類活動）",
    nuance: "源自江戶時代「第一次艾灸（皮切り）」，現用於演唱會巡迴、新事業擴張等「以 A 為首站，緊接著熱烈展開」。",
    exJp: "東京公演を皮切りに、全国ドームツアーがスタートした。",
    exZh: "以東京公演為開端，全國巨蛋巡迴正式揭開序幕。"
  },
  {
    id: "g_n1_4",
    level: "N1",
    pattern: "～たりとも～ない",
    connection: "最小數量詞（一秒・一歩・一円・一人等）＋ たりとも ＋ 否定（～ない）",
    meaning: "連一（秒/塊錢/步）也～不能/不可（極度強調連極小單位都不允許）",
    nuance: "N1 必考文語強調句型，語氣莊重強烈。",
    exJp: "本番直前となり、一秒たりとも無駄にはできない。",
    exZh: "已到正式上場前夕，連一秒鐘都不能浪費。"
  },
  {
    id: "g_n1_5",
    level: "N1",
    pattern: "～に即して（にそくして）/ ～に即した",
    connection: "名詞（事実・規則・実態・法律・時代等）＋ に即して",
    meaning: "切合～、依據～、順應～（不偏離客觀事實或規範）",
    nuance: "常與「実情（實際情況）」、「事実」、「ルール」搭配使用。",
    exJp: "現場の実態に即した柔軟な対応が求められている。",
    exZh: "需要切合現場實際狀況的彈性應對。"
  }
];

// 綜合闖關題庫（涵蓋五十音、日常會話應答、N5~N1 檢定模擬題）
const QUIZ_BANK = [
  {
    id: "q1",
    category: "kana",
    level: "zero",
    question: "平假名「あ」與片假名「ア」的正確發音（羅馬拼音）是？",
    audioText: "あ",
    options: ["a（源於「安」字）", "i（源於「以」字）", "u（源於「宇」字）", "o（源於「於」字）"],
    answer: 0,
    explanation: "「あ / ア」讀作 a，平假名あ源自漢字「安」，是日語五十音的第一個音！"
  },
  {
    id: "q2",
    category: "kana",
    level: "zero",
    question: "去日本常看到的片假名「コンビニ」是什麼意思？",
    audioText: "コンビニ",
    options: ["便利商店 (Convenience Store)", "咖啡廳 (Coffee)", "飯店 (Hotel)", "計程車 (Taxi)"],
    answer: 0,
    explanation: "「コンビニ (konbini)」是便利商店（7-11、全家、Lawson）的簡稱，旅遊必備！"
  },
  {
    id: "q3",
    category: "conv",
    level: "N5",
    question: "在餐廳想請店員「幫我結帳」，最自然道地的說法是？",
    audioText: "お会計をお願いします。",
    options: [
      "お会計（おかいけい）をお願いします。",
      "おやすみなさい。",
      "ただいま帰りました。",
      "どういたしまして。"
    ],
    answer: 0,
    explanation: "「お会計 (okaikei) をお願いします」就是「麻煩結帳」，是日本餐廳最通用的買單說法。"
  },
  {
    id: "q4",
    category: "conv",
    level: "N5",
    question: "在超商結帳時，店員問你要不要塑膠袋，你想禮貌表示「不用了，謝謝」，可以說：",
    audioText: "大丈夫です。",
    options: [
      "大丈夫（だいじょうぶ）です。",
      "これをください。",
      "いくらですか。",
      "はじめまして。"
    ],
    answer: 0,
    explanation: "「大丈夫です (daijoubu desu)」除了表示「沒問題」，在日常消費中也最常用來委婉表示「不用了，謝謝」。"
  },
  {
    id: "q5",
    category: "jlpt",
    level: "N4",
    question: "【N4 文法】休みの日は、映画を（　　）、本を読んだりします。",
    audioText: "休みの日は、映画を見たり、本を読んだりします。",
    options: ["見たり", "見て", "見るなら", "見ようと"],
    answer: 0,
    explanation: "「～たり、～たりします」用於列舉假日常做的代表性動作，「見る」的た形是「見た」，接「り」變成「見たり」。"
  },
  {
    id: "q6",
    category: "jlpt",
    level: "N3",
    question: "【N3 敬語】明日、10時に御社へ（　　）ます。（表示「我前往貴公司拜訪」的謙讓語）",
    audioText: "明日、十時に御社へ伺います。",
    options: ["伺い（うかがい）", "いらっしゃい", "おっしゃい", "ご覧になり"],
    answer: 0,
    explanation: "自己的動作（去拜訪對方）要用謙讓語「伺う (ukagau)」→「伺います」。其餘三個選項皆為抬高對方的尊敬語。"
  },
  {
    id: "q7",
    category: "jlpt",
    level: "N2",
    question: "【N2 文法】激しい雨のため、今日の試合は中止（　　）。",
    audioText: "激しい雨のため、今日の試合は中止せざるを得ない。",
    options: ["せざるを得ない", "に越したことはない", "かねない", "っこない"],
    answer: 0,
    explanation: "「～ざるを得ない」表示「不得不～」，「する」需變為「せざるを得ない」（因大雨不得不取消比賽）。"
  },
  {
    id: "q8",
    category: "jlpt",
    level: "N1",
    question: "【N1 文法】経営難により、その老舗旅館は閉鎖（　　）。",
    audioText: "経営難により、その老舗旅館は閉鎖を余儀なくされた。",
    options: ["を余儀なくされた", "を皮切りにした", "ならではだった", "たりともなかった"],
    answer: 0,
    explanation: "「名詞＋を余儀なくされる」為 N1 必考句型，意為「因外在困難處境而被迫～（因經營困難被迫歇業）」。"
  },
  {
    id: "q9",
    category: "jlpt",
    level: "N1",
    question: "【N1 詞彙】「この辞書は専門用語まで（網羅）している。」括號內漢字的正確讀音是？",
    audioText: "この辞書は専門用語まで網羅している。",
    options: ["もうら", "あみら", "ぼうら", "こうら"],
    answer: 0,
    explanation: "「網羅（もうら / moura）」意為「囊括、涵蓋全部」，是 JLPT N1 文字語彙高頻考題。"
  },
  {
    id: "q10",
    category: "jlpt",
    level: "N1",
    question: "【N1 文法】合格発表までは（　　）たりとも気が抜けない。",
    audioText: "合格発表までは一時たりとも気が抜けない。",
    options: ["一時（いっとき）", "全部（ぜんぶ）", "かなり", "わざわざ"],
    answer: 0,
    explanation: "「最小單位詞＋たりとも～ない」表示「連一（刻/秒/步）也～不能」，「一時たりとも気が抜けない」＝連一刻都不能鬆懈。"
  }
];
