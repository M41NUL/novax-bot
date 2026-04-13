// ============================================
//   Nova - Admin Commands Handler
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

// ── Helper: Get Target User ───────────────────
function getTarget(ctx) {
  return ctx.message.reply_to_message?.from || null;
}

// ── /warn Command ─────────────────────────────
async function warn(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const chatId = ctx.chat.id;
  db.initGroup(chatId, config);

  const target = getTarget(ctx);
  if (!target) return ctx.reply('⚠️ কাকে warn করবে? কারো মেসেজে Reply করে /warn দাও');

  const targetAdmin = await ctx.getChatMember(target.id);
  if (['administrator', 'creator'].includes(targetAdmin.status))
    return ctx.reply('❌ Admin কে warn করা যাবে না!');

  const count = db.addWarning(chatId, target.id);

  if (count >= config.WARN_LIMIT) {
    await ctx.banChatMember(target.id);
    db.incrementBanned(chatId);
    db.resetWarning(chatId, target.id);
    await ctx.reply(
      `🚫 [${target.first_name}](tg://user?id=${target.id}) কে *${config.WARN_LIMIT}টি* warning এর পর *Ban* করা হয়েছে!`,
      { parse_mode: 'Markdown' }
    );
  } else {
    await ctx.reply(
      `⚠️ [${target.first_name}](tg://user?id=${target.id}) কে warning দেওয়া হয়েছে!\n` +
      `Warning: *${count}/${config.WARN_LIMIT}*\n\n` +
      `${config.WARN_LIMIT}টি warning হলে auto Ban হবে!`,
      { parse_mode: 'Markdown' }
    );
  }
}

// ── /warns Command ────────────────────────────
async function warns(ctx) {
  const chatId = ctx.chat.id;
  db.initGroup(chatId, config);

  const target = getTarget(ctx);
  if (!target) return ctx.reply('কারো মেসেজে Reply করে /warns দাও');

  const count = db.getWarnings(chatId, target.id);
  await ctx.reply(
    `📋 [${target.first_name}](tg://user?id=${target.id}) এর Warning: *${count}/${config.WARN_LIMIT}*`,
    { parse_mode: 'Markdown' }
  );
}

// ── /resetwarn Command ────────────────────────
async function resetWarn(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const chatId = ctx.chat.id;
  const target = getTarget(ctx);
  if (!target) return ctx.reply('কারো মেসেজে Reply করে /resetwarn দাও');

  db.resetWarning(chatId, target.id);
  await ctx.reply(
    `✅ [${target.first_name}](tg://user?id=${target.id}) এর warning রিসেট হয়েছে!`,
    { parse_mode: 'Markdown' }
  );
}

// ── /ban Command ──────────────────────────────
async function ban(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const target = getTarget(ctx);
  if (!target) return ctx.reply('কাকে ban করবে? Reply করে /ban দাও');

  const targetAdmin = await ctx.getChatMember(target.id);
  if (['administrator', 'creator'].includes(targetAdmin.status))
    return ctx.reply('❌ Admin কে ban করা যাবে না!');

  await ctx.banChatMember(target.id);
  db.incrementBanned(ctx.chat.id);
  await ctx.reply(
    `🚫 [${target.first_name}](tg://user?id=${target.id}) কে *Ban* করা হয়েছে!`,
    { parse_mode: 'Markdown' }
  );
}

// ── /unban Command ────────────────────────────
async function unban(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const target = getTarget(ctx);
  if (!target) return ctx.reply('কারো মেসেজে Reply করে /unban দাও');

  await ctx.unbanChatMember(target.id);
  await ctx.reply(
    `✅ [${target.first_name}](tg://user?id=${target.id}) কে *Unban* করা হয়েছে!`,
    { parse_mode: 'Markdown' }
  );
}

// ── /kick Command ─────────────────────────────
async function kick(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const target = getTarget(ctx);
  if (!target) return ctx.reply('কাকে kick করবে? Reply করে /kick দাও');

  await ctx.banChatMember(target.id);
  await ctx.unbanChatMember(target.id);
  await ctx.reply(
    `👢 [${target.first_name}](tg://user?id=${target.id}) কে *Kick* করা হয়েছে!`,
    { parse_mode: 'Markdown' }
  );
}

// ── /mute Command ─────────────────────────────
async function mute(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const target = getTarget(ctx);
  if (!target) return ctx.reply('কাকে mute করবে? Reply করে /mute দাও');

  await ctx.restrictChatMember(target.id, {
    permissions: { can_send_messages: false },
  });
  await ctx.reply(
    `🔇 [${target.first_name}](tg://user?id=${target.id}) কে *Mute* করা হয়েছে!`,
    { parse_mode: 'Markdown' }
  );
}

// ── /unmute Command ───────────────────────────
async function unmute(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const target = getTarget(ctx);
  if (!target) return ctx.reply('কাকে unmute করবে? Reply করে /unmute দাও');

  await ctx.restrictChatMember(target.id, {
    permissions: {
      can_send_messages:         true,
      can_send_media_messages:   true,
      can_send_other_messages:   true,
      can_add_web_page_previews: true,
    },
  });
  await ctx.reply(
    `🔊 [${target.first_name}](tg://user?id=${target.id}) কে *Unmute* করা হয়েছে!`,
    { parse_mode: 'Markdown' }
  );
}

// ── /pin Command ──────────────────────────────
async function pin(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const reply = ctx.message.reply_to_message;
  if (!reply) return ctx.reply('কোন মেসেজ pin করবে? Reply করে /pin দাও');

  await ctx.pinChatMessage(reply.message_id);
  await ctx.reply('📌 মেসেজ Pin করা হয়েছে!');
}

// ── /unpin Command ────────────────────────────
async function unpin(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  await ctx.unpinChatMessage();
  await ctx.reply('📌 মেসেজ Unpin করা হয়েছে!');
}

// ── /settitle Command (Bot এর Group Nickname) ─
async function setTitle(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const text = ctx.message.text.split('/settitle ')[1];
  if (!text)
    return ctx.reply(
      '✏️ ব্যবহার: `/settitle নতুন নাম`\n\nউদাহরণ: `/settitle Nova Guard`',
      { parse_mode: 'Markdown' }
    );

  try {
    // Bot এর group nickname পরিবর্তন
    await ctx.telegram.setChatAdministratorCustomTitle(
      ctx.chat.id,
      ctx.botInfo.id,
      text
    );
    await ctx.reply(
      `✅ Bot এর Nickname পরিবর্তন হয়েছে!\n\n🏷️ নতুন নাম: *${text}*`,
      { parse_mode: 'Markdown' }
    );
  } catch (e) {
    await ctx.reply(
      `❌ Nickname পরিবর্তন হয়নি!\n\n` +
      `⚠️ কারণ: Bot কে *Anonymous Admin* না করে *Normal Admin* করো।`,
      { parse_mode: 'Markdown' }
    );
  }
}

// ── /setmytitle Command (নিজের Nickname) ──────
async function setMyTitle(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const text = ctx.message.text.split('/setmytitle ')[1];
  if (!text)
    return ctx.reply(
      '✏️ ব্যবহার: `/setmytitle তোমার নতুন নাম`\n\nউদাহরণ: `/setmytitle 👑 Owner`',
      { parse_mode: 'Markdown' }
    );

  try {
    await ctx.telegram.setChatAdministratorCustomTitle(
      ctx.chat.id,
      ctx.from.id,
      text
    );
    await ctx.reply(
      `✅ তোমার Nickname পরিবর্তন হয়েছে!\n\n🏷️ নতুন নাম: *${text}*`,
      { parse_mode: 'Markdown' }
    );
  } catch (e) {
    await ctx.reply('❌ Nickname পরিবর্তন হয়নি! তুমি কি Admin?', { parse_mode: 'Markdown' });
  }
}

// ── /stats Command ────────────────────────────
async function stats(ctx) {
  const chatId   = ctx.chat.id;
  db.initGroup(chatId, config);
  const s        = db.getStats(chatId);
  const chatInfo = ctx.chat;

  await ctx.reply(
    `📊 *${chatInfo.title} — গ্রুপ Stats*\n\n` +
    `💬 মোট মেসেজ: *${s.totalMessages}*\n` +
    `🚫 মোট Ban: *${s.bannedCount}*\n` +
    `⚠️ মোট Warning: *${s.warnedCount}*\n\n` +
    `⚡ Powered by Nova`,
    { parse_mode: 'Markdown' }
  );
}

// ── /announce Command ─────────────────────────
async function announce(ctx) {
  if (!(await isAdmin(ctx)))
    return ctx.reply('❌ শুধু Admin এই কমান্ড ব্যবহার করতে পারবে!');

  const text = ctx.message.text.split('/announce ')[1];
  if (!text) return ctx.reply('✏️ ব্যবহার: `/announce তোমার ঘোষণা`', { parse_mode: 'Markdown' });

  await ctx.reply(
    `📢 *ঘোষণা*\n\n${text}\n\n— Nova`,
    { parse_mode: 'Markdown' }
  );
}

module.exports = {
  warn, warns, resetWarn,
  ban, unban, kick,
  mute, unmute,
  pin, unpin,
  setTitle, setMyTitle,
  stats, announce,
};
