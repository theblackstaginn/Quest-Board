# Rogue Witch Watch

Native Apple Watch companion for Jess's Quest Board profile.

## Current build

- watchOS SwiftUI app shell
- anonymous Supabase auth against the existing Quest Board project
- pairing through Quest Board's existing 8-character device-sync code
- hard lock to the `jess` profile
- live weekly progress, currencies, and Boss state
- App Group snapshot sharing for WidgetKit
- Rogue Witch complication/widget
- quest picker
- persistent active-quest timer
- pause / resume / abandon controls
- server-authoritative normal quest completion
- idempotent completion IDs to prevent double rewards
- equipped relic reward bonuses
- week-conquered +25 Gold handling
- success/failure wrist haptics

Boss completion/reward claiming is intentionally excluded until the normal quest path is tested on real Apple Watch hardware.

## Xcode setup

Create a watchOS App target named `RogueWitchWatch` and a Widget Extension named `RogueWitchWidget`.

Add:
`https://github.com/supabase/supabase-swift.git`

Pin it to **2.55.3** while this branch is under test.

Add this App Group to both targets:
`group.com.blackstag.questboard.roguewitch`

Target membership:

- Shared/QuestBoardConfig.swift — watch app only
- Shared/QuestBoardModels.swift — watch app + widget
- Shared/RogueWitchSharedState.swift — watch app + widget
- App/WatchQuestCatalog.swift — watch app only
- App/WatchQuestSession.swift — watch app only
- App/RogueWitchStore.swift — watch app only
- App/PairingView.swift — watch app only
- App/QuestPickerView.swift — watch app only
- App/QuestTimerView.swift — watch app only
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

## Completion architecture

The watch never calculates gameplay rewards. It sends the paired sync channel, quest ID, and a unique completion UUID. The database verifies Jess's paired identity and applies the canonical rewards, equipped relic bonuses, shared save update, party activity, and weekly-conquered reward.

Duplicate retries return the existing state without awarding the quest twice.

## Verified backend tests

Rollback-only tests verified:

- typed relic XP bonuses
- Gold relic bonuses
- weekly completion count
- history insertion
- campaign progress
- +25 Gold week-conquered reward
- duplicate-submit protection

No live Jess quest progress was changed by those tests.

## Next checkpoint

Compile and run this branch in Xcode on a real Apple Watch/iPhone pair. After the normal quest loop is proven on hardware, add the Boss flow as a separate server-authoritative transaction.
