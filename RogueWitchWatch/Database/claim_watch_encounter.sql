-- Rogue Witch Watch: server-authoritative road encounter claiming.
-- This definition is synchronized from the live Quest Board project.

CREATE OR REPLACE FUNCTION public.claim_watch_encounter(p_sync_id uuid, p_encounter_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_user_id uuid := auth.uid();
  v_state jsonb;
  v_settings jsonb;
  v_profile_id text;
  v_encounter jsonb;
  v_claim_ids jsonb;
  v_reward text;
  v_amount integer;
  v_primary_user_id uuid;
  v_claimed_at timestamptz := now();
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_sync_id is null or p_encounter_id is null then
    raise exception 'Missing encounter identity';
  end if;

  if not exists (
    select 1
    from public.device_sync_members m
    where m.sync_id = p_sync_id
      and m.user_id = v_user_id
  ) then
    raise exception 'Not paired to this Quest Board save';
  end if;

  select d.state, d.settings, d.profile_id
    into v_state, v_settings, v_profile_id
  from public.device_sync d
  where d.sync_id = p_sync_id
  for update;

  if not found then
    raise exception 'Quest Board sync channel not found';
  end if;

  if v_profile_id <> 'jess' then
    raise exception 'Rogue Witch Watch can only write Jess profile state';
  end if;

  v_state := coalesce(v_state, '{}'::jsonb);
  v_settings := coalesce(v_settings, '{}'::jsonb);
  v_claim_ids := coalesce(v_state -> 'watchEncounterClaimIds', '[]'::jsonb);

  if v_claim_ids ? p_encounter_id::text then
    return jsonb_build_object(
      'duplicate', true,
      'state', v_state,
      'settings', v_settings,
      'encounter', null
    );
  end if;

  v_encounter := v_state -> 'watchEncounter';

  if coalesce(jsonb_typeof(v_encounter), 'null') <> 'object' then
    raise exception 'No watch encounter is waiting';
  end if;

  if coalesce(v_encounter ->> 'id', '') <> p_encounter_id::text then
    raise exception 'Encounter identity does not match the waiting encounter';
  end if;

  v_reward := coalesce(v_encounter ->> 'reward', '');
  v_amount := greatest(0, coalesce((v_encounter ->> 'amount')::integer, 0));

  case v_reward
    when 'gold' then
      v_state := jsonb_set(
        v_state,
        '{gold}',
        to_jsonb(coalesce((v_state ->> 'gold')::integer, 0) + v_amount),
        true
      );
    when 'crystals' then
      v_state := jsonb_set(
        v_state,
        '{crystals}',
        to_jsonb(coalesce((v_state ->> 'crystals')::integer, 0) + v_amount),
        true
      );
    when 'xp' then
      v_state := jsonb_set(v_state, '{xp}', coalesce(v_state -> 'xp', '{}'::jsonb), true);
      v_state := jsonb_set(
        v_state,
        '{xp,restoration}',
        to_jsonb(coalesce((v_state #>> '{xp,restoration}')::integer, 0) + v_amount),
        true
      );
    else
      raise exception 'Unsupported encounter reward';
  end case;

  v_state := jsonb_set(
    v_state,
    '{encounterCount}',
    to_jsonb(greatest(0, coalesce((v_state ->> 'encounterCount')::integer, 0)) + 1),
    true
  );

  v_state := jsonb_set(
    v_state,
    '{watchEncounterClaimIds}',
    v_claim_ids || jsonb_build_array(p_encounter_id::text),
    true
  );

  v_state := v_state - 'watchEncounter';

  update public.device_sync
  set state = v_state, updated_at = v_claimed_at
  where sync_id = p_sync_id;

  select m.user_id into v_primary_user_id
  from public.device_sync_members m
  where m.sync_id = p_sync_id
  order by m.joined_at
  limit 1;

  if v_primary_user_id is not null then
    insert into public.player_progress (user_id, profile_id, state, settings, updated_at)
    values (v_primary_user_id, 'jess', v_state, v_settings, v_claimed_at)
    on conflict (user_id)
    do update set
      profile_id = excluded.profile_id,
      state = excluded.state,
      settings = excluded.settings,
      updated_at = excluded.updated_at;
  end if;

  return jsonb_build_object(
    'duplicate', false,
    'state', v_state,
    'settings', v_settings,
    'encounter', v_encounter
  );
end;
$function$;

revoke execute on function public.claim_watch_encounter(uuid, uuid) from public, anon;
grant execute on function public.claim_watch_encounter(uuid, uuid) to authenticated;
