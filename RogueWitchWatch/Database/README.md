# Rogue Witch Watch database changes

These files are the repository-owned source for database changes already applied to the live Quest Board Supabase project.

- `complete_watch_quest.sql` — server-authoritative normal quest completion for the paired Jess watch profile.
- `secure_device_sync_functions.sql` — removes unauthenticated execution access from the existing device-sync RPCs while preserving authenticated/anonymous-user sessions created through Supabase Auth.

The watch-specific completion function deliberately remains separate from the browser's JavaScript reward mutation path. The database validates the paired sync membership, locks the shared save row, applies canonical rewards, and returns the updated Quest Board state.

Boss completion is not implemented here yet.
