require('dotenv').config();

// ============================================
//   Nova - Advanced Telegram Group Manager
//   Author    : Md. Mainul Islam
//   Owner     : MAINUL - X
//   GitHub    : https://github.com/M41NUL
//   Telegram  : https://t.me/mdmainulislaminfo
//   Channel   : https://t.me/mainul_x_official
//   Group     : https://t.me/mainul_x_official_gc
//   WhatsApp  : +8801308850528
//   Email     : devmainulislam@gmail.com
//   YouTube   : https://youtube.com/@mdmainulislaminfo
//   License   : MIT License
//   Copyright : 2026 MAINUL - X
// ============================================

const config = {
  // ── Bot Info ──────────────────────────────
  BOT_TOKEN:    process.env.BOT_TOKEN,
  BOT_NAME:     'Nova',
  BOT_USERNAME: '@NovaXGroupBot',
  VERSION:      '1.0.0',

  // ── Owner Info ────────────────────────────
  OWNER_ID:       process.env.OWNER_ID,
  OWNER_NAME:     'MAINUL - X',
  OWNER_USERNAME: '@mdmainulislaminfo',

  // ── Social Links ──────────────────────────
  LINKS: {
    github:   'https://github.com/M41NUL',
    telegram: 'https://t.me/mdmainulislaminfo',
    channel:  'https://t.me/mainul_x_official',
    group:    'https://t.me/mainul_x_official_gc',
    youtube:  'https://youtube.com/@mdmainulislaminfo',
    whatsapp: 'https://wa.me/8801308850528',
  },

  // ── Warning System ────────────────────────
  WARN_LIMIT: 3,       // এতবার warn হলে auto ban

  // ── Spam Settings ─────────────────────────
  SPAM: {
    maxMessages: 5,    // এতগুলো মেসেজ
    timeWindow:  5000, // এই সময়ের মধ্যে (ms)
  },

  // ── Bad Words List ────────────────────────
  BAD_WORDS: [
    // বাংলা গালি এখানে যোগ করো
    'গালি১',
    'গালি২',
    // ইংরেজি গালি
    'badword1',
    'badword2',
  ],

  // ── Quiz Questions ────────────────────────
  QUIZ: [
    {
      question: '🌍 বাংলাদেশের রাজধানী কোনটি?',
      options:  ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী'],
      answer:   0,
    },
    {
      question: '🔢 ২ + ২ = ?',
      options:  ['৩', '৪', '৫', '৬'],
      answer:   1,
    },
    {
      question: '🌙 বাংলাদেশের জাতীয় ফুল কোনটি?',
      options:  ['গোলাপ', 'শাপলা', 'বেলি', 'চামেলি'],
      answer:   1,
    },
  ],

  // ── Default Welcome Message ───────────────
  DEFAULT_WELCOME:
    '⚡ স্বাগতম {mention}!\n\n' +
    '🎉 {groupName} গ্রুপে তোমাকে স্বাগত জানাই!\n\n' +
    '📌 নিয়ম জানতে /rules লিখো\n' +
    '🤖 সব কমান্ড দেখতে /help লিখো',

  // ── Default Rules ─────────────────────────
  DEFAULT_RULES:
    '📌 গ্রুপের নিয়মাবলী\n\n' +
    '1️⃣ স্প্যাম করা যাবে না\n' +
    '2️⃣ অশ্লীল কথা বলা নিষেধ\n' +
    '3️⃣ বিজ্ঞাপন দেওয়া যাবে না\n' +
    '4️⃣ সবার সাথে ভদ্র আচরণ করতে হবে\n' +
    '5️⃣ অফটপিক আলোচনা করা যাবে না\n\n' +
    '⚠️ নিয়ম ভাঙলে Ban করা হবে!',
};

module.exports = config;
