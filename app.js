// =========================================================
// QUEST BOARD
// app.js
//
// Phase 8:
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
// - Relic collection and discovery reveals
// - Party-only consumable treasure
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
    theme: "ember"
  },

  jess: {
    profileId: "jess",
    legacyName: "Jess",
    defaultName: "Jess",
    className: "Rogue Witch Assassin",
    card: "jess-card.webp",
    theme: "amethyst"
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
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
        stats.bossesDefeated >= 1
  },

  {
    id: "cloak-of-endurance",
    name: "Cloak of Endurance",
    image: "relics/cloak-of-endurance.webp",
    flavor:
      "Weathered by time, it shields those who never turn back.",
    rarity: "epic",
    source: "quest",
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
        stats.uniqueCoreQuests
        >= QUESTS.length
  },

  {
    id: "wardens-totem",
    name: "Warden's Totem",
    image: "relics/wardens-totem.webp",
    flavor:
      "The guardians watch favorably upon the persistent.",
    rarity: "epic",
    source: "quest",
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
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
    condition:
      stats =>
        stats.totalQuests >= 250
  }
];


// =========================================================
// 6. PARTY CONSUMABLE TREASURE
// =========================================================

const PARTY_TREASURES = {
  "fellowship-token": {
    name:
      "Fellowship Token",

    rarity:
      "Common",

    glyph:
      "+1",

    description:
      "Adds one bonus point to the shared weekly challenge."
  },

  "banner-of-plenty": {
    name:
      "Banner of Plenty",

    rarity:
      "Uncommon",

    glyph:
      "G",

    description:
      "Grants 15 Gold to every fellowship member."
  },

  "crystal-parcel": {
    name:
      "Crystal Parcel",

    rarity:
      "Rare",

    glyph:
      "C",

    description:
      "Grants one Crystal to every fellowship member."
  },

  "rallying-horn": {
    name:
      "Rallying Horn",

    rarity:
      "Epic",

    glyph:
      "+3",

    description:
      "Adds three bonus points to the shared weekly challenge."
  }
};


// =========================================================
// 7. CONSTANTS
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
// 8. APP STATE
// =========================================================

let activeProfileId =
  getInitialProfileId();

let activeView =
  localStorage.getItem(
    "questBoardActiveView"
  )
  || "board";

let activeQuest =
  null;

/*
  The interval only refreshes the visible clock.
  Timestamp math is the source of truth.
*/

let timerInterval =
  null;

let timerDisplayMs =
  0;

let toastTimeout =
  null;

let supabaseUser =
  null;

let supabaseReady =
  false;

let currentParty =
  null;

let partyRefreshTimer =
  null;

let giftRecipient =
  null;

let giftSending =
  false;

let checkingIncomingGifts =
  false;

let activeRelicFilter =
  "all";

let relicRevealQueue =
  [];

let currentRelicRevealMode =
  false;

let appInitialized =
  false;

let partyTreasureUsing =
  false;


// =========================================================
// 9. DOM HELPERS
// =========================================================

const $ =
  selector =>
    document.querySelector(
      selector
    );

const $$ =
  selector =>
    document.querySelectorAll(
      selector
    );


// =========================================================
// 10. PROFILE HELPERS
// =========================================================

function normalizeProfileId(value) {
  const normalized =
    String(value || "")
      .trim()
      .toLowerCase();

  if (
    normalized === "farmer"
  ) {
    return "farmer";
  }

  if (
    normalized === "jess"
  ) {
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
    CHARACTER_PROFILES[
      profileId
    ]
    || CHARACTER_PROFILES.farmer
  );
}


function getLegacyProfileName(
  profileId = activeProfileId
) {
  return (
    getCharacterConfig(
      profileId
    ).legacyName
  );
}


// =========================================================
// 11. PROFILE CHOICE
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
    normalizeProfileId(
      choice
    )
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
// 12. STORAGE KEYS
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
// 13. SETTINGS
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
    JSON.stringify(
      settings
    )
  );
}


// =========================================================
// 14. PERSONAL QUEST STATE
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
      && typeof parsed.relicDiscoveryDates
        === "object"
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
    return migrateState(
      JSON.parse(saved)
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
// 15. WEEK HANDLING
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
// 16. LEVEL SYSTEM
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
// 17. QUEST LOOKUP
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
// 18. SUPABASE INITIALIZATION
// =========================================================

async function initializeSupabase() {
  setPartySyncStatus(
    "Connecting to the guild..."
  );

  if (!supabaseClient) {
    supabaseReady =
      false;

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
// 19. SYNC PROFILE
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
// 20. LOAD CURRENT PARTY
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
// 21. RELIC COLLECTION ENGINE
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

  if (
    !width
    || !height
  ) {
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

  for (const relic of RELICS) {
    if (
      relic.manual
      || discovered.has(
        relic.id
      )
      || typeof relic.condition
        !== "function"
      || !relic.condition(stats)
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
    newlyDiscovered.length > 0
  ) {
    state.discoveredRelics =
      Array.from(discovered);

    saveState(state);
  }

  return newlyDiscovered;
}


function unlockRelicById(
  relicId,
  {
    reveal = true
  } = {}
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
    Array.from(discovered);

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
        activeRelicFilter === "all"
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
              data-relic-id="${
                escapeHtml(
                  relic.id
                )
              }"
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
              <span class="relic-art-shell">

                <img
                  class="relic-card-image"
                  src="${
                    escapeHtml(
                      relic.image
                    )
                  }"
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
                        <span>Undiscovered</span>
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
    allowed.includes(filter)
      ? filter
      : "all";

  $$(".relic-filter")
    .forEach(
      button => {
        button.classList.toggle(
          "active",
          button.dataset.relicFilter
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
  {
    reveal = false
  } = {}
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
    ).includes(relicId)
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
      `${capitalize(relic.rarity)} rarity`;

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
    state.relicDiscoveryDates?.[
      relicId
    ];

  $("#relicDiscoveredDate")
    .textContent =
      discoveredAt
        ? `Discovered ${
            new Date(
              discoveredAt
            ).toLocaleDateString(
              undefined,
              {
                month: "long",
                day: "numeric",
                year: "numeric"
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
  {
    defer = false
  } = {}
) {
  for (
    const relicId
    of relicIds || []
  ) {
    if (
      getRelicById(relicId)
      && !relicRevealQueue.includes(
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
    || $("#weekConqueredDialog")?.open
    || $("#bossDefeatedDialog")?.open
    || relicRevealQueue.length === 0
  ) {
    return;
  }

  const relicId =
    relicRevealQueue.shift();

  openRelicDialog(
    relicId,
    {
      reveal: true
    }
  );
}


// =========================================================
// 22. MAIN RENDER
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
    Party rendering is asynchronous.
    Local personal progress does not wait on it.
  */

  void renderParty();

  applyMotionSetting(
    settings
  );

  bindQuestCards();
}


// =========================================================
// 23. PROFILE DISPLAY
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
// 24. WEEKLY PROGRESS
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
    state.weeklyCompleted.length;

  const percent =
    Math.min(
      100,
      (
        completed
        / goal
      ) * 100
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
    completed === goal - 1
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
// 25. BOSS BATTLE
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
    state.weeklyCompleted.length
    >= goal;

  const bossDefeated =
    state.bossDefeatedWeek
    === weekKey;

  const bossButton =
    $("#bossButton");

  if (!bossButton) {
    return;
  }

  bossButton.disabled =
    !weekConquered
    || bossDefeated;

  if (bossDefeated) {
    $("#bossLockText")
      .textContent =
        "Defeated this week.";
  }

  else if (weekConquered) {
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
// 26. QUEST CARDS
// =========================================================

function renderQuestCards() {
  const grid =
    $("#questGrid");

  if (!grid) {
    return;
  }

  grid.innerHTML =
    QUESTS
      .map(
        quest => `
          <article
            class="quest-card"
            data-quest-id="${quest.id}"
            tabindex="0"
            role="button"
          >

            <div class="quest-card-content">

              <p class="quest-type">
                ${
                  escapeHtml(
                    quest.category
                  )
                }
              </p>

              <h3>
                ${
                  escapeHtml(
                    quest.title
                  )
                }
              </h3>

              <p>
                ${
                  escapeHtml(
                    quest.description
                  )
                }
              </p>

            </div>

            <div class="quest-card-meta">

              <span class="quest-duration">
                ${
                  escapeHtml(
                    quest.time
                  )
                }
              </span>

              <span class="quest-gold-reward">

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
                &gt;
              </span>

            </div>

          </article>
        `
      )
      .join("");
}


// =========================================================
// 27. QUEST CARD BINDINGS
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
              element.dataset.questId
            );
          };

        if (
          element.classList.contains(
            "quest-card"
          )
        ) {
          element.onkeydown =
            event => {
              if (
                event.key === "Enter"
                || event.key === " "
              ) {
                event.preventDefault();

                openQuest(
                  element.dataset.questId
                );
              }
            };
        }
      }
    );
}


// =========================================================
// 28. CHARACTER STATS
// =========================================================

function renderCharacterStats(state) {
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
// 29. CHARACTER SUMMARY
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
      state.weeklyCompleted.length;

  $("#characterTotalQuests")
    .textContent =
      state.history.length;

  $("#characterTotalXp")
    .textContent =
      totalXp;

  document.body.dataset.characterTheme =
    character.theme;

  document.body.dataset.profileId =
    activeProfileId;
}


// =========================================================
// 30. OPEN QUEST
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
      state.weeklyCompleted.length
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
          ${
            capitalize(
              quest.xpType
            )
          }
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
// 31. EXERCISE CHECKLIST
// =========================================================

function renderExerciseList(quest) {
  $("#exerciseList")
    .innerHTML =
      quest.exercises
        .map(
          (
            exercise,
            index
          ) => `
            <label class="exercise-row">

              <input
                type="checkbox"
                id="exercise-${index}"
              >

              <span>
                ${
                  escapeHtml(
                    exercise
                  )
                }
              </span>

            </label>
          `
        )
        .join("");
}


// =========================================================
// 32. COMPLETE QUEST
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

  const goal =
    Number(
      settings.weeklyGoal
    )
    || DEFAULT_WEEKLY_GOAL;

  const weekKey =
    getWeekKey();

  const completedBefore =
    state.weeklyCompleted.length;

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

  state.weeklyCompleted.push({
    questId:
      completedQuest.id,

    completedAt
  });

  state.xp[
    completedQuest.xpType
  ] += earnedXp;

  state.gold +=
    earnedGold;

  state.history.unshift({
    questId:
      completedQuest.id,

    title:
      completedQuest.title,

    category:
      completedQuest.category,

    xp:
      earnedXp,

    xpType:
      completedQuest.xpType,

    gold:
      earnedGold,

    crystals:
      0,

    completedAt
  });

  const completedAfter =
    state.weeklyCompleted.length;

  const conqueredWeekNow =
    completedBefore < goal
    && completedAfter >= goal
    && state.weekConqueredRewardWeek
      !== weekKey;

  if (conqueredWeekNow) {
    state.gold +=
      WEEK_CONQUERED_GOLD;

    state.weekConqueredRewardWeek =
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
  }

  render();

  if (currentParty) {
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
      `Quest saved | +${earnedXp} XP | +${earnedGold} Gold | Party sync failed`
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
// 33. WEEK CONQUERED
// =========================================================