// =========================================================
// QUEST BOARD
// app.js
//
// Phase 2:
// - Independent device profiles
// - Four real app views
// - Weekly configurable objective
// - Quest checklist modal
// - Quest timer
// - XP + levels
// - History
// - Boss Battle unlock
// - Character summary
// - Local Party prototype
// - Settings persistence
// - localStorage persistence
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
// 3. APP CONSTANTS
// =========================================================

const DEFAULT_PROFILES = [
  "Farmer",
  "Jess"
];

const DEFAULT_WEEKLY_GOAL = 3;

const XP_PER_LEVEL = 100;

const PARTY_GOAL_MULTIPLIER = 2;


// =========================================================
// 4. APP STATE
// =========================================================

let activeProfile =
  localStorage.getItem("questBoardActiveProfile") ||
  null;

let activeView =
  localStorage.getItem("questBoardActiveView") ||
  "board";

let activeQuest = null;

let timerSeconds = 0;

let timerInterval = null;

let toastTimeout = null;


// =========================================================
// 5. DOM HELPERS
// =========================================================

const $ = selector =>
  document.querySelector(selector);

const $$ = selector =>
  document.querySelectorAll(selector);


// =========================================================
// 6. PROFILE SETUP
// =========================================================

function chooseProfile() {

  if (activeProfile) {
    return;
  }

  const choice = prompt(
    "Who is using this Quest Board?\n\nType Farmer or Jess"
  );

  if (!choice) {
    activeProfile = "Farmer";
  }

  else if (
    choice.trim().toLowerCase() === "jess"
  ) {
    activeProfile = "Jess";
  }

  else {
    activeProfile = "Farmer";
  }

  localStorage.setItem(
    "questBoardActiveProfile",
    activeProfile
  );
}


// =========================================================
// 7. STORAGE KEYS
// =========================================================

function getStorageKey() {
  return `questBoardState-${activeProfile}`;
}


function getSettingsKey() {
  return `questBoardSettings-${activeProfile}`;
}


function getPartyKey() {
  return `questBoardParty-${activeProfile}`;
}


// =========================================================
// 8. SETTINGS STORAGE
// =========================================================

function createFreshSettings() {

  return {
    playerName:
      activeProfile,

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
// 9. QUEST STATE STORAGE
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

    history:
      []
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

    const parsed =
      JSON.parse(saved);

    return {
      ...createFreshState(),
      ...parsed,

      xp: {
        strength: 0,
        endurance: 0,
        restoration: 0,
        ...(parsed.xp || {})
      },

      weeklyCompleted:
        parsed.weeklyCompleted || [],

      history:
        parsed.history || []
    };

  }

  catch (error) {

    console.error(
      "Could not read Quest Board save data.",
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
// 10. LOCAL PARTY STORAGE
// =========================================================

function getParty() {

  const saved =
    localStorage.getItem(
      getPartyKey()
    );

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved);
  }

  catch (error) {

    console.error(
      "Could not read party data.",
      error
    );

    return null;
  }
}


function saveParty(party) {

  localStorage.setItem(
    getPartyKey(),
    JSON.stringify(party)
  );
}


function clearParty() {

  localStorage.removeItem(
    getPartyKey()
  );
}


// =========================================================
// 11. WEEK HANDLING
// =========================================================

function getWeekKey(date = new Date()) {

  const workingDate =
    new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      )
    );

  const dayNumber =
    workingDate.getUTCDay() || 7;

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
          workingDate - yearStart
        )
        / 86400000
        + 1
      )
      / 7
    );

  return (
    `${workingDate.getUTCFullYear()}`
    + `-W`
    + String(weekNumber).padStart(2, "0")
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

    saveState(state);
  }

  return state;
}


// =========================================================
// 12. LEVEL SYSTEM
// =========================================================

function getLevelData(xp) {

  const level =
    Math.floor(
      xp / XP_PER_LEVEL
    ) + 1;

  const progress =
    xp % XP_PER_LEVEL;

  return {
    level,
    progress
  };
}


// =========================================================
// 13. QUEST LOOKUP
// =========================================================

function findQuest(id) {

  return (
    QUESTS.find(
      quest =>
        quest.id === id
    )
    ||
    SPECIAL_QUESTS[id]
  );
}


// =========================================================
// 14. MAIN RENDER
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

  renderSettings(settings);

  renderParty(
    state,
    settings
  );

  applyMotionSetting(settings);

  bindQuestCards();
}


// =========================================================
// 15. PROFILE DISPLAY
// =========================================================

function renderProfile(settings) {

  const name =
    settings.playerName ||
    activeProfile;

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
// 16. WEEKLY PROGRESS
// =========================================================

function renderWeeklyProgress(
  state,
  settings
) {

  const goal =
    Number(
      settings.weeklyGoal
    ) ||
    DEFAULT_WEEKLY_GOAL;

  const completed =
    state.weeklyCompleted.length;

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
    completed === goal - 1
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
// 17. BOSS BATTLE
// =========================================================

function renderBossBattle(
  state,
  settings
) {

  const goal =
    Number(
      settings.weeklyGoal
    ) ||
    DEFAULT_WEEKLY_GOAL;

  const bossUnlocked =
    state.weeklyCompleted.length
    >= goal;

  const bossButton =
    $("#bossButton");


  bossButton.disabled =
    !bossUnlocked;


  if (bossUnlocked) {

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
// 18. QUEST CARDS
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
                ${quest.category}
              </p>

              <h3>
                ${quest.title}
              </h3>

              <p>
                ${quest.description}
              </p>

            </div>


            <div class="quest-card-meta">

              <span class="quest-duration">
                ${quest.time}
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


function bindQuestCards() {

  $$("[data-quest-id]")
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

            openQuest(id);
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
// 19. CHARACTER STATS
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
// 20. CHARACTER SUMMARY
// =========================================================

function renderCharacterSummary(
  state,
  settings
) {

  const totalXp =
    state.xp.strength
    +
    state.xp.endurance
    +
    state.xp.restoration;


  $("#characterProfileName")
    .textContent =
      settings.playerName ||
      activeProfile;


  $("#characterWeeklyQuests")
    .textContent =
      state.weeklyCompleted.length;


  $("#characterTotalQuests")
    .textContent =
      state.history.length;


  $("#characterTotalXp")
    .textContent =
      totalXp;
}


// =========================================================
// 21. OPEN QUEST
// =========================================================

function openQuest(id) {

  const quest =
    findQuest(id);

  if (!quest) {
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
      `+${quest.xp} ${capitalize(
        quest.xpType
      )} XP`;


  renderExerciseList(
    quest
  );


  $("#questDialog")
    .showModal();
}


// =========================================================
// 22. EXERCISE CHECKLIST
// =========================================================

function renderExerciseList(quest) {

  const list =
    $("#exerciseList");


  list.innerHTML =
    quest.exercises
      .map(
        (exercise, index) => `
          <label class="exercise-row">

            <input
              type="checkbox"
              id="exercise-${index}"
            >

            <span>
              ${exercise}
            </span>

          </label>
        `
      )
      .join("");
}


// =========================================================
// 23. COMPLETE QUEST
// =========================================================

function completeQuest() {

  if (!activeQuest) {
    return;
  }

  const state =
    normalizeWeek();


  const completedAt =
    new Date().toISOString();


  state.weeklyCompleted.push({
    questId:
      activeQuest.id,

    completedAt
  });


  state.xp[
    activeQuest.xpType
  ] +=
    activeQuest.xp;


  state.history.unshift({
    questId:
      activeQuest.id,

    title:
      activeQuest.title,

    category:
      activeQuest.category,

    xp:
      activeQuest.xp,

    xpType:
      activeQuest.xpType,

    completedAt
  });


  saveState(state);


  closeQuest();


  showToast(
    `Quest Complete · +${activeQuest.xp} XP`
  );


  activeQuest =
    null;


  render();
}


// =========================================================
// 24. CLOSE QUEST
// =========================================================

function closeQuest() {

  pauseTimer();

  const dialog =
    $("#questDialog");

  if (
    dialog &&
    dialog.open
  ) {
    dialog.close();
  }
}


// =========================================================
// 25. TIMER
// =========================================================

function startTimer() {

  if (timerInterval) {
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

  if (timerInterval) {

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

  if (timerInterval) {
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
      / 3600
    );

  const minutes =
    Math.floor(
      (
        timerSeconds
        % 3600
      )
      / 60
    );

  const seconds =
    timerSeconds % 60;


  if (hours > 0) {

    $("#timerDisplay")
      .textContent =
        `${
          String(hours)
            .padStart(2, "0")
        }:${
          String(minutes)
            .padStart(2, "0")
        }:${
          String(seconds)
            .padStart(2, "0")
        }`;

  }

  else {

    $("#timerDisplay")
      .textContent =
        `${
          String(minutes)
            .padStart(2, "0")
        }:${
          String(seconds)
            .padStart(2, "0")
        }`;
  }
}


// =========================================================
// 26. HISTORY
// =========================================================

function openHistory() {

  const state =
    normalizeWeek();

  const history =
    state.history || [];


  if (
    history.length === 0
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
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  }
                );


              return `
                <article class="history-item">

                  <strong>
                    ${item.title}
                  </strong>

                  <span>
                    ${dateText}
                    ·
                    +${item.xp}
                    ${capitalize(
                      item.xpType
                    )}
                    XP
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
    dialog &&
    dialog.open
  ) {
    dialog.close();
  }
}


// =========================================================
// 27. VIEW NAVIGATION
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


function setView(view) {

  const validView =
    VIEW_HEADERS[view]
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
          === activeView;


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
          button.dataset.view === activeView
        );
      }
    );


  const header =
    VIEW_HEADERS[activeView];


  $("#screenEyebrow")
    .textContent =
      header.eyebrow;


  $("#screenTitle")
    .textContent =
      header.title;


  window.scrollTo({
    top: 0,
    behavior:
      getSettings().reducedMotion
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


function handleNavigation(button) {

  setView(
    button.dataset.view
  );
}


// =========================================================
// 28. SETTINGS RENDER
// =========================================================

function renderSettings(settings) {

  $("#playerNameInput")
    .value =
      settings.playerName ||
      activeProfile;


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
// 29. SAVE PLAYER NAME
// =========================================================

function savePlayerName() {

  const input =
    $("#playerNameInput");

  const name =
    input.value.trim();


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


  saveSettings(
    settings
  );


  render();


  showToast(
    "Adventurer name saved."
  );
}


// =========================================================
// 30. WEEKLY GOAL
// =========================================================

function saveWeeklyGoal() {

  const goal =
    Number(
      $("#weeklyGoalSelect")
        .value
    );


  if (
    !Number.isFinite(goal)
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
// 31. REDUCED MOTION
// =========================================================

function applyMotionSetting(settings) {

  document.body.classList.toggle(
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
// 32. SOUND SETTING
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
// 33. RESET THIS WEEK
// =========================================================

function resetThisWeek() {

  const confirmed =
    confirm(
      "Reset this week's completed quests?\n\nXP and quest history will remain."
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


  saveState(
    state
  );


  render();


  showToast(
    "Weekly progress reset."
  );
}


// =========================================================
// 34. CLEAR HISTORY
// =========================================================

function clearQuestHistory() {

  const confirmed =
    confirm(
      "Clear the quest chronicle?\n\nYour XP and levels will remain."
    );


  if (!confirmed) {
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
// 35. RESET CHARACTER
// =========================================================

function resetCharacter() {

  const confirmed =
    confirm(
      "Reset this character completely?\n\nThis will erase XP, levels, weekly progress, and quest history on this device."
    );


  if (!confirmed) {
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
// 36. LOCAL PARTY GENERATOR
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
// 37. CREATE PARTY
// =========================================================

function createParty() {

  const settings =
    getSettings();


  const party = {
    id:
      crypto.randomUUID
        ? crypto.randomUUID()
        : `party-${Date.now()}`,

    name:
      "The Fellowship",

    inviteCode:
      generatePartyCode(),

    createdAt:
      new Date().toISOString(),

    members: [
      {
        name:
          settings.playerName
          ||
          activeProfile,

        profile:
          activeProfile
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
// 38. SHOW JOIN PARTY
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
// 39. JOIN PARTY
// =========================================================

function joinParty() {

  const code =
    $("#partyCodeInput")
      .value
      .trim()
      .toUpperCase();


  if (
    code.length < 4
  ) {

    showToast(
      "Enter a valid party code."
    );

    return;
  }


  const settings =
    getSettings();


  /*
    LOCAL PROTOTYPE ONLY.

    Once Supabase is connected,
    this function will search the
    parties table by invite code.
  */

  const party = {
    id:
      `local-${code}`,

    name:
      "The Fellowship",

    inviteCode:
      code,

    joinedAt:
      new Date().toISOString(),

    members: [
      {
        name:
          settings.playerName
          ||
          activeProfile,

        profile:
          activeProfile
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
// 40. LEAVE PARTY
// =========================================================

function leaveParty() {

  const confirmed =
    confirm(
      "Leave this fellowship?"
    );


  if (!confirmed) {
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
// 41. PARTY RENDER
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


  if (!party) {

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
// 42. PARTY MEMBERS
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


  /*
    Local version can only see this device's
    live stats.

    Supabase will replace this with
    true cross-device party member data.
  */

  $("#partyMembers")
    .innerHTML =
      members
        .map(
          member => {

            const isCurrent =
              member.profile
              === activeProfile;


            return `
              <article class="party-member-card">

                <div class="party-member-avatar">
                  ${
                    member.name
                      .charAt(0)
                      .toUpperCase()
                  }
                </div>

                <div class="party-member-info">

                  <strong>
                    ${escapeHtml(member.name)}
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
                      ? `${totalXp} XP`
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
// 43. PARTY CHALLENGE
// =========================================================

function renderPartyChallenge(
  state,
  settings
) {

  const personalGoal =
    Number(
      settings.weeklyGoal
    ) ||
    DEFAULT_WEEKLY_GOAL;


  const partyGoal =
    personalGoal
    *
    PARTY_GOAL_MULTIPLIER;


  /*
    Until Supabase exists, only the
    current device contributes here.
  */

  const completed =
    state.weeklyCompleted.length;


  const percent =
    Math.min(
      100,
      (
        completed
        / partyGoal
      )
      * 100
    );


  $("#partyChallengeProgress")
    .textContent =
      `${completed} / ${partyGoal}`;


  $("#partyChallengeBar")
    .style.width =
      `${percent}%`;


  if (
    completed >= partyGoal
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
    $("#partyDashboard .party-challenge h2");


  if (heading) {

    heading.textContent =
      `Complete ${partyGoal} Quests`;
  }
}


// =========================================================
// 44. PARTY ACTIVITY
// =========================================================

function renderPartyActivity(
  state,
  settings
) {

  const recent =
    state.history.slice(
      0,
      5
    );


  if (
    recent.length === 0
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
                  month: "short",
                  day: "numeric"
                }
              );


            return `
              <article class="party-activity-item">

                <strong>
                  ${
                    escapeHtml(
                      settings.playerName
                      ||
                      activeProfile
                    )
                  }
                  completed
                  ${escapeHtml(item.title)}
                </strong>

                <span>
                  ${time}
                  ·
                  +${item.xp}
                  ${capitalize(item.xpType)}
                  XP
                </span>

              </article>
            `;
          }
        )
        .join("");
}


// =========================================================
// 45. TOAST MESSAGE
// =========================================================

function showToast(message) {

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
// 46. UTILITY
// =========================================================

function capitalize(text) {

  if (!text) {
    return "";
  }

  return (
    text.charAt(0).toUpperCase()
    +
    text.slice(1)
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
// 47. EVENT LISTENERS
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
// 48. SETTINGS EVENTS
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
// 49. PARTY EVENTS
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
// 50. CLICK OUTSIDE DIALOG TO CLOSE
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
// 51. ESCAPE KEY
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
// 52. INITIALIZE APP
// =========================================================

chooseProfile();

render();

setView(
  activeView
);