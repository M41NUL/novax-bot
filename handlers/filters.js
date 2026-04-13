// ============================================
//   Nova - Filter Handler
//   Anti-Spam | Anti-Link | Bad Word Filter
// ============================================

const db     = require('../data/groups');
const config = require('../config');

// ── Helper: Check Admin ───────────────────────
async function isAdmin(ctx) {
  try {
    // Private chat এ সবসময় true
    if (ctx.chat.type === 'private') return true;

    // Owner সবসময় Admin
    if (String(ctx.from.id) === String(config.OWNER_ID)) return true;

    const m = await ctx.getChatMember(ctx.from.id);
    return ['administrator', 'creator'].includes(m.status);
  } catch {
    return false;
  }
}

// ── Helper: Delete + Warn ─────────────────────
async function deleteAndWarn(ctx, warningText) {
  try {
    await ctx.deleteMessage();
    const msg = await ctx.reply(warningText, { parse_mode: 'Markdown' });
    setTimeout(() => ctx.deleteMessage(msg.message_id).catch(() => {}), 5000);
  } catch {}
}

// ── /antispam Command ─────────────────────────
async function toggleAntiSpam(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const chatId = ctx.chat.id;
  db.initGroup(chatId, config);
  const arg = ctx.message.text.split(' ')[1];

  if (arg === 'on') {
    db.toggleFeature(chatId, 'antiSpam', true);
    await ctx.reply('✅ Anti-Spam *চালু* হয়েছে!', { parse_mode: 'Markdown' });
  } else if (arg === 'off') {
    db.toggleFeature(chatId, 'antiSpam', false);
    await ctx.reply('❌ Anti-Spam *বন্ধ* হয়েছে!', { parse_mode: 'Markdown' });
  } else {
    await ctx.reply('ব্যবহার: `/antispam on` অথবা `/antispam off`', { parse_mode: 'Markdown' });
  }
}

// ── /antilink Command ─────────────────────────
async function toggleAntiLink(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const chatId = ctx.chat.id;
  db.initGroup(chatId, config);
  const arg = ctx.message.text.split(' ')[1];

  if (arg === 'on') {
    db.toggleFeature(chatId, 'antiLink', true);
    await ctx.reply('✅ Anti-Link *চালু* হয়েছে!', { parse_mode: 'Markdown' });
  } else if (arg === 'off') {
    db.toggleFeature(chatId, 'antiLink', false);
    await ctx.reply('❌ Anti-Link *বন্ধ* হয়েছে!', { parse_mode: 'Markdown' });
  } else {
    await ctx.reply('ব্যবহার: `/antilink on` অথবা `/antilink off`', { parse_mode: 'Markdown' });
  }
}

// ── /antibadword Command ──────────────────────
async function toggleAntiBadWord(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const chatId = ctx.chat.id;
  db.initGroup(chatId, config);
  const arg = ctx.message.text.split(' ')[1];

  if (arg === 'on') {
    db.toggleFeature(chatId, 'antiBadWord', true);
    await ctx.reply('✅ Bad Word Filter *চালু* হয়েছে!', { parse_mode: 'Markdown' });
  } else if (arg === 'off') {
    db.toggleFeature(chatId, 'antiBadWord', false);
    await ctx.reply('❌ Bad Word Filter *বন্ধ* হয়েছে!', { parse_mode: 'Markdown' });
  } else {
    await ctx.reply('ব্যবহার: `/antibadword on` অথবা `/antibadword off`', { parse_mode: 'Markdown' });
  }
}

// ── Main Message Filter ───────────────────────
async function filterMessage(ctx) {
  if (ctx.chat.type === 'private') return;

  const chatId = ctx.chat.id;
  const group  = db.initGroup(chatId, config);

  if (await isAdmin(ctx)) {
    db.incrementMessages(chatId);
    return;
  }

  const text    = ctx.message?.text || ctx.message?.caption || '';
  const mention = `[${ctx.from.first_name}](tg://user?id=${ctx.from.id})`;

  // ── 1. Anti-Link ───────────────────────────
  if (group.antiLink && text.match(/https?:\/\/|t\.me\//i)) {
    return deleteAndWarn(ctx, `⚠️ ${mention}, গ্রুপে লিংক শেয়ার করা নিষেধ!`);
  }

  // ── 2. Bad Word Filter ─────────────────────
  if (group.antiBadWord) {
    const lower = text.toLowerCase();
    const found = config.BAD_WORDS.some(w => lower.includes(w.toLowerCase()));
    if (found) {
      return deleteAndWarn(ctx, `⚠️ ${mention}, অশ্লীল ভাষা ব্যবহার করা নিষেধ!`);
    }
  }

  // ── 3. Anti-Spam ──────────────────────────
  if (group.antiSpam) {
    const count = db.trackSpam(chatId, ctx.from.id, config.SPAM.timeWindow);
    if (count > config.SPAM.maxMessages) {
      try {
        await ctx.restrictChatMember(ctx.from.id, {
          permissions: { can_send_messages: false },
        });
        await deleteAndWarn(ctx, `🔇 ${mention}, অতিরিক্ত মেসেজ পাঠানোর কারণে *Mute* করা হয়েছে!`);
      } catch {}
      return;
    }
  }

  db.incrementMessages(chatId);
}

module.exports = { filterMessage, toggleAntiSpam, toggleAntiLink, toggleAntiBadWord };
