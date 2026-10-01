-- Rogue Witch Watch pairing hardening.
-- These grants are already applied to the live Quest Board project.
--
-- Quest Board uses Supabase anonymous sign-in. Those users hold the
-- authenticated Postgres role after Auth creates their session, so revoking
-- EXECUTE from anon does not break existing Quest Board pairing.

revoke execute on function public.claim_device_sync_channel(text)
from public, anon;
grant execute on function public.claim_device_sync_channel(text)
to authenticated;

revoke execute on function public.claim_device_sync_channel(text, text)
from public, anon;
grant execute on function public.claim_device_sync_channel(text, text)
to authenticated;

revoke execute on function public.create_device_sync_channel_fixed(text, jsonb, jsonb)
from public, anon;
grant execute on function public.create_device_sync_channel_fixed(text, jsonb, jsonb)
to authenticated;

revoke execute on function public.refresh_device_sync_pair_code(uuid)
from public, anon;
grant execute on function public.refresh_device_sync_pair_code(uuid)
to authenticated;

revoke execute on function public.get_synced_user_ids(uuid)
from public, anon;
grant execute on function public.get_synced_user_ids(uuid)
to authenticated;

revoke execute on function public.join_synced_party(uuid)
from public, anon;
grant execute on function public.join_synced_party(uuid)
to authenticated;
