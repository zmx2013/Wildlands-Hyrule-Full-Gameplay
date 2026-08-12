# LOTM Core v0.0.3a Ultra — Bug Audit

> Audit baseline only. **No fixes are applied in this phase.**
>
> Source SHA256: `f0f2d29cebbbc45ce98d403aec97dde48c694bb02b0f6d4df028e0fd7fd04782`
> Production JAR SHA256: `746a8c2a6810ee4c56a4dfa5e83e61eb24362550f52b12ada16f85c97d29c642`
> Minecraft 1.20.1 / Forge 47.4.22 / Java 17

## Confirmed bugs

1. **BUG-001 — Sleep spirituality recovery can fail.** `PlayerWakeUpEvent` uses `wakeImmediately()` and `level.isDay()` as full-sleep completion tests; normal completed sleep can miss `restoreAfterCompletedSleep()`.
2. **BUG-002 — Dream preparation stale server state.** Changing/clearing notebook visible state does not cancel the server-side pending dream target/question.
3. **BUG-003 — Full inventory can silently destroy outputs.** Several crafting/reagent/potion paths ignore `Inventory.add()` failure after consuming inputs.
4. **BUG-004 — Precision potion session is a static per-player session, not altar-bound or persisted.** Ingredients can be consumed and then lost on restart; the session can follow the player to another altar/dimension.
5. **BUG-005 — Extraneous potion ingredients are ignored.** Formula assessment checks required ingredients but does not reject/penalize unrelated contaminants.
6. **BUG-006 — MysticTrace important trace storage is global, not world-scoped.** `config/lotm_v003a_important_traces.dat` can leak traces between worlds.
7. **BUG-007 — MysticTrace player snapshots survive logout in static memory.** Reconnect can create false movement/state traces and the map grows.
8. **BUG-008 — Dowsing sessions survive player lifecycle in static memory.** Target/mode/result can persist for a UUID without logout/death cleanup.
9. **BUG-009 — Persistent question-fatigue NBT is unbounded and hash-collision-prone.** One top-level NBT key pair is created per hash, never cleaned; Java `String.hashCode()` can merge unrelated questions.
10. **BUG-010 — Death-point data is lost on death clone.** It is written to top-level `ServerPlayer.getPersistentData()` instead of Forge `PlayerPersisted`.
11. **BUG-011 — Eight server tactical waypoint slots are lost on death clone.** Same top-level persistentData problem.
12. **BUG-012 — DivinationJournal is lost on death clone.** Same top-level persistentData problem.
13. **BUG-013 — Question fatigue resets on death.** Same top-level persistentData problem; dying bypasses anti-spam fatigue.
14. **BUG-014 — Client can submit arbitrary waypoint coordinates/dimension.** Server validates slot/format but trusts location data.
15. **BUG-015 — Failed Magician effect refunds base spirituality cost, not adjusted semi-mad cost.** The multiplier difference remains spent.
16. **BUG-016 — Failed Magician effects still accumulate permanent-mad spirituality-spend/loss-tendency progress.** Refund does not reverse danger accounting.
17. **BUG-017 — Potion quality `<= 0` is interpreted as `1.0`.** A legitimate zero-quality mixture becomes effectively perfect in consumption support.
18. **BUG-018 — Full-inventory output loss affects returned bottles/reagents/laboratory/final-potion output as well.** Same destructive-output family as BUG-003.
19. **BUG-019 — Droplet Gem ore is never added to biomes.** Configured/placed feature exists but no biome modifier references it; S7 required material is survival-unobtainable through worldgen.
20. **BUG-020 — Live-creature dowsing samples still map to old remnant blocks.** Those remnant placed features are not world-generated, so sample-based source finding targets nonexistent ecology nodes instead of live entities.
21. **BUG-021 — Death selectively clears spirit-vision cooldown, danger-sense cooldown and combat-regeneration lock.** Other cooldowns persist; death bypasses these three specifically.
22. **BUG-022 — Player dynamic anti-divination fields have no gameplay writer.** Rank/strength/hidden flags are read but never set by gameplay.
23. **BUG-023 — Normal coin/pendulum/tarot/dream resolution ignores dynamic player anti-divination.** It uses static security profiles; dynamic player security only affects limited feedback/backlash paths.
24. **BUG-024 — Dream divination bypasses persistent fatigue/journal/backlash; dowsing bypasses journal/backlash.** The unified divination framework is not actually unified.
25. **BUG-025 — Minimap death points/basic waypoints leak between saves/servers.** Client config is global and namespaced only by dimension ID, not world/server identity.
26. **BUG-026 — Meditation state persists across logout and dimension change.** Saved anchor has no dimension; reconnect can resume meditation and dimension change can retain an old-coordinate anchor.
27. **BUG-027 — `bone_softening` cannot remain sustained.** It is inserted into `activeSustainedAbilities` but is absent from `SustainedAbilityManager.DEFINITIONS`, so the common sustained tick removes it as unknown.
28. **BUG-028 — High-corruption movement can synchronously rewrite trace storage about every two seconds.** Important movement traces call full `saveImportant()` on the main server thread.
29. **BUG-029 — MysticTrace cleanup repeats once per Beyonder player on the same global cleanup tick.** N players cause N scans of the same global store.
30. **BUG-030 — Ore dowsing ignores deepslate ore variants.** Exact target matching only includes normal stone variants, including diamond/redstone/iron/gold/lapis/copper/coal/emerald.
31. **BUG-031 — Sparse dowsing signal flickers.** Result is reset every scan; one random-sampling miss immediately erases a previous valid signal.
32. **BUG-032 — Structure dowsing hardcodes 2048-block search radius.** It ignores S9/S8/S7 rod range limits.
33. **BUG-033 — Selecting a cached structure yields an exact route waypoint with no activation cost/interference/range check.** Cache is server-global per dimension, so one player's loaded structure becomes another player's information.
34. **BUG-034 — Potion consumption bypasses `CONTROL_BLOCKED` eligibility.** `RECOVERING` players can still consume reinforcement/advancement potions because the item path calls `PotionConsumptionService` directly and `classify()` does not check `blocksAbilities()`.
35. **BUG-035 — Acting anti-farm repeat decay is bypassed by most normal/high successful acting events.** `genuineRiskThreshold=NORMAL` exits before repetition attenuation.
36. **BUG-036 — Spirit Pendulum violates the established method boundary.** It exposes direction/trace/target questions although the method is supposed to express degree/intensity rather than location.
37. **BUG-037 — Illusion duration is dead state.** The cast clears Mob targets once and stores a 100-tick timestamp; no tick logic enforces the illusion during that interval.
38. **BUG-038 — Danger/target divination and pre-attack danger scan ignore hostile players.** World queries scan `Mob`/`Enemy`, so PvP opponents are invisible until an attack event fires.
39. **BUG-039 — ABNORMALITY treats any active status effect as mystical abnormality.** Vanilla potion/beacon effects and body-control's own effects contaminate abnormality/interference divination.
40. **BUG-040 — Backlash only evaluates the newest journal entry every 10 ticks.** Multiple rapid divinations can cause earlier entries to be skipped permanently.
41. **BUG-041 — Divination verification writes `CONFIRMED` on later damage without comparing the original visible revelation.** False “safe” revelations can be confirmed; `CONTRADICTED` is never produced.
42. **BUG-042 — Full BeyonderData NBT is sent unconditionally every second for every player.** Active sustained/dowsing paths can duplicate the same full sync 2–3 times per second; acting history/cooldown maps amplify payload.
43. **BUG-043 — Disabling body control removes external Slow Falling.** It unconditionally removes the effect regardless of source; other body-control effects can linger briefly after toggle-off.
44. **BUG-044 — Damage transfer calculates healing from pre-armor/pre-magic/pre-absorption `LivingHurtEvent` damage.** Heavy mitigation can turn a small final hit into net healing.
45. **BUG-045 — Paper figurine fatality test uses the same pre-reduction damage.** It may consume the figurine for an attack that armor/resistance would have made nonfatal.
46. **BUG-046 — Flame detection uses block-state string `contains("fire"/"campfire")`.** Unlit campfires and unrelated `fire_*` blocks can satisfy flame requirements.
47. **BUG-047 — Underwater breathing identifies water by block-state name rather than FluidState.** Seagrass/kelp/waterlogged water can fail to count as water.
48. **BUG-048 — First server waypoint mirror can erase legacy local 8-slot tactical waypoints.** Server sends empty slots before any old-client-to-server migration; client overwrites local config.
49. **BUG-049 — Pre-v4 permanent-semi-mad migration can produce `permanentSemiMad=true` but `potionPathLocked=false`.** Migration infers permanent semi-mad from old SemiMadness but does not infer the permanent potion lock.
50. **BUG-050 — Looking straight up/down makes Clown roll silently do nothing after cost/cooldown/combat-lock are already applied.** Horizontal look vector is validated only inside the effect function.
51. **BUG-051 — Final C2S waypoint/dowsing packets have no rate limit.** Waypoint sync mutates PersistentData and mirrors every packet; dowsing selection can trigger server structure-cache work.
52. **BUG-052 — Paper dart reports “hit” even when `target.hurt()` returns false.** UI contradicts authoritative server damage result after resource/cost use.
53. **BUG-053 — Underwater breathing can reach air through solid blocks.** It checks for any air 1–5 blocks above but does not require a contiguous water/air path.
54. **BUG-054 — Flame-jump destination checks only the feet block above the fire.** It does not verify headroom, so a one-block-high cavity can be selected and the player can be embedded in a ceiling.
55. **BUG-055 — Paper-figurine escape destination is not collision/safety checked and teleport result is ignored.** Figurine/cooldown/damage cancellation still occur if movement fails; backing into a wall can place the player in solid blocks.
56. **BUG-056 — Spirit vision/body control are treated as transient on death but persisted across normal logout/restart.** Login restores active IDs without startup validation/onEnable, creating inconsistent lifecycle semantics.
57. **BUG-057 — Flame control bypasses normal PvP/player-attack damage handling.** It directly calls `setSecondsOnFire()` on a selected LivingEntity, including players, unlike other offensive skills that use `playerAttack`/`hurt`.
58. **BUG-058 — Illusion clears targets of every nearby Mob, not only mobs targeting the caster.** It can disrupt other players' combat/neutral or tamed-mob targeting.

## Checked but not currently classified as bugs

- Permanent semi-mad / potion lock / inevitable loss capability fields are copied on death clone in the current schema.
- Four custom entity SpawnPlacements are registered correctly; live entities were previously server-summon tested.
- Required S9/S8/S7 material graph is otherwise reachable; Droplet Gem is the confirmed worldgen break.
- Admin `/lotm` command tree is protected by permission level 2.
- Ability C2S IDs are server-whitelisted and `AbilityAccess.has()` rechecks sequence access.
- Cooldown clocks use game-time rather than day-time, so `/time set` is not a simple bypass.
- Structure trace cache clears dimension data on level unload.

## Audit state

Audit is still in progress. This document is intentionally a defect inventory, not a patch log. Fixes must be done only after the user explicitly ends the audit-only phase.
