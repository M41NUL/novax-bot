// ============================================
//   Nova - Welcome & Rules Handler
// ============================================

const { Markup }  = require('telegraf');
const config      = require('../config');
const db          = require('../data/groups');

// ── Helper: Check Admin ───────────────────────
async function isAdmin(ctx) {
  try {
    const m = await ctx.getChatMember(ctx.from.id);
    return ['administrator', 'creator'].includes(m.status);
  } catch {
    return false;
  }
}

// ── New Member Joined ─────────────────────────
async function onNewMember(ctx) {
  const chatId  = ctx.chat.id;
  const group   = db.initGroup(chatId, config);
  const members = ctx.message.new_chat_members;

  for (const member of members) {
    // Bot নিজে add হলে
    if (member.id === ctx.botInfo.id) {
      await ctx.reply(
        `⚡ *Nova এখানে!*\n\n` +
        `আমাকে Add করার জন্য ধন্যবাদ 🎉\n\n` +
        `⚠️ আমাকে *Admin* বানাতে ভুলবেন না!\n\n` +
        `📋 সব কমান্ড → /help`,
        {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [Markup.button.url('👨‍💻 Developer', config.LINKS.telegram)],
          ]),
        }
      );
      return;
    }

    if (!group.welcomeEnabled) continue;

    // User mention তৈরি করো
    const mention = `[${member.first_name}](tg://user?id=${member.id})`;
    const text    = group.welcomeMsg
      .replace('{mention}',   mention)
      .replace('{name}',      member.first_name)
      .replace('{groupName}', ctx.chat.title);

    await ctx.reply(text, { parse_mode: 'Markdown' });
  }
}

// ── Member Left ───────────────────────────────
async function onMemberLeft(ctx) {
  const member = ctx.message.left_chat_member;
  if (member.id === ctx.botInfo.id) return;

  await ctx.reply(
    `👋 *${member.first_name}* গ্রুপ ছেড়ে চলে গেছে।`,
    { parse_mode: 'Markdown' }
  );
}

// ── /setwelcome Command ───────────────────────
async function setWelcome(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const chatId = ctx.chat.id;
  db.initGroup(chatId, config);

  const text = ctx.message.text.split('/setwelcome ')[1];
  if (!text)
    return ctx.reply(
      '✏️ ব্যবহার:\n`/setwelcome তোমার মেসেজ`\n\n' +
      'ভেরিয়েবল:\n' +
      '`{mention}` → ইউজার mention\n' +
      '`{name}` → ইউজারের নাম\n' +
      '`{groupName}` → গ্রুপের নাম',
      { parse_mode: 'Markdown' }
    );

  db.setWelcome(chatId, text);

  const preview = text
    .replace('{mention}',   `[বন্ধু](tg://user?id=0)`)
    .replace('{name}',      'বন্ধু')
    .replace('{groupName}', ctx.chat.title);

  await ctx.reply(
    `✅ *Welcome মেসেজ সেট হয়েছে!*\n\n📋 প্রিভিউ:\n${preview}`,
    { parse_mode: 'Markdown' }
  );
}

// ── /welcome on/off Command ───────────────────
async function toggleWelcome(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const chatId = ctx.chat.id;
  db.initGroup(chatId, config);

  const arg = ctx.message.text.split(' ')[1];
  if (arg === 'on') {
    db.toggleFeature(chatId, 'welcomeEnabled', true);
    await ctx.reply('✅ Welcome মেসেজ *চালু* হয়েছে!', { parse_mode: 'Markdown' });
  } else if (arg === 'off') {
    db.toggleFeature(chatId, 'welcomeEnabled', false);
    await ctx.reply('❌ Welcome মেসেজ *বন্ধ* হয়েছে!', { parse_mode: 'Markdown' });
  } else {
    await ctx.reply('ব্যবহার: `/welcome on` অথবা `/welcome off`', { parse_mode: 'Markdown' });
  }
}

// ── /setrules Command ─────────────────────────
async function setRules(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const chatId = ctx.chat.id;
  db.initGroup(chatId, config);

  const text = ctx.message.text.split('/setrules ')[1];
  if (!text)
    return ctx.reply('✏️ ব্যবহার: `/setrules তোমার নিয়ম`', { parse_mode: 'Markdown' });

  db.setRules(chatId, text);
  await ctx.reply('✅ নিয়ম সেট হয়েছে!');
}

// ── /rules Command ────────────────────────────
async function showRules(ctx) {
  const chatId = ctx.chat.id;
  const group  = db.initGroup(chatId, config);

  await ctx.reply(
    `📌 *${ctx.chat.title} — নিয়মাবলী*\n\n${group.rules}`,
    { parse_mode: 'Markdown' }
  );
}

module.exports = { onNewMember, onMemberLeft, setWelcome, toggleWelcome, setRules, showRules };
