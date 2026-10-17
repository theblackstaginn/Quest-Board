# Rogue Witch Watch — first hardware test

Use this only after `./build-check.sh` passes on macOS.

## 1. Signing and capabilities

- Open `RogueWitchWatch.xcodeproj`.
- Select an Apple Development Team for **RogueWitchWatch**.
- Select the same Team for **RogueWitchWidget**.
- Confirm both targets have the App Group:
  `group.com.blackstag.questboard.roguewitch`
- Confirm the watch app bundle ID is:
  `com.blackstag.questboard.roguewitch`
- Confirm the widget bundle ID is:
  `com.blackstag.questboard.roguewitch.widget`

Do not change Supabase URL/key values. The app uses the public publishable key already used by Quest Board.

## 2. Install

- Connect the iPhone paired with Jess's Apple Watch to the Mac.
- Choose Jess's Apple Watch as the run destination.
- Build and run **RogueWitchWatch**.
- Confirm the watch opens to the Rogue Witch pairing screen.

## 3. Pairing

- Open Jess's live Quest Board.
- In Settings, generate a fresh 8-character device-sync code.
- Enter the code on the watch within 15 minutes.
- Confirm the watch shows Jess / Rogue Witch Assassin.
- Compare weekly quest count, Gold, Crystals, and Boss state with Quest Board.

Pass condition: the values agree and relaunching the watch app does **not** require pairing again.

## 4. Timer persistence

- Choose a quest Jess actually intends to count.
- Start the timer.
- Let it run for at least 30 seconds.
- Return to the watch face, then reopen Rogue Witch Watch.
- Confirm the elapsed time continued from the timestamp rather than restarting.
- Pause, leave the app, reopen, and confirm paused time stays fixed.
- Resume and confirm timing continues.

Pass condition: no timer reset or double-counted elapsed time.

## 5. First live quest completion

Use a real quest Jess wants recorded. Do not use a throwaway test completion on live progress.

- Complete the active quest from the watch.
- Confirm one success haptic.
- Confirm the reward card shows returned XP and Gold.
- Open Quest Board on the phone/web and refresh.
- Confirm weekly progress, XP, Gold, history, campaign progress, and party activity reflect exactly one completion.

If the completion crosses the weekly goal, also confirm the +25 Gold week reward and Boss unlock.

Pass condition: one watch completion equals one Quest Board completion.

## 6. Road encounter

Do this naturally when Jess reaches an every-third non-Boss quest milestone.

- Complete the milestone quest from the watch.
- Confirm the completion message says **The road stirs…**
- Confirm a purple **ROAD ENCOUNTER** card appears.
- Close and reopen the watch app before claiming it.
- Confirm the encounter is still waiting.
- Claim it.
- Confirm one success haptic and the correct reward.
- Refresh Quest Board and verify Gold/Crystals/Restoration XP changed once.
- Confirm a new quest can be started only after the encounter is claimed.

Pass condition: the encounter survives relaunch and its reward is applied exactly once.

## 7. Widget / complication

- Add Rogue Witch to a compatible Apple Watch complication slot.
- Confirm the circular or rectangular family shows current weekly progress.
- Complete/refresh a quest and confirm the complication refreshes to the new snapshot.
- Confirm Boss-ready state appears after the weekly goal is reached.

## Stop conditions

Stop the hardware test and keep the branch unmerged if any of these happen:

- pairing resolves to Farmer instead of Jess
- values disagree with Quest Board after refresh
- a single completion awards twice
- a timer resets unexpectedly
- an encounter can be claimed twice
- the widget reads a different profile

Boss completion is **not** part of this test. Add it only after all checks above pass.
