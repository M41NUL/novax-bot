// ============================================
//   Nova - Fun & Utility Handler
//   Quiz | Notes | Scheduled Messages
// ============================================

const cron   = require('node-cron');
const db     = require('../data/groups');
const config = require('../config');

// Active quiz sessions { chatId: { question, answer, timer } }
const activeSessions = {};

// ── Helper: Check Admin ───────────────────────
async function isAdmin(ctx) {
  try {
    // Private chat এ সবসময় true
    if (ctx.chat.type === 'private') return true;
    const m = await ctx.getChatMember(ctx.from.id);
    return ['administrator', 'creator'].includes(m.status);
  } catch {
    return false;
  }
}

// ============================================
//   QUIZ
// ============================================

async function startQuiz(ctx) {
  const chatId = ctx.chat.id;

  if (activeSessions[chatId])
    return ctx.reply('⚡ একটা Quiz ইতিমধ্যে চলছে! আগেরটা শেষ করো।');

  const questions = config.QUIZ;
  const q         = questions[Math.floor(Math.random() * questions.length)];

  // Numbered options তৈরি
  const optionsText = q.options
    .map((opt, i) => `${i + 1}. ${opt}`)
    .join('\n');

  activeSessions[chatId] = {
    answer:  q.answer,
    timeout: setTimeout(async () => {
      delete activeSessions[chatId];
      try {
        await ctx.reply(
          `⏰ সময় শেষ! সঠিক উত্তর ছিল: *${q.options[q.answer]}*`,
          { parse_mode: 'Markdown' }
        );
      } catch {}
    }, 30000), // ৩০ সেকেন্ড সময়
  };

  await ctx.reply(
    `🎮 *Quiz শুরু হয়েছে!*\n\n` +
    `❓ ${q.question}\n\n` +
    `${optionsText}\n\n` +
    `⏰ উত্তর দেওয়ার সময়: ৩০ সেকেন্ড`,
    { parse_mode: 'Markdown' }
  );
}

async function checkQuizAnswer(ctx) {
  const chatId = ctx.chat.id;
  if (!activeSessions[chatId]) return;

  const text   = ctx.message.text?.trim();
  const answer = parseInt(text) - 1;
  const q      = config.QUIZ.find(
    (_, i) => i === activeSessions[chatId]?.questionIndex
  );
  const correct = activeSessions[chatId].answer;

  if (answer === correct) {
    clearTimeout(activeSessions[chatId].timeout);
    delete activeSessions[chatId];

    const mention = `[${ctx.from.first_name}](tg://user?id=${ctx.from.id})`;
    await ctx.reply(
      `🎉 ${mention} সঠিক উত্তর দিয়েছে! ✅`,
      { parse_mode: 'Markdown' }
    );
  }
}

// ============================================
//   NOTES
// ============================================

async function saveNote(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin note সেভ করতে পারবে!');

  const chatId = ctx.chat.id;
  db.initGroup(chatId, config);

  // ব্যবহার: /note নামা এই হলো note এর টেক্সট
  const parts = ctx.message.text.split(' ');
  const name  = parts[1];
  const text  = parts.slice(2).join(' ');

  if (!name || !text)
    return ctx.reply('✏️ ব্যবহার: `/note নাম এখানে টেক্সট লিখো`', { parse_mode: 'Markdown' });

  db.saveNote(chatId, name.toLowerCase(), text);
  await ctx.reply(`✅ Note "*${name}*" সেভ হয়েছে!`, { parse_mode: 'Markdown' });
}

async function getNote(ctx) {
  const chatId = ctx.chat.id;
  db.initGroup(chatId, config);

  const name = ctx.message.text.split(' ')[1];
  if (!name)
    return ctx.reply('✏️ ব্যবহার: `/get নাম`', { parse_mode: 'Markdown' });

  const text = db.getNote(chatId, name.toLowerCase());
  if (!text)
    return ctx.reply(`❌ "*${name}*" নামে কোনো note নেই!`, { parse_mode: 'Markdown' });

  await ctx.reply(`📝 *${name}*\n\n${text}`, { parse_mode: 'Markdown' });
}

async function listNotes(ctx) {
  const chatId = ctx.chat.id;
  db.initGroup(chatId, config);

  const notes = db.getAllNotes(chatId);
  const names  = Object.keys(notes);

  if (names.length === 0)
    return ctx.reply('📝 কোনো note সেভ নেই।');

  const list = names.map(n => `• \`${n}\``).join('\n');
  await ctx.reply(
    `📝 *সেভ করা Notes:*\n\n${list}\n\n` +
    `পড়তে: \`/get নাম\``,
    { parse_mode: 'Markdown' }
  );
}

async function deleteNote(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin note মুছতে পারবে!');

  const chatId = ctx.chat.id;
  const name   = ctx.message.text.split(' ')[1];
  if (!name)
    return ctx.reply('✏️ ব্যবহার: `/delnote নাম`', { parse_mode: 'Markdown' });

  db.deleteNote(chatId, name.toLowerCase());
  await ctx.reply(`✅ Note "*${name}*" মুছে গেছে!`, { parse_mode: 'Markdown' });
}

// ============================================
//   SCHEDULED MESSAGES
// ============================================

async function scheduleMsg(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin scheduled message সেট করতে পারবে!');

  // ব্যবহার: /schedule HH:MM মেসেজ
  const parts = ctx.message.text.split(' ');
  const time  = parts[1]; // e.g. "09:00"
  const text  = parts.slice(2).join(' ');

  if (!time || !text)
    return ctx.reply(
      '✏️ ব্যবহার: `/schedule HH:MM তোমার মেসেজ`\n\nউদাহরণ: `/schedule 09:00 সুপ্রভাত! 🌅`',
      { parse_mode: 'Markdown' }
    );

  const [hour, minute] = time.split(':');
  if (!hour || !minute)
    return ctx.reply('❌ সময় সঠিক নয়! উদাহরণ: `09:00`', { parse_mode: 'Markdown' });

  const chatId = ctx.chat.id;
  const cronExpr = `${minute} ${hour} * * *`;

  cron.schedule(cronExpr, async () => {
    try {
      await ctx.telegram.sendMessage(chatId, `🔔 ${text}`);
    } catch {}
  });

  await ctx.reply(
    `✅ প্রতিদিন *${time}* এ মেসেজ পাঠানো হবে!\n\n📝 মেসেজ: ${text}`,
    { parse_mode: 'Markdown' }
  );
}

module.exports = {
  startQuiz,
  checkQuizAnswer,
  saveNote,
  getNote,
  listNotes,
  deleteNote,
  scheduleMsg,
};
