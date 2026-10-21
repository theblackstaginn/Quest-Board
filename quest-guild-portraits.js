// Portrait presentation for the existing Guild NPC buttons.
(() => {
  "use strict";

  const portraits = {
    ember: "npcs/ember.webp",
    guildmaster: "npcs/rowan.webp",
    blacksmith: "npcs/brunna.webp",
    archivist: "npcs/elowen.webp",
    healer: "npcs/moss.webp"
  };

  function startNpcPortraits() {
    const grid = document.querySelector("#npcGrid");
    if (!grid) return;

    const showPortraits = () => {
      grid.querySelectorAll("[data-npc-id]").forEach(button => {
        const source = portraits[button.dataset.npcId];
        if (!source || button.querySelector(".npc-portrait")) return;

        const portrait = document.createElement("img");
        portrait.className = "npc-portrait";
        portrait.src = source;
        portrait.width = 96;
        portrait.height = 96;
        portrait.alt = ""; // The adjacent NPC name labels the same button.
        portrait.loading = "lazy";
        portrait.decoding = "async";

        const glyph = button.querySelector(".npc-glyph");
        if (glyph) glyph.replaceWith(portrait);
        else button.prepend(portrait);
      });
    };

    showPortraits();
    // The app redraws this grid on refresh/profile changes. Preserve its hooks.
    new MutationObserver(showPortraits).observe(grid, { childList: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startNpcPortraits, { once: true });
  } else {
    startNpcPortraits();
  }
})();
