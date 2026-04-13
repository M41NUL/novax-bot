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
  BOT_NAME:     'NovaX',
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
  // ============= বাংলা বাজে/অশ্লীল শব্দ =============
  'গালি১', 'গালি২', 'মাদারচোদ', 'মাদারচোদা', 'বাল', 'হিজরা', 'পাগলা', 
  'কুতুব', 'মুচকি', 'শালা', 'বোকা', 'চোদা', 'চুদি', 'চুদনা', 'চোদাচুদি', 
  'মাল', 'লোডা', 'লৌডা', 'পুটা', 'পুটকি', 'পুটকা', 'হরামি', 'হারামজাদা',
  'পোলা', 'পোলাপান', 'মাগি', 'মাগী', 'কুত্তা', 'কুত্তির বাচ্চা', 'শুওর', 
  'সুয়ার', 'সুয়ার বাচ্চা', 'ল্যাংটা', 'নাংগা', 'পাজি', 'ফাজিল', 'ফাজলামি', 
  'বেইমান', 'খানকি', 'খানকির পোলা', 'গু', 'গু খাওয়া', 'পেশাব', 'পায়খানা', 
  'মলমূত্র', 'অবস্ত্র', 'যৌন', 'সেক্স', 'চুদাচুদি', 'ব্লোজব', 'হ্যান্ডজব', 
  'অর্গাজম', 'লিঙ্গ', 'যোনি', 'বীর্য', 'হস্তমৈথুন', 'মাস্টারবেট', 'পর্ন', 
  'অশ্লীল', 'নগ্ন', 'নগ্নচিত্র', 'মাইর', 'ধুর', 'ছাইরা', 'খেকো', 'পোকার মত',
  'বেকুব', 'বেওকুফ', 'নালায়েক', 'বেকার', 'পাগল', 'পাগলি', 'বাউল', 'বাতিক',
  'চোদা', 'চুদি', 'লন্ডা', 'পুটকি', 'হিজলা', 'গন্ডু', 'মাদারকোদ', 'বহিনচোদ',
  
  // ============= ইংরেজি বাজে/অশ্লীল শব্দ =============
  'badword1', 'badword2', 'fuck', 'fck', 'fuk', 'fucc', 'f*ck', 'f**k',
  'shit', 'sht', 'sh!t', 'sh*t', 'bitch', 'bch', 'b!tch', 'bi*ch', 
  'b*tch', 'asshole', 'ass', 'a$$', 'bastard', 'bstrd', 'b@stard',
  'dick', 'dck', 'd1ck', 'd!ck', 'pussy', 'p*ssy', 'pussi', 'whore', 
  'hore', 'slut', 'sl*t', 'cunt', 'c*nt', 'motherfucker', 'mthrfckr', 
  'mofo', 'mf', 'nigger', 'n*gga', 'retard', 'hoe', 'penis', 'vagina',
  'boobs', 'nipple', 'orgasm', 'cum', 'sperm', 'masturbate', 'porn',
  'xxx', 'nsfw', 'anal', 'oral', 'sex', 'fucking', 'sucking', 'blowjob',
  'handjob', 'naked', 'nude', 'erotic', 'adult', '18+', 'onlyfans',
  
  // ============= হিন্দি/উর্দু বাজে শব্দ =============
  'bhenchod', 'benchod', 'bc', 'madarchod', 'mc', 'chutiya', 'chod', 
  'bhosdi', 'bhosdike', 'lodu', 'lund', 'gaandu', 'gaand', 'hijda', 
  'kamine', 'kamina', 'harami', 'nalayak', 'bhai ki maa', 'behen ki',
  
  // ============= স্ল্যাং ও এড়ানোর চেষ্টা =============
  'brosist', 'brossist', 'vc', 'viagra', 'condom', 'bangla choda', 
  'choda chudi', 'kutta', 'kutir pola', 'magir pola', 'bainchod',
  'bain chod', 'bhai er maagi', 'baap er maagi', 'salai pola', 
  'shala', 'shuar', 'shuarer baccha', 'chagol', 'gumar baccha',
  'muthi mara', 'hastomaithun', 'dhona', 'dhon', 'buri', 'bur', 
  'putki', 'dudu', 'dudh', 'bon', 'sala', 'sali', 'khanki',
  'khankir pola', 'bazar magi', 'bazar kutta', 'gali dewa', 
  'abusive', 'vulgar', 'obscene', 'profanity', 'curse', 'swear',
],
  // ── Quiz Questions ────────────────────────
  QUIZ: [
    {
      question: '🌍 বাংলাদেশের রাজধানী কোনটি?',
      options:  ['ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী'],
      answer:   0,  // ঢাকা ✅
    },
    {
      question: '🔢 ২ + ২ = ?',
      options:  ['৩', '৪', '৫', '৬'],
      answer:   1,  // ৪ ✅
    },
    {
      question: '🌸 বাংলাদেশের জাতীয় ফুল কোনটি?',
      options:  ['গোলাপ', 'শাপলা', 'বেলি', 'চামেলি'],
      answer:   1,  // শাপলা ✅
    },
    {
      question: '🐅 বাংলাদেশের জাতীয় পশু কোনটি?',
      options:  ['সিংহ', 'বাঘ', 'হাতি', 'গরু'],
      answer:   1,  // বাঘ ✅
    },
    {
      question: '🤼 বাংলাদেশের জাতীয় খেলা কোনটি?',
      options:  ['ফুটবল', 'ক্রিকেট', 'কাবাডি', 'হকি'],
      answer:   2,  // কাবাডি ✅
    },
    {
      question: '🗓️ বাংলাদেশ স্বাধীন হয় কত সালে?',
      options:  ['১৯৬৯', '১৯৭০', '১৯৭১', '১৯৭২'],
      answer:   2,  // ১৯৭১ ✅
    },
    {
      question: '🏙️ বাংলাদেশের বৃহত্তম শহর কোনটি?',
      options:  ['চট্টগ্রাম', 'ঢাকা', 'সিলেট', 'খুলনা'],
      answer:   1,  // ঢাকা ✅
    },
    {
      question: '🐟 বাংলাদেশের জাতীয় মাছ কোনটি?',
      options:  ['রুই', 'কাতলা', 'ইলিশ', 'পাঙ্গাস'],
      answer:   2,  // ইলিশ ✅
    },
    {
      question: '🌿 বাংলাদেশের জাতীয় গাছ কোনটি?',
      options:  ['আম গাছ', 'নিম গাছ', 'বট গাছ', 'কাঁঠাল গাছ'],
      answer:   2,  // বট গাছ ✅
    },
    {
      question: '🎵 বাংলাদেশের জাতীয় সংগীতের রচয়িতা কে?',
      options:  ['কাজী নজরুল ইসলাম', 'রবীন্দ্রনাথ ঠাকুর', 'জসীম উদ্দীন', 'মাইকেল মধুসূদন'],
      answer:   1,  // রবীন্দ্রনাথ ঠাকুর ✅
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
