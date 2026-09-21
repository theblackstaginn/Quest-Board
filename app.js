// =========================================================
// QUEST BOARD
// app.js
//
// Phase 7:
// - Stable Farmer / Jess profile identities
// - Character tarot cards
// - XP + levels
// - Gold economy
// - Crystal economy
// - Configurable weekly goals
// - Week Conquered victory reward
// - Boss Battle victory + crystal reveal
// - Weekly reward protection
// - Boss reward protection
// - Anonymous Supabase authentication
// - Real cross-device parties
// - Invite-code joining
// - Shared party quest activity
// - Combined weekly party challenge
// - Local personal progression
// - Supabase-backed fellowship data
// - Party Gold / Crystal gifting
// - Cross-device gift notifications
// - Relic collection, rarity badges, source badges, discovery reveals
// =========================================================


// =========================================================
// 1. SUPABASE CONFIGURATION
// =========================================================

const SUPABASE_URL =
  "https://pqifpislzljilqatmtly.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_16wAhIyuMsClbOYoAZt6aQ_unXWTJ_n";

const supabaseClient =
  window.supabase?.createClient
    ? window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
      )
    : null;


// =========================================================
// 2. QUEST DATA
// =========================================================

const QUESTS = [
  {
    id: "there-back",
    title: "There and Back",
    category: "Endurance",
    time: "15-25 min",
    xpType: "endurance",
    xp: 20,
    gold: 12,
    description:
      "Walk the full 1-mile road route at a comfortable, steady pace.",
    exercises: [
      "Walk the full 1-mile route"
    ]
  },

  {
    id: "keep",
    title: "The Keep",
    category: "Strength",
    time: "10-20 min",
    xpType: "strength",
    xp: 25,
    gold: 15,
    description:
      "A simple dumbbell and kettlebell strength quest. Complete two rounds for a short session or three to four rounds for the full quest.",
    exercises: [
      "Goblet squat - 8-12 reps",
      "One-arm dumbbell row - 8-12 reps each side",
      "Dumbbell bench press - 8-12 reps",
      "Romanian deadlift - 8-12 reps",
      "Plank - 20-40 seconds"
    ]
  },

  {
    id: "dragonstrength",
    title: "DragonStrength",
    category: "Strength",
    time: "10-20 min",
    xpType: "strength",
    xp: 30,
    gold: 20,
    description:
      "Barbell and rack training. Keep the movement controlled and leave a little strength in reserve.",
    exercises: [
      "Barbell squat - 8-10 reps",
      "Bench press - 8-10 reps",
      "Barbell Romanian deadlift - 8-10 reps",
      "Cable row or lat pulldown - 10-12 reps",
      "Core movement of choice"
    ]
  },

  {
    id: "rogue",
    title: "Rogue Mode",
    category: "Mixed",
    time: "10 min",
    xpType: "strength",
    xp: 20,
    gold: 15,
    description:
      "Set the timer for ten minutes and move continuously through the circuit at your own pace.",
    exercises: [
      "10 kettlebell deadlifts",
      "8 goblet squats",
      "8 dumbbell shoulder presses",
      "20-30 second plank",
      "Repeat until 10 minutes is complete"
    ]
  },

  {
    id: "restoration",
    title: "Restoration",
    category: "Recovery",
    time: "10-20 min",
    xpType: "restoration",
    xp: 20,
    gold: 10,
    description:
      "A mobility and recovery quest for keeping the body loose, capable, and ready for the next battle.",
    exercises: [
      "Hip mobility",
      "Hamstring stretch",
      "Calf stretch",
      "Back mobility",
      "Shoulder mobility",
      "Chest opening"
    ]
  },

  {
    id: "ranger",
    title: "Ranger Training",
    category: "Endurance",
    time: "20-30 min",
    xpType: "endurance",
    xp: 30,
    gold: 20,
    description:
      "Walk the mile. After a five-minute warm-up, alternate one minute fast with two minutes at your normal pace.",
    exercises: [
      "5-minute warm-up",
      "1 minute fast",
      "2 minutes normal",
      "Repeat intervals",
      "Complete the full 1-mile route"
    ]
  }
];


// =========================================================
// 3. SPECIAL QUESTS
// =========================================================

const SPECIAL_QUESTS = {
  emergency: {
    id: "emergency",
    title: "Emergency Quest",
    category: "Emergency",
    time: "5 min",
    xpType: "strength",
    xp: 10,
    gold: 5,
    description:
      "Five minutes counts. This exists for the days when doing anything feels harder than it should.",
    exercises: [
      "10 goblet squats",
      "10 dumbbell rows each side",
      "10 dumbbell chest presses",
      "10 deadlifts",
      "Repeat until five minutes is complete"
    ]
  },

  boss: {
    id: "boss",
    title: "Boss Battle",
    category: "Boss",
    time: "30-45 min",
    xpType: "strength",
    xp: 0,
    gold: 0,
    description:
      "The weekly challenge. Walk the mile, then complete twenty minutes of strength training.",
    exercises: [
      "Walk the full 1-mile route",
      "Choose The Keep, DragonStrength, or Rogue Mode",
      "Complete 20 minutes of strength work"
    ]
  }
};


// =========================================================
// 4. CHARACTER DATA
// =========================================================

const CHARACTER_PROFILES = {
  farmer: {
    profileId: "farmer",
    legacyName: "Farmer",
    defaultName: "Farmer",
    className: "Half-Orc Wizard",
    card: "farmer-card.webp",
    theme: "ember",
    description:
      "A road-worn half-orc wizard who turns discipline into ritual, strength into spellwork, and every completed quest into another page of the legend."
  },

  jess: {
    profileId: "jess",
    legacyName: "Jess",
    defaultName: "Jess",
    className: "Rogue Witch Assassin",
    card: "jess-card.webp",
    theme: "amethyst",
    description:
      "A swift rogue witch assassin who moves between shadow and spellcraft, sharpening endurance, restoration, and ruthless consistency with every quest."
  }
};


// =========================================================
// 5. RELIC COLLECTION DATA
// =========================================================

const RELIC_RARITY_BADGES = {
  common: "badges/common.webp",
  uncommon: "badges/uncommon.webp",
  rare: "badges/rare.webp",
  epic: "badges/epic.webp",
  legendary: "badges/legendary.webp",
  mythic: "badges/mythic.webp"
};

const RELIC_SOURCE_BADGES = {
  quest: "badges/quest-completed.webp",
  week: "badges/week-conquered.webp",
  boss: "badges/boss-defeated.webp",
  level: "badges/level-up.webp",
  party: "badges/party-challenge.webp",
  secret: "badges/secret-acheivment.webp"
};

const RELIC_SOURCE_LABELS = {
  quest: "Quest Milestone",
  week: "Week Conquered",
  boss: "Boss Trophy",
  level: "Level Milestone",
  party: "Party Challenge",
  secret: "Secret Achievement"
};

const RELICS = [
  {
    id: "travelers-banner",
    name: "Traveler's Banner",
    image: "relics/travelers-banner.webp",
    flavor:
      "Proof that every great journey begins with a single step.",
    rarity: "common",
    source: "quest",
    condition: stats =>
      stats.totalQuests >= 1
  },

  {
    id: "wanderers-compass",
    name: "Wanderer's Compass",
    image: "relics/wanderers-compass.webp",
    flavor:
      "Always points the way, even when the path is hidden.",
    rarity: "common",
    source: "quest",
    condition: stats =>
      stats.totalQuests >= 3
  },

  {
    id: "sprout-of-perseverence",
    name: "Sprout of Perseverance",
    image: "relics/sprout-of-perseverence.webp",
    flavor:
      "A living reminder that discipline takes root within.",
    rarity: "uncommon",
    source: "week",
    condition: stats =>
      stats.hasConqueredWeek
  },

  {
    id: "lantern-of-guidance",
    name: "Lantern of Guidance",
    image: "relics/lantern-of-guidance.webp",
    flavor:
      "Its light reveals the next step when all else is lost.",
    rarity: "uncommon",
    source: "quest",
    condition: stats =>
      stats.totalQuests >= 5
  },

  {
    id: "elixir-of-vitality",
    name: "Elixir of Vitality",
    image: "relics/elixir-of-vitality.webp",
    flavor:
      "A sip restores more than strength; it rekindles the will to continue.",
    rarity: "uncommon",
    source: "quest",
    condition: stats =>
      stats.restorationQuests >= 5
  },

  {
    id: "stone-of-resolve",
    name: "Stone of Resolve",
    image: "relics/stone-of-resolve.webp",
    flavor:
      "Steady as stone. Willpower carved into your core.",
    rarity: "rare",
    source: "quest",
    condition: stats =>
      stats.totalQuests >= 10
  },

  {
    id: "band-of-inner-focus",
    name: "Band of Inner Focus",
    image: "relics/band-of-inner-focus.webp",
    flavor:
      "Still the mind. Sharpen the purpose. Let nothing pull you from your path.",
    rarity: "rare",
    source: "quest",
    condition: stats =>
      stats.rogueQuests >= 5
  },

  {
    id: "forgebound-hammer",
    name: "Forgebound Hammer",
    image: "relics/forgebound-hammer.webp",
    flavor:
      "Molded in fire. Built for those who shape their fate.",
    rarity: "rare",
    source: "quest",
    condition: stats =>
      stats.strengthQuests >= 10
  },

  {
    id: "stone-of-harmony",
    name: "Stone of Harmony",
    image: "relics/stone-of-harmony.webp",
    flavor:
      "Balance is power. Let it steady your heart and your hand.",
    rarity: "rare",
    source: "level",
    condition: stats =>
      stats.minimumStatLevel >= 3
  },

  {
    id: "fellowship-pin",
    name: "Fellowship Pin",
    image: "relics/fellowship-pin.webp",
    flavor:
      "Strength is multiplied when hearts are aligned.",
    rarity: "rare",
    source: "party",
    manual: true
  },

  {
    id: "ravens-oath",
    name: "Raven's Oath",
    image: "relics/ravens-oath.webp",
    flavor:
      "Swear your purpose to the night. Let nothing break it.",
    rarity: "epic",
    source: "boss",
    condition: stats =>
      stats.bossesDefeated >= 1
  },

  {
    id: "cloak-of-endurance",
    name: "Cloak of Endurance",
    image: "relics/cloak-of-endurance.webp",
    flavor:
      "A mantle worn by those who keep moving when the road grows long.",
    rarity: "epic",
    source: "quest",
    condition: stats =>
      stats.enduranceQuests >= 10
  },

  {
    id: "mask-of-the-wild",
    name: "Mask of the Wild",
    image: "relics/mask-of-the-wild.webp",
    flavor:
      "Wear it to move unseen, and to hear what others cannot.",
    rarity: "epic",
    source: "quest",
    condition: stats =>
      stats.rangerQuests >= 10
  },

  {
    id: "scribe-of-destiny",
    name: "Scribe of Destiny",
    image: "relics/scribe-of-destiny.webp",
    flavor:
      "Record your deeds. The ink of today writes the legend of tomorrow.",
    rarity: "epic",
    source: "secret",
    condition: stats =>
      stats.uniqueCoreQuests >=
      QUESTS.length
  },

  {
    id: "wardens-totem",
    name: "Warden's Totem",
    image: "relics/wardens-totem.webp",
    flavor:
      "The guardians watch favorably upon the persistent.",
    rarity: "epic",
    source: "quest",
    condition: stats =>
      stats.totalQuests >= 50
  },

  {
    id: "hourglass-of-discipline",
    name: "Hourglass of Discipline",
    image: "relics/hourglass-of-discipline.webp",
    flavor:
      "Time obeys focus. Spend it well, and be unstoppable.",
    rarity: "legendary",
    source: "quest",
    condition: stats =>
      stats.totalQuests >= 25
  },

  {
    id: "dreamweavers-loop",
    name: "Dreamweaver's Loop",
    image: "relics/dreamweavers-loop.webp",
    flavor:
      "Protects your rest, weaving clarity into dreams.",
    rarity: "legendary",
    source: "level",
    condition: stats =>
      stats.maximumStatLevel >= 5
  },

  {
    id: "chalice-of-renewal",
    name: "Chalice of Renewal",
    image: "relics/chalice-of-renewal.webp",
    flavor:
      "From its depths flows hope. Drink, and rise again.",
    rarity: "legendary",
    source: "quest",
    condition: stats =>
      stats.restorationQuests >= 15
  },

  {
    id: "journal-of-growth",
    name: "Journal of Growth",
    image: "relics/journal-of-growth.webp",
    flavor:
      "Every challenge faced, every lesson learned becomes the wisdom you carry.",
    rarity: "legendary",
    source: "quest",
    condition: stats =>
      stats.totalQuests >= 75
  },

  {
    id: "compass-of-true-north",
    name: "Compass of True North",
    image: "relics/compass-of-true-north.webp",
    flavor:
      "When lost, it points you back to what truly matters.",
    rarity: "legendary",
    source: "quest",
    condition: stats =>
      stats.totalQuests >= 100
  },

  {
    id: "oracles-gaze",
    name: "Oracle's Gaze",
    image: "relics/oracles-gaze.webp",
    flavor:
      "See beyond the fog. Trust the vision within.",
    rarity: "mythic",
    source: "boss",
    condition: stats =>
      stats.bossesDefeated >= 5
  },

  {
    id: "tome-of-growth",
    name: "Tome of Growth",
    image: "relics/tome-of-growth.webp",
    flavor:
      "Every challenge faced writes a new chapter.",
    rarity: "mythic",
    source: "level",
    condition: stats =>
      stats.minimumStatLevel >= 10
  },

  {
    id: "shard-of-resolve",
    name: "Shard of Resolve",
    image: "relics/shard-of-resolve.webp",
    flavor:
      "A piece of unbreakable spirit. Hold fast, no matter the storm.",
    rarity: "mythic",
    source: "level",
    condition: stats =>
      stats.strengthLevel >= 10
  },

  {
    id: "heart-of-ascension",
    name: "Heart of Ascension",
    image: "relics/heart-of-ascension.webp",
    flavor:
      "Forged in struggle. You rise stronger.",
    rarity: "mythic",
    source: "quest",
    condition: stats =>
      stats.totalQuests >= 250
  }
];

const PARTY_TREASURES = {
  "fellowship-token": {
    name: "Fellowship Token",
    rarity: "Common",
    glyph: "+1",
    description:
      "Adds one bonus point to the shared weekly challenge."
  },

  "banner-of-plenty": {
    name: "Banner of Plenty",
    rarity: "Uncommon",
    glyph: "G",
    description:
      "Grants 15 Gold to every fellowship member."
  },

  "crystal-parcel": {
    name: "Crystal Parcel",
    rarity: "Rare",
    glyph: "C",
    description:
      "Grants one Crystal to every fellowship member."
  },

  "rallying-horn": {
    name: "Rallying Horn",
    rarity: "Epic",
    glyph: "+3",
    description:
      "Adds three bonus points to the shared weekly challenge."
  }
};


// =========================================================
// 5. CONSTANTS
// =========================================================

const DEFAULT_WEEKLY_GOAL = 3;
const XP_PER_LEVEL = 100;
const PARTY_REFRESH_INTERVAL = 15000;

const WEEK_CONQUERED_GOLD = 25;

const BOSS_STRENGTH_XP = 50;
const BOSS_ENDURANCE_XP = 50;
const BOSS_GOLD = 100;
const BOSS_CRYSTALS = 3;


// =========================================================
// 6. APP STATE
// =========================================================

let activeProfileId =
  getInitialProfileId();

let activeView =
  localStorage.getItem(
    "questBoardActiveView"
  )
  || "board";

let activeQuest = null;

// The interval only refreshes the visible clock.
// Timestamp math is the source of truth.
let timerInterval = null;
let timerDisplayMs = 0;

let toastTimeout = null;

let supabaseUser = null;
let supabaseReady = false;
let currentParty = null;
let partyRefreshTimer = null;

let giftRecipient = null;
let giftSending = false;
let checkingIncomingGifts = false;

let activeRelicFilter = "all";
let relicRevealQueue = [];
let currentRelicRevealMode = false;
let appInitialized = false;
let partyTreasureUsing = false;
let partyMemberProfileCache =
  new Map();


// =========================================================
// 7. DOM HELPERS
// =========================================================

const $ =
  selector =>
    document.querySelector(selector);

const $$ =
  selector =>
    document.querySelectorAll(selector);


// =========================================================
// 8. PROFILE HELPERS
// =========================================================

function normalizeProfileId(value) {
  const normalized =
    String(value || "")
      .trim()
      .toLowerCase();

  if (normalized === "farmer") {
    return "farmer";
  }

  if (normalized === "jess") {
    return "jess";
  }

  return null;
}


function getInitialProfileId() {
  const newValue =
    normalizeProfileId(
      localStorage.getItem(
        "questBoardActiveProfileId"
      )
    );

  if (newValue) {
    return newValue;
  }

  const legacyValue =
    normalizeProfileId(
      localStorage.getItem(
        "questBoardActiveProfile"
      )
    );

  if (legacyValue) {
    localStorage.setItem(
      "questBoardActiveProfileId",
      legacyValue
    );

    return legacyValue;
  }

  return null;
}


function getCharacterConfig(
  profileId = activeProfileId
) {
  return (
    CHARACTER_PROFILES[profileId]
    || CHARACTER_PROFILES.farmer
  );
}


function getLegacyProfileName(
  profileId = activeProfileId
) {
  return (
    getCharacterConfig(profileId)
      .legacyName
  );
}


// =========================================================
// 9. PROFILE CHOICE
// =========================================================

function chooseProfile() {
  if (activeProfileId) {
    return;
  }

  const choice =
    prompt(
      "Who is using this Quest Board?\n\nType Farmer or Jess"
    );

  activeProfileId =
    normalizeProfileId(choice)
    || "farmer";

  localStorage.setItem(
    "questBoardActiveProfileId",
    activeProfileId
  );

  localStorage.setItem(
    "questBoardActiveProfile",
    getLegacyProfileName()
  );
}


// =========================================================
// 10. STORAGE KEYS
// =========================================================

function getStorageKey() {
  return (
    `questBoardState-${getLegacyProfileName()}`
  );
}


function getSettingsKey() {
  return (
    `questBoardSettings-${getLegacyProfileName()}`
  );
}


// =========================================================
// 11. SETTINGS
// =========================================================

function createFreshSettings() {
  const character =
    getCharacterConfig();

  return {
    playerName:
      character.defaultName,

    weeklyGoal:
      DEFAULT_WEEKLY_GOAL,

    reducedMotion:
      false,

    soundEnabled:
      false
  };
}


function getSettings() {
  const saved =
    localStorage.getItem(
      getSettingsKey()
    );

  if (!saved) {
    return createFreshSettings();
  }

  try {
    return {
      ...createFreshSettings(),
      ...JSON.parse(saved)
    };
  }

  catch (error) {
    console.error(
      "Could not read Quest Board settings.",
      error
    );

    return createFreshSettings();
  }
}


function saveSettings(settings) {
  localStorage.setItem(
    getSettingsKey(),
    JSON.stringify(settings)
  );
}


// =========================================================
// 12. PERSONAL QUEST STATE
// =========================================================

function createFreshState() {
  return {
    weekKey:
      getWeekKey(),

    weeklyCompleted:
      [],

    xp: {
      strength: 0,
      endurance: 0,
      restoration: 0
    },

    gold:
      0,

    crystals:
      0,

    history:
      [],

    claimedGiftIds:
      [],

    discoveredRelics:
      [],

    relicDiscoveryDates:
      {},

    weekConqueredRewardWeek:
      null,

    bossDefeatedWeek:
      null,

    bossRewardsClaimedWeek:
      null
  };
}
function migrateState(parsed) {
  const fresh =
    createFreshState();

  return {
    ...fresh,
    ...parsed,

    xp: {
      ...fresh.xp,
      ...(parsed?.xp || {})
    },

    gold:
      Number(parsed?.gold)
      || 0,

    crystals:
      Number(parsed?.crystals)
      || 0,

    weeklyCompleted:
      Array.isArray(
        parsed?.weeklyCompleted
      )
        ? parsed.weeklyCompleted
        : [],

    history:
      Array.isArray(
        parsed?.history
      )
        ? parsed.history
        : [],

    claimedGiftIds:
      Array.isArray(
        parsed?.claimedGiftIds
      )
        ? parsed.claimedGiftIds
        : [],

    discoveredRelics:
      Array.isArray(
        parsed?.discoveredRelics
      )
        ? parsed.discoveredRelics
        : [],

    relicDiscoveryDates:
      parsed?.relicDiscoveryDates
      && typeof parsed.relicDiscoveryDates === "object"
        ? parsed.relicDiscoveryDates
        : {},

    weekConqueredRewardWeek:
      parsed?.weekConqueredRewardWeek
      || null,

    bossDefeatedWeek:
      parsed?.bossDefeatedWeek
      || null,

    bossRewardsClaimedWeek:
      parsed?.bossRewardsClaimedWeek
      || null
  };
}


function getState() {
  const saved =
    localStorage.getItem(
      getStorageKey()
    );

  if (!saved) {
    return createFreshState();
  }

  try {
    return (
      migrateState(
        JSON.parse(saved)
      )
    );
  }

  catch (error) {
    console.error(
      "Could not read Quest Board state.",
      error
    );

    return createFreshState();
  }
}


function saveState(state) {
  localStorage.setItem(
    getStorageKey(),
    JSON.stringify(state)
  );
}


// =========================================================
// 13. WEEK HANDLING
// =========================================================

function getWeekKey(
  date = new Date()
) {
  const workingDate =
    new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )
    );

  const dayNumber =
    workingDate.getUTCDay()
    || 7;

  workingDate.setUTCDate(
    workingDate.getUTCDate()
    + 4
    - dayNumber
  );

  const yearStart =
    new Date(
      Date.UTC(
        workingDate.getUTCFullYear(),
        0,
        1
      )
    );

  const weekNumber =
    Math.ceil(
      (
        (
          workingDate
          - yearStart
        )
        / 86400000
        + 1
      )
      / 7
    );

  return (
    `${workingDate.getUTCFullYear()}`
    + "-W"
    + String(weekNumber)
      .padStart(2, "0")
  );
}


function normalizeWeek() {
  const state =
    getState();

  const weekKey =
    getWeekKey();

  if (
    state.weekKey !== weekKey
  ) {
    state.weekKey =
      weekKey;

    state.weeklyCompleted =
      [];

    saveState(state);
  }

  return state;
}


// =========================================================
// 14. LEVEL SYSTEM
// =========================================================

function getLevelData(xp) {
  const safeXp =
    Math.max(
      0,
      Number(xp) || 0
    );

  return {
    level:
      Math.floor(
        safeXp / XP_PER_LEVEL
      ) + 1,

    progress:
      safeXp % XP_PER_LEVEL
  };
}


// =========================================================
// 15. QUEST LOOKUP
// =========================================================

function findQuest(id) {
  return (
    QUESTS.find(
      quest =>
        quest.id === id
    )
    || SPECIAL_QUESTS[id]
  );
}


// =========================================================
// 16. SUPABASE INITIALIZATION
// =========================================================

async function initializeSupabase() {
  setPartySyncStatus(
    "Connecting to the guild..."
  );

  if (!supabaseClient) {
    supabaseReady = false;

    console.warn(
      "Supabase library did not load. Running Quest Board in local-only mode."
    );

    setPartySyncStatus(
      "Party sync unavailable. Personal progress still works.",
      "error"
    );

    return;
  }

  try {
    const {
      data: {
        session
      }
    } =
      await supabaseClient.auth
        .getSession();

    if (session?.user) {
      supabaseUser =
        session.user;
    }

    else {
      const {
        data,
        error
      } =
        await supabaseClient.auth
          .signInAnonymously();

      if (error) {
        throw error;
      }

      supabaseUser =
        data.user;
    }

    if (!supabaseUser) {
      throw new Error(
        "Supabase did not return a user."
      );
    }

    supabaseReady =
      true;

    await syncProfileToSupabase();
    await loadCurrentParty();

    setPartySyncStatus(
      "Guild connection established.",
      "connected"
    );

    startPartyRefreshLoop();
  }

  catch (error) {
    supabaseReady =
      false;

    console.error(
      "Supabase initialization failed:",
      error
    );

    setPartySyncStatus(
      "Party sync unavailable. Personal progress still works.",
      "error"
    );
  }
}


// =========================================================
// 17. SYNC PROFILE
// =========================================================

async function syncProfileToSupabase() {
  if (
    !supabaseReady
    || !supabaseUser
  ) {
    return;
  }

  const settings =
    getSettings();

  const character =
    getCharacterConfig();

  const {
    error
  } =
    await supabaseClient
      .from("profiles")
      .upsert(
        {
          user_id:
            supabaseUser.id,

          profile_id:
            activeProfileId,

          display_name:
            settings.playerName
            || character.defaultName,

          class_name:
            character.className
        },
        {
          onConflict:
            "user_id"
        }
      );

  if (error) {
    throw error;
  }
}


// =========================================================
// 18. LOAD CURRENT PARTY
// =========================================================

async function loadCurrentParty() {
  currentParty =
    null;

  if (
    !supabaseReady
    || !supabaseUser
  ) {
    return null;
  }

  const {
    data: membership,
    error: membershipError
  } =
    await supabaseClient
      .from("party_members")
      .select(
        "party_id, joined_at"
      )
      .eq(
        "user_id",
        supabaseUser.id
      )
      .order(
        "joined_at",
        {
          ascending: false
        }
      )
      .limit(1)
      .maybeSingle();

  if (membershipError) {
    throw membershipError;
  }

  if (!membership) {
    await renderParty();

    renderSettings(
      getSettings()
    );

    return null;
  }

  const {
    data: party,
    error: partyError
  } =
    await supabaseClient
      .from("parties")
      .select("*")
      .eq(
        "id",
        membership.party_id
      )
      .single();

  if (partyError) {
    throw partyError;
  }

  currentParty =
    party;

  await renderParty();

  renderSettings(
    getSettings()
  );

  return currentParty;
}


// =========================================================
// 19A. RELIC COLLECTION ENGINE
// =========================================================

function applyRelicImageSizing(image) {
  if (!image) {
    return;
  }

  const width =
    Number(image.naturalWidth)
    || 0;

  const height =
    Number(image.naturalHeight)
    || 0;

  if (!width || !height) {
    return;
  }

  const ratio =
    width / height;

  image.style.width =
    "100%";

  image.style.height =
    "100%";

  image.style.objectFit =
    "contain";

  image.style.objectPosition =
    "center";

  image.dataset.relicAspect =
    ratio > 1.08
      ? "wide"
      : ratio < 0.78
        ? "tall"
        : "balanced";
}


function handleRelicAssetError(image) {
  if (!image) {
    return;
  }

  image.hidden =
    true;
}


function getRelicById(id) {
  return (
    RELICS.find(
      relic =>
        relic.id === id
    )
    || null
  );
}


function getRelicStats(state) {
  const normalHistory =
    state.history.filter(
      item =>
        item.questId !== "boss"
    );

  const strengthQuests =
    normalHistory.filter(
      item =>
        item.xpType === "strength"
    ).length;

  const enduranceQuests =
    normalHistory.filter(
      item =>
        item.xpType === "endurance"
    ).length;

  const restorationQuests =
    normalHistory.filter(
      item =>
        item.xpType === "restoration"
    ).length;

  const rogueQuests =
    normalHistory.filter(
      item =>
        item.questId === "rogue"
    ).length;

  const rangerQuests =
    normalHistory.filter(
      item =>
        item.questId === "ranger"
    ).length;

  const uniqueCoreQuests =
    new Set(
      normalHistory
        .map(
          item =>
            item.questId
        )
        .filter(
          questId =>
            QUESTS.some(
              quest =>
                quest.id === questId
            )
        )
    ).size;

  const bossesDefeated =
    state.history.filter(
      item =>
        item.questId === "boss"
    ).length;

  const strengthLevel =
    getLevelData(
      state.xp.strength
    ).level;

  const enduranceLevel =
    getLevelData(
      state.xp.endurance
    ).level;

  const restorationLevel =
    getLevelData(
      state.xp.restoration
    ).level;

  const levels = [
    strengthLevel,
    enduranceLevel,
    restorationLevel
  ];

  return {
    totalQuests:
      normalHistory.length,

    strengthQuests,
    enduranceQuests,
    restorationQuests,
    rogueQuests,
    rangerQuests,
    uniqueCoreQuests,
    bossesDefeated,
    strengthLevel,
    enduranceLevel,
    restorationLevel,

    minimumStatLevel:
      Math.min(...levels),

    maximumStatLevel:
      Math.max(...levels),

    hasConqueredWeek:
      Boolean(
        state.weekConqueredRewardWeek
      )
  };
}


function discoverEligibleRelics(state) {
  const discovered =
    new Set(
      state.discoveredRelics
      || []
    );

  const stats =
    getRelicStats(state);

  const newlyDiscovered =
    [];

  for (
    const relic
    of RELICS
  ) {
    if (
      relic.manual
      || discovered.has(
        relic.id
      )
      || typeof relic.condition
        !== "function"
      || !relic.condition(
        stats
      )
    ) {
      continue;
    }

    discovered.add(
      relic.id
    );

    newlyDiscovered.push(
      relic.id
    );

    state.relicDiscoveryDates[
      relic.id
    ] =
      state.relicDiscoveryDates[
        relic.id
      ]
      || new Date()
        .toISOString();
  }

  if (
    newlyDiscovered.length
    > 0
  ) {
    state.discoveredRelics =
      Array.from(
        discovered
      );

    saveState(state);
  }

  return newlyDiscovered;
}


function unlockRelicById(
  relicId,
  { reveal = true } = {}
) {
  const relic =
    getRelicById(
      relicId
    );

  if (!relic) {
    return false;
  }

  const state =
    getState();

  const discovered =
    new Set(
      state.discoveredRelics
      || []
    );

  if (
    discovered.has(
      relicId
    )
  ) {
    return false;
  }

  discovered.add(
    relicId
  );

  state.discoveredRelics =
    Array.from(
      discovered
    );

  state.relicDiscoveryDates[
    relicId
  ] =
    new Date()
      .toISOString();

  saveState(state);

  renderRelicCollection(
    state
  );

  if (reveal) {
    queueRelicReveals(
      [relicId]
    );
  }

  return true;
}


function renderRelicCollection(state) {
  const grid =
    $("#relicGrid");

  const count =
    $("#relicCollectionCount");

  if (
    !grid
    || !count
  ) {
    return;
  }

  const discovered =
    new Set(
      state.discoveredRelics
      || []
    );

  count.textContent =
    `${discovered.size} / ${RELICS.length} discovered`;

  const visibleRelics =
    RELICS.filter(
      relic =>
        activeRelicFilter
          === "all"
        || relic.rarity
          === activeRelicFilter
    );

  grid.innerHTML =
    visibleRelics
      .map(
        relic => {
          const unlocked =
            discovered.has(
              relic.id
            );

          const rarityBadge =
            RELIC_RARITY_BADGES[
              relic.rarity
            ];

          const sourceBadge =
            RELIC_SOURCE_BADGES[
              relic.source
            ];

          return `
            <button
              class="relic-card ${
                unlocked
                  ? "is-discovered"
                  : "is-locked"
              }"
              type="button"
              data-relic-id="${escapeHtml(
                relic.id
              )}"
              aria-label="${
                unlocked
                  ? escapeHtml(
                      relic.name
                    )
                  : "Undiscovered relic"
              }"
              ${
                unlocked
                  ? ""
                  : "disabled"
              }
            >
              <span
                class="relic-art-shell"
              >
                <img
                  class="relic-card-image"
                  src="${escapeHtml(
                    relic.image
                  )}"
                  alt="${
                    unlocked
                      ? escapeHtml(
                          relic.name
                        )
                      : ""
                  }"
                  loading="lazy"
                  onload="applyRelicImageSizing(this)"
                  onerror="handleRelicAssetError(this)"
                >

                ${
                  unlocked
                    ? `
                      <span
                        class="relic-card-badges"
                        aria-hidden="true"
                      >
                        <img
                          src="${rarityBadge}"
                          alt=""
                          onerror="handleRelicAssetError(this)"
                        >

                        <img
                          src="${sourceBadge}"
                          alt=""
                          onerror="handleRelicAssetError(this)"
                        >
                      </span>
                    `
                    : `
                      <span
                        class="relic-lock-overlay"
                        aria-hidden="true"
                      >
                        <strong>?</strong>
                        <span>
                          Undiscovered
                        </span>
                      </span>
                    `
                }
              </span>
            </button>
          `;
        }
      )
      .join("");
}


function setRelicFilter(filter) {
  const allowed = [
    "all",
    "common",
    "uncommon",
    "rare",
    "epic",
    "legendary",
    "mythic"
  ];

  activeRelicFilter =
    allowed.includes(
      filter
    )
      ? filter
      : "all";

  $$(".relic-filter")
    .forEach(
      button => {
        button.classList.toggle(
          "active",
          button.dataset
            .relicFilter
            === activeRelicFilter
        );
      }
    );

  renderRelicCollection(
    getState()
  );
}


function openRelicDialog(
  relicId,
  { reveal = false } = {}
) {
  const relic =
    getRelicById(
      relicId
    );

  const state =
    getState();

  if (
    !relic
    || !(
      state.discoveredRelics
      || []
    ).includes(
      relicId
    )
  ) {
    return;
  }

  currentRelicRevealMode =
    reveal;

  $("#relicDialogEyebrow")
    .textContent =
      reveal
        ? "Relic Discovered"
        : "Relic";

  $("#relicDialogTitle")
    .textContent =
      relic.name;

  $("#relicDialogImage")
    .src =
      relic.image;

  $("#relicDialogImage")
    .alt =
      `${relic.name}. ${relic.flavor}`;

  $("#relicDialogImage")
    .onload =
      event =>
        applyRelicImageSizing(
          event.currentTarget
        );

  $("#relicDialogImage")
    .onerror =
      event =>
        handleRelicAssetError(
          event.currentTarget
        );

  $("#relicDialogRarityBadge")
    .src =
      RELIC_RARITY_BADGES[
        relic.rarity
      ];

  $("#relicDialogRarityBadge")
    .alt =
      `${capitalize(
        relic.rarity
      )} rarity`;

  $("#relicDialogRarityText")
    .textContent =
      capitalize(
        relic.rarity
      );

  $("#relicDialogSourceBadge")
    .src =
      RELIC_SOURCE_BADGES[
        relic.source
      ];

  $("#relicDialogSourceBadge")
    .alt =
      RELIC_SOURCE_LABELS[
        relic.source
      ];

  $("#relicDialogSourceText")
    .textContent =
      RELIC_SOURCE_LABELS[
        relic.source
      ];

  const discoveredAt =
    state
      .relicDiscoveryDates
      ?.[relicId];

  $("#relicDiscoveredDate")
    .textContent =
      discoveredAt
        ? `Discovered ${
            new Date(
              discoveredAt
            )
              .toLocaleDateString(
                undefined,
                {
                  month:
                    "long",
                  day:
                    "numeric",
                  year:
                    "numeric"
                }
              )
          }`
        : "Discovered relic";

  $("#relicContinueButton")
    .textContent =
      reveal
        ? "Claim Relic"
        : "Close";

  const dialog =
    $("#relicDialog");

  if (
    dialog
    && !dialog.open
  ) {
    dialog.showModal();
  }
}


function closeRelicDialog() {
  const dialog =
    $("#relicDialog");

  const wasReveal =
    currentRelicRevealMode;

  if (dialog?.open) {
    dialog.close();
  }

  currentRelicRevealMode =
    false;

  if (wasReveal) {
    setTimeout(
      showNextRelicReveal,
      180
    );
  }
}


function queueRelicReveals(
  relicIds,
  { defer = false } = {}
) {
  for (
    const relicId
    of relicIds || []
  ) {
    if (
      getRelicById(
        relicId
      )
      && !relicRevealQueue
        .includes(
          relicId
        )
    ) {
      relicRevealQueue.push(
        relicId
      );
    }
  }

  if (!defer) {
    showNextRelicReveal();
  }
}


function showNextRelicReveal() {
  if (
    $("#relicDialog")?.open
    || $("#weekConqueredDialog")
      ?.open
    || $("#bossDefeatedDialog")
      ?.open
    || relicRevealQueue.length
      === 0
  ) {
    return;
  }

  const relicId =
    relicRevealQueue
      .shift();

  openRelicDialog(
    relicId,
    {
      reveal: true
    }
  );
}


// =========================================================
// 19. MAIN RENDER
// =========================================================

function render() {
  const state =
    normalizeWeek();

  const settings =
    getSettings();

  renderProfile(
    settings
  );

  renderWeeklyProgress(
    state,
    settings
  );

  renderBossBattle(
    state,
    settings
  );

  renderQuestCards();

  renderCharacterStats(
    state
  );

  renderCharacterSummary(
    state,
    settings
  );

  renderRelicCollection(
    state
  );

  renderSettings(
    settings
  );

  /*
    renderParty is async. It is safe to trigger
    without blocking the local UI render.
  */
  void renderParty();

  applyMotionSetting(
    settings
  );

  bindQuestCards();
}


// =========================================================
// 20. PROFILE DISPLAY
// =========================================================

function renderProfile(settings) {
  const character =
    getCharacterConfig();

  const name =
    settings.playerName
    || character.defaultName;

  $("#profileName")
    .textContent =
      name;

  $("#profileAvatar")
    .textContent =
      name
        .charAt(0)
        .toUpperCase();
}


// =========================================================
// 21. WEEKLY PROGRESS
// =========================================================

function renderWeeklyProgress(
  state,
  settings
) {
  const goal =
    Number(
      settings.weeklyGoal
    )
    || DEFAULT_WEEKLY_GOAL;

  const completed =
    state.weeklyCompleted
      .length;

  const percent =
    Math.min(
      100,
      (
        completed
        / goal
      )
      * 100
    );

  $("#weeklyObjectiveTitle")
    .textContent =
      `Complete ${goal} Quests`;

  $("#weeklyProgressLabel")
    .textContent =
      `${completed} / ${goal}`;

  $("#weeklyProgressBar")
    .style.width =
      `${percent}%`;

  if (
    completed >= goal
  ) {
    $("#weekStatus")
      .textContent =
        "Week conquered.";
  }

  else if (
    completed
      === goal - 1
    && goal > 1
  ) {
    $("#weekStatus")
      .textContent =
        "One quest remains.";
  }

  else if (
    completed > 0
  ) {
    $("#weekStatus")
      .textContent =
        "The campaign has begun.";
  }

  else {
    $("#weekStatus")
      .textContent =
        "The board is open.";
  }
}


// =========================================================
// 22. BOSS BATTLE
// =========================================================

function renderBossBattle(
  state,
  settings
) {
  const goal =
    Number(
      settings.weeklyGoal
    )
    || DEFAULT_WEEKLY_GOAL;

  const weekKey =
    getWeekKey();

  const weekConquered =
    state.weeklyCompleted
      .length
    >= goal;

  const bossDefeated =
    state.bossDefeatedWeek
    === weekKey;

  const bossButton =
    $("#bossButton");

  bossButton.disabled =
    !weekConquered
    || bossDefeated;

  if (bossDefeated) {
    $("#bossLockText")
      .textContent =
        "Defeated this week.";
  }

  else if (
    weekConquered
  ) {
    $("#bossLockText")
      .textContent =
        "Unlocked. Face the boss.";
  }

  else {
    $("#bossLockText")
      .textContent =
        `Unlock by completing ${goal} quests.`;
  }
}


// =========================================================
// 23. QUEST CARDS
// =========================================================

function renderQuestCards() {
  $("#questGrid")
    .innerHTML =
      QUESTS
        .map(
          quest => `
            <article
              class="quest-card"
              data-quest-id="${quest.id}"
              tabindex="0"
              role="button"
            >

              <div
                class="quest-card-content"
              >

                <p
                  class="quest-type"
                >
                  ${escapeHtml(
                    quest.category
                  )}
                </p>

                <h3>
                  ${escapeHtml(
                    quest.title
                  )}
                </h3>

                <p>
                  ${escapeHtml(
                    quest.description
                  )}
                </p>

              </div>


              <div
                class="quest-card-meta"
              >

                <span
                  class="quest-duration"
                >
                  ${escapeHtml(
                    quest.time
                  )}
                </span>


                <span
                  class="quest-gold-reward"
                >

                  <img
                    src="icons/gold-icon.webp"
                    alt=""
                    aria-hidden="true"
                  >

                  ${quest.gold}

                </span>


                <span
                  class="quest-arrow"
                  aria-hidden="true"
                >
                  >
                </span>

              </div>

            </article>
          `
        )
        .join("");
}


// =========================================================
// 24. QUEST CARD BINDINGS
// =========================================================

function bindQuestCards() {
  $$("[data-quest-id]")
    .forEach(
      element => {
        element.onclick =
          () => {
            if (
              element.disabled
            ) {
              return;
            }

            openQuest(
              element.dataset
                .questId
            );
          };

        if (
          element.classList
            .contains(
              "quest-card"
            )
        ) {
          element.onkeydown =
            event => {
              if (
                event.key
                  === "Enter"
                || event.key
                  === " "
              ) {
                event.preventDefault();

                openQuest(
                  element.dataset
                    .questId
                );
              }
            };
        }
      }
    );
}


// =========================================================
// 25. CHARACTER STATS
// =========================================================

function renderCharacterStats(
  state
) {
  renderStat(
    "strength",
    state.xp.strength
  );

  renderStat(
    "endurance",
    state.xp.endurance
  );

  renderStat(
    "restoration",
    state.xp.restoration
  );
}


function renderStat(
  type,
  xp
) {
  const {
    level,
    progress
  } =
    getLevelData(xp);

  $(`#${type}Level`)
    .textContent =
      `Lv. ${level}`;

  $(`#${type}Xp`)
    .textContent =
      `${xp} XP`;

  $(`#${type}Bar`)
    .style.width =
      `${progress}%`;
}


// =========================================================
// 26. CHARACTER SUMMARY
// =========================================================

function renderCharacterSummary(
  state,
  settings
) {
  const character =
    getCharacterConfig();

  const displayName =
    settings.playerName
    || character.defaultName;

  const totalXp =
    state.xp.strength
    + state.xp.endurance
    + state.xp.restoration;

  $("#characterProfileName")
    .textContent =
      displayName;

  $("#characterClassName")
    .textContent =
      character.className;

  $("#characterCardImage")
    .src =
      character.card;

  $("#characterCardImage")
    .alt =
      `${displayName} - ${character.className}`;

  $("#characterGold")
    .textContent =
      state.gold;

  $("#characterCrystals")
    .textContent =
      state.crystals;

  $("#characterWeeklyQuests")
    .textContent =
      state.weeklyCompleted
        .length;

  $("#characterTotalQuests")
    .textContent =
      state.history.length;

  $("#characterTotalXp")
    .textContent =
      totalXp;

  document.body
    .dataset
    .characterTheme =
      character.theme;

  document.body
    .dataset
    .profileId =
      activeProfileId;
}


// =========================================================
// 27. OPEN QUEST
// =========================================================

function openQuest(id) {
  const quest =
    findQuest(id);

  if (!quest) {
    return;
  }

  if (
    id === "boss"
  ) {
    const state =
      normalizeWeek();

    const settings =
      getSettings();

    const goal =
      Number(
        settings.weeklyGoal
      )
      || DEFAULT_WEEKLY_GOAL;

    const weekKey =
      getWeekKey();

    if (
      state.weeklyCompleted
        .length
      < goal
    ) {
      return;
    }

    if (
      state.bossDefeatedWeek
      === weekKey
    ) {
      return;
    }
  }

  activeQuest =
    quest;

  restoreTimerForQuest(
    quest.id
  );

  $("#dialogCategory")
    .textContent =
      quest.category;

  $("#dialogTitle")
    .textContent =
      quest.title;

  $("#dialogDescription")
    .textContent =
      quest.description;

  $("#dialogTime")
    .textContent =
      quest.time;

  if (
    quest.id === "boss"
  ) {
    $("#dialogReward")
      .innerHTML =
        `
          +${BOSS_STRENGTH_XP} Strength XP
          |
          +${BOSS_ENDURANCE_XP} Endurance XP
          |
          <img
            class="currency-icon-small"
            src="icons/gold-icon.webp"
            alt=""
            aria-hidden="true"
          >
          ${BOSS_GOLD}
          |
          <img
            class="currency-icon-small"
            src="icons/crystal-icon.webp"
            alt=""
            aria-hidden="true"
          >
          ${BOSS_CRYSTALS}
        `;
  }

  else {
    $("#dialogReward")
      .innerHTML =
        `
          +${quest.xp}
          ${capitalize(
            quest.xpType
          )}
          XP
          |
          <img
            class="currency-icon-small"
            src="icons/gold-icon.webp"
            alt=""
            aria-hidden="true"
          >
          ${quest.gold}
        `;
  }

  renderExerciseList(
    quest
  );

  $("#questDialog")
    .showModal();
}
// =========================================================
// 28. QUEST EXERCISE LIST
// =========================================================

function renderExerciseList(quest) {
  const list =
    $("#dialogExercises");

  list.innerHTML =
    quest.exercises
      .map(
        exercise => `
          <li>
            ${escapeHtml(
              exercise
            )}
          </li>
        `
      )
      .join("");
}


// =========================================================
// 29. CLOSE QUEST
// =========================================================

function closeQuest() {
  const dialog =
    $("#questDialog");

  if (dialog?.open) {
    dialog.close();
  }

  activeQuest =
    null;

  stopTimerDisplayLoop();

  timerDisplayMs =
    0;

  renderTimerDisplay(
    0
  );
}


// =========================================================
// 30. QUEST COMPLETION
// =========================================================

async function completeQuest() {
  if (!activeQuest) {
    return;
  }

  const completedQuest =
    activeQuest;

  if (
    completedQuest.id
    === "boss"
  ) {
    await completeBossBattle();

    return;
  }

  const state =
    normalizeWeek();

  const settings =
    getSettings();

  const weekKey =
    getWeekKey();

  const goal =
    Number(
      settings.weeklyGoal
    )
    || DEFAULT_WEEKLY_GOAL;

  const completedAt =
    new Date()
      .toISOString();

  const earnedXp =
    Number(
      completedQuest.xp
    )
    || 0;

  const earnedGold =
    Number(
      completedQuest.gold
    )
    || 0;

  const xpType =
    completedQuest.xpType;

  const previousWeeklyCount =
    state.weeklyCompleted
      .length;

  state.xp[xpType] =
    (
      Number(
        state.xp[xpType]
      )
      || 0
    )
    + earnedXp;

  state.gold =
    (
      Number(
        state.gold
      )
      || 0
    )
    + earnedGold;

  state.weeklyCompleted.push(
    {
      questId:
        completedQuest.id,

      completedAt
    }
  );

  state.history.push(
    {
      questId:
        completedQuest.id,

      title:
        completedQuest.title,

      xpType,

      xp:
        earnedXp,

      gold:
        earnedGold,

      completedAt,

      weekKey
    }
  );

  const conqueredWeekNow =
    previousWeeklyCount
      < goal
    && state.weeklyCompleted
      .length
      >= goal
    && state
      .weekConqueredRewardWeek
      !== weekKey;

  if (conqueredWeekNow) {
    state.gold +=
      WEEK_CONQUERED_GOLD;

    state
      .weekConqueredRewardWeek =
      weekKey;
  }

  saveState(state);

  const newlyDiscoveredRelics =
    discoverEligibleRelics(
      state
    );

  clearTimerForQuest(
    completedQuest.id
  );

  activeQuest =
    null;

  closeQuest();

  render();

  let partySynced =
    false;

  if (
    supabaseReady
    && supabaseUser
    && currentParty
  ) {
    partySynced =
      await syncQuestActivityToParty(
        completedQuest,
        completedAt
      );

    await renderParty();
  }

  if (conqueredWeekNow) {
    queueRelicReveals(
      newlyDiscoveredRelics,
      {
        defer: true
      }
    );

    openWeekConquered();

    return;
  }

  if (
    supabaseReady
    && currentParty
    && !partySynced
  ) {
    showToast(
      `Quest Complete | +${earnedXp} XP | +${earnedGold} Gold | Party sync failed`
    );
  }

  else {
    showToast(
      `Quest Complete | +${earnedXp} XP | +${earnedGold} Gold`
    );
  }

  queueRelicReveals(
    newlyDiscoveredRelics
  );
}


// =========================================================
// 31. WEEK CONQUERED
// =========================================================

function openWeekConquered() {
  const dialog =
    $("#weekConqueredDialog");

  if (
    dialog
    && !dialog.open
  ) {
    dialog.showModal();
  }
}


function closeWeekConquered() {
  const dialog =
    $("#weekConqueredDialog");

  if (dialog?.open) {
    dialog.close();
  }

  showNextRelicReveal();
}


// =========================================================
// 32. BOSS COMPLETION
// =========================================================

async function completeBossBattle() {
  const state =
    normalizeWeek();

  const settings =
    getSettings();

  const weekKey =
    getWeekKey();

  const goal =
    Number(
      settings.weeklyGoal
    )
    || DEFAULT_WEEKLY_GOAL;

  if (
    state.weeklyCompleted
      .length
    < goal
  ) {
    return;
  }

  if (
    state.bossDefeatedWeek
    === weekKey
  ) {
    closeQuest();

    showToast(
      "The Boss has already been defeated this week."
    );

    return;
  }

  state.bossDefeatedWeek =
    weekKey;

  saveState(state);

  clearTimerForQuest(
    "boss"
  );

  activeQuest =
    null;

  closeQuest();

  render();

  openBossDefeated();
}


// =========================================================
// 33. BOSS DEFEATED DIALOG
// =========================================================

function openBossDefeated() {
  const dialog =
    $("#bossDefeatedDialog");

  if (
    dialog
    && !dialog.open
  ) {
    dialog.showModal();
  }
}


async function claimBossRewards() {
  const state =
    normalizeWeek();

  const weekKey =
    getWeekKey();

  if (
    state.bossDefeatedWeek
    !== weekKey
  ) {
    closeBossDefeated();

    return;
  }

  if (
    state.bossRewardsClaimedWeek
    === weekKey
  ) {
    closeBossDefeated();

    showToast(
      "Boss rewards already claimed."
    );

    return;
  }

  const completedAt =
    new Date()
      .toISOString();

  state.xp.strength +=
    BOSS_STRENGTH_XP;

  state.xp.endurance +=
    BOSS_ENDURANCE_XP;

  state.gold +=
    BOSS_GOLD;

  state.crystals +=
    BOSS_CRYSTALS;

  state.bossRewardsClaimedWeek =
    weekKey;

  state.history.push(
    {
      questId:
        "boss",

      title:
        "Boss Battle",

      xpType:
        "boss",

      xp:
        BOSS_STRENGTH_XP
        + BOSS_ENDURANCE_XP,

      gold:
        BOSS_GOLD,

      crystals:
        BOSS_CRYSTALS,

      completedAt,

      weekKey
    }
  );

  saveState(state);

  const newlyDiscoveredRelics =
    discoverEligibleRelics(
      state
    );

  let partySynced =
    false;

  if (
    supabaseReady
    && supabaseUser
    && currentParty
  ) {
    partySynced =
      await syncBossActivityToParty(
        completedAt
      );

    if (partySynced) {
      await ensureWeeklyBossTreasureDrop(
        true
      );
    }
  }

  closeBossDefeated();

  render();

  if (currentParty) {
    await renderParty();
  }

  if (
    supabaseReady
    && currentParty
    && !partySynced
  ) {
    showToast(
      `Boss Rewards Claimed | +100 XP | +${BOSS_GOLD} Gold | +${BOSS_CRYSTALS} Crystals | Party sync failed`
    );
  }

  else {
    showToast(
      `Boss Rewards Claimed | +100 XP | +${BOSS_GOLD} Gold | +${BOSS_CRYSTALS} Crystals`
    );
  }

  queueRelicReveals(
    newlyDiscoveredRelics
  );
}


function closeBossDefeated() {
  const dialog =
    $("#bossDefeatedDialog");

  if (dialog?.open) {
    dialog.close();
  }

  showNextRelicReveal();
}


// =========================================================
// 34. TIMER STORAGE
// =========================================================

function getTimerStorageKey(
  questId
) {
  return (
    `questBoardTimer-`
    + `${getLegacyProfileName()}-`
    + questId
  );
}


function createFreshTimerState(
  questId
) {
  return {
    questId,

    startedAt:
      null,

    durationMs:
      0,

    paused:
      true,

    pausedAt:
      null,

    accumulatedPauseMs:
      0
  };
}


function getStoredTimerState(
  questId
) {
  const saved =
    localStorage.getItem(
      getTimerStorageKey(
        questId
      )
    );

  if (!saved) {
    return (
      createFreshTimerState(
        questId
      )
    );
  }

  try {
    return {
      ...createFreshTimerState(
        questId
      ),

      ...JSON.parse(saved)
    };
  }

  catch (error) {
    console.error(
      "Could not read timer state.",
      error
    );

    return (
      createFreshTimerState(
        questId
      )
    );
  }
}


function saveTimerState(
  timerState
) {
  if (
    !timerState?.questId
  ) {
    return;
  }

  localStorage.setItem(
    getTimerStorageKey(
      timerState.questId
    ),
    JSON.stringify(
      timerState
    )
  );
}


function clearTimerForQuest(
  questId
) {
  localStorage.removeItem(
    getTimerStorageKey(
      questId
    )
  );
}


// =========================================================
// 35. TIMER CALCULATION
// =========================================================

function getElapsedTimerMs(
  timerState,
  now = Date.now()
) {
  if (
    !timerState
    || !timerState.startedAt
  ) {
    return (
      Number(
        timerState
          ?.durationMs
      )
      || 0
    );
  }

  const startedAt =
    Number(
      timerState.startedAt
    );

  const accumulatedPauseMs =
    Number(
      timerState
        .accumulatedPauseMs
    )
    || 0;

  const baseDurationMs =
    Number(
      timerState.durationMs
    )
    || 0;

  if (
    timerState.paused
  ) {
    const pausedAt =
      Number(
        timerState.pausedAt
      )
      || now;

    return Math.max(
      0,
      baseDurationMs
      + pausedAt
      - startedAt
      - accumulatedPauseMs
    );
  }

  return Math.max(
    0,
    baseDurationMs
    + now
    - startedAt
    - accumulatedPauseMs
  );
}


// =========================================================
// 36. TIMER RESTORE
// =========================================================

function restoreTimerForQuest(
  questId
) {
  stopTimerDisplayLoop();

  const timerState =
    getStoredTimerState(
      questId
    );

  timerDisplayMs =
    getElapsedTimerMs(
      timerState
    );

  renderTimerDisplay(
    timerDisplayMs
  );

  updateTimerButtons(
    timerState
  );

  if (
    timerState.startedAt
    && !timerState.paused
  ) {
    startTimerDisplayLoop();
  }
}


// =========================================================
// 37. TIMER START
// =========================================================

function startTimer() {
  if (!activeQuest) {
    return;
  }

  const questId =
    activeQuest.id;

  const timerState =
    getStoredTimerState(
      questId
    );

  const now =
    Date.now();

  if (
    !timerState.startedAt
  ) {
    timerState.startedAt =
      now;

    timerState.durationMs =
      0;

    timerState.paused =
      false;

    timerState.pausedAt =
      null;

    timerState
      .accumulatedPauseMs =
      0;
  }

  else if (
    timerState.paused
  ) {
    if (
      timerState.pausedAt
    ) {
      timerState
        .accumulatedPauseMs +=
        now
        - Number(
          timerState.pausedAt
        );
    }

    timerState.paused =
      false;

    timerState.pausedAt =
      null;
  }

  saveTimerState(
    timerState
  );

  timerDisplayMs =
    getElapsedTimerMs(
      timerState
    );

  renderTimerDisplay(
    timerDisplayMs
  );

  updateTimerButtons(
    timerState
  );

  startTimerDisplayLoop();
}


// =========================================================
// 38. TIMER PAUSE
// =========================================================

function pauseTimer() {
  if (!activeQuest) {
    return;
  }

  const timerState =
    getStoredTimerState(
      activeQuest.id
    );

  if (
    !timerState.startedAt
    || timerState.paused
  ) {
    return;
  }

  timerState.paused =
    true;

  timerState.pausedAt =
    Date.now();

  saveTimerState(
    timerState
  );

  timerDisplayMs =
    getElapsedTimerMs(
      timerState
    );

  renderTimerDisplay(
    timerDisplayMs
  );

  updateTimerButtons(
    timerState
  );

  stopTimerDisplayLoop();
}


// =========================================================
// 39. TIMER RESET
// =========================================================

function resetTimer() {
  if (!activeQuest) {
    return;
  }

  clearTimerForQuest(
    activeQuest.id
  );

  timerDisplayMs =
    0;

  stopTimerDisplayLoop();

  renderTimerDisplay(
    0
  );

  updateTimerButtons(
    createFreshTimerState(
      activeQuest.id
    )
  );
}


// =========================================================
// 40. TIMER DISPLAY LOOP
// =========================================================

function startTimerDisplayLoop() {
  stopTimerDisplayLoop();

  timerInterval =
    setInterval(
      () => {
        if (!activeQuest) {
          stopTimerDisplayLoop();

          return;
        }

        const timerState =
          getStoredTimerState(
            activeQuest.id
          );

        timerDisplayMs =
          getElapsedTimerMs(
            timerState
          );

        renderTimerDisplay(
          timerDisplayMs
        );
      },
      250
    );
}


function stopTimerDisplayLoop() {
  if (timerInterval) {
    clearInterval(
      timerInterval
    );

    timerInterval =
      null;
  }
}


// =========================================================
// 41. TIMER DISPLAY
// =========================================================

function renderTimerDisplay(
  milliseconds
) {
  const totalSeconds =
    Math.floor(
      (
        Number(
          milliseconds
        )
        || 0
      )
      / 1000
    );

  const hours =
    Math.floor(
      totalSeconds / 3600
    );

  const minutes =
    Math.floor(
      (
        totalSeconds % 3600
      )
      / 60
    );

  const seconds =
    totalSeconds % 60;

  const parts = [];

  if (hours > 0) {
    parts.push(
      String(hours)
        .padStart(
          2,
          "0"
        )
    );
  }

  parts.push(
    String(minutes)
      .padStart(
        2,
        "0"
      )
  );

  parts.push(
    String(seconds)
      .padStart(
        2,
        "0"
      )
  );

  const display =
    $("#questTimerDisplay");

  if (display) {
    display.textContent =
      parts.join(":");
  }
}


function updateTimerButtons(
  timerState
) {
  const startButton =
    $("#startTimerButton");

  const pauseButton =
    $("#pauseTimerButton");

  const resetButton =
    $("#resetTimerButton");

  if (
    !startButton
    || !pauseButton
    || !resetButton
  ) {
    return;
  }

  const running =
    Boolean(
      timerState.startedAt
      && !timerState.paused
    );

  const hasStarted =
    Boolean(
      timerState.startedAt
    );

  startButton.disabled =
    running;

  pauseButton.disabled =
    !running;

  resetButton.disabled =
    !hasStarted;

  startButton.textContent =
    hasStarted
      && timerState.paused
        ? "Resume"
        : "Start";
}


// =========================================================
// 42. VISIBILITY TIMER SYNC
// =========================================================

function syncVisibleTimer() {
  if (!activeQuest) {
    return;
  }

  const timerState =
    getStoredTimerState(
      activeQuest.id
    );

  timerDisplayMs =
    getElapsedTimerMs(
      timerState
    );

  renderTimerDisplay(
    timerDisplayMs
  );

  updateTimerButtons(
    timerState
  );

  if (
    timerState.startedAt
    && !timerState.paused
  ) {
    startTimerDisplayLoop();
  }

  else {
    stopTimerDisplayLoop();
  }
}


// =========================================================
// 43. VIEW NAVIGATION
// =========================================================

function setActiveView(
  viewName
) {
  const allowedViews = [
    "board",
    "character",
    "party",
    "settings"
  ];

  if (
    !allowedViews.includes(
      viewName
    )
  ) {
    viewName =
      "board";
  }

  activeView =
    viewName;

  localStorage.setItem(
    "questBoardActiveView",
    activeView
  );

  $$("[data-app-view]")
    .forEach(
      view => {
        view.hidden =
          view.dataset.appView
          !== activeView;
      }
    );

  $$("[data-nav-view]")
    .forEach(
      button => {
        const selected =
          button.dataset.navView
          === activeView;

        button.classList.toggle(
          "active",
          selected
        );

        button.setAttribute(
          "aria-current",
          selected
            ? "page"
            : "false"
        );
      }
    );

  if (
    activeView === "party"
  ) {
    void renderParty();
  }

  window.scrollTo(
    {
      top: 0,
      behavior: "smooth"
    }
  );
}


// =========================================================
// 44. SETTINGS RENDER
// =========================================================

function renderSettings(
  settings
) {
  const playerNameInput =
    $("#playerNameInput");

  const weeklyGoalSelect =
    $("#weeklyGoalSelect");

  const reducedMotionToggle =
    $("#reducedMotionToggle");

  const soundToggle =
    $("#soundEffectsToggle");

  if (playerNameInput) {
    playerNameInput.value =
      settings.playerName
      || "";
  }

  if (weeklyGoalSelect) {
    weeklyGoalSelect.value =
      String(
        settings.weeklyGoal
        || DEFAULT_WEEKLY_GOAL
      );
  }

  if (
    reducedMotionToggle
  ) {
    reducedMotionToggle.checked =
      Boolean(
        settings.reducedMotion
      );
  }

  if (soundToggle) {
    soundToggle.checked =
      Boolean(
        settings.soundEnabled
      );
  }

  const currentProfileLabel =
    $("#currentProfileLabel");

  if (
    currentProfileLabel
  ) {
    currentProfileLabel
      .textContent =
        `${getCharacterConfig().defaultName} | ${getCharacterConfig().className}`;
  }

  const partyCode =
    $("#settingsPartyCode");

  if (partyCode) {
    partyCode.textContent =
      currentParty
        ?.invite_code
      || "No fellowship";
  }
}


// =========================================================
// 45. SAVE PLAYER NAME
// =========================================================

async function savePlayerName() {
  const input =
    $("#playerNameInput");

  if (!input) {
    return;
  }

  const settings =
    getSettings();

  const fallback =
    getCharacterConfig()
      .defaultName;

  settings.playerName =
    input.value
      .trim()
    || fallback;

  saveSettings(
    settings
  );

  render();

  if (supabaseReady) {
    try {
      await syncProfileToSupabase();

      if (currentParty) {
        await renderParty();
      }
    }

    catch (error) {
      console.error(
        "Could not sync updated profile name:",
        error
      );
    }
  }

  showToast(
    "Adventurer name saved."
  );
}


// =========================================================
// 46. SAVE WEEKLY GOAL
// =========================================================

function saveWeeklyGoal() {
  const select =
    $("#weeklyGoalSelect");

  if (!select) {
    return;
  }

  const settings =
    getSettings();

  const newGoal =
    Number(
      select.value
    );

  settings.weeklyGoal =
    Number.isFinite(
      newGoal
    )
      ? newGoal
      : DEFAULT_WEEKLY_GOAL;

  saveSettings(
    settings
  );

  render();

  showToast(
    `Weekly goal set to ${settings.weeklyGoal} quests.`
  );
}


// =========================================================
// 47. MOTION SETTING
// =========================================================

function applyMotionSetting(
  settings
) {
  document
    .documentElement
    .classList
    .toggle(
      "reduced-motion",
      Boolean(
        settings.reducedMotion
      )
    );
}


function saveReducedMotionSetting() {
  const toggle =
    $("#reducedMotionToggle");

  if (!toggle) {
    return;
  }

  const settings =
    getSettings();

  settings.reducedMotion =
    Boolean(
      toggle.checked
    );

  saveSettings(
    settings
  );

  applyMotionSetting(
    settings
  );
}


// =========================================================
// 48. SOUND SETTING
// =========================================================

function saveSoundSetting() {
  const toggle =
    $("#soundEffectsToggle");

  if (!toggle) {
    return;
  }

  const settings =
    getSettings();

  settings.soundEnabled =
    Boolean(
      toggle.checked
    );

  saveSettings(
    settings
  );

  showToast(
    settings.soundEnabled
      ? "Sound effects enabled."
      : "Sound effects disabled."
  );
}


// =========================================================
// 49. SWITCH PROFILE
// =========================================================

function switchProfile() {
  const current =
    activeProfileId;

  const next =
    current === "farmer"
      ? "jess"
      : "farmer";

  const confirmed =
    confirm(
      `Switch from ${getCharacterConfig(current).defaultName} to ${getCharacterConfig(next).defaultName}?`
    );

  if (!confirmed) {
    return;
  }

  stopTimerDisplayLoop();

  stopPartyRefreshLoop();

  activeProfileId =
    next;

  localStorage.setItem(
    "questBoardActiveProfileId",
    activeProfileId
  );

  localStorage.setItem(
    "questBoardActiveProfile",
    getLegacyProfileName()
  );

  currentParty =
    null;

  supabaseReady =
    false;

  supabaseUser =
    null;

  partyMemberProfileCache
    .clear();

  render();

  void initializeSupabase();
}


// =========================================================
// 50. RESET THIS WEEK
// =========================================================

function resetThisWeek() {
  const confirmed =
    confirm(
      "Reset this week's quest progress? Lifetime XP, Gold, Crystals, relics, and history will remain."
    );

  if (!confirmed) {
    return;
  }

  const state =
    getState();

  state.weekKey =
    getWeekKey();

  state.weeklyCompleted =
    [];

  state.weekConqueredRewardWeek =
    null;

  state.bossDefeatedWeek =
    null;

  state.bossRewardsClaimedWeek =
    null;

  saveState(
    state
  );

  render();

  showToast(
    "Weekly campaign reset."
  );
}


// =========================================================
// 51. PARTY SYNC STATUS
// =========================================================

function setPartySyncStatus(
  message,
  state = ""
) {
  const element =
    $("#partySyncStatus");

  if (!element) {
    return;
  }

  element.textContent =
    message;

  element.dataset.state =
    state;
}


// =========================================================
// 52. PARTY CODE
// =========================================================

function createInviteCode() {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (
    let index = 0;
    index < 6;
    index += 1
  ) {
    code +=
      alphabet[
        Math.floor(
          Math.random()
          * alphabet.length
        )
      ];
  }

  return code;
}


// =========================================================
// 53. CREATE PARTY
// =========================================================

async function createParty() {
  if (
    !supabaseReady
    || !supabaseUser
  ) {
    showToast(
      "Party sync is not connected yet."
    );

    return;
  }

  if (currentParty) {
    showToast(
      "You are already in a fellowship."
    );

    return;
  }

  const settings =
    getSettings();

  const defaultName =
    `${settings.playerName || "Adventurer"}'s Fellowship`;

  const enteredName =
    prompt(
      "Name your fellowship:",
      defaultName
    );

  if (
    enteredName === null
  ) {
    return;
  }

  const partyName =
    enteredName.trim()
    || defaultName;

  try {
    let createdParty =
      null;

    let lastError =
      null;

    for (
      let attempt = 0;
      attempt < 5;
      attempt += 1
    ) {
      const inviteCode =
        createInviteCode();

      const {
        data,
        error
      } =
        await supabaseClient
          .from("parties")
          .insert(
            {
              name:
                partyName,

              invite_code:
                inviteCode,

              created_by:
                supabaseUser.id
            }
          )
          .select()
          .single();

      if (!error) {
        createdParty =
          data;

        break;
      }

      lastError =
        error;
    }

    if (!createdParty) {
      throw (
        lastError
        || new Error(
          "Could not create party."
        )
      );
    }

    const {
      error:
        memberError
    } =
      await supabaseClient
        .from("party_members")
        .insert(
          {
            party_id:
              createdParty.id,

            user_id:
              supabaseUser.id
          }
        );

    if (memberError) {
      throw memberError;
    }

    currentParty =
      createdParty;

    await renderParty();

    renderSettings(
      getSettings()
    );

    showToast(
      "Fellowship created."
    );
  }

  catch (error) {
    console.error(
      "Could not create party:",
      error
    );

    showToast(
      "The fellowship could not be created."
    );
  }
}
// =========================================================
// 54. JOIN PARTY FORM
// =========================================================

function toggleJoinPartyForm(
  forceOpen = null
) {
  const form =
    $("#joinPartyForm");

  if (!form) {
    return;
  }

  const shouldOpen =
    forceOpen === null
      ? form.hidden
      : Boolean(
          forceOpen
        );

  form.hidden =
    !shouldOpen;

  if (shouldOpen) {
    setTimeout(
      () =>
        $("#partyCodeInput")
          ?.focus(),
      0
    );
  }
}


// =========================================================
// 55. JOIN PARTY
// =========================================================

async function joinParty() {
  if (
    !supabaseReady
    || !supabaseUser
  ) {
    showToast(
      "Party sync is not connected yet."
    );

    return;
  }

  if (currentParty) {
    showToast(
      "You are already in a fellowship."
    );

    return;
  }

  const input =
    $("#partyCodeInput");

  const code =
    String(
      input?.value
      || ""
    )
      .trim()
      .toUpperCase();

  if (!code) {
    showToast(
      "Enter a fellowship invite code."
    );

    return;
  }

  try {
    const {
      data: party,
      error: partyError
    } =
      await supabaseClient
        .from("parties")
        .select("*")
        .eq(
          "invite_code",
          code
        )
        .maybeSingle();

    if (partyError) {
      throw partyError;
    }

    if (!party) {
      showToast(
        "That fellowship code was not found."
      );

      return;
    }

    const {
      error:
        memberError
    } =
      await supabaseClient
        .from("party_members")
        .insert(
          {
            party_id:
              party.id,

            user_id:
              supabaseUser.id
          }
        );

    if (memberError) {
      throw memberError;
    }

    currentParty =
      party;

    if (input) {
      input.value =
        "";
    }

    toggleJoinPartyForm(
      false
    );

    await renderParty();

    renderSettings(
      getSettings()
    );

    showToast(
      `Joined ${party.name || "the fellowship"}.`
    );
  }

  catch (error) {
    console.error(
      "Could not join party:",
      error
    );

    showToast(
      "The fellowship could not be joined."
    );
  }
}


// =========================================================
// 56. LEAVE PARTY
// =========================================================

async function leaveParty() {
  if (
    !currentParty
    || !supabaseUser
  ) {
    return;
  }

  const confirmed =
    confirm(
      "Leave this fellowship? Your personal Quest Board progress will remain."
    );

  if (!confirmed) {
    return;
  }

  try {
    const {
      error
    } =
      await supabaseClient
        .from("party_members")
        .delete()
        .eq(
          "party_id",
          currentParty.id
        )
        .eq(
          "user_id",
          supabaseUser.id
        );

    if (error) {
      throw error;
    }

    currentParty =
      null;

    giftRecipient =
      null;

    partyMemberProfileCache
      .clear();

    closeGiftDialog();
    closePartyCharacterDialog();

    await renderParty();

    renderSettings(
      getSettings()
    );

    showToast(
      "You left the fellowship."
    );
  }

  catch (error) {
    console.error(
      "Could not leave party:",
      error
    );

    showToast(
      "The fellowship could not be left."
    );
  }
}


// =========================================================
// 57. FETCH PARTY MEMBERS
// =========================================================

async function fetchPartyMembers() {
  if (!currentParty) {
    return [];
  }

  const {
    data: memberships,
    error:
      membershipError
  } =
    await supabaseClient
      .from("party_members")
      .select(
        "user_id, joined_at"
      )
      .eq(
        "party_id",
        currentParty.id
      )
      .order(
        "joined_at",
        {
          ascending: true
        }
      );

  if (membershipError) {
    throw membershipError;
  }

  const userIds =
    (
      memberships
      || []
    )
      .map(
        row =>
          row.user_id
      )
      .filter(Boolean);

  if (
    userIds.length === 0
  ) {
    return [];
  }

  const {
    data: profiles,
    error:
      profileError
  } =
    await supabaseClient
      .from("profiles")
      .select(
        "user_id, profile_id, display_name, class_name"
      )
      .in(
        "user_id",
        userIds
      );

  if (profileError) {
    throw profileError;
  }

  const profileMap =
    new Map(
      (
        profiles
        || []
      )
        .map(
          profile => [
            profile.user_id,
            profile
          ]
        )
    );

  return (
    memberships
    || []
  )
    .map(
      membership => {
        const profile =
          profileMap.get(
            membership.user_id
          );

        return {
          ...membership,
          profile:
            profile
            || null
        };
      }
    );
}


// =========================================================
// 58. FETCH PARTY ACTIVITY
// =========================================================

async function fetchPartyActivity() {
  if (!currentParty) {
    return [];
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from("party_activity")
      .select("*")
      .eq(
        "party_id",
        currentParty.id
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      )
      .limit(1000);

  if (error) {
    throw error;
  }

  return data || [];
}


// =========================================================
// 59. PARTY MEMBER PROGRESSION
// =========================================================

function getPartyMemberProgress(
  member,
  activity
) {
  const userId =
    member.user_id;

  const memberActivity =
    (
      activity
      || []
    )
      .filter(
        item =>
          item.user_id
          === userId
      );

  let strengthXp =
    0;

  let enduranceXp =
    0;

  let restorationXp =
    0;

  let totalXp =
    0;

  let totalQuests =
    0;

  let weeklyQuests =
    0;

  const currentWeek =
    getWeekKey();

  for (
    const item
    of memberActivity
  ) {
    const type =
      String(
        item.activity_type
        || item.type
        || ""
      )
        .toLowerCase();

    const xp =
      Number(
        item.xp
        ?? item.xp_amount
        ?? item.reward_xp
        ?? 0
      )
      || 0;

    const strength =
      Number(
        item.strength_xp
        ?? 0
      )
      || 0;

    const endurance =
      Number(
        item.endurance_xp
        ?? 0
      )
      || 0;

    const restoration =
      Number(
        item.restoration_xp
        ?? 0
      )
      || 0;

    if (
      strength
      || endurance
      || restoration
    ) {
      strengthXp +=
        strength;

      enduranceXp +=
        endurance;

      restorationXp +=
        restoration;

      totalXp +=
        strength
        + endurance
        + restoration;
    }

    else if (
      type.includes(
        "boss"
      )
    ) {
      strengthXp +=
        BOSS_STRENGTH_XP;

      enduranceXp +=
        BOSS_ENDURANCE_XP;

      totalXp +=
        BOSS_STRENGTH_XP
        + BOSS_ENDURANCE_XP;
    }

    else {
      const xpType =
        String(
          item.xp_type
          || item.stat_type
          || ""
        )
          .toLowerCase();

      if (
        xpType === "strength"
      ) {
        strengthXp +=
          xp;
      }

      else if (
        xpType === "endurance"
      ) {
        enduranceXp +=
          xp;
      }

      else if (
        xpType === "restoration"
      ) {
        restorationXp +=
          xp;
      }

      totalXp +=
        xp;
    }

    const isQuest =
      type.includes(
        "quest"
      )
      || type.includes(
        "boss"
      );

    if (isQuest) {
      totalQuests +=
        1;

      const activityWeek =
        item.week_key
        || (
          item.created_at
            ? getWeekKey(
                new Date(
                  item.created_at
                )
              )
            : null
        );

      if (
        activityWeek
        === currentWeek
      ) {
        weeklyQuests +=
          1;
      }
    }
  }

  /*
    For the currently signed-in adventurer,
    local progression is authoritative and
    usually contains a fuller history than
    the shared activity feed.
  */
  if (
    supabaseUser
    && userId
      === supabaseUser.id
  ) {
    const localState =
      getState();

    strengthXp =
      Number(
        localState.xp
          .strength
      )
      || 0;

    enduranceXp =
      Number(
        localState.xp
          .endurance
      )
      || 0;

    restorationXp =
      Number(
        localState.xp
          .restoration
      )
      || 0;

    totalXp =
      strengthXp
      + enduranceXp
      + restorationXp;

    totalQuests =
      localState.history
        .length;

    weeklyQuests =
      localState
        .weeklyCompleted
        .length;
  }

  return {
    strengthXp,
    enduranceXp,
    restorationXp,
    totalXp,
    totalQuests,
    weeklyQuests
  };
}


// =========================================================
// 60. RENDER PARTY
// =========================================================

async function renderParty() {
  const emptyState =
    $("#partyEmptyState");

  const dashboard =
    $("#partyDashboard");

  if (
    !emptyState
    || !dashboard
  ) {
    return;
  }

  if (
    !supabaseReady
    || !supabaseUser
  ) {
    emptyState.hidden =
      false;

    dashboard.hidden =
      true;

    return;
  }

  if (!currentParty) {
    emptyState.hidden =
      false;

    dashboard.hidden =
      true;

    setPartySyncStatus(
      "Connected. No fellowship joined.",
      "connected"
    );

    return;
  }

  emptyState.hidden =
    true;

  dashboard.hidden =
    false;

  $("#partyName")
    .textContent =
      currentParty.name
      || "The Fellowship";

  $("#partyInviteCode")
    .textContent =
      currentParty.invite_code
      || "------";

  setPartySyncStatus(
    "Fellowship synchronized.",
    "connected"
  );

  try {
    await ensureWeeklyBossTreasureDrop(
      false
    );

    const [
      members,
      activity,
      inventory,
      bonusProgress
    ] =
      await Promise.all([
        fetchPartyMembers(),
        fetchPartyActivity(),
        fetchPartyTreasureInventory(),
        fetchPartyBonusProgress()
      ]);

    renderPartyMembers(
      members,
      activity
    );

    renderPartyChallenge(
      activity,
      members.length,
      bonusProgress
    );

    renderPartyTreasure(
      inventory
    );

    renderPartyActivity(
      activity
    );
  }

  catch (error) {
    console.error(
      "Party rendering failed:",
      error
    );

    setPartySyncStatus(
      "Connected, but some fellowship data could not load.",
      "error"
    );
  }
}


// =========================================================
// 61. PARTY MEMBER CARDS
// =========================================================

function renderPartyMembers(
  members,
  activity = []
) {
  const container =
    $("#partyMembers");

  if (!container) {
    return;
  }

  partyMemberProfileCache
    .clear();

  if (
    !members.length
  ) {
    container.innerHTML =
      `<p class="muted">No fellowship members found.</p>`;

    return;
  }

  container.innerHTML =
    members
      .map(
        member => {
          const profile =
            member.profile
            || {};

          const profileId =
            normalizeProfileId(
              profile.profile_id
            )
            || (
              String(
                profile.display_name
                || ""
              )
                .trim()
                .toLowerCase()
                === "jess"
                ? "jess"
                : "farmer"
            );

          const character =
            getCharacterConfig(
              profileId
            );

          const displayName =
            profile.display_name
            || character.defaultName;

          const className =
            profile.class_name
            || character.className;

          const isSelf =
            supabaseUser
            && member.user_id
              === supabaseUser.id;

          const progress =
            getPartyMemberProgress(
              member,
              activity
            );

          partyMemberProfileCache
            .set(
              member.user_id,
              {
                userId:
                  member.user_id,

                profileId,

                displayName,

                className,

                isSelf,

                character,

                progress
              }
            );

          return `
            <article
              class="party-member-card"
              data-party-member="${escapeHtml(
                member.user_id
              )}"
            >

              <button
                class="party-member-portrait-button"
                type="button"
                data-open-party-profile="${escapeHtml(
                  member.user_id
                )}"
                aria-label="View ${escapeHtml(
                  displayName
                )}'s character profile"
              >

                <img
                  class="party-member-portrait"
                  src="${escapeHtml(
                    character.card
                  )}"
                  alt="${escapeHtml(
                    displayName
                  )}, ${escapeHtml(
                    className
                  )}"
                >

              </button>


              <div
                class="party-member-copy"
              >

                <strong>
                  ${escapeHtml(
                    displayName
                  )}
                </strong>

                <span>
                  ${escapeHtml(
                    className
                  )}
                </span>

                ${
                  isSelf
                    ? `
                      <small>
                        You
                      </small>
                    `
                    : ""
                }

              </div>


              ${
                !isSelf
                  ? `
                    <button
                      class="party-gift-button"
                      type="button"
                      data-gift-user="${escapeHtml(
                        member.user_id
                      )}"
                    >
                      Gift
                    </button>
                  `
                  : ""
              }

            </article>
          `;
        }
      )
      .join("");
}


// =========================================================
// 62. FELLOWSHIP CHARACTER PROFILE
// =========================================================

function renderPartyProfileStat(
  type,
  xp
) {
  const levelElement =
    $(
      `#partyProfile${capitalize(
        type
      )}Level`
    );

  const barElement =
    $(
      `#partyProfile${capitalize(
        type
      )}Bar`
    );

  const xpElement =
    $(
      `#partyProfile${capitalize(
        type
      )}Xp`
    );

  const {
    level,
    progress
  } =
    getLevelData(
      xp
    );

  if (levelElement) {
    levelElement.textContent =
      `Lv. ${level}`;
  }

  if (barElement) {
    barElement.style.width =
      `${progress}%`;
  }

  if (xpElement) {
    xpElement.textContent =
      `${xp} XP`;
  }
}


function openPartyCharacterDialog(
  userId
) {
  const data =
    partyMemberProfileCache
      .get(
        userId
      );

  if (!data) {
    return;
  }

  const {
    displayName,
    className,
    character,
    progress
  } =
    data;

  const dialog =
    $("#partyCharacterDialog");

  if (!dialog) {
    return;
  }

  const nameElement =
    $("#partyCharacterDialogName");

  const classElement =
    $("#partyCharacterDialogClass");

  const imageElement =
    $("#partyCharacterDialogImage");

  const descriptionElement =
    $("#partyCharacterDialogDescription");

  if (nameElement) {
    nameElement.textContent =
      displayName;
  }

  if (classElement) {
    classElement.textContent =
      className;
  }

  if (imageElement) {
    imageElement.src =
      character.card;

    imageElement.alt =
      `${displayName} - ${className}`;
  }

  if (descriptionElement) {
    descriptionElement
      .textContent =
        character.description
        || "";
  }

  renderPartyProfileStat(
    "strength",
    progress.strengthXp
  );

  renderPartyProfileStat(
    "endurance",
    progress.enduranceXp
  );

  renderPartyProfileStat(
    "restoration",
    progress.restorationXp
  );

  const weeklyElement =
    $("#partyProfileWeeklyQuests");

  const totalElement =
    $("#partyProfileTotalQuests");

  const xpElement =
    $("#partyProfileTotalXp");

  if (weeklyElement) {
    weeklyElement.textContent =
      progress.weeklyQuests;
  }

  if (totalElement) {
    totalElement.textContent =
      progress.totalQuests;
  }

  if (xpElement) {
    xpElement.textContent =
      progress.totalXp;
  }

  if (!dialog.open) {
    dialog.showModal();
  }
}


function closePartyCharacterDialog() {
  const dialog =
    $("#partyCharacterDialog");

  if (dialog?.open) {
    dialog.close();
  }
}


// =========================================================
// 63. PARTY CHALLENGE
// =========================================================

function renderPartyChallenge(
  activity,
  memberCount,
  bonusProgress = 0
) {
  const goal =
    6;

  const weekKey =
    getWeekKey();

  const questActivity =
    (
      activity
      || []
    )
      .filter(
        item => {
          const type =
            String(
              item.activity_type
              || item.type
              || ""
            )
              .toLowerCase();

          if (
            !type.includes(
              "quest"
            )
            && !type.includes(
              "boss"
            )
          ) {
            return false;
          }

          const activityWeek =
            item.week_key
            || (
              item.created_at
                ? getWeekKey(
                    new Date(
                      item.created_at
                    )
                  )
                : null
            );

          return (
            activityWeek
            === weekKey
          );
        }
      );

  const completed =
    questActivity.length
    + (
      Number(
        bonusProgress
      )
      || 0
    );

  const percent =
    Math.min(
      100,
      (
        completed
        / goal
      )
      * 100
    );

  $("#partyChallengeTitle")
    .textContent =
      `Complete ${goal} Quests`;

  $("#partyChallengeProgress")
    .textContent =
      `${Math.min(
        completed,
        goal
      )} / ${goal}`;

  $("#partyChallengeBar")
    .style.width =
      `${percent}%`;

  if (
    completed >= goal
  ) {
    $("#partyChallengeStatus")
      .textContent =
        "Fellowship challenge conquered.";

    unlockRelicById(
      "fellowship-pin",
      {
        reveal:
          appInitialized
      }
    );
  }

  else if (
    memberCount > 1
  ) {
    $("#partyChallengeStatus")
      .textContent =
        "The fellowship advances together.";
  }

  else {
    $("#partyChallengeStatus")
      .textContent =
        "The campaign awaits.";
  }
}


// =========================================================
// 64. PARTY ACTIVITY
// =========================================================

function renderPartyActivity(
  activity
) {
  const container =
    $("#partyActivityList");

  if (!container) {
    return;
  }

  if (
    !activity.length
  ) {
    container.innerHTML =
      `<p class="muted">No party activity yet.</p>`;

    return;
  }

  const visibleActivity =
    activity.slice(
      0,
      12
    );

  container.innerHTML =
    visibleActivity
      .map(
        item => {
          const actor =
            item.display_name
            || item.player_name
            || "Adventurer";

          const type =
            String(
              item.activity_type
              || item.type
              || ""
            )
              .toLowerCase();

          let text =
            item.message
            || "";

          if (!text) {
            if (
              type.includes(
                "boss"
              )
            ) {
              text =
                `${actor} defeated the weekly Boss.`;
            }

            else if (
              type.includes(
                "quest"
              )
            ) {
              text =
                `${actor} completed ${item.quest_title || item.title || "a quest"}.`;
            }

            else if (
              type.includes(
                "gift"
              )
            ) {
              text =
                `${actor} sent a fellowship gift.`;
            }

            else {
              text =
                `${actor} advanced the fellowship.`;
            }
          }

          const date =
            item.created_at
              ? new Date(
                  item.created_at
                )
              : null;

          const timeLabel =
            date
            && !Number.isNaN(
              date.getTime()
            )
              ? date.toLocaleString(
                  undefined,
                  {
                    month:
                      "short",
                    day:
                      "numeric",
                    hour:
                      "numeric",
                    minute:
                      "2-digit"
                  }
                )
              : "";

          return `
            <article
              class="party-activity-item"
            >
              <div>
                <strong>
                  ${escapeHtml(
                    text
                  )}
                </strong>

                ${
                  timeLabel
                    ? `
                      <span>
                        ${escapeHtml(
                          timeLabel
                        )}
                      </span>
                    `
                    : ""
                }
              </div>
            </article>
          `;
        }
      )
      .join("");
}


// =========================================================
// 65. REFRESH PARTY
// =========================================================

async function refreshParty() {
  if (
    !supabaseReady
    || !currentParty
  ) {
    return;
  }

  try {
    await renderParty();

    await checkIncomingGifts();
  }

  catch (error) {
    console.error(
      "Could not refresh party:",
      error
    );
  }
}


// =========================================================
// 66. PARTY REFRESH LOOP
// =========================================================

function startPartyRefreshLoop() {
  stopPartyRefreshLoop();

  partyRefreshTimer =
    setInterval(
      () => {
        if (
          document.hidden
          || !supabaseReady
          || !currentParty
        ) {
          return;
        }

        void refreshParty();
      },
      PARTY_REFRESH_INTERVAL
    );
}


function stopPartyRefreshLoop() {
  if (
    partyRefreshTimer
  ) {
    clearInterval(
      partyRefreshTimer
    );

    partyRefreshTimer =
      null;
  }
}


// =========================================================
// 67. SYNC QUEST ACTIVITY
// =========================================================

async function syncQuestActivityToParty(
  quest,
  completedAt
) {
  if (
    !supabaseReady
    || !supabaseUser
    || !currentParty
  ) {
    return false;
  }

  try {
    const settings =
      getSettings();

    const {
      error
    } =
      await supabaseClient
        .from("party_activity")
        .insert(
          {
            party_id:
              currentParty.id,

            user_id:
              supabaseUser.id,

            profile_id:
              activeProfileId,

            display_name:
              settings.playerName
              || getCharacterConfig()
                .defaultName,

            activity_type:
              "quest",

            quest_id:
              quest.id,

            quest_title:
              quest.title,

            xp_type:
              quest.xpType,

            xp:
              Number(
                quest.xp
              )
              || 0,

            gold:
              Number(
                quest.gold
              )
              || 0,

            week_key:
              getWeekKey(),

            created_at:
              completedAt
          }
        );

    if (error) {
      throw error;
    }

    return true;
  }

  catch (error) {
    console.error(
      "Quest party sync failed:",
      error
    );

    return false;
  }
}


// =========================================================
// 68. SYNC BOSS ACTIVITY
// =========================================================

async function syncBossActivityToParty(
  completedAt
) {
  if (
    !supabaseReady
    || !supabaseUser
    || !currentParty
  ) {
    return false;
  }

  try {
    const settings =
      getSettings();

    const {
      error
    } =
      await supabaseClient
        .from("party_activity")
        .insert(
          {
            party_id:
              currentParty.id,

            user_id:
              supabaseUser.id,

            profile_id:
              activeProfileId,

            display_name:
              settings.playerName
              || getCharacterConfig()
                .defaultName,

            activity_type:
              "boss",

            quest_id:
              "boss",

            quest_title:
              "Boss Battle",

            xp_type:
              "boss",

            xp:
              BOSS_STRENGTH_XP
              + BOSS_ENDURANCE_XP,

            strength_xp:
              BOSS_STRENGTH_XP,

            endurance_xp:
              BOSS_ENDURANCE_XP,

            restoration_xp:
              0,

            gold:
              BOSS_GOLD,

            crystals:
              BOSS_CRYSTALS,

            week_key:
              getWeekKey(),

            created_at:
              completedAt
          }
        );

    if (error) {
      throw error;
    }

    return true;
  }

  catch (error) {
    console.error(
      "Boss party sync failed:",
      error
    );

    return false;
  }
}


// =========================================================
// 69. OPEN GIFT DIALOG
// =========================================================

function openGiftDialog(
  userId
) {
  const member =
    partyMemberProfileCache
      .get(
        userId
      );

  if (
    !member
    || member.isSelf
  ) {
    return;
  }

  giftRecipient = {
    userId:
      member.userId,

    displayName:
      member.displayName
  };

  const recipientName =
    $("#giftRecipientName");

  if (recipientName) {
    recipientName.textContent =
      member.displayName;
  }

  const goldInput =
    $("#giftGoldInput");

  const crystalInput =
    $("#giftCrystalInput");

  if (goldInput) {
    goldInput.value =
      "0";
  }

  if (crystalInput) {
    crystalInput.value =
      "0";
  }

  const dialog =
    $("#giftDialog");

  if (
    dialog
    && !dialog.open
  ) {
    dialog.showModal();
  }
}


function closeGiftDialog() {
  const dialog =
    $("#giftDialog");

  if (dialog?.open) {
    dialog.close();
  }

  giftRecipient =
    null;
}


// =========================================================
// 70. SEND PARTY GIFT
// =========================================================

async function sendPartyGift() {
  if (
    giftSending
    || !giftRecipient
    || !currentParty
    || !supabaseUser
  ) {
    return;
  }

  const gold =
    Math.max(
      0,
      Math.floor(
        Number(
          $("#giftGoldInput")
            ?.value
        )
        || 0
      )
    );

  const crystals =
    Math.max(
      0,
      Math.floor(
        Number(
          $("#giftCrystalInput")
            ?.value
        )
        || 0
      )
    );

  if (
    gold <= 0
    && crystals <= 0
  ) {
    showToast(
      "Choose some Gold or Crystals to gift."
    );

    return;
  }

  const state =
    getState();

  if (
    gold
    > state.gold
  ) {
    showToast(
      "You do not have enough Gold."
    );

    return;
  }

  if (
    crystals
    > state.crystals
  ) {
    showToast(
      "You do not have enough Crystals."
    );

    return;
  }

  giftSending =
    true;

  const recipient =
    {
      ...giftRecipient
    };

  try {
    const {
      data,
      error
    } =
      await supabaseClient
        .rpc(
          "send_party_gift",
          {
            supplied_party_id:
              currentParty.id,

            supplied_recipient_id:
              recipient.userId,

            supplied_gold:
              gold,

            supplied_crystals:
              crystals
          }
        );

    if (error) {
      throw error;
    }

    state.gold -=
      gold;

    state.crystals -=
      crystals;

    saveState(
      state
    );

    closeGiftDialog();

    render();

    await renderParty();

    const parts =
      [];

    if (gold > 0) {
      parts.push(
        `${gold} Gold`
      );
    }

    if (
      crystals > 0
    ) {
      parts.push(
        `${crystals} Crystals`
      );
    }

    showToast(
      `Gift sent to ${recipient.displayName} | ${parts.join(" | ")}`
    );

    return data;
  }

  catch (error) {
    console.error(
      "Gift could not be sent:",
      error
    );

    showToast(
      "That gift could not be sent."
    );
  }

  finally {
    giftSending =
      false;
  }
}


// =========================================================
// 71. INCOMING GIFTS
// =========================================================

async function checkIncomingGifts() {
  if (
    checkingIncomingGifts
    || !supabaseReady
    || !supabaseUser
  ) {
    return;
  }

  checkingIncomingGifts =
    true;

  try {
    const {
      data,
      error
    } =
      await supabaseClient
        .from("party_gifts")
        .select("*")
        .eq(
          "recipient_id",
          supabaseUser.id
        )
        .order(
          "created_at",
          {
            ascending: true
          }
        );

    if (error) {
      throw error;
    }

    const state =
      getState();

    const claimed =
      new Set(
        state.claimedGiftIds
        || []
      );

    const newGifts =
      (
        data
        || []
      )
        .filter(
          gift =>
            !claimed.has(
              gift.id
            )
        );

    if (
      newGifts.length === 0
    ) {
      return;
    }

    let receivedGold =
      0;

    let receivedCrystals =
      0;

    for (
      const gift
      of newGifts
    ) {
      receivedGold +=
        Number(
          gift.gold
        )
        || 0;

      receivedCrystals +=
        Number(
          gift.crystals
        )
        || 0;

      claimed.add(
        gift.id
      );
    }

    state.gold +=
      receivedGold;

    state.crystals +=
      receivedCrystals;

    state.claimedGiftIds =
      Array.from(
        claimed
      );

    saveState(
      state
    );

    render();

    const parts =
      [];

    if (
      receivedGold > 0
    ) {
      parts.push(
        `${receivedGold} Gold`
      );
    }

    if (
      receivedCrystals > 0
    ) {
      parts.push(
        `${receivedCrystals} Crystals`
      );
    }

    if (
      parts.length > 0
    ) {
      showToast(
        `Gifts Received | ${parts.join(" | ")}`
      );
    }
  }

  catch (error) {
    console.error(
      "Could not check incoming gifts:",
      error
    );
  }

  finally {
    checkingIncomingGifts =
      false;
  }
}
// =========================================================
// 72. PARTY CONSUMABLE TREASURE
// =========================================================

async function fetchPartyTreasureInventory() {
  if (
    !currentParty
    || !supabaseUser
  ) {
    return [];
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from(
        "party_treasure_inventory"
      )
      .select(
        "item_id, quantity"
      )
      .eq(
        "party_id",
        currentParty.id
      )
      .eq(
        "user_id",
        supabaseUser.id
      )
      .gt(
        "quantity",
        0
      );

  if (error) {
    throw error;
  }

  return data || [];
}


async function fetchPartyBonusProgress() {
  if (!currentParty) {
    return 0;
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from(
        "party_weekly_bonuses"
      )
      .select(
        "bonus_progress"
      )
      .eq(
        "party_id",
        currentParty.id
      )
      .eq(
        "week_key",
        getWeekKey()
      )
      .maybeSingle();

  if (error) {
    throw error;
  }

  return (
    Number(
      data?.bonus_progress
    )
    || 0
  );
}


function renderPartyTreasure(
  inventory
) {
  const grid =
    $("#partyTreasureGrid");

  if (!grid) {
    return;
  }

  const total =
    inventory.reduce(
      (
        sum,
        row
      ) =>
        sum
        + (
          Number(
            row.quantity
          )
          || 0
        ),
      0
    );

  const totalElement =
    $("#partyTreasureTotal");

  if (totalElement) {
    totalElement.textContent =
      `${total} item${
        total === 1
          ? ""
          : "s"
      }`;
  }

  if (
    !inventory.length
  ) {
    grid.innerHTML =
      `<p class="muted">No consumable treasure yet.</p>`;

    return;
  }

  grid.innerHTML =
    inventory
      .map(
        row => {
          const item =
            PARTY_TREASURES[
              row.item_id
            ];

          if (!item) {
            return "";
          }

          return `
            <article
              class="party-treasure-card"
            >

              <div
                class="party-treasure-glyph"
              >
                ${escapeHtml(
                  item.glyph
                )}
              </div>

              <div
                class="party-treasure-info"
              >

                <strong>
                  ${escapeHtml(
                    item.name
                  )}
                  x${Number(
                    row.quantity
                  ) || 0}
                </strong>

                <span>
                  ${escapeHtml(
                    item.description
                  )}
                </span>

                <small>
                  ${escapeHtml(
                    item.rarity
                  )}
                </small>

              </div>

              <button
                class="party-treasure-use"
                type="button"
                data-use-treasure="${escapeHtml(
                  row.item_id
                )}"
              >
                Use
              </button>

            </article>
          `;
        }
      )
      .join("");
}


function showTreasureReveal(
  itemId
) {
  const item =
    PARTY_TREASURES[
      itemId
    ];

  if (!item) {
    return;
  }

  const glyph =
    $("#treasureDialogGlyph");

  const title =
    $("#treasureDialogTitle");

  const rarity =
    $("#treasureDialogRarity");

  const description =
    $("#treasureDialogDescription");

  if (glyph) {
    glyph.textContent =
      item.glyph;
  }

  if (title) {
    title.textContent =
      item.name;
  }

  if (rarity) {
    rarity.textContent =
      item.rarity;
  }

  if (description) {
    description.textContent =
      item.description;
  }

  const dialog =
    $("#treasureDialog");

  if (
    dialog
    && !dialog.open
  ) {
    dialog.showModal();
  }
}


async function ensureWeeklyBossTreasureDrop(
  reveal = false
) {
  if (
    !currentParty
    || !supabaseUser
  ) {
    return null;
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .rpc(
        "award_party_boss_treasure",
        {
          supplied_party_id:
            currentParty.id,

          supplied_week_key:
            getWeekKey()
        }
      );

  if (error) {
    console.error(
      "Party treasure award failed:",
      error
    );

    return null;
  }

  const result =
    Array.isArray(data)
      ? data[0]
      : data;

  if (
    result?.newly_awarded
    && reveal
  ) {
    showTreasureReveal(
      result.item_id
    );
  }

  return result;
}


async function usePartyTreasure(
  itemId
) {
  if (
    partyTreasureUsing
    || !PARTY_TREASURES[
      itemId
    ]
    || !currentParty
  ) {
    return;
  }

  partyTreasureUsing =
    true;

  try {
    const {
      data,
      error
    } =
      await supabaseClient
        .rpc(
          "use_party_treasure",
          {
            supplied_party_id:
              currentParty.id,

            supplied_item_id:
              itemId,

            supplied_week_key:
              getWeekKey()
          }
        );

    if (error) {
      throw error;
    }

    await checkIncomingGifts();

    await refreshParty();

    showToast(
      data?.message
      || `${PARTY_TREASURES[itemId].name} used.`
    );
  }

  catch (error) {
    console.error(
      "Treasure could not be used:",
      error
    );

    showToast(
      "That treasure could not be used."
    );
  }

  finally {
    partyTreasureUsing =
      false;
  }
}


// =========================================================
// 73. TOAST
// =========================================================

function showToast(
  message
) {
  const toast =
    $("#toast");

  if (!toast) {
    return;
  }

  toast.textContent =
    message;

  toast.hidden =
    false;

  toast.classList.add(
    "show"
  );

  if (toastTimeout) {
    clearTimeout(
      toastTimeout
    );
  }

  toastTimeout =
    setTimeout(
      () => {
        toast.classList
          .remove(
            "show"
          );

        setTimeout(
          () => {
            toast.hidden =
              true;
          },
          220
        );
      },
      3200
    );
}


// =========================================================
// 74. UTILITY HELPERS
// =========================================================

function escapeHtml(
  value
) {
  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}


function capitalize(
  value
) {
  const string =
    String(
      value || ""
    );

  if (!string) {
    return "";
  }

  return (
    string
      .charAt(0)
      .toUpperCase()
    + string.slice(1)
  );
}


// =========================================================
// 75. MAIN NAVIGATION EVENTS
// =========================================================

$$("[data-nav-view]")
  .forEach(
    button => {
      button.addEventListener(
        "click",
        () => {
          setActiveView(
            button.dataset
              .navView
          );
        }
      );
    }
  );


// =========================================================
// 76. QUEST EVENTS
// =========================================================

$("#closeQuestButton")
  ?.addEventListener(
    "click",
    closeQuest
  );


$("#completeQuestButton")
  ?.addEventListener(
    "click",
    () => {
      void completeQuest();
    }
  );


$("#startTimerButton")
  ?.addEventListener(
    "click",
    startTimer
  );


$("#pauseTimerButton")
  ?.addEventListener(
    "click",
    pauseTimer
  );


$("#resetTimerButton")
  ?.addEventListener(
    "click",
    resetTimer
  );


$("#emergencyQuestButton")
  ?.addEventListener(
    "click",
    () =>
      openQuest(
        "emergency"
      )
  );


$("#bossButton")
  ?.addEventListener(
    "click",
    () =>
      openQuest(
        "boss"
      )
  );


// =========================================================
// 77. WEEK / BOSS DIALOG EVENTS
// =========================================================

$("#closeWeekConqueredButton")
  ?.addEventListener(
    "click",
    closeWeekConquered
  );


$("#claimWeekConqueredButton")
  ?.addEventListener(
    "click",
    closeWeekConquered
  );


$("#closeBossDefeatedButton")
  ?.addEventListener(
    "click",
    closeBossDefeated
  );


$("#claimBossRewardsButton")
  ?.addEventListener(
    "click",
    () => {
      void claimBossRewards();
    }
  );


// =========================================================
// 78. SETTINGS EVENTS
// =========================================================

$("#savePlayerNameButton")
  ?.addEventListener(
    "click",
    () => {
      void savePlayerName();
    }
  );


$("#weeklyGoalSelect")
  ?.addEventListener(
    "change",
    saveWeeklyGoal
  );


$("#reducedMotionToggle")
  ?.addEventListener(
    "change",
    saveReducedMotionSetting
  );


$("#soundEffectsToggle")
  ?.addEventListener(
    "change",
    saveSoundSetting
  );


$("#switchProfileButton")
  ?.addEventListener(
    "click",
    switchProfile
  );


$("#resetWeekButton")
  ?.addEventListener(
    "click",
    resetThisWeek
  );


// =========================================================
// 79. PARTY EVENTS
// =========================================================

$("#createPartyButton")
  ?.addEventListener(
    "click",
    () => {
      void createParty();
    }
  );


$("#showJoinPartyButton")
  ?.addEventListener(
    "click",
    () => {
      toggleJoinPartyForm();
    }
  );


$("#joinPartyButton")
  ?.addEventListener(
    "click",
    () => {
      void joinParty();
    }
  );


$("#partyCodeInput")
  ?.addEventListener(
    "keydown",
    event => {
      if (
        event.key
        === "Enter"
      ) {
        event.preventDefault();

        void joinParty();
      }
    }
  );


$("#leavePartyButton")
  ?.addEventListener(
    "click",
    () => {
      void leaveParty();
    }
  );


$("#refreshPartyButton")
  ?.addEventListener(
    "click",
    () => {
      void refreshParty();
    }
  );


$("#partyMembers")
  ?.addEventListener(
    "click",
    event => {
      const profileButton =
        event.target.closest(
          "[data-open-party-profile]"
        );

      if (profileButton) {
        openPartyCharacterDialog(
          profileButton.dataset
            .openPartyProfile
        );

        return;
      }

      const giftButton =
        event.target.closest(
          "[data-gift-user]"
        );

      if (giftButton) {
        openGiftDialog(
          giftButton.dataset
            .giftUser
        );
      }
    }
  );


// =========================================================
// 80. FELLOWSHIP CHARACTER DIALOG EVENTS
// =========================================================

$("#closePartyCharacterButton")
  ?.addEventListener(
    "click",
    closePartyCharacterDialog
  );


$("#partyCharacterDialog")
  ?.addEventListener(
    "cancel",
    event => {
      event.preventDefault();

      closePartyCharacterDialog();
    }
  );


$("#partyCharacterDialog")
  ?.addEventListener(
    "click",
    event => {
      if (
        event.target
        === event.currentTarget
      ) {
        closePartyCharacterDialog();
      }
    }
  );


// =========================================================
// 81. GIFT EVENTS
// =========================================================

$("#closeGiftButton")
  ?.addEventListener(
    "click",
    closeGiftDialog
  );


$("#cancelGiftButton")
  ?.addEventListener(
    "click",
    closeGiftDialog
  );


$("#sendGiftButton")
  ?.addEventListener(
    "click",
    () => {
      void sendPartyGift();
    }
  );


$("#giftGoldInput")
  ?.addEventListener(
    "keydown",
    event => {
      if (
        event.key
        === "Enter"
      ) {
        void sendPartyGift();
      }
    }
  );


$("#giftCrystalInput")
  ?.addEventListener(
    "keydown",
    event => {
      if (
        event.key
        === "Enter"
      ) {
        void sendPartyGift();
      }
    }
  );


// =========================================================
// 82. PARTY TREASURE EVENTS
// =========================================================

$("#partyTreasureGrid")
  ?.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-use-treasure]"
        );

      if (button) {
        void usePartyTreasure(
          button.dataset
            .useTreasure
        );
      }
    }
  );


$("#closeTreasureButton")
  ?.addEventListener(
    "click",
    () => {
      $("#treasureDialog")
        ?.close();
    }
  );


// =========================================================
// 83. RELIC COLLECTION EVENTS
// =========================================================

$("#relicFilters")
  ?.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-relic-filter]"
        );

      if (!button) {
        return;
      }

      setRelicFilter(
        button.dataset
          .relicFilter
      );
    }
  );


$("#relicGrid")
  ?.addEventListener(
    "click",
    event => {
      const card =
        event.target.closest(
          "[data-relic-id]"
        );

      if (!card) {
        return;
      }

      openRelicDialog(
        card.dataset
          .relicId
      );
    }
  );


$("#closeRelicButton")
  ?.addEventListener(
    "click",
    closeRelicDialog
  );


$("#relicContinueButton")
  ?.addEventListener(
    "click",
    closeRelicDialog
  );


// =========================================================
// 84. DIALOG BACKDROP EVENTS
// =========================================================

$("#questDialog")
  ?.addEventListener(
    "click",
    event => {
      if (
        event.target
        === event.currentTarget
      ) {
        closeQuest();
      }
    }
  );


$("#giftDialog")
  ?.addEventListener(
    "click",
    event => {
      if (
        event.target
        === event.currentTarget
      ) {
        closeGiftDialog();
      }
    }
  );


$("#relicDialog")
  ?.addEventListener(
    "click",
    event => {
      if (
        event.target
        === event.currentTarget
      ) {
        closeRelicDialog();
      }
    }
  );


$("#treasureDialog")
  ?.addEventListener(
    "click",
    event => {
      if (
        event.target
        === event.currentTarget
      ) {
        event.currentTarget
          .close();
      }
    }
  );


// =========================================================
// 85. DIALOG CANCEL EVENTS
// =========================================================

$("#questDialog")
  ?.addEventListener(
    "cancel",
    event => {
      event.preventDefault();

      closeQuest();
    }
  );


$("#giftDialog")
  ?.addEventListener(
    "cancel",
    event => {
      event.preventDefault();

      closeGiftDialog();
    }
  );


$("#relicDialog")
  ?.addEventListener(
    "cancel",
    event => {
      event.preventDefault();

      closeRelicDialog();
    }
  );


// =========================================================
// 86. KEYBOARD EVENTS
// =========================================================

document.addEventListener(
  "keydown",
  event => {
    if (
      event.key
      !== "Escape"
    ) {
      return;
    }

    if (
      $("#partyCharacterDialog")
        ?.open
    ) {
      closePartyCharacterDialog();
    }
  }
);


// =========================================================
// 87. VISIBILITY EVENTS
// =========================================================

document.addEventListener(
  "visibilitychange",
  () => {
    if (
      !document.hidden
    ) {
      syncVisibleTimer();

      if (
        supabaseReady
        && currentParty
      ) {
        void refreshParty();
      }
    }
  }
);


// =========================================================
// 88. INITIALIZATION
// =========================================================

async function initializeApp() {
  chooseProfile();

  const initialState =
    normalizeWeek();

  const newlyDiscovered =
    discoverEligibleRelics(
      initialState
    );

  render();

  setActiveView(
    activeView
  );

  /*
    Do not reveal old eligible relics as a
    giant stack on every startup. Their
    collection state is still restored and
    rendered normally.
  */
  if (
    newlyDiscovered.length
    > 0
  ) {
    renderRelicCollection(
      getState()
    );
  }

  try {
    await initializeSupabase();

    if (
      supabaseReady
    ) {
      await checkIncomingGifts();

      if (currentParty) {
        await renderParty();
      }
    }
  }

  catch (error) {
    console.error(
      "Quest Board startup sync failed:",
      error
    );
  }

  appInitialized =
    true;
}


initializeApp();
