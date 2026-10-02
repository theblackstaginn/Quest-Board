-- Rogue Witch Watch: server-authoritative normal quest completion and encounter queueing.
-- This definition is synchronized from the live Quest Board project.

CREATE OR REPLACE FUNCTION public.complete_watch_quest(p_sync_id uuid, p_quest_id text, p_idempotency_key uuid)
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
  v_week_key text;
  v_goal integer;
  v_completed_before integer;
  v_completed_after integer;
  v_completed_at timestamptz := now();
  v_completed_at_text text;
  v_title text;
  v_category text;
  v_xp_type text;
  v_base_xp integer;
  v_base_gold integer;
  v_earned_xp integer;
  v_earned_gold integer;
  v_flat_gold integer := 0;
  v_gold_multiplier numeric := 1;
  v_xp_bonus integer := 0;
  v_campaign_progress integer;
  v_xp_current integer;
  v_gold_current integer;
  v_history_entry jsonb;
  v_week_entry jsonb;
  v_ids jsonb;
  v_primary_user_id uuid;
  v_party_id uuid;
  v_display_name text;
  v_conquered_week boolean := false;
  v_nonboss_history_count integer := 0;
  v_encounter_count integer := 0;
  v_encounter_index integer := 0;
  v_encounter jsonb;
  v_encounter_queued boolean := false;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_sync_id is null or p_idempotency_key is null then
    raise exception 'Missing completion identity';
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

  case p_quest_id
    when 'there-back' then v_title := 'There and Back'; v_category := 'Endurance'; v_xp_type := 'endurance'; v_base_xp := 20; v_base_gold := 12;
    when 'keep' then v_title := 'The Keep'; v_category := 'Strength'; v_xp_type := 'strength'; v_base_xp := 25; v_base_gold := 15;
    when 'dragonstrength' then v_title := 'DragonStrength'; v_category := 'Strength'; v_xp_type := 'strength'; v_base_xp := 30; v_base_gold := 20;
    when 'iron-gate' then v_title := 'The Iron Gate'; v_category := 'Strength'; v_xp_type := 'strength'; v_base_xp := 30; v_base_gold := 20;
    when 'smiths-circuit' then v_title := 'The Smith''s Circuit'; v_category := 'Strength'; v_xp_type := 'strength'; v_base_xp := 25; v_base_gold := 15;
    when 'sentinels-stand' then v_title := 'Sentinel''s Stand'; v_category := 'Strength'; v_xp_type := 'strength'; v_base_xp := 25; v_base_gold := 15;
    when 'rogue' then v_title := 'Rogue Mode'; v_category := 'Mixed'; v_xp_type := 'strength'; v_base_xp := 20; v_base_gold := 15;
    when 'restoration' then v_title := 'Restoration'; v_category := 'Recovery'; v_xp_type := 'restoration'; v_base_xp := 20; v_base_gold := 10;
    when 'unbinding-ritual' then v_title := 'The Unbinding Ritual'; v_category := 'Recovery'; v_xp_type := 'restoration'; v_base_xp := 15; v_base_gold := 8;
    when 'wayfarers-reset' then v_title := 'Wayfarer''s Reset'; v_category := 'Recovery'; v_xp_type := 'restoration'; v_base_xp := 20; v_base_gold := 10;
    when 'moonlit-mobility' then v_title := 'Moonlit Mobility'; v_category := 'Recovery'; v_xp_type := 'restoration'; v_base_xp := 20; v_base_gold := 10;
    when 'ranger' then v_title := 'Ranger Training'; v_category := 'Endurance'; v_xp_type := 'endurance'; v_base_xp := 30; v_base_gold := 20;
    when 'emergency' then v_title := 'Emergency Quest'; v_category := 'Emergency'; v_xp_type := 'strength'; v_base_xp := 10; v_base_gold := 5;
    else raise exception 'Unsupported watch quest';
  end case;

  v_state := coalesce(v_state, '{}'::jsonb);
  v_settings := coalesce(v_settings, '{}'::jsonb);
  v_ids := coalesce(v_state -> 'watchCompletionIds', '[]'::jsonb);

  if v_ids ? p_idempotency_key::text then
    return jsonb_build_object(
      'duplicate', true,
      'state', v_state,
      'settings', v_settings,
      'earned_xp', 0,
      'earned_gold', 0,
      'week_conquered', false,
      'encounter_queued', false,
      'encounter', v_state -> 'watchEncounter'
    );
  end if;

  v_week_key := to_char((now() at time zone 'America/New_York')::date, 'IYYY-"W"IW');

  if coalesce(v_state ->> 'weekKey', '') <> v_week_key then
    v_state := jsonb_set(v_state, '{weekKey}', to_jsonb(v_week_key), true);
    v_state := jsonb_set(v_state, '{weeklyCompleted}', '[]'::jsonb, true);
  end if;

  v_state := jsonb_set(v_state, '{xp}', coalesce(v_state -> 'xp', '{}'::jsonb), true);
  v_state := jsonb_set(v_state, '{weeklyCompleted}', coalesce(v_state -> 'weeklyCompleted', '[]'::jsonb), true);
  v_state := jsonb_set(v_state, '{history}', coalesce(v_state -> 'history', '[]'::jsonb), true);

  if coalesce(v_state #>> '{equippedRelics,weapon}', '') = 'forgebound-hammer' then
    v_gold_multiplier := v_gold_multiplier * 1.05;
  end if;
  if coalesce(v_state #>> '{equippedRelics,charm}', '') = 'lantern-of-guidance' then
    v_flat_gold := v_flat_gold + 2;
  end if;
  if v_xp_type = 'endurance' and coalesce(v_state #>> '{equippedRelics,armor}', '') = 'cloak-of-endurance' then
    v_xp_bonus := v_xp_bonus + 5;
  end if;
  if v_xp_type = 'strength' and coalesce(v_state #>> '{equippedRelics,charm}', '') = 'band-of-inner-focus' then
    v_xp_bonus := v_xp_bonus + 5;
  end if;
  if v_xp_type = 'restoration' and coalesce(v_state #>> '{equippedRelics,charm}', '') = 'chalice-of-renewal' then
    v_xp_bonus := v_xp_bonus + 5;
  end if;

  v_earned_xp := greatest(0, v_base_xp + v_xp_bonus);
  v_earned_gold := greatest(0, round((v_base_gold * v_gold_multiplier) + v_flat_gold)::integer);

  v_completed_before := jsonb_array_length(v_state -> 'weeklyCompleted');
  v_completed_at_text := to_char(v_completed_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');

  v_week_entry := jsonb_build_object('questId', p_quest_id, 'completedAt', v_completed_at_text);
  v_state := jsonb_set(v_state, '{weeklyCompleted}', (v_state -> 'weeklyCompleted') || jsonb_build_array(v_week_entry), true);

  v_xp_current := coalesce((v_state #>> array['xp', v_xp_type])::integer, 0);
  v_state := jsonb_set(v_state, array['xp', v_xp_type], to_jsonb(v_xp_current + v_earned_xp), true);

  v_gold_current := coalesce((v_state ->> 'gold')::integer, 0);
  v_state := jsonb_set(v_state, '{gold}', to_jsonb(v_gold_current + v_earned_gold), true);

  v_campaign_progress := least(24, greatest(0, coalesce((v_state ->> 'campaignProgress')::integer, 0)) + 1);
  v_state := jsonb_set(v_state, '{campaignProgress}', to_jsonb(v_campaign_progress), true);

  v_history_entry := jsonb_build_object(
    'questId', p_quest_id,
    'title', v_title,
    'category', v_category,
    'xp', v_earned_xp,
    'xpType', v_xp_type,
    'gold', v_earned_gold,
    'crystals', 0,
    'completedAt', v_completed_at_text
  );

  v_state := jsonb_set(v_state, '{history}', jsonb_build_array(v_history_entry) || (v_state -> 'history'), true);

  v_completed_after := v_completed_before + 1;
  v_goal := greatest(1, coalesce((v_settings ->> 'weeklyGoal')::integer, 3));

  if v_completed_before < v_goal
     and v_completed_after >= v_goal
     and coalesce(v_state ->> 'weekConqueredRewardWeek', '') <> v_week_key then
    v_state := jsonb_set(v_state, '{gold}', to_jsonb(coalesce((v_state ->> 'gold')::integer, 0) + 25), true);
    v_state := jsonb_set(v_state, '{weekConqueredRewardWeek}', to_jsonb(v_week_key), true);
    v_conquered_week := true;
  end if;

  select count(*)::integer
    into v_nonboss_history_count
  from jsonb_array_elements(v_state -> 'history') as entry
  where coalesce(entry ->> 'questId', '') <> 'boss';

  if v_nonboss_history_count > 0
     and mod(v_nonboss_history_count, 3) = 0
     and coalesce(jsonb_typeof(v_state -> 'watchEncounter'), 'null') = 'null' then
    v_encounter_count := greatest(0, coalesce((v_state ->> 'encounterCount')::integer, 0));
    v_encounter_index := mod(v_nonboss_history_count + v_encounter_count, 4);

    case v_encounter_index
      when 0 then
        v_encounter := jsonb_build_object(
          'id', p_idempotency_key::text,
          'milestone', v_nonboss_history_count,
          'glyph', '¤',
          'title', 'The Road Merchant',
          'copy', 'A hooded trader recognizes the Guild seal and presses a coin purse into your hand.',
          'reward', 'gold',
          'amount', 8
        );
      when 1 then
        v_encounter := jsonb_build_object(
          'id', p_idempotency_key::text,
          'milestone', v_nonboss_history_count,
          'glyph', '✦',
          'title', 'Shrine of the Old Road',
          'copy', 'Moss-covered stones hum as you pass. Something answers your persistence.',
          'reward', 'xp',
          'amount', 8
        );
      when 2 then
        v_encounter := jsonb_build_object(
          'id', p_idempotency_key::text,
          'milestone', v_nonboss_history_count,
          'glyph', '◆',
          'title', 'Crystal Vein',
          'copy', 'A shard of pale light glints beneath a broken root.',
          'reward', 'crystals',
          'amount', 1
        );
      else
        v_encounter := jsonb_build_object(
          'id', p_idempotency_key::text,
          'milestone', v_nonboss_history_count,
          'glyph', '▣',
          'title', 'Forgotten Cache',
          'copy', 'An old Guild cache survived beneath the ferns.',
          'reward', 'gold',
          'amount', 12
        );
    end case;

    v_state := jsonb_set(v_state, '{watchEncounter}', v_encounter, true);
    v_encounter_queued := true;
  end if;

  v_state := jsonb_set(v_state, '{watchCompletionIds}', v_ids || jsonb_build_array(p_idempotency_key::text), true);

  update public.device_sync
  set state = v_state, updated_at = v_completed_at
  where sync_id = p_sync_id;

  select m.user_id into v_primary_user_id
  from public.device_sync_members m
  where m.sync_id = p_sync_id
  order by m.joined_at
  limit 1;

  if v_primary_user_id is not null then
    insert into public.player_progress (user_id, profile_id, state, settings, updated_at)
    values (v_primary_user_id, 'jess', v_state, v_settings, v_completed_at)
    on conflict (user_id)
    do update set
      profile_id = excluded.profile_id,
      state = excluded.state,
      settings = excluded.settings,
      updated_at = excluded.updated_at;
  end if;

  select pm.party_id into v_party_id
  from public.party_members pm
  where pm.user_id = v_user_id
  order by pm.joined_at
  limit 1;

  if v_party_id is not null then
    v_display_name := nullif(trim(v_settings ->> 'playerName'), '');

    insert into public.quest_activity (
      party_id, user_id, profile_id, display_name,
      quest_id, quest_title, xp, gold, week_key, completed_at
    )
    values (
      v_party_id, v_user_id, 'jess', coalesce(v_display_name, 'Jess'),
      p_quest_id, v_title, v_base_xp, v_base_gold, v_week_key, v_completed_at
    );
  end if;

  return jsonb_build_object(
    'duplicate', false,
    'state', v_state,
    'settings', v_settings,
    'earned_xp', v_earned_xp,
    'earned_gold', v_earned_gold,
    'week_conquered', v_conquered_week,
    'encounter_queued', v_encounter_queued,
    'encounter', v_state -> 'watchEncounter'
  );
end;
$function$;

revoke execute on function public.complete_watch_quest(uuid, text, uuid) from public, anon;
grant execute on function public.complete_watch_quest(uuid, text, uuid) to authenticated;
