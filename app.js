// =========================================================
// QUEST BOARD
// app.js
//
// Phase 5:
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
// =========================================================


// =========================================================
// 1. SUPABASE CONFIGURATION
// =========================================================

const SUPABASE_URL =
  "https://pqifpislzljilqatmtly.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_16wAhIyuMsClbOYoAZt6aQ_unXWTJ_n";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );


// =========================================================
// 2. QUEST DATA
// =========================================================

const QUESTS = [

  {
    id:
      "there-back",

    title:
      "There and Back",

    category:
      "Endurance",

    time:
      "15–25 min",

    xpType:
      "endurance",

    xp:
      20,

    gold:
      12,

    description:
      "Walk the full 1-mile road route at a comfortable, steady pace.",

    exercises: [
      "Walk the full 1-mile route"
    ]
  },


  {
    id:
      "keep",

    title:
      "The Keep",

    category:
      "Strength",

    time:
      "10–20 min",

    xpType:
      "strength",

    xp:
      25,

    gold:
      15,

    description:
      "A simple dumbbell and kettlebell strength quest. Complete two rounds for a short session or three to four rounds for the full quest.",

    exercises: [
      "Goblet squat — 8–12 reps",
      "One-arm dumbbell row — 8–12 reps each side",
      "Dumbbell bench press — 8–12 reps",
      "Romanian deadlift — 8–12 reps",
      "Plank — 20–40 seconds"
    ]
  },


  {
    id:
      "dragonstrength",

    title:
      "DragonStrength",

    category:
      "Strength",

    time:
      "10–20 min",

    xpType:
      "strength",

    xp:
      30,

    gold:
      20,

    description:
      "Barbell and rack training. Keep the movement controlled and leave a little strength in reserve.",

    exercises: [
      "Barbell squat — 8–10 reps",
      "Bench press — 8–10 reps",
      "Barbell Romanian deadlift — 8–10 reps",
      "Cable row or lat pulldown — 10–12 reps",
      "Core movement of choice"
    ]
  },


  {
    id:
      "rogue",

    title:
      "Rogue Mode",

    category:
      "Mixed",

    time:
      "10 min",

    xpType:
      "strength",

    xp:
      20,

    gold:
      15,

    description:
      "Set the timer for ten minutes and move continuously through the circuit at your own pace.",

    exercises: [
      "10 kettlebell deadlifts",
      "8 goblet squats",
      "8 dumbbell shoulder presses",
      "20–30 second plank",
      "Repeat until 10 minutes is complete"
    ]
  },


  {
    id:
      "restoration",

    title:
      "Restoration",

    category:
      "Recovery",

    time:
      "10–20 min",

    xpType:
      "restoration",

    xp:
      20,

    gold:
      10,

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
    id:
      "ranger",

    title:
      "Ranger Training",

    category:
      "Endurance",

    time:
      "20–30 min",

    xpType:
      "endurance",

    xp:
      30,

    gold:
      20,

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

    id:
      "emergency",

    title:
      "Emergency Quest",

    category:
      "Emergency",

    time:
      "5 min",

    xpType:
      "strength",

    xp:
      10,

    gold:
      5,

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

    id:
      "boss",

    title:
      "Boss Battle",

    category:
      "Boss",

    time:
      "30–45 min",

    /*
      Boss rewards are handled separately.

      These values are deliberately zero so the
      normal quest completion pathway cannot
      accidentally award an extra Boss payout.
    */

    xpType:
      "strength",

    xp:
      0,

    gold:
      0,

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

    profileId:
      "farmer",

    legacyName:
      "Farmer",

    defaultName:
      "Farmer",

    className:
      "Half-Orc Wizard",

    card:
      "farmer-card.webp",

    theme:
      "ember"

  },


  jess: {

    profileId:
      "jess",

    legacyName:
      "Jess",

    defaultName:
      "Jess",

    className:
      "Rogue Witch Assassin",

    card:
      "jess-card.webp",

    theme:
      "amethyst"

  }

};


// =========================================================
// 5. CONSTANTS
// =========================================================

const DEFAULT_WEEKLY_GOAL =
  3;


const XP_PER_LEVEL =
  100;


const PARTY_GOAL_MULTIPLIER =
  2;


const PARTY_REFRESH_INTERVAL =
  15000;


// WEEK CONQUERED REWARD

const WEEK_CONQUERED_GOLD =
  25;


// BOSS REWARDS

const BOSS_STRENGTH_XP =
  50;


const BOSS_ENDURANCE_XP =
  50;


const BOSS_GOLD =
  100;


const BOSS_CRYSTALS =
  3;


// =========================================================
// 6. APP STATE
// =========================================================

let activeProfileId =
  getInitialProfileId();


let activeView =
  localStorage.getItem(
    "questBoardActiveView"
  )
  ||
  "board";


let activeQuest =
  null;


let timerSeconds =
  0;


let timerInterval =
  null;


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

// =========================================================
// 7. DOM HELPERS
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
// 8. PROFILE HELPERS
// =========================================================

function normalizeProfileId(
  value
) {

  const normalized =
    String(
      value || ""
    )
      .trim()
      .toLowerCase();


  if (
    normalized ===
    "farmer"
  ) {

    return "farmer";

  }


  if (
    normalized ===
    "jess"
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


  if (
    newValue
  ) {

    return newValue;

  }


  const legacyValue =
    normalizeProfileId(
      localStorage.getItem(
        "questBoardActiveProfile"
      )
    );


  if (
    legacyValue
  ) {

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
    ||
    CHARACTER_PROFILES.farmer
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
// 9. PROFILE CHOICE
// =========================================================

function chooseProfile() {

  if (
    activeProfileId
  ) {

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
    ||
    "farmer";


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


  if (
    !saved
  ) {

    return (
      createFreshSettings()
    );

  }


  try {

    return {

      ...createFreshSettings(),

      ...JSON.parse(
        saved
      )

    };

  }

  catch (
    error
  ) {

    console.error(
      "Could not read Quest Board settings.",
      error
    );


    return (
      createFreshSettings()
    );

  }
}


function saveSettings(
  settings
) {

  localStorage.setItem(
    getSettingsKey(),
    JSON.stringify(
      settings
    )
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

      strength:
        0,

      endurance:
        0,

      restoration:
        0

    },

    gold:
      0,

    crystals:
      0,

    history:
      [],
      
    claimedGiftIds:
      [],


    /*
      These hold the exact week key in which
      each one-time reward/event happened.
    */

    weekConqueredRewardWeek:
      null,

    bossDefeatedWeek:
      null,

    bossRewardsClaimedWeek:
      null

  };
}


function migrateState(
  parsed
) {

  const fresh =
    createFreshState();


  return {

    ...fresh,

    ...parsed,

    xp: {

      ...fresh.xp,

      ...(
        parsed?.xp
        ||
        {}
      )

    },

    gold:
      Number(
        parsed?.gold
      )
      ||
      0,

    crystals:
      Number(
        parsed?.crystals
      )
      ||
      0,

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

    weekConqueredRewardWeek:
      parsed?.weekConqueredRewardWeek
      ||
      null,

    bossDefeatedWeek:
      parsed?.bossDefeatedWeek
      ||
      null,

    bossRewardsClaimedWeek:
      parsed?.bossRewardsClaimedWeek
      ||
      null

  };
}


function getState() {

  const saved =
    localStorage.getItem(
      getStorageKey()
    );


  if (
    !saved
  ) {

    return (
      createFreshState()
    );

  }


  try {

    return (
      migrateState(
        JSON.parse(
          saved
        )
      )
    );

  }

  catch (
    error
  ) {

    console.error(
      "Could not read Quest Board state.",
      error
    );


    return (
      createFreshState()
    );

  }
}


function saveState(
  state
) {

  localStorage.setItem(
    getStorageKey(),
    JSON.stringify(
      state
    )
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
    ||
    7;


  workingDate.setUTCDate(
    workingDate.getUTCDate()
    +
    4
    -
    dayNumber
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
          -
          yearStart
        )
        /
        86400000
        +
        1
      )
      /
      7
    );


  return (
    `${workingDate.getUTCFullYear()}`
    +
    "-W"
    +
    String(
      weekNumber
    )
      .padStart(
        2,
        "0"
      )
  );
}


function normalizeWeek() {

  const state =
    getState();


  const weekKey =
    getWeekKey();


  if (
    state.weekKey !==
    weekKey
  ) {

    state.weekKey =
      weekKey;


    state.weeklyCompleted =
      [];


    /*
      The reward flags intentionally remain.

      Because they store explicit week keys,
      last week's flags naturally stop matching
      without destroying historical state.
    */


    saveState(
      state
    );

  }


  return state;
}


// =========================================================
// 14. LEVEL SYSTEM
// =========================================================

function getLevelData(
  xp
) {

  const safeXp =
    Math.max(
      0,
      Number(
        xp
      )
      ||
      0
    );


  return {

    level:
      Math.floor(
        safeXp
        /
        XP_PER_LEVEL
      )
      +
      1,

    progress:
      safeXp
      %
      XP_PER_LEVEL

  };
}


// =========================================================
// 15. QUEST LOOKUP
// =========================================================

function findQuest(
  id
) {

  return (

    QUESTS.find(
      quest =>
        quest.id === id
    )

    ||

    SPECIAL_QUESTS[
      id
    ]

  );
}


// =========================================================
// 16. SUPABASE INITIALIZATION
// =========================================================

async function initializeSupabase() {

  setPartySyncStatus(
    "Connecting to the guild..."
  );


  try {

    const {
      data:
      {
        session
      }
    } =
      await supabaseClient.auth
        .getSession();


    if (
      session?.user
    ) {

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


      if (
        error
      ) {

        throw error;

      }


      supabaseUser =
        data.user;

    }


    if (
      !supabaseUser
    ) {

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

  catch (
    error
  ) {

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
    ||
    !supabaseUser
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
      .from(
        "profiles"
      )
      .upsert(
        {

          user_id:
            supabaseUser.id,

          profile_id:
            activeProfileId,

          display_name:
            settings.playerName
            ||
            character.defaultName,

          class_name:
            character.className

        },
        {

          onConflict:
            "user_id"

        }
      );


  if (
    error
  ) {

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
    ||
    !supabaseUser
  ) {

    return null;

  }


  const {
    data:
      membership,
    error:
      membershipError
  } =
    await supabaseClient
      .from(
        "party_members"
      )
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
          ascending:
            false
        }
      )
      .limit(
        1
      )
      .maybeSingle();


  if (
    membershipError
  ) {

    throw membershipError;

  }


  if (
    !membership
  ) {

    renderParty();


    renderSettings(
      getSettings()
    );


    return null;

  }


  const {
    data:
      party,
    error:
      partyError
  } =
    await supabaseClient
      .from(
        "parties"
      )
      .select(
        "*"
      )
      .eq(
        "id",
        membership.party_id
      )
      .single();


  if (
    partyError
  ) {

    throw partyError;

  }


  currentParty =
    party;


  await renderParty();


  renderSettings(
    getSettings()
  );


  return (
    currentParty
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


  renderSettings(
    settings
  );


  renderParty();


  applyMotionSetting(
    settings
  );


  bindQuestCards();
}


// =========================================================
// 20. PROFILE DISPLAY
// =========================================================

function renderProfile(
  settings
) {

  const character =
    getCharacterConfig();


  const name =
    settings.playerName
    ||
    character.defaultName;


  $("#profileName")
    .textContent =
      name;


  $("#profileAvatar")
    .textContent =
      name
        .charAt(
          0
        )
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
    ||
    DEFAULT_WEEKLY_GOAL;


  const completed =
    state.weeklyCompleted.length;


  const percent =
    Math.min(
      100,
      (
        completed
        /
        goal
      )
      *
      100
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
    completed >=
    goal
  ) {

    $("#weekStatus")
      .textContent =
        "Week conquered.";

  }

  else if (
    completed ===
      goal - 1
    &&
    goal > 1
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
    ||
    DEFAULT_WEEKLY_GOAL;


  const weekKey =
    getWeekKey();


  const weekConquered =
    state.weeklyCompleted.length
    >=
    goal;


  const bossDefeated =
    state.bossDefeatedWeek
    ===
    weekKey;


  const bossButton =
    $("#bossButton");


  bossButton.disabled =
    !weekConquered
    ||
    bossDefeated;


  if (
    bossDefeated
  ) {

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
                  ›
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

  $$(
    "[data-quest-id]"
  )
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
                event.key ===
                  "Enter"
                ||
                event.key ===
                  " "
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
    getLevelData(
      xp
    );


  $(
    `#${type}Level`
  )
    .textContent =
      `Lv. ${level}`;


  $(
    `#${type}Xp`
  )
    .textContent =
      `${xp} XP`;


  $(
    `#${type}Bar`
  )
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
    ||
    character.defaultName;


  const totalXp =
    state.xp.strength
    +
    state.xp.endurance
    +
    state.xp.restoration;


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
      `${displayName} — ${character.className}`;


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

function openQuest(
  id
) {

  const quest =
    findQuest(
      id
    );


  if (
    !quest
  ) {

    return;

  }


  if (
    id ===
    "boss"
  ) {

    const state =
      normalizeWeek();


    const settings =
      getSettings();


    const goal =
      Number(
        settings.weeklyGoal
      )
      ||
      DEFAULT_WEEKLY_GOAL;


    const weekKey =
      getWeekKey();


    if (
      state.weeklyCompleted.length
      <
      goal
    ) {

      return;

    }


    if (
      state.bossDefeatedWeek
      ===
      weekKey
    ) {

      return;

    }

  }


  activeQuest =
    quest;


  resetTimer();


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
    quest.id ===
    "boss"
  ) {

    $("#dialogReward")
      .innerHTML =
        `
          +${BOSS_STRENGTH_XP} Strength XP
          ·
          +${BOSS_ENDURANCE_XP} Endurance XP
          ·
          <img
            class="currency-icon-small"
            src="icons/gold-icon.webp"
            alt=""
            aria-hidden="true"
          >
          ${BOSS_GOLD}
          ·
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
          ·
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
// 28. EXERCISE CHECKLIST
// =========================================================

function renderExerciseList(
  quest
) {

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

  if (
    !activeQuest
  ) {

    return;

  }


  const completedQuest =
    activeQuest;


  /*
    Boss Battles use the separate victory path.
  */

  if (
    completedQuest.id ===
    "boss"
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
    ||
    DEFAULT_WEEKLY_GOAL;


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
    ||
    0;


  const earnedGold =
    Number(
      completedQuest.gold
    )
    ||
    0;


  state.weeklyCompleted.push(
    {

      questId:
        completedQuest.id,

      completedAt

    }
  );


  state.xp[
    completedQuest.xpType
  ] +=
    earnedXp;


  state.gold +=
    earnedGold;


  state.history.unshift(
    {

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

    }
  );


  const completedAfter =
    state.weeklyCompleted.length;


  /*
    WEEK CONQUERED

    This only fires when an actual quest
    completion crosses the weekly threshold.

    It cannot award twice during the same week.
  */

  const conqueredWeekNow =
    completedBefore
      <
      goal
    &&
    completedAfter
      >=
      goal
    &&
    state.weekConqueredRewardWeek
      !==
      weekKey;


  if (
    conqueredWeekNow
  ) {

    state.gold +=
      WEEK_CONQUERED_GOLD;


    state.weekConqueredRewardWeek =
      weekKey;

  }


  saveState(
    state
  );


  activeQuest =
    null;


  closeQuest();


  let partySynced =
    false;


  if (
    supabaseReady
    &&
    supabaseUser
    &&
    currentParty
  ) {

    partySynced =
      await syncQuestActivityToParty(
        completedQuest,
        completedAt
      );

  }


  render();


  if (
    currentParty
  ) {

    await renderParty();

  }


  /*
    The Week Conquered modal takes priority
    over the ordinary completion toast.
  */

  if (
    conqueredWeekNow
  ) {

    openWeekConquered();


    return;

  }


  if (
    supabaseReady
    &&
    currentParty
    &&
    !partySynced
  ) {

    showToast(
      `Quest saved · +${earnedXp} XP · +${earnedGold} Gold · Party sync failed`
    );

  }

  else {

    showToast(
      `Quest Complete · +${earnedXp} XP · +${earnedGold} Gold`
    );

  }
}


// =========================================================
// 30. WEEK CONQUERED
// =========================================================

function openWeekConquered() {

  const dialog =
    $("#weekConqueredDialog");


  if (
    dialog
    &&
    !dialog.open
  ) {

    dialog.showModal();

  }
}


function closeWeekConquered() {

  const dialog =
    $("#weekConqueredDialog");


  if (
    dialog?.open
  ) {

    dialog.close();

  }


  render();


  showToast(
    `Week Conquered · +${WEEK_CONQUERED_GOLD} Gold · Boss Battle Unlocked`
  );
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
    Number(
      settings.weeklyGoal
    )
    ||
    DEFAULT_WEEKLY_GOAL;


  const weekKey =
    getWeekKey();


  /*
    Defensive check:
    the Boss cannot be completed before
    the weekly campaign is conquered.
  */

  if (
    state.weeklyCompleted.length
    <
    goal
  ) {

    closeQuest();


    activeQuest =
      null;


    showToast(
      "Conquer the week before facing the Boss."
    );


    return;

  }


  /*
    Defensive check:
    the same Boss cannot be defeated twice
    during a single week.
  */

  if (
    state.bossDefeatedWeek
    ===
    weekKey
  ) {

    closeQuest();


    activeQuest =
      null;


    showToast(
      "The Boss has already been defeated this week."
    );


    return;

  }


  /*
    The Boss is now defeated.

    Rewards are deliberately NOT granted yet.
    The player must press Claim Rewards.
  */

  state.bossDefeatedWeek =
    weekKey;


  saveState(
    state
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
    &&
    !dialog.open
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


  /*
    Rewards can only be claimed after
    this week's Boss has actually fallen.
  */

  if (
    state.bossDefeatedWeek
    !==
    weekKey
  ) {

    showToast(
      "No Boss reward is waiting."
    );


    return;

  }


  /*
    Idempotency guard.

    Repeated taps, reloads, or reopened dialogs
    cannot duplicate the treasure.
  */

  if (
    state.bossRewardsClaimedWeek
    ===
    weekKey
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


  // XP

  state.xp.strength +=
    BOSS_STRENGTH_XP;


  state.xp.endurance +=
    BOSS_ENDURANCE_XP;


  // CURRENCY

  state.gold +=
    BOSS_GOLD;


  state.crystals +=
    BOSS_CRYSTALS;


  // LOCK REWARD

  state.bossRewardsClaimedWeek =
    weekKey;


  /*
    Record the Boss as a personal character
    achievement.

    It does not enter weeklyCompleted because
    the weekly goal was conquered before
    the Boss became available.
  */

  state.history.unshift(
    {

      questId:
        "boss",

      title:
        "Boss Battle",

      category:
        "Boss",

      xp:
        BOSS_STRENGTH_XP
        +
        BOSS_ENDURANCE_XP,

      xpType:
        "mixed",

      gold:
        BOSS_GOLD,

      crystals:
        BOSS_CRYSTALS,

      completedAt

    }
  );


  saveState(
    state
  );


  /*
    Fellowship activity currently stores XP
    and Gold.

    Crystals remain personal character inventory
    until we intentionally add crystal support
    to the Supabase schema later.
  */

  let partySynced =
    false;


  if (
    supabaseReady
    &&
    supabaseUser
    &&
    currentParty
  ) {

    partySynced =
      await syncBossActivityToParty(
        completedAt
      );

  }


  closeBossDefeated();


  render();


  if (
    currentParty
  ) {

    await renderParty();

  }


  if (
    supabaseReady
    &&
    currentParty
    &&
    !partySynced
  ) {

    showToast(
      `Boss Rewards Claimed · +100 XP · +${BOSS_GOLD} Gold · +${BOSS_CRYSTALS} Crystals · Party sync failed`
    );

  }

  else {

    showToast(
      `Boss Rewards Claimed · +100 XP · +${BOSS_GOLD} Gold · +${BOSS_CRYSTALS} Crystals`
    );

  }
}


function closeBossDefeated() {

  const dialog =
    $("#bossDefeatedDialog");


  if (
    dialog?.open
  ) {

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
        .from(
          "quest_activity"
        )
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
              ||
              character.defaultName,

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

          }
        );


    if (
      error
    ) {

      throw error;

    }


    return true;

  }

  catch (
    error
  ) {

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
        .from(
          "quest_activity"
        )
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
              ||
              character.defaultName,

            quest_id:
              "boss",

            quest_title:
              "Boss Battle",

            xp:
              BOSS_STRENGTH_XP
              +
              BOSS_ENDURANCE_XP,

            gold:
              BOSS_GOLD,

            week_key:
              getWeekKey(),

            completed_at:
              completedAt

          }
        );


    if (
      error
    ) {

      throw error;

    }


    return true;

  }

  catch (
    error
  ) {

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

  pauseTimer();


  const dialog =
    $("#questDialog");


  if (
    dialog?.open
  ) {

    dialog.close();

  }
}


// =========================================================
// 37. TIMER
// =========================================================

function startTimer() {

  if (
    timerInterval
  ) {

    return;

  }


  $("#timerToggleButton")
    .textContent =
      "Pause";


  timerInterval =
    setInterval(
      () => {

        timerSeconds++;


        updateTimerDisplay();

      },
      1000
    );
}


function pauseTimer() {

  if (
    timerInterval
  ) {

    clearInterval(
      timerInterval
    );


    timerInterval =
      null;

  }


  $("#timerToggleButton")
    .textContent =
      "Start";
}


function resetTimer() {

  pauseTimer();


  timerSeconds =
    0;


  updateTimerDisplay();
}


function toggleTimer() {

  if (
    timerInterval
  ) {

    pauseTimer();

  }

  else {

    startTimer();

  }
}


function updateTimerDisplay() {

  const hours =
    Math.floor(
      timerSeconds
      /
      3600
    );


  const minutes =
    Math.floor(
      (
        timerSeconds
        %
        3600
      )
      /
      60
    );


  const seconds =
    timerSeconds
    %
    60;


  if (
    hours > 0
  ) {

    $("#timerDisplay")
      .textContent =
        (
          String(
            hours
          )
            .padStart(
              2,
              "0"
            )
          +
          ":"
          +
          String(
            minutes
          )
            .padStart(
              2,
              "0"
            )
          +
          ":"
          +
          String(
            seconds
          )
            .padStart(
              2,
              "0"
            )
        );

  }

  else {

    $("#timerDisplay")
      .textContent =
        (
          String(
            minutes
          )
            .padStart(
              2,
              "0"
            )
          +
          ":"
          +
          String(
            seconds
          )
            .padStart(
              2,
              "0"
            )
        );

  }
}


// =========================================================
// 38. HISTORY
// =========================================================

function openHistory() {

  const state =
    normalizeWeek();


  if (
    state.history.length ===
    0
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

                    month:
                      "short",

                    day:
                      "numeric",

                    year:
                      "numeric"

                  }
                );


              const gold =
                Number(
                  item.gold
                )
                ||
                0;


              const crystals =
                Number(
                  item.crystals
                )
                ||
                0;


              const xpTypeText =
                item.xpType ===
                "mixed"
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

                    · +${item.xp}
                    ${xpTypeText} XP


                    ${
                      gold
                        ? `
                          ·
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
                          ·
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
    $("#historyDialog")
      ?.open
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

    eyebrow:
      "Training Guild",

    title:
      "Quest Board"

  },


  character: {

    eyebrow:
      "Adventurer",

    title:
      "Character"

  },


  party: {

    eyebrow:
      "Fellowship",

    title:
      "Party"

  },


  settings: {

    eyebrow:
      "Guild Configuration",

    title:
      "Settings"

  }

};


// =========================================================
// 40. VIEW NAVIGATION
// =========================================================

async function setView(
  view
) {

  activeView =
    VIEW_HEADERS[
      view
    ]
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
          ===
          activeView;


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
          ===
          activeView
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


  window.scrollTo(
    {

      top:
        0,

      behavior:
        getSettings()
          .reducedMotion
          ? "auto"
          : "smooth"

    }
  );


  if (
    activeView ===
    "party"
  ) {

    await refreshParty();

  }


  if (
    activeView ===
    "settings"
  ) {

    renderSettings(
      getSettings()
    );

  }
}


// =========================================================
// 41. SETTINGS RENDER
// =========================================================

function renderSettings(
  settings
) {

  $("#playerNameInput")
    .value =
      settings.playerName
      ||
      getCharacterConfig()
        .defaultName;


  $("#weeklyGoalSelect")
    .value =
      String(
        settings.weeklyGoal
        ||
        DEFAULT_WEEKLY_GOAL
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


  if (
    currentParty
  ) {

    $("#partySettingsStatus")
      .textContent =
        `Member of ${currentParty.name}.`;

  }

  else if (
    supabaseReady
  ) {

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


  if (
    !name
  ) {

    showToast(
      "Enter a player name."
    );


    return;

  }


  const settings =
    getSettings();


  settings.playerName =
    name;


  saveSettings(
    settings
  );


  render();


  if (
    supabaseReady
  ) {

    try {

      await syncProfileToSupabase();

    }

    catch (
      error
    ) {

      console.error(
        error
      );


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
    !Number.isFinite(
      goal
    )
    ||
    goal < 1
  ) {

    return;

  }


  const settings =
    getSettings();


  settings.weeklyGoal =
    goal;


  saveSettings(
    settings
  );


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


  saveSettings(
    settings
  );


  applyMotionSetting(
    settings
  );


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


  /*
    IMPORTANT:

    We do NOT clear:
    - weekConqueredRewardWeek
    - bossDefeatedWeek
    - bossRewardsClaimedWeek

    Therefore Reset This Week cannot be used
    to farm repeated weekly or Boss rewards.
  */


  saveState(
    state
  );


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


  saveState(
    state
  );


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
          *
          characters.length
        )
      );

  }


  return code;
}


// =========================================================
// 50. CREATE PARTY
// =========================================================

async function createParty() {

  if (
    !supabaseReady
  ) {

    showToast(
      "Guild connection is not ready."
    );


    return;

  }


  if (
    currentParty
  ) {

    showToast(
      "You already belong to a fellowship."
    );


    return;

  }


  const inviteCode =
    generatePartyCode();


  try {

    const {
      data:
        partyId,
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


    if (
      error
    ) {

      throw error;

    }


    await loadCurrentParty();


    showToast(
      `Fellowship created · ${inviteCode}`
    );

  }

  catch (
    error
  ) {

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


  if (
    !form.hidden
  ) {

    $("#partyCodeInput")
      .focus();

  }
}


// =========================================================
// 52. JOIN PARTY
// =========================================================

async function joinParty() {

  if (
    !supabaseReady
  ) {

    showToast(
      "Guild connection is not ready."
    );


    return;

  }


  if (
    currentParty
  ) {

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


  if (
    code.length <
    4
  ) {

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


    if (
      error
    ) {

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

  catch (
    error
  ) {

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
    ||
    !supabaseUser
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
        .from(
          "party_members"
        )
        .delete()
        .eq(
          "party_id",
          currentParty.id
        )
        .eq(
          "user_id",
          supabaseUser.id
        );


    if (
      error
    ) {

      throw error;

    }


    currentParty =
      null;


    renderParty();


    renderSettings(
      getSettings()
    );


    showToast(
      "You left the fellowship."
    );

  }

  catch (
    error
  ) {

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

  if (
    !supabaseReady
  ) {

    renderParty();


    return;

  }


  try {

    await loadCurrentParty();

  }

  catch (
    error
  ) {

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
    ||
    !dashboard
  ) {

    return;

  }


  if (
    !supabaseReady
  ) {

    emptyState.hidden =
      false;


    dashboard.hidden =
      true;


    return;

  }


  if (
    !currentParty
  ) {

    emptyState.hidden =
      false;


    dashboard.hidden =
      true;


    setPartySyncStatus(
      "Connected · No fellowship joined.",
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
      ||
      "The Fellowship";


  $("#partyInviteCode")
    .textContent =
      currentParty.invite_code
      ||
      "------";


  setPartySyncStatus(
    "Fellowship synchronized.",
    "connected"
  );


  try {

    const [
      members,
      activity
    ] =
      await Promise.all(
        [
          fetchPartyMembers(),
          fetchPartyActivity()
        ]
      );


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

  catch (
    error
  ) {

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

  if (
    !currentParty
  ) {

    return [];

  }


  const {
    data:
      memberships,
    error:
      membershipError
  } =
    await supabaseClient
      .from(
        "party_members"
      )
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
          ascending:
            true
        }
      );


  if (
    membershipError
  ) {

    throw membershipError;

  }


  const userIds =
    memberships
      .map(
        item =>
          item.user_id
      );


  if (
    userIds.length ===
    0
  ) {

    return [];

  }


  const {
    data:
      profiles,
    error:
      profileError
  } =
    await supabaseClient
      .from(
        "profiles"
      )
      .select(
        "user_id, profile_id, display_name, class_name"
      )
      .in(
        "user_id",
        userIds
      );


  if (
    profileError
  ) {

    throw profileError;

  }


  return (
    memberships.map(
      membership => {

        const profile =
          profiles.find(
            item =>
              item.user_id
              ===
              membership.user_id
          );


        return {

          user_id:
            membership.user_id,

          joined_at:
            membership.joined_at,

          profile_id:
            profile?.profile_id
            ||
            null,

          display_name:
            profile?.display_name
            ||
            "Adventurer",

          class_name:
            profile?.class_name
            ||
            "Unknown Class"

        };

      }
    )
  );
}


// =========================================================
// 57. FETCH PARTY ACTIVITY
// =========================================================

async function fetchPartyActivity() {

  if (
    !currentParty
  ) {

    return [];

  }


  const {
    data,
    error
  } =
    await supabaseClient
      .from(
        "quest_activity"
      )
      .select(
        "*"
      )
      .eq(
        "party_id",
        currentParty.id
      )
      .order(
        "completed_at",
        {
          ascending:
            false
        }
      )
      .limit(
        100
      );


  if (
    error
  ) {

    throw error;

  }


  return (
    data
    ||
    []
  );
}


// =========================================================
// 58. RENDER PARTY MEMBERS
// =========================================================

function renderPartyMembers(
  members,
  activity
) {

  if (
    members.length ===
    0
  ) {

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

            /*
              Boss Battles appear in the activity
              feed but are not counted as normal
              weekly quest completions.
            */

            const weeklyQuestActivity =
              activity.filter(
                item =>
                  item.user_id
                    ===
                    member.user_id
                  &&
                  item.week_key
                    ===
                    currentWeek
                  &&
                  item.quest_id
                    !==
                    "boss"
              );


            const weeklyGoldActivity =
              activity.filter(
                item =>
                  item.user_id
                    ===
                    member.user_id
                  &&
                  item.week_key
                    ===
                    currentWeek
              );


            const weeklyGold =
              weeklyGoldActivity.reduce(
                (
                  total,
                  item
                ) =>
                  total
                  +
                  (
                    Number(
                      item.gold
                    )
                    ||
                    0
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
              ||
              "";


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
                      weeklyQuestActivity.length ===
                      1
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

                </div>

              </article>
            `;

          }
        )
        .join("");
}


// =========================================================
// 59. PARTY CHALLENGE
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
    Number(
      settings.weeklyGoal
    )
    ||
    DEFAULT_WEEKLY_GOAL;


  const safeMemberCount =
    Math.max(
      1,
      memberCount
    );


  const partyGoal =
    personalGoal
    *
    safeMemberCount;


  /*
    Boss Battles are bonus victories.

    They do not inflate the Fellowship's
    ordinary weekly quest goal.
  */

  const weeklyActivity =
    activity.filter(
      item =>
        item.week_key
          ===
          currentWeek
        &&
        item.quest_id
          !==
          "boss"
    );


  const completed =
    weeklyActivity.length;


  const percent =
    Math.min(
      100,
      (
        completed
        /
        partyGoal
      )
      *
      100
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


  if (
    completed >=
    partyGoal
  ) {

    $("#partyChallengeStatus")
      .textContent =
        "Challenge conquered.";

  }

  else if (
    completed > 0
  ) {

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
// 60. PARTY ACTIVITY
// =========================================================

function renderPartyActivity(
  activity
) {

  const recent =
    activity.slice(
      0,
      12
    );


  if (
    recent.length ===
    0
  ) {

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

                  month:
                    "short",

                  day:
                    "numeric"

                }
              );


            const boss =
              item.quest_id ===
              "boss";


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
                  · +${item.xp} XP
                  · +${item.gold} Gold
                </span>

              </article>
            `;

          }
        )
        .join("");
}


// =========================================================
// 61. PARTY STATUS
// =========================================================

function setPartySyncStatus(
  text,
  state = ""
) {

  const element =
    $("#partySyncStatus");


  if (
    !element
  ) {

    return;

  }


  element.textContent =
    text;


  element.dataset.state =
    state;
}


// =========================================================
// 62. PARTY REFRESH LOOP
// =========================================================

function startPartyRefreshLoop() {

  clearInterval(
    partyRefreshTimer
  );


  partyRefreshTimer =
    setInterval(
      async () => {

        if (
          activeView ===
          "party"
        ) {

          await refreshParty();

        }

      },
      PARTY_REFRESH_INTERVAL
    );
}


// =========================================================
// 63. TOAST
// =========================================================

function showToast(
  message
) {

  const toast =
    $("#toast");


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
// 64. UTILITIES
// =========================================================

function capitalize(
  text
) {

  if (
    !text
  ) {

    return "";

  }


  return (
    text
      .charAt(
        0
      )
      .toUpperCase()
    +
    text.slice(
      1
    )
  );
}


function escapeHtml(
  value
) {

  return String(
    value
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


// =========================================================
// 65. MAIN EVENTS
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
// 66. SETTINGS EVENTS
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
// 67. PARTY EVENTS
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
        event.key ===
        "Enter"
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


// =========================================================
// 68. DIALOG OUTSIDE CLICK
// =========================================================

$("#questDialog")
  ?.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        $("#questDialog")
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
        event.target ===
        $("#historyDialog")
      ) {

        closeHistory();

      }

    }
  );


// =========================================================
// 69. LOCK VICTORY DIALOGS
// =========================================================

/*
  These screens require the intended action.

  WEEK CONQUERED:
  Continue

  BOSS DEFEATED:
  Claim Rewards
*/

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
// 70. ESCAPE KEY
// =========================================================

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key !==
      "Escape"
    ) {

      return;

    }


    /*
      Victory dialogs deliberately ignore Escape.
    */

    if (
      $("#weekConqueredDialog")
        ?.open
      ||
      $("#bossDefeatedDialog")
        ?.open
    ) {

      event.preventDefault();


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
      $("#historyDialog")
        ?.open
    ) {

      closeHistory();

    }

  }
);


// =========================================================
// 71. RESTORE PENDING BOSS REWARD
// =========================================================

function restorePendingVictory() {

  const state =
    normalizeWeek();


  const weekKey =
    getWeekKey();


  /*
    If the browser reloads after the Boss falls
    but before Claim Rewards is pressed, the
    crystal cluster returns.

    The treasure cannot be lost by refreshing.
  */

  if (
    state.bossDefeatedWeek
      ===
      weekKey
    &&
    state.bossRewardsClaimedWeek
      !==
      weekKey
  ) {

    openBossDefeated();

  }
}


// =========================================================
// 72. INITIALIZE
// =========================================================

async function initializeApp() {

  chooseProfile();


  render();


  await setView(
    activeView
  );


  await initializeSupabase();


  renderSettings(
    getSettings()
  );


  if (
    activeView ===
    "party"
  ) {

    await refreshParty();

  }


  restorePendingVictory();
}


initializeApp();