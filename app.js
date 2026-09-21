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
// - Fellowship character inspector
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
        stats.uniqueCoreQuests >= QUESTS.length
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
    name: "Fellowship Token",
    rarity: "Common",
    glyph: "+1",
    image: "consumables/fellowship-token.webp",
    description:
      "Adds one bonus point to the shared weekly challenge."
  },

  "banner-of-plenty": {
    name: "Banner of Plenty",
    rarity: "Uncommon",
    glyph: "G",
    image: "consumables/banner-of-plenty.webp",
    description:
      "Grants 15 Gold to every fellowship member."
  },

  "crystal-parcel": {
    name: "Crystal Parcel",
    rarity: "Rare",
    glyph: "C",
    image: "consumables/crystal-parcel.webp",
    description:
      "Grants one Crystal to every fellowship member."
  },

  "rallying-horn": {
    name: "Rallying Horn",
    rarity: "Epic",
    glyph: "+3",
    image: "consumables/rallying-horn.webp",
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

/*
  Stores the currently rendered fellowship
  member information so tapping a portrait
  can open that adventurer's full profile.
*/

let partyMemberProfileCache =
  new Map();


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
// 21. RELIC ENGINE
// =========================================================

function getRelicStats() {
  const state = normalizeWeek();

  const history = Array.isArray(state.history)
    ? state.history
    : [];

  const completedQuestIds = history
    .map(item => item.questId || item.quest_id)
    .filter(Boolean);

  const strengthQuests = completedQuestIds.filter(id => {
    if (id === "boss") return false;

    const quest = findQuest(id);

    return quest?.xpType === "strength";
  }).length;

  const enduranceQuests = completedQuestIds.filter(id => {
    if (id === "boss") return false;

    const quest = findQuest(id);

    return quest?.xpType === "endurance";
  }).length;

  const restorationQuests = completedQuestIds.filter(id => {
    if (id === "boss") return false;

    const quest = findQuest(id);

    return quest?.xpType === "restoration";
  }).length;

  const rogueQuests = completedQuestIds.filter(
    id => id === "rogue"
  ).length;

  const rangerQuests = completedQuestIds.filter(
    id => id === "ranger"
  ).length;

  const uniqueCoreQuests = new Set(
    completedQuestIds.filter(id =>
      QUESTS.some(quest => quest.id === id)
    )
  ).size;

  const strengthLevel = getLevelData(
    state.xp.strength
  ).level;

  const enduranceLevel = getLevelData(
    state.xp.endurance
  ).level;

  const restorationLevel = getLevelData(
    state.xp.restoration
  ).level;

  return {
    totalQuests: history.length,

    strengthQuests,
    enduranceQuests,
    restorationQuests,

    rogueQuests,
    rangerQuests,

    uniqueCoreQuests,

    strengthLevel,
    enduranceLevel,
    restorationLevel,

    minimumStatLevel: Math.min(
      strengthLevel,
      enduranceLevel,
      restorationLevel
    ),

    maximumStatLevel: Math.max(
      strengthLevel,
      enduranceLevel,
      restorationLevel
    ),

    bossesDefeated: history.filter(item =>
      (item.questId || item.quest_id) === "boss"
    ).length,

    hasConqueredWeek:
      state.weekConqueredRewardWeek === getWeekKey()
  };
}


function getRelicById(id) {
  return RELICS.find(
    relic => relic.id === id
  ) || null;
}


function isRelicDiscovered(id) {
  const state = getState();

  return state.discoveredRelics.includes(id);
}


function discoverRelic(id, options = {}) {
  const relic = getRelicById(id);

  if (!relic) {
    return false;
  }

  const state = getState();

  if (
    state.discoveredRelics.includes(id)
  ) {
    return false;
  }

  state.discoveredRelics.push(id);

  state.relicDiscoveryDates[id] =
    new Date().toISOString();

  saveState(state);

  if (options.reveal !== false) {
    queueRelicReveal(relic);
  }

  return true;
}


function evaluateRelics() {
  const stats = getRelicStats();

  let discoveredAny = false;

  for (const relic of RELICS) {
    if (relic.manual) {
      continue;
    }

    if (
      typeof relic.condition !== "function"
    ) {
      continue;
    }

    if (
      relic.condition(stats)
      && !isRelicDiscovered(relic.id)
    ) {
      discoverRelic(
        relic.id,
        {
          reveal: true
        }
      );

      discoveredAny = true;
    }
  }

  if (discoveredAny) {
    renderRelics();
  }
}


function queueRelicReveal(relic) {
  relicRevealQueue.push(relic);

  if (!currentRelicRevealMode) {
    showNextRelicReveal();
  }
}


function showNextRelicReveal() {
  if (
    currentRelicRevealMode
    || relicRevealQueue.length === 0
  ) {
    return;
  }

  const relic =
    relicRevealQueue.shift();

  const dialog =
    $("#relicDialog");

  if (!dialog) {
    currentRelicRevealMode = false;
    return;
  }

  currentRelicRevealMode = true;

  const image =
    $("#relicDialogImage");

  if (image) {
    image.src =
      relic.image;

    image.alt =
      relic.name;
  }

  const name =
    $("#relicDialogName");

  if (name) {
    name.textContent =
      relic.name;
  }

  const flavor =
    $("#relicDialogFlavor");

  if (flavor) {
    flavor.textContent =
      relic.flavor;
  }

  const rarity =
    $("#relicDialogRarity");

  if (rarity) {
    rarity.textContent =
      relic.rarity;
  }

  const source =
    $("#relicDialogSource");

  if (source) {
    source.textContent =
      RELIC_SOURCE_LABELS[
        relic.source
      ]
      || relic.source;
  }

  if (!dialog.open) {
    dialog.showModal();
  }
}


function closeRelicDialog() {
  const dialog =
    $("#relicDialog");

  if (dialog?.open) {
    dialog.close();
  }

  currentRelicRevealMode =
    false;

  if (
    relicRevealQueue.length > 0
  ) {
    window.setTimeout(
      showNextRelicReveal,
      180
    );
  }
}


// =========================================================
// 22. MAIN RENDER
// =========================================================

function render() {
  const state =
    normalizeWeek();

  const settings =
    getSettings();

  applySettings(settings);

  renderProfile(
    state,
    settings
  );

  renderWeeklyProgress(
    state,
    settings
  );

  renderQuestCards(
    state,
    settings
  );

  renderStats(state);

  renderWeeklySummary(
    state,
    settings
  );

  renderHistory(state);

  renderRelics();

  renderSettings(settings);

  renderNavigation();

  evaluateRelics();
}


// =========================================================
// 23. PROFILE RENDER
// =========================================================

function renderProfile(
  state,
  settings
) {
  const character =
    getCharacterConfig();

  const playerName =
    settings.playerName
    || character.defaultName;

  const nameElements = [
    $("#playerName"),
    $("#characterName")
  ];

  nameElements.forEach(element => {
    if (element) {
      element.textContent =
        playerName;
    }
  });

  const classElements = [
    $("#playerClass"),
    $("#characterClass")
  ];

  classElements.forEach(element => {
    if (element) {
      element.textContent =
        character.className;
    }
  });

  const characterImage =
    $("#characterCardImage");

  if (characterImage) {
    characterImage.src =
      character.card;

    characterImage.alt =
      `${playerName} - ${character.className}`;
  }

  const characterCard =
    $("#characterCard");

  if (characterCard) {
    characterCard.dataset.theme =
      character.theme;
  }

  const gold =
    $("#goldCount");

  if (gold) {
    gold.textContent =
      Number(state.gold) || 0;
  }

  const crystals =
    $("#crystalCount");

  if (crystals) {
    crystals.textContent =
      Number(state.crystals) || 0;
  }
}


// =========================================================
// 24. WEEKLY PROGRESS
// =========================================================

function renderWeeklyProgress(
  state,
  settings
) {
  const goal =
    Math.max(
      1,
      Number(settings.weeklyGoal)
      || DEFAULT_WEEKLY_GOAL
    );

  const completed =
    state.weeklyCompleted.length;

  const percentage =
    Math.min(
      100,
      (completed / goal) * 100
    );

  const progressText =
    $("#weeklyProgressText");

  if (progressText) {
    progressText.textContent =
      `${completed} / ${goal}`;
  }

  const progressBar =
    $("#weeklyProgressBar");

  if (progressBar) {
    progressBar.style.width =
      `${percentage}%`;
  }

  const progressStatus =
    $("#weeklyProgressStatus");

  if (progressStatus) {
    if (completed >= goal) {
      progressStatus.textContent =
        "Week conquered.";
    }

    else if (completed === 0) {
      progressStatus.textContent =
        "The campaign awaits.";
    }

    else {
      progressStatus.textContent =
        `${goal - completed} quest${
          goal - completed === 1
            ? ""
            : "s"
        } remaining.`;
    }
  }

  const weeklyGoalText =
    $("#weeklyGoalText");

  if (weeklyGoalText) {
    weeklyGoalText.textContent =
      `${goal} Quests`;
  }

  checkWeekConqueredReward(
    state,
    settings
  );
}


// =========================================================
// 25. BOSS AVAILABILITY
// =========================================================

function isBossUnlocked(
  state = normalizeWeek(),
  settings = getSettings()
) {
  const goal =
    Math.max(
      1,
      Number(settings.weeklyGoal)
      || DEFAULT_WEEKLY_GOAL
    );

  return (
    state.weeklyCompleted.length
    >= goal
  );
}


function hasBossBeenDefeatedThisWeek(
  state = normalizeWeek()
) {
  return (
    state.bossDefeatedWeek
    === getWeekKey()
  );
}


// =========================================================
// 26. QUEST CARDS
// =========================================================

function renderQuestCards(
  state,
  settings
) {
  const container =
    $("#questGrid");

  if (!container) {
    return;
  }

  const bossUnlocked =
    isBossUnlocked(
      state,
      settings
    );

  const bossDefeated =
    hasBossBeenDefeatedThisWeek(
      state
    );

  const cards =
    QUESTS.map(quest => {
      const completedThisWeek =
        state.weeklyCompleted.includes(
          quest.id
        );

      return createQuestCardMarkup(
        quest,
        {
          completed:
            completedThisWeek
        }
      );
    });

  cards.push(
    createQuestCardMarkup(
      SPECIAL_QUESTS.emergency,
      {
        completed:
          state.weeklyCompleted.includes(
            "emergency"
          )
      }
    )
  );

  cards.push(
    createQuestCardMarkup(
      SPECIAL_QUESTS.boss,
      {
        boss: true,
        locked:
          !bossUnlocked,
        completed:
          bossDefeated
      }
    )
  );

  container.innerHTML =
    cards.join("");

  bindQuestCardEvents();
}


function createQuestCardMarkup(
  quest,
  options = {}
) {
  const {
    completed = false,
    boss = false,
    locked = false
  } = options;

  const classes = [
    "quest-card"
  ];

  if (boss) {
    classes.push("boss");

    if (!locked) {
      classes.push(
        "is-unlocked"
      );
    }
  }

  if (completed) {
    classes.push(
      "is-complete"
    );
  }

  if (locked) {
    classes.push(
      "is-locked"
    );
  }

  const rewardMarkup =
    boss
      ? `
        <span class="quest-reward">
          +${BOSS_STRENGTH_XP} Strength XP
        </span>

        <span class="quest-reward">
          +${BOSS_ENDURANCE_XP} Endurance XP
        </span>

        <span class="quest-reward">
          +${BOSS_GOLD} Gold
        </span>

        <span class="quest-reward">
          +${BOSS_CRYSTALS} Crystals
        </span>
      `
      : `
        <span class="quest-reward">
          +${quest.xp} ${capitalizeWords(quest.xpType)} XP
        </span>

        <span class="quest-reward">
          +${quest.gold} Gold
        </span>
      `;

  let buttonLabel =
    "Begin Quest";

  if (locked) {
    buttonLabel =
      "Boss Locked";
  }

  else if (completed) {
    buttonLabel =
      boss
        ? "Boss Defeated"
        : "Quest Again";
  }

  return `
    <article
      class="${classes.join(" ")}"
      data-quest-id="${escapeHtml(quest.id)}"
    >
      <div class="quest-card-header">
        <div>
          <span class="quest-card-category">
            ${escapeHtml(quest.category)}
          </span>

          <h3 class="quest-card-title">
            ${escapeHtml(quest.title)}
          </h3>
        </div>

        <span class="quest-card-time">
          ${escapeHtml(quest.time)}
        </span>
      </div>

      <p class="quest-card-description">
        ${escapeHtml(quest.description)}
      </p>

      <div class="quest-card-rewards">
        ${rewardMarkup}
      </div>

      <button
        class="quest-card-button"
        type="button"
        data-open-quest="${escapeHtml(quest.id)}"
        ${locked ? "disabled" : ""}
      >
        ${buttonLabel}
      </button>
    </article>
  `;
}


// =========================================================
// 27. QUEST CARD EVENTS
// =========================================================

function bindQuestCardEvents() {
  $$("[data-open-quest]")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          const questId =
            button.dataset.openQuest;

          openQuest(questId);
        }
      );
    });
}


// =========================================================
// 28. STAT RENDERING
// =========================================================

function renderStats(state) {
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


function renderStat(type, xp) {
  const levelData =
    getLevelData(xp);

  const key =
    type.charAt(0).toUpperCase()
    + type.slice(1);

  const levelElement =
    $(`#${type}Level`)
    || $(`#stat${key}Level`);

  const xpElement =
    $(`#${type}Xp`)
    || $(`#stat${key}Xp`);

  const barElement =
    $(`#${type}Bar`)
    || $(`#stat${key}Bar`);

  if (levelElement) {
    levelElement.textContent =
      `Lv. ${levelData.level}`;
  }

  if (xpElement) {
    xpElement.textContent =
      `${Math.max(0, Number(xp) || 0)} XP`;
  }

  if (barElement) {
    barElement.style.width =
      `${levelData.progress}%`;
  }
}


// =========================================================
// 29. WEEKLY SUMMARY
// =========================================================

function renderWeeklySummary(
  state,
  settings
) {
  const goal =
    Math.max(
      1,
      Number(settings.weeklyGoal)
      || DEFAULT_WEEKLY_GOAL
    );

  const completed =
    state.weeklyCompleted.length;

  const weeklyCount =
    $("#weeklyQuestCount");

  if (weeklyCount) {
    weeklyCount.textContent =
      completed;
  }

  const weeklyGoal =
    $("#weeklyQuestGoal");

  if (weeklyGoal) {
    weeklyGoal.textContent =
      goal;
  }

  const totalQuestCount =
    $("#totalQuestCount");

  if (totalQuestCount) {
    totalQuestCount.textContent =
      state.history.length;
  }

  const totalXp =
    (Number(state.xp.strength) || 0)
    + (Number(state.xp.endurance) || 0)
    + (Number(state.xp.restoration) || 0);

  const totalXpElement =
    $("#totalXp");

  if (totalXpElement) {
    totalXpElement.textContent =
      totalXp;
  }
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
    && !isBossUnlocked()
  ) {
    showToast(
      "Complete your weekly goal to unlock the Boss Battle."
    );

    return;
  }

  activeQuest =
    quest;

  const dialog =
    $("#questDialog");

  if (!dialog) {
    return;
  }

  const title =
    $("#questDialogTitle");

  if (title) {
    title.textContent =
      quest.title;
  }

  const category =
    $("#questDialogCategory");

  if (category) {
    category.textContent =
      quest.category;
  }

  const description =
    $("#questDialogDescription");

  if (description) {
    description.textContent =
      quest.description;
  }

  const exerciseList =
    $("#questExerciseList");

  if (exerciseList) {
    exerciseList.innerHTML =
      quest.exercises
        .map(
          exercise =>
            `<li>${escapeHtml(exercise)}</li>`
        )
        .join("");
  }

  renderQuestDialogRewards(
    quest
  );

  resetQuestTimerDisplay();

  if (!dialog.open) {
    dialog.showModal();
  }
}


function renderQuestDialogRewards(
  quest
) {
  const container =
    $("#questDialogRewards");

  if (!container) {
    return;
  }

  if (quest.id === "boss") {
    container.innerHTML = `
      <span class="quest-dialog-reward">
        +${BOSS_STRENGTH_XP} Strength XP
      </span>

      <span class="quest-dialog-reward">
        +${BOSS_ENDURANCE_XP} Endurance XP
      </span>

      <span class="quest-dialog-reward">
        +${BOSS_GOLD} Gold
      </span>

      <span class="quest-dialog-reward">
        +${BOSS_CRYSTALS} Crystals
      </span>
    `;

    return;
  }

  container.innerHTML = `
    <span class="quest-dialog-reward">
      +${quest.xp}
      ${escapeHtml(capitalizeWords(quest.xpType))}
      XP
    </span>

    <span class="quest-dialog-reward">
      +${quest.gold} Gold
    </span>
  `;
}


// =========================================================
// 31. EXERCISE RENDERING
// =========================================================

function renderExerciseList(
  exercises = []
) {
  const container =
    $("#questExerciseList");

  if (!container) {
    return;
  }

  container.innerHTML =
    exercises
      .map(
        exercise =>
          `<li>${escapeHtml(exercise)}</li>`
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

  if (
    activeQuest.id === "boss"
  ) {
    await completeBossQuest();
    return;
  }

  const state =
    normalizeWeek();

  const quest =
    activeQuest;

  state.xp[quest.xpType] =
    (Number(
      state.xp[quest.xpType]
    ) || 0)
    + quest.xp;

  state.gold =
    (Number(state.gold) || 0)
    + quest.gold;

  if (
    !state.weeklyCompleted.includes(
      quest.id
    )
  ) {
    state.weeklyCompleted.push(
      quest.id
    );
  }

  state.history.unshift({
    questId:
      quest.id,

    title:
      quest.title,

    xp:
      quest.xp,

    gold:
      quest.gold,

    completedAt:
      new Date().toISOString(),

    weekKey:
      getWeekKey()
  });

  saveState(state);

  try {
    await syncQuestActivity(
      quest
    );
  }

  catch (error) {
    console.error(
      "Could not sync quest activity:",
      error
    );
  }

  closeQuest();

  render();

  showToast(
    `${quest.title} complete. +${quest.xp} XP and +${quest.gold} Gold.`
  );

  evaluateRelics();

  if (currentParty) {
    refreshParty();
  }
}


// =========================================================
// 33. WEEK CONQUERED REWARD
// =========================================================

function checkWeekConqueredReward(
  state,
  settings
) {
  const goal =
    Math.max(
      1,
      Number(settings.weeklyGoal)
      || DEFAULT_WEEKLY_GOAL
    );

  const weekKey =
    getWeekKey();

  if (
    state.weeklyCompleted.length
      < goal
    || state.weekConqueredRewardWeek
      === weekKey
  ) {
    return;
  }

  state.gold =
    (Number(state.gold) || 0)
    + WEEK_CONQUERED_GOLD;

  state.weekConqueredRewardWeek =
    weekKey;

  saveState(state);

  const gold =
    $("#goldCount");

  if (gold) {
    gold.textContent =
      state.gold;
  }

  showToast(
    `Week conquered! +${WEEK_CONQUERED_GOLD} Gold.`
  );

  evaluateRelics();
}


// =========================================================
// 34. COMPLETE BOSS
// =========================================================

async function completeBossQuest() {
  const state =
    normalizeWeek();

  const weekKey =
    getWeekKey();

  if (
    !isBossUnlocked(
      state,
      getSettings()
    )
  ) {
    showToast(
      "The Boss Battle is still locked."
    );

    return;
  }

  if (
    state.bossRewardsClaimedWeek
    === weekKey
  ) {
    showToast(
      "You have already claimed this week's Boss rewards."
    );

    closeQuest();

    return;
  }

  state.xp.strength =
    (Number(state.xp.strength) || 0)
    + BOSS_STRENGTH_XP;

  state.xp.endurance =
    (Number(state.xp.endurance) || 0)
    + BOSS_ENDURANCE_XP;

  state.gold =
    (Number(state.gold) || 0)
    + BOSS_GOLD;

  state.crystals =
    (Number(state.crystals) || 0)
    + BOSS_CRYSTALS;

  state.bossDefeatedWeek =
    weekKey;

  state.bossRewardsClaimedWeek =
    weekKey;

  state.history.unshift({
    questId:
      "boss",

    title:
      SPECIAL_QUESTS.boss.title,

    xp:
      BOSS_STRENGTH_XP
      + BOSS_ENDURANCE_XP,

    gold:
      BOSS_GOLD,

    crystals:
      BOSS_CRYSTALS,

    completedAt:
      new Date().toISOString(),

    weekKey
  });

  saveState(state);

  try {
    await syncBossActivity();
  }

  catch (error) {
    console.error(
      "Could not sync Boss activity:",
      error
    );
  }

  closeQuest();

  render();

  openBossVictoryDialog();

  evaluateRelics();

  if (currentParty) {
    try {
      await awardPartyBossTreasure();
    }

    catch (error) {
      console.error(
        "Could not award fellowship treasure:",
        error
      );
    }

    refreshParty();
  }
}


// =========================================================
// 35. BOSS VICTORY DIALOG
// =========================================================

function openBossVictoryDialog() {
  const dialog =
    $("#bossVictoryDialog");

  if (!dialog) {
    showToast(
      `Boss defeated! +${BOSS_STRENGTH_XP} Strength XP, +${BOSS_ENDURANCE_XP} Endurance XP, +${BOSS_GOLD} Gold, +${BOSS_CRYSTALS} Crystals.`
    );

    return;
  }

  const strength =
    $("#bossStrengthReward");

  if (strength) {
    strength.textContent =
      `+${BOSS_STRENGTH_XP}`;
  }

  const endurance =
    $("#bossEnduranceReward");

  if (endurance) {
    endurance.textContent =
      `+${BOSS_ENDURANCE_XP}`;
  }

  const gold =
    $("#bossGoldReward");

  if (gold) {
    gold.textContent =
      `+${BOSS_GOLD}`;
  }

  const crystals =
    $("#bossCrystalReward");

  if (crystals) {
    crystals.textContent =
      `+${BOSS_CRYSTALS}`;
  }

  if (!dialog.open) {
    dialog.showModal();
  }
}


function closeBossVictoryDialog() {
  const dialog =
    $("#bossVictoryDialog");

  if (dialog?.open) {
    dialog.close();
  }
}


// =========================================================
// 36. CLAIM BOSS REWARD
// =========================================================

function claimBossReward() {
  closeBossVictoryDialog();

  showToast(
    "The Boss has fallen. Your rewards have been claimed."
  );
}


// =========================================================
// 37. SYNC NORMAL QUEST
// =========================================================

async function syncQuestActivity(
  quest
) {
  if (
    !supabaseReady
    || !supabaseUser
    || !currentParty
  ) {
    return;
  }

  const settings =
    getSettings();

  const {
    error
  } =
    await supabaseClient
      .from("quest_activity")
      .insert({
        party_id:
          currentParty.id,

        user_id:
          supabaseUser.id,

        display_name:
          settings.playerName,

        quest_id:
          quest.id,

        quest_title:
          quest.title,

        xp:
          quest.xp,

        gold:
          quest.gold,

        week_key:
          getWeekKey()
      });

  if (error) {
    throw error;
  }
}


// =========================================================
// 38. SYNC BOSS
// =========================================================

async function syncBossActivity() {
  if (
    !supabaseReady
    || !supabaseUser
    || !currentParty
  ) {
    return;
  }

  const settings =
    getSettings();

  const {
    error
  } =
    await supabaseClient
      .from("quest_activity")
      .insert({
        party_id:
          currentParty.id,

        user_id:
          supabaseUser.id,

        display_name:
          settings.playerName,

        quest_id:
          "boss",

        quest_title:
          SPECIAL_QUESTS.boss.title,

        xp:
          BOSS_STRENGTH_XP
          + BOSS_ENDURANCE_XP,

        gold:
          BOSS_GOLD,

        week_key:
          getWeekKey()
      });

  if (error) {
    throw error;
  }
}


// =========================================================
// 39. CLOSE QUEST
// =========================================================

function closeQuest() {
  stopTimer();

  activeQuest =
    null;

  const dialog =
    $("#questDialog");

  if (dialog?.open) {
    dialog.close();
  }

  resetQuestTimerDisplay();
}


// =========================================================
// 40. QUEST TIMER
// =========================================================

function getTimerStorageKey() {
  return (
    `questBoardTimer-${getLegacyProfileName()}`
  );
}


function getTimerState() {
  const raw =
    localStorage.getItem(
      getTimerStorageKey()
    );

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  }

  catch (error) {
    console.error(
      "Could not read timer state.",
      error
    );

    return null;
  }
}


function saveTimerState(timer) {
  localStorage.setItem(
    getTimerStorageKey(),
    JSON.stringify(timer)
  );
}


function clearTimerState() {
  localStorage.removeItem(
    getTimerStorageKey()
  );
}


function getElapsedTimerMs(
  timer
) {
  if (!timer) {
    return 0;
  }

  const startedAt =
    Number(timer.startedAt)
    || Date.now();

  const accumulatedPauseMs =
    Number(
      timer.accumulatedPauseMs
    )
    || 0;

  if (timer.paused) {
    const pausedAt =
      Number(timer.pausedAt)
      || Date.now();

    return Math.max(
      0,
      pausedAt
      - startedAt
      - accumulatedPauseMs
    );
  }

  return Math.max(
    0,
    Date.now()
    - startedAt
    - accumulatedPauseMs
  );
}


function formatTimer(ms) {
  const totalSeconds =
    Math.max(
      0,
      Math.floor(ms / 1000)
    );

  const minutes =
    Math.floor(
      totalSeconds / 60
    );

  const seconds =
    totalSeconds % 60;

  return (
    `${String(minutes).padStart(2, "0")}:`
    + `${String(seconds).padStart(2, "0")}`
  );
}


function updateTimerDisplay() {
  const display =
    $("#questTimerDisplay");

  if (!display) {
    return;
  }

  const timer =
    getTimerState();

  if (!timer) {
    timerDisplayMs =
      0;

    display.textContent =
      "00:00";

    return;
  }

  timerDisplayMs =
    getElapsedTimerMs(timer);

  display.textContent =
    formatTimer(
      timerDisplayMs
    );
}


function startTimer() {
  let timer =
    getTimerState();

  if (!timer) {
    timer = {
      questId:
        activeQuest?.id
        || null,

      startedAt:
        Date.now(),

      durationMs:
        0,

      paused:
        false,

      pausedAt:
        null,

      accumulatedPauseMs:
        0
    };
  }

  else if (timer.paused) {
    const pausedAt =
      Number(timer.pausedAt)
      || Date.now();

    timer.accumulatedPauseMs =
      (Number(
        timer.accumulatedPauseMs
      ) || 0)
      + (
        Date.now()
        - pausedAt
      );

    timer.paused =
      false;

    timer.pausedAt =
      null;
  }

  saveTimerState(timer);

  if (timerInterval) {
    clearInterval(
      timerInterval
    );
  }

  updateTimerDisplay();

  timerInterval =
    window.setInterval(
      updateTimerDisplay,
      1000
    );

  updateTimerButtons();
}


function pauseTimer() {
  const timer =
    getTimerState();

  if (
    !timer
    || timer.paused
  ) {
    return;
  }

  timer.paused =
    true;

  timer.pausedAt =
    Date.now();

  saveTimerState(timer);

  if (timerInterval) {
    clearInterval(
      timerInterval
    );

    timerInterval =
      null;
  }

  updateTimerDisplay();
  updateTimerButtons();
}


function stopTimer() {
  if (timerInterval) {
    clearInterval(
      timerInterval
    );

    timerInterval =
      null;
  }
}


function resetTimer() {
  stopTimer();

  clearTimerState();

  timerDisplayMs =
    0;

  updateTimerDisplay();
  updateTimerButtons();
}


function resetQuestTimerDisplay() {
  const timer =
    getTimerState();

  if (
    timer
    && activeQuest
    && timer.questId
    && timer.questId !== activeQuest.id
  ) {
    clearTimerState();
  }

  updateTimerDisplay();
  updateTimerButtons();
}


function updateTimerButtons() {
  const timer =
    getTimerState();

  const startButton =
    $("#startTimerButton");

  const pauseButton =
    $("#pauseTimerButton");

  const resetButton =
    $("#resetTimerButton");

  if (startButton) {
    startButton.textContent =
      timer?.paused
        ? "Resume"
        : timer
          ? "Running"
          : "Start Timer";

    startButton.disabled =
      Boolean(
        timer
        && !timer.paused
      );
  }

  if (pauseButton) {
    pauseButton.disabled =
      !timer
      || Boolean(timer.paused);
  }

  if (resetButton) {
    resetButton.disabled =
      !timer;
  }
}
// =========================================================
// 41. HISTORY
// =========================================================

function renderHistory(state) {
  const container =
    $("#historyList");

  if (!container) {
    return;
  }

  const history =
    Array.isArray(state.history)
      ? state.history
      : [];

  if (history.length === 0) {
    container.innerHTML = `
      <p class="muted">
        No quests completed yet.
      </p>
    `;

    return;
  }

  container.innerHTML =
    history
      .slice(0, 20)
      .map(item => {
        const questId =
          item.questId
          || item.quest_id;

        const quest =
          findQuest(questId);

        const title =
          item.title
          || quest?.title
          || "Completed Quest";

        const completedAt =
          item.completedAt
          || item.completed_at;

        const dateLabel =
          completedAt
            ? formatDate(completedAt)
            : "";

        const xp =
          Math.max(
            0,
            Number(item.xp) || 0
          );

        const gold =
          Math.max(
            0,
            Number(item.gold) || 0
          );

        return `
          <article class="history-item">
            <div class="history-item-copy">
              <strong>
                ${escapeHtml(title)}
              </strong>

              ${
                dateLabel
                  ? `
                    <span>
                      ${escapeHtml(dateLabel)}
                    </span>
                  `
                  : ""
              }
            </div>

            <div class="history-item-rewards">
              ${
                xp > 0
                  ? `
                    <span>
                      +${xp} XP
                    </span>
                  `
                  : ""
              }

              ${
                gold > 0
                  ? `
                    <span>
                      +${gold} Gold
                    </span>
                  `
                  : ""
              }
            </div>
          </article>
        `;
      })
      .join("");
}


// =========================================================
// 42. VIEW HEADERS
// =========================================================

function renderViewHeaders() {
  const character =
    getCharacterConfig();

  const settings =
    getSettings();

  const playerName =
    settings.playerName
    || character.defaultName;

  const boardName =
    $("#boardPlayerName");

  if (boardName) {
    boardName.textContent =
      playerName;
  }

  const characterHeading =
    $("#characterHeadingName");

  if (characterHeading) {
    characterHeading.textContent =
      playerName;
  }

  const characterClass =
    $("#characterHeadingClass");

  if (characterClass) {
    characterClass.textContent =
      character.className;
  }
}


// =========================================================
// 43. NAVIGATION
// =========================================================

function setActiveView(viewName) {
  const validViews = [
    "board",
    "character",
    "party",
    "settings"
  ];

  if (
    !validViews.includes(viewName)
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

  renderNavigation();

  if (
    activeView === "party"
    && currentParty
  ) {
    refreshParty();
  }
}


function renderNavigation() {
  $$("[data-app-view]")
    .forEach(view => {
      const isActive =
        view.dataset.appView
        === activeView;

      view.hidden =
        !isActive;
    });

  $$("[data-nav-view]")
    .forEach(button => {
      const isActive =
        button.dataset.navView
        === activeView;

      button.classList.toggle(
        "is-active",
        isActive
      );

      button.setAttribute(
        "aria-current",
        isActive
          ? "page"
          : "false"
      );
    });
}


// =========================================================
// 44. SETTINGS RENDER
// =========================================================

function renderSettings(
  settings = getSettings()
) {
  const playerNameInput =
    $("#playerNameInput");

  if (playerNameInput) {
    playerNameInput.value =
      settings.playerName
      || getCharacterConfig()
        .defaultName;
  }

  const weeklyGoalSelect =
    $("#weeklyGoalSelect");

  if (weeklyGoalSelect) {
    weeklyGoalSelect.value =
      String(
        settings.weeklyGoal
        || DEFAULT_WEEKLY_GOAL
      );
  }

  const reducedMotionToggle =
    $("#reducedMotionToggle");

  if (reducedMotionToggle) {
    reducedMotionToggle.checked =
      Boolean(
        settings.reducedMotion
      );
  }

  const soundEnabledToggle =
    $("#soundEnabledToggle");

  if (soundEnabledToggle) {
    soundEnabledToggle.checked =
      Boolean(
        settings.soundEnabled
      );
  }

  const currentProfile =
    $("#currentProfile");

  if (currentProfile) {
    currentProfile.textContent =
      getCharacterConfig()
        .className;
  }

  const leavePartyButton =
    $("#leavePartyButton");

  if (leavePartyButton) {
    leavePartyButton.hidden =
      !currentParty;
  }
}


function applySettings(
  settings = getSettings()
) {
  document.body.classList.toggle(
    "reduce-motion",
    Boolean(
      settings.reducedMotion
    )
  );
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

  const character =
    getCharacterConfig();

  const name =
    input.value
      .trim()
      .slice(0, 20)
    || character.defaultName;

  const settings =
    getSettings();

  settings.playerName =
    name;

  saveSettings(settings);

  render();

  renderViewHeaders();

  try {
    await syncProfileToSupabase();

    if (currentParty) {
      await refreshParty();
    }
  }

  catch (error) {
    console.error(
      "Could not sync player name:",
      error
    );
  }

  showToast(
    `Adventurer name saved as ${name}.`
  );
}


// =========================================================
// 46. WEEKLY GOAL
// =========================================================

function saveWeeklyGoal() {
  const select =
    $("#weeklyGoalSelect");

  if (!select) {
    return;
  }

  const value =
    Math.max(
      1,
      Math.min(
        7,
        Number(select.value)
        || DEFAULT_WEEKLY_GOAL
      )
    );

  const settings =
    getSettings();

  settings.weeklyGoal =
    value;

  saveSettings(settings);

  render();

  showToast(
    `Weekly goal set to ${value} quest${
      value === 1
        ? ""
        : "s"
    }.`
  );
}


// =========================================================
// 47. MOTION SETTING
// =========================================================

function saveReducedMotion() {
  const toggle =
    $("#reducedMotionToggle");

  if (!toggle) {
    return;
  }

  const settings =
    getSettings();

  settings.reducedMotion =
    Boolean(toggle.checked);

  saveSettings(settings);

  applySettings(settings);
}


// =========================================================
// 48. SOUND SETTING
// =========================================================

function saveSoundSetting() {
  const toggle =
    $("#soundEnabledToggle");

  if (!toggle) {
    return;
  }

  const settings =
    getSettings();

  settings.soundEnabled =
    Boolean(toggle.checked);

  saveSettings(settings);
}


// =========================================================
// 49. RESET WEEK
// =========================================================

function resetWeek() {
  const confirmed =
    window.confirm(
      "Reset this week's completed quests? Your XP, Gold, Crystals, relics, and full quest history will remain."
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

  saveState(state);

  render();

  showToast(
    "Weekly quest progress reset."
  );
}


// =========================================================
// 50. CLEAR HISTORY
// =========================================================

function clearHistory() {
  const confirmed =
    window.confirm(
      "Clear your quest history? Your XP, Gold, Crystals, relics, and current weekly progress will remain."
    );

  if (!confirmed) {
    return;
  }

  const state =
    getState();

  state.history =
    [];

  saveState(state);

  render();

  showToast(
    "Quest history cleared."
  );
}


// =========================================================
// 51. RESET CHARACTER
// =========================================================

function resetCharacter() {
  const confirmed =
    window.confirm(
      "Reset this adventurer completely? This clears XP, levels, Gold, Crystals, quest history, relics, and weekly progress for this character."
    );

  if (!confirmed) {
    return;
  }

  saveState(
    createFreshState()
  );

  clearTimerState();

  render();

  showToast(
    "Character progression reset."
  );
}


// =========================================================
// 52. PARTY CODE
// =========================================================

function generatePartyCode(
  length = 6
) {
  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code =
    "";

  for (
    let index = 0;
    index < length;
    index += 1
  ) {
    code +=
      characters.charAt(
        Math.floor(
          Math.random()
          * characters.length
        )
      );
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
      "The guild connection is unavailable."
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

  const partyCode =
    generatePartyCode();

  const partyName =
    `${settings.playerName || "Adventurer"}'s Fellowship`;

  try {
    setPartySyncStatus(
      "Forming fellowship..."
    );

    const {
      data: party,
      error: partyError
    } =
      await supabaseClient
        .from("parties")
        .insert({
          name:
            partyName,

          invite_code:
            partyCode,

          created_by:
            supabaseUser.id
        })
        .select()
        .single();

    if (partyError) {
      throw partyError;
    }

    const {
      error: membershipError
    } =
      await supabaseClient
        .from("party_members")
        .insert({
          party_id:
            party.id,

          user_id:
            supabaseUser.id
        });

    if (membershipError) {
      throw membershipError;
    }

    currentParty =
      party;

    await syncProfileToSupabase();

    await refreshParty();

    renderSettings();

    showToast(
      `Fellowship formed. Invite code: ${partyCode}`
    );
  }

  catch (error) {
    console.error(
      "Could not create party:",
      error
    );

    setPartySyncStatus(
      "Could not form fellowship.",
      "error"
    );

    showToast(
      "The fellowship could not be created."
    );
  }
}


// =========================================================
// 54. JOIN PARTY FORM
// =========================================================

function showJoinPartyForm() {
  const form =
    $("#joinPartyForm");

  if (!form) {
    return;
  }

  form.hidden =
    false;

  const input =
    $("#partyCodeInput");

  if (input) {
    input.focus();
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
      "The guild connection is unavailable."
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

  if (!input) {
    return;
  }

  const code =
    input.value
      .trim()
      .toUpperCase();

  if (!code) {
    showToast(
      "Enter a fellowship invite code."
    );

    return;
  }

  try {
    setPartySyncStatus(
      "Seeking fellowship..."
    );

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
      setPartySyncStatus(
        "No fellowship found with that code.",
        "error"
      );

      showToast(
        "That fellowship code was not found."
      );

      return;
    }

    const {
      error: membershipError
    } =
      await supabaseClient
        .from("party_members")
        .insert({
          party_id:
            party.id,

          user_id:
            supabaseUser.id
        });

    if (membershipError) {
      throw membershipError;
    }

    currentParty =
      party;

    input.value =
      "";

    await syncProfileToSupabase();

    await refreshParty();

    renderSettings();

    showToast(
      `Joined ${party.name || "the fellowship"}.`
    );
  }

  catch (error) {
    console.error(
      "Could not join party:",
      error
    );

    setPartySyncStatus(
      "Could not join fellowship.",
      "error"
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
    || !supabaseReady
    || !supabaseUser
  ) {
    return;
  }

  const confirmed =
    window.confirm(
      "Leave this fellowship? Your personal character progress will remain."
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

    partyMemberProfileCache.clear();

    await renderParty();

    renderSettings();

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
      "Could not leave the fellowship."
    );
  }
}


// =========================================================
// 57. REFRESH PARTY
// =========================================================

async function refreshParty() {
  if (
    !supabaseReady
    || !supabaseUser
  ) {
    await renderParty();
    return;
  }

  if (!currentParty) {
    await loadCurrentParty();
    return;
  }

  try {
    const [
      members,
      activity
    ] =
      await Promise.all([
        fetchPartyMembers(),
        fetchPartyActivity()
      ]);

    renderPartyMembers(
      members,
      activity
    );

    renderPartyChallenge(
      activity
    );

    renderPartyActivity(
      activity
    );

    await renderPartyTreasure();

    await checkIncomingGifts();

    setPartySyncStatus(
      "Guild connection established.",
      "connected"
    );
  }

  catch (error) {
    console.error(
      "Could not refresh fellowship:",
      error
    );

    setPartySyncStatus(
      "Fellowship sync interrupted.",
      "error"
    );
  }
}


// =========================================================
// 58. RENDER PARTY
// =========================================================

async function renderParty() {
  const emptyState =
    $("#partyEmptyState");

  const dashboard =
    $("#partyDashboard");

  if (!currentParty) {
    partyMemberProfileCache.clear();

    if (emptyState) {
      emptyState.hidden =
        false;
    }

    if (dashboard) {
      dashboard.hidden =
        true;
    }

    const members =
      $("#partyMembers");

    if (members) {
      members.innerHTML =
        "";
    }

    const activity =
      $("#partyActivityList");

    if (activity) {
      activity.innerHTML = `
        <p class="muted">
          No party activity yet.
        </p>
      `;
    }

    return;
  }

  if (emptyState) {
    emptyState.hidden =
      true;
  }

  if (dashboard) {
    dashboard.hidden =
      false;
  }

  const partyName =
    $("#partyName");

  if (partyName) {
    partyName.textContent =
      currentParty.name
      || "The Fellowship";
  }

  const inviteCode =
    $("#partyInviteCode");

  if (inviteCode) {
    inviteCode.textContent =
      currentParty.invite_code
      || "------";
  }

  await refreshParty();
}


// =========================================================
// 59. FETCH PARTY MEMBERS
// =========================================================

async function fetchPartyMembers() {
  if (!currentParty) {
    return [];
  }

  const {
    data: memberships,
    error: membershipError
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

  if (
    !memberships
    || memberships.length === 0
  ) {
    return [];
  }

  const userIds =
    memberships
      .map(
        membership =>
          membership.user_id
      )
      .filter(Boolean);

  const {
    data: profiles,
    error: profileError
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
      (profiles || [])
        .map(profile => [
          profile.user_id,
          profile
        ])
    );

  return memberships.map(
    membership => {
      const profile =
        profileMap.get(
          membership.user_id
        )
        || {};

      return {
        ...membership,
        ...profile,
        user_id:
          membership.user_id
      };
    }
  );
}


// =========================================================
// 60. FETCH PARTY ACTIVITY
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
      .from("quest_activity")
      .select(
        "id, party_id, user_id, display_name, quest_id, quest_title, xp, gold, week_key, created_at"
      )
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
// 61. PARTY MEMBER PROGRESSION
// =========================================================

function getPartyMemberProgress(
  member,
  activity
) {
  const isCurrentPlayer =
    Boolean(
      supabaseUser
      && member.user_id
        === supabaseUser.id
    );

  /*
    For the current device/player, local state is the
    authoritative source for the complete character record.
  */

  if (isCurrentPlayer) {
    const state =
      normalizeWeek();

    const strengthXp =
      Math.max(
        0,
        Number(
          state.xp.strength
        ) || 0
      );

    const enduranceXp =
      Math.max(
        0,
        Number(
          state.xp.endurance
        ) || 0
      );

    const restorationXp =
      Math.max(
        0,
        Number(
          state.xp.restoration
        ) || 0
      );

    return {
      strengthXp,
      enduranceXp,
      restorationXp,

      weeklyQuests:
        state.weeklyCompleted.length,

      totalQuests:
        state.history.length,

      totalXp:
        strengthXp
        + enduranceXp
        + restorationXp
    };
  }

  /*
    Other fellowship members are reconstructed from their
    synced quest activity.

    Boss Battle XP is split back into its actual rewards:
    +50 Strength and +50 Endurance.
  */

  const memberActivity =
    (activity || [])
      .filter(
        item =>
          item.user_id
          === member.user_id
      );

  let strengthXp =
    0;

  let enduranceXp =
    0;

  let restorationXp =
    0;

  for (
    const item
    of memberActivity
  ) {
    if (
      item.quest_id
      === "boss"
    ) {
      strengthXp +=
        BOSS_STRENGTH_XP;

      enduranceXp +=
        BOSS_ENDURANCE_XP;

      continue;
    }

    const quest =
      findQuest(
        item.quest_id
      );

    const xp =
      Math.max(
        0,
        Number(item.xp) || 0
      );

    if (
      quest?.xpType
      === "strength"
    ) {
      strengthXp +=
        xp;
    }

    else if (
      quest?.xpType
      === "endurance"
    ) {
      enduranceXp +=
        xp;
    }

    else if (
      quest?.xpType
      === "restoration"
    ) {
      restorationXp +=
        xp;
    }
  }

  const weeklyQuests =
    memberActivity.filter(
      item =>
        item.week_key
          === getWeekKey()
        && item.quest_id
          !== "boss"
    ).length;

  const totalXp =
    memberActivity.reduce(
      (
        total,
        item
      ) =>
        total
        + Math.max(
          0,
          Number(item.xp) || 0
        ),
      0
    );

  return {
    strengthXp,
    enduranceXp,
    restorationXp,

    weeklyQuests,

    totalQuests:
      memberActivity.length,

    totalXp
  };
}


// =========================================================
// 62. RENDER PARTY MEMBERS
// =========================================================

function renderPartyMembers(
  members,
  activity
) {
  const container =
    $("#partyMembers");

  if (!container) {
    return;
  }

  partyMemberProfileCache.clear();

  if (
    !members
    || members.length === 0
  ) {
    container.innerHTML = `
      <p class="muted">
        No fellowship members found.
      </p>
    `;

    return;
  }

  container.innerHTML =
    members
      .map(member => {
        const isCurrentPlayer =
          Boolean(
            supabaseUser
            && member.user_id
              === supabaseUser.id
          );

        /*
          Older profile rows may not have profile_id.
          For the current player we can safely fall back
          to the locally selected character identity.
        */

        const memberProfileId =
          normalizeProfileId(
            member.profile_id
          )
          || (
            isCurrentPlayer
              ? activeProfileId
              : null
          );

        const character =
          memberProfileId
            ? CHARACTER_PROFILES[
                memberProfileId
              ]
            : null;

        const displayName =
          member.display_name
          || character?.defaultName
          || "Adventurer";

        const className =
          member.class_name
          || character?.className
          || "Unknown Class";

        const progress =
          getPartyMemberProgress(
            member,
            activity
          );

        /*
          Save the exact data used to render this member.
          Clicking the portrait later reads this cache
          instead of doing another network request.
        */

        partyMemberProfileCache.set(
          String(member.user_id),
          {
            ...member,

            profile_id:
              memberProfileId,

            display_name:
              displayName,

            class_name:
              className,

            progress
          }
        );

        const weeklyGold =
          (activity || [])
            .filter(
              item =>
                item.user_id
                  === member.user_id
                && item.week_key
                  === getWeekKey()
            )
            .reduce(
              (
                total,
                item
              ) =>
                total
                + Math.max(
                  0,
                  Number(item.gold)
                  || 0
                ),
              0
            );

        let portraitMarkup;

        if (character?.card) {
          portraitMarkup = `
            <button
              class="party-member-portrait-button"
              type="button"
              data-party-profile-user-id="${escapeHtml(member.user_id)}"
              aria-label="View ${escapeHtml(displayName)} character profile"
            >
              <img
                class="party-member-portrait"
                src="${escapeHtml(character.card)}"
                alt=""
              >
            </button>
          `;
        }

        else {
          const initial =
            String(displayName)
              .trim()
              .charAt(0)
              .toUpperCase()
            || "A";

          portraitMarkup = `
            <button
              class="party-member-portrait-button"
              type="button"
              data-party-profile-user-id="${escapeHtml(member.user_id)}"
              aria-label="View ${escapeHtml(displayName)} character profile"
            >
              <span
                class="party-member-avatar"
                aria-hidden="true"
              >
                ${escapeHtml(initial)}
              </span>
            </button>
          `;
        }

        const giftButton =
          isCurrentPlayer
            ? ""
            : `
              <button
                class="party-gift-button"
                type="button"
                data-gift-user-id="${escapeHtml(member.user_id)}"
                data-gift-name="${escapeHtml(displayName)}"
              >
                Send Gift
              </button>
            `;

        return `
          <article class="party-member-card">
            ${portraitMarkup}

            <div class="party-member-info">
              <strong>
                ${escapeHtml(displayName)}
              </strong>

              <span>
                ${escapeHtml(className)}
              </span>

              <div class="party-member-meta">
                <span>
                  ${progress.weeklyQuests}
                  quest${
                    progress.weeklyQuests
                    === 1
                      ? ""
                      : "s"
                  }
                  this week
                </span>

                <span>
                  ${progress.totalXp} XP
                </span>
              </div>

              ${giftButton}
            </div>

            <div class="party-member-score">
              <strong>
                ${weeklyGold}
              </strong>

              <span>
                Weekly Gold
              </span>
            </div>
          </article>
        `;
      })
      .join("");
}


// =========================================================
// 63. PARTY CHARACTER PROFILE DIALOG
// =========================================================

function renderPartyProfileStat(
  type,
  xp
) {
  const levelData =
    getLevelData(xp);

  const key =
    type.charAt(0)
      .toUpperCase()
    + type.slice(1);

  const level =
    $(
      `#partyProfile${key}Level`
    );

  const bar =
    $(
      `#partyProfile${key}Bar`
    );

  const xpText =
    $(
      `#partyProfile${key}Xp`
    );

  if (level) {
    level.textContent =
      `Lv. ${levelData.level}`;
  }

  if (bar) {
    bar.style.width =
      `${levelData.progress}%`;
  }

  if (xpText) {
    xpText.textContent =
      `${Math.max(
        0,
        Number(xp) || 0
      )} XP`;
  }
}


function openPartyCharacterDialog(
  userId
) {
  const member =
    partyMemberProfileCache.get(
      String(userId)
    );

  if (!member) {
    return;
  }

  const profileId =
    normalizeProfileId(
      member.profile_id
    );

  const character =
    profileId
      ? CHARACTER_PROFILES[
          profileId
        ]
      : null;

  const name =
    member.display_name
    || character?.defaultName
    || "Adventurer";

  const className =
    member.class_name
    || character?.className
    || "Unknown Class";

  const nameElement =
    $("#partyCharacterDialogName");

  if (nameElement) {
    nameElement.textContent =
      name;
  }

  const classElement =
    $("#partyCharacterDialogClass");

  if (classElement) {
    classElement.textContent =
      className;
  }

  const description =
    $("#partyCharacterDialogDescription");

  if (description) {
    description.textContent =
      character?.description
      || (
        "A companion of the fellowship, "
        + "carving a legend one completed "
        + "quest at a time."
      );
  }

  const image =
    $("#partyCharacterDialogImage");

  if (image) {
    if (character?.card) {
      image.src =
        character.card;

      image.alt =
        `${name} - ${className}`;

      image.hidden =
        false;
    }

    else {
      image.removeAttribute(
        "src"
      );

      image.alt =
        "";

      image.hidden =
        true;
    }
  }

  const progress =
    member.progress
    || {
      strengthXp: 0,
      enduranceXp: 0,
      restorationXp: 0,
      weeklyQuests: 0,
      totalQuests: 0,
      totalXp: 0
    };

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

  const weeklyQuests =
    $("#partyProfileWeeklyQuests");

  if (weeklyQuests) {
    weeklyQuests.textContent =
      progress.weeklyQuests;
  }

  const totalQuests =
    $("#partyProfileTotalQuests");

  if (totalQuests) {
    totalQuests.textContent =
      progress.totalQuests;
  }

  const totalXp =
    $("#partyProfileTotalXp");

  if (totalXp) {
    totalXp.textContent =
      progress.totalXp;
  }

  const dialog =
    $("#partyCharacterDialog");

  if (
    dialog
    && !dialog.open
  ) {
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
// 64. GIFTING
// =========================================================

function openGiftDialog(
  userId,
  displayName
) {
  giftRecipient = {
    userId,
    displayName:
      displayName
      || "Adventurer"
  };

  const dialog =
    $("#giftDialog");

  if (!dialog) {
    return;
  }

  const recipient =
    $("#giftRecipientName");

  if (recipient) {
    recipient.textContent =
      giftRecipient.displayName;
  }

  const goldInput =
    $("#giftGoldAmount");

  if (goldInput) {
    goldInput.value =
      "";
  }

  const crystalInput =
    $("#giftCrystalAmount");

  if (crystalInput) {
    crystalInput.value =
      "";
  }

  if (!dialog.open) {
    dialog.showModal();
  }
}


function closeGiftDialog() {
  giftRecipient =
    null;

  giftSending =
    false;

  const dialog =
    $("#giftDialog");

  if (dialog?.open) {
    dialog.close();
  }
}


// =========================================================
// 65. SEND GIFT
// =========================================================

async function sendGift() {
  if (giftSending) {
    return;
  }

  if (
    !giftRecipient
    || !currentParty
    || !supabaseReady
    || !supabaseUser
  ) {
    showToast(
      "The gift could not be sent."
    );

    return;
  }

  const goldInput =
    $("#giftGoldAmount");

  const crystalInput =
    $("#giftCrystalAmount");

  const gold =
    Math.max(
      0,
      Math.floor(
        Number(
          goldInput?.value
        ) || 0
      )
    );

  const crystals =
    Math.max(
      0,
      Math.floor(
        Number(
          crystalInput?.value
        ) || 0
      )
    );

  if (
    gold <= 0
    && crystals <= 0
  ) {
    showToast(
      "Choose some Gold or Crystals to send."
    );

    return;
  }

  const state =
    getState();

  if (
    gold
    > (Number(state.gold) || 0)
  ) {
    showToast(
      "You do not have enough Gold."
    );

    return;
  }

  if (
    crystals
    > (Number(state.crystals) || 0)
  ) {
    showToast(
      "You do not have enough Crystals."
    );

    return;
  }

  giftSending =
    true;

  const settings =
    getSettings();

  try {
    const {
      error
    } =
      await supabaseClient
        .from("party_gifts")
        .insert({
          party_id:
            currentParty.id,

          sender_user_id:
            supabaseUser.id,

          recipient_user_id:
            giftRecipient.userId,

          sender_name:
            settings.playerName
            || getCharacterConfig()
              .defaultName,

          gold,

          crystals
        });

    if (error) {
      throw error;
    }

    state.gold =
      Math.max(
        0,
        (Number(state.gold) || 0)
        - gold
      );

    state.crystals =
      Math.max(
        0,
        (Number(state.crystals) || 0)
        - crystals
      );

    saveState(state);

    const recipientName =
      giftRecipient.displayName;

    closeGiftDialog();

    render();

    showToast(
      `Gift sent to ${recipientName}.`
    );

    await refreshParty();
  }

  catch (error) {
    giftSending =
      false;

    console.error(
      "Could not send gift:",
      error
    );

    showToast(
      "The gift could not be sent."
    );
  }
}


// =========================================================
// 66. RECEIVE GIFTS
// =========================================================

async function checkIncomingGifts() {
  if (
    checkingIncomingGifts
    || !supabaseReady
    || !supabaseUser
    || !currentParty
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
        .select(
          "id, sender_user_id, recipient_user_id, sender_name, gold, crystals, created_at"
        )
        .eq(
          "party_id",
          currentParty.id
        )
        .eq(
          "recipient_user_id",
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
      (data || [])
        .filter(
          gift =>
            !claimed.has(
              String(gift.id)
            )
        );

    if (
      newGifts.length === 0
    ) {
      return;
    }

    let totalGold =
      0;

    let totalCrystals =
      0;

    for (
      const gift
      of newGifts
    ) {
      totalGold +=
        Math.max(
          0,
          Number(gift.gold) || 0
        );

      totalCrystals +=
        Math.max(
          0,
          Number(gift.crystals) || 0
        );

      claimed.add(
        String(gift.id)
      );
    }

    state.gold =
      (Number(state.gold) || 0)
      + totalGold;

    state.crystals =
      (Number(state.crystals) || 0)
      + totalCrystals;

    state.claimedGiftIds =
      Array.from(claimed);

    saveState(state);

    render();

    showIncomingGiftNotification(
      newGifts,
      totalGold,
      totalCrystals
    );
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
// 67. GIFT NOTIFICATION
// =========================================================

function showIncomingGiftNotification(
  gifts,
  totalGold,
  totalCrystals
) {
  const senders =
    Array.from(
      new Set(
        gifts
          .map(
            gift =>
              gift.sender_name
          )
          .filter(Boolean)
      )
    );

  const senderText =
    senders.length === 1
      ? senders[0]
      : senders.length > 1
        ? "your fellowship"
        : "a fellowship member";

  const rewards =
    [];

  if (totalGold > 0) {
    rewards.push(
      `${totalGold} Gold`
    );
  }

  if (totalCrystals > 0) {
    rewards.push(
      `${totalCrystals} Crystal${
        totalCrystals === 1
          ? ""
          : "s"
      }`
    );
  }

  showToast(
    `${senderText} sent you ${rewards.join(" and ")}.`
  );
}


// =========================================================
// 68. TREASURE INVENTORY
// =========================================================

async function fetchPartyTreasureInventory() {
  if (
    !currentParty
    || !supabaseReady
  ) {
    return [];
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from("party_treasure")
      .select(
        "id, party_id, treasure_id, quantity, created_at"
      )
      .eq(
        "party_id",
        currentParty.id
      );

  if (error) {
    /*
      Older database versions may not yet have the
      treasure table. Party functionality should keep
      working even when treasure is unavailable.
    */

    console.warn(
      "Party treasure unavailable:",
      error
    );

    return [];
  }

  return data || [];
}


// =========================================================
// 69. PARTY BONUS
// =========================================================

async function fetchPartyBonus() {
  if (
    !currentParty
    || !supabaseReady
  ) {
    return 0;
  }

  try {
    const {
      data,
      error
    } =
      await supabaseClient
        .from("party_bonus")
        .select(
          "bonus_points"
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

    return Math.max(
      0,
      Number(
        data?.bonus_points
      ) || 0
    );
  }

  catch (error) {
    console.warn(
      "Party bonus unavailable:",
      error
    );

    return 0;
  }
}


// =========================================================
// 70. RENDER PARTY TREASURE
// =========================================================

async function renderPartyTreasure() {
  const container =
    $("#partyTreasureGrid");

  if (!container) {
    return;
  }

  if (!currentParty) {
    container.innerHTML =
      "";

    return;
  }

  const inventory =
    await fetchPartyTreasureInventory();

  const total =
    inventory.reduce(
      (
        sum,
        item
      ) =>
        sum
        + Math.max(
          0,
          Number(item.quantity)
          || 0
        ),
      0
    );

  const totalElement =
    $("#partyTreasureTotal");

  if (totalElement) {
    totalElement.textContent =
      total;
  }

  const available =
    inventory
      .filter(
        item =>
          Number(item.quantity)
          > 0
      );

  if (
    available.length === 0
  ) {
    container.innerHTML = `
      <p class="muted">
        No fellowship treasure has been discovered yet.
      </p>
    `;

    return;
  }

  container.innerHTML =
    available
      .map(item => {
        const treasure =
          PARTY_TREASURES[
            item.treasure_id
          ];

        if (!treasure) {
          return "";
        }

        const quantity =
          Math.max(
            0,
            Number(item.quantity)
            || 0
          );

        return `
          <button
            class="party-treasure-card"
            type="button"
            data-party-treasure-id="${escapeHtml(item.treasure_id)}"
            data-rarity="${escapeHtml(
              String(
                treasure.rarity
                || "common"
              ).toLowerCase()
            )}"
          >
            <img
              class="party-treasure-art"
              src="${escapeHtml(treasure.image)}"
              alt=""
            >

            <span class="party-treasure-info">
              <strong>
                ${escapeHtml(treasure.name)}
              </strong>

              <p>
                ${escapeHtml(treasure.description)}
              </p>

              <span class="party-treasure-meta">
                <span class="party-treasure-badge">
                  ${escapeHtml(treasure.rarity)}
                </span>

                <span class="party-treasure-badge">
                  ×${quantity}
                </span>
              </span>
            </span>
          </button>
        `;
      })
      .join("");
}


// =========================================================
// 71. AWARD BOSS TREASURE
// =========================================================

async function awardPartyBossTreasure() {
  if (
    !currentParty
    || !supabaseReady
    || !supabaseUser
  ) {
    return;
  }

  /*
    Treasure rarity is intentionally weighted.
    Boss victories can occasionally produce something
    significantly more valuable.
  */

  const roll =
    Math.random();

  let treasureId;

  if (roll < 0.5) {
    treasureId =
      "fellowship-token";
  }

  else if (roll < 0.78) {
    treasureId =
      "banner-of-plenty";
  }

  else if (roll < 0.94) {
    treasureId =
      "crystal-parcel";
  }

  else {
    treasureId =
      "rallying-horn";
  }

  try {
    const {
      data: existing,
      error: fetchError
    } =
      await supabaseClient
        .from("party_treasure")
        .select(
          "id, quantity"
        )
        .eq(
          "party_id",
          currentParty.id
        )
        .eq(
          "treasure_id",
          treasureId
        )
        .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (existing) {
      const {
        error
      } =
        await supabaseClient
          .from("party_treasure")
          .update({
            quantity:
              (Number(
                existing.quantity
              ) || 0)
              + 1
          })
          .eq(
            "id",
            existing.id
          );

      if (error) {
        throw error;
      }
    }

    else {
      const {
        error
      } =
        await supabaseClient
          .from("party_treasure")
          .insert({
            party_id:
              currentParty.id,

            treasure_id:
              treasureId,

            quantity:
              1
          });

      if (error) {
        throw error;
      }
    }

    const treasure =
      PARTY_TREASURES[
        treasureId
      ];

    if (treasure) {
      showToast(
        `Fellowship treasure discovered: ${treasure.name}.`
      );
    }
  }

  catch (error) {
    console.warn(
      "Could not award party treasure:",
      error
    );
  }
}


// =========================================================
// 72. USE PARTY TREASURE
// =========================================================

async function usePartyTreasure(
  treasureId
) {
  if (
    partyTreasureUsing
    || !currentParty
    || !supabaseReady
  ) {
    return;
  }

  const treasure =
    PARTY_TREASURES[
      treasureId
    ];

  if (!treasure) {
    return;
  }

  partyTreasureUsing =
    true;

  try {
    const {
      data: inventoryItem,
      error: inventoryError
    } =
      await supabaseClient
        .from("party_treasure")
        .select(
          "id, quantity"
        )
        .eq(
          "party_id",
          currentParty.id
        )
        .eq(
          "treasure_id",
          treasureId
        )
        .maybeSingle();

    if (inventoryError) {
      throw inventoryError;
    }

    const quantity =
      Math.max(
        0,
        Number(
          inventoryItem?.quantity
        ) || 0
      );

    if (
      !inventoryItem
      || quantity <= 0
    ) {
      showToast(
        "That treasure is no longer available."
      );

      return;
    }

    if (
      treasureId
      === "fellowship-token"
      || treasureId
      === "rallying-horn"
    ) {
      const bonus =
        treasureId
        === "fellowship-token"
          ? 1
          : 3;

      await addPartyBonus(
        bonus
      );
    }

    else if (
      treasureId
      === "banner-of-plenty"
    ) {
      await awardTreasureGiftToParty({
        gold:
          15,

        crystals:
          0,

        treasureName:
          treasure.name
      });
    }

    else if (
      treasureId
      === "crystal-parcel"
    ) {
      await awardTreasureGiftToParty({
        gold:
          0,

        crystals:
          1,

        treasureName:
          treasure.name
      });
    }

    const newQuantity =
      quantity - 1;

    const {
      error: updateError
    } =
      await supabaseClient
        .from("party_treasure")
        .update({
          quantity:
            newQuantity
        })
        .eq(
          "id",
          inventoryItem.id
        );

    if (updateError) {
      throw updateError;
    }

    showToast(
      `${treasure.name} used.`
    );

    await refreshParty();
  }

  catch (error) {
    console.error(
      "Could not use party treasure:",
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


async function addPartyBonus(
  amount
) {
  const weekKey =
    getWeekKey();

  const {
    data: existing,
    error: fetchError
  } =
    await supabaseClient
      .from("party_bonus")
      .select(
        "id, bonus_points"
      )
      .eq(
        "party_id",
        currentParty.id
      )
      .eq(
        "week_key",
        weekKey
      )
      .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  if (existing) {
    const {
      error
    } =
      await supabaseClient
        .from("party_bonus")
        .update({
          bonus_points:
            (Number(
              existing.bonus_points
            ) || 0)
            + amount
        })
        .eq(
          "id",
          existing.id
        );

    if (error) {
      throw error;
    }
  }

  else {
    const {
      error
    } =
      await supabaseClient
        .from("party_bonus")
        .insert({
          party_id:
            currentParty.id,

          week_key:
            weekKey,

          bonus_points:
            amount
        });

    if (error) {
      throw error;
    }
  }
}


async function awardTreasureGiftToParty({
  gold = 0,
  crystals = 0,
  treasureName = "Fellowship Treasure"
}) {
  const members =
    await fetchPartyMembers();

  const recipients =
    members.filter(
      member =>
        member.user_id
        !== supabaseUser?.id
    );

  /*
    The user activating the treasure receives the reward
    immediately. Everyone else receives it through the
    existing cross-device gift system.
  */

  const state =
    getState();

  state.gold =
    (Number(state.gold) || 0)
    + gold;

  state.crystals =
    (Number(state.crystals) || 0)
    + crystals;

  saveState(state);

  if (
    recipients.length === 0
  ) {
    render();
    return;
  }

  const rows =
    recipients.map(member => ({
      party_id:
        currentParty.id,

      sender_user_id:
        supabaseUser.id,

      recipient_user_id:
        member.user_id,

      sender_name:
        treasureName,

      gold,

      crystals
    }));

  const {
    error
  } =
    await supabaseClient
      .from("party_gifts")
      .insert(rows);

  if (error) {
    throw error;
  }

  render();
}


// =========================================================
// 73. PARTY CHALLENGE
// =========================================================

async function renderPartyChallenge(
  activity
) {
  const currentWeek =
    getWeekKey();

  const weeklyActivity =
    (activity || [])
      .filter(
        item =>
          item.week_key
          === currentWeek
        && item.quest_id
          !== "boss"
      );

  const uniqueQuestActivity =
    new Set(
      weeklyActivity.map(
        item =>
          `${item.user_id}:${item.id}`
      )
    );

  const questCount =
    uniqueQuestActivity.size;

  const bonus =
    await fetchPartyBonus();

  const combinedProgress =
    questCount
    + bonus;

  /*
    The original fellowship challenge target remains six.
  */

  const target =
    6;

  const percentage =
    Math.min(
      100,
      (
        combinedProgress
        / target
      ) * 100
    );

  const progress =
    $("#partyChallengeProgress");

  if (progress) {
    progress.style.width =
      `${percentage}%`;
  }

  const count =
    $("#partyChallengeCount");

  if (count) {
    count.textContent =
      `${combinedProgress} / ${target}`;
  }

  const status =
    $("#partyChallengeStatus");

  if (status) {
    if (
      combinedProgress >= target
    ) {
      status.textContent =
        "Fellowship challenge conquered.";
    }

    else if (bonus > 0) {
      status.textContent =
        `${target - combinedProgress} remaining. Treasure has added ${bonus} bonus point${bonus === 1 ? "" : "s"}.`;
    }

    else {
      status.textContent =
        `${target - combinedProgress} fellowship quest${
          target - combinedProgress === 1
            ? ""
            : "s"
        } remaining.`;
    }
  }

  /*
    Award the Fellowship Pin once the shared challenge
    has been conquered.
  */

  if (
    combinedProgress >= target
    && !isRelicDiscovered(
      "fellowship-pin"
    )
  ) {
    discoverRelic(
      "fellowship-pin"
    );
  }
}


// =========================================================
// 74. PARTY ACTIVITY
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
    !activity
    || activity.length === 0
  ) {
    container.innerHTML = `
      <p class="muted">
        No fellowship activity yet.
      </p>
    `;

    return;
  }

  container.innerHTML =
    activity
      .slice(0, 12)
      .map(item => {
        const name =
          item.display_name
          || "Adventurer";

        const questTitle =
          item.quest_title
          || findQuest(
            item.quest_id
          )?.title
          || "a quest";

        const xp =
          Math.max(
            0,
            Number(item.xp)
            || 0
          );

        const gold =
          Math.max(
            0,
            Number(item.gold)
            || 0
          );

        const rewards =
          [];

        if (xp > 0) {
          rewards.push(
            `${xp} XP`
          );
        }

        if (gold > 0) {
          rewards.push(
            `${gold} Gold`
          );
        }

        return `
          <article class="party-activity-item">
            <strong>
              ${escapeHtml(name)}
            </strong>

            <p>
              Completed
              ${escapeHtml(questTitle)}
              ${
                rewards.length
                  ? ` · +${escapeHtml(rewards.join(" · +"))}`
                  : ""
              }
            </p>

            ${
              item.created_at
                ? `
                  <time>
                    ${escapeHtml(
                      formatDate(
                        item.created_at
                      )
                    )}
                  </time>
                `
                : ""
            }
          </article>
        `;
      })
      .join("");
}


// =========================================================
// 75. PARTY STATUS
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
// 76. PARTY REFRESH LOOP
// =========================================================

function startPartyRefreshLoop() {
  if (partyRefreshTimer) {
    clearInterval(
      partyRefreshTimer
    );
  }

  partyRefreshTimer =
    window.setInterval(
      () => {
        if (
          document.visibilityState
            !== "visible"
          || !currentParty
          || !supabaseReady
        ) {
          return;
        }

        refreshParty();
      },
      PARTY_REFRESH_INTERVAL
    );
}


// =========================================================
// 77. TOAST
// =========================================================

function showToast(
  message
) {
  let container =
    $("#toastStack");

  if (!container) {
    container =
      document.createElement(
        "div"
      );

    container.id =
      "toastStack";

    container.className =
      "toast-stack";

    container.setAttribute(
      "aria-live",
      "polite"
    );

    document.body.appendChild(
      container
    );
  }

  container.innerHTML =
    "";

  const toast =
    document.createElement(
      "div"
    );

  toast.className =
    "toast";

  toast.textContent =
    message;

  container.appendChild(
    toast
  );

  if (toastTimeout) {
    clearTimeout(
      toastTimeout
    );
  }

  toastTimeout =
    window.setTimeout(
      () => {
        toast.remove();
      },
      4200
    );
}


// =========================================================
// 78. UTILITIES
// =========================================================

function escapeHtml(value) {
  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}


function capitalizeWords(value) {
  return String(
    value || ""
  )
    .replace(
      /[-_]+/g,
      " "
    )
    .replace(
      /\b\w/g,
      character =>
        character.toUpperCase()
    );
}


function formatDate(value) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date.toLocaleDateString(
    undefined,
    {
      month:
        "short",

      day:
        "numeric",

      year:
        date.getFullYear()
        !== new Date().getFullYear()
          ? "numeric"
          : undefined
    }
  );
}


// =========================================================
// 79. MAIN EVENTS
// =========================================================

function bindMainEvents() {
  $$("[data-nav-view]")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          setActiveView(
            button.dataset.navView
          );
        }
      );
    });

  $("#closeQuestButton")
    ?.addEventListener(
      "click",
      closeQuest
    );

  $("#completeQuestButton")
    ?.addEventListener(
      "click",
      completeQuest
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

  $("#closeBossVictoryButton")
    ?.addEventListener(
      "click",
      closeBossVictoryDialog
    );

  $("#claimBossRewardButton")
    ?.addEventListener(
      "click",
      claimBossReward
    );

  $("#closeRelicDialogButton")
    ?.addEventListener(
      "click",
      closeRelicDialog
    );
}


// =========================================================
// 80. SETTINGS EVENTS
// =========================================================

function bindSettingsEvents() {
  $("#savePlayerNameButton")
    ?.addEventListener(
      "click",
      savePlayerName
    );

  $("#playerNameInput")
    ?.addEventListener(
      "keydown",
      event => {
        if (
          event.key
          === "Enter"
        ) {
          event.preventDefault();

          savePlayerName();
        }
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
      saveReducedMotion
    );

  $("#soundEnabledToggle")
    ?.addEventListener(
      "change",
      saveSoundSetting
    );

  $("#resetWeekButton")
    ?.addEventListener(
      "click",
      resetWeek
    );

  $("#clearHistoryButton")
    ?.addEventListener(
      "click",
      clearHistory
    );

  $("#resetCharacterButton")
    ?.addEventListener(
      "click",
      resetCharacter
    );
}


// =========================================================
// 81. PARTY EVENTS
// =========================================================

function bindPartyEvents() {
  $("#createPartyButton")
    ?.addEventListener(
      "click",
      createParty
    );

  $("#showJoinPartyButton")
    ?.addEventListener(
      "click",
      showJoinPartyForm
    );

  $("#joinPartyButton")
    ?.addEventListener(
      "click",
      joinParty
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

          joinParty();
        }
      }
    );

  $("#leavePartyButton")
    ?.addEventListener(
      "click",
      leaveParty
    );

  $("#partyMembers")
    ?.addEventListener(
      "click",
      event => {
        /*
          Portrait clicks open the full character profile.
          This is intentionally handled before gifting so
          the two controls remain completely independent.
        */

        const profileButton =
          event.target.closest(
            "[data-party-profile-user-id]"
          );

        if (profileButton) {
          openPartyCharacterDialog(
            profileButton.dataset
              .partyProfileUserId
          );

          return;
        }

        const giftButton =
          event.target.closest(
            "[data-gift-user-id]"
          );

        if (!giftButton) {
          return;
        }

        openGiftDialog(
          giftButton.dataset
            .giftUserId,

          giftButton.dataset
            .giftName
        );
      }
    );

  $("#closeGiftDialogButton")
    ?.addEventListener(
      "click",
      closeGiftDialog
    );

  $("#sendGiftButton")
    ?.addEventListener(
      "click",
      sendGift
    );

  /*
    New Fellowship character dialog controls.
  */

  $("#closePartyCharacterButton")
    ?.addEventListener(
      "click",
      closePartyCharacterDialog
    );

  $("#partyCharacterDialog")
    ?.addEventListener(
      "click",
      event => {
        if (
          event.target
          === $("#partyCharacterDialog")
        ) {
          closePartyCharacterDialog();
        }
      }
    );

  $("#partyCharacterDialog")
    ?.addEventListener(
      "cancel",
      event => {
        event.preventDefault();

        closePartyCharacterDialog();
      }
    );
}


// =========================================================
// 82. TREASURE EVENTS
// =========================================================

function bindTreasureEvents() {
  $("#partyTreasureGrid")
    ?.addEventListener(
      "click",
      event => {
        const button =
          event.target.closest(
            "[data-party-treasure-id]"
          );

        if (!button) {
          return;
        }

        const treasureId =
          button.dataset
            .partyTreasureId;

        const treasure =
          PARTY_TREASURES[
            treasureId
          ];

        if (!treasure) {
          return;
        }

        const confirmed =
          window.confirm(
            `Use ${treasure.name}?\n\n${treasure.description}`
          );

        if (!confirmed) {
          return;
        }

        usePartyTreasure(
          treasureId
        );
      }
    );
}


// =========================================================
// 83. RELIC EVENTS
// =========================================================

function bindRelicEvents() {
  $("#relicGrid")
    ?.addEventListener(
      "click",
      event => {
        const button =
          event.target.closest(
            "[data-relic-id]"
          );

        if (!button) {
          return;
        }

        const relic =
          getRelicById(
            button.dataset.relicId
          );

        if (!relic) {
          return;
        }

        if (
          !isRelicDiscovered(
            relic.id
          )
        ) {
          return;
        }

        queueRelicReveal(
          relic
        );
      }
    );

  $$("[data-relic-filter]")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => {
          activeRelicFilter =
            button.dataset
              .relicFilter
            || "all";

          renderRelics();
        }
      );
    });
}


// =========================================================
// 84. OUTSIDE DIALOG CLICKS
// =========================================================

function bindOutsideDialogClicks() {
  $("#questDialog")
    ?.addEventListener(
      "click",
      event => {
        if (
          event.target
          === $("#questDialog")
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
          === $("#giftDialog")
        ) {
          closeGiftDialog();
        }
      }
    );

  $("#bossVictoryDialog")
    ?.addEventListener(
      "click",
      event => {
        if (
          event.target
          === $("#bossVictoryDialog")
        ) {
          closeBossVictoryDialog();
        }
      }
    );
}


// =========================================================
// 85. LOCK / ESCAPE HANDLING
// =========================================================

function handleEscapeKey(
  event
) {
  if (
    event.key !== "Escape"
  ) {
    return;
  }

  /*
    The fellowship character inspector gets first priority.
  */

  if (
    $("#partyCharacterDialog")
      ?.open
  ) {
    closePartyCharacterDialog();

    return;
  }

  if (
    $("#questDialog")
      ?.open
  ) {
    closeQuest();

    return;
  }

  if (
    $("#giftDialog")
      ?.open
  ) {
    closeGiftDialog();

    return;
  }

  if (
    $("#bossVictoryDialog")
      ?.open
  ) {
    closeBossVictoryDialog();

    return;
  }

  if (
    $("#relicDialog")
      ?.open
  ) {
    closeRelicDialog();
  }
}


function bindEscapeHandling() {
  document.addEventListener(
    "keydown",
    handleEscapeKey
  );
}


// =========================================================
// 86. VISIBILITY / TIMER RESTORE
// =========================================================

function handleVisibilityChange() {
  if (
    document.visibilityState
    !== "visible"
  ) {
    return;
  }

  updateTimerDisplay();
  updateTimerButtons();

  if (
    currentParty
    && supabaseReady
  ) {
    refreshParty();
  }
}


function restoreTimer() {
  const timer =
    getTimerState();

  if (!timer) {
    updateTimerDisplay();
    updateTimerButtons();

    return;
  }

  updateTimerDisplay();

  if (!timer.paused) {
    if (timerInterval) {
      clearInterval(
        timerInterval
      );
    }

    timerInterval =
      window.setInterval(
        updateTimerDisplay,
        1000
      );
  }

  updateTimerButtons();
}


// =========================================================
// 87. INITIALIZE
// =========================================================

async function initializeApp() {
  if (appInitialized) {
    return;
  }

  appInitialized =
    true;

  chooseProfile();

  /*
    Apply the selected character immediately so the app
    doesn't briefly flash the wrong theme/profile.
  */

  const character =
    getCharacterConfig();

  document.body.dataset.profile =
    activeProfileId;

  document.body.dataset.theme =
    character.theme;

  bindMainEvents();
  bindSettingsEvents();
  bindPartyEvents();
  bindTreasureEvents();
  bindRelicEvents();
  bindOutsideDialogClicks();
  bindEscapeHandling();

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );

  restoreTimer();

  renderViewHeaders();
  render();

  await initializeSupabase();

  /*
    Supabase initialization can establish an existing
    fellowship, so render once more afterward.
  */

  renderSettings();

  if (currentParty) {
    await refreshParty();
  }
}


if (
  document.readyState
  === "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializeApp,
    {
      once: true
    }
  );
}

else {
  initializeApp();
}