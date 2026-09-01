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
    time: "15â25 min",
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
    time: "10â20 min",
    xpType: "strength",
    xp: 25,
    gold: 15,
    description:
      "A simple dumbbell and kettlebell strength quest. Complete two rounds for a short session or three to four rounds for the full quest.",
    exercises: [
      "Goblet squat â 8â12 reps",
      "One-arm dumbbell row â 8â12 reps each side",
      "Dumbbell bench press â 8â12 reps",
      "Romanian deadlift â 8â12 reps",
      "Plank â 20â40 seconds"
    ]
  },

  {
    id: "dragonstrength",
    title: "DragonStrength",
    category: "Strength",
    time: "10â20 min",
    xpType: "strength",
    xp: 30,
    gold: 20,
    description:
      "Barbell and rack training. Keep the movement controlled and leave a little strength in reserve.",
    exercises: [
      "Barbell squat â 8â10 reps",
      "Bench press â 8â10 reps",
      "Barbell Romanian deadlift â 8â10 reps",
      "Cable row or lat pulldown â 10â12 reps",
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
      "20â30 second plank",
      "Repeat until 10 minutes is complete"
    ]
  },

  {
    id: "restoration",
    title: "Restoration",
    category: "Recovery",
    time: "10â20 min",
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
    time: "20â30 min",
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
    time: "30â45 min",
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
  secret: "badges/secret-achievement.webp"
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
    flavor: "Proof that every great journey begins with a single step.",
    rarity: "common",
    source: "quest",
    condition: stats => stats.totalQuests >= 1
  },
  {
    id: "wanderers-compass",
    name: "Wanderer's Compass",
    image: "relics/wanderers-compass.webp",
    flavor: "Always points the way, even when the path is hidden.",
    rarity: "common",
    source: "quest",
    condition: stats => stats.totalQuests >= 3
  },
  {
    id: "sprout-of-perseverence",
    name: "Sprout of Perseverance",
    image: "relics/sprout-of-perseverence.webp",
    flavor: "A living reminder that discipline takes root within.",
    rarity: "uncommon",
    source: "week",
    condition: stats => stats.hasConqueredWeek
  },
  {
    id: "lantern-of-guidance",
    name: "Lantern of Guidance",
    image: "relics/lantern-of-guidance.webp",
    flavor: "Its light reveals the next step when all else is lost.",
    rarity: "uncommon",
    source: "quest",
    condition: stats => stats.totalQuests >= 5
  },
  {
    id: "elixir-of-vitality",
    name: "Elixir of Vitality",
    image: "relics/elixir-of-vitality.webp",
    flavor: "A sip restores more than strength; it rekindles the will to continue.",
    rarity: "uncommon",
    source: "quest",
    condition: stats => stats.restorationQuests >= 5
  },
  {
    id: "stone-of-resolve",
    name: "Stone of Resolve",
    image: "relics/stone-of-resolve.webp",
    flavor: "Steady as stone. Willpower carved into your core.",
    rarity: "rare",
    source: "quest",
    condition: stats => stats.totalQuests >= 10
  },
  {
    id: "band-of-inner-focus",
    name: "Band of Inner Focus",
    image: "relics/band-of-inner-focus.webp",
    flavor: "Still the mind. Sharpen the purpose. Let nothing pull you from your path.",
    rarity: "rare",
    source: "quest",
    condition: stats => stats.rogueQuests >= 5
  },
  {
    id: "forgebound-hammer",
    name: "Forgebound Hammer",
    image: "relics/forgebound-hammer.webp",
    flavor: "Molded in fire. Built for those who shape their fate.",
    rarity: "rare",
    source: "quest",
    condition: stats => stats.strengthQuests >= 10
  },
  {
    id: "stone-of-harmony",
    name: "Stone of Harmony",
    image: "relics/stone-of-harmony.webp",
    flavor: "Balance is power. Let it steady your heart and your hand.",
    rarity: "rare",
    source: "level",
    condition: stats => stats.minimumStatLevel >= 3
  },
  {
    id: "fellowship-pin",
    name: "Fellowship Pin",
    image: "relics/fellowship-pin.webp",
    flavor: "Strength is multiplied when hearts are aligned.",
    rarity: "rare",
    source: "party",
    manual: true
  },
  {
    id: "ravens-oath",
    name: "Raven's Oath",
    image: "relics/ravens-oath.webp",
    flavor: "Swear your purpose to the night. Let nothing break it.",
    rarity: "epic",
    source: "boss",
    condition: stats => stats.bossesDefeated >= 1
  },
  {
    id: "cloak-of-endurance",
    name: "Cloak of Endurance",
    image: "relics/cloak-of-endurance.webp",
    flavor: "Weathered by time, it shields those who never turn back.",
    rarity: "epic",
    source: "quest",
    condition: stats => stats.enduranceQuests >= 10
  },
  {
    id: "mask-of-the-wild",
    name: "Mask of the Wild",
    image: "relics/mask-of-the-wild.webp",
    flavor: "Wear it to move unseen, and to hear what others cannot.",
    rarity: "epic",
    source: "quest",
    condition: stats => stats.rangerQuests >= 10
  },
  {
    id: "scribe-of-destiny",
    name: "Scribe of Destiny",
    image: "relics/scribe-of-destiny.webp",
    flavor: "Record your deeds. The ink of today writes the legend of tomorrow.",
    rarity: "epic",
    source: "secret",
    condition: stats => stats.uniqueCoreQuests >= QUESTS.length
  },
  {
    id: "wardens-totem",
    name: "Warden's Totem",
    image: "relics/wardens-totem.webp",
    flavor: "The guardians watch favorably upon the persistent.",
    rarity: "epic",
    source: "quest",
    condition: stats => stats.totalQuests >= 50
  },
  {
    id: "hourglass-of-discipline",
    name: "Hourglass of Discipline",
    image: "relics/hourglass-of-discipline.webp",
    flavor: "Time obeys focus. Spend it well, and be unstoppable.",
    rarity: "legendary",
    source: "quest",
    condition: stats => stats.totalQuests >= 25
  },
  {
    id: "dreamweavers-loop",
    name: "Dreamweaver's Loop",
    image: "relics/dreamweavers-loop.webp",
    flavor: "Protects your rest, weaving clarity into dreams.",
    rarity: "legendary",
    source: "level",
    condition: stats => stats.maximumStatLevel >= 5
  },
  {
    id: "chalice-of-renewal",
    name: "Chalice of Renewal",
    image: "relics/chalice-of-renewal.webp",
    flavor: "From its depths flows hope. Drink, and rise again.",
    rarity: "legendary",
    source: "quest",
    condition: stats => stats.restorationQuests >= 15
  },
  {
    id: "journal-of-growth",
    name: "Journal of Growth",
    image: "relics/journal-of-growth.webp",
    flavor: "Every challenge faced, every lesson learned becomes the wisdom you carry.",
    rarity: "legendary",
    source: "quest",
    condition: stats => stats.totalQuests >= 75
  },
  {
    id: "compass-of-true-north",
    name: "Compass of True North",
    image: "relics/compass-of-true-north.webp",
    flavor: "When lost, it points you back to what truly matters.",
    rarity: "legendary",
    source: "quest",
    condition: stats => stats.totalQuests >= 100
  },
  {
    id: "oracles-gaze",
    name: "Oracle's Gaze",
    image: "relics/oracles-gaze.webp",
    flavor: "See beyond the fog. Trust the vision within.",
    rarity: "mythic",
    source: "boss",
    condition: stats => stats.bossesDefeated >= 5
  },
  {
    id: "tome-of-growth",
    name: "Tome of Growth",
    image: "relics/tome-of-growth.webp",
    flavor: "Every challenge faced writes a new chapter.",
    rarity: "mythic",
    source: "level",
    condition: stats => stats.minimumStatLevel >= 10
  },
  {
    id: "shard-of-resolve",
    name: "Shard of Resolve",
    image: "relics/shard-of-resolve.webp",
    flavor: "A piece of unbreakable spirit. Hold fast, no matter the storm.",
    rarity: "mythic",
    source: "level",
    condition: stats => stats.strengthLevel >= 10
  },
  {
    id: "heart-of-ascension",
    name: "Heart of Ascension",
    image: "relics/heart-of-ascension.webp",
    flavor: "Forged in struggle. You rise stronger.",
    rarity: "mythic",
    source: "quest",
    condition: stats => stats.totalQuests >= 250
  }
];


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
  localStorage.getItem("questBoardActiveView")
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

function getRelicById(id) {
  return RELICS.find(
    relic => relic.id === id
  ) || null;
}

function getRelicStats(state) {
  const normalHistory =
    state.history.filter(
      item => item.questId !== "boss"
    );

  const strengthQuests =
    normalHistory.filter(
      item => item.xpType === "strength"
    ).length;

  const enduranceQuests =
    normalHistory.filter(
      item => item.xpType === "endurance"
    ).length;

  const restorationQuests =
    normalHistory.filter(
      item => item.xpType === "restoration"
    ).length;

  const rogueQuests =
    normalHistory.filter(
      item => item.questId === "rogue"
    ).length;

  const rangerQuests =
    normalHistory.filter(
      item => item.questId === "ranger"
    ).length;

  const uniqueCoreQuests =
    new Set(
      normalHistory
        .map(item => item.questId)
        .filter(
          questId =>
            QUESTS.some(
              quest => quest.id === questId
            )
        )
    ).size;

  const bossesDefeated =
    state.history.filter(
      item => item.questId === "boss"
    ).length;

  const strengthLevel =
    getLevelData(state.xp.strength).level;

  const enduranceLevel =
    getLevelData(state.xp.endurance).level;

  const restorationLevel =
    getLevelData(state.xp.restoration).level;

  const levels = [
    strengthLevel,
    enduranceLevel,
    restorationLevel
  ];

  return {
    totalQuests: normalHistory.length,
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
    minimumStatLevel: Math.min(...levels),
    maximumStatLevel: Math.max(...levels),
    hasConqueredWeek:
      Boolean(state.weekConqueredRewardWeek)
  };
}

function discoverEligibleRelics(state) {
  const discovered =
    new Set(state.discoveredRelics || []);

  const stats =
    getRelicStats(state);

  const newlyDiscovered = [];

  for (const relic of RELICS) {
    if (
      relic.manual
      || discovered.has(relic.id)
      || typeof relic.condition !== "function"
      || !relic.condition(stats)
    ) {
      continue;
    }

    discovered.add(relic.id);
    newlyDiscovered.push(relic.id);

    state.relicDiscoveryDates[relic.id] =
      state.relicDiscoveryDates[relic.id]
      || new Date().toISOString();
  }

  if (newlyDiscovered.length > 0) {
    state.discoveredRelics =
      Array.from(discovered);

    saveState(state);
  }

  return newlyDiscovered;
}

function unlockRelicById(
  relicId,
  { reveal = true } = {}
) {
  const relic = getRelicById(relicId);

  if (!relic) {
    return false;
  }

  const state = getState();
  const discovered =
    new Set(state.discoveredRelics || []);

  if (discovered.has(relicId)) {
    return false;
  }

  discovered.add(relicId);
  state.discoveredRelics =
    Array.from(discovered);
  state.relicDiscoveryDates[relicId] =
    new Date().toISOString();
  saveState(state);

  renderRelicCollection(state);

  if (reveal) {
    queueRelicReveals([relicId]);
  }

  return true;
}

function renderRelicCollection(state) {
  const grid = $("#relicGrid");
  const count = $("#relicCollectionCount");

  if (!grid || !count) {
    return;
  }

  const discovered =
    new Set(state.discoveredRelics || []);

  count.textContent =
    `${discovered.size} / ${RELICS.length} discovered`;

  const visibleRelics =
    RELICS.filter(
      relic =>
        activeRelicFilter === "all"
        || relic.rarity === activeRelicFilter
    );

  grid.innerHTML =
    visibleRelics
      .map(
        relic => {
          const unlocked =
            discovered.has(relic.id);

          const rarityBadge =
            RELIC_RARITY_BADGES[relic.rarity];

          const sourceBadge =
            RELIC_SOURCE_BADGES[relic.source];

          return `
            <button
              class="relic-card ${unlocked ? "is-discovered" : "is-locked"}"
              type="button"
              data-relic-id="${escapeHtml(relic.id)}"
              aria-label="${
                unlocked
                  ? escapeHtml(relic.name)
                  : "Undiscovered relic"
              }"
              ${unlocked ? "" : "disabled"}
            >
              <span class="relic-art-shell">
                <img
                  class="relic-card-image"
                  src="${escapeHtml(relic.image)}"
                  alt="${unlocked ? escapeHtml(relic.name) : ""}"
                  loading="lazy"
                >

                ${
                  unlocked
                    ? `
                      <span class="relic-card-badges" aria-hidden="true">
                        <img src="${rarityBadge}" alt="">
                        <img src="${sourceBadge}" alt="">
                      </span>
                    `
                    : `
                      <span class="relic-lock-overlay" aria-hidden="true">
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

  renderRelicCollection(getState());
}

function openRelicDialog(
  relicId,
  { reveal = false } = {}
) {
  const relic = getRelicById(relicId);
  const state = getState();

  if (
    !relic
    || !(state.discoveredRelics || []).includes(relicId)
  ) {
    return;
  }

  currentRelicRevealMode = reveal;

  $("#relicDialogEyebrow").textContent =
    reveal
      ? "Relic Discovered"
      : "Relic";

  $("#relicDialogTitle").textContent =
    relic.name;

  $("#relicDialogImage").src =
    relic.image;

  $("#relicDialogImage").alt =
    `${relic.name}. ${relic.flavor}`;

  $("#relicDialogRarityBadge").src =
    RELIC_RARITY_BADGES[relic.rarity];

  $("#relicDialogRarityBadge").alt =
    `${capitalize(relic.rarity)} rarity`;

  $("#relicDialogRarityText").textContent =
    capitalize(relic.rarity);

  $("#relicDialogSourceBadge").src =
    RELIC_SOURCE_BADGES[relic.source];

  $("#relicDialogSourceBadge").alt =
    RELIC_SOURCE_LABELS[relic.source];

  $("#relicDialogSourceText").textContent =
    RELIC_SOURCE_LABELS[relic.source];

  const discoveredAt =
    state.relicDiscoveryDates?.[relicId];

  $("#relicDiscoveredDate").textContent =
    discoveredAt
      ? `Discovered ${new Date(discoveredAt).toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric"
        })}`
      : "Discovered relic";

  $("#relicContinueButton").textContent =
    reveal
      ? "Claim Relic"
      : "Close";

  const dialog = $("#relicDialog");

  if (dialog && !dialog.open) {
    dialog.showModal();
  }
}

function closeRelicDialog() {
  const dialog = $("#relicDialog");
  const wasReveal = currentRelicRevealMode;

  if (dialog?.open) {
    dialog.close();
  }

  currentRelicRevealMode = false;

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
  for (const relicId of relicIds || []) {
    if (
      getRelicById(relicId)
      && !relicRevealQueue.includes(relicId)
    ) {
      relicRevealQueue.push(relicId);
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
    { reveal: true }
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

  renderProfile(settings);
  renderWeeklyProgress(
    state,
    settings
  );
  renderBossBattle(
    state,
    settings
  );
  renderQuestCards();
  renderCharacterStats(state);
  renderCharacterSummary(
    state,
    settings
  );
  renderRelicCollection(state);
  renderSettings(settings);

  /*
    renderParty is async. It is safe to trigger
    without blocking the local UI render.
  */
  void renderParty();

  applyMotionSetting(settings);
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

  $("#profileName").textContent =
    name;

  $("#profileAvatar").textContent =
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
    Number(settings.weeklyGoal)
    || DEFAULT_WEEKLY_GOAL;

  const completed =
    state.weeklyCompleted.length;

  const percent =
    Math.min(
      100,
      (completed / goal) * 100
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

  if (completed >= goal) {
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

  else if (completed > 0) {
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
    Number(settings.weeklyGoal)
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
// 23. QUEST CARDS
// =========================================================

function renderQuestCards() {
  $("#questGrid").innerHTML =
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


            <div class="quest-card-meta">

              <span class="quest-duration">
                ${escapeHtml(
                  quest.time
                )}
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
                âº
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
            if (element.disabled) {
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
// 25. CHARACTER STATS
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


function renderStat(type, xp) {
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
      `${displayName} â ${character.className}`;

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
// 27. OPEN QUEST
// =========================================================

function openQuest(id) {
  const quest =
    findQuest(id);

  if (!quest) {
    return;
  }

  if (id === "boss") {
    const state =
      normalizeWeek();

    const settings =
      getSettings();

    const goal =
      Number(settings.weeklyGoal)
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

  if (quest.id === "boss") {
    $("#dialogReward")
      .innerHTML =
        `
          +${BOSS_STRENGTH_XP} Strength XP
          Â·
          +${BOSS_ENDURANCE_XP} Endurance XP
          Â·
          <img
            class="currency-icon-small"
            src="icons/gold-icon.webp"
            alt=""
            aria-hidden="true"
          >
          ${BOSS_GOLD}
          Â·
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
          Â·
          <img
            class="currency-icon-small"
            src="icons/gold-icon.webp"
            alt=""
            aria-hidden="true"
          >
          ${quest.gold}
        `;
  }

  renderExerciseList(quest);

  $("#questDialog")
    .showModal();
}


// =========================================================
// 28. EXERCISE CHECKLIST
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
                ${escapeHtml(
                  exercise
                )}
              </span>

            </label>
          `
        )
        .join("");
}


// =========================================================
// 29. COMPLETE QUEST
// =========================================================

async function completeQuest() {
  if (!activeQuest) {
    return;
  }

  const completedQuest =
    activeQuest;

  if (
    completedQuest.id === "boss"
  ) {
    await completeBossBattle();
    return;
  }

  const state =
    normalizeWeek();

  const settings =
    getSettings();

  const goal =
    Number(settings.weeklyGoal)
    || DEFAULT_WEEKLY_GOAL;

  const weekKey =
    getWeekKey();

  const completedBefore =
    state.weeklyCompleted.length;

  const completedAt =
    new Date()
      .toISOString();

  const earnedXp =
    Number(completedQuest.xp)
    || 0;

  const earnedGold =
    Number(completedQuest.gold)
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
    discoverEligibleRelics(state);

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
      { defer: true }
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
      `Quest saved Â· +${earnedXp} XP Â· +${earnedGold} Gold Â· Party sync failed`
    );
  }

  else {
    showToast(
      `Quest Complete Â· +${earnedXp} XP Â· +${earnedGold} Gold`
    );
  }

  queueRelicReveals(
    newlyDiscoveredRelics
  );
}


// =========================================================
// 30. WEEK CONQUERED
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

  render();

  showToast(
    `Week Conquered Â· +${WEEK_CONQUERED_GOLD} Gold Â· Boss Battle Unlocked`
  );

  showNextRelicReveal();
}


// =========================================================
// 31. COMPLETE BOSS BATTLE
// =========================================================

async function completeBossBattle() {
  const state =
    normalizeWeek();

  const settings =
    getSettings();

  const goal =
    Number(settings.weeklyGoal)
    || DEFAULT_WEEKLY_GOAL;

  const weekKey =
    getWeekKey();

  if (
    state.weeklyCompleted.length
    < goal
  ) {
    clearTimerForQuest(
      "boss"
    );

    closeQuest();

    activeQuest =
      null;

    showToast(
      "Conquer the week before facing the Boss."
    );

    return;
  }

  if (
    state.bossDefeatedWeek
    === weekKey
  ) {
    clearTimerForQuest(
      "boss"
    );

    closeQuest();

    activeQuest =
      null;

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
// 32. BOSS DEFEATED / CRYSTAL REVEAL
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


// =========================================================
// 33. CLAIM BOSS REWARDS
// =========================================================

async function claimBossRewards() {
  const state =
    normalizeWeek();

  const weekKey =
    getWeekKey();

  if (
    state.bossDefeatedWeek
    !== weekKey
  ) {
    showToast(
      "No Boss reward is waiting."
    );

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

  state.history.unshift({
    questId:
      "boss",

    title:
      "Boss Battle",

    category:
      "Boss",

    xp:
      BOSS_STRENGTH_XP
      + BOSS_ENDURANCE_XP,

    xpType:
      "mixed",

    gold:
      BOSS_GOLD,

    crystals:
      BOSS_CRYSTALS,

    completedAt
  });

  saveState(state);

  const newlyDiscoveredRelics =
    discoverEligibleRelics(state);

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
      `Boss Rewards Claimed Â· +100 XP Â· +${BOSS_GOLD} Gold Â· +${BOSS_CRYSTALS} Crystals Â· Party sync failed`
    );
  }

  else {
    showToast(
      `Boss Rewards Claimed Â· +100 XP Â· +${BOSS_GOLD} Gold Â· +${BOSS_CRYSTALS} Crystals`
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
}


// =========================================================
// 34. SYNC NORMAL QUEST ACTIVITY
// =========================================================

async function syncQuestActivityToParty(
  quest,
  completedAt
) {
  try {
    const settings =
      getSettings();

    const character =
      getCharacterConfig();

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

          profile_id:
            activeProfileId,

          display_name:
            settings.playerName
            || character.defaultName,

          quest_id:
            quest.id,

          quest_title:
            quest.title,

          xp:
            quest.xp,

          gold:
            quest.gold,

          week_key:
            getWeekKey(),

          completed_at:
            completedAt
        });

    if (error) {
      throw error;
    }

    return true;
  }

  catch (error) {
    console.error(
      "Could not sync quest to party:",
      error
    );

    return false;
  }
}


// =========================================================
// 35. SYNC BOSS ACTIVITY
// =========================================================

async function syncBossActivityToParty(
  completedAt
) {
  try {
    const settings =
      getSettings();

    const character =
      getCharacterConfig();

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

          profile_id:
            activeProfileId,

          display_name:
            settings.playerName
            || character.defaultName,

          quest_id:
            "boss",

          quest_title:
            "Boss Battle",

          xp:
            BOSS_STRENGTH_XP
            + BOSS_ENDURANCE_XP,

          gold:
            BOSS_GOLD,

          week_key:
            getWeekKey(),

          completed_at:
            completedAt
        });

    if (error) {
      throw error;
    }

    return true;
  }

  catch (error) {
    console.error(
      "Could not sync Boss victory to party:",
      error
    );

    return false;
  }
}


// =========================================================
// 36. CLOSE QUEST
// =========================================================

function closeQuest() {
  // Stop only the visible refresh loop.
  // The persisted timestamp keeps running.
  stopTimerUiInterval();

  const dialog =
    $("#questDialog");

  if (dialog?.open) {
    dialog.close();
  }
}


// =========================================================
// 37. TIMER
// =========================================================

function getTimerStorageKey() {
  return (
    "questBoardTimerState-"
    + activeProfileId
  );
}

function timerNumberOrNull(value) {
  if (
    value === null
    || value === undefined
    || value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function createFreshTimerState(questId) {
  return {
    questId,
    startedAt: null,
    durationMs: null,
    pausedAt: null,
    accumulatedPauseMs: 0,
    paused: true
  };
}

function getSavedTimerState() {
  const raw =
    localStorage.getItem(
      getTimerStorageKey()
    );

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);

    if (
      !parsed
      || typeof parsed !== "object"
      || !parsed.questId
    ) {
      return null;
    }

    const startedAt =
      timerNumberOrNull(
        parsed.startedAt
      );

    if (startedAt === null) {
      return null;
    }

    return {
      questId: String(parsed.questId),
      startedAt,
      durationMs:
        timerNumberOrNull(
          parsed.durationMs
        ),
      pausedAt:
        timerNumberOrNull(
          parsed.pausedAt
        ),
      accumulatedPauseMs:
        Math.max(
          0,
          Number(
            parsed.accumulatedPauseMs
          ) || 0
        ),
      paused: Boolean(parsed.paused)
    };
  }

  catch (error) {
    console.error(
      "Could not read Quest Board timer state.",
      error
    );

    return null;
  }
}

function saveTimerState(timerState) {
  localStorage.setItem(
    getTimerStorageKey(),
    JSON.stringify(timerState)
  );
}

function clearSavedTimerState() {
  localStorage.removeItem(
    getTimerStorageKey()
  );
}

function getTimerElapsedMs(
  timerState,
  now = Date.now()
) {
  if (!timerState) {
    return 0;
  }

  const startedAt =
    timerNumberOrNull(
      timerState.startedAt
    );

  if (startedAt === null) {
    return 0;
  }

  let endTime = now;

  if (timerState.paused) {
    const pausedAt =
      timerNumberOrNull(
        timerState.pausedAt
      );

    if (pausedAt !== null) {
      endTime = pausedAt;
    }
  }

  return Math.max(
    0,
    endTime
      - startedAt
      - (
        Number(
          timerState.accumulatedPauseMs
        ) || 0
      )
  );
}

function stopTimerUiInterval() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function startTimerUiInterval() {
  stopTimerUiInterval();

  timerInterval =
    setInterval(
      syncTimerDisplayFromStorage,
      250
    );
}

function syncTimerDisplayFromStorage() {
  if (!activeQuest) {
    return;
  }

  const timerState =
    getSavedTimerState();

  if (
    !timerState
    || timerState.questId
      !== activeQuest.id
  ) {
    return;
  }

  timerDisplayMs =
    getTimerElapsedMs(timerState);

  updateTimerDisplay();
}

function restoreTimerForQuest(questId) {
  stopTimerUiInterval();

  const timerState =
    getSavedTimerState();

  const timerButton =
    $("#timerToggleButton");

  if (
    !timerState
    || timerState.questId !== questId
  ) {
    timerDisplayMs = 0;
    updateTimerDisplay();

    if (timerButton) {
      timerButton.textContent = "Start";
    }

    return;
  }

  timerDisplayMs =
    getTimerElapsedMs(timerState);

  updateTimerDisplay();

  if (timerButton) {
    timerButton.textContent =
      timerState.paused
        ? "Start"
        : "Pause";
  }

  if (!timerState.paused) {
    startTimerUiInterval();
  }
}

function startTimer() {
  if (!activeQuest) {
    return;
  }

  const now = Date.now();
  let timerState =
    getSavedTimerState();

  if (
    !timerState
    || timerState.questId
      !== activeQuest.id
  ) {
    timerState =
      createFreshTimerState(
        activeQuest.id
      );

    timerState.startedAt = now;
    timerState.paused = false;
  }

  else if (timerState.paused) {
    const pausedAt =
      timerNumberOrNull(
        timerState.pausedAt
      );

    if (pausedAt !== null) {
      timerState.accumulatedPauseMs +=
        Math.max(
          0,
          now - pausedAt
        );
    }

    timerState.pausedAt = null;
    timerState.paused = false;
  }

  saveTimerState(timerState);

  timerDisplayMs =
    getTimerElapsedMs(
      timerState,
      now
    );

  updateTimerDisplay();

  const timerButton =
    $("#timerToggleButton");

  if (timerButton) {
    timerButton.textContent = "Pause";
  }

  startTimerUiInterval();
}

function pauseTimer() {
  if (!activeQuest) {
    stopTimerUiInterval();
    return;
  }

  const timerState =
    getSavedTimerState();

  const timerButton =
    $("#timerToggleButton");

  if (
    !timerState
    || timerState.questId
      !== activeQuest.id
    || timerState.paused
  ) {
    stopTimerUiInterval();

    if (timerButton) {
      timerButton.textContent = "Start";
    }

    return;
  }

  timerState.pausedAt = Date.now();
  timerState.paused = true;

  saveTimerState(timerState);

  timerDisplayMs =
    getTimerElapsedMs(timerState);

  stopTimerUiInterval();
  updateTimerDisplay();

  if (timerButton) {
    timerButton.textContent = "Start";
  }
}

function resetTimer() {
  stopTimerUiInterval();

  if (activeQuest) {
    const timerState =
      getSavedTimerState();

    if (
      timerState
      && timerState.questId
        === activeQuest.id
    ) {
      clearSavedTimerState();
    }
  }

  timerDisplayMs = 0;
  updateTimerDisplay();

  const timerButton =
    $("#timerToggleButton");

  if (timerButton) {
    timerButton.textContent = "Start";
  }
}

function clearTimerForQuest(questId) {
  const timerState =
    getSavedTimerState();

  if (
    timerState
    && timerState.questId === questId
  ) {
    clearSavedTimerState();
  }

  stopTimerUiInterval();
  timerDisplayMs = 0;
}

function toggleTimer() {
  if (!activeQuest) {
    return;
  }

  const timerState =
    getSavedTimerState();

  const isRunning =
    Boolean(
      timerState
      && timerState.questId
        === activeQuest.id
      && !timerState.paused
    );

  if (isRunning) {
    pauseTimer();
  }

  else {
    startTimer();
  }
}

function updateTimerDisplay() {
  const display =
    $("#timerDisplay");

  if (!display) {
    return;
  }

  const totalSeconds =
    Math.floor(
      Math.max(0, timerDisplayMs)
      / 1000
    );

  const hours =
    Math.floor(totalSeconds / 3600);

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );

  const seconds =
    totalSeconds % 60;

  if (hours > 0) {
    display.textContent =
      String(hours).padStart(2, "0")
      + ":"
      + String(minutes).padStart(2, "0")
      + ":"
      + String(seconds).padStart(2, "0");
  }

  else {
    display.textContent =
      String(minutes).padStart(2, "0")
      + ":"
      + String(seconds).padStart(2, "0");
  }
}


// =========================================================
// 38. HISTORY
// =========================================================

function openHistory() {
  const state =
    normalizeWeek();

  if (
    state.history.length === 0
  ) {
    $("#historyList")
      .innerHTML =
        `
          <p class="muted">
            No quests completed yet.
            The chronicle awaits.
          </p>
        `;
  }

  else {
    $("#historyList")
      .innerHTML =
        state.history
          .map(
            item => {
              const date =
                new Date(
                  item.completedAt
                );

              const dateText =
                date.toLocaleDateString(
                  undefined,
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  }
                );

              const gold =
                Number(item.gold)
                || 0;

              const crystals =
                Number(item.crystals)
                || 0;

              const xpTypeText =
                item.xpType === "mixed"
                  ? "Mixed"
                  : capitalize(
                      item.xpType
                    );

              return `
                <article class="history-item">

                  <strong>
                    ${escapeHtml(
                      item.title
                    )}
                  </strong>

                  <span>

                    ${dateText}

                    Â· +${item.xp}
                    ${xpTypeText} XP

                    ${
                      gold
                        ? `
                          Â·
                          <img
                            class="currency-icon-small"
                            src="icons/gold-icon.webp"
                            alt=""
                            aria-hidden="true"
                          >
                          ${gold}
                        `
                        : ""
                    }

                    ${
                      crystals
                        ? `
                          Â·
                          <img
                            class="currency-icon-small"
                            src="icons/crystal-icon.webp"
                            alt=""
                            aria-hidden="true"
                          >
                          ${crystals}
                        `
                        : ""
                    }

                  </span>

                </article>
              `;
            }
          )
          .join("");
  }

  $("#historyDialog")
    .showModal();
}


function closeHistory() {
  if (
    $("#historyDialog")?.open
  ) {
    $("#historyDialog")
      .close();
  }
}


// =========================================================
// 39. VIEW HEADERS
// =========================================================

const VIEW_HEADERS = {
  board: {
    eyebrow: "Training Guild",
    title: "Quest Board"
  },

  character: {
    eyebrow: "Adventurer",
    title: "Character"
  },

  party: {
    eyebrow: "Fellowship",
    title: "Party"
  },

  settings: {
    eyebrow: "Guild Configuration",
    title: "Settings"
  }
};


// =========================================================
// 40. VIEW NAVIGATION
// =========================================================

async function setView(view) {
  activeView =
    VIEW_HEADERS[view]
      ? view
      : "board";

  localStorage.setItem(
    "questBoardActiveView",
    activeView
  );

  $$(".app-view")
    .forEach(
      section => {
        const active =
          section.dataset.appView
          === activeView;

        section.hidden =
          !active;

        section.classList.toggle(
          "active-view",
          active
        );
      }
    );

  $$(".nav-item")
    .forEach(
      button => {
        button.classList.toggle(
          "active",
          button.dataset.view
          === activeView
        );
      }
    );

  $("#screenEyebrow")
    .textContent =
      VIEW_HEADERS[
        activeView
      ].eyebrow;

  $("#screenTitle")
    .textContent =
      VIEW_HEADERS[
        activeView
      ].title;

  window.scrollTo({
    top: 0,

    behavior:
      getSettings()
        .reducedMotion
        ? "auto"
        : "smooth"
  });

  if (
    activeView === "party"
  ) {
    await refreshParty();
  }

  if (
    activeView === "settings"
  ) {
    renderSettings(
      getSettings()
    );
  }
}


// =========================================================
// 41. SETTINGS RENDER
// =========================================================

function renderSettings(settings) {
  $("#playerNameInput")
    .value =
      settings.playerName
      || getCharacterConfig()
        .defaultName;

  $("#weeklyGoalSelect")
    .value =
      String(
        settings.weeklyGoal
        || DEFAULT_WEEKLY_GOAL
      );

  $("#reducedMotionToggle")
    .checked =
      Boolean(
        settings.reducedMotion
      );

  $("#soundToggle")
    .checked =
      Boolean(
        settings.soundEnabled
      );

  $("#leavePartyButton")
    .disabled =
      !currentParty;

  if (currentParty) {
    $("#partySettingsStatus")
      .textContent =
        `Member of ${currentParty.name}.`;
  }

  else if (supabaseReady) {
    $("#partySettingsStatus")
      .textContent =
        "No fellowship joined.";
  }

  else {
    $("#partySettingsStatus")
      .textContent =
        "Party sync is unavailable.";
  }
}


// =========================================================
// 42. SAVE PLAYER NAME
// =========================================================

async function savePlayerName() {
  const name =
    $("#playerNameInput")
      .value
      .trim();

  if (!name) {
    showToast(
      "Enter a player name."
    );

    return;
  }

  const settings =
    getSettings();

  settings.playerName =
    name;

  saveSettings(settings);
  render();

  if (supabaseReady) {
    try {
      await syncProfileToSupabase();
    }

    catch (error) {
      console.error(error);

      showToast(
        "Name saved locally. Party profile sync failed."
      );

      return;
    }
  }

  showToast(
    "Adventurer name saved."
  );
}


// =========================================================
// 43. WEEKLY GOAL
// =========================================================

function saveWeeklyGoal() {
  const goal =
    Number(
      $("#weeklyGoalSelect")
        .value
    );

  if (
    !Number.isFinite(goal)
    || goal < 1
  ) {
    return;
  }

  const settings =
    getSettings();

  settings.weeklyGoal =
    goal;

  saveSettings(settings);
  render();

  showToast(
    `Weekly goal set to ${goal}.`
  );
}


// =========================================================
// 44. REDUCED MOTION
// =========================================================

function applyMotionSetting(
  settings
) {
  document.body
    .classList
    .toggle(
      "reduce-motion",
      Boolean(
        settings.reducedMotion
      )
    );
}


function saveReducedMotion() {
  const settings =
    getSettings();

  settings.reducedMotion =
    $("#reducedMotionToggle")
      .checked;

  saveSettings(settings);
  applyMotionSetting(settings);

  showToast(
    settings.reducedMotion
      ? "Reduced motion enabled."
      : "Reduced motion disabled."
  );
}


// =========================================================
// 45. SOUND
// =========================================================

function saveSoundSetting() {
  const settings =
    getSettings();

  settings.soundEnabled =
    $("#soundToggle")
      .checked;

  saveSettings(settings);

  showToast(
    settings.soundEnabled
      ? "Sound effects enabled."
      : "Sound effects disabled."
  );
}


// =========================================================
// 46. RESET WEEK
// =========================================================

function resetThisWeek() {
  if (
    !confirm(
      "Reset this week's personal progress?\n\nXP, gold, crystals, history, and rewards already earned will remain."
    )
  ) {
    return;
  }

  const state =
    getState();

  state.weekKey =
    getWeekKey();

  state.weeklyCompleted =
    [];

  saveState(state);
  render();

  showToast(
    "Weekly quest progress reset."
  );
}


// =========================================================
// 47. CLEAR HISTORY
// =========================================================

function clearQuestHistory() {
  if (
    !confirm(
      "Clear the personal quest chronicle?\n\nXP, levels, gold, and crystals will remain."
    )
  ) {
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
// 48. RESET CHARACTER
// =========================================================

function resetCharacter() {
  if (
    !confirm(
      "Reset this character completely?\n\nThis erases local XP, gold, crystals, levels, weekly progress, Boss victories, rewards, and personal quest history."
    )
  ) {
    return;
  }

  stopTimerUiInterval();
  clearSavedTimerState();
  timerDisplayMs = 0;

  saveState(
    createFreshState()
  );

  render();

  showToast(
    "Character reset."
  );
}


// =========================================================
// 49. PARTY CODE
// =========================================================

function generatePartyCode() {
  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code =
    "";

  for (
    let index = 0;
    index < 6;
    index++
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
// 50. CREATE PARTY
// =========================================================

async function createParty() {
  if (!supabaseReady) {
    showToast(
      "Guild connection is not ready."
    );

    return;
  }

  if (currentParty) {
    showToast(
      "You already belong to a fellowship."
    );

    return;
  }

  const inviteCode =
    generatePartyCode();

  try {
    const {
      error
    } =
      await supabaseClient.rpc(
        "create_party",
        {
          supplied_name:
            "The Fellowship",

          supplied_invite_code:
            inviteCode
        }
      );

    if (error) {
      throw error;
    }

    await loadCurrentParty();

    showToast(
      `Fellowship created Â· ${inviteCode}`
    );
  }

  catch (error) {
    console.error(
      "Party creation failed:",
      error
    );

    showToast(
      "Could not create the fellowship."
    );
  }
}


// =========================================================
// 51. JOIN PARTY FORM
// =========================================================

function toggleJoinPartyForm() {
  const form =
    $("#joinPartyForm");

  form.hidden =
    !form.hidden;

  if (!form.hidden) {
    $("#partyCodeInput")
      .focus();
  }
}


// =========================================================
// 52. JOIN PARTY
// =========================================================

async function joinParty() {
  if (!supabaseReady) {
    showToast(
      "Guild connection is not ready."
    );

    return;
  }

  if (currentParty) {
    showToast(
      "Leave your current fellowship first."
    );

    return;
  }

  const code =
    $("#partyCodeInput")
      .value
      .trim()
      .toUpperCase();

  if (code.length < 4) {
    showToast(
      "Enter a valid party code."
    );

    return;
  }

  try {
    const {
      error
    } =
      await supabaseClient.rpc(
        "join_party_by_code",
        {
          supplied_code:
            code
        }
      );

    if (error) {
      throw error;
    }

    $("#partyCodeInput")
      .value =
        "";

    $("#joinPartyForm")
      .hidden =
        true;

    await loadCurrentParty();

    showToast(
      "Fellowship joined."
    );
  }

  catch (error) {
    console.error(
      "Party join failed:",
      error
    );

    showToast(
      "That party code could not be joined."
    );
  }
}


// =========================================================
// 53. LEAVE PARTY
// =========================================================

async function leaveParty() {
  if (
    !currentParty
    || !supabaseUser
  ) {
    return;
  }

  if (
    !confirm(
      "Leave this fellowship?"
    )
  ) {
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
      "Could not leave the fellowship."
    );
  }
}


// =========================================================
// 54. REFRESH PARTY
// =========================================================

async function refreshParty() {
  if (!supabaseReady) {
    await renderParty();
    return;
  }

  try {
    await loadCurrentParty();
  }

  catch (error) {
    console.error(
      "Party refresh failed:",
      error
    );

    setPartySyncStatus(
      "Could not refresh fellowship data.",
      "error"
    );
  }
}


// =========================================================
// 55. RENDER PARTY
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

  if (!supabaseReady) {
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
      "Connected Â· No fellowship joined.",
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
      activity,
      members.length
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
// 56. FETCH PARTY MEMBERS
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

  const userIds =
    memberships.map(
      item =>
        item.user_id
    );

  if (userIds.length === 0) {
    return [];
  }

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

  return (
    memberships.map(
      membership => {
        const profile =
          profiles.find(
            item =>
              item.user_id
              === membership.user_id
          );

        return {
          user_id:
            membership.user_id,

          joined_at:
            membership.joined_at,

          profile_id:
            profile?.profile_id
            || null,

          display_name:
            profile?.display_name
            || "Adventurer",

          class_name:
            profile?.class_name
            || "Unknown Class"
        };
      }
    )
  );
}


// =========================================================
// 57. FETCH PARTY ACTIVITY
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
      .select("*")
      .eq(
        "party_id",
        currentParty.id
      )
      .order(
        "completed_at",
        {
          ascending: false
        }
      )
      .limit(100);

  if (error) {
    throw error;
  }

  return data || [];
}


// =========================================================
// 58. RENDER PARTY MEMBERS
// =========================================================

function renderPartyMembers(
  members,
  activity
) {
  if (members.length === 0) {
    $("#partyMembers")
      .innerHTML =
        `
          <p class="muted">
            No companions found.
          </p>
        `;

    return;
  }

  const currentWeek =
    getWeekKey();

  $("#partyMembers")
    .innerHTML =
      members
        .map(
          member => {
            const weeklyQuestActivity =
              activity.filter(
                item =>
                  item.user_id
                    === member.user_id
                  && item.week_key
                    === currentWeek
                  && item.quest_id
                    !== "boss"
              );

            const weeklyGoldActivity =
              activity.filter(
                item =>
                  item.user_id
                    === member.user_id
                  && item.week_key
                    === currentWeek
              );

            const weeklyGold =
              weeklyGoldActivity.reduce(
                (
                  total,
                  item
                ) =>
                  total
                  + (
                    Number(item.gold)
                    || 0
                  ),
                0
              );

            const character =
              member.profile_id
                ? getCharacterConfig(
                    member.profile_id
                  )
                : null;

            const cardImage =
              character?.card
              || "";

            const isCurrentPlayer =
              Boolean(
                supabaseUser
                && member.user_id
                  === supabaseUser.id
              );

            return `
              <article class="party-member-card">

                ${
                  cardImage
                    ? `
                      <img
                        class="party-member-portrait"
                        src="${cardImage}"
                        alt="${escapeHtml(
                          member.display_name
                        )}"
                      >
                    `
                    : `
                      <div class="party-member-avatar">
                        ${escapeHtml(
                          member.display_name
                            .charAt(0)
                            .toUpperCase()
                        )}
                      </div>
                    `
                }


                <div class="party-member-info">

                  <strong>
                    ${escapeHtml(
                      member.display_name
                    )}
                  </strong>

                  <span>
                    ${escapeHtml(
                      member.class_name
                    )}
                  </span>

                  <small>
                    ${weeklyQuestActivity.length}
                    quest${
                      weeklyQuestActivity.length === 1
                        ? ""
                        : "s"
                    }
                    this week
                  </small>

                </div>


                <div class="party-member-score">

                  <strong>
                    ${weeklyGold}g
                  </strong>

                  <span>
                    earned
                  </span>

                  ${
                    isCurrentPlayer
                      ? `
                        <small class="party-self-label">
                          You
                        </small>
                      `
                      : `
                        <button
                          class="party-gift-button"
                          type="button"
                          data-gift-user-id="${escapeHtml(
                            member.user_id
                          )}"
                          data-gift-name="${escapeHtml(
                            member.display_name
                          )}"
                        >
                          Gift
                        </button>
                      `
                  }

                </div>

              </article>
            `;
          }
        )
        .join("");
}


// =========================================================
// 59. PARTY GIFTING
// =========================================================

function openGiftDialog(
  userId,
  displayName
) {
  if (
    !currentParty
    || !supabaseUser
    || userId === supabaseUser.id
  ) {
    return;
  }

  giftRecipient = {
    userId,

    displayName:
      displayName
      || "Adventurer"
  };

  const state =
    getState();

  $("#giftRecipientName")
    .textContent =
      giftRecipient.displayName;

  $("#giftGoldBalance")
    .textContent =
      state.gold;

  $("#giftCrystalBalance")
    .textContent =
      state.crystals;

  $("#giftCurrencySelect")
    .value =
      "gold";

  $("#giftAmountInput")
    .value =
      "";

  $("#giftError")
    .textContent =
      "";

  updateGiftAvailableText();

  const dialog =
    $("#giftDialog");

  if (
    dialog
    && !dialog.open
  ) {
    dialog.showModal();

    setTimeout(
      () => {
        $("#giftAmountInput")
          ?.focus();
      },
      100
    );
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

  giftSending =
    false;

  if ($("#sendGiftButton")) {
    $("#sendGiftButton")
      .disabled =
        false;
  }

  if ($("#giftAmountInput")) {
    $("#giftAmountInput")
      .value =
        "";
  }

  if ($("#giftError")) {
    $("#giftError")
      .textContent =
        "";
  }
}


function updateGiftAvailableText() {
  const state =
    getState();

  const currency =
    $("#giftCurrencySelect")
      ?.value
    || "gold";

  const balance =
    currency === "crystals"
      ? state.crystals
      : state.gold;

  const label =
    currency === "crystals"
      ? "Crystals"
      : "Gold";

  $("#giftAvailableText")
    .textContent =
      `Available: ${balance} ${label}`;
}


// =========================================================
// 60. SEND PARTY GIFT
// =========================================================

async function sendPartyGift() {
  if (giftSending) {
    return;
  }

  if (
    !supabaseReady
    || !supabaseUser
    || !currentParty
    || !giftRecipient
  ) {
    $("#giftError")
      .textContent =
        "The fellowship connection is unavailable.";

    return;
  }

  const currency =
    $("#giftCurrencySelect")
      .value;

  const rawAmount =
    Number(
      $("#giftAmountInput")
        .value
    );

  const amount =
    Math.floor(rawAmount);

  if (
    !Number.isFinite(amount)
    || amount < 1
  ) {
    $("#giftError")
      .textContent =
        "Enter a valid gift amount.";

    return;
  }

  if (
    ![
      "gold",
      "crystals"
    ].includes(currency)
  ) {
    $("#giftError")
      .textContent =
        "Choose Gold or Crystals.";

    return;
  }

  const state =
    getState();

  const balance =
    Number(
      state[currency]
    )
    || 0;

  if (amount > balance) {
    $("#giftError")
      .textContent =
        `You only have ${balance} ${capitalize(
          currency
        )}.`;

    return;
  }

  const settings =
    getSettings();

  const character =
    getCharacterConfig();

  giftSending =
    true;

  $("#sendGiftButton")
    .disabled =
      true;

  $("#giftError")
    .textContent =
      "";

  try {
    const {
      error
    } =
      await supabaseClient
        .from("gift_transfers")
        .insert({
          party_id:
            currentParty.id,

          sender_user_id:
            supabaseUser.id,

          recipient_user_id:
            giftRecipient.userId,

          sender_profile_id:
            activeProfileId,

          sender_display_name:
            settings.playerName
            || character.defaultName,

          currency,

          amount
        });

    if (error) {
      throw error;
    }

    /*
      Deduct only after Supabase accepts the transfer.
    */

    state[currency] =
      balance - amount;

    saveState(state);

    const recipientName =
      giftRecipient.displayName;

    closeGiftDialog();
    render();

    showToast(
      `Gift Sent Â· ${recipientName} received ${amount} ${capitalize(
        currency
      )}`
    );
  }

  catch (error) {
    console.error(
      "Gift could not be sent:",
      error
    );

    giftSending =
      false;

    $("#sendGiftButton")
      .disabled =
        false;

    $("#giftError")
      .textContent =
        "The gift could not be sent.";
  }
}


// =========================================================
// 61. RECEIVE PARTY GIFTS
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
        .from("gift_transfers")
        .select(
          "id, sender_display_name, currency, amount, created_at"
        )
        .eq(
          "recipient_user_id",
          supabaseUser.id
        )
        .is(
          "claimed_at",
          null
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

    const gifts =
      data || [];

    if (gifts.length === 0) {
      return;
    }

    const state =
      getState();

    const claimedIds =
      new Set(
        state.claimedGiftIds
        || []
      );

    const newlyReceived =
      [];

    for (const gift of gifts) {
      if (
        claimedIds.has(
          gift.id
        )
      ) {
        continue;
      }

      const amount =
        Math.floor(
          Number(gift.amount)
        );

      const currency =
        gift.currency;

      if (
        amount < 1
        || ![
          "gold",
          "crystals"
        ].includes(currency)
      ) {
        continue;
      }

      state[currency] =
        (
          Number(
            state[currency]
          )
          || 0
        )
        + amount;

      claimedIds.add(
        gift.id
      );

      newlyReceived.push(
        gift
      );
    }

    state.claimedGiftIds =
      Array.from(claimedIds)
        .slice(-500);

    if (
      newlyReceived.length > 0
    ) {
      saveState(state);
    }

    const giftIds =
      gifts.map(
        gift =>
          gift.id
      );

    const {
      error: claimError
    } =
      await supabaseClient
        .from("gift_transfers")
        .update({
          claimed_at:
            new Date()
              .toISOString()
        })
        .in(
          "id",
          giftIds
        )
        .eq(
          "recipient_user_id",
          supabaseUser.id
        )
        .is(
          "claimed_at",
          null
        );

    if (claimError) {
      console.error(
        "Gift receipt could not be acknowledged:",
        claimError
      );
    }

    if (
      newlyReceived.length > 0
    ) {
      render();

      showGiftReceivedNotification(
        newlyReceived
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
// 62. GIFT RECEIVED NOTIFICATION
// =========================================================

function showGiftReceivedNotification(
  gifts
) {
  if (gifts.length === 1) {
    const gift =
      gifts[0];

    const currencyName =
      gift.currency === "crystals"
        ? "Crystals"
        : "Gold";

    showToast(
      `Gift Received Â· ${gift.sender_display_name} sent you ${gift.amount} ${currencyName}!`
    );

    return;
  }

  const gold =
    gifts
      .filter(
        gift =>
          gift.currency === "gold"
      )
      .reduce(
        (
          total,
          gift
        ) =>
          total
          + Number(gift.amount),
        0
      );

  const crystals =
    gifts
      .filter(
        gift =>
          gift.currency === "crystals"
      )
      .reduce(
        (
          total,
          gift
        ) =>
          total
          + Number(gift.amount),
        0
      );

  const parts =
    [];

  if (gold > 0) {
    parts.push(
      `${gold} Gold`
    );
  }

  if (crystals > 0) {
    parts.push(
      `${crystals} Crystals`
    );
  }

  showToast(
    `Gifts Received Â· ${parts.join(
      " Â· "
    )}`
  );
}


// =========================================================
// 63. PARTY CHALLENGE
// =========================================================

function renderPartyChallenge(
  activity,
  memberCount
) {
  const currentWeek =
    getWeekKey();

  const settings =
    getSettings();

  const personalGoal =
    Number(settings.weeklyGoal)
    || DEFAULT_WEEKLY_GOAL;

  const safeMemberCount =
    Math.max(
      1,
      memberCount
    );

  const partyGoal =
    personalGoal
    * safeMemberCount;

  const weeklyActivity =
    activity.filter(
      item =>
        item.week_key
          === currentWeek
        && item.quest_id
          !== "boss"
    );

  const completed =
    weeklyActivity.length;

  const percent =
    Math.min(
      100,
      (completed / partyGoal) * 100
    );

  $("#partyChallengeTitle")
    .textContent =
      `Complete ${partyGoal} Quests`;

  $("#partyChallengeProgress")
    .textContent =
      `${completed} / ${partyGoal}`;

  $("#partyChallengeBar")
    .style.width =
      `${percent}%`;

  if (completed >= partyGoal) {
    $("#partyChallengeStatus")
      .textContent =
        "Challenge conquered.";

    unlockRelicById(
      "fellowship-pin",
      { reveal: appInitialized }
    );
  }

  else if (completed > 0) {
    $("#partyChallengeStatus")
      .textContent =
        "The fellowship advances.";
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

function renderPartyActivity(activity) {
  const recent =
    activity.slice(0, 12);

  if (recent.length === 0) {
    $("#partyActivityList")
      .innerHTML =
        `
          <p class="muted">
            No party activity yet.
          </p>
        `;

    return;
  }

  $("#partyActivityList")
    .innerHTML =
      recent
        .map(
          item => {
            const date =
              new Date(
                item.completed_at
              );

            const dateText =
              date.toLocaleDateString(
                undefined,
                {
                  month: "short",
                  day: "numeric"
                }
              );

            const boss =
              item.quest_id === "boss";

            return `
              <article class="party-activity-item">

                <strong>
                  ${escapeHtml(
                    item.display_name
                  )}
                  ${
                    boss
                      ? "defeated"
                      : "completed"
                  }
                  ${escapeHtml(
                    item.quest_title
                  )}
                </strong>

                <span>
                  ${dateText}
                  Â· +${item.xp} XP
                  Â· +${item.gold} Gold
                </span>

              </article>
            `;
          }
        )
        .join("");
}


// =========================================================
// 65. PARTY STATUS
// =========================================================

function setPartySyncStatus(
  text,
  state = ""
) {
  const element =
    $("#partySyncStatus");

  if (!element) {
    return;
  }

  element.textContent =
    text;

  element.dataset.state =
    state;
}


// =========================================================
// 66. PARTY REFRESH LOOP
// =========================================================

function startPartyRefreshLoop() {
  clearInterval(
    partyRefreshTimer
  );

  partyRefreshTimer =
    setInterval(
      async () => {
        /*
          Gifts can arrive while the user is
          on any screen.
        */

        await checkIncomingGifts();

        if (
          activeView === "party"
        ) {
          await refreshParty();
        }
      },
      PARTY_REFRESH_INTERVAL
    );
}


// =========================================================
// 67. TOAST
// =========================================================

function showToast(message) {
  const toast =
    $("#toast");

  if (!toast) {
    return;
  }

  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );

  clearTimeout(
    toastTimeout
  );

  toastTimeout =
    setTimeout(
      () => {
        toast.classList.remove(
          "show"
        );
      },
      2400
    );
}


// =========================================================
// 68. UTILITIES
// =========================================================

function capitalize(text) {
  if (!text) {
    return "";
  }

  return (
    text
      .charAt(0)
      .toUpperCase()
    + text.slice(1)
  );
}


function escapeHtml(value) {
  return String(value)
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


// =========================================================
// 69. MAIN EVENTS
// =========================================================

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

$("#timerToggleButton")
  ?.addEventListener(
    "click",
    toggleTimer
  );

$("#timerResetButton")
  ?.addEventListener(
    "click",
    resetTimer
  );

$("#showHistoryButton")
  ?.addEventListener(
    "click",
    openHistory
  );

$("#closeHistoryButton")
  ?.addEventListener(
    "click",
    closeHistory
  );

$("#weekContinueButton")
  ?.addEventListener(
    "click",
    closeWeekConquered
  );

$("#claimBossRewardsButton")
  ?.addEventListener(
    "click",
    claimBossRewards
  );

$$(".nav-item")
  .forEach(
    button => {
      button.addEventListener(
        "click",
        () =>
          setView(
            button.dataset.view
          )
      );
    }
  );


// =========================================================
// 70. SETTINGS EVENTS
// =========================================================

$("#savePlayerNameButton")
  ?.addEventListener(
    "click",
    savePlayerName
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

$("#soundToggle")
  ?.addEventListener(
    "change",
    saveSoundSetting
  );

$("#resetWeekButton")
  ?.addEventListener(
    "click",
    resetThisWeek
  );

$("#clearHistoryButton")
  ?.addEventListener(
    "click",
    clearQuestHistory
  );

$("#resetCharacterButton")
  ?.addEventListener(
    "click",
    resetCharacter
  );


// =========================================================
// 71. PARTY EVENTS
// =========================================================

$("#createPartyButton")
  ?.addEventListener(
    "click",
    createParty
  );

$("#showJoinPartyButton")
  ?.addEventListener(
    "click",
    toggleJoinPartyForm
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
        event.key === "Enter"
      ) {
        joinParty();
      }
    }
  );

$("#leavePartyButton")
  ?.addEventListener(
    "click",
    leaveParty
  );

$("#refreshPartyButton")
  ?.addEventListener(
    "click",
    refreshParty
  );

$("#partyMembers")
  ?.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-gift-user-id]"
        );

      if (!button) {
        return;
      }

      openGiftDialog(
        button.dataset.giftUserId,
        button.dataset.giftName
      );
    }
  );

$("#closeGiftButton")
  ?.addEventListener(
    "click",
    closeGiftDialog
  );

$("#sendGiftButton")
  ?.addEventListener(
    "click",
    sendPartyGift
  );

$("#giftCurrencySelect")
  ?.addEventListener(
    "change",
    updateGiftAvailableText
  );

$("#giftAmountInput")
  ?.addEventListener(
    "keydown",
    event => {
      if (
        event.key === "Enter"
      ) {
        sendPartyGift();
      }
    }
  );




// =========================================================
// RELIC COLLECTION EVENTS
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
        button.dataset.relicFilter
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

      if (
        !card
        || card.disabled
      ) {
        return;
      }

      openRelicDialog(
        card.dataset.relicId
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

$("#relicDialog")
  ?.addEventListener(
    "click",
    event => {
      if (
        event.target
        === $("#relicDialog")
      ) {
        closeRelicDialog();
      }
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
// 72. DIALOG OUTSIDE CLICK
// =========================================================

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

$("#historyDialog")
  ?.addEventListener(
    "click",
    event => {
      if (
        event.target
        === $("#historyDialog")
      ) {
        closeHistory();
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

$("#giftDialog")
  ?.addEventListener(
    "cancel",
    event => {
      event.preventDefault();
      closeGiftDialog();
    }
  );


// =========================================================
// 73. LOCK VICTORY DIALOGS
// =========================================================

$("#weekConqueredDialog")
  ?.addEventListener(
    "cancel",
    event => {
      event.preventDefault();
    }
  );

$("#bossDefeatedDialog")
  ?.addEventListener(
    "cancel",
    event => {
      event.preventDefault();
    }
  );


// =========================================================
// 74. ESCAPE KEY
// =========================================================

document.addEventListener(
  "keydown",
  event => {
    if (
      event.key !== "Escape"
    ) {
      return;
    }

    if (
      $("#weekConqueredDialog")?.open
      || $("#bossDefeatedDialog")?.open
    ) {
      event.preventDefault();
      return;
    }

    if (
      $("#relicDialog")?.open
    ) {
      closeRelicDialog();
      return;
    }

    if (
      $("#questDialog")?.open
    ) {
      closeQuest();
      return;
    }

    if (
      $("#giftDialog")?.open
    ) {
      closeGiftDialog();
      return;
    }

    if (
      $("#historyDialog")?.open
    ) {
      closeHistory();
    }
  }
);


document.addEventListener(
  "visibilitychange",
  () => {
    if (
      document.visibilityState === "visible"
      && activeQuest
      && $("#questDialog")?.open
    ) {
      restoreTimerForQuest(
        activeQuest.id
      );
    }
  }
);


// =========================================================
// 75. RESTORE PENDING BOSS REWARD
// =========================================================

function restorePendingVictory() {
  const state =
    normalizeWeek();

  const weekKey =
    getWeekKey();

  if (
    state.bossDefeatedWeek
      === weekKey
    && state.bossRewardsClaimedWeek
      !== weekKey
  ) {
    openBossDefeated();
  }
}


// =========================================================
// 76. INITIALIZE
// =========================================================

async function initializeApp() {
  /*
    PERSONAL APP FIRST.

    Nothing involving Supabase is allowed to prevent
    existing local Quest Board data from rendering.
  */

  chooseProfile();

  const initialState =
    normalizeWeek();

  discoverEligibleRelics(
    initialState
  );

  try {
    render();
  }

  catch (error) {
    console.error(
      "Local Quest Board render failed:",
      error
    );
  }

  try {
    await setView(
      activeView
    );
  }

  catch (error) {
    console.error(
      "View restoration failed:",
      error
    );
  }

  await initializeSupabase();

  if (supabaseReady) {
    await checkIncomingGifts();
  }

  renderSettings(
    getSettings()
  );

  if (
    activeView === "party"
    && supabaseReady
  ) {
    await refreshParty();
  }

  restorePendingVictory();

  appInitialized = true;
}


initializeApp()
  .catch(
    error => {
      console.error(
        "Quest Board initialization failed:",
        error
      );
    }
  );
