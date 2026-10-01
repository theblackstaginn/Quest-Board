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
- persistent every-third-quest road encounters on watch
- server-authoritative encounter claiming with retry protection
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

The code expires after 15 minutes and is consumed when claimed. Supabase Swift persists the anonymous Auth session in Apple Keychain storage, so the paired watch identity survives relaunches.

## Quest completion architecture

The watch never calculates gameplay rewards. It sends the paired sync channel, quest ID, and a unique completion UUID. The database verifies Jess's paired identity and applies canonical rewards, equipped relic bonuses, the shared-save update, party activity, and the weekly-conquered reward.

Duplicate retries return the existing state without awarding the quest twice.

## Road encounters

When a watch completion reaches every third non-Boss quest, the same Quest Board encounter rotation is evaluated on the server. The encounter is stored in the shared Quest Board state before the completion transaction returns.

The watch surfaces the waiting encounter as an amethyst encounter card. Encounter rewards are claimed through a separate authenticated transaction. Claim IDs are persisted so a retry after a lost response cannot award the encounter twice.

A waiting encounter blocks starting a *new* quest until it is claimed, preventing a milestone encounter from being skipped. An already-running quest timer remains usable.

## Verified backend tests

Rollback-only tests verified:

- typed relic XP bonuses
- Gold relic bonuses
- weekly completion count
- history insertion
- campaign progress
- +25 Gold week-conquered reward
- duplicate quest-submit protection
- third-quest road encounter creation
- encounter reward application
- encounter removal after claim
- duplicate encounter-claim protection

The encounter test completed an Emergency Quest from a synthetic two-quest state, reached 52 Gold after the quest/week reward, queued **Forgotten Cache**, claimed its +12 Gold for 64 total, then retried the same claim and remained at 64.

All verification transactions were rolled back. No live Jess quest progress was changed.

## Security

Watch write RPCs require an authenticated Supabase session, validate membership in the requested device-sync channel, hard-require the `jess` profile, lock the shared state row during mutation, and are not executable by the `anon` role.

The Supabase advisor still reports unrelated pre-existing Quest Board security/performance warnings. They are intentionally outside this watch feature scope and were not modified.

## Signing for Jess

Installing on Jess's actual Apple Watch will require Xcode signing with an Apple developer identity and enabling the App Group for both the watch app and widget targets.

## Next checkpoint

Generate and compile the project in Xcode on macOS, then do the first real-device pairing and normal quest + road-encounter test before adding the Boss flow.
