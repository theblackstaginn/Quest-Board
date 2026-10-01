# Rogue Witch Watch

Native Apple Watch companion for Jess's Quest Board profile.

## Phase 1

This foundation is intentionally read-only for gameplay:

- watchOS SwiftUI app shell
- anonymous Supabase auth against the existing Quest Board project
- pairing through Quest Board's existing 8-character device-sync code
- hard lock to the `jess` profile
- live weekly progress, currencies, and Boss state
- App Group snapshot sharing for WidgetKit
- Rogue Witch watch complication/widget

Quest Board remains authoritative for progression and rewards. The watch does not award XP, Gold, Crystals, relics, or Boss rewards in Phase 1.

## Xcode setup

Create a watchOS App target named `RogueWitchWatch` and a Widget Extension named `RogueWitchWidget`.

Add the Swift package:

`https://github.com/supabase/supabase-swift.git`

Pin it to **2.55.3** while this branch is under test.

Add this App Group to both targets:

`group.com.blackstag.questboard.roguewitch`

Target membership:

- Shared/QuestBoardConfig.swift — watch app only
- Shared/QuestBoardModels.swift — watch app + widget
- Shared/RogueWitchSharedState.swift — watch app + widget
- App/RogueWitchStore.swift — watch app only
- App/PairingView.swift — watch app only
- App/RogueWitchHomeView.swift — watch app only
- App/RogueWitchWatchApp.swift — watch app only
- Widget/RogueWitchWidget.swift — widget only

## Pairing

1. Open Jess's Quest Board.
2. In Settings, generate a live device-sync pairing code.
3. Open Rogue Witch Watch.
4. Enter the 8-character code.
5. The watch claims Jess's existing sync channel and pulls her live shared state.

The code expires after 15 minutes and is consumed when claimed.

## Next phase

Once Phase 1 is running on real hardware, add one server-owned quest-completion RPC so the watch can complete quests without duplicating reward logic in Swift.
