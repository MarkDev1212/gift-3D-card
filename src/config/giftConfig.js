export const giftConfig = {
  senderName:   "ጓደኛህ ማርቆስ",
  receiverName: "ራሄል",

  // ── Welcome screen ──
  title:         "ለምርጥ ጓደኛዬ ራሄል 🎁",
  subtitle:      "ክፍሎቹን ዞርና በሮቹን ክፈቺ... ትልቅ ስጦታ ይጠብቅሻል! ✨",
  headphonesHint:"ለተሻለ ልምድ ጆሮ ማዳመጫ ልበሺ 🎧",

  giftColor:   "#ff4b72",
  ribbonColor: "#ffd700",
  musicPath:   "/audio/love-song.mp3",

  // ── Door labels (used in App.jsx prompts) ──
  doors: {
    door1: { id: "door1", label: "ራሄል፣ ይህን ደጃፍ ክፈቺ 🚪",   targetRoom: 2 },
    door2: { id: "door2", label: "ቀጣዩን ደጃፍ ክፈቺ ✨",         targetRoom: 3 },
    door3: { id: "door3", label: "የሚያስደንቀውን ክፍል ክፈቺ 💛",   targetRoom: 4 },
  },

  // ── 11 photo memories ──
  memories: [
    // --- ክፍል 1: መግቢያ ---
    {
      id: "photo1",
      image: "/images/photo1.jpg",
      title: "የጓደኝነታችን መጀመሪያ",
      message: "ይህ ቦታ ጓደኝነታችን የጀመረበት ነው ራሄል። አብረን ያሳለፍናቸው ጊዜዎች ዘላለም አይረሱም።",
      position: [-2.9, 2.0, -1.0],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      id: "photo2",
      image: "/images/photo2.jpg",
      title: "ያልረሳሁት ፈገግታሽ",
      message: "ፈገግታሽ ሁሌ ቀናችንን ያበራዋል። 😊",
      position: [2.9, 2.0, -1.0],
      rotation: [0, -Math.PI / 2, 0],
    },
    {
      id: "photo3",
      image: "/images/photo3.jpg",
      title: "ጣፋጭ ትዝታዎች",
      message: "አብረን ያሳለፍናቸው ጊዜዎች ሁሌ ልቤ ውስጥ ይኖራሉ።",
      position: [-1.5, 2.2, -3.9],
      rotation: [0, 0, 0],
    },

    // --- ክፍል 2: ሙቅ ክፍል ---
    {
      id: "photo4",
      image: "/images/photo4.jpg",
      title: "ምቹና ሙቅ",
      message: "አብሮህ ያለ ጊዜ ቤት የሚሰማኝ ምቾት አለ። 🏠",
      position: [-2.9, 2.0, -9.0],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      id: "photo5",
      image: "/images/photo5.jpg",
      title: "ንጹህ ደስታ",
      message: "አብረን ስናቅ ፍጹም ደስታ ይሰማኛል።",
      position: [2.9, 2.0, -9.0],
      rotation: [0, -Math.PI / 2, 0],
    },
    {
      id: "photo6",
      image: "/images/photo6.jpg",
      title: "እውነተኛ ጓደኝነት",
      message: "ለእኔ ቀን ስትሰጪ ሁሌ ታናሽቺ። አመሰግናለሁ ራሄል! 💛",
      position: [-1.5, 2.2, -11.9],
      rotation: [0, 0, 0],
    },
    {
      id: "photo7",
      image: "/images/photo7.jpg",
      title: "አብረን የምናልም",
      message: "ቀጣዩን ዓመት አብረን ደስ ብሎን እናሳልፍ።",
      position: [1.5, 2.2, -11.9],
      rotation: [0, 0, 0],
    },

    // --- ክፍል 3: ትዝታ ጋለሪ ---
    {
      id: "photo8",
      image: "/images/photo8.jpg",
      title: "አብሮ መፈንደቅ",
      message: "አብረን ያደረግናቸው ሁሉ ዘላለም ትዝታ ሆነዋል።",
      position: [-2.9, 2.0, -17.0],
      rotation: [0, Math.PI / 2, 0],
    },
    {
      id: "photo9",
      image: "/images/photo9.jpg",
      title: "ምርጥ ጓደኛዬ",
      message: "ከሁሉ ሰው ውስጥ አንቺ እጅግ ምርጥ ጓደኛዬ ነሽ ራሄል።",
      position: [2.9, 2.0, -17.0],
      rotation: [0, -Math.PI / 2, 0],
    },
    {
      id: "photo10",
      image: "/images/photo10.jpg",
      title: "ትከሻ ለትከሻ",
      message: "በሕይወት ጉዞ ሁሌ አብረን እንቀጥላለን።",
      position: [0, 2.2, -19.9],
      rotation: [0, 0, 0],
    },

    // --- ክፍል 4: ሱርፕራይዝ ክፍል ---
    {
      id: "photo11",
      image: "/images/photo11.jpg",
      title: "ዋናው ሱርፕራይዝ 💛",
      message: "ራሄል ምርጥ ጓደኛዬ ነሽ! ልደትሽ ወይም ቀኑ ደስ ይበልሽ! 🎉",
      position: [0, 2.2, -27.9],
      rotation: [0, 0, 0],
    },
  ],

  // ── Story chapters shown when gift is opened ──
  giftStory: [
    "ራሄል፣ ሁሉንም ክፍሎች ዞርሽ ትዝታዎቻችንን ሰበሰብሽ...",
    "እያንዳንዱ ክፍል ምን ያህል ጥሩ ጓደኛ እንደሆንሽ ያሳያል።",
    "ምንም ቢሆን ሁሌ ምርጥ ጓደኛዬ ሆነሽ ትቀያለሽ ራሄል! 💛",
  ],

  // ── Final message card ──
  finalMessages: [
    "ደስ ይበልሽ ራሄል! 🎉",
    "ሁሉንም ደጃፎቼን ከፍተሻቸዋል — ምርጥ ጓደኛ ነሽ! 💛",
    "ሁሌ ደስተኛ ሁኚ። ጓደኝነታችን ዘላለም ይኑር! 🌟",
  ],
};

export default giftConfig;
