// ============================================
//   Nova - Advanced Telegram Group Manager
//   Version   : 1.0.0
//   Author    : Md. Mainul Islam
//   Owner     : MAINUL - X
//   GitHub    : https://github.com/M41NUL
//   Telegram  : https://t.me/mdmainulislaminfo
//   Channel   : https://t.me/mainul_x_official
//   License   : MIT License
//   Copyright : 2026 MAINUL - X
// ============================================

const { Telegraf, Markup } = require('telegraf');
const config  = require('./config');

// ── Handlers ──────────────────────────────────
const welcome = require('./handlers/welcome');
const admin   = require('./handlers/admin');
const filters = require('./handlers/filters');
const fun     = require('./handlers/fun');

// ── Bot Init ──────────────────────────────────
const bot = new Telegraf(config.BOT_TOKEN);

// ============================================
//   /start Command
// ============================================
bot.start(async (ctx) => {
  // ── Private Chat ───────────────────────────
  if (ctx.chat.type === 'private') {
    await ctx.reply(
      `⚡ *Nova — Advanced Group Manager*\n\n` +
      `আসসালামু আলাইকুম! আমি Nova, তোমার গ্রুপের সেরা রক্ষক! 🛡️\n\n` +
      `✨ *আমার ফিচারসমূহ:*\n` +
      `👋 Smart Welcome + User Mention\n` +
      `🛡️ Anti-Spam Protection\n` +
      `🔗 Anti-Link Filter\n` +
      `🔞 Bad Word Filter\n` +
      `⚠️ Warning System (${config.WARN_LIMIT} strike → Auto Ban)\n` +
      `🚫 Ban | Mute | Kick | Unban\n` +
      `📌 Pin & Unpin Messages\n` +
      `📊 Group Statistics\n` +
      `🎮 Quiz System\n` +
      `📝 Notes System\n` +
      `⏰ Scheduled Messages\n` +
      `📢 Announcements\n\n` +
      `➕ আমাকে তোমার গ্রুপে Add করো এবং *Admin* বানাও!`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [
            Markup.button.url(
              '➕ গ্রুপে Add করো',
              `https://t.me/${ctx.botInfo.username}?startgroup=true`
            ),
          ],
          [
            Markup.button.url('📢 Channel', config.LINKS.channel),
            Markup.button.url('👥 Group',   config.LINKS.group),
          ],
          [
            Markup.button.url('👨‍💻 Developer', config.LINKS.telegram),
            Markup.button.url('💻 GitHub',     config.LINKS.github),
          ],
        ]),
      }
    );
  }

  // ── Group Chat ─────────────────────────────
  if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
    await ctx.reply(
      `⚡ *Nova চালু আছে!*\n\n` +
      `🛡️ তোমার গ্রুপ সুরক্ষিত আছে!\n\n` +
      `📋 সব কমান্ড দেখতে /help লিখো`,
      { parse_mode: 'Markdown' }
    );
  }
});

// ============================================
//   /help Command
// ============================================
bot.command('help', async (ctx) => {
  await ctx.reply(
    `⚡ *Nova — সব কমান্ড*\n\n` +

    `👤 *সবার জন্য:*\n` +
    `/start — Bot পরিচয়\n` +
    `/help — সব কমান্ড\n` +
    `/rules — গ্রুপের নিয়ম\n` +
    `/get নাম — Note পড়া\n` +
    `/notes — সব Note দেখা\n` +
    `/quiz — Quiz শুরু\n\n` +

    `👑 *Admin এর জন্য:*\n` +
    `/warn — ⚠️ Warning দাও (Reply করে)\n` +
    `/warns — Warning দেখো (Reply করে)\n` +
    `/resetwarn — Warning রিসেট (Reply করে)\n` +
    `/ban — 🚫 Ban করো (Reply করে)\n` +
    `/unban — ✅ Unban করো (Reply করে)\n` +
    `/kick — 👢 Kick করো (Reply করে)\n` +
    `/mute — 🔇 Mute করো (Reply করে)\n` +
    `/unmute — 🔊 Unmute করো (Reply করে)\n` +
    `/pin — 📌 Pin করো (Reply করে)\n` +
    `/unpin — 📌 Unpin করো\n` +
    `/announce — 📢 ঘোষণা দাও\n` +
    `/stats — 📊 Group Stats\n\n` +

    `⚙️ *Settings:*\n` +
    `/welcome on|off — Welcome চালু/বন্ধ\n` +
    `/setwelcome — Custom Welcome সেট\n` +
    `/setrules — নিয়ম সেট করো\n` +
    `/antispam on|off — Spam Filter\n` +
    `/antilink on|off — Link Filter\n` +
    `/antibadword on|off — Bad Word Filter\n\n` +

    `📝 *Notes:*\n` +
    `/note নাম টেক্সট — Note সেভ\n` +
    `/get নাম — Note পড়া\n` +
    `/notes — সব Note\n` +
    `/delnote নাম — Note মুছো\n\n` +

    `⏰ *Schedule:*\n` +
    `/schedule HH:MM মেসেজ — Auto মেসেজ\n/settitle নাম — Bot Nickname সেট\n/setmytitle নাম — তোমার Nickname সেট\n\n` +

    `⚡ *Nova v${config.VERSION}* | by ${config.OWNER_NAME}`,
    { parse_mode: 'Markdown' }
  );
});

// ============================================
//   /info Command
// ============================================
bot.command('info', async (ctx) => {
  await ctx.reply(
    `⚡ *Nova Bot Info*\n\n` +
    `🤖 Name: ${config.BOT_NAME}\n` +
    `📌 Version: ${config.VERSION}\n` +
    `👨‍💻 Developer: ${config.OWNER_NAME}\n` +
    `📱 Telegram: ${config.LINKS.telegram}\n` +
    `💻 GitHub: ${config.LINKS.github}\n` +
    `📢 Channel: ${config.LINKS.channel}\n\n` +
    `© 2026 MAINUL - X | MIT License`,
    { parse_mode: 'Markdown' }
  );
});

// ============================================
//   Welcome Handlers
// ============================================
bot.on('new_chat_members', welcome.onNewMember);
bot.on('left_chat_member', welcome.onMemberLeft);
bot.command('setwelcome',  welcome.setWelcome);
bot.command('welcome',     welcome.toggleWelcome);
bot.command('setrules',    welcome.setRules);
bot.command('rules',       welcome.showRules);

// ============================================
//   Admin Handlers
// ============================================
bot.command('warn',      admin.warn);
bot.command('warns',     admin.warns);
bot.command('resetwarn', admin.resetWarn);
bot.command('ban',       admin.ban);
bot.command('unban',     admin.unban);
bot.command('kick',      admin.kick);
bot.command('mute',      admin.mute);
bot.command('unmute',    admin.unmute);
bot.command('pin',       admin.pin);
bot.command('unpin',     admin.unpin);
bot.command('settitle',   admin.setTitle);
bot.command('setmytitle', admin.setMyTitle);
bot.command('stats',     admin.stats);
bot.command('announce',  admin.announce);

// ============================================
//   Filter Handlers
// ============================================
bot.command('antispam',    filters.toggleAntiSpam);
bot.command('antilink',    filters.toggleAntiLink);
bot.command('antibadword', filters.toggleAntiBadWord);

// ============================================
//   Fun & Utility Handlers
// ============================================
bot.command('quiz',     fun.startQuiz);
bot.command('note',     fun.saveNote);
bot.command('get',      fun.getNote);
bot.command('notes',    fun.listNotes);
bot.command('delnote',  fun.deleteNote);
bot.command('schedule', fun.scheduleMsg);

// ============================================
//   Message Filter (সব মেসেজ চেক করা)
// ============================================
bot.on('message', async (ctx) => {
  await filters.filterMessage(ctx);
  await fun.checkQuizAnswer(ctx);
});

// ============================================
//   Error Handler
// ============================================
bot.catch((err, ctx) => {
  console.error(`[Nova Error] ${ctx.updateType}:`, err);
});

// ============================================
//   Launch Bot
// ============================================
bot.launch()
  .then(() => {
    console.log('');
    console.log('⚡ ================================');
    console.log('   Nova Bot চালু হয়েছে!');
    console.log(`   Version  : ${config.VERSION}`);
    console.log(`   Bot      : ${config.BOT_USERNAME}`);
    console.log(`   Developer: ${config.OWNER_NAME}`);
    console.log('⚡ ================================');
    console.log('');
  })
  .catch(err => {
    console.error('❌ Bot চালু হয়নি:', err.message);
  });

process.once('SIGINT',  () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
