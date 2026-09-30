// =========================================================
// QUEST BOARD — GUILD CHAT LOOP
// AI handoff + capability-scoped writeback
// =========================================================

(() => {
  "use strict";

  const GUILD_SCHEMA = "quest_board.guild_handoff.v1";
  const GUILD_STORAGE_KEY = "questBoardGuildLoop";
  const GUILD_CHAT_URL = "https://chatgpt.com/";
  const MAX_RECENT_HISTORY = 12;

  let selectedGuildMode = "counsel";
  let selectedGuildNpc = "ember";
  let guildArtifacts = [];
  let guildRequests = [];
  let guildQuestCache = new Map();
  let guildUiReady = false;

  const GUILD_MODES = {
    counsel: {
      label: "Guild Counsel",
      requestType: "counsel",
      placeholder: "Tell the Guild what is going on, how much time you have, or what you want help deciding."
    },
    personal_quest: {
      label: "Forge a Quest",
      requestType: "personal_quest",
      placeholder: "Describe the kind of quest you need: time available, equipment, energy, or training focus."
    },
    boss_quest: {
      label: "Boss Forge",
      requestType: "boss_quest",
      placeholder: "Ask Ember to theme your unlocked weekly Boss Battle."
    },
    party_challenge: {
      label: "Party Challenge",
      requestType: "party_challenge",
      placeholder: "Ask for a shared Farmer + Jess challenge or fellowship objective."
    },
    story: {
      label: "Storyteller",
      requestType: "story",
      placeholder: "Ask what happens next in the Blackwood, or request a story beat tied to your progress."
    }
  };

  const NPC_MODE = {
    ember: "counsel",
    guildmaster: "counsel",
    blacksmith: "personal_quest",
    archivist: "story",
    healer: "counsel"
  };

  function qbEscape(value) {
    if (typeof escapeHtml === "function") {
      return escapeHtml(value);
    }

    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function bytesToHex(bytes) {
    return Array.from(bytes)
      .map(value => value.toString(16).padStart(2, "0"))
      .join("");
  }

  function randomCapability() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return bytesToHex(bytes);
  }

  async function sha256Hex(value) {
    const encoded = new TextEncoder().encode(String(value));
    const digest = await crypto.subtle.digest("SHA-256", encoded);
    return bytesToHex(new Uint8Array(digest));
  }

  function readGuildStorage() {
    try {
      return JSON.parse(localStorage.getItem(GUILD_STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function writeGuildStorage(next) {
    localStorage.setItem(
      GUILD_STORAGE_KEY,
      JSON.stringify({
        ...readGuildStorage(),
        ...next
      })
    );
  }

  function currentGuildMode() {
    return GUILD_MODES[selectedGuildMode] || GUILD_MODES.counsel;
  }

  function currentNpc() {
    if (typeof NPCS === "undefined") {
      return null;
    }

    return NPCS.find(npc => npc.id === selectedGuildNpc) || NPCS[0] || null;
  }

  function getQuestBoardSnapshot() {
    const state = typeof getState === "function" ? getState() : {};
    const settings = typeof getSettings === "function" ? getSettings() : {};
    const profile = typeof getCharacterConfig === "function"
      ? getCharacterConfig()
      : {};

    const xp = state?.xp || {};
    const weeklyGoal = Math.max(1, Number(settings?.weeklyGoal) || 3);
    const weeklyCompleted = Array.isArray(state?.weeklyCompleted)
      ? state.weeklyCompleted.length
      : 0;

    const world =
      state?.world &&
      typeof state.world === "object"
        ? state.world
        : {};

    return {
      profile: {
        id: typeof activeProfileId !== "undefined" ? activeProfileId : profile?.profileId,
        name: settings?.playerName || profile?.defaultName || "Adventurer",
        class_name: profile?.className || null
      },
      week: {
        key: typeof getWeekKey === "function" ? getWeekKey() : null,
        goal: weeklyGoal,
        completed: weeklyCompleted,
        boss_unlocked: weeklyCompleted >= weeklyGoal,
        boss_defeated: Boolean(
          state?.bossDefeatedWeek &&
          typeof getWeekKey === "function" &&
          state.bossDefeatedWeek === getWeekKey()
        )
      },
      progression: {
        xp: {
          strength: Math.max(0, Number(xp.strength) || 0),
          endurance: Math.max(0, Number(xp.endurance) || 0),
          restoration: Math.max(0, Number(xp.restoration) || 0)
        },
        gold: Math.max(0, Number(state?.gold) || 0),
        crystals: Math.max(0, Number(state?.crystals) || 0),
        campaign_progress: Math.max(0, Number(state?.campaignProgress) || 0),
        quest_chain_stage: Math.max(0, Number(state?.questChainStage) || 0),
        discovered_relics: Array.isArray(state?.discoveredRelics)
          ? state.discoveredRelics.slice(0, 40)
          : [],
        achievements: Array.isArray(state?.achievements)
          ? state.achievements.slice(0, 40)
          : []
      },
      recent_quests: Array.isArray(state?.history)
        ? state.history.slice(0, MAX_RECENT_HISTORY).map(item => ({
            quest_id: item.questId || null,
            title: item.title || null,
            category: item.category || null,
            xp: Number(item.xp) || 0,
            gold: Number(item.gold) || 0,
            completed_at: item.completedAt || null
          }))
        : [],
      party: currentParty
        ? {
            id: currentParty.id,
            name: currentParty.name || "The Fellowship"
          }
        : null,
      world: {
        schema_version:
          Math.max(1, Number(world.schemaVersion) || 1),
        campaign_id:
          world.campaignId || null,
        current_chapter_id:
          world.currentChapterId || null,
        known_npc_ids:
          Array.isArray(world.knownNpcIds)
            ? world.knownNpcIds.slice(0, 40)
            : [],
        unlocked_location_ids:
          Array.isArray(world.unlockedLocationIds)
            ? world.unlockedLocationIds.slice(0, 40)
            : [],
        story_flags:
          world.storyFlags &&
          typeof world.storyFlags === "object"
            ? world.storyFlags
            : {},
        discovered_secret_ids:
          Array.isArray(world.discoveredSecretIds)
            ? world.discoveredSecretIds.slice(0, 80)
            : [],
        active_events:
          Array.isArray(world.activeEvents)
            ? world.activeEvents.slice(0, 20)
            : [],
        npc_relationships:
          world.npcRelationships &&
          typeof world.npcRelationships === "object"
            ? world.npcRelationships
            : {},
        last_story_beat:
          world.lastStoryBeat || null
      }
    };
  }

  function requestContext() {
    const npc = currentNpc();

    return {
      ui_origin: "guild_hall",
      mode: selectedGuildMode,
      npc: npc
        ? {
            id: npc.id,
            name: npc.name,
            role: npc.role
          }
        : null,
      snapshot: getQuestBoardSnapshot(),
      guardrails: {
        quest_board_owns_game_state: true,
        ember_is_in_world_questmaster: true,
        world_state_is_context_not_reward_authority: true,
        ai_never_awards_currency_directly: true,
        ai_generated_quest_rewards_are_server_calculated: true,
        normal_boss_unlock_rules_still_apply: true,
        no_github_or_repository_access_is_implied: true
      }
    };
  }

  async function createGuildRequest(requestText) {
    if (
      typeof supabaseClient === "undefined" ||
      !supabaseClient ||
      typeof supabaseUser === "undefined" ||
      !supabaseUser
    ) {
      throw new Error("Quest Board cloud connection is not ready.");
    }

    const capability = randomCapability();
    const capabilityHash = await sha256Hex(capability);
    const mode = currentGuildMode();
    const snapshot = getQuestBoardSnapshot();

    const payload = {
      user_id: supabaseUser.id,
      profile_id:
        snapshot.profile.id ||
        (typeof activeProfileId !== "undefined" ? activeProfileId : "farmer"),
      party_id: snapshot.party?.id || null,
      request_type: mode.requestType,
      npc_id: currentNpc()?.id || null,
      request_text: requestText,
      request_context: requestContext(),
      capability_hash: capabilityHash
    };

    const { data, error } = await supabaseClient
      .from("guild_requests")
      .insert(payload)
      .select("id,status,created_at,expires_at")
      .single();

    if (error) {
      throw error;
    }

    writeGuildStorage({
      latestRequestId: data.id,
      latestCapability: capability,
      latestCreatedAt: data.created_at
    });

    return {
      request: data,
      capability
    };
  }

  function buildGuildHandoff({ request, capability, instruction }) {
    const mode = currentGuildMode();
    const npc = currentNpc();

    return (
      "@Quest Board\n\n" +
      "Guild dispatch from Quest Board. You are Ember, the in-world Questmaster. Stay fully in character for the entire user-facing response. Treat your final submitted response as a raven-borne message sent back to the Guild Hall: immersive, natural, and addressed to the active adventurer. Never mention tools, APIs, schemas, capabilities, request IDs, or technical plumbing in the user-facing reply unless a technical failure prevents delivery. Use the connected Quest Board tools to read the live request before answering. " +
      "The request is capability-scoped: use only the request ID and return capability below. " +
      "Quest Board owns gameplay truth and rewards. Never invent XP, gold, crystals, unlocks, or completed activity. " +
      "If the user asked for a quest, boss theme, party challenge, story beat, or NPC dialogue, save it back with the matching Quest Board tool. " +
      "If the user explicitly asks to send or deliver a raven/message to another adventurer in the same fellowship, use the Guild raven delivery tool and only claim delivery after it succeeds. " +
      "Then submit your final response so the app can retrieve it. If no artifact or raven write is needed, submit only the response.\n\n" +
      "QUEST_BOARD_GUILD_HANDOFF\n" +
      JSON.stringify({
        schema: GUILD_SCHEMA,
        source: "quest_board",
        created_at: new Date().toISOString(),
        request_id: request.id,
        return_capability: capability,
        mode: mode.requestType,
        npc: npc
          ? {
              id: npc.id,
              name: npc.name,
              role: npc.role
            }
          : null,
        delivery: {
          channel: "raven",
          style: "in_world",
          stay_in_character: true
        },
        instruction,
        writeback: {
          requested: true,
          rule:
            "Read the live request first. Only write supported guild artifacts. Rewards for generated quests are server-calculated by Quest Board. Submit a final guild response after any artifact writes."
        }
      }, null, 2)
    );
  }

  async function shareGuildHandoff(text) {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Quest Board → Guild",
          text
        });

        return "shared";
      } catch (error) {
        if (error?.name === "AbortError") {
          return "cancelled";
        }
      }
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);

        const opened = window.open(
          GUILD_CHAT_URL,
          "_blank",
          "noopener,noreferrer"
        );

        if (!opened) {
          window.location.assign(GUILD_CHAT_URL);
        }

        return "copied";
      }
    } catch {}

    return "failed";
  }

  async function sendGuildRequest() {
    const input = document.querySelector("#guildChatInput");
    const button = document.querySelector("#guildChatSend");
    const status = document.querySelector("#guildChatStatus");
    const requestText = String(input?.value || "").trim();

    if (!requestText) {
      if (typeof showToast === "function") {
        showToast("Tell the Guild what you need.");
      }
      input?.focus();
      return;
    }

    if (button) {
      button.disabled = true;
      button.textContent = "Preparing…";
    }

    if (status) {
      status.textContent = "Sealing the request with the Guild mark…";
    }

    try {
      const created = await createGuildRequest(requestText);
      const handoff = buildGuildHandoff({
        request: created.request,
        capability: created.capability,
        instruction: requestText
      });

      const result = await shareGuildHandoff(handoff);

      if (result === "failed") {
        throw new Error(
          "Quest Board could not open the share sheet or copy the handoff."
        );
      }

      if (result === "cancelled") {
        if (status) {
          status.textContent = "Guild handoff cancelled.";
        }
        return;
      }

      if (input) {
        input.value = "";
      }

      if (status) {
        status.textContent =
          result === "shared"
            ? "Handoff shared. Return here after the Guild answers."
            : "Handoff copied. Paste it into ChatGPT, then return here.";
      }

      if (typeof showToast === "function") {
        showToast("Guild handoff ready.");
      }

      await refreshGuildLoop();
    } catch (error) {
      console.error("Guild handoff failed:", error);

      if (status) {
        status.textContent =
          error?.message ||
          "The Guild handoff could not be prepared.";
      }

      if (typeof showToast === "function") {
        showToast("Could not reach the Guild.");
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = "Ask Ember";
      }
    }
  }

  async function fetchGuildRequests() {
    if (!supabaseClient || !supabaseUser) {
      return [];
    }

    const { data, error } = await supabaseClient
      .from("guild_requests")
      .select(
        "id,request_type,npc_id,request_text,status,response_text,response_payload,created_at,answered_at"
      )
      .eq("user_id", supabaseUser.id)
      .order("created_at", { ascending: false })
      .limit(12);

    if (error) {
      throw error;
    }

    guildRequests = data || [];
    return guildRequests;
  }

  async function fetchGuildArtifacts() {
    if (!supabaseClient || !supabaseUser) {
      return [];
    }

    const { data, error } = await supabaseClient
      .from("guild_artifacts")
      .select(
        "id,request_id,profile_id,party_id,artifact_type,title,payload,status,created_at,updated_at,accepted_at,completed_at"
      )
      .order("created_at", { ascending: false })
      .limit(40);

    if (error) {
      throw error;
    }

    guildArtifacts = data || [];

    guildQuestCache.clear();

    guildArtifacts
      .filter(item =>
        ["personal_quest", "boss_quest"].includes(item.artifact_type) &&
        ["draft", "active"].includes(item.status)
      )
      .forEach(item => {
        const payload = item.payload || {};
        const id = `guild-${item.id}`;

        guildQuestCache.set(id, {
          id,
          guildArtifactId: item.id,
          guildArtifactType: item.artifact_type,
          title: payload.title || item.title || "Guild-Forged Quest",
          category: payload.category || (
            item.artifact_type === "boss_quest"
              ? "Boss"
              : "Guild"
          ),
          time:
            payload.time ||
            `${Math.max(5, Number(payload.duration_minutes) || 15)} min`,
          xpType: ["strength", "endurance", "restoration"].includes(payload.xp_type)
            ? payload.xp_type
            : "strength",
          xp: Math.max(0, Number(payload.xp) || 0),
          gold: Math.max(0, Number(payload.gold) || 0),
          description:
            payload.description ||
            payload.flavor_text ||
            "A quest forged by the Guild.",
          exercises: Array.isArray(payload.exercises)
            ? payload.exercises.map(String).slice(0, 12)
            : []
        });
      });

    return guildArtifacts;
  }

  function patchQuestLookup() {
    if (
      typeof findQuest !== "function" ||
      findQuest.__guildPatched
    ) {
      return;
    }

    const originalFindQuest = findQuest;

    const patched = function(id) {
      return guildQuestCache.get(id) || originalFindQuest(id);
    };

    patched.__guildPatched = true;
    patched.__guildOriginal = originalFindQuest;

    findQuest = patched;
  }

  function patchPartyChallenge() {
    if (
      typeof renderPartyChallenge !== "function" ||
      renderPartyChallenge.__guildPatched
    ) {
      return;
    }

    const originalRenderPartyChallenge = renderPartyChallenge;

    const patched = function(activity, memberCount, bonusProgress) {
      originalRenderPartyChallenge(activity, memberCount, bonusProgress);

      const challenge = guildArtifacts.find(item =>
        item.artifact_type === "party_challenge" &&
        item.status === "active" &&
        (!item.party_id || item.party_id === currentParty?.id)
      );

      if (!challenge) {
        return;
      }

      const payload = challenge.payload || {};
      const target = Math.max(2, Number(payload.target_quests) || 6);
      const weekKey = typeof getWeekKey === "function" ? getWeekKey() : "";
      const progress = (activity || []).filter(item =>
        item.week_key === weekKey &&
        item.quest_id !== "boss"
      ).length;

      const title = document.querySelector("#partyChallengeTitle");
      const progressText = document.querySelector("#partyChallengeProgress");
      const status = document.querySelector("#partyChallengeStatus");
      const bar = document.querySelector("#partyChallengeBar");

      if (title) {
        title.textContent = payload.title || challenge.title;
      }

      if (progressText) {
        progressText.textContent = `${progress} / ${target}`;
      }

      if (status) {
        status.textContent =
          progress >= target
            ? "Fellowship challenge complete."
            : (
                payload.flavor_text ||
                payload.description ||
                "The Guild has issued a fellowship challenge."
              );
      }

      if (bar) {
        bar.style.width = `${Math.min(100, (progress / target) * 100)}%`;
      }
    };

    patched.__guildPatched = true;
    renderPartyChallenge = patched;
  }

  async function activateGuildArtifact(id) {
    const item = guildArtifacts.find(entry => entry.id === id);

    if (!item) {
      return;
    }

    const patch = {
      status: "active",
      accepted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabaseClient
      .from("guild_artifacts")
      .update(patch)
      .eq("id", id)
      .eq("user_id", supabaseUser.id);

    if (error) {
      throw error;
    }

    await refreshGuildLoop();

    if (typeof showToast === "function") {
      showToast("Guild dispatch accepted.");
    }
  }

  function canOpenGuildBoss() {
    const state = typeof normalizeWeek === "function"
      ? normalizeWeek()
      : getState();
    const settings = getSettings();
    const goal = Math.max(1, Number(settings.weeklyGoal) || 3);
    const weekKey = typeof getWeekKey === "function" ? getWeekKey() : "";

    return (
      (state.weeklyCompleted || []).length >= goal &&
      state.bossDefeatedWeek !== weekKey
    );
  }

  function openGuildQuest(id) {
    const quest = guildQuestCache.get(id);

    if (!quest) {
      return;
    }

    const artifact = guildArtifacts.find(
      item => item.id === quest.guildArtifactId
    );

    if (
      artifact?.artifact_type === "boss_quest"
    ) {
      if (!canOpenGuildBoss()) {
        if (typeof showToast === "function") {
          showToast("Conquer the week before facing a Guild-Forged Boss.");
        }
        return;
      }

      activeQuest = {
        ...quest,
        id: "boss"
      };

      if (typeof playUiSound === "function") {
        playUiSound("open");
      }

      restoreTimerForQuest("boss");

      document.querySelector("#dialogCategory").textContent = "Guild Boss";
      document.querySelector("#dialogTitle").textContent = quest.title;
      document.querySelector("#dialogDescription").textContent = quest.description;
      document.querySelector("#dialogTime").textContent = quest.time;

      const reward = document.querySelector("#dialogReward");
      if (reward) {
        reward.innerHTML =
          "+50 Strength XP | +50 Endurance XP | 100 Gold | 3 Crystals";
      }

      renderExerciseList(activeQuest);
      renderBossCombat(getState());
      document.querySelector("#questDialog")?.showModal();
      return;
    }

    openQuest(id);
  }

  async function dismissGuildArtifact(id) {
    const { error } = await supabaseClient
      .from("guild_artifacts")
      .update({
        status: "dismissed",
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .eq("user_id", supabaseUser.id);

    if (error) {
      throw error;
    }

    await refreshGuildLoop();
  }

  function latestResponseMarkup() {
    const answered = guildRequests.find(
      request =>
        request.status === "answered" &&
        request.response_text
    );

    if (!answered) {
      return (
        "<p class='muted guild-empty-copy'>" +
        "No raven from Ember is waiting. Ask for counsel, forge a quest, or continue the Blackwood story." +
        "</p>"
      );
    }

    return (
      "<article class='guild-reply-card'>" +
        "<span class='eyebrow'>Latest Raven from Ember</span>" +
        "<p>" + qbEscape(answered.response_text) + "</p>" +
      "</article>"
    );
  }

  function artifactCard(item) {
    const payload = item.payload || {};
    const isQuest = ["personal_quest", "boss_quest"].includes(item.artifact_type);
    const questId = `guild-${item.id}`;
    const label = {
      personal_quest: "Guild Quest",
      boss_quest: "Boss Forge",
      party_challenge: "Fellowship Challenge",
      story_beat: "Story Beat",
      npc_dialogue: "NPC Dialogue"
    }[item.artifact_type] || "Guild Dispatch";

    let copy =
      payload.description ||
      payload.flavor_text ||
      payload.text ||
      payload.dialogue ||
      "";

    if (item.artifact_type === "party_challenge") {
      copy =
        `${copy}${copy ? " " : ""}Target: ${Math.max(2, Number(payload.target_quests) || 6)} quests.`;
    }

    const buttons = [];

    if (item.status === "draft") {
      buttons.push(
        `<button type="button" class="guild-mini-action" data-guild-activate="${item.id}">Accept</button>`
      );
    }

    if (isQuest && ["draft", "active"].includes(item.status)) {
      buttons.push(
        `<button type="button" class="guild-mini-action primary" data-guild-open-quest="${questId}">${item.artifact_type === "boss_quest" ? "Face Boss" : "Begin Quest"}</button>`
      );
    }

    if (!["dismissed", "completed"].includes(item.status)) {
      buttons.push(
        `<button type="button" class="guild-mini-action ghost" data-guild-dismiss="${item.id}">Dismiss</button>`
      );
    }

    return (
      `<article class="guild-artifact-card ${qbEscape(item.artifact_type)}">` +
        `<div class="guild-artifact-heading"><span>${qbEscape(label)}</span><small>${qbEscape(item.status)}</small></div>` +
        `<h3>${qbEscape(payload.title || item.title)}</h3>` +
        (copy ? `<p>${qbEscape(copy)}</p>` : "") +
        (isQuest
          ? `<div class="guild-artifact-meta"><span>${qbEscape(payload.time || "")}</span><span>+${Math.max(0, Number(payload.xp) || 0)} XP</span><span>+${Math.max(0, Number(payload.gold) || 0)}g</span></div>`
          : "") +
        (buttons.length
          ? `<div class="guild-artifact-actions">${buttons.join("")}</div>`
          : "") +
      "</article>"
    );
  }

  function renderGuildLoop() {
    const host = document.querySelector("#guildLoopPanel");

    if (!host) {
      return;
    }

    const mode = currentGuildMode();
    const npc = currentNpc();

    const visibleArtifacts = guildArtifacts
      .filter(item => !["dismissed", "completed"].includes(item.status))
      .slice(0, 8);

    host.innerHTML =
      "<div class='guild-loop-heading'>" +
        "<div>" +
          "<span class='eyebrow'>Questmaster Link</span>" +
          "<h3>Ask Ember</h3>" +
          "<p class='muted'>" +
            qbEscape(
              npc
                ? `${npc.name} is listening. Quest Board sends only this request's scoped game context.`
                : "Quest Board sends only this request's scoped game context."
            ) +
          "</p>" +
        "</div>" +
        "<button type='button' class='guild-refresh-button' id='guildRefreshButton'>Refresh</button>" +
      "</div>" +

      "<div class='guild-mode-grid'>" +
        Object.entries(GUILD_MODES).map(([key, value]) =>
          `<button type="button" class="guild-mode-button ${key === selectedGuildMode ? "active" : ""}" data-guild-mode="${key}">${qbEscape(value.label)}</button>`
        ).join("") +
      "</div>" +

      "<label class='guild-chat-field'>" +
        `<span>${qbEscape(mode.label)}</span>` +
        `<textarea id="guildChatInput" rows="4" maxlength="8000" placeholder="${qbEscape(mode.placeholder)}"></textarea>` +
      "</label>" +

      "<div class='guild-chat-actions'>" +
        "<button type='button' class='fantasy-action-button' id='guildChatSend'>Ask Ember</button>" +
        "<span id='guildChatStatus' class='muted'>Ember's raven returns here through the Guild link.</span>" +
      "</div>" +

      latestResponseMarkup() +

      "<div class='guild-dispatches'>" +
        "<div class='section-heading compact'>" +
          "<div><span class='eyebrow'>Dispatches</span><h3>Guild-Forged Content</h3></div>" +
        "</div>" +
        (
          visibleArtifacts.length
            ? visibleArtifacts.map(artifactCard).join("")
            : "<p class='muted guild-empty-copy'>No generated quests, challenges, or story beats yet.</p>"
        ) +
      "</div>";

    host.querySelector("#guildChatSend")
      ?.addEventListener("click", sendGuildRequest);

    host.querySelector("#guildRefreshButton")
      ?.addEventListener("click", refreshGuildLoop);

    host.querySelectorAll("[data-guild-mode]")
      .forEach(button => {
        button.addEventListener("click", () => {
          selectedGuildMode = button.dataset.guildMode || "counsel";
          renderGuildLoop();
          document.querySelector("#guildChatInput")?.focus();
        });
      });

    host.querySelectorAll("[data-guild-activate]")
      .forEach(button => {
        button.addEventListener("click", () => {
          activateGuildArtifact(button.dataset.guildActivate)
            .catch(error => {
              console.error(error);
              showToast("Could not accept that dispatch.");
            });
        });
      });

    host.querySelectorAll("[data-guild-dismiss]")
      .forEach(button => {
        button.addEventListener("click", () => {
          dismissGuildArtifact(button.dataset.guildDismiss)
            .catch(error => {
              console.error(error);
              showToast("Could not dismiss that dispatch.");
            });
        });
      });

    host.querySelectorAll("[data-guild-open-quest]")
      .forEach(button => {
        button.addEventListener("click", () => {
          openGuildQuest(button.dataset.guildOpenQuest);
        });
      });
  }


  async function markGuildArtifactCompleted(id) {
    if (
      !id ||
      !supabaseClient ||
      !supabaseUser
    ) {
      return;
    }

    const { error } = await supabaseClient
      .from("guild_artifacts")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .eq("user_id", supabaseUser.id);

    if (error) {
      console.warn(
        "Could not mark Guild artifact complete:",
        error
      );
      return;
    }

    await refreshGuildLoop();
  }

  function patchQuestCompletion() {
    if (
      typeof completeQuest !== "function" ||
      completeQuest.__guildPatched
    ) {
      return;
    }

    const originalCompleteQuest =
      completeQuest;

    const patched =
      async function() {
        const artifactId =
          activeQuest?.guildArtifactId ||
          null;

        await originalCompleteQuest();

        if (artifactId) {
          await markGuildArtifactCompleted(
            artifactId
          );
        }
      };

    patched.__guildPatched =
      true;

    completeQuest =
      patched;
  }

  function applyGuildNpcDialogue(npcId) {
    const dialogue =
      guildArtifacts.find(item => {
        if (
          item.artifact_type !==
            "npc_dialogue" ||
          item.status !== "active"
        ) {
          return false;
        }

        const artifactNpc =
          item.payload?.npc_id ||
          "";

        return (
          !artifactNpc ||
          artifactNpc === npcId
        );
      });

    if (!dialogue) {
      return false;
    }

    const npc =
      typeof NPCS !== "undefined"
        ? NPCS.find(
            item =>
              item.id === npcId
          )
        : null;

    const host =
      document.querySelector(
        "#npcDialogue"
      );

    if (!host) {
      return false;
    }

    host.innerHTML =
      `<strong>${qbEscape(
        npc?.name ||
        dialogue.title ||
        "Guild"
      )}</strong><p>${qbEscape(
        dialogue.payload?.dialogue ||
        ""
      )}</p>`;

    return true;
  }

  function applyLatestStoryBeat() {
    const story =
      guildArtifacts.find(
        item =>
          item.artifact_type ===
            "story_beat" &&
          item.status ===
            "active"
      );

    if (!story) {
      return false;
    }

    const narrative =
      document.querySelector(
        "#campaignNarrative"
      );

    if (
      narrative &&
      story.payload?.text
    ) {
      narrative.textContent =
        story.payload.text;

      return true;
    }

    return false;
  }

  function patchCampaignRendering() {
    if (
      typeof renderCampaign !== "function" ||
      renderCampaign.__guildPatched
    ) {
      return;
    }

    const originalRenderCampaign =
      renderCampaign;

    const patched =
      function(state) {
        originalRenderCampaign(
          state
        );

        applyLatestStoryBeat();
      };

    patched.__guildPatched =
      true;

    renderCampaign =
      patched;
  }

  function ensureGuildUi() {
    if (guildUiReady) {
      return;
    }

    const guildHall = document.querySelector(".guild-hall-panel");

    if (!guildHall) {
      return;
    }

    const panel = document.createElement("section");
    panel.id = "guildLoopPanel";
    panel.className = "guild-loop-panel";
    panel.setAttribute("aria-label", "Quest Board Guild link");
    guildHall.appendChild(panel);

    document.querySelector("#npcGrid")
      ?.addEventListener("click", event => {
        const button = event.target.closest("[data-npc-id]");

        if (!button) {
          return;
        }

        selectedGuildNpc = button.dataset.npcId || "guildmaster";
        selectedGuildMode = NPC_MODE[selectedGuildNpc] || selectedGuildMode;
        renderGuildLoop();

        window.setTimeout(
          () => {
            applyGuildNpcDialogue(
              selectedGuildNpc
            );
          },
          0
        );
      });

    guildUiReady = true;
    renderGuildLoop();
  }

  async function refreshGuildLoop() {
    if (!supabaseClient || !supabaseUser) {
      ensureGuildUi();
      renderGuildLoop();
      return false;
    }

    try {
      await Promise.all([
        fetchGuildRequests(),
        fetchGuildArtifacts()
      ]);

      patchQuestLookup();
      patchPartyChallenge();
      patchQuestCompletion();
      patchCampaignRendering();
      ensureGuildUi();
      renderGuildLoop();
      applyLatestStoryBeat();
      applyGuildNpcDialogue(
        selectedGuildNpc
      );

      if (
        typeof activeView !== "undefined" &&
        activeView === "party" &&
        typeof renderParty === "function"
      ) {
        renderParty().catch(() => {});
      }

      return true;
    } catch (error) {
      console.error("Guild refresh failed:", error);
      ensureGuildUi();

      const status = document.querySelector("#guildChatStatus");
      if (status) {
        status.textContent = "Guild link is temporarily unavailable.";
      }

      return false;
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      refreshGuildLoop();
    }
  });

  window.addEventListener("focus", () => {
    refreshGuildLoop();
  });

  window.addEventListener("questboard:guild-refresh", () => {
    refreshGuildLoop();
  });

  const start = async () => {
    patchQuestLookup();
    patchPartyChallenge();
    patchQuestCompletion();
    patchCampaignRendering();
    ensureGuildUi();

    let attempts = 0;

    const timer = setInterval(async () => {
      attempts += 1;

      if (
        typeof supabaseReady !== "undefined" &&
        supabaseReady &&
        typeof supabaseUser !== "undefined" &&
        supabaseUser
      ) {
        clearInterval(timer);
        await refreshGuildLoop();
        return;
      }

      if (attempts >= 30) {
        clearInterval(timer);
      }
    }, 500);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
