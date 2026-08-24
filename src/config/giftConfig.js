export const giftConfig = {
  senderName: "My Love",
  receiverName: "Rahel", // 👈 የሷ ስም
  title: "FOR MY LOVE, RAHEL ❤️",
  subtitle: "Explore the rooms and open the doors...",
  headphonesHint: "Put on your headphones for the best experience 🎧",
  
  giftColor: "#ff4b72",
  ribbonColor: "#ffd700",
  musicPath: "/audio/love-song.mp3",

  // 🚪 የ3ቱ በሮች መረጃዎች
  doors: {
    door1: { id: "door1", label: "Open the door, Rahel ❤️", targetRoom: 2 },
    door2: { id: "door2", label: "Open next door, Rahel ✨", targetRoom: 3 },
    door3: { id: "door3", label: "Unlock Surprise Room 💖", targetRoom: 4 }
  },

  // 🖼️ 11 የፎቶ ትዝታዎች (በ4ቱ ክፍሎች ተከፋፍለው የተመደቡ)
  memories: [
    // --- ROOM 1: Lounge Room (3 ፎቶዎች) ---
    {
      id: "photo1",
      image: "/images/photo1.jpg",
      title: "Our First Chapter",
      message: "This is where our beautiful journey began, Rahel. Every step with you is pure magic.",
      position: [-2.9, 2.0, -1.0],
      rotation: [0, Math.PI / 2, 0]
    },
    {
      id: "photo2",
      image: "/images/photo2.jpg",
      title: "Your Unforgettable Smile",
      message: "Your smile brightens up my whole world every single day.",
      position: [2.9, 2.0, -1.0],
      rotation: [0, -Math.PI / 2, 0]
    },
    {
      id: "photo3",
      image: "/images/photo3.jpg",
      title: "Sweet Memories",
      message: "Holding onto these precious moments with you forever.",
      position: [-1.5, 2.2, -3.9],
      rotation: [0, 0, 0]
    },

    // --- ROOM 2: Cozy Bedroom (4 ፎቶዎች) ---
    {
      id: "photo4",
      image: "/images/photo4.jpg",
      title: "Warm & Cozy",
      message: "Being with you feels like home, no matter where we are.",
      position: [-2.9, 2.0, -9.0],
      rotation: [0, Math.PI / 2, 0]
    },
    {
      id: "photo5",
      image: "/images/photo5.jpg",
      title: "Pure Joy",
      message: "Laughter comes so naturally whenever you are near me.",
      position: [2.9, 2.0, -9.0],
      rotation: [0, -Math.PI / 2, 0]
    },
    {
      id: "photo6",
      image: "/images/photo6.jpg",
      title: "Unconditional Love",
      message: "Thank you for loving me and being my source of happiness.",
      position: [-1.5, 2.2, -11.9],
      rotation: [0, 0, 0]
    },
    {
      id: "photo7",
      image: "/images/photo7.jpg",
      title: "Dream Together",
      message: "Building a future filled with dreams and endless love.",
      position: [1.5, 2.2, -11.9],
      rotation: [0, 0, 0]
    },

    // --- ROOM 3: Memories Gallery (3 ፎቶዎች) ---
    {
      id: "photo8",
      image: "/images/photo8.jpg",
      title: "Adventures with You",
      message: "Every adventure with you turns into a lifetime memory.",
      position: [-2.9, 2.0, -17.0],
      rotation: [0, Math.PI / 2, 0]
    },
    {
      id: "photo9",
      image: "/images/photo9.jpg",
      title: "My Favorite Person",
      message: "Out of 8 billion people, my heart chose you.",
      position: [2.9, 2.0, -17.0],
      rotation: [0, -Math.PI / 2, 0]
    },
    {
      id: "photo10",
      image: "/images/photo10.jpg",
      title: "Side by Side",
      message: "Walking hand in hand through every season of life.",
      position: [0, 2.2, -19.9],
      rotation: [0, 0, 0]
    },

    // --- ROOM 4: Surprise Room (11ኛው ዋና ሰርፕራይዝ ፎቶ) ---
    {
      id: "photo11",
      image: "/images/photo11.jpg",
      title: "The Ultimate Surprise ❤️",
      message: "You are my world, my love, and my whole universe, Rahel! Happy Birthday / Special Day! ❤️",
      position: [0, 2.2, -27.9],
      rotation: [0, 0, 0]
    }
  ],

  giftStory: [
    "Rahel, you walked through all the rooms and collected our memories...",
    "Each room represents how much you mean to me and how deep my love is for you.",
    "No matter what happens, you will always be my number one person in this world."
  ],

  finalMessages: [
    "Happy Birthday / Special Day, Rahel! ❤️",
    "You unlocked every door to my heart.",
    "I LOVE YOU FOREVER & ALWAYS ❤️"
  ]
};

export default giftConfig;