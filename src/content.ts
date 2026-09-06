export type Memory = {
  image: string;
  kind?: "image" | "video";
  alt: string;
  caption: string;
  note: string;
};

export type MemoryFolder = {
  id: string;
  code: string;
  title: string;
  date: string;
  hint: string;
  color: string;
  mascot: string;
  memories: Memory[];
};

export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const photo = (index: number) => assetUrl(`/photos/memories/memory-${String(index).padStart(2, "0")}.jpg`);

export const siteContent = {
  passcode: "0917",
  birthday: "1993.09.17",
  birthdayAge: 33,
  recipient: {
    name: "譚墨彤",
    nickname: "比比哥",
    callsign: "JT",
    fullName: "Jonathan Morten Tan",
  },
  senderName: "April",
  fromName: "April",
  bootMessage: "晚安地球人，今天你生日。",
  folders: [
    {
      id: "first-signal",
      code: "A01",
      title: "SIGNAL FOUND_01",
      date: "BEFORE US → US",
      hint: "初次訊號已捕捉",
      color: "mint",
      mascot: assetUrl("/pochacco/hello.jpg"),
      memories: [
        { image: photo(28), alt: "April 和 JT 第一次見面的視訊畫面", caption: "認識第一天", note: "第一次見面，覺得這個人看起來好累。完全沒想過，我們後來居然會在一起。" },
        { image: photo(40), alt: "April 和 JT 還沒交往前一起看棒球", caption: "一起看棒球", note: "你還沒追到我的時候時間好多，每天都有空約我出去哈哈。" },
        { image: photo(27), alt: "April 和 JT 第一次吃炭燒鳥福", caption: "在一起前的幾小時", note: "吃完就在一起了哈哈。你是不是蓄謀已久想跟我在一起！故意喝醉哈哈。" },
        { image: photo(1), alt: "April 和 JT 一起住美福的合照", caption: "一起住美福的日子", note: "一起住美福的日子。很喜歡那些待在房間裡、只屬於我們的時間。" },
        { image: photo(25), alt: "April 和 JT 第一次一起參加婚禮", caption: "一起參加婚禮", note: "婚禮結束後，還記得我們抱在一起，看著水池看了好久。超級幸福。" },
        { image: photo(26), alt: "April 和 JT 第一次一起聽音樂會", caption: "一起聽音樂會", note: "喜歡台上演奏的音樂，跟坐在旁邊的你。" },
      ],
    },
    {
      id: "ordinary-days",
      code: "B17",
      title: "ON REPEAT_02",
      date: "DATE LOG / SIDE A",
      hint: "約會紀錄持續寫入",
      color: "yellow",
      mascot: assetUrl("/pochacco/with-friend.png"),
      memories: [
        { image: photo(4), alt: "April 和 JT 一起吃西班牙菜", caption: "第一次知道你很怕吵", note: "現在知道你是寶寶耳朵，我要好好保護你。" },
        { image: photo(5), alt: "April 和 JT 一起吃飯的合照", caption: "一起吃飯", note: "常常連吃了什麼都忘記，只記得是跟你一起。" },
        { image: photo(6), alt: "April 和 JT 一起喝咖啡", caption: "一起喝咖啡", note: "一起喝咖啡，你工作，我看書。喜歡不用特別安排、很生活的時刻。" },
        { image: photo(12), alt: "喝醉後睡著的 JT", caption: "喝醉的人", note: "喝醉後變成超盧的大寶寶。" },
        { image: photo(42), alt: "April 陪 JT 去台南出差喝酒", caption: "去台南出差", note: "陪你去台南出差，一起去找大師喝酒。" },
        { image: assetUrl("/photos/memories/video-karaoke.mov"), kind: "video", alt: "April 和 JT 的同事一起唱歌的影片", caption: "第一次跟你的同事見面", note: "跟你同事一起唱歌，學會很台的喝酒遊戲哈哈。" },
      ],
    },
    {
      id: "together",
      code: "C93",
      title: "LOW FREQUENCY_03",
      date: "DAILY SIDE A / B",
      hint: "日常頻率同步中",
      color: "coral",
      mascot: assetUrl("/pochacco/running.webp"),
      memories: [
        { image: photo(17), alt: "April 和 JT 在 Apple Store 的合照", caption: "我們真的好常在信義區閒晃", note: "數不清陪你去過幾次Apple Store。喜歡一起到處晃晃。" },
        { image: photo(16), alt: "April 等 JT 睡著時拍下的照片", caption: "我喜歡等你睡著我才睡覺", note: "喜歡等你睡著才睡覺。看你安心關機，好像我的一天也終於可以收工。" },
        { image: photo(23), alt: "睡覺秒斷電的 JT", caption: "睡覺秒斷電", note: "睡覺秒斷電的比比哥。每次看你這樣都覺得你好辛苦。" },
        { image: photo(39), alt: "April 最喜歡的 JT 髮型", caption: "我最愛的髮型", note: "感謝實現我的心願，沒有瀏海的比比哥。直接心動害羞哈哈。" },
        { image: assetUrl("/photos/memories/nerdy-youtube.jpg"), alt: "JT 專心做模型，April 陪他看 YouTube", caption: "陪你做你喜歡的事", note: "喜歡看你做很宅的事，也喜歡一起看那些我根本不會看的YouTube影片。" },
        { image: photo(43), alt: "April 和 JT 一起聽五月天演唱會", caption: "一起聽演唱會", note: "五月天演唱會。以前是你的回憶，這一次也變成我們的了。" },
        { image: assetUrl("/photos/memories/video-guanghua.mov"), kind: "video", alt: "April 陪 JT 逛光華商場的影片", caption: "陪你逛光華商場", note: "穿的超美陪你逛光華商場。我是世界最好的女朋友哈哈。" },
      ],
    },
    {
      id: "reasons",
      code: "D09",
      title: "PRIVATE LINE_04",
      date: "QUIET LINK / VIDEO CALL",
      hint: "私人連線保持中",
      color: "cream",
      mascot: assetUrl("/pochacco/portrait.webp"),
      memories: [
        { image: photo(19), alt: "April 和 JT 的第一張 Uber 牽手照", caption: "UBER 01", note: "車上是難得你可以放鬆休息的時候。" },
        { image: photo(20), alt: "April 和 JT 的第二張 Uber 牽手照", caption: "UBER 02", note: "喜歡在車上牽手。" },
        { image: photo(21), alt: "April 和 JT 的第三張 Uber 牽手照", caption: "UBER 03", note: "什麼都不用做，只要一起坐著。" },
        { image: photo(22), alt: "April 和 JT 的第四張 Uber 牽手照", caption: "UBER 04", note: "喜歡我們這樣靜靜的時刻。" },
        { image: photo(32), alt: "April 和 JT 的第一張視訊截圖", caption: "VIDEO CALL 01", note: "搬去宿舍之後，我們見面的時間變少了。" },
        { image: photo(33), alt: "April 和 JT 的第二張視訊截圖", caption: "VIDEO CALL 02", note: "你還是會打電話來，跟我講今天發生了什麼。" },
        { image: photo(34), alt: "April 和 JT 的第三張視訊截圖", caption: "VIDEO CALL 03", note: "有時候也沒有什麼重要的事，就是想看到你。" },
        { image: photo(35), alt: "April 和 JT 的第四張視訊截圖", caption: "VIDEO CALL 04", note: "隔著螢幕，各自做自己的事也可以。" },
        { image: photo(36), alt: "April 和 JT 的第五張視訊截圖", caption: "VIDEO CALL 05", note: "我們還是有留在彼此的生活裡。" },
      ],
    },
    {
      id: "future",
      code: "E∞",
      title: "SAVE FILE_05",
      date: "OUR PEOPLE / OUR DAYS",
      hint: "生活資料合併中",
      color: "mint",
      mascot: assetUrl("/pochacco/praying.gif"),
      memories: [
        { image: photo(14), alt: "JT 幫 April 慶祝生日", caption: "我們的第一個生日", note: "一起過的第一個生日。以後還要一起過好多個。" },
        { image: photo(44), alt: "比比哥和 April 的好朋友們", caption: "比比哥跟我的好朋友們", note: "2026年最幸福的一天，跟我最愛的人們一起。" },
        { image: photo(8), alt: "比比哥寫給 April 的小紙條", caption: "小紙條", note: "比比哥寫給我的小紙條，我到現在都還留著。" },
        { image: photo(9), alt: "比比哥寫給 April 的生日卡片", caption: "生日卡片", note: "比比哥寫給我的生日卡片，我很喜歡。" },
        { image: photo(18), alt: "比比哥幫 April 向美琴拿到的卡片", caption: "美琴的卡片", note: "比比哥幫我跟美琴拿到的卡片！謝謝你總是記得我喜歡的事。" },
        { image: photo(7), alt: "April 和 JT 一起幫姊姊慶生", caption: "幫姊姊慶生", note: "喜歡你陪著我，也認識我在乎的人、走進我的生活。" },
        { image: photo(10), alt: "朋友幫 April 和 JT 拍的合照", caption: "朋友幫我們拍的照片", note: "好自然好可愛。" },
        { image: photo(11), alt: "April 和 JT 的可愛合照", caption: "可愛的我們", note: "喜歡我們的每一張照片，。" },
        { image: photo(30), alt: "April 和 JT 的精選合照", caption: "LOVE YOU", note: "想一起創造更多美好的回憶，去很多很多地方。" },
        { image: photo(31), alt: "April 和 JT 的精選合照", caption: "HAPPY BIRTHDAY JT", note: "生日快樂，墨彤。" },
      ],
    },
  ] satisfies MemoryFolder[],
  letter: [
    "比比哥，生日快樂。",
    "世界很大，我們曾經不認識彼此，在地球的兩端各自生活，世界很小，讓我們可以在台灣遇見，並且愛上對方。",
    "在你身上，我看見了很多美好的特質，遇見你，讓我想成為一個更好的人。",
    "謝謝你總是接住我的情緒，總是陪在我身邊。",
    "我們都在學習怎麼跟對方相處。學著理解彼此的習慣、情緒和需要，在意見不一樣的時候，好好說話、好好聽對方說。",
    "你說過，確認關係之後，你就是沒有想過要分開的人。",
    "你說過，如果用數學證明題來說，因為是我，你才想在一起。",
    "第一次聽到的時候，我其實內心很震撼。不知道為什麼，我覺得你真的做的到。",
    "所以你是我第一個說:我不想跟你分開，想一直在一起的人。",
    "沒有說過是因為如果說了，就算過程很辛苦很痛苦還是要堅持，我其實很害怕，很怕付出所有最後還是受傷了。",
    "所以對我來說，分開這個選擇永遠是最輕鬆的。",
    "但因為你，我願意努力嘗試，跟你一起努力。",
    "未來一定還是會有忙碌、很累、意見不一樣的時候。",
    "但只要我們永遠記得當初堅定選擇彼此的那個初心，我們就一定可以。",
    "我們的第一個生日你可能要工作，不能一起過，不過未來還會幫你慶祝好多個生日。",
    "希望你身體健康，每天開心，一直陪著我。",
    "希望你不要這麼累。好好照顧自己，累的時候就跟我抱抱充電。",
    "希望你可以多跟我分享，不管是開心的、煩惱的。",
    "希望我每天睜開眼睛的時候看到的是你，閉上眼睛前也可以看到你。",
    "不論未來有什麼挑戰，我相信只要我們一起努力，一切都會越來越順利。",
    "我會一直支持你，陪著你。",
    "HAPPY BIRTHDAY JT",
  ],
};
