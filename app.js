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
    id: "iron-gate",
    title: "The Iron Gate",
    category: "Strength",
    time: "20-30 min",
    xpType: "strength",
    xp: 30,
    gold: 20,
    description:
      "A power-cage and dumbbell quest built for either adventurer. Choose your own working weight and keep two or three solid reps in reserve.",
    exercises: [
      "Power-cage squat - 3 sets of 6-10 reps",
      "Dumbbell bench press - 3 sets of 8-12 reps",
      "One-arm dumbbell row - 3 sets of 8-12 reps each side",
      "Dumbbell Romanian deadlift - 2 sets of 8-12 reps",
      "Rest as needed between sets"
    ]
  },

  {
    id: "smiths-circuit",
    title: "The Smith's Circuit",
    category: "Strength",
    time: "12-18 min",
    xpType: "strength",
    xp: 25,
    gold: 15,
    description:
      "A compact dumbbell circuit for days when you want real strength work without a long session. Each player scales the weight independently.",
    exercises: [
      "Dumbbell goblet squat - 10 reps",
      "Dumbbell floor or bench press - 10 reps",
      "One-arm dumbbell row - 10 reps each side",
      "Dumbbell shoulder press - 8-10 reps",
      "Dumbbell Romanian deadlift - 10 reps",
      "Complete 2-3 controlled rounds"
    ]
  },

  {
    id: "sentinels-stand",
    title: "Sentinel's Stand",
    category: "Strength",
    time: "15-25 min",
    xpType: "strength",
    xp: 25,
    gold: 15,
    description:
      "A steady full-body power-cage session emphasizing controlled strength rather than speed. Use the same quest with whatever load suits you.",
    exercises: [
      "Power-cage squat or box squat - 8-10 reps",
      "Bench press or dumbbell bench press - 8-10 reps",
      "Dumbbell split squat - 8 reps each side",
      "One-arm dumbbell row - 10 reps each side",
      "Farmer carry or static dumbbell hold - 30-45 seconds",
      "Complete 2-3 rounds"
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
    id: "unbinding-ritual",
    title: "The Unbinding Ritual",
    category: "Recovery",
    time: "8-12 min",
    xpType: "restoration",
    xp: 15,
    gold: 8,
    description:
      "A gentle full-body stretching quest for stiff or low-energy days. Move slowly and never force range of motion.",
    exercises: [
      "Standing calf stretch - 30 seconds each side",
      "Hamstring stretch - 30 seconds each side",
      "Hip-flexor stretch - 30 seconds each side",
      "Figure-four or glute stretch - 30 seconds each side",
      "Doorway chest stretch - 30 seconds each side",
      "Upper-back reach and shoulder stretch - 30 seconds each side",
      "Repeat any tight area once"
    ]
  },

  {
    id: "wayfarers-reset",
    title: "Wayfarer's Reset",
    category: "Recovery",
    time: "10-15 min",
    xpType: "restoration",
    xp: 20,
    gold: 10,
    description:
      "A lower-body mobility reset for walking days, lifting days, or long hours on your feet.",
    exercises: [
      "Ankle rocks - 8-10 each side",
      "Calf stretch - 30 seconds each side",
      "Hamstring stretch - 30 seconds each side",
      "Half-kneeling hip-flexor stretch - 30 seconds each side",
      "Adductor rock-back - 8 slow reps each side",
      "Figure-four or glute stretch - 30 seconds each side",
      "Easy spinal rotation - 5 slow reps each side"
    ]
  },

  {
    id: "moonlit-mobility",
    title: "Moonlit Mobility",
    category: "Recovery",
    time: "10-15 min",
    xpType: "restoration",
    xp: 20,
    gold: 10,
    description:
      "An upper-body and spine mobility quest for unwinding shoulders, chest, and back after training or work.",
    exercises: [
      "Shoulder rolls - 10 each direction",
      "Wall or doorway chest stretch - 30 seconds each side",
      "Cross-body shoulder stretch - 30 seconds each side",
      "Thread-the-needle - 6 slow reps each side",
      "Cat-cow - 8 slow reps",
      "Gentle thoracic rotation - 6 reps each side",
      "Child's pose or supported lat stretch - 45 seconds"
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

const QUEST_ICON_PATHS = {
  "there-back": "icons/there-and-back.webp",
  "keep": "icons/the-keep.webp",
  "dragonstrength": "icons/dragonstrength.webp",
  "iron-gate": "icons/iron-gate-v73.webp",
  "smiths-circuit": "icons/smiths-circuit-v73.webp",
  "sentinels-stand": "icons/sentinels-stand-v73.webp",
  "rogue": "icons/rogue-mode.webp",
  "restoration": "icons/restoration.webp",
  "unbinding-ritual": "icons/unbinding-ritual-v73.webp",
  "wayfarers-reset": "icons/wayfarers-reset-v73.webp",
  "moonlit-mobility": "icons/moonlit-mobility-v73.webp",
  "ranger": "icons/ranger-training.webp"
};



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
    description: "A road-worn half-orc wizard who turns discipline into ritual, strength into spellwork, and every completed quest into another page of the legend."
  },

  jess: {
    profileId: "jess",
    legacyName: "Jess",
    defaultName: "Jess",
    className: "Rogue Witch Assassin",
    card: "jess-card.webp",
    theme: "amethyst",
    description: "A swift rogue witch assassin who moves between shadow and spellcraft, sharpening endurance, restoration, and ruthless consistency with every quest."
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
    id: "lanternbound-seal",
    name: "Lanternbound Seal",
    image: "relics/lantern-of-guidance.webp",
    flavor: "Four lights burn along the old road. This seal remembers the companions who lit them together.",
    rarity: "epic",
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
    flavor: "Worn by those who keep moving when the road grows long.",
    rarity: "epic",
    source: "quest",
    condition: stats => stats.enduranceQuests >= 10
  },

  {
    id: "mask-of-the-wild",
    name: "Mask of the Wild",
    image: "relics/mask-of-the-wild.webp",
    flavor: "The wilderness remembers those who learn to move with it.",
    rarity: "epic",
    source: "quest",
    condition: stats => stats.rangerQuests >= 10
  },

  {
    id: "scribe-of-destiny",
    name: "Scribe of Destiny",
    image: "relics/scribe-of-destiny.webp",
    flavor: "Every path has been walked. Every lesson has been written.",
    rarity: "epic",
    source: "secret",
    condition: stats => stats.uniqueCoreQuests >= QUESTS.length
  },

  {
    id: "wardens-totem",
    name: "Warden's Totem",
    image: "relics/wardens-totem.webp",
    flavor: "A guardian for those who have proven they will return to the path again and again.",
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

const PARTY_TREASURES = {
  "fellowship-token": {
    name: "Fellowship Token",
    rarity: "Common",
    glyph: "+1",
    artFile: "consumables/fellowship-token.webp",
    effectType: "immediate",
    description:
      "Adds one bonus point to the shared weekly challenge."
  },

  "banner-of-plenty": {
    name: "Banner of Plenty",
    rarity: "Uncommon",
    glyph: "G",
    artFile: "consumables/banner-of-plenty.webp",
    effectType: "immediate",
    description:
      "Grants 15 Gold to every fellowship member."
  },

  "crystal-parcel": {
    name: "Crystal Parcel",
    rarity: "Rare",
    glyph: "C",
    artFile: "consumables/crystal-parcel.webp",
    effectType: "immediate",
    description:
      "Grants one Crystal to every fellowship member."
  },

  "rallying-horn": {
    name: "Rallying Horn",
    rarity: "Epic",
    glyph: "+3",
    artFile: "consumables/rallying-horn.webp",
    effectType: "immediate",
    description:
      "Adds three bonus points to the shared weekly challenge."
  },

  "wayfarers-ration": {
    name: "Wayfarer's Ration",
    rarity: "Common",
    glyph: "G+",
    artFile: "consumables/wayfarers-ration.webp",
    effectType: "next-gold",
    description:
      "Your next completed normal quest earns +10 Gold."
  },

  "scholars-ink": {
    name: "Scholar's Ink",
    rarity: "Uncommon",
    glyph: "XP",
    artFile: "consumables/scholars-ink.webp",
    effectType: "next-xp",
    description:
      "Your next completed normal quest earns +10 matching-stat XP."
  },

  "ember-draught": {
    name: "Ember Draught",
    rarity: "Uncommon",
    glyph: "STR",
    artFile: "consumables/ember-draught.webp",
    effectType: "next-strength-xp",
    description:
      "Your next Strength quest earns +15 Strength XP."
  },

  "windrunner-cordial": {
    name: "Windrunner Cordial",
    rarity: "Uncommon",
    glyph: "END",
    artFile: "consumables/windrunner-cordial.webp",
    effectType: "next-endurance-xp",
    description:
      "Your next Endurance quest earns +15 Endurance XP."
  },

  "mossheart-tonic": {
    name: "Mossheart Tonic",
    rarity: "Uncommon",
    glyph: "RST",
    artFile: "consumables/mossheart-tonic.webp",
    effectType: "next-restoration-xp",
    description:
      "Your next Restoration quest earns +15 Restoration XP."
  },

  "wardens-key": {
    name: "Warden's Key",
    rarity: "Rare",
    glyph: "KEY",
    artFile: "consumables/wardens-key.webp",
    effectType: "road-encounter",
    description:
      "Opens a random road encounter immediately."
  }
}


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

const CAMPAIGN_GOAL = 24;
const WORLD_STATE_SCHEMA_VERSION = 1;
const WORLD_CAMPAIGN_ID = "blackwood-i";
const WORLD_CHAPTER_ID = "blackwood-i-chapter-1";
const CAMPAIGN_LOCATIONS = [
  { at:0,id:"guild-hall",name:"Guild Hall",glyph:"⌂" },{ at:3,id:"old-road",name:"Old Road",glyph:"Ⅰ" },{ at:6,id:"whispering-pines",name:"Whispering Pines",glyph:"♠" },
  { at:10,id:"mossgate",name:"Mossgate",glyph:"◇" },{ at:15,id:"wardens-crossing",name:"Warden's Crossing",glyph:"⚔" },{ at:20,id:"blackwood-ruins",name:"Blackwood Ruins",glyph:"♜" },{ at:24,id:"heart-of-the-wood",name:"Heart of the Wood",glyph:"★" }
];
const ADVENTURER_TITLES = [{level:1,title:"Wayfarer"},{level:3,title:"Adventurer"},{level:5,title:"Pathfinder"},{level:8,title:"Vanguard"},{level:12,title:"Champion"},{level:18,title:"Warden"},{level:25,title:"Legend of the Guild"}];
const QUEST_CHAIN = [{questId:"there-back",title:"Scout the Old Road"},{questId:"ranger",title:"Follow the Blackwood Trail"},{questId:"keep",title:"Break the Mossgate Guard"},{questId:"boss",title:"Defeat the Briar Warden"}];

const PARTY_ADVENTURE = {
  id: "lantern-road-i",
  title: "The Lantern Road",
  relicId: "lanternbound-seal",
  rewardCopy:
    "Each companion earns the Lanternbound Seal and one Fellowship consumable.",
  intro:
    "Beyond the Guild Hall, four dead lanterns mark an old road into the Blackwood. The path will only wake for companions who travel it together.",
  completed:
    "All four lanterns burn behind the Fellowship. The old road knows your names now, and something deeper in the Blackwood has noticed the light.",
  stages: [
    {
      numeral: "I",
      title: "Light the First Lantern",
      copy:
        "The gate will not open for a lone traveler. Each companion must carry a flame to the road."
    },
    {
      numeral: "II",
      title: "Cross the Old Mile",
      copy:
        "The first lantern catches. Keep the Fellowship moving until the old milestones begin to answer."
    },
    {
      numeral: "III",
      title: "Hold the Broken Shrine",
      copy:
        "Something circles the pines. The watch must be shared; no companion can be left carrying it alone."
    },
    {
      numeral: "IV",
      title: "Break the Night Watch",
      copy:
        "At the final lantern, a Blackwood threat blocks the road. Reach it battle-worn, then break the guard."
    }
  ]
};
const BOSS_PROFILES = [
  {
    id: "briar-warden",
    name: "The Briar Warden",
    locations: ["guild-hall","old-road","whispering-pines","mossgate"],
    copy: "Break the Warden's final guard and force open the road into the Blackwood."
  },
  {
    id: "hollow-antler",
    name: "The Hollow Antler",
    locations: ["whispering-pines","mossgate"],
    copy: "A pale-horned thing stalks the tree line. Hold your ground until the forest yields."
  },
  {
    id: "mossjaw",
    name: "Mossjaw, Gatekeeper",
    locations: ["mossgate","wardens-crossing"],
    copy: "The old gate has grown teeth. Batter through Mossjaw's guard before the path closes again."
  },
  {
    id: "ash-crowned-knight",
    name: "The Ash-Crowned Knight",
    locations: ["wardens-crossing","blackwood-ruins"],
    copy: "An oathbound knight bars the crossing. Outlast the armor, then break the final stance."
  },
  {
    id: "lantern-widow",
    name: "The Lantern Widow",
    locations: ["blackwood-ruins","heart-of-the-wood"],
    copy: "False lights drift among the ruins. Keep moving until the Widow's lure burns out."
  },
  {
    id: "rootbound-king",
    name: "The Rootbound King",
    locations: ["heart-of-the-wood"],
    copy: "The oldest roots have risen in defense of the heartwood. Endure the final stand."
  }
];
const ACHIEVEMENTS = [
 {id:"first-step",name:"First Step",copy:"Complete your first quest.",test:s=>s.history.length>=1},{id:"road-worn",name:"Road-Worn",copy:"Complete 10 quests.",test:s=>s.history.length>=10},
 {id:"veteran",name:"Guild Veteran",copy:"Complete 25 quests.",test:s=>s.history.length>=25},{id:"strength-ii",name:"Ironbound",copy:"Reach Strength level 3.",test:s=>getLevelData(s.xp.strength).level>=3},
 {id:"endurance-ii",name:"Long Road",copy:"Reach Endurance level 3.",test:s=>getLevelData(s.xp.endurance).level>=3},{id:"restoration-ii",name:"Restored",copy:"Reach Restoration level 3.",test:s=>getLevelData(s.xp.restoration).level>=3},
 {id:"week",name:"Conqueror",copy:"Conquer a week.",test:s=>Boolean(s.weekConqueredRewardWeek)},{id:"boss",name:"Warden Breaker",copy:"Defeat a weekly boss.",test:s=>s.history.some(x=>x.questId==="boss")},
 {id:"collector",name:"Relic Hunter",copy:"Discover 5 relics.",test:s=>s.discoveredRelics.length>=5},{id:"balanced",name:"Threefold Path",copy:"Reach level 2 in all stats.",test:s=>["strength","endurance","restoration"].every(k=>getLevelData(s.xp[k]).level>=2)},
 {id:"blackwood",name:"Blackwood Walker",copy:"Travel 12 campaign steps.",test:s=>(s.campaignProgress||0)>=12},{id:"blackwood-hero",name:"Heart of the Wood",copy:"Complete Campaign I.",test:s=>(s.campaignProgress||0)>=CAMPAIGN_GOAL}
];
const EQUIPMENT_SLOTS=[{id:"weapon",label:"Weapon"},{id:"armor",label:"Armor"},{id:"charm",label:"Charm"}];
const EQUIPMENT_RELICS={"forgebound-hammer":{slot:"weapon",bonus:"+5% quest Gold",goldMultiplier:1.05},"cloak-of-endurance":{slot:"armor",bonus:"+5 Endurance XP",xpType:"endurance",xpBonus:5},"lantern-of-guidance":{slot:"charm",bonus:"+2 Gold per quest",flatGold:2},"band-of-inner-focus":{slot:"charm",bonus:"+5 Strength XP",xpType:"strength",xpBonus:5},"chalice-of-renewal":{slot:"charm",bonus:"+5 Restoration XP",xpType:"restoration",xpBonus:5}};
const RANDOM_ENCOUNTERS=[{glyph:"¤",title:"The Road Merchant",copy:"A hooded trader recognizes the Guild seal and presses a coin purse into your hand.",reward:"gold",amount:8},{glyph:"✦",title:"Shrine of the Old Road",copy:"Moss-covered stones hum as you pass. Something answers your persistence.",reward:"xp",amount:8},{glyph:"◆",title:"Crystal Vein",copy:"A shard of pale light glints beneath a broken root.",reward:"crystals",amount:1},{glyph:"▣",title:"Forgotten Cache",copy:"An old Guild cache survived beneath the ferns.",reward:"gold",amount:12}];
const NPCS=[{id:"ember",name:"Ember",role:"Questmaster",glyph:"✦",dialogue:"Bring me the road as it is. We will decide what comes next."},{id:"guildmaster",name:"Guildmaster Rowan",role:"Guildmaster",glyph:"⚔",dialogue:"The board changes, but the rule does not: return stronger than you left."},{id:"blacksmith",name:"Brunna Ironhand",role:"Blacksmith",glyph:"⚒",dialogue:"Relics aren't decorations. Equip the right one and make it earn its keep."},{id:"archivist",name:"Archivist Elowen",role:"Keeper of Lore",glyph:"✦",dialogue:"Every road leaves a record. Yours is beginning to fill the shelves."},{id:"healer",name:"Sister Moss",role:"Restoration",glyph:"☘",dialogue:"Recovery is not retreat. Even heroes have to mend."}];


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
let cloudProgressReady = false;
let cloudSaveTimer = null;
let partyRefreshTimer = null;

let deviceSyncSaveTimer = null;
let deviceSyncPollTimer = null;
let deviceSyncLastUpdatedAt = null;
let deviceSyncUserIds = [];
let deviceSyncIdentityPollTick = 0;
let applyingDeviceSyncRemote = false;

let giftRecipient = null;
let giftSending = false;
let checkingIncomingGifts = false;

let activeRelicFilter = "all";
let relicRevealQueue = [];
let currentRelicRevealMode = false;
let appInitialized = false;
let partyTreasureUsing = false;
let partyMemberProfileCache = new Map();


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


function getDeviceSyncIdKey() {
  return (
    `questBoardDeviceSyncId-${getLegacyProfileName()}`
  );
}


function getDeviceSyncId() {
  return (
    localStorage.getItem(
      getDeviceSyncIdKey()
    )
    || ""
  );
}


function setDeviceSyncId(syncId) {
  if (syncId) {
    localStorage.setItem(
      getDeviceSyncIdKey(),
      syncId
    );
  }

  else {
    localStorage.removeItem(
      getDeviceSyncIdKey()
    );
  }
}


function getLogicalUserIds() {
  return Array.from(
    new Set(
      [
        supabaseUser?.id,
        ...deviceSyncUserIds
      ].filter(Boolean)
    )
  );
}


function isLogicalUserId(userId) {
  return getLogicalUserIds()
    .includes(
      String(userId || "")
    );
}


function getPrimarySyncedUserId() {
  return (
    deviceSyncUserIds[0]
    || supabaseUser?.id
    || null
  );
}


function isPrimarySyncedIdentity() {
  const primary =
    getPrimarySyncedUserId();

  return Boolean(
    !primary
    || !supabaseUser
    || primary === supabaseUser.id
  );
}


async function refreshDeviceSyncIdentityContext({
  syncParty = true
} = {}) {
  const syncId =
    getDeviceSyncId();

  if (
    !syncId
    || !supabaseReady
    || !supabaseUser
  ) {
    deviceSyncUserIds =
      supabaseUser?.id
        ? [supabaseUser.id]
        : [];

    return deviceSyncUserIds;
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .rpc(
        "get_synced_user_ids",
        {
          p_sync_id:
            syncId
        }
      );

  if (error) {
    throw error;
  }

  deviceSyncUserIds =
    Array.isArray(data)
      ? data.filter(Boolean)
      : [];

  if (
    supabaseUser?.id
    && !deviceSyncUserIds.includes(
      supabaseUser.id
    )
  ) {
    deviceSyncUserIds.push(
      supabaseUser.id
    );
  }

  if (syncParty) {
    const {
      error: partySyncError
    } =
      await supabaseClient
        .rpc(
          "join_synced_party",
          {
            p_sync_id:
              syncId
          }
        );

    if (partySyncError) {
      throw partySyncError;
    }
  }

  return deviceSyncUserIds;
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

  queueCloudProgressSave();
  queueDeviceSyncSave();
}


// =========================================================
// 12. PERSONAL QUEST STATE
// =========================================================

function createFreshWorldState({
  campaignProgress = 0
} = {}) {
  const safeCampaignProgress =
    Math.max(
      0,
      Number(campaignProgress) || 0
    );

  const unlockedLocationIds =
    CAMPAIGN_LOCATIONS
      .filter(
        location =>
          safeCampaignProgress
          >= location.at
      )
      .map(
        location =>
          location.id
      );

  const knownNpcIds =
    NPCS.map(
      npc =>
        npc.id
    );

  const npcRelationships =
    Object.fromEntries(
      knownNpcIds.map(
        npcId => [
          npcId,
          {
            standing: "known",
            interactionCount: 0,
            lastInteractionAt: null,
            memoryFlags: []
          }
        ]
      )
    );

  return {
    schemaVersion:
      WORLD_STATE_SCHEMA_VERSION,

    campaignId:
      WORLD_CAMPAIGN_ID,

    currentChapterId:
      WORLD_CHAPTER_ID,

    knownNpcIds,

    unlockedLocationIds,

    storyFlags:
      {},

    discoveredSecretIds:
      [],

    activeEvents:
      [],

    npcRelationships,

    lastStoryBeat:
      null
  };
}


function migrateWorldState(
  parsedWorld,
  legacyState = {}
) {
  const fresh =
    createFreshWorldState({
      campaignProgress:
        legacyState?.campaignProgress
    });

  const world =
    parsedWorld
    && typeof parsedWorld === "object"
      ? parsedWorld
      : {};

  const relationshipSource =
    world.npcRelationships
    && typeof world.npcRelationships === "object"
      ? world.npcRelationships
      : {};

  const npcRelationships = {
    ...relationshipSource
  };

  for (
    const [
      npcId,
      defaults
    ]
    of Object.entries(
      fresh.npcRelationships
    )
  ) {
    npcRelationships[npcId] = {
      ...defaults,
      ...(
        relationshipSource[npcId]
        || {}
      ),

      memoryFlags:
        Array.isArray(
          relationshipSource[npcId]
            ?.memoryFlags
        )
          ? relationshipSource[npcId]
              .memoryFlags
          : defaults.memoryFlags
    };
  }

  return {
    ...fresh,
    ...world,

    schemaVersion:
      WORLD_STATE_SCHEMA_VERSION,

    knownNpcIds:
      Array.isArray(
        world.knownNpcIds
      )
        ? Array.from(
            new Set([
              ...fresh.knownNpcIds,
              ...world.knownNpcIds
            ])
          )
        : fresh.knownNpcIds,

    unlockedLocationIds:
      Array.isArray(
        world.unlockedLocationIds
      )
        ? Array.from(
            new Set([
              ...fresh.unlockedLocationIds,
              ...world.unlockedLocationIds
            ])
          )
        : fresh.unlockedLocationIds,

    storyFlags:
      world.storyFlags
      && typeof world.storyFlags
        === "object"
        ? world.storyFlags
        : fresh.storyFlags,

    discoveredSecretIds:
      Array.isArray(
        world.discoveredSecretIds
      )
        ? world.discoveredSecretIds
        : fresh.discoveredSecretIds,

    activeEvents:
      Array.isArray(
        world.activeEvents
      )
        ? world.activeEvents
        : fresh.activeEvents,

    npcRelationships
  };
}


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
      null,
    campaignProgress: 0,
    questChainStage: 0,
    achievements: [],
    equippedRelics: { weapon:null, armor:null, charm:null },
    codexDiscoveries: ["guild-hall"],
    encounterCount: 0,
    activeConsumableEffects: {
      nextGold: false,
      nextXp: false,
      nextStrengthXp: false,
      nextEnduranceXp: false,
      nextRestorationXp: false
    },
    onboardingComplete: false,
    world: createFreshWorldState()
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
    equippedRelics: { ...fresh.equippedRelics, ...(parsed?.equippedRelics || {}) },
    achievements: Array.isArray(parsed?.achievements) ? parsed.achievements : [],
    codexDiscoveries: Array.isArray(parsed?.codexDiscoveries) ? parsed.codexDiscoveries : fresh.codexDiscoveries,

    activeConsumableEffects: {
      ...fresh.activeConsumableEffects,
      ...(
        parsed?.activeConsumableEffects
        && typeof parsed.activeConsumableEffects === "object"
          ? parsed.activeConsumableEffects
          : {}
      )
    },

    world:
      migrateWorldState(
        parsed?.world,
        parsed
      ),

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

  queueCloudProgressSave();
  queueDeviceSyncSave();
}

function hasMeaningfulLocalProgress(state) {
  return Boolean(
    state.history?.length
    || state.weeklyCompleted?.length
    || state.discoveredRelics?.length
    || Number(state.gold) > 0
    || Number(state.crystals) > 0
    || Number(state.xp?.strength) > 0
    || Number(state.xp?.endurance) > 0
    || Number(state.xp?.restoration) > 0
    || state.bossDefeatedWeek
    || state.bossRewardsClaimedWeek
  );
}

function queueCloudProgressSave() {
  if (
    !cloudProgressReady
    || !supabaseReady
    || !supabaseUser
  ) {
    return;
  }

  clearTimeout(cloudSaveTimer);

  cloudSaveTimer =
    setTimeout(
      () => {
        saveProgressToCloud()
          .catch(error =>
            console.error(
              "Cloud progress backup failed:",
              error
            )
          );
      },
      250
    );
}

async function saveProgressToCloud() {
  if (
    !supabaseReady
    || !supabaseUser
  ) {
    return false;
  }

  const { error } =
    await supabaseClient
      .from("player_progress")
      .upsert(
        {
          user_id: supabaseUser.id,
          profile_id: activeProfileId,
          state: getState(),
          settings: getSettings(),
          updated_at:
            new Date().toISOString()
        },
        {
          onConflict: "user_id"
        }
      );

  if (error) {
    throw error;
  }

  return true;
}

async function restoreOrSeedCloudProgress(
  { preferCloud = false } = {}
) {
  if (
    !supabaseReady
    || !supabaseUser
  ) {
    return false;
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from("player_progress")
      .select(
        "profile_id, state, settings, updated_at"
      )
      .in(
        "user_id",
        getLogicalUserIds()
      )
      .maybeSingle();

  if (error) {
    throw error;
  }

  const localState =
    getState();

  if (data?.state) {
    const localHasProgress =
      hasMeaningfulLocalProgress(
        localState
      );

    if (
      preferCloud
      || !localHasProgress
    ) {
      const restoredState =
        migrateState(
          data.state
        );

      localStorage.setItem(
        getStorageKey(),
        JSON.stringify(restoredState)
      );

      if (data.settings) {
        localStorage.setItem(
          getSettingsKey(),
          JSON.stringify({
            ...createFreshSettings(),
            ...data.settings
          })
        );
      }

      return true;
    }
  }

  await saveProgressToCloud();
  return false;
}
// =========================================================
// LIVE DEVICE SYNC
// =========================================================

function renderDeviceSyncStatus(
  {
    statusText = null,
    pairCode = null
  } = {}
) {
  const status =
    $("#deviceSyncStatus");

  const codeWrap =
    $("#deviceSyncCodeWrap");

  const code =
    $("#deviceSyncCode");

  if (!status) {
    return;
  }

  const syncId =
    getDeviceSyncId();

  status.textContent =
    statusText
    || (
      syncId
        ? "Live sync is connected. Changes made on either paired device will stay current automatically."
        : "This device is not paired yet. Generate a code on the device with your current save, then enter it on the other device."
    );

  if (
    codeWrap
    && code
  ) {
    if (pairCode) {
      code.textContent =
        pairCode;

      codeWrap.hidden =
        false;
    }

    else {
      codeWrap.hidden =
        true;
    }
  }
}


function queueDeviceSyncSave() {
  if (
    applyingDeviceSyncRemote
    || !supabaseReady
    || !supabaseUser
    || !getDeviceSyncId()
  ) {
    return;
  }

  clearTimeout(
    deviceSyncSaveTimer
  );

  deviceSyncSaveTimer =
    setTimeout(
      () => {
        pushDeviceSync()
          .catch(error =>
            console.error(
              "Device sync upload failed:",
              error
            )
          );
      },
      350
    );
}


async function pushDeviceSync() {
  const syncId =
    getDeviceSyncId();

  if (
    !syncId
    || !supabaseReady
    || !supabaseUser
  ) {
    return false;
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from("device_sync")
      .update({
        profile_id:
          activeProfileId,

        state:
          getState(),

        settings:
          getSettings(),

        updated_at:
          new Date().toISOString()
      })
      .eq(
        "sync_id",
        syncId
      )
      .select(
        "updated_at"
      )
      .single();

  if (error) {
    throw error;
  }

  deviceSyncLastUpdatedAt =
    data?.updated_at
    || deviceSyncLastUpdatedAt;

  renderDeviceSyncStatus();

  return true;
}


async function pullDeviceSync({
  force = false
} = {}) {
  const syncId =
    getDeviceSyncId();

  if (
    !syncId
    || !supabaseReady
    || !supabaseUser
  ) {
    return false;
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from("device_sync")
      .select(
        "profile_id, state, settings, updated_at"
      )
      .eq(
        "sync_id",
        syncId
      )
      .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data?.state) {
    setDeviceSyncId(
      null
    );

    deviceSyncLastUpdatedAt =
      null;

    renderDeviceSyncStatus({
      statusText:
        "This device is no longer connected to a live sync."
    });

    return false;
  }

  if (
    data.profile_id
    !== activeProfileId
  ) {
    return false;
  }

  const remoteTime =
    data.updated_at
      ? new Date(
          data.updated_at
        ).getTime()
      : 0;

  const knownTime =
    deviceSyncLastUpdatedAt
      ? new Date(
          deviceSyncLastUpdatedAt
        ).getTime()
      : 0;

  if (
    !force
    && remoteTime
      <= knownTime
  ) {
    return false;
  }

  applyingDeviceSyncRemote =
    true;

  try {
    localStorage.setItem(
      getStorageKey(),
      JSON.stringify(
        migrateState(
          data.state
        )
      )
    );

    if (
      data.settings
      && typeof data.settings
        === "object"
    ) {
      localStorage.setItem(
        getSettingsKey(),
        JSON.stringify({
          ...createFreshSettings(),
          ...data.settings
        })
      );
    }

    deviceSyncLastUpdatedAt =
      data.updated_at
      || null;

    render();
    renderSettings(
      getSettings()
    );

    renderDeviceSyncStatus();

    window.dispatchEvent(
      new Event(
        "questboard:guild-refresh"
      )
    );
  }

  finally {
    applyingDeviceSyncRemote =
      false;
  }

  return true;
}


async function generateDeviceSyncPairCode() {
  if (
    !supabaseReady
    || !supabaseUser
  ) {
    showToast(
      "Guild connection is not ready yet."
    );

    return;
  }

  try {
    let syncId =
      getDeviceSyncId();

    let pairCode =
      null;

    if (!syncId) {
      const {
        data,
        error
      } =
        await supabaseClient
          .rpc(
            "create_device_sync_channel_fixed",
            {
              p_profile_id:
                activeProfileId,

              p_state:
                getState(),

              p_settings:
                getSettings()
            }
          );

      if (error) {
        throw error;
      }

      syncId =
        data?.sync_id
        || null;

      pairCode =
        data?.pair_code
        || null;

      if (
        !syncId
        || !pairCode
      ) {
        throw new Error(
          "Pairing service did not return a sync channel."
        );
      }

      setDeviceSyncId(
        syncId
      );

      await refreshDeviceSyncIdentityContext();

      await pullDeviceSync({
        force: true
      });

      await loadCurrentParty();

      window.dispatchEvent(
        new Event(
          "questboard:guild-refresh"
        )
      );
    }

    else {
      const {
        data,
        error
      } =
        await supabaseClient
          .rpc(
            "refresh_device_sync_pair_code",
            {
              p_sync_id:
                syncId
            }
          );

      if (error) {
        throw error;
      }

      pairCode =
        data;
    }

    renderDeviceSyncStatus({
      pairCode
    });

    startDeviceSyncPolling();

    showToast(
      "Pairing code ready."
    );
  }

  catch (error) {
    console.error(
      "Could not generate device sync code:",
      error
    );

    showToast(
      "Could not create a pairing code."
    );
  }
}


async function joinDeviceSync() {
  if (
    !supabaseReady
    || !supabaseUser
  ) {
    showToast(
      "Guild connection is not ready yet."
    );

    return;
  }

  const input =
    $("#deviceSyncCodeInput");

  const pairCode =
    String(
      input?.value
      || ""
    )
      .trim()
      .toUpperCase();

  if (
    pairCode.length
    !== 8
  ) {
    showToast(
      "Enter the 8-character pairing code."
    );

    return;
  }

  try {
    const {
      data,
      error
    } =
      await supabaseClient
        .rpc(
          "claim_device_sync_channel",
          {
            p_pair_code:
              pairCode,

            p_profile_id:
              activeProfileId
          }
        )
        .single();

    if (error) {
      throw error;
    }

    if (
      !confirm(
        "Connect this device to the shared Quest Board save?\n\nThe paired save will replace this device's current local quest progress and settings."
      )
    ) {
      return;
    }

    setDeviceSyncId(
      data.sync_id
    );

    await refreshDeviceSyncIdentityContext();

    applyingDeviceSyncRemote =
      true;

    try {
      localStorage.setItem(
        getStorageKey(),
        JSON.stringify(
          migrateState(
            data.state
          )
        )
      );

      if (
        data.settings
        && typeof data.settings
          === "object"
      ) {
        localStorage.setItem(
          getSettingsKey(),
          JSON.stringify({
            ...createFreshSettings(),
            ...data.settings
          })
        );
      }

      deviceSyncLastUpdatedAt =
        data.updated_at
        || null;

      render();
      renderSettings(
        getSettings()
      );
    }

    finally {
      applyingDeviceSyncRemote =
        false;
    }

    if (input) {
      input.value =
        "";
    }

    await loadCurrentParty();

    renderDeviceSyncStatus();

    startDeviceSyncPolling();

    window.dispatchEvent(
      new Event(
        "questboard:guild-refresh"
      )
    );

    showToast(
      "Live device sync connected across Quest Board."
    );
  }

  catch (error) {
    console.error(
      "Could not join device sync:",
      error
    );

    showToast(
      "That pairing code is invalid, expired, or belongs to the other adventurer."
    );
  }
}


function startDeviceSyncPolling() {
  clearInterval(
    deviceSyncPollTimer
  );

  if (
    !getDeviceSyncId()
  ) {
    return;
  }

  deviceSyncIdentityPollTick =
    0;

  deviceSyncPollTimer =
    setInterval(
      () => {
        if (
          document.visibilityState
          !== "visible"
        ) {
          return;
        }

        pullDeviceSync()
          .catch(error =>
            console.error(
              "Device sync refresh failed:",
              error
            )
          );

        deviceSyncIdentityPollTick +=
          1;

        if (
          deviceSyncIdentityPollTick
            % 4
          === 0
        ) {
          refreshDeviceSyncIdentityContext()
            .then(
              () =>
                loadCurrentParty()
            )
            .then(
              () =>
                window.dispatchEvent(
                  new Event(
                    "questboard:guild-refresh"
                  )
                )
            )
            .catch(error =>
              console.error(
                "Device identity sync refresh failed:",
                error
              )
            );
        }
      },
      4000
    );
}


async function initializeDeviceSync() {
  renderDeviceSyncStatus();

  if (
    !getDeviceSyncId()
  ) {
    deviceSyncUserIds =
      supabaseUser?.id
        ? [supabaseUser.id]
        : [];

    return;
  }

  try {
    await refreshDeviceSyncIdentityContext();

    await pullDeviceSync({
      force: true
    });

    await loadCurrentParty();

    startDeviceSyncPolling();

    window.dispatchEvent(
      new Event(
        "questboard:guild-refresh"
      )
    );
  }

  catch (error) {
    console.error(
      "Could not initialize device sync:",
      error
    );

    renderDeviceSyncStatus({
      statusText:
        "Live sync could not connect. Your local save is still intact."
    });
  }
}


document.addEventListener(
  "visibilitychange",
  () => {
    if (
      document.visibilityState
      === "visible"
      && getDeviceSyncId()
    ) {
      Promise.all([
        pullDeviceSync(),
        refreshDeviceSyncIdentityContext()
      ])
        .then(
          () =>
            loadCurrentParty()
        )
        .then(
          () =>
            window.dispatchEvent(
              new Event(
                "questboard:guild-refresh"
              )
            )
        )
        .catch(error =>
          console.error(
            "Device sync visibility refresh failed:",
            error
          )
        );
    }
  }
);


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

function isPasswordRecoveryReturn() {
  const query =
    new URLSearchParams(
      window.location.search
    );

  const hash =
    new URLSearchParams(
      window.location.hash
        .replace(/^#/, "")
    );

  return (
    query.get("recovery") === "1"
    || hash.get("type") === "recovery"
  );
}


async function finishPasswordRecoveryReturn() {
  if (
    !supabaseClient
    || !isPasswordRecoveryReturn()
  ) {
    return false;
  }

  const {
    data: {
      session
    },
    error
  } =
    await supabaseClient.auth
      .getSession();

  if (
    error
    || !session?.user
  ) {
    return false;
  }

  supabaseUser =
    session.user;

  supabaseReady =
    true;

  openPasswordRecoveryDialog();

  return true;
}


if (supabaseClient) {
  supabaseClient.auth
    .onAuthStateChange(
      (
        event,
        session
      ) => {
        if (
          event
          !== "PASSWORD_RECOVERY"
        ) {
          return;
        }

        if (session?.user) {
          supabaseUser =
            session.user;

          supabaseReady =
            true;
        }

        queueMicrotask(
          () => {
            renderAccountStatus();
            openPasswordRecoveryDialog();
          }
        );
      }
    );
}

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

    const recoveryReturn =
      isPasswordRecoveryReturn();

    if (
      recoveryReturn
      && session?.user
    ) {
      supabaseUser =
        session.user;

      supabaseReady =
        true;

      queueMicrotask(
        openPasswordRecoveryDialog
      );
    }

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

    const restoredCloudProgress =
      await restoreOrSeedCloudProgress({
        preferCloud:
          !supabaseUser.is_anonymous
      });

    cloudProgressReady =
      true;

    await syncProfileToSupabase();
    await loadCurrentParty();
    await initializeDeviceSync();

    if (restoredCloudProgress) {
      render();
      await setView(activeView);
    }

    setPartySyncStatus(
      "Guild connection established.",
      "connected"
    );

    startPartyRefreshLoop();
  }

  catch (error) {
    supabaseReady =
      false;
    cloudProgressReady =
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

  if (
    getDeviceSyncId()
    && getLogicalUserIds()
      .length > 1
  ) {
    const {
      error: linkedProfileError
    } =
      await supabaseClient
        .from("profiles")
        .update({
          profile_id:
            activeProfileId,

          display_name:
            settings.playerName
            || character.defaultName,

          class_name:
            character.className,

          updated_at:
            new Date().toISOString()
        })
        .in(
          "user_id",
          getLogicalUserIds()
        );

    if (linkedProfileError) {
      console.warn(
        "Linked profile sync failed:",
        linkedProfileError
      );
    }
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
      .in(
        "user_id",
        getLogicalUserIds()
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

  if (!width || !height) {
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

  for (
    const relic
    of RELICS
  ) {
    if (
      relic.manual
      || discovered.has(
        relic.id
      )
      || typeof relic.condition
        !== "function"
      || !relic.condition(
        stats
      )
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
    newlyDiscovered.length
    > 0
  ) {
    state.discoveredRelics =
      Array.from(
        discovered
      );

    saveState(state);
  }

  return newlyDiscovered;
}


function unlockRelicById(
  relicId,
  { reveal = true } = {}
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
    Array.from(
      discovered
    );

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
        activeRelicFilter
          === "all"
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
              data-relic-id="${escapeHtml(
                relic.id
              )}"
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
              <span
                class="relic-art-shell"
              >
                <img
                  class="relic-card-image"
                  src="${escapeHtml(
                    relic.image
                  )}"
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
                        <span>
                          Undiscovered
                        </span>
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
    allowed.includes(
      filter
    )
      ? filter
      : "all";

  $$(".relic-filter")
    .forEach(
      button => {
        button.classList.toggle(
          "active",
          button.dataset
            .relicFilter
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
  { reveal = false } = {}
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
    ).includes(
      relicId
    )
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
      `${capitalize(
        relic.rarity
      )} rarity`;

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
    state
      .relicDiscoveryDates
      ?.[relicId];

  $("#relicDiscoveredDate")
    .textContent =
      discoveredAt
        ? `Discovered ${
            new Date(
              discoveredAt
            )
              .toLocaleDateString(
                undefined,
                {
                  month:
                    "long",
                  day:
                    "numeric",
                  year:
                    "numeric"
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
  { defer = false } = {}
) {
  for (
    const relicId
    of relicIds || []
  ) {
    if (
      getRelicById(
        relicId
      )
      && !relicRevealQueue
        .includes(
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
    || $("#weekConqueredDialog")
      ?.open
    || $("#bossDefeatedDialog")
      ?.open
    || relicRevealQueue.length
      === 0
  ) {
    return;
  }

  const relicId =
    relicRevealQueue
      .shift();

  openRelicDialog(
    relicId,
    {
      reveal: true
    }
  );
}



function getOverallLevel(s){return Math.floor((Number(s.xp.strength||0)+Number(s.xp.endurance||0)+Number(s.xp.restoration||0))/XP_PER_LEVEL)+1;}
function getAdventurerTitle(s){const l=getOverallLevel(s);return ADVENTURER_TITLES.filter(x=>l>=x.level).at(-1)?.title||"Wayfarer";}
function getCampaignLocation(p){return CAMPAIGN_LOCATIONS.filter(x=>p>=x.at).at(-1)||CAMPAIGN_LOCATIONS[0];}
function getBossProfileById(id){return BOSS_PROFILES.find(x=>x.id===id)||BOSS_PROFILES[0];}
function getWeeklyBossProfile(s){
  const weekKey=getWeekKey();
  const stored=(s.history||[]).find(x=>x.questId==="boss"&&x.weekKey===weekKey&&x.bossId);
  if(stored)return getBossProfileById(stored.bossId);

  const priorBosses=(s.history||[]).filter(x=>x.questId==="boss");
  if(!priorBosses.length)return BOSS_PROFILES[0];

  const progress=Math.max(
    Number(s.campaignProgress||0),
    (s.history||[]).filter(x=>x.questId!=="boss").length
  );
  const location=getCampaignLocation(progress);
  const candidates=BOSS_PROFILES.filter(
    x=>x.id!=="briar-warden"&&x.locations.includes(location.id)
  );
  const pool=candidates.length?candidates:BOSS_PROFILES.slice(1);
  const seed=`${weekKey}:${location.id}`;
  const hash=Array.from(seed).reduce(
    (total,char)=>((total*31)+char.charCodeAt(0))>>>0,
    7
  );
  return pool[hash%pool.length];
}
function getEquipmentBonuses(s){const o={flatGold:0,goldMultiplier:1,xpBonus:{strength:0,endurance:0,restoration:0}};Object.values(s.equippedRelics||{}).forEach(id=>{const b=EQUIPMENT_RELICS[id];if(!b)return;o.flatGold+=Number(b.flatGold||0);o.goldMultiplier*=Number(b.goldMultiplier||1);if(b.xpType)o.xpBonus[b.xpType]+=Number(b.xpBonus||0);});return o;}
function evaluateAchievements(s){const e=new Set(s.achievements||[]),a=[];ACHIEVEMENTS.forEach(x=>{if(!e.has(x.id)&&x.test(s)){e.add(x.id);a.push(x.id);}});if(a.length){s.achievements=Array.from(e);saveState(s);}return a;}
function renderCampaign(s){const p=Math.min(CAMPAIGN_GOAL,Math.max(Number(s.campaignProgress||0),Math.min(CAMPAIGN_GOAL,s.history.filter(x=>x.questId!=="boss").length)));s.campaignProgress=p;const c=getCampaignLocation(p);$("#campaignRank").textContent=getAdventurerTitle(s);$("#campaignLocation").textContent=c.name;$("#campaignProgressText").textContent=`${p} / ${CAMPAIGN_GOAL} quests`;$("#campaignNarrative").textContent=p>=CAMPAIGN_GOAL?"The heart of the Blackwood stands open. Campaign I is conquered.":`Current location: ${c.name}. Every completed quest pushes the expedition deeper into the wood.`;$("#campaignMap").innerHTML=CAMPAIGN_LOCATIONS.map((x,i)=>`<div class="campaign-map-stop ${p>=x.at?"is-unlocked":""} ${c.name===x.name?"is-current":""}"><span class="campaign-map-node">${x.glyph}</span><small>${escapeHtml(x.name)}</small></div>${i<CAMPAIGN_LOCATIONS.length-1?'<span class="campaign-map-path"></span>':""}`).join("");}
function getDailyContracts(){const d=new Date().toISOString().slice(0,10);let seed=Array.from(d).reduce((s,c)=>s+c.charCodeAt(0),0);const p=[...QUESTS],o=[];while(p.length&&o.length<3){seed=(seed*9301+49297)%233280;o.push(p.splice(seed%p.length,1)[0]);}return o;}
function renderDailyContracts(s){const g=$("#dailyContractGrid");if(!g)return;const d=new Date().toISOString().slice(0,10),done=new Set(s.history.filter(x=>x.completedAt?.startsWith(d)).map(x=>x.questId));g.innerHTML=getDailyContracts().map(q=>`<button class="daily-contract ${done.has(q.id)?"is-complete":""}" type="button" data-quest-id="${q.id}"><span>${done.has(q.id)?"✓":"◆"}</span><div><strong>${escapeHtml(q.title)}</strong><small>${escapeHtml(q.category)} · +${q.gold} Gold</small></div></button>`).join("");}
function getQuestChainStage(s){let n=Math.max(0,Number(s.questChainStage||0));while(n<QUEST_CHAIN.length&&s.history.some(x=>x.questId===QUEST_CHAIN[n].questId))n++;s.questChainStage=n;return n;}
function renderQuestChain(s){const n=getQuestChainStage(s);$("#questChainProgress").textContent=`${Math.min(n,QUEST_CHAIN.length)} / ${QUEST_CHAIN.length}`;$("#questChainSteps").innerHTML=QUEST_CHAIN.map((x,i)=>`<span class="quest-chain-step ${i<n?"is-complete":""} ${i===n?"is-active":""}">${i<n?"✓":i+1}</span>`).join("");const b=$("#questChainButton");if(n>=QUEST_CHAIN.length){$("#questChainCopy").textContent="The Briar Warden has fallen. The first Blackwood story is complete.";b.textContent="Story Complete";b.disabled=true;return;}const c=QUEST_CHAIN[n];$("#questChainCopy").textContent=`Next: ${c.title}`;b.textContent=n?"Continue Story":"Begin Story Quest";b.disabled=c.questId==="boss"&&Boolean($("#bossButton")?.disabled);}
function renderNpcs(){const g=$("#npcGrid");if(g)g.innerHTML=NPCS.map(n=>`<button class="npc-card" type="button" data-npc-id="${n.id}"><span class="npc-glyph">${n.glyph}</span><strong>${escapeHtml(n.name)}</strong><small>${escapeHtml(n.role)}</small></button>`).join("");}
function renderAchievements(s){const e=new Set(s.achievements||[]);$("#achievementCount").textContent=`${e.size} / ${ACHIEVEMENTS.length}`;$("#achievementGrid").innerHTML=ACHIEVEMENTS.map(a=>{const on=e.has(a.id);return `<article class="achievement-card ${on?"is-unlocked":"is-locked"}"><img src="${on?"badges/quest-completed.webp":"badges/secret-acheivment.webp"}" alt=""><div><strong>${on?escapeHtml(a.name):"Hidden Feat"}</strong><small>${on?escapeHtml(a.copy):"Continue your campaign to reveal this achievement."}</small></div></article>`;}).join("");}
function renderEquipment(s){const e=s.equippedRelics||{};$("#equipmentSlots").innerHTML=EQUIPMENT_SLOTS.map(x=>{const r=getRelicById(e[x.id]);return `<button class="equipment-slot ${r?"is-equipped":""}" type="button" data-equipment-slot="${x.id}"><span>${x.label}</span><strong>${r?escapeHtml(r.name):"Empty"}</strong><small>${r?escapeHtml(EQUIPMENT_RELICS[r.id]?.bonus||"Relic equipped"):"Equip a discovered relic"}</small></button>`;}).join("");const a=(s.discoveredRelics||[]).map(getRelicById).filter(r=>r&&EQUIPMENT_RELICS[r.id]);$("#equipmentInventory").innerHTML=a.length?a.map(r=>{const c=EQUIPMENT_RELICS[r.id],on=e[c.slot]===r.id;return `<button class="inventory-relic ${on?"is-equipped":""}" type="button" data-equip-relic="${r.id}"><img src="${r.image}" alt=""><span><strong>${escapeHtml(r.name)}</strong><small>${escapeHtml(c.bonus)}</small></span></button>`;}).join(""):'<p class="muted">Discover equippable relics to build your loadout.</p>';$("#equipmentBonusSummary").textContent=Object.values(e).filter(Boolean).map(id=>EQUIPMENT_RELICS[id]?.bonus).filter(Boolean).join(" · ")||"No bonuses equipped";}
function renderCodex(s){const d=new Set(s.codexDiscoveries||[]),e=[{id:"guild-hall",name:"Guild Hall",type:"Location"},{id:"old-road",name:"The Old Road",type:"Location",unlock:3},{id:"whispering-pines",name:"Whispering Pines",type:"Location",unlock:6},{id:"mossgate",name:"Mossgate",type:"Location",unlock:10},{id:"briar-warden",name:"The Briar Warden",type:"Bestiary",boss:true},{id:"road-merchant",name:"Road Merchant",type:"Encounter",encounter:true}];e.forEach(x=>{if(x.unlock!==undefined&&Number(s.campaignProgress||0)>=x.unlock)d.add(x.id);if(x.boss&&s.history.some(y=>y.questId==="boss"))d.add(x.id);if(x.encounter&&Number(s.encounterCount||0)>0)d.add(x.id);});s.codexDiscoveries=Array.from(d);$("#codexCount").textContent=`${d.size} / ${e.length} discovered`;$("#codexGrid").innerHTML=e.map(x=>{const on=d.has(x.id);return `<article class="codex-entry ${on?"is-discovered":"is-locked"}"><span>${on?"✦":"?"}</span><div><strong>${on?escapeHtml(x.name):"Unknown"}</strong><small>${on?escapeHtml(x.type):"Undiscovered"}</small></div></article>`;}).join("");}
function showRewardBurst(t){const e=$("#rewardBurst");if(!e)return;e.textContent=t;e.classList.remove("is-visible");void e.offsetWidth;e.classList.add("is-visible");setTimeout(()=>e.classList.remove("is-visible"),1300);}
let pendingEncounter=null;
function maybeTriggerEncounter(){const s=getState(),n=s.history.filter(x=>x.questId!=="boss").length;if(!n||n%3!==0)return;pendingEncounter=RANDOM_ENCOUNTERS[(n+Number(s.encounterCount||0))%RANDOM_ENCOUNTERS.length];$("#encounterGlyph").textContent=pendingEncounter.glyph;$("#encounterTitle").textContent=pendingEncounter.title;$("#encounterCopy").textContent=pendingEncounter.copy;$("#encounterReward").textContent=pendingEncounter.reward==="xp"?`+${pendingEncounter.amount} XP`:`+${pendingEncounter.amount} ${capitalize(pendingEncounter.reward)}`;$("#encounterDialog")?.showModal();}
function claimEncounter(){if(!pendingEncounter)return;const s=getState();if(pendingEncounter.reward==="gold")s.gold+=pendingEncounter.amount;else if(pendingEncounter.reward==="crystals")s.crystals+=pendingEncounter.amount;else s.xp.restoration+=pendingEncounter.amount;s.encounterCount=Number(s.encounterCount||0)+1;saveState(s);$("#encounterDialog")?.close();showRewardBurst($("#encounterReward")?.textContent||"Treasure claimed");pendingEncounter=null;render();}

function getActiveConsumableEffects(state = getState()) {
  return {
    nextGold: Boolean(state.activeConsumableEffects?.nextGold),
    nextXp: Boolean(state.activeConsumableEffects?.nextXp),
    nextStrengthXp: Boolean(state.activeConsumableEffects?.nextStrengthXp),
    nextEnduranceXp: Boolean(state.activeConsumableEffects?.nextEnduranceXp),
    nextRestorationXp: Boolean(state.activeConsumableEffects?.nextRestorationXp)
  };
}

function getConsumableEffectStateKey(effectType) {
  return {
    "next-gold": "nextGold",
    "next-xp": "nextXp",
    "next-strength-xp": "nextStrengthXp",
    "next-endurance-xp": "nextEnduranceXp",
    "next-restoration-xp": "nextRestorationXp"
  }[effectType] || null;
}

function openConsumableRoadEncounter() {
  if (pendingEncounter || $("#encounterDialog")?.open) return false;
  const state = getState();
  const offset = Math.floor(Math.random() * RANDOM_ENCOUNTERS.length);
  const index = (Number(state.encounterCount || 0) + state.history.length + offset) % RANDOM_ENCOUNTERS.length;
  pendingEncounter = RANDOM_ENCOUNTERS[index];
  $("#encounterGlyph").textContent = pendingEncounter.glyph;
  $("#encounterTitle").textContent = pendingEncounter.title;
  $("#encounterCopy").textContent = pendingEncounter.copy;
  $("#encounterReward").textContent = pendingEncounter.reward === "xp"
    ? "+" + pendingEncounter.amount + " XP"
    : "+" + pendingEncounter.amount + " " + capitalize(pendingEncounter.reward);
  $("#encounterDialog")?.showModal();
  return true;
}
function renderBossCombat(s){
  const p=$("#bossCombatPanel");
  if(!p)return;

  const on=activeQuest?.id==="boss";
  p.hidden=!on;
  if(!on)return;

  const boss=getWeeklyBossProfile(s);
  const g=Number(getSettings().weeklyGoal)||DEFAULT_WEEKLY_GOAL;
  const c=Math.min(g,s.weeklyCompleted.length);
  const hp=Math.max(10,100-Math.floor(c/Math.max(1,g)*70));

  $("#bossEnemyName").textContent=boss.name;
  $("#bossCombatCopy").textContent=boss.copy;
  $("#bossHpText").textContent=`${hp} / 100 HP`;
  $("#bossHpBar").style.width=`${hp}%`;
}
function equipRelic(id){const s=getState(),c=EQUIPMENT_RELICS[id];if(!c||!s.discoveredRelics.includes(id))return;s.equippedRelics[c.slot]=s.equippedRelics[c.slot]===id?null:id;saveState(s);render();showToast(s.equippedRelics[c.slot]?"Relic equipped.":"Relic unequipped.");}
function openCurrentStoryQuest(){const s=getState(),n=getQuestChainStage(s);if(n<QUEST_CHAIN.length)openQuest(QUEST_CHAIN[n].questId);}
function renderRpgSystems(s){const a=evaluateAchievements(s);renderCampaign(s);renderDailyContracts(s);renderQuestChain(s);renderNpcs();renderAchievements(s);renderEquipment(s);renderCodex(s);$("#characterTitleName").textContent=getAdventurerTitle(s);if(a.length&&appInitialized){const x=ACHIEVEMENTS.find(y=>y.id===a[0]);if(x)showRewardBurst(`Achievement: ${x.name}`);}}

// =========================================================
// 19. MAIN RENDER
// =========================================================

function render({ skipParty = false } = {}) {
  const state =
    normalizeWeek();

  /*
    Re-check the complete saved quest history whenever the
    main interface renders. This safely restores relics that
    were already earned before the relic system was added or
    while an older app.js was active.
  */
  discoverEligibleRelics(
    state
  );

  const settings =
    getSettings();

  renderProfile(
    settings,
    state
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

  renderRpgSystems(
    state
  );

  renderSettings(
    settings
  );

  /*
    renderParty is async. It is safe to trigger
    without blocking the local UI render.
  */
  if (!skipParty) {
    void renderParty();
  }

  applyMotionSetting(
    settings
  );

  bindQuestCards();
}


// =========================================================
// 20. PROFILE DISPLAY
// =========================================================

function renderProfile(settings, state) {
  const character = getCharacterConfig();
  const name = settings.playerName || character.defaultName;
  const totalXp =
    Number(state?.xp?.strength || 0)
    + Number(state?.xp?.endurance || 0)
    + Number(state?.xp?.restoration || 0);
  const overallLevel =
    Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const levelProgress =
    Math.min(100, (totalXp % XP_PER_LEVEL) / XP_PER_LEVEL * 100);

  $("#profileName").textContent = name;
  $("#profileAvatar").textContent =
    name.charAt(0).toUpperCase();
  $("#profileLevel").textContent =
    `Lv. ${overallLevel}`;
  $("#profileXpBar").style.width =
    `${levelProgress}%`;
  $("#profileGold").textContent = state.gold;
  $("#profileCrystals").textContent = state.crystals;
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
    || DEFAULT_WEEKLY_GOAL;

  const completed =
    state.weeklyCompleted
      .length;

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
    completed
      === goal - 1
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
    || DEFAULT_WEEKLY_GOAL;

  const weekKey =
    getWeekKey();

  const weekConquered =
    state.weeklyCompleted
      .length
    >= goal;

  const bossDefeated =
    state.bossDefeatedWeek
    === weekKey;

  const boss =
    getWeeklyBossProfile(state);

  const bossButton =
    $("#bossButton");

  bossButton.disabled =
    !weekConquered
    || bossDefeated;

  const bossName =
    bossButton
      ?.querySelector("strong");

  if (bossName) {
    bossName.textContent =
      boss.name;
  }

  if (bossDefeated) {
    $("#bossLockText")
      .textContent =
        "Defeated this week.";
  }

  else if (
    weekConquered
  ) {
    $("#bossLockText")
      .textContent =
        `Unlocked. Face ${boss.name}.`;
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

function getQuestDifficulty(quest) {
  const xp = Number(quest?.xp) || 0;
  if (xp >= 30) return "Hard";
  if (xp >= 20) return "Standard";
  return "Light";
}

function renderQuestCards() {
  const state = normalizeWeek();
  const completedIds =
    new Set(
      state.weeklyCompleted
        .map(entry => entry?.questId)
        .filter(Boolean)
    );
  const timerState = getSavedTimerState();

  $("#questGrid").innerHTML =
    QUESTS.map(quest => {
      const completed =
        completedIds.has(quest.id);
      const active =
        !completed
        && timerState?.questId === quest.id;
      const status =
        completed
          ? "Complete"
          : active
            ? (timerState.paused ? "Paused" : "Active")
            : "Available";
      const action =
        completed
          ? "Review Quest"
          : active
            ? "Resume Quest"
            : "Begin Quest";
      const stateClass =
        completed
          ? "is-complete"
          : active
            ? "is-active"
            : "is-available";

      return `
        <article
          class="quest-card ${stateClass}"
          data-quest-id="${quest.id}"
          tabindex="0"
          role="button"
          aria-label="${escapeHtml(`${quest.title}. ${status}. ${action}.`)}"
        >
          <div class="quest-card-status-row">
            <span class="quest-state-badge">${status}</span>
            <span class="quest-difficulty">${getQuestDifficulty(quest)}</span>
          </div>

          <div class="quest-card-content">
            <p class="quest-type">${escapeHtml(quest.category)}</p>
            <h3>${escapeHtml(quest.title)}</h3>
            <p>${escapeHtml(quest.description)}</p>
          </div>

          <div class="quest-card-meta">
            <span class="quest-duration">${escapeHtml(quest.time)}</span>
            <span class="quest-gold-reward">
              <img src="icons/gold-icon.webp" alt="" aria-hidden="true">
              ${quest.gold}
            </span>
            <span class="quest-card-action">${action}</span>
            <span class="quest-arrow" aria-hidden="true">›</span>
          </div>

          ${completed ? '<span class="quest-complete-seal" aria-hidden="true">✓</span>' : ""}
        </article>
      `;
    }).join("");
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
            if (
              element.disabled
            ) {
              return;
            }

            openQuest(
              element.dataset
                .questId
            );
          };

        if (
          element.classList
            .contains(
              "quest-card"
            )
        ) {
          element.onkeydown =
            event => {
              if (
                event.key
                  === "Enter"
                || event.key
                  === " "
              ) {
                event.preventDefault();

                openQuest(
                  element.dataset
                    .questId
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
      `${displayName} - ${character.className}`;

  $("#characterGold")
    .textContent =
      state.gold;

  $("#characterCrystals")
    .textContent =
      state.crystals;

  $("#characterWeeklyQuests")
    .textContent =
      state.weeklyCompleted
        .length;

  $("#characterTotalQuests")
    .textContent =
      state.history.length;

  $("#characterTotalXp")
    .textContent =
      totalXp;

  document.body
    .dataset
    .characterTheme =
      character.theme;

  document.body
    .dataset
    .profileId =
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
      state.weeklyCompleted
        .length
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

  playUiSound("open");

  restoreTimerForQuest(
    quest.id
  );

  $("#dialogCategory")
    .textContent =
      quest.category;

  const bossProfile =
    quest.id === "boss"
      ? getWeeklyBossProfile(state)
      : null;

  $("#dialogTitle")
    .textContent =
      bossProfile?.name
      || quest.title;

  $("#dialogDescription")
    .textContent =
      bossProfile?.copy
      || quest.description;

  $("#dialogTime")
    .textContent =
      quest.time;

  const questArt =
    $("#questDialogArt");

  const questIconPath =
    QUEST_ICON_PATHS[
      quest.id
    ];

  if (questArt) {
    questArt.hidden =
      !questIconPath;

    questArt.dataset.questId =
      quest.id;

    questArt.style
      .backgroundImage =
        questIconPath
          ? `url("${questIconPath}")`
          : "";
  }

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
          ${capitalize(
            quest.xpType
          )}
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

  renderBossCombat(
    getState()
  );

  $("#questDialog")
    .showModal();
}
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

  const equipmentBonuses = getEquipmentBonuses(state);
  const activeEffects = getActiveConsumableEffects(state);
  let consumableXpBonus = 0;
  let consumableGoldBonus = 0;
  const consumedEffects = [];

  if (activeEffects.nextGold) {
    consumableGoldBonus += 10;
    activeEffects.nextGold = false;
    consumedEffects.push("Wayfarer's Ration");
  }

  if (activeEffects.nextXp) {
    consumableXpBonus += 10;
    activeEffects.nextXp = false;
    consumedEffects.push("Scholar's Ink");
  }

  if (completedQuest.xpType === "strength" && activeEffects.nextStrengthXp) {
    consumableXpBonus += 15;
    activeEffects.nextStrengthXp = false;
    consumedEffects.push("Ember Draught");
  }

  if (completedQuest.xpType === "endurance" && activeEffects.nextEnduranceXp) {
    consumableXpBonus += 15;
    activeEffects.nextEnduranceXp = false;
    consumedEffects.push("Windrunner Cordial");
  }

  if (completedQuest.xpType === "restoration" && activeEffects.nextRestorationXp) {
    consumableXpBonus += 15;
    activeEffects.nextRestorationXp = false;
    consumedEffects.push("Mossheart Tonic");
  }

  state.activeConsumableEffects = activeEffects;

  const earnedXp =
    (Number(completedQuest.xp) || 0)
    + (equipmentBonuses.xpBonus[completedQuest.xpType] || 0)
    + consumableXpBonus;

  const earnedGold = Math.max(
    0,
    Math.round(
      (Number(completedQuest.gold) || 0)
      * equipmentBonuses.goldMultiplier
      + equipmentBonuses.flatGold
      + consumableGoldBonus
    )
  );

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

  state.campaignProgress = Math.min(CAMPAIGN_GOAL, Number(state.campaignProgress || 0) + 1);

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

  playUiSound("complete");

  if (
    navigator.vibrate
    && !getSettings().reducedMotion
  ) {
    navigator.vibrate(35);
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
      "Quest saved | +" + earnedXp + " XP | +" + earnedGold + " Gold" + (consumedEffects.length ? " | Used: " + consumedEffects.join(", ") : "") + " | Party sync failed"
    );
  }

  else {
    showToast(
      "Quest Complete | +" + earnedXp + " XP | +" + earnedGold + " Gold" + (consumedEffects.length ? " | Used: " + consumedEffects.join(", ") : "")
    );
  }

  queueRelicReveals(
    newlyDiscoveredRelics
  );

  showRewardBurst(`+${earnedXp} XP · +${earnedGold} Gold`);
  setTimeout(maybeTriggerEncounter, 500);
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
    `Week Conquered | +${WEEK_CONQUERED_GOLD} Gold | Boss Battle Unlocked`
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
      `${getWeeklyBossProfile(state).name} has already been defeated this week.`
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

  const bossProfile =
    getWeeklyBossProfile(state);

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
      bossProfile.name,

    bossId:
      bossProfile.id,

    weekKey,

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
        completedAt,
        bossProfile
      );

    if (partySynced) {
      await ensureWeeklyBossTreasureDrop(true);
    }
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
      `Boss Rewards Claimed | +100 XP | +${BOSS_GOLD} Gold | +${BOSS_CRYSTALS} Crystals | Party sync failed`
    );
  }

  else {
    showToast(
      `Boss Rewards Claimed | +100 XP | +${BOSS_GOLD} Gold | +${BOSS_CRYSTALS} Crystals`
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
  completedAt,
  bossProfile =
    getWeeklyBossProfile(
      getState()
    )
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
            bossProfile.name,

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

      paused:
        Boolean(
          parsed.paused
        )
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
    JSON.stringify(
      timerState
    )
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
      endTime =
        pausedAt;
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
    clearInterval(
      timerInterval
    );

    timerInterval =
      null;
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
    getTimerElapsedMs(
      timerState
    );

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
    || timerState.questId
      !== questId
  ) {
    timerDisplayMs =
      0;

    updateTimerDisplay();

    if (timerButton) {
      timerButton.textContent =
        "Start";
    }

    return;
  }

  timerDisplayMs =
    getTimerElapsedMs(
      timerState
    );

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

  const now =
    Date.now();

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

    timerState.startedAt =
      now;

    timerState.paused =
      false;
  }

  else if (
    timerState.paused
  ) {
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

    timerState.pausedAt =
      null;

    timerState.paused =
      false;
  }

  saveTimerState(
    timerState
  );

  timerDisplayMs =
    getTimerElapsedMs(
      timerState,
      now
    );

  updateTimerDisplay();

  const timerButton =
    $("#timerToggleButton");

  if (timerButton) {
    timerButton.textContent =
      "Pause";
  }

  startTimerUiInterval();
  playUiSound("start");
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
      timerButton.textContent =
        "Start";
    }

    return;
  }

  timerState.pausedAt =
    Date.now();

  timerState.paused =
    true;

  saveTimerState(
    timerState
  );

  timerDisplayMs =
    getTimerElapsedMs(
      timerState
    );

  stopTimerUiInterval();

  updateTimerDisplay();

  if (timerButton) {
    timerButton.textContent =
      "Start";
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

  timerDisplayMs =
    0;

  updateTimerDisplay();

  const timerButton =
    $("#timerToggleButton");

  if (timerButton) {
    timerButton.textContent =
      "Start";
  }
}


function clearTimerForQuest(questId) {
  const timerState =
    getSavedTimerState();

  if (
    timerState
    && timerState.questId
      === questId
  ) {
    clearSavedTimerState();
  }

  stopTimerUiInterval();

  timerDisplayMs =
    0;
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
      Math.max(
        0,
        timerDisplayMs
      )
      / 1000
    );

  const hours =
    Math.floor(
      totalSeconds / 3600
    );

  const minutes =
    Math.floor(
      (
        totalSeconds % 3600
      )
      / 60
    );

  const seconds =
    totalSeconds % 60;

  if (hours > 0) {
    display.textContent =
      String(hours)
        .padStart(
          2,
          "0"
        )
      + ":"
      + String(minutes)
        .padStart(
          2,
          "0"
        )
      + ":"
      + String(seconds)
        .padStart(
          2,
          "0"
        );
  }

  else {
    display.textContent =
      String(minutes)
        .padStart(
          2,
          "0"
        )
      + ":"
      + String(seconds)
        .padStart(
          2,
          "0"
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

                    | +${item.xp}
                    ${xpTypeText} XP

                    ${
                      gold
                        ? `
                          |
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
                          |
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

  map: {
    eyebrow: "Campaign I",
    title: "Blackwood Map"
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
  const previousView = activeView;

  activeView =
    VIEW_HEADERS[view]
      ? view
      : "board";

  if (
    supabaseReady
    && supabaseUser
    && getDeviceSyncId()
  ) {
    try {
      await Promise.all([
        pullDeviceSync(),
        refreshDeviceSyncIdentityContext()
      ]);

      await loadCurrentParty();

      window.dispatchEvent(
        new Event(
          "questboard:guild-refresh"
        )
      );
    }

    catch (error) {
      console.warn(
        "View sync refresh failed:",
        error
      );
    }
  }

  if (
    appInitialized
    && previousView !== activeView
  ) {
    playUiSound("nav");
  }

  localStorage.setItem(
    "questBoardActiveView",
    activeView
  );

  document.body.dataset.activeView =
    activeView;

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

  renderAccountStatus();
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

function playUiSound(type = "tap") {
  const settings = getSettings();
  if (!settings.soundEnabled) return;

  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const frequencies = {
      tap: 240,
      nav: 280,
      open: 360,
      start: 430,
      complete: 660
    };

    oscillator.type =
      type === "complete" ? "triangle" : "sine";
    oscillator.frequency.value =
      frequencies[type] || frequencies.tap;

    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.055,
      context.currentTime + 0.015
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      context.currentTime + (type === "complete" ? 0.24 : 0.11)
    );

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(
      context.currentTime + (type === "complete" ? 0.26 : 0.13)
    );
    oscillator.addEventListener(
      "ended",
      () => context.close()
    );
  }
  catch (error) {
    console.debug("Quest Board sound unavailable:", error);
  }
}

function saveSoundSetting() {
  const settings = getSettings();
  settings.soundEnabled =
    $("#soundToggle").checked;
  saveSettings(settings);

  if (settings.soundEnabled) {
    playUiSound("complete");
  }

  showToast(
    settings.soundEnabled
      ? "Sound effects enabled."
      : "Sound effects disabled."
  );
}




function renderAccountStatus() {
  const status =
    $("#accountStatus");

  const fields =
    $("#accountFields");

  const signOutButton =
    $("#signOutAccountButton");

  const signedInActions =
    $("#signedInAccountActions");

  const syncActions =
    $("#accountSyncActions");

  if (
    !status
    || !fields
    || !signOutButton
  ) {
    return;
  }

  if (
    !supabaseReady
    || !supabaseUser
  ) {
    status.textContent =
      "Cloud account service is unavailable.";
    fields.hidden = false;
    signOutButton.hidden = true;
    if (signedInActions) {
      signedInActions.hidden = true;
    }
    if (syncActions) {
      syncActions.hidden = true;
    }
    return;
  }

  if (supabaseUser.is_anonymous) {
    status.textContent =
      "This save is cloud-backed, but still tied to this device. Protect it with an email and password so it can be restored after reinstalling or switching devices.";
    fields.hidden = false;
    signOutButton.hidden = true;
    if (signedInActions) {
      signedInActions.hidden = true;
    }
    if (syncActions) {
      syncActions.hidden = true;
    }
    return;
  }

  status.textContent =
    `Protected as ${supabaseUser.email || "signed-in adventurer"}. Your save can be restored on another device.`;
  fields.hidden = true;
  signOutButton.hidden = false;
  if (signedInActions) {
    signedInActions.hidden = false;
  }
  if (syncActions) {
    syncActions.hidden = false;
  }
}

function getAccountCredentials() {
  return {
    email:
      $("#accountEmailInput")
        ?.value
        .trim()
        .toLowerCase()
      || "",
    password:
      $("#accountPasswordInput")
        ?.value
      || ""
  };
}

function validateAccountCredentials(
  email,
  password
) {
  if (
    !email
    || !email.includes("@")
  ) {
    showToast(
      "Enter a valid email address."
    );
    return false;
  }

  if (
    !password
    || password.length < 8
  ) {
    showToast(
      "Use a password with at least 8 characters."
    );
    return false;
  }

  return true;
}

function openPasswordRecoveryDialog() {
  const dialog =
    $("#passwordRecoveryDialog");

  if (!dialog) {
    return;
  }

  $("#newPasswordInput").value =
    "";

  $("#confirmNewPasswordInput").value =
    "";

  if (!dialog.open) {
    dialog.showModal();
  }

  setTimeout(
    () =>
      $("#newPasswordInput")
        ?.focus(),
    40
  );
}


async function requestPasswordReset() {
  if (!supabaseClient) {
    showToast(
      "Cloud account service is unavailable."
    );
    return;
  }

  const email =
    $("#accountEmailInput")
      ?.value
      .trim()
      .toLowerCase()
    || "";

  if (
    !email
    || !email.includes("@")
  ) {
    showToast(
      "Enter your Quest Board email first."
    );
    return;
  }

  try {
    const {
      error
    } =
      await supabaseClient.auth
        .resetPasswordForEmail(
          email,
          {
            redirectTo:
              `${window.location.origin}${window.location.pathname}?recovery=1`
          }
        );

    if (error) {
      throw error;
    }

    showToast(
      "Password reset email sent. Open it on this device."
    );
  }

  catch (error) {
    console.error(
      "Could not send password reset email:",
      error
    );

    showToast(
      "Could not send the reset email. Try again in a moment."
    );
  }
}


async function saveNewAccountPassword() {
  if (!supabaseClient) {
    showToast(
      "Cloud account service is unavailable."
    );
    return;
  }

  const password =
    $("#newPasswordInput")
      ?.value
    || "";

  const confirmation =
    $("#confirmNewPasswordInput")
      ?.value
    || "";

  if (password.length < 8) {
    showToast(
      "Use a password with at least 8 characters."
    );
    return;
  }

  if (
    password
    !== confirmation
  ) {
    showToast(
      "Those passwords do not match."
    );
    return;
  }

  try {
    const {
      data,
      error
    } =
      await supabaseClient.auth
        .updateUser({
          password
        });

    if (error) {
      throw error;
    }

    if (data?.user) {
      supabaseUser =
        data.user;

      supabaseReady =
        true;
    }

    $("#passwordRecoveryDialog")
      ?.close();

    renderAccountStatus();

    if (
      window.location.hash
      || new URLSearchParams(
        window.location.search
      ).has("recovery")
    ) {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }

    showToast(
      "Quest Board password updated."
    );
  }

  catch (error) {
    console.error(
      "Could not update Quest Board password:",
      error
    );

    showToast(
      "Could not update the password. Open a fresh reset link and try again."
    );
  }
}


async function finishPermanentAccountLogin(
  session
) {
  if (!session?.user) {
    return false;
  }

  supabaseUser =
    session.user;

  supabaseReady =
    true;

  cloudProgressReady =
    false;

  const restored =
    await restoreOrSeedCloudProgress({
      preferCloud: true
    });

  cloudProgressReady =
    true;

  await syncProfileToSupabase();
  await loadCurrentParty();

  render();
  renderSettings(
    getSettings()
  );

  if (restored) {
    showToast(
      "Adventurer save restored."
    );
  }

  return true;
}

async function createPermanentAccount() {
  if (
    !supabaseClient
    || !supabaseReady
  ) {
    showToast(
      "Cloud account service is unavailable."
    );
    return;
  }

  const {
    email,
    password
  } =
    getAccountCredentials();

  if (
    !validateAccountCredentials(
      email,
      password
    )
  ) {
    return;
  }

  try {
    await saveProgressToCloud();

    const {
      data,
      error
    } =
      await supabaseClient.auth
        .signUp({
          email,
          password
        });

    if (error) {
      throw error;
    }

    if (data.session) {
      await finishPermanentAccountLogin(
        data.session
      );

      showToast(
        "Save protected. Adventurer account created."
      );
      return;
    }

    showToast(
      "Check your email to confirm the account, then return here and choose Restore Existing Save."
    );
  }

  catch (error) {
    console.error(
      "Could not create adventurer account:",
      error
    );

    showToast(
      "Could not protect this save. If that email already has an account, use Restore Existing Save."
    );
  }
}

async function signInPermanentAccount() {
  if (!supabaseClient) {
    showToast(
      "Cloud account service is unavailable."
    );
    return;
  }

  const {
    email,
    password
  } =
    getAccountCredentials();

  if (
    !validateAccountCredentials(
      email,
      password
    )
  ) {
    return;
  }

  try {
    const {
      data,
      error
    } =
      await supabaseClient.auth
        .signInWithPassword({
          email,
          password
        });

    if (error) {
      throw error;
    }

    await finishPermanentAccountLogin(
      data.session
    );
  }

  catch (error) {
    console.error(
      "Could not restore adventurer account:",
      error
    );

    showToast(
      "Sign-in failed. Check the email/password and make sure the email was confirmed."
    );
  }
}

async function uploadCurrentDeviceSave() {
  if (
    !supabaseReady
    || !supabaseUser
    || supabaseUser.is_anonymous
  ) {
    showToast(
      "Protect this save with an adventurer account first."
    );
    return;
  }

  if (
    !confirm(
      "Upload this device's current Quest Board save to the cloud?\n\nThis replaces the cloud save for this adventurer account."
    )
  ) {
    return;
  }

  try {
    await saveProgressToCloud();

    showToast(
      "Device save uploaded. It is ready to load on your other device."
    );
  }

  catch (error) {
    console.error(
      "Could not upload device save:",
      error
    );

    showToast(
      "Could not upload this device save."
    );
  }
}

async function loadCloudSaveToThisDevice() {
  if (
    !supabaseReady
    || !supabaseUser
    || supabaseUser.is_anonymous
  ) {
    showToast(
      "Sign in to your adventurer account first."
    );
    return;
  }

  if (
    !confirm(
      "Load the cloud Quest Board save onto this device?\n\nThis replaces this device's current local Quest Board save."
    )
  ) {
    return;
  }

  try {
    const {
      data,
      error
    } =
      await supabaseClient
        .from("player_progress")
        .select(
          "profile_id, state, settings, updated_at"
        )
        .eq(
          "user_id",
          supabaseUser.id
        )
        .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data?.state) {
      showToast(
        "No cloud save was found for this adventurer account."
      );
      return;
    }

    const restoredState =
      migrateState(
        data.state
      );

    localStorage.setItem(
      getStorageKey(),
      JSON.stringify(restoredState)
    );

    if (data.settings) {
      localStorage.setItem(
        getSettingsKey(),
        JSON.stringify({
          ...createFreshSettings(),
          ...data.settings
        })
      );
    }

    render();
    renderSettings(
      getSettings()
    );

    showToast(
      "Cloud save loaded onto this device."
    );
  }

  catch (error) {
    console.error(
      "Could not load cloud save:",
      error
    );

    showToast(
      "Could not load the cloud save."
    );
  }
}


async function signOutPermanentAccount() {
  if (!supabaseClient) {
    return;
  }

  if (
    !confirm(
      "Sign out of this adventurer account on this device?\n\nYour cloud save will remain protected."
    )
  ) {
    return;
  }

  try {
    await saveProgressToCloud();
    await supabaseClient.auth.signOut();

    supabaseUser =
      null;
    supabaseReady =
      false;
    cloudProgressReady =
      false;
    currentParty =
      null;

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
    supabaseReady =
      true;

    await restoreOrSeedCloudProgress();
    cloudProgressReady =
      true;

    render();
    renderSettings(
      getSettings()
    );

    showToast(
      "Signed out. This device is using a temporary account."
    );
  }

  catch (error) {
    console.error(
      "Could not sign out:",
      error
    );

    showToast(
      "Could not sign out."
    );
  }
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

  timerDisplayMs =
    0;

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
      `Fellowship created | ${inviteCode}`
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
    return false;
  }

  try {
    await loadCurrentParty();
    return true;
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

    return false;
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
      "Connected | No fellowship joined.",
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

  const localState =
    getState();

  const localRenown =
    localState.history
      .reduce(
        (total, item) =>
          total
          + Math.max(
              0,
              Number(item.xp) || 0
            ),
        0
      );

  const guildLevel =
    Math.floor(
      localRenown / 500
    ) + 1;

  $("#fellowshipLevel")
    .textContent =
      `Guild Level ${guildLevel}`;

  $("#fellowshipRenownValue")
    .textContent =
      `${localRenown} Renown`;

  $("#fellowshipRenownBar")
    .style.width =
      `${Math.min(
        100,
        (localRenown % 500) / 5
      )}%`;

  const fellowshipBoss =
    getWeeklyBossProfile(
      localState
    );

  $("#fellowshipBossThreat")
    .textContent =
      localState.bossDefeatedWeek
        === getWeekKey()
        ? `${fellowshipBoss.name} defeated`
        : fellowshipBoss.name;

  try {
    await ensureWeeklyBossTreasureDrop(false);

    const [
      members,
      activity,
      inventory,
      bonusProgress,
      adventure,
      adventureReward
    ] =
      await Promise.all([
        fetchPartyMembers(),
        fetchPartyActivity(),
        fetchPartyTreasureInventory(),
        fetchPartyBonusProgress(),
        fetchPartyAdventure(),
        fetchPartyAdventureReward()
      ]);

    renderPartyMembers(
      members,
      activity
    );

    renderPartyAdventure(
      adventure,
      members,
      activity,
      adventureReward
    );

    renderPartyChallenge(
      activity,
      members.length,
      bonusProgress
    );

    renderPartyTreasure(inventory);

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

  const profileByUserId =
    new Map(
      (profiles || []).map(
        profile => [
          String(profile.user_id),
          profile
        ]
      )
    );

  const collapsed =
    new Map();

  for (
    const membership
    of memberships
  ) {
    const profile =
      profileByUserId.get(
        String(
          membership.user_id
        )
      )
      || {};

    const profileId =
      normalizeProfileId(
        profile.profile_id
      );

    const key =
      profileId
      || String(
        membership.user_id
      );

    if (!collapsed.has(key)) {
      collapsed.set(
        key,
        {
          user_id:
            membership.user_id,

          user_ids:
            [
              membership.user_id
            ],

          joined_at:
            membership.joined_at,

          profile_id:
            profileId,

          display_name:
            profile.display_name
            || (
              profileId
                ? getCharacterConfig(
                    profileId
                  ).defaultName
                : "Adventurer"
            ),

          class_name:
            profile.class_name
            || (
              profileId
                ? getCharacterConfig(
                    profileId
                  ).className
                : "Unknown Class"
            )
        }
      );

      continue;
    }

    const existing =
      collapsed.get(
        key
      );

    if (
      !existing.user_ids.includes(
        membership.user_id
      )
    ) {
      existing.user_ids.push(
        membership.user_id
      );
    }

    if (
      isLogicalUserId(
        membership.user_id
      )
      && !isLogicalUserId(
        existing.user_id
      )
    ) {
      existing.user_id =
        membership.user_id;
    }
  }

  return Array.from(
    collapsed.values()
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
      .limit(1000);

  if (error) {
    throw error;
  }

  return data || [];
}


// =========================================================
// 57A. SHARED FELLOWSHIP ADVENTURE
// =========================================================

async function fetchPartyAdventure() {
  if (
    !currentParty
    || !supabaseClient
  ) {
    return null;
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from("party_adventures")
      .select(
        "party_id, adventure_id, started_by_user_id, started_at"
      )
      .eq(
        "party_id",
        currentParty.id
      )
      .eq(
        "adventure_id",
        PARTY_ADVENTURE.id
      )
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data || null;
}


async function fetchPartyAdventureReward() {
  if (
    !currentParty
    || !supabaseUser
    || !supabaseClient
  ) {
    return null;
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from("party_adventure_rewards")
      .select(
        "party_id, adventure_id, profile_id, user_id, relic_id, item_id, claimed_at"
      )
      .eq(
        "party_id",
        currentParty.id
      )
      .eq(
        "adventure_id",
        PARTY_ADVENTURE.id
      )
      .eq(
        "profile_id",
        activeProfileId
      )
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data || null;
}


async function claimPartyAdventureReward() {
  if (
    !supabaseReady
    || !supabaseUser
    || !currentParty
  ) {
    showToast(
      "The Fellowship is not connected."
    );
    return;
  }

  const button =
    $("#claimPartyAdventureRewardButton");

  if (button) {
    button.disabled =
      true;

    button.textContent =
      "Claiming…";
  }

  try {
    const existing =
      await fetchPartyAdventureReward();

    let reward =
      existing;

    if (!reward) {
      const {
        data,
        error
      } =
        await supabaseClient
          .from("party_adventure_rewards")
          .insert({
            party_id:
              currentParty.id,

            adventure_id:
              PARTY_ADVENTURE.id,

            profile_id:
              activeProfileId,

            user_id:
              supabaseUser.id,

            relic_id:
              PARTY_ADVENTURE.relicId,

            item_id:
              "fellowship-token"
          })
          .select(
            "party_id, adventure_id, profile_id, user_id, relic_id, item_id, claimed_at"
          )
          .single();

      if (error) {
        throw error;
      }

      reward =
        data;
    }

    const item =
      PARTY_TREASURES[
        reward?.item_id
      ];

    const newlyUnlocked =
      unlockRelicById(
        PARTY_ADVENTURE.relicId,
        {
          reveal:
            true
        }
      );

    await refreshParty();

    showRewardBurst(
      "Fellowship Adventure Reward"
    );

    showToast(
      `Lantern Road Reward | Lanternbound Seal | ${item?.name || "Fellowship consumable"}`
    );

    if (
      !newlyUnlocked
      && item
    ) {
      showTreasureReveal(
        reward.item_id
      );
    }
  }

  catch (error) {
    console.error(
      "Could not claim fellowship adventure reward:",
      error
    );

    showToast(
      "Adventure reward could not be claimed yet."
    );
  }

  finally {
    if (button) {
      button.disabled =
        false;

      button.textContent =
        "Claim Adventure Rewards";
    }
  }
}


async function beginPartyAdventure() {
  if (
    !supabaseReady
    || !supabaseUser
    || !currentParty
  ) {
    showToast(
      "The Fellowship is not connected."
    );
    return;
  }

  const button =
    $("#beginPartyAdventureButton");

  if (button) {
    button.disabled =
      true;

    button.textContent =
      "Lighting the Road…";
  }

  try {
    const {
      error
    } =
      await supabaseClient
        .from("party_adventures")
        .upsert(
          {
            party_id:
              currentParty.id,

            adventure_id:
              PARTY_ADVENTURE.id,

            started_by_user_id:
              supabaseUser.id
          },
          {
            onConflict:
              "party_id,adventure_id",

            ignoreDuplicates:
              true
          }
        );

    if (error) {
      throw error;
    }

    await refreshParty();

    showToast(
      "The Lantern Road has begun."
    );
  }

  catch (error) {
    console.error(
      "Could not begin fellowship adventure:",
      error
    );

    showToast(
      "The Fellowship could not begin the adventure."
    );
  }

  finally {
    if (button) {
      button.disabled =
        false;

      button.textContent =
        "Begin Fellowship Adventure";
    }
  }
}


function getPartyAdventureMemberQuestCount(
  member,
  activity,
  startedAtMs
) {
  const memberUserIds =
    Array.isArray(
      member.user_ids
    )
      ? member.user_ids
      : [
          member.user_id
        ];

  return (
    activity || []
  )
    .filter(
      item =>
        item.quest_id !== "boss"
        && (
          Date.parse(
            item.completed_at || ""
          ) || 0
        ) >= startedAtMs
        && (
          memberUserIds.includes(
            item.user_id
          )
          || (
            member.profile_id
            && item.profile_id
              === member.profile_id
          )
        )
    )
    .length;
}


function renderPartyAdventure(
  adventureRow,
  members,
  activity,
  rewardRow = null
) {
  const panel =
    $("#partyAdventurePanel");

  if (!panel) {
    return;
  }

  const startButton =
    $("#beginPartyAdventureButton");

  const contributionBox =
    $("#partyAdventureContributions");

  const route =
    $("#partyAdventureRoute");

  const progressText =
    $("#partyAdventureProgress");

  const objectiveText =
    $("#partyAdventureObjective");

  const progressBar =
    $("#partyAdventureBar");

  const status =
    $("#partyAdventureStatus");

  const narrative =
    $("#partyAdventureNarrative");

  const rewardSummary =
    $("#partyAdventureRewardSummary");

  const rewardButton =
    $("#claimPartyAdventureRewardButton");

  if (
    !route
    || !progressText
    || !objectiveText
    || !progressBar
    || !status
    || !narrative
  ) {
    return;
  }

  const safeMembers =
    Array.isArray(members)
      ? members
      : [];

  if (!adventureRow) {
    status.textContent =
      "Not Begun";

    narrative.textContent =
      PARTY_ADVENTURE.intro;

    progressText.textContent =
      `0 / ${PARTY_ADVENTURE.stages.length} stages`;

    objectiveText.textContent =
      "The road is waiting.";

    progressBar.style.width =
      "0%";

    if (startButton) {
      startButton.hidden =
        false;
    }

    if (rewardSummary) {
      rewardSummary.textContent =
        PARTY_ADVENTURE.rewardCopy;
    }

    if (rewardButton) {
      rewardButton.hidden =
        true;
    }

    if (contributionBox) {
      contributionBox.hidden =
        true;

      contributionBox.innerHTML =
        "";
    }

    route.innerHTML =
      PARTY_ADVENTURE.stages
        .map(
          stage => `
            <article class="party-adventure-stage is-locked">
              <span class="party-adventure-node">
                ${stage.numeral}
              </span>
              <div>
                <strong>${escapeHtml(stage.title)}</strong>
                <p>${escapeHtml(stage.copy)}</p>
                <small>Awaiting the Fellowship.</small>
              </div>
            </article>
          `
        )
        .join("");

    return;
  }

  if (startButton) {
    startButton.hidden =
      true;
  }

  const startedAtMs =
    Date.parse(
      adventureRow.started_at || ""
    ) || 0;

  const adventureActivity =
    (
      activity || []
    )
      .filter(
        item =>
          (
            Date.parse(
              item.completed_at || ""
            ) || 0
          ) >= startedAtMs
      );

  const normalActivity =
    adventureActivity
      .filter(
        item =>
          item.quest_id !== "boss"
      );

  const bossActivity =
    adventureActivity
      .filter(
        item =>
          item.quest_id === "boss"
      );

  const contributions =
    safeMembers
      .map(
        member => ({
          name:
            member.display_name
            || member.profile_id
            || "Companion",

          count:
            getPartyAdventureMemberQuestCount(
              member,
              activity,
              startedAtMs
            )
        })
      );

  const hasMembers =
    contributions.length > 0;

  const everyMemberHasOne =
    hasMembers
    && contributions.every(
      item =>
        item.count >= 1
    );

  const everyMemberHasTwo =
    hasMembers
    && contributions.every(
      item =>
        item.count >= 2
    );

  const crossingTarget =
    Math.max(
      4,
      safeMembers.length * 2
    );

  const finalQuestTarget =
    Math.max(
      6,
      safeMembers.length * 3
    );

  const stageDone = [
    everyMemberHasOne,
    everyMemberHasOne
      && normalActivity.length
        >= crossingTarget,
    everyMemberHasOne
      && normalActivity.length
        >= crossingTarget
      && everyMemberHasTwo,
    everyMemberHasOne
      && normalActivity.length
        >= crossingTarget
      && everyMemberHasTwo
      && normalActivity.length
        >= finalQuestTarget
      && bossActivity.length
        >= 1
  ];

  const completedStages =
    stageDone.filter(Boolean)
      .length;

  const complete =
    completedStages
    >= PARTY_ADVENTURE.stages.length;

  const currentStageIndex =
    complete
      ? PARTY_ADVENTURE.stages.length
      : stageDone.findIndex(
          done =>
            !done
        );

  const contributionText =
    contributions
      .map(
        item =>
          `${item.name}: ${item.count}`
      )
      .join(" · ");

  if (contributionBox) {
    contributionBox.hidden =
      contributions.length === 0;

    contributionBox.innerHTML =
      contributions
        .map(
          item => `
            <span>
              <strong>${escapeHtml(item.name)}</strong>
              <small>${item.count} quest${item.count === 1 ? "" : "s"}</small>
            </span>
          `
        )
        .join("");
  }

  const objectives = [
    `Each companion completes 1 quest — ${contributionText || "waiting for companions"}`,
    `Complete ${crossingTarget} fellowship quests — ${Math.min(normalActivity.length, crossingTarget)} / ${crossingTarget}`,
    `Each companion reaches 2 quests — ${contributionText || "waiting for companions"}`,
    `Reach ${finalQuestTarget} quests and defeat a boss — ${Math.min(normalActivity.length, finalQuestTarget)} / ${finalQuestTarget} quests · ${bossActivity.length ? "boss defeated" : "boss still standing"}`
  ];

  route.innerHTML =
    PARTY_ADVENTURE.stages
      .map(
        (
          stage,
          index
        ) => {
          const done =
            Boolean(
              stageDone[index]
            );

          const current =
            !complete
            && index
              === currentStageIndex;

          const className =
            done
              ? "is-complete"
              : current
                ? "is-current"
                : "is-locked";

          return `
            <article class="party-adventure-stage ${className}">
              <span class="party-adventure-node">
                ${done ? "✓" : stage.numeral}
              </span>

              <div>
                <strong>${escapeHtml(stage.title)}</strong>
                <p>${escapeHtml(stage.copy)}</p>
                <small>
                  ${done ? "Stage complete." : escapeHtml(objectives[index])}
                </small>
              </div>
            </article>
          `;
        }
      )
      .join("");

  progressText.textContent =
    `${completedStages} / ${PARTY_ADVENTURE.stages.length} stages`;

  progressBar.style.width =
    `${Math.round(
      completedStages
      / PARTY_ADVENTURE.stages.length
      * 100
    )}%`;

  if (complete) {
    status.textContent =
      rewardRow
        ? "Rewards Claimed"
        : "Road Cleared";

    narrative.textContent =
      PARTY_ADVENTURE.completed;

    objectiveText.textContent =
      rewardRow
        ? "The road is cleared and your spoils are secured."
        : "The Fellowship completed The Lantern Road.";

    if (rewardRow) {
      const rewardItem =
        PARTY_TREASURES[
          rewardRow.item_id
        ];

      if (rewardSummary) {
        rewardSummary.textContent =
          `Claimed: Lanternbound Seal + ${rewardItem?.name || "Fellowship consumable"}.`;
      }

      if (rewardButton) {
        rewardButton.hidden =
          true;
      }

      unlockRelicById(
        PARTY_ADVENTURE.relicId,
        {
          reveal:
            false
        }
      );
    }

    else {
      if (rewardSummary) {
        rewardSummary.textContent =
          PARTY_ADVENTURE.rewardCopy;
      }

      if (rewardButton) {
        rewardButton.hidden =
          false;
      }
    }
  }

  else {
    if (rewardSummary) {
      rewardSummary.textContent =
        PARTY_ADVENTURE.rewardCopy;
    }

    if (rewardButton) {
      rewardButton.hidden =
        true;
    }
    const currentStage =
      PARTY_ADVENTURE.stages[
        currentStageIndex
      ];

    status.textContent =
      `Stage ${currentStageIndex + 1} of ${PARTY_ADVENTURE.stages.length}`;

    narrative.textContent =
      currentStage.copy;

    objectiveText.textContent =
      objectives[
        currentStageIndex
      ];
  }
}


// =========================================================
// 58. RENDER PARTY MEMBERS
// =========================================================

function getPartyMemberProgress(member, activity) {
  const memberUserIds =
    Array.isArray(
      member.user_ids
    )
      ? member.user_ids
      : [
          member.user_id
        ];

  const isCurrentPlayer =
    Boolean(
      member.profile_id ===
        activeProfileId
      && memberUserIds.some(
        isLogicalUserId
      )
    );

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

  const memberActivity =
    (activity || [])
      .filter(
        item =>
          memberUserIds.includes(
            item.user_id
          )
          || (
            member.profile_id
            && item.profile_id
              === member.profile_id
          )
      );

  let strengthXp = 0;
  let enduranceXp = 0;
  let restorationXp = 0;

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
        Number(
          item.xp
        ) || 0
      );

    if (
      quest?.xpType
      === "strength"
    ) {
      strengthXp += xp;
    }

    else if (
      quest?.xpType
      === "endurance"
    ) {
      enduranceXp += xp;
    }

    else if (
      quest?.xpType
      === "restoration"
    ) {
      restorationXp += xp;
    }
  }

  const weeklyQuests =
    memberActivity
      .filter(
        item =>
          item.week_key
            === getWeekKey()
          && item.quest_id
            !== "boss"
      )
      .length;

  const totalXp =
    memberActivity
      .reduce(
        (
          total,
          item
        ) =>
          total
          + Math.max(
            0,
            Number(
              item.xp
            ) || 0
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


function renderPartyMembers(members, activity) {
  const container = $("#partyMembers");

  if (!container) return;

  partyMemberProfileCache.clear();

  if (members.length === 0) {
    container.innerHTML = `<p class="muted">No companions found.</p>`;
    return;
  }

  const currentWeek = getWeekKey();

  container.innerHTML = members.map(member => {
    const memberUserIds =
      Array.isArray(
        member.user_ids
      )
        ? member.user_ids
        : [
            member.user_id
          ];

    const isCurrentPlayer =
      Boolean(
        member.profile_id ===
          activeProfileId
        && memberUserIds.some(
          isLogicalUserId
        )
      );

    const memberProfileId = normalizeProfileId(member.profile_id)
      || (isCurrentPlayer ? activeProfileId : null);

    const character = memberProfileId
      ? CHARACTER_PROFILES[memberProfileId]
      : null;

    const displayName = member.display_name
      || character?.defaultName
      || "Adventurer";

    const className = member.class_name
      || character?.className
      || "Unknown Class";

    const progress = getPartyMemberProgress(member, activity);

    partyMemberProfileCache.set(String(member.user_id), {
      ...member,
      profile_id: memberProfileId,
      display_name: displayName,
      class_name: className,
      progress
    });

    const weeklyGold = activity
      .filter(item =>
        memberUserIds.includes(
          item.user_id
        )
        && item.week_key === currentWeek
      )
      .reduce((total, item) => total + (Number(item.gold) || 0), 0);

    const portraitMarkup = character?.card
      ? `<button class="party-member-portrait-button" type="button" data-party-profile-user-id="${escapeHtml(member.user_id)}" aria-label="View ${escapeHtml(displayName)} character profile"><img class="party-member-portrait" src="${escapeHtml(character.card)}" alt=""></button>`
      : `<button class="party-member-portrait-button" type="button" data-party-profile-user-id="${escapeHtml(member.user_id)}" aria-label="View ${escapeHtml(displayName)} character profile"><span class="party-member-avatar" aria-hidden="true">${escapeHtml(displayName.charAt(0).toUpperCase())}</span></button>`;

    return `
      <article class="party-member-card">
        ${portraitMarkup}
        <div class="party-member-info">
          <strong>${escapeHtml(displayName)}</strong>
          <span>${escapeHtml(className)}</span>
          <small>${progress.weeklyQuests} quest${progress.weeklyQuests === 1 ? "" : "s"} this week · ${progress.totalXp} total XP</small>
        </div>
        <div class="party-member-score">
          <strong>${weeklyGold}g</strong>
          <span>earned</span>
          ${isCurrentPlayer
            ? `<small class="party-self-label">You</small>`
            : `<button class="party-gift-button" type="button" data-gift-user-id="${escapeHtml(member.user_id)}" data-gift-name="${escapeHtml(displayName)}">Gift</button>`}
        </div>
      </article>`;
  }).join("");
}


function renderPartyProfileStat(type, xp) {
  const levelData = getLevelData(xp);
  const key = type.charAt(0).toUpperCase() + type.slice(1);
  const level = $(`#partyProfile${key}Level`);
  const bar = $(`#partyProfile${key}Bar`);
  const xpText = $(`#partyProfile${key}Xp`);

  if (level) level.textContent = `Lv. ${levelData.level}`;
  if (bar) bar.style.width = `${levelData.progress}%`;
  if (xpText) xpText.textContent = `${Math.max(0, Number(xp) || 0)} XP`;
}


function openPartyCharacterDialog(userId) {
  const member = partyMemberProfileCache.get(String(userId));

  if (!member) return;

  const profileId = normalizeProfileId(member.profile_id);
  const character = profileId ? CHARACTER_PROFILES[profileId] : null;
  const displayName = member.display_name || character?.defaultName || "Adventurer";
  const className = member.class_name || character?.className || "Unknown Class";
  const dialog = $("#partyCharacterDialog");

  if (!dialog) return;

  dialog.dataset.profileId =
    profileId || "";

  const nameEl = $("#partyCharacterDialogName");
  const classEl = $("#partyCharacterDialogClass");
  const descEl = $("#partyCharacterDialogDescription");

  if (nameEl) nameEl.textContent = displayName;
  if (classEl) classEl.textContent = className;

  if (descEl) {
    descEl.textContent =
      character?.description
      || "A companion of the fellowship, carving a legend one completed quest at a time.";
  }

  const image = $("#partyCharacterDialogImage");

  if (image) {
    if (character?.card) {
      image.src = character.card;
      image.alt = `${displayName} — ${className}`;
      image.hidden = false;
    }

    else {
      image.removeAttribute("src");
      image.alt = "";
      image.hidden = true;
    }
  }

  const progress = member.progress || {
    strengthXp: 0,
    enduranceXp: 0,
    restorationXp: 0,
    weeklyQuests: 0,
    totalQuests: 0,
    totalXp: 0
  };

  renderPartyProfileStat("strength", progress.strengthXp);
  renderPartyProfileStat("endurance", progress.enduranceXp);
  renderPartyProfileStat("restoration", progress.restorationXp);

  const weekly = $("#partyProfileWeeklyQuests");
  const total = $("#partyProfileTotalQuests");
  const totalXp = $("#partyProfileTotalXp");

  if (weekly) weekly.textContent = progress.weeklyQuests;
  if (total) total.textContent = progress.totalQuests;
  if (totalXp) totalXp.textContent = progress.totalXp;

  if (!dialog.open) dialog.showModal();
}


function closePartyCharacterDialog() {
  const dialog = $("#partyCharacterDialog");

  if (dialog?.open) {
    dialog.close();
  }
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
    || isLogicalUserId(
      userId
    )
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
      `Gift Sent | ${recipientName} received ${amount} ${capitalize(
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
        .in(
          "recipient_user_id",
          getLogicalUserIds()
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
        .in(
          "recipient_user_id",
          getLogicalUserIds()
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
      `Gift Received | ${gift.sender_display_name} sent you ${gift.amount} ${currencyName}!`
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
    `Gifts Received | ${parts.join(
      " | "
    )}`
  );
}


// =========================================================
// PARTY CONSUMABLE TREASURE
// =========================================================

async function fetchPartyTreasureInventory() {
  if (
    !currentParty
    || !supabaseUser
  ) {
    return [];
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from(
        "party_treasure_inventory"
      )
      .select(
        "user_id, item_id, quantity"
      )
      .eq(
        "party_id",
        currentParty.id
      )
      .in(
        "user_id",
        getLogicalUserIds()
      )
      .gt(
        "quantity",
        0
      );

  if (error) {
    throw error;
  }

  const totals =
    new Map();

  for (
    const row
    of data || []
  ) {
    totals.set(
      row.item_id,
      (
        totals.get(
          row.item_id
        )
        || 0
      )
      + (
        Number(
          row.quantity
        )
        || 0
      )
    );
  }

  return Array.from(
    totals.entries()
  )
    .map(
      (
        [
          item_id,
          quantity
        ]
      ) => ({
        item_id,
        quantity
      })
    );
}


async function fetchPartyBonusProgress() {
  if (!currentParty) {
    return 0;
  }

  const {
    data,
    error
  } =
    await supabaseClient
      .from("party_weekly_bonuses")
      .select(
        "bonus_progress"
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

  return (
    Number(
      data?.bonus_progress
    )
    || 0
  );
}


function renderPartyTreasure(
  inventory
) {
  const grid =
    $("#partyTreasureGrid");

  if (!grid) {
    return;
  }

  const total =
    inventory.reduce(
      (
        sum,
        row
      ) =>
        sum
        + (
          Number(
            row.quantity
          )
          || 0
        ),
      0
    );

  $("#partyTreasureTotal")
    .textContent =
      `${total} item${
        total === 1
          ? ""
          : "s"
      }`;

  if (!inventory.length) {
    grid.innerHTML =
      `
        <p class="muted">
          No consumable treasure yet.
        </p>
      `;

    return;
  }

  grid.innerHTML =
    inventory
      .map(
        row => {
          const item =
            PARTY_TREASURES[
              row.item_id
            ];

          if (!item) {
            return "";
          }

          return `
            <article
              class="party-treasure-card"
            >

              <div
                class="party-treasure-glyph"
              >
                ${escapeHtml(
                  item.glyph
                )}
              </div>

              <div
                class="party-treasure-info"
              >

                <strong>
                  ${escapeHtml(
                    item.name
                  )}
                  x${Number(
                    row.quantity
                  ) || 0}
                </strong>

                <span>
                  ${escapeHtml(
                    item.description
                  )}
                </span>

                <small>
                  ${escapeHtml(
                    item.rarity
                  )}
                </small>

              </div>

              <button
                class="party-treasure-use"
                type="button"
                data-use-treasure="${escapeHtml(
                  row.item_id
                )}"
              >
                Use
              </button>

            </article>
          `;
        }
      )
      .join("");
}


function showTreasureReveal(
  itemId
) {
  const item =
    PARTY_TREASURES[
      itemId
    ];

  if (!item) {
    return;
  }

  $("#treasureDialogGlyph")
    .textContent =
      item.glyph;

  $("#treasureDialogTitle")
    .textContent =
      item.name;

  $("#treasureDialogRarity")
    .textContent =
      item.rarity;

  $("#treasureDialogDescription")
    .textContent =
      item.description;

  if (
    !$("#treasureDialog")
      ?.open
  ) {
    $("#treasureDialog")
      .showModal();
  }
}


async function ensureWeeklyBossTreasureDrop(
  reveal = false
) {
  if (
    !currentParty
    || !supabaseUser
  ) {
    return null;
  }

  if (
    getDeviceSyncId()
    && !isPrimarySyncedIdentity()
  ) {
    return null;
  }

  const {
    data,
    error
  } =
    await supabaseClient.rpc(
      "award_party_boss_treasure",
      {
        supplied_party_id:
          currentParty.id,

        supplied_week_key:
          getWeekKey()
      }
    );

  if (error) {
    console.error(
      "Party treasure award failed:",
      error
    );

    return null;
  }

  const result =
    Array.isArray(data)
      ? data[0]
      : data;

  if (
    result?.newly_awarded
    && reveal
  ) {
    showTreasureReveal(
      result.item_id
    );
  }

  return result;
}


async function usePartyTreasure(
  itemId
) {
  const item = PARTY_TREASURES[itemId];

  if (partyTreasureUsing || !item || !currentParty) return;

  const effectStateKey = getConsumableEffectStateKey(item.effectType);

  if (effectStateKey) {
    const activeEffects = getActiveConsumableEffects(getState());
    if (activeEffects[effectStateKey]) {
      showToast(item.name + " is already prepared.");
      return;
    }
  }

  if (item.effectType === "road-encounter" && (pendingEncounter || $("#encounterDialog")?.open)) {
    showToast("Finish the current road encounter first.");
    return;
  }

  partyTreasureUsing = true;

  try {
    const { data, error } = await supabaseClient.rpc(
      "use_party_treasure",
      {
        supplied_party_id: currentParty.id,
        supplied_item_id: itemId,
        supplied_week_key: getWeekKey()
      }
    );

    if (error) throw error;

    const returnedEffectType = data?.effect_type || item.effectType || "immediate";
    const returnedStateKey = getConsumableEffectStateKey(returnedEffectType);

    if (returnedStateKey) {
      const state = getState();
      state.activeConsumableEffects = getActiveConsumableEffects(state);
      state.activeConsumableEffects[returnedStateKey] = true;
      saveState(state);
      showRewardBurst(item.name + " prepared");
    }

    if (returnedEffectType === "road-encounter") {
      openConsumableRoadEncounter();
    }

    await checkIncomingGifts();
    await refreshParty();

    showToast(data?.message || (item.name + " used."));
  }
  catch (error) {
    console.error("Treasure could not be used:", error);
    showToast("That treasure could not be used.");
  }
  finally {
    partyTreasureUsing = false;
  }
}


// =========================================================
// 63. PARTY CHALLENGE
// =========================================================

function renderPartyChallenge(
  activity,
  memberCount,
  bonusProgress = 0
) {
  const currentWeek =
    getWeekKey();

  const settings =
    getSettings();

  const personalGoal =
    Number(
      settings.weeklyGoal
    )
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
    weeklyActivity.length
    + bonusProgress;

  const percent =
    Math.min(
      100,
      (
        completed
        / partyGoal
      )
      * 100
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
    completed >= partyGoal
  ) {
    $("#partyChallengeStatus")
      .textContent =
        "Challenge conquered.";

    unlockRelicById(
      "fellowship-pin",
      {
        reveal:
          appInitialized
      }
    );
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
// 64. PARTY ACTIVITY
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
              item.quest_id
              === "boss";

            return `
              <article
                class="party-activity-item"
              >

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
                  | +${item.xp} XP
                  | +${item.gold} Gold
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
          activeView
          === "party"
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

function showToast(
  message
) {
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
// 67A. PULL TO REFRESH
// =========================================================

let pullStartY = null;
let pullStartX = null;
let pullDistance = 0;
let pullRefreshing = false;

const PULL_THRESHOLD = 84;

function getCurrentBuildVersion() {
  return (
    document.querySelector(
      'meta[name="quest-board-build"]'
    )?.content
    || "0"
  );
}

async function checkForNewBuild() {
  const response =
    await fetch(
      `./index.html?update-check=${Date.now()}`,
      {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache"
        }
      }
    );

  if (!response.ok) {
    return {
      checked: false,
      updateAvailable: false
    };
  }

  const html =
    await response.text();

  const documentCopy =
    new DOMParser()
      .parseFromString(
        html,
        "text/html"
      );

  const latestBuild =
    documentCopy.querySelector(
      'meta[name="quest-board-build"]'
    )?.content
    || "0";

  const currentBuild =
    getCurrentBuildVersion();

  return {
    checked: true,
    currentBuild,
    latestBuild,
    updateAvailable:
      latestBuild !== "0"
      && latestBuild !== currentBuild
  };
}

function reloadLatestBuild(
  latestBuild
) {
  const url =
    new URL(
      window.location.href
    );

  url.searchParams.set(
    "build",
    latestBuild
  );

  url.searchParams.set(
    "refresh",
    Date.now()
  );

  window.location.replace(
    url.toString()
  );
}

function collectRefreshAssetUrls() {
  const urls =
    new Set();

  const addUrl =
    value => {
      if (!value) {
        return;
      }

      try {
        const url =
          new URL(
            value,
            document.baseURI
          );

        if (
          url.origin
          === window.location.origin
        ) {
          urls.add(
            url.href
          );
        }
      }

      catch {
        // Ignore malformed or unsupported asset URLs.
      }
    };

  addUrl("./index.html");

  document
    .querySelectorAll(
      [
        'link[rel="stylesheet"][href]',
        'link[rel~="icon"][href]',
        'script[src]',
        'img[src]',
        'source[src]'
      ].join(",")
    )
    .forEach(
      element => {
        addUrl(
          element.getAttribute("href")
          || element.getAttribute("src")
        );
      }
    );

  const collectRuleUrls =
    rules => {
      if (!rules) {
        return;
      }

      for (const rule of rules) {
        if (rule.cssRules) {
          collectRuleUrls(
            rule.cssRules
          );
        }

        const cssText =
          rule.cssText || "";

        for (
          const match
          of cssText.matchAll(
            /url\((?:["']?)([^)"']+)(?:["']?)\)/g
          )
        ) {
          addUrl(
            match[1]
          );
        }
      }
    };

  for (
    const sheet
    of Array.from(
      document.styleSheets
    )
  ) {
    if (sheet.href) {
      addUrl(
        sheet.href
      );
    }

    try {
      collectRuleUrls(
        sheet.cssRules
      );
    }

    catch {
      // Cross-origin stylesheets such as Google Fonts
      // intentionally block CSS rule inspection.
    }
  }

  return Array.from(
    urls
  );
}


async function refreshQuestBoardAssetCache() {
  const urls =
    collectRefreshAssetUrls();

  const results =
    await Promise.allSettled(
      urls.map(
        url =>
          fetch(
            url,
            {
              cache: "reload",
              credentials: "same-origin"
            }
          )
      )
    );

  return {
    total:
      results.length,

    refreshed:
      results.filter(
        result =>
          result.status
          === "fulfilled"
      ).length
  };
}


function resetPullRefresh() {
  pullStartY = null;
  pullStartX = null;
  pullDistance = 0;

  const indicator =
    $("#pullRefresh");

  indicator.classList.remove(
    "is-pulling",
    "is-ready"
  );

  indicator.style.removeProperty(
    "--pull-distance"
  );
}

function canStartPullRefresh(event) {
  return (
    !pullRefreshing
    && event.touches.length === 1
    && window.scrollY <= 0
    && !document.querySelector("dialog[open]")
    && !event.target.closest(
      "input, textarea, select, [contenteditable]"
    )
  );
}

document.addEventListener(
  "touchstart",
  event => {
    if (!canStartPullRefresh(event)) {
      return;
    }

    pullStartY = event.touches[0].clientY;
    pullStartX = event.touches[0].clientX;
  },
  { passive: true }
);

document.addEventListener(
  "touchmove",
  event => {
    if (
      pullStartY === null
      || event.touches.length !== 1
    ) {
      resetPullRefresh();
      return;
    }

    const deltaY =
      event.touches[0].clientY - pullStartY;

    const deltaX =
      event.touches[0].clientX - pullStartX;

    if (
      window.scrollY > 0
      || Math.abs(deltaX) > Math.abs(deltaY)
      || deltaY <= 12
    ) {
      if (deltaY < 0 || Math.abs(deltaX) > Math.abs(deltaY)) {
        resetPullRefresh();
      }
      return;
    }

    event.preventDefault();

    pullDistance = deltaY;

    const indicator =
      $("#pullRefresh");

    indicator.classList.add(
      "is-pulling"
    );

    indicator.classList.toggle(
      "is-ready",
      pullDistance >= PULL_THRESHOLD
    );

    indicator.style.setProperty(
      "--pull-distance",
      `${Math.min(92, deltaY * 0.7)}px`
    );

    $("#pullRefreshLabel").textContent =
      pullDistance >= PULL_THRESHOLD
        ? "Release to refresh"
        : "Pull to refresh";
  },
  { passive: false }
);

document.addEventListener(
  "touchend",
  async () => {
    const shouldRefresh =
      pullDistance >= PULL_THRESHOLD
      && !pullRefreshing;

    resetPullRefresh();

    if (!shouldRefresh) {
      return;
    }

    pullRefreshing = true;

    const indicator =
      $("#pullRefresh");

    indicator.classList.add(
      "is-refreshing"
    );

    $("#pullRefreshLabel").textContent =
      "Refreshing…";

    try {
      $("#pullRefreshLabel").textContent =
        "Checking for updates…";

      const buildCheck =
        await checkForNewBuild();

      $("#pullRefreshLabel").textContent =
        "Refreshing app cache…";

      await refreshQuestBoardAssetCache();

      const buildToLoad =
        buildCheck.latestBuild
        && buildCheck.latestBuild !== "0"
          ? buildCheck.latestBuild
          : getCurrentBuildVersion();

      $("#pullRefreshLabel").textContent =
        "Reloading Quest Board…";

      showToast(
        buildCheck.updateAvailable
          ? "New build found. Refreshing everything…"
          : "Refreshing Quest Board from the source…"
      );

      reloadLatestBuild(
        buildToLoad
      );

      return;
    }

    catch (error) {
      console.error("Pull refresh failed:", error);
      showToast("Could not refresh. Try again.");
    }

    finally {
      pullRefreshing = false;
      indicator.classList.remove("is-refreshing");
      $("#pullRefreshLabel").textContent =
        "Pull to refresh";
    }
  },
  { passive: true }
);

document.addEventListener(
  "touchcancel",
  resetPullRefresh,
  { passive: true }
);


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

$("#profileButton")
  ?.addEventListener(
    "click",
    () => setView("character")
  );

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

$("#questChainButton")?.addEventListener("click", openCurrentStoryQuest);
$("#claimEncounterButton")?.addEventListener("click", claimEncounter);
$("#beginAdventureButton")?.addEventListener("click",()=>{const s=getState();s.onboardingComplete=true;saveState(s);$("#onboardingDialog")?.close();showToast("Campaign I: The Blackwood begins.");});
$("#npcGrid")?.addEventListener("click",e=>{const b=e.target.closest("[data-npc-id]");if(!b)return;const n=NPCS.find(x=>x.id===b.dataset.npcId);if(!n)return;$("#npcDialogue").innerHTML=`<strong>${escapeHtml(n.name)}</strong><p>${escapeHtml(n.dialogue)}</p>`;playUiSound("open");});
$("#equipmentInventory")?.addEventListener("click",e=>{const b=e.target.closest("[data-equip-relic]");if(b)equipRelic(b.dataset.equipRelic);});
$("#equipmentSlots")?.addEventListener("click",e=>{const b=e.target.closest("[data-equipment-slot]");if(!b)return;const id=getState().equippedRelics[b.dataset.equipmentSlot];if(id)equipRelic(id);});

$("#createAccountButton")
  ?.addEventListener(
    "click",
    createPermanentAccount
  );

$("#signInAccountButton")
  ?.addEventListener(
    "click",
    signInPermanentAccount
  );

$("#forgotPasswordButton")
  ?.addEventListener(
    "click",
    requestPasswordReset
  );

$("#changePasswordButton")
  ?.addEventListener(
    "click",
    openPasswordRecoveryDialog
  );

$("#saveNewPasswordButton")
  ?.addEventListener(
    "click",
    saveNewAccountPassword
  );

$("#signOutAccountButton")
  ?.addEventListener(
    "click",
    signOutPermanentAccount
  );

$("#uploadDeviceSaveButton")
  ?.addEventListener(
    "click",
    uploadCurrentDeviceSave
  );

$("#loadCloudSaveButton")
  ?.addEventListener(
    "click",
    loadCloudSaveToThisDevice
  );

$("#startDeviceSyncButton")
  ?.addEventListener(
    "click",
    generateDeviceSyncPairCode
  );

$("#joinDeviceSyncButton")
  ?.addEventListener(
    "click",
    joinDeviceSync
  );

$("#deviceSyncCodeInput")
  ?.addEventListener(
    "keydown",
    event => {
      if (
        event.key
        === "Enter"
      ) {
        joinDeviceSync();
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
        event.key
        === "Enter"
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

$("#beginPartyAdventureButton")
  ?.addEventListener(
    "click",
    beginPartyAdventure
  );

$("#claimPartyAdventureRewardButton")
  ?.addEventListener(
    "click",
    claimPartyAdventureReward
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

$("#closePartyCharacterButton")
  ?.addEventListener(
    "click",
    closePartyCharacterDialog
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
        event.key
        === "Enter"
      ) {
        sendPartyGift();
      }
    }
  );

$("#partyTreasureGrid")
  ?.addEventListener(
    "click",
    event => {
      const button =
        event.target.closest(
          "[data-use-treasure]"
        );

      if (button) {
        usePartyTreasure(
          button.dataset
            .useTreasure
        );
      }
    }
  );

$("#closeTreasureButton")
  ?.addEventListener(
    "click",
    () =>
      $("#treasureDialog")
        ?.close()
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
        button.dataset
          .relicFilter
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
      event.key
      !== "Escape"
    ) {
      return;
    }

    if (
      $("#weekConqueredDialog")
        ?.open
      || $("#bossDefeatedDialog")
        ?.open
    ) {
      event.preventDefault();
      return;
    }

    if (
      $("#relicDialog")
        ?.open
    ) {
      closeRelicDialog();
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
      $("#partyCharacterDialog")
        ?.open
    ) {
      closePartyCharacterDialog();
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
      $("#historyDialog")
        ?.open
    ) {
      closeHistory();
    }
  }
);


document.addEventListener(
  "visibilitychange",
  () => {
    if (
      document.visibilityState
        !== "visible"
    ) {
      return;
    }

    if (
      activeQuest
      && $("#questDialog")
        ?.open
    ) {
      restoreTimerForQuest(
        activeQuest.id
      );
    }

    void refreshWorldAtmosphere();
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
// 75A. BOARD LIVE WEATHER ATMOSPHERE
// =========================================================

const WORLD_WEATHER_REFRESH_MS =
  15 * 60 * 1000;

const WORLD_WEATHER_STALE_MS =
  3 * 60 * 60 * 1000;

let worldWeatherRefreshTimer = null;
let lastWorldWeatherSyncAt = 0;
let octoberRavenTimer = null;
let atmosphereLightningTimer = null;
let octoberRavenHasSpawned = false;
let octoberLightningHasFlashed = false;

const OCTOBER_RAVEN_MIN_DELAY_MS =
  9 * 1000;

const OCTOBER_RAVEN_MAX_DELAY_MS =
  28 * 1000;

const OCTOBER_LIGHTNING_MIN_DELAY_MS =
  26 * 1000;

const OCTOBER_LIGHTNING_MAX_DELAY_MS =
  74 * 1000;

function getWorldSeason(date = new Date()) {
  const month = date.getMonth();

  if (month === 11 || month <= 1) {
    return "winter";
  }

  if (month <= 4) {
    return "spring";
  }

  if (month <= 7) {
    return "summer";
  }

  return "autumn";
}

function getAtmosphereTestOverrides() {
  const params =
    new URLSearchParams(
      window.location.search
    );

  const season =
    params.get("season");

  const weather =
    params.get("weather");

  const daypart =
    params.get("daypart");

  const validSeasons =
    new Set([
      "spring",
      "summer",
      "autumn",
      "winter"
    ]);

  const validWeather =
    new Set([
      "seasonal",
      "clear",
      "cloudy",
      "fog",
      "rain",
      "snow",
      "storm"
    ]);

  const validDayparts =
    new Set([
      "dawn",
      "day",
      "dusk",
      "night"
    ]);

  return {
    season:
      validSeasons.has(season)
        ? season
        : null,
    weather:
      validWeather.has(weather)
        ? weather
        : null,
    daypart:
      validDayparts.has(daypart)
        ? daypart
        : null
  };
}

function getWorldDaypart(date = new Date()) {
  const hour = date.getHours();

  if (hour < 6 || hour >= 20) {
    return "night";
  }

  if (hour < 9) {
    return "dawn";
  }

  if (hour < 18) {
    return "day";
  }

  return "dusk";
}

function getWorldWeatherMode(
  condition = "",
  updatedAt = null
) {
  const updatedTime =
    updatedAt
      ? Date.parse(updatedAt)
      : Number.NaN;

  const weatherIsStale =
    Number.isFinite(updatedTime)
    && (
      Date.now() - updatedTime
        > WORLD_WEATHER_STALE_MS
    );

  if (
    !condition
    || weatherIsStale
  ) {
    return "seasonal";
  }

  const normalized =
    String(condition)
      .toLowerCase();

  if (
    /thunder|lightning|storm/.test(
      normalized
    )
  ) {
    return "storm";
  }

  if (
    /snow|sleet|flurr|blizzard|ice pellet/.test(
      normalized
    )
  ) {
    return "snow";
  }

  if (
    /rain|drizzle|shower/.test(
      normalized
    )
  ) {
    return "rain";
  }

  if (
    /fog|mist|haze|smoke/.test(
      normalized
    )
  ) {
    return "fog";
  }

  if (
    /cloud|overcast/.test(
      normalized
    )
  ) {
    return "cloudy";
  }

  return "clear";
}

function getWeatherParticlePlan(
  season,
  weather,
  daypart
) {
  if (weather === "storm") {
    return {
      kind: "rain",
      count: 42
    };
  }

  if (weather === "rain") {
    return {
      kind: "rain",
      count: 32
    };
  }

  if (weather === "snow") {
    return {
      kind: "snow",
      count: 28
    };
  }

  if (weather === "fog") {
    return {
      kind: null,
      count: 0
    };
  }

  if (season === "autumn") {
    return {
      kind: "leaf",
      count:
        weather === "cloudy"
          ? 11
          : 17
    };
  }

  if (season === "winter") {
    return {
      kind: "frost",
      count:
        weather === "cloudy"
          ? 10
          : 15
    };
  }

  if (season === "spring") {
    return {
      kind: "petal",
      count:
        weather === "cloudy"
          ? 8
          : 13
    };
  }

  if (
    season === "summer"
    && daypart === "night"
  ) {
    return {
      kind: "firefly",
      count: 15
    };
  }

  return {
    kind: "mote",
    count: 14
  };
}

function createWeatherParticle(kind) {
  const particle =
    document.createElement("span");

  particle.className =
    `weather-particle weather-particle--${kind}`;

  particle.style.setProperty(
    "--x",
    `${(Math.random() * 100).toFixed(2)}%`
  );

  particle.style.setProperty(
    "--drift",
    `${Math.round(
      (Math.random() * 120) - 60
    )}px`
  );

  particle.style.setProperty(
    "--rot",
    `${Math.round(
      Math.random() * 180
    )}deg`
  );

  let duration = 12;
  let size = 8;
  let opacity = .68;

  if (kind === "rain") {
    duration =
      .55 + Math.random() * .80;
    size =
      14 + Math.random() * 30;
    opacity =
      .28 + Math.random() * .52;

    particle.style.setProperty(
      "--thickness",
      `${(.9 + Math.random() * 1.4).toFixed(2)}px`
    );
  }

  else if (kind === "snow") {
    duration =
      6 + Math.random() * 12;
    size =
      2 + Math.random() * 8;
    opacity =
      .38 + Math.random() * .54;
  }

  else if (kind === "frost") {
    duration =
      13 + Math.random() * 8;
    size =
      2 + Math.random() * 4;
    opacity =
      .18 + Math.random() * .28;
  }

  else if (kind === "leaf") {
    duration =
      14 + Math.random() * 16;
    size =
      7 + Math.random() * 13;
    opacity =
      .48 + Math.random() * .38;

    const windBias =
      (Math.random() * 170) - 85;

    const driftOne =
      (windBias * .34)
      + ((Math.random() * 34) - 17);

    const driftTwo =
      windBias
      + ((Math.random() * 58) - 29);

    const driftThree =
      (windBias * .56)
      + ((Math.random() * 76) - 38);

    const spinDirection =
      Math.random() < .5
        ? -1
        : 1;

    const spinOne =
      spinDirection
      * (65 + Math.random() * 125);

    const spinTwo =
      spinOne
      + spinDirection
        * (95 + Math.random() * 180);

    const spinThree =
      spinTwo
      + spinDirection
        * (110 + Math.random() * 240);

    particle.style.setProperty(
      "--leaf-drift-1",
      `${driftOne.toFixed(1)}px`
    );

    particle.style.setProperty(
      "--leaf-drift-2",
      `${driftTwo.toFixed(1)}px`
    );

    particle.style.setProperty(
      "--leaf-drift-3",
      `${driftThree.toFixed(1)}px`
    );

    particle.style.setProperty(
      "--leaf-spin-1",
      `${spinOne.toFixed(1)}deg`
    );

    particle.style.setProperty(
      "--leaf-spin-2",
      `${spinTwo.toFixed(1)}deg`
    );

    particle.style.setProperty(
      "--leaf-spin-3",
      `${spinThree.toFixed(1)}deg`
    );

    const leafTilt =
      28 + Math.random() * 66;

    particle.style.setProperty(
      "--leaf-tilt",
      `${leafTilt.toFixed(1)}deg`
    );

    particle.style.setProperty(
      "--leaf-tilt-reverse",
      `${(-leafTilt * .58).toFixed(1)}deg`
    );

    particle.style.setProperty(
      "--leaf-drift-2-soft",
      `${(driftTwo * .36).toFixed(1)}px`
    );

    particle.style.setProperty(
      "--leaf-drift-3-soft",
      `${(driftThree * .64).toFixed(1)}px`
    );

    particle.style.setProperty(
      "--leaf-depth",
      (
        .74 + Math.random() * .42
      ).toFixed(2)
    );

    particle.style.setProperty(
      "--leaf-blur",
      `${(
        Math.random() * .42
      ).toFixed(2)}px`
    );

    const leafShapes = [
      "leaf-maple",
      "leaf-oak",
      "leaf-teardrop",
      "leaf-long"
    ];

    const leafPalettes = [
      [
        "rgba(210, 34, 40, .99)",
        "rgba(152, 17, 26, .98)",
        "rgba(86, 10, 18, .96)"
      ],
      [
        "rgba(228, 108, 28, .99)",
        "rgba(177, 73, 16, .98)",
        "rgba(108, 42, 10, .96)"
      ],
      [
        "rgba(244, 191, 58, .99)",
        "rgba(204, 142, 24, .98)",
        "rgba(128, 82, 12, .96)"
      ],
      [
        "rgba(199, 73, 26, .99)",
        "rgba(142, 42, 16, .98)",
        "rgba(88, 24, 10, .96)"
      ],
      [
        "rgba(232, 156, 42, .99)",
        "rgba(184, 108, 20, .98)",
        "rgba(110, 61, 12, .96)"
      ],
      [
        "rgba(186, 28, 36, .99)",
        "rgba(128, 14, 22, .98)",
        "rgba(72, 8, 14, .96)"
      ]
    ];

    const shape =
      leafShapes[
        Math.floor(
          Math.random() * leafShapes.length
        )
      ];

    const palette =
      leafPalettes[
        Math.floor(
          Math.random() * leafPalettes.length
        )
      ];

    particle.classList.add(shape);

    particle.style.setProperty(
      "--leaf-c1",
      palette[0]
    );

    particle.style.setProperty(
      "--leaf-c2",
      palette[1]
    );

    particle.style.setProperty(
      "--leaf-c3",
      palette[2]
    );
  }

  else if (kind === "petal") {
    duration =
      10 + Math.random() * 7;
    size =
      6 + Math.random() * 6;
    opacity =
      .34 + Math.random() * .36;
  }

  else if (kind === "firefly") {
    duration =
      4.5 + Math.random() * 5;
    size =
      2 + Math.random() * 3;
    opacity =
      .42 + Math.random() * .42;

    particle.style.setProperty(
      "--y",
      `${(
        28 + Math.random() * 58
      ).toFixed(2)}%`
    );
  }

  else {
    duration =
      11 + Math.random() * 8;
    size =
      2 + Math.random() * 4;
    opacity =
      .22 + Math.random() * .32;
  }

  particle.style.setProperty(
    "--dur",
    `${duration.toFixed(2)}s`
  );

  particle.style.setProperty(
    "--delay",
    `-${(
      Math.random() * duration
    ).toFixed(2)}s`
  );

  particle.style.setProperty(
    "--size",
    `${size.toFixed(2)}px`
  );

  particle.style.setProperty(
    "--opacity",
    opacity.toFixed(2)
  );

  return particle;
}

function getAtmosphereRandom(
  min,
  max
) {
  return min
    + Math.random() * (max - min);
}

function getOctoberRavenHost(
  atmosphere
) {
  let host =
    atmosphere.querySelector(
      ".weather-atmosphere__ravens"
    );

  if (!host) {
    host =
      document.createElement("div");

    host.className =
      "weather-atmosphere__ravens";

    atmosphere.appendChild(host);
  }

  return host;
}

function createRavenBird() {
  const bird =
    document.createElement("span");

  bird.className =
    "weather-raven__bird";

  const body =
    document.createElement("span");

  body.className =
    "weather-raven__body";

  const tail =
    document.createElement("span");

  tail.className =
    "weather-raven__tail";

  const leftWing =
    document.createElement("span");

  leftWing.className =
    "weather-raven__wing weather-raven__wing--left";

  const rightWing =
    document.createElement("span");

  rightWing.className =
    "weather-raven__wing weather-raven__wing--right";

  bird.append(
    tail,
    leftWing,
    rightWing,
    body
  );

  return bird;
}

function spawnOctoberRavenPass(
  atmosphere
) {
  const host =
    getOctoberRavenHost(
      atmosphere
    );

  const flockRoll =
    Math.random();

  const flockSize =
    flockRoll < .34
      ? 1
      : flockRoll < .72
        ? 2
        : flockRoll < .93
          ? 3
          : 4;

  const reverse =
    Math.random() < .46;

  const nav =
    document.querySelector(
      ".bottom-nav"
    );

  const navTop =
    nav
      ? nav.getBoundingClientRect().top
      : window.innerHeight * .88;

  const ravenMinY =
    1.5;

  const ravenMaxY =
    Math.max(
      ravenMinY + 8,
      (
        navTop
        / Math.max(
            window.innerHeight,
            1
          )
      ) * 100 - 6
    );

  const baseY =
    getAtmosphereRandom(
      ravenMinY,
      ravenMaxY
    );

  for (
    let index = 0;
    index < flockSize;
    index += 1
  ) {
    const raven =
      document.createElement("span");

    raven.className =
      `weather-raven ${(
        reverse
          ? "weather-raven--reverse"
          : "weather-raven--forward"
      )}`;

    const nearPass =
      flockSize === 1
      && Math.random() < .12;

    const ravenY =
      Math.min(
        ravenMaxY,
        Math.max(
          ravenMinY,
          baseY
          + getAtmosphereRandom(
              -3.8,
              3.8
            )
        )
      );

    const depth =
      Math.min(
        1,
        Math.max(
          0,
          (
            ravenY - ravenMinY
          )
          / Math.max(
              ravenMaxY - ravenMinY,
              1
            )
        )
      );

    const perspectiveSize =
      17
      + Math.pow(
          depth,
          1.18
        ) * 35;

    const size =
      perspectiveSize
      * getAtmosphereRandom(
          .88,
          1.14
        )
      * (
          nearPass
            ? getAtmosphereRandom(
                1.18,
                1.34
              )
            : 1
        );

    const duration =
      nearPass
        ? getAtmosphereRandom(
            5.8,
            7.4
          )
        : getAtmosphereRandom(
            7.6,
            12.2
          );

    const delay =
      index
      * getAtmosphereRandom(
        .16,
        .48
      );

    raven.style.setProperty(
      "--raven-y",
      `${ravenY.toFixed(2)}vh`
    );

    raven.style.setProperty(
      "--raven-size",
      `${size.toFixed(1)}px`
    );

    raven.style.setProperty(
      "--flight-duration",
      `${duration.toFixed(2)}s`
    );

    raven.style.setProperty(
      "--flight-delay",
      `${delay.toFixed(2)}s`
    );

    raven.style.setProperty(
      "--raven-opacity",
      Math.min(
        .92,
        .43
        + depth * .38
        + (
            nearPass
              ? .08
              : 0
          )
        + getAtmosphereRandom(
            -.04,
            .05
          )
      ).toFixed(2)
    );

    raven.style.setProperty(
      "--raven-blur",
      `${Math.max(
        0,
        (
          .46
          - depth * .40
          + getAtmosphereRandom(
              -.04,
              .08
            )
        )
      ).toFixed(2)}px`
    );

    raven.style.setProperty(
      "--wing-speed",
      `${getAtmosphereRandom(
        .34,
        .54
      ).toFixed(2)}s`
    );

    const ravenRise =
      getAtmosphereRandom(
        -4.4,
        2.6
      );

    raven.style.setProperty(
      "--raven-rise",
      `${ravenRise.toFixed(2)}vh`
    );

    raven.style.setProperty(
      "--raven-rise-1",
      `${(ravenRise * .34).toFixed(2)}vh`
    );

    raven.style.setProperty(
      "--raven-rise-2",
      `${(ravenRise * .72).toFixed(2)}vh`
    );

    raven.appendChild(
      createRavenBird()
    );

    host.appendChild(
      raven
    );

    window.setTimeout(
      () => {
        raven.remove();
      },
      Math.ceil(
        (duration + delay + 1.2)
        * 1000
      )
    );
  }
}

function triggerAtmosphereLightning(
  atmosphere
) {
  const flash =
    atmosphere.querySelector(
      ".weather-atmosphere__flash"
    );

  if (!flash) {
    return;
  }

  flash.style.setProperty(
    "--flash-x",
    `${getAtmosphereRandom(
      18,
      82
    ).toFixed(1)}%`
  );

  flash.style.setProperty(
    "--flash-strength",
    getAtmosphereRandom(
      .72,
      1
    ).toFixed(2)
  );

  flash.classList.remove(
    "is-lightning"
  );

  void flash.offsetWidth;

  flash.classList.add(
    "is-lightning"
  );

  window.setTimeout(
    () => {
      flash.classList.remove(
        "is-lightning"
      );
    },
    1100
  );
}

function scheduleOctoberRavens({
  atmosphere,
  enabled,
  weather
}) {
  if (octoberRavenTimer) {
    clearTimeout(
      octoberRavenTimer
    );

    octoberRavenTimer = null;
  }

  const host =
    getOctoberRavenHost(
      atmosphere
    );

  if (
    !enabled
    || weather === "storm"
    || weather === "rain"
    || weather === "snow"
  ) {
    host.replaceChildren();
    return;
  }

  const scheduleNext = () => {
    const delay =
      octoberRavenHasSpawned
        ? getAtmosphereRandom(
            OCTOBER_RAVEN_MIN_DELAY_MS,
            OCTOBER_RAVEN_MAX_DELAY_MS
          )
        : getAtmosphereRandom(
            4 * 1000,
            9 * 1000
          );

    octoberRavenTimer =
      window.setTimeout(
        () => {
          if (
            document.body.contains(
              atmosphere
            )
          ) {
            spawnOctoberRavenPass(
              atmosphere
            );

            octoberRavenHasSpawned =
              true;
          }

          scheduleNext();
        },
        delay
      );
  };

  scheduleNext();
}

function scheduleAtmosphereLightning({
  atmosphere,
  enabled,
  weather
}) {
  if (atmosphereLightningTimer) {
    clearTimeout(
      atmosphereLightningTimer
    );

    atmosphereLightningTimer = null;
  }

  const flash =
    atmosphere.querySelector(
      ".weather-atmosphere__flash"
    );

  if (!enabled) {
    flash?.classList.remove(
      "is-lightning"
    );

    return;
  }

  const scheduleNext = () => {
    let minDelay =
      OCTOBER_LIGHTNING_MIN_DELAY_MS;

    let maxDelay =
      OCTOBER_LIGHTNING_MAX_DELAY_MS;

    if (weather === "storm") {
      minDelay =
        9 * 1000;

      maxDelay =
        28 * 1000;
    }

    else if (
      weather === "rain"
      || weather === "cloudy"
    ) {
      minDelay =
        18 * 1000;

      maxDelay =
        52 * 1000;
    }

    const delay =
      octoberLightningHasFlashed
        ? getAtmosphereRandom(
            minDelay,
            maxDelay
          )
        : getAtmosphereRandom(
            7 * 1000,
            15 * 1000
          );

    atmosphereLightningTimer =
      window.setTimeout(
        () => {
          if (
            document.body.contains(
              atmosphere
            )
          ) {
            triggerAtmosphereLightning(
              atmosphere
            );

            octoberLightningHasFlashed =
              true;
          }

          scheduleNext();
        },
        delay
      );
  };

  scheduleNext();
}

function syncAtmosphereAmbientEvents({
  atmosphere,
  season,
  weather,
  now,
  testOverrides,
  reduceMotion
}) {
  const octoberMode =
    season === "autumn"
    && (
      now.getMonth() === 9
      || testOverrides.season
        === "autumn"
    );

  atmosphere.dataset.october =
    octoberMode
      ? "true"
      : "false";

  scheduleOctoberRavens({
    atmosphere,
    enabled:
      octoberMode
      && !reduceMotion,
    weather
  });

  scheduleAtmosphereLightning({
    atmosphere,
    enabled:
      !reduceMotion
      && (
        octoberMode
        || weather === "storm"
      ),
    weather
  });
}

function renderWorldAtmosphere({
  condition = "",
  updatedAt = null
} = {}) {
  const atmosphere =
    document.getElementById(
      "weatherAtmosphere"
    );

  const particleHost =
    document.getElementById(
      "weatherParticles"
    );

  if (
    !atmosphere
    || !particleHost
  ) {
    return;
  }

  const now =
    new Date();

  const testOverrides =
    getAtmosphereTestOverrides();

  const season =
    testOverrides.season
    || getWorldSeason(now);

  const daypart =
    testOverrides.daypart
    || getWorldDaypart(now);

  const weather =
    testOverrides.weather
    || getWorldWeatherMode(
      condition,
      updatedAt
    );

  atmosphere.dataset.season =
    season;

  atmosphere.dataset.daypart =
    daypart;

  atmosphere.dataset.weather =
    weather;

  atmosphere.dataset.condition =
    condition || "";

  particleHost.replaceChildren();

  const reduceMotion =
    document.body.classList.contains(
      "reduce-motion"
    )
    || window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  syncAtmosphereAmbientEvents({
    atmosphere,
    season,
    weather,
    now,
    testOverrides,
    reduceMotion
  });

  if (reduceMotion) {
    return;
  }

  const plan =
    getWeatherParticlePlan(
      season,
      weather,
      daypart
    );

  if (
    !plan.kind
    || plan.count <= 0
  ) {
    return;
  }

  const fragment =
    document.createDocumentFragment();

  for (
    let index = 0;
    index < plan.count;
    index += 1
  ) {
    fragment.appendChild(
      createWeatherParticle(
        plan.kind
      )
    );
  }

  particleHost.appendChild(
    fragment
  );
}

async function refreshWorldAtmosphere({
  force = false
} = {}) {
  if (
    !force
    && Date.now()
      - lastWorldWeatherSyncAt
      < 60 * 1000
  ) {
    return;
  }

  lastWorldWeatherSyncAt =
    Date.now();

  if (!supabaseClient) {
    renderWorldAtmosphere();
    return;
  }

  try {
    const {
      data,
      error
    } =
      await supabaseClient
        .from("world_weather")
        .select(
          "condition, updated_at"
        )
        .eq(
          "id",
          "local"
        )
        .maybeSingle();

    if (error) {
      throw error;
    }

    renderWorldAtmosphere({
      condition:
        data?.condition || "",
      updatedAt:
        data?.updated_at || null
    });
  }

  catch (error) {
    console.warn(
      "World weather unavailable:",
      error
    );

    renderWorldAtmosphere();
  }
}

function startWorldAtmosphereRefresh() {
  if (worldWeatherRefreshTimer) {
    clearInterval(
      worldWeatherRefreshTimer
    );
  }

  worldWeatherRefreshTimer =
    window.setInterval(
      () => {
        void refreshWorldAtmosphere({
          force: true
        });
      },
      WORLD_WEATHER_REFRESH_MS
    );
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

  renderWorldAtmosphere();

  await initializeSupabase();

  if (
    isPasswordRecoveryReturn()
  ) {
    await finishPasswordRecoveryReturn();
  }

  await refreshWorldAtmosphere({
    force: true
  });

  startWorldAtmosphereRefresh();

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

  const onboardingState=getState();
  if(!onboardingState.onboardingComplete&&!$("#weekConqueredDialog")?.open&&!$("#bossDefeatedDialog")?.open){
    const character=getCharacterConfig();$("#onboardingCharacterArt").src=character.card;$("#onboardingCharacterArt").alt=character.defaultName;
    $("#onboardingClassIntro").textContent=`${character.defaultName}, ${character.className}. The Guild has marked a road into the Blackwood, and every real-world quest will carry the expedition forward.`;
    $("#onboardingDialog")?.showModal();
  }

  appInitialized =
    true;
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
