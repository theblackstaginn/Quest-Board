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