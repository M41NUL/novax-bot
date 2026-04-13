// ============================================
//   Nova - Group Data Store
//   Handles per-group settings & state
// ============================================

const groups = {};

// ── Initialize a group with default settings ─
function initGroup(chatId, config) {
  if (!groups[chatId]) {
    groups[chatId] = {
      // Welcome
      welcomeEnabled: true,
      welcomeMsg:     config.DEFAULT_WELCOME,

      // Rules
      rules: config.DEFAULT_RULES,

      // Filters
      antiSpam:      true,
      antiBadWord:   true,
      antiLink:      true,

      // Warn tracking  { userId: count }
      warnings: {},

      // Spam tracking  { userId: [timestamps] }
      spamTracker: {},

      // Muted users    { userId: true }
      muted: {},

      // Saved notes    { noteName: text }
      notes: {},

      // Scheduled msgs [ { cron, message } ]
      scheduled: [],

      // Stats
      stats: {
        totalMessages: 0,
        totalMembers:  0,
        bannedCount:   0,
        warnedCount:   0,
      },
    };
  }
  return groups[chatId];
}

// ── Getters & Setters ─────────────────────────

function getGroup(chatId) {
  return groups[chatId] || null;
}

function setWelcome(chatId, msg) {
  if (groups[chatId]) groups[chatId].welcomeMsg = msg;
}

function setRules(chatId, rules) {
  if (groups[chatId]) groups[chatId].rules = rules;
}

function toggleFeature(chatId, feature, value) {
  if (groups[chatId] && groups[chatId][feature] !== undefined) {
    groups[chatId][feature] = value;
  }
}

// ── Warning System ────────────────────────────

function addWarning(chatId, userId) {
  if (!groups[chatId]) return 0;
  const w = groups[chatId].warnings;
  w[userId] = (w[userId] || 0) + 1;
  groups[chatId].stats.warnedCount++;
  return w[userId];
}

function resetWarning(chatId, userId) {
  if (groups[chatId]) {
    groups[chatId].warnings[userId] = 0;
  }
}

function getWarnings(chatId, userId) {
  return groups[chatId]?.warnings[userId] || 0;
}

// ── Spam Tracker ──────────────────────────────

function trackSpam(chatId, userId, timeWindow) {
  if (!groups[chatId]) return 0;
  const now    = Date.now();
  const tracker = groups[chatId].spamTracker;

  if (!tracker[userId]) tracker[userId] = [];

  // পুরনো timestamp সরাও
  tracker[userId] = tracker[userId].filter(t => now - t < timeWindow);
  tracker[userId].push(now);

  return tracker[userId].length;
}

// ── Notes ─────────────────────────────────────

function saveNote(chatId, name, text) {
  if (groups[chatId]) groups[chatId].notes[name] = text;
}

function getNote(chatId, name) {
  return groups[chatId]?.notes[name] || null;
}

function getAllNotes(chatId) {
  return groups[chatId]?.notes || {};
}

function deleteNote(chatId, name) {
  if (groups[chatId]) delete groups[chatId].notes[name];
}

// ── Stats ─────────────────────────────────────

function incrementMessages(chatId) {
  if (groups[chatId]) groups[chatId].stats.totalMessages++;
}

function incrementBanned(chatId) {
  if (groups[chatId]) groups[chatId].stats.bannedCount++;
}

function getStats(chatId) {
  return groups[chatId]?.stats || null;
}

module.exports = {
  initGroup,
  getGroup,
  setWelcome,
  setRules,
  toggleFeature,
  addWarning,
  resetWarning,
  getWarnings,
  trackSpam,
  saveNote,
  getNote,
  getAllNotes,
  deleteNote,
  incrementMessages,
  incrementBanned,
  getStats,
};
