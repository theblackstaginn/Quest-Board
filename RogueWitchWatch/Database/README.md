# Rogue Witch Watch database changes

These files are the repository-owned source for database changes already applied to the live Quest Board Supabase project.

- `complete_watch_quest.sql` — server-authoritative normal quest completion for the paired Jess watch profile, including every-third-quest road encounter creation.
- `claim_watch_encounter.sql` — atomically claims a pending watch encounter, applies its reward, increments encounter progress, and prevents duplicate reward retries.
- `secure_device_sync_functions.sql` — removes unauthenticated execution access from the existing device-sync RPCs while preserving authenticated/anonymous-user sessions created through Supabase Auth.

The watch never mints XP, Gold, Crystals, weekly rewards, relic bonuses, or encounter rewards in Swift. Database transactions validate the paired sync membership, hard-require Jess's profile, lock the shared save row, apply canonical state mutations, and update the primary cloud save.

Rollback-only verification has covered normal quest rewards, relic bonuses, weekly threshold rewards, duplicate quest submission, encounter creation, encounter claiming, and duplicate encounter claiming.

Boss completion is not implemented here yet.
