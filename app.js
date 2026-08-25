// =========================================================
// QUEST BOARD
// app.js
//
// Phase 3.1:
// - Stable profile IDs separate from display names
// - Automatic migration from legacy Farmer / Jess identity
// - Independent device profiles
// - Four real app views
// - Weekly configurable objective
// - Quest checklist modal
// - Quest timer
// - XP + levels
// - Gold economy
// - Character tarot cards
// - Fixed character classes
// - History
// - Boss Battle unlock
// - Character summary
// - Local Party prototype
// - Settings persistence
// - Backward-compatible localStorage migration
// =========================================================


// =========================================================
// 1. QUEST DATA
// =========================================================

const QUESTS = [

  {
    id: "there-back",
    title: "There and Back",
    category: "Endurance",
    time: "15–25 min",

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
    time: "10–20 min",

    xpType: "strength",
    xp: 25,
    gold: 15,

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
    id: "dragonstrength",
    title: "DragonStrength",
    category: "Strength",
    time: "10–20 min",

    xpType: "strength",
    xp: 30,
    gold: 20,

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
      "20–30 second plank",
      "Repeat until 10 minutes is complete"
    ]
  },


  {
    id: "restoration",
    title: "Restoration",
    category: "Recovery",
    time: "10–20 min",

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
    time: "20–30 min",

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
// 2. SPECIAL QUESTS
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
    time: "30–45 min",

    xpType: "strength",
    xp: 50,
    gold: 50,

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
// 3. CHARACTER / PROFILE DATA
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
// 4. APP CONSTANTS
// =========================================================

const DEFAULT_WEEKLY_GOAL =
  3;

const XP_PER_LEVEL =
  100;

const PARTY_GOAL_MULTIPLIER =
  2;


// =========================================================
// 5. PROFILE ID HELPERS
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
    normalized === "jess"
  ) {

    return "jess";

  }


  if (
    normalized === "farmer"
  ) {

    return "farmer";

  }


  return null;
}


function getLegacyProfileName(
  profileId
) {

  return (
    CHARACTER_PROFILES[
      profileId
    ]?.legacyName
    ||
    "Farmer"
  );
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


// =========================================================
// 6. PROFILE ID MIGRATION
// =========================================================

function getInitialProfileId() {

  /*
    New architecture uses:

    questBoardActiveProfileId = "farmer"
    questBoardActiveProfileId = "jess"

    Older builds used:

    questBoardActiveProfile = "Farmer"
    questBoardActiveProfile = "Jess"
  */


  const newSavedId =
    normalizeProfileId(
      localStorage.getItem(
        "questBoardActiveProfileId"
      )
    );


  if (
    newSavedId
  ) {

    return newSavedId;

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


// =========================================================
// 7. APP STATE
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


// =========================================================
// 8. DOM HELPERS
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
// 9. PROFILE SETUP
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


  const selectedId =
    normalizeProfileId(
      choice
    );


  activeProfileId =
    selectedId
    ||
    "farmer";


  localStorage.setItem(
    "questBoardActiveProfileId",
    activeProfileId
  );


  /*
    Keep the legacy key updated too.

    This makes older builds less likely
    to behave strangely if they are still
    temporarily cached.
  */

  localStorage.setItem(
    "questBoardActiveProfile",
    getLegacyProfileName(
      activeProfileId
    )
  );
}


// =========================================================
// 10. STORAGE KEYS
// =========================================================

function getStorageKey() {

  /*
    Intentionally retain the old
    Farmer / Jess key format.

    That means existing save data survives
    without having to copy/delete storage.
  */

  const legacyName =
    getLegacyProfileName(
      activeProfileId
    );


  return (
    `questBoardState-${legacyName}`
  );
}


function getSettingsKey() {

  const legacyName =
    getLegacyProfileName(
      activeProfileId
    );


  return (
    `questBoardSettings-${legacyName}`
  );
}


function getPartyKey() {

  const legacyName =
    getLegacyProfileName(
      activeProfileId
    );


  return (
    `questBoardParty-${legacyName}`
  );
}


// =========================================================
// 11. SETTINGS STORAGE
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

    const parsed =
      JSON.parse(
        saved
      );


    return {

      ...createFreshSettings(),

      ...parsed

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
// 12. QUEST STATE STORAGE
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

    history:
      []

  };
}


// =========================================================
// 13. SAVE MIGRATION
// =========================================================

function migrateState(
  parsed
) {

  const fresh =
    createFreshState();


  const safeGold =
    Number(
      parsed?.gold
    );


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
      Number.isFinite(
        safeGold
      )
        ? safeGold
        : 0,

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
        ? parsed.history.map(
            item => {

              const historicalGold =
                Number(
                  item?.gold
                );


              return {

                ...item,

                gold:
                  Number.isFinite(
                    historicalGold
                  )
                    ? historicalGold
                    : 0

              };

            }
          )
        : []

  };
}


// =========================================================
// 14. READ / SAVE STATE
// =========================================================

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

    const parsed =
      JSON.parse(
        saved
      );


    return (
      migrateState(
        parsed
      )
    );

  }

  catch (
    error
  ) {

    console.error(
      "Could not read Quest Board save data.",
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
// 15. LOCAL PARTY STORAGE
// =========================================================

function migrateParty(
  party
) {

  if (
    !party
  ) {

    return null;

  }


  const members =
    Array.isArray(
      party.members
    )
      ? party.members.map(
          member => {

            const migratedProfileId =
              normalizeProfileId(
                member.profileId
                ||
                member.profile
              );


            return {

              ...member,

              profileId:
                migratedProfileId,

              name:
                member.name
                ||
                (
                  migratedProfileId
                    ? getCharacterConfig(
                        migratedProfileId
                      ).defaultName
                    : "Adventurer"
                )

            };

          }
        )
      : [];


  return {

    ...party,

    members

  };
}


function getParty() {

  const saved =
    localStorage.getItem(
      getPartyKey()
    );


  if (
    !saved
  ) {

    return null;

  }


  try {

    const parsed =
      JSON.parse(
        saved
      );


    return (
      migrateParty(
        parsed
      )
    );

  }

  catch (
    error
  ) {

    console.error(
      "Could not read party data.",
      error
    );


    return null;

  }
}


function saveParty(
  party
) {

  localStorage.setItem(
    getPartyKey(),
    JSON.stringify(
      party
    )
  );
}


function clearParty() {

  localStorage.removeItem(
    getPartyKey()
  );
}


// =========================================================
// 16. WEEK HANDLING
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


  const currentWeek =
    getWeekKey();


  if (
    state.weekKey !==
    currentWeek
  ) {

    state.weekKey =
      currentWeek;


    state.weeklyCompleted =
      [];


    saveState(
      state
    );

  }


  return state;
}


// =========================================================
// 17. LEVEL SYSTEM
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


  const level =
    Math.floor(
      safeXp
      /
      XP_PER_LEVEL
    )
    +
    1;


  const progress =
    safeXp
    %
    XP_PER_LEVEL;


  return {

    level,
    progress

  };
}


// =========================================================
// 18. QUEST LOOKUP
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


  renderParty(
    state,
    settings
  );


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


  const displayName =
    settings.playerName
    ||
    character.defaultName;


  $("#profileName")
    .textContent =
      displayName;


  $("#profileAvatar")
    .textContent =
      displayName
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


  const bossUnlocked =
    state.weeklyCompleted.length
    >=
    goal;


  const bossButton =
    $("#bossButton");


  bossButton.disabled =
    !bossUnlocked;


  if (
    bossUnlocked
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

  const questGrid =
    $("#questGrid");


  questGrid.innerHTML =
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

              <span
                class="quest-gold-reward"
                aria-label="${quest.gold} gold"
              >
                ${quest.gold}g
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
// 24. QUEST CARD EVENTS
// =========================================================

function bindQuestCards() {

  $$(
    "[data-quest-id]"
  )
    .forEach(
      element => {

        element.onclick =
          () => {

            const id =
              element.dataset.questId;


            if (
              id === "boss"
              &&
              element.disabled
            ) {

              return;

            }


            openQuest(
              id
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
                ||
                event.key === " "
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


  const characterImage =
    $("#characterCardImage");


  if (
    characterImage
  ) {

    /*
      IMPORTANT:

      This now depends ONLY on stable profileId.

      Renaming Jess to "Nightshade"
      does not turn her into Farmer.

      Renaming Farmer to "Grimfang"
      does not change his character.
    */

    characterImage.src =
      character.card;


    characterImage.alt =
      `${displayName} — ${character.className}`;

  }


  $("#characterGold")
    .textContent =
      state.gold;


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


  $("#dialogReward")
    .textContent =
      (
        `+${quest.xp} `
        +
        `${capitalize(
          quest.xpType
        )} XP`
        +
        ` · +${quest.gold} Gold`
      );


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

  const list =
    $("#exerciseList");


  list.innerHTML =
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

function completeQuest() {

  if (
    !activeQuest
  ) {

    return;

  }


  const state =
    normalizeWeek();


  const completedAt =
    new Date()
      .toISOString();


  const earnedXp =
    Number(
      activeQuest.xp
    )
    ||
    0;


  const earnedGold =
    Number(
      activeQuest.gold
    )
    ||
    0;


  state.weeklyCompleted.push({

    questId:
      activeQuest.id,

    completedAt

  });


  state.xp[
    activeQuest.xpType
  ] +=
    earnedXp;


  state.gold +=
    earnedGold;


  state.history.unshift({

    questId:
      activeQuest.id,

    title:
      activeQuest.title,

    category:
      activeQuest.category,

    xp:
      earnedXp,

    xpType:
      activeQuest.xpType,

    gold:
      earnedGold,

    completedAt

  });


  saveState(
    state
  );


  activeQuest =
    null;


  closeQuest();


  showToast(
    (
      `Quest Complete · `
      +
      `+${earnedXp} XP · `
      +
      `+${earnedGold} Gold`
    )
  );


  render();
}


// =========================================================
// 30. CLOSE QUEST
// =========================================================

function closeQuest() {

  pauseTimer();


  const dialog =
    $("#questDialog");


  if (
    dialog
    &&
    dialog.open
  ) {

    dialog.close();

  }
}


// =========================================================
// 31. TIMER
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
// 32. HISTORY
// =========================================================

function openHistory() {

  const state =
    normalizeWeek();


  const history =
    state.history
    ||
    [];


  if (
    history.length ===
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
        history
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


              const goldText =
                item.gold > 0
                  ? ` · +${item.gold} Gold`
                  : "";


              return `
                <article class="history-item">

                  <strong>
                    ${escapeHtml(
                      item.title
                    )}
                  </strong>

                  <span>
                    ${dateText}
                    ·
                    +${item.xp}
                    ${capitalize(
                      item.xpType
                    )}
                    XP
                    ${goldText}
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

  const dialog =
    $("#historyDialog");


  if (
    dialog
    &&
    dialog.open
  ) {

    dialog.close();

  }
}


// =========================================================
// 33. VIEW NAVIGATION
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


function setView(
  view
) {

  const validView =
    VIEW_HEADERS[
      view
    ]
      ? view
      : "board";


  activeView =
    validView;


  localStorage.setItem(
    "questBoardActiveView",
    activeView
  );


  $$(".app-view")
    .forEach(
      section => {

        const isActive =
          section.dataset.appView
          ===
          activeView;


        section.hidden =
          !isActive;


        section.classList.toggle(
          "active-view",
          isActive
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


  const header =
    VIEW_HEADERS[
      activeView
    ];


  $("#screenEyebrow")
    .textContent =
      header.eyebrow;


  $("#screenTitle")
    .textContent =
      header.title;


  window.scrollTo({

    top:
      0,

    behavior:
      getSettings()
        .reducedMotion
        ? "auto"
        : "smooth"

  });


  if (
    activeView ===
    "character"
  ) {

    renderCharacterSummary(
      normalizeWeek(),
      getSettings()
    );

  }


  if (
    activeView ===
    "party"
  ) {

    renderParty(
      normalizeWeek(),
      getSettings()
    );

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


function handleNavigation(
  button
) {

  setView(
    button.dataset.view
  );
}


// =========================================================
// 34. SETTINGS RENDER
// =========================================================

function renderSettings(
  settings
) {

  const character =
    getCharacterConfig();


  $("#playerNameInput")
    .value =
      settings.playerName
      ||
      character.defaultName;


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


  const party =
    getParty();


  $("#leavePartyButton")
    .disabled =
      !party;
}


// =========================================================
// 35. SAVE PLAYER NAME
// =========================================================

function savePlayerName() {

  const input =
    $("#playerNameInput");


  const name =
    input.value
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


  /*
    This changes ONLY display name.

    It does NOT affect:
    - character class
    - portrait
    - save identity
    - party identity
  */

  settings.playerName =
    name;


  saveSettings(
    settings
  );


  render();


  showToast(
    "Adventurer name saved."
  );
}


// =========================================================
// 36. WEEKLY GOAL
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
// 37. REDUCED MOTION
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
// 38. SOUND SETTING
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
// 39. RESET THIS WEEK
// =========================================================

function resetThisWeek() {

  const confirmed =
    confirm(
      "Reset this week's completed quests?\n\nXP, gold, and quest history will remain."
    );


  if (
    !confirmed
  ) {

    return;

  }


  const state =
    getState();


  state.weekKey =
    getWeekKey();


  state.weeklyCompleted =
    [];


  saveState(
    state
  );


  render();


  showToast(
    "Weekly progress reset."
  );
}


// =========================================================
// 40. CLEAR HISTORY
// =========================================================

function clearQuestHistory() {

  const confirmed =
    confirm(
      "Clear the quest chronicle?\n\nYour XP, levels, and gold will remain."
    );


  if (
    !confirmed
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
// 41. RESET CHARACTER
// =========================================================

function resetCharacter() {

  const confirmed =
    confirm(
      "Reset this character completely?\n\nThis will erase XP, gold, levels, weekly progress, and quest history on this device."
    );


  if (
    !confirmed
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
// 42. LOCAL PARTY GENERATOR
// =========================================================

function generatePartyCode() {

  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


  let code =
    "";


  for (
    let i = 0;
    i < 6;
    i++
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
// 43. CREATE PARTY
// =========================================================

function createParty() {

  const settings =
    getSettings();


  const character =
    getCharacterConfig();


  const partyId =
    globalThis.crypto
      ?.randomUUID
      ? globalThis.crypto.randomUUID()
      : `party-${Date.now()}`;


  const party = {

    id:
      partyId,

    name:
      "The Fellowship",

    inviteCode:
      generatePartyCode(),

    createdAt:
      new Date()
        .toISOString(),

    members: [

      {

        name:
          settings.playerName
          ||
          character.defaultName,

        profileId:
          activeProfileId

      }

    ]

  };


  saveParty(
    party
  );


  renderParty(
    normalizeWeek(),
    settings
  );


  renderSettings(
    settings
  );


  showToast(
    "Fellowship created."
  );
}


// =========================================================
// 44. SHOW JOIN PARTY
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
// 45. JOIN PARTY
// =========================================================

function joinParty() {

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


  const settings =
    getSettings();


  const character =
    getCharacterConfig();


  /*
    LOCAL PROTOTYPE ONLY.

    Supabase will replace this
    local implementation.
  */

  const party = {

    id:
      `local-${code}`,

    name:
      "The Fellowship",

    inviteCode:
      code,

    joinedAt:
      new Date()
        .toISOString(),

    members: [

      {

        name:
          settings.playerName
          ||
          character.defaultName,

        profileId:
          activeProfileId

      }

    ]

  };


  saveParty(
    party
  );


  $("#partyCodeInput")
    .value =
      "";


  $("#joinPartyForm")
    .hidden =
      true;


  renderParty(
    normalizeWeek(),
    settings
  );


  renderSettings(
    settings
  );


  showToast(
    "Fellowship joined."
  );
}


// =========================================================
// 46. LEAVE PARTY
// =========================================================

function leaveParty() {

  const confirmed =
    confirm(
      "Leave this fellowship?"
    );


  if (
    !confirmed
  ) {

    return;

  }


  clearParty();


  renderParty(
    normalizeWeek(),
    getSettings()
  );


  renderSettings(
    getSettings()
  );


  showToast(
    "You left the fellowship."
  );
}


// =========================================================
// 47. PARTY RENDER
// =========================================================

function renderParty(
  state,
  settings
) {

  const party =
    getParty();


  const emptyState =
    $("#partyEmptyState");


  const dashboard =
    $("#partyDashboard");


  if (
    !party
  ) {

    emptyState.hidden =
      false;


    dashboard.hidden =
      true;


    return;

  }


  emptyState.hidden =
    true;


  dashboard.hidden =
    false;


  $("#partyName")
    .textContent =
      party.name
      ||
      "The Fellowship";


  $("#partyInviteCode")
    .textContent =
      party.inviteCode
      ||
      "------";


  renderPartyMembers(
    party,
    state,
    settings
  );


  renderPartyChallenge(
    state,
    settings
  );


  renderPartyActivity(
    state,
    settings
  );
}


// =========================================================
// 48. PARTY MEMBERS
// =========================================================

function renderPartyMembers(
  party,
  state,
  settings
) {

  const members =
    Array.isArray(
      party.members
    )
      ? party.members
      : [];


  const totalXp =
    state.xp.strength
    +
    state.xp.endurance
    +
    state.xp.restoration;


  $("#partyMembers")
    .innerHTML =
      members
        .map(
          member => {

            const memberProfileId =
              normalizeProfileId(
                member.profileId
                ||
                member.profile
              );


            const isCurrent =
              memberProfileId
              ===
              activeProfileId;


            const memberName =
              member.name
              ||
              "Adventurer";


            return `
              <article class="party-member-card">

                <div class="party-member-avatar">
                  ${
                    escapeHtml(
                      memberName
                        .charAt(0)
                        .toUpperCase()
                    )
                  }
                </div>

                <div class="party-member-info">

                  <strong>
                    ${escapeHtml(
                      memberName
                    )}
                  </strong>

                  <span>
                    ${
                      isCurrent
                        ? `${state.weeklyCompleted.length} quests this week`
                        : "Awaiting sync"
                    }
                  </span>

                </div>

                <div class="party-member-score">

                  ${
                    isCurrent
                      ? `${totalXp} XP · ${state.gold}g`
                      : "—"
                  }

                </div>

              </article>
            `;

          }
        )
        .join("");
}


// =========================================================
// 49. PARTY CHALLENGE
// =========================================================

function renderPartyChallenge(
  state,
  settings
) {

  const personalGoal =
    Number(
      settings.weeklyGoal
    )
    ||
    DEFAULT_WEEKLY_GOAL;


  const partyGoal =
    personalGoal
    *
    PARTY_GOAL_MULTIPLIER;


  const completed =
    state.weeklyCompleted.length;


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


  const heading =
    $(
      "#partyDashboard .party-challenge h2"
    );


  if (
    heading
  ) {

    heading.textContent =
      `Complete ${partyGoal} Quests`;

  }
}


// =========================================================
// 50. PARTY ACTIVITY
// =========================================================

function renderPartyActivity(
  state,
  settings
) {

  const character =
    getCharacterConfig();


  const displayName =
    settings.playerName
    ||
    character.defaultName;


  const recent =
    state.history.slice(
      0,
      5
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
                item.completedAt
              );


            const time =
              date.toLocaleDateString(
                undefined,
                {

                  month:
                    "short",

                  day:
                    "numeric"

                }
              );


            const goldText =
              item.gold > 0
                ? ` · +${item.gold}g`
                : "";


            return `
              <article class="party-activity-item">

                <strong>
                  ${escapeHtml(
                    displayName
                  )}
                  completed
                  ${escapeHtml(
                    item.title
                  )}
                </strong>

                <span>
                  ${time}
                  ·
                  +${item.xp}
                  ${capitalize(
                    item.xpType
                  )}
                  XP
                  ${goldText}
                </span>

              </article>
            `;

          }
        )
        .join("");
}


// =========================================================
// 51. TOAST MESSAGE
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
      2200
    );
}


// =========================================================
// 52. UTILITY
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
    text.charAt(0)
      .toUpperCase()
    +
    text.slice(1)
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
// 53. EVENT LISTENERS
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


$$(".nav-item")
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () =>
          handleNavigation(
            button
          )
      );

    }
  );


// =========================================================
// 54. SETTINGS EVENTS
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
// 55. PARTY EVENTS
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


// =========================================================
// 56. CLICK OUTSIDE DIALOG TO CLOSE
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
// 57. ESCAPE KEY
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
// 58. INITIALIZE APP
// =========================================================

chooseProfile();


render();


setView(
  activeView
);