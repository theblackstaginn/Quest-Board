# Rogue Witch Watch

Native Apple Watch companion for Jess's Quest Board profile.

## Current build

- native watchOS SwiftUI app
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
- XcodeGen project spec

Boss completion/reward claiming is intentionally excluded until the normal quest path is tested on real Apple Watch hardware.

## Generate the Xcode project

Install XcodeGen 2.46.0, then from this folder run:

`xcodegen generate`

The generated `RogueWitchWatch.xcodeproj` is intentionally gitignored. `project.yml` is the source of truth for Xcode project structure.

The project pins:

- watchOS deployment target: **10.0**
- Supabase Swift: **2.55.3**
- App Group: `group.com.blackstag.questboard.roguewitch`

## Pairing

1. Open Jess's Quest Board.
2. In Settings, generate a live device-sync pairing code.
3. Open Rogue Witch Watch.
4. Enter the 8-character code.
5. The watch claims Jess's existing sync channel and pulls her live shared state.

The code expires after 15 minutes and is consumed when claimed.

## Completion architecture

The watch never calculates gameplay rewards. It sends the paired sync channel, quest ID, and a unique completion UUID. The database verifies Jess's paired identity and applies canonical rewards, equipped relic bonuses, the shared-save update, party activity, and the weekly-conquered reward.

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

## Signing for Jess

Installing on Jess's actual Apple Watch will require Xcode signing with an Apple developer identity and enabling the App Group for both the watch app and widget targets.

## Next checkpoint

Generate and compile the project in Xcode or a macOS CI runner. Then do the first real-device pairing and normal quest completion test before adding the Boss flow.
