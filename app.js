// =========================================================
// QUEST BOARD
// app.js
//
// Phase 1:
// - Two profiles: Farmer + Jess
// - Weekly 3-quest objective
// - Quest checklist modal
// - Quest timer
// - XP + levels
// - History
// - Boss Battle unlock
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
// 3. APP SETTINGS
// =========================================================

const PROFILES = [
  "Farmer",
  "Jess"
];

const WEEKLY_GOAL = 3;

const XP_PER_LEVEL = 100;


// =========================================================
// 4. APP STATE
// =========================================================

let activeProfile =
  localStorage.getItem("questBoardActiveProfile") ||
  "Farmer";

let activeQuest = null;

let timerSeconds = 0;

let timerInterval = null;


// =========================================================
// 5. DOM HELPERS
// =========================================================

const $ = selector =>
  document.querySelector(selector);

const $$ = selector =>
  document.querySelectorAll(selector);


// =========================================================
// 6. LOCAL STORAGE
// =========================================================

function getStorageKey() {
  return `questBoardState-${activeProfile}`;
}


function createFreshState() {
  return {
    weekKey: getWeekKey(),

    weeklyCompleted: [],

    xp: {
      strength: 0,
      endurance: 0,
      restoration: 0
    },

    history: []
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
// 7. WEEK HANDLING
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
// 8. LEVEL SYSTEM
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
// 9. QUEST LOOKUP
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
// 10. MAIN RENDER
// =========================================================

function render() {

  const state =
    normalizeWeek();

  renderProfile();

  renderWeeklyProgress(state);

  renderBossBattle(state);

  renderQuestCards();

  renderCharacterStats(state);

  bindQuestCards();
}


// =========================================================
// 11. PROFILE
// =========================================================

function renderProfile() {

  $("#profileName").textContent =
    activeProfile;

  $("#profileAvatar").textContent =
    activeProfile
      .charAt(0)
      .toUpperCase();
}


function switchProfile() {

  const currentIndex =
    PROFILES.indexOf(
      activeProfile
    );

  const nextIndex =
    (
      currentIndex + 1
    )
    % PROFILES.length;

  activeProfile =
    PROFILES[nextIndex];

  localStorage.setItem(
    "questBoardActiveProfile",
    activeProfile
  );

  render();

  showToast(
    `Switched to ${activeProfile}`
  );
}


// =========================================================
// 12. WEEKLY PROGRESS
// =========================================================

function renderWeeklyProgress(state) {

  const completed =
    state.weeklyCompleted.length;

  const percent =
    Math.min(
      100,
      (
        completed
        / WEEKLY_GOAL
      )
      * 100
    );

  $("#weeklyProgressLabel")
    .textContent =
      `${completed} / ${WEEKLY_GOAL}`;

  $("#weeklyProgressBar")
    .style.width =
      `${percent}%`;


  if (
    completed >= WEEKLY_GOAL
  ) {

    $("#weekStatus")
      .textContent =
        "Week conquered.";

  }

  else if (
    completed === 2
  ) {

    $("#weekStatus")
      .textContent =
        "One quest remains.";

  }

  else if (
    completed === 1
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
// 13. BOSS BATTLE
// =========================================================

function renderBossBattle(state) {

  const bossUnlocked =
    state.weeklyCompleted.length
    >= WEEKLY_GOAL;

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
        "Unlock by completing 3 quests.";
  }
}


// =========================================================
// 14. QUEST CARDS
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
// 15. CHARACTER STATS
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
// 16. OPEN QUEST
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
// 17. EXERCISE CHECKLIST
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
// 18. COMPLETE QUEST
// =========================================================

function completeQuest() {

  if (!activeQuest) {
    return;
  }

  const state =
    normalizeWeek();


  state.weeklyCompleted.push({
    questId:
      activeQuest.id,

    completedAt:
      new Date().toISOString()
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

    completedAt:
      new Date().toISOString()
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
// 19. CLOSE QUEST
// =========================================================

function closeQuest() {

  pauseTimer();

  const dialog =
    $("#questDialog");

  if (dialog.open) {
    dialog.close();
  }
}


// =========================================================
// 20. TIMER
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
// 21. HISTORY
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

  if (dialog.open) {
    dialog.close();
  }
}


// =========================================================
// 22. TOAST MESSAGE
// =========================================================

let toastTimeout = null;


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
      2000
    );
}


// =========================================================
// 23. BOTTOM NAVIGATION
// =========================================================

function handleNavigation(button) {

  $$(".nav-item")
    .forEach(
      item =>
        item.classList.remove(
          "active"
        )
    );


  button.classList.add(
    "active"
  );


  const view =
    button.dataset.view;


  switch (view) {

    case "board":

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

      break;


    case "character":

      document
        .querySelector(
          ".character-section"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      break;


    case "party":

      showToast(
        "Party system coming next."
      );

      break;


    case "settings":

      showToast(
        "Settings coming next."
      );

      break;
  }
}


// =========================================================
// 24. UTILITY
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


// =========================================================
// 25. EVENT LISTENERS
// =========================================================

$("#profileButton")
  .addEventListener(
    "click",
    switchProfile
  );


$("#closeQuestButton")
  .addEventListener(
    "click",
    closeQuest
  );


$("#completeQuestButton")
  .addEventListener(
    "click",
    completeQuest
  );


$("#timerToggleButton")
  .addEventListener(
    "click",
    toggleTimer
  );


$("#timerResetButton")
  .addEventListener(
    "click",
    resetTimer
  );


$("#showHistoryButton")
  .addEventListener(
    "click",
    openHistory
  );


$("#closeHistoryButton")
  .addEventListener(
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
// 26. CLICK OUTSIDE DIALOG TO CLOSE
// =========================================================

$("#questDialog")
  .addEventListener(
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
  .addEventListener(
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
// 27. INITIALIZE APP
// =========================================================

render();