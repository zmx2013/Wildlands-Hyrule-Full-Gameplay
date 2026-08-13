# LOTM Core v0.0.3a Ultra — Bug Audit 124–194

Audit-only record. No mod source fixes are included in this commit.

## Corrections carried forward

- BUG-105 remains withdrawn: FALSE_REVELATION does rewrite Tarot HUD/NBT cards after resolution.
- BUG-108 remains withdrawn: the HUD key can reasonably mean expand/collapse the detail panel rather than fully disable HUD.
- BUG-028 earlier broad claim is corrected: normal walking does **not** create important corruption traces every ~2 seconds. The deeper defect is BUG-173: presence/corruption movement sampling compares against the previous tick position, effectively requiring an ~8-block one-tick displacement.
- BUG-018 scope is narrowed: ignored `Inventory.add()` remains a real loss path when the consumed input stack does not free a slot (for example stacked empty potion bottles at final bottling, stacked extraction/preparation inputs). Single-stack container conversions that free the held slot are not automatically affected.

## Confirmed findings

- **BUG-124** — `underwater_breathing` is only near-surface breathing: it refills air only when air is within 5 blocks, so deep/closed underwater areas behave like vanilla drowning.
- **BUG-125** — Per-chunk MysticTrace trim ignores `important`; ordinary strong traces can evict still-valid death/advancement/loss traces.
- **BUG-126** — Important traces loaded from disk bypass per-chunk capacity, merge and expiry invariants until later writes happen.
- **BUG-127** — When an existing important trace merges with a later ordinary trace, memory is updated but the persistent file is not rewritten; restart rolls the trace back.
- **BUG-128** — Global newest-512 important-trace persistence cap can evict still-valid critical history; one active dimension/player can crowd out another.
- **BUG-129** — Precision mixing, distilling, extracting and reagent collection directly `shrink()` items even for creative/instabuild players.
- **BUG-130** — Tarot reversed orientation changes data/text only; the card image itself is never visually inverted.
- **BUG-131** — Tarot HUD omits Arcana names; only tiny card art plus upright/reversed marker is shown (chat does show names).
- **BUG-132** — FALSE_REVELATION Tarot sends the original normal spread to chat first, then rewrites item NBT; chat and HUD can show different spreads for one reading.
- **BUG-133** — Magician target search truncates to the first 256 LivingEntities before LOS/crosshair filtering, so irrelevant entities can hide the actual aimed target.
- **BUG-134** — Illusion truncates to 128 arbitrary LivingEntities before Mob filtering, so passive entities can prevent nearby hostile mobs from being affected.
- **BUG-135** — Magician/Clown attack target selection does not exclude spectator players; spectators can consume targeting and produce failed/false-success ability results.
- **BUG-136** — Repeat-potion +15% reinforcement is only applied to selected parameters; many quantitative abilities remain completely unchanged by reinforcement.
- **BUG-137** — Dowsing Session resets `lastDrain=0`, causing the first full second of drain immediately after activation.
- **BUG-138** — Sustained ability first maintenance payment is tied to absolute `player.tickCount % 20`, so startup-to-first-drain interval varies from almost 0 to 1 second.
- **BUG-139** — Dowsing `scanBudget` limits random block samples only; entity/item/Monster queries are not bounded by that budget.
- **BUG-140** — BALANCED/SAFEST route recalculates eight Monster AABB hazards every 5 ticks, about 32 monster-range queries/sec/player.
- **BUG-141** — Death/bound landmark range only suppresses signal strength; true bearing remains available arbitrarily far beyond the nominal range.
- **BUG-142** — No-result Dowsing is encoded as `silent + north + level`, fabricating a specific direction/height for “no revelation.”
- **BUG-143** — Rod activation reports a formed connection before checking divination eligibility; mortals/blocked players are only rejected on the next tick as “exhausted.”
- **BUG-144** — Normal rod right-click does not consume the interaction; dual-wield rods can toggle the same player Session twice in one click.
- **BUG-145** — VAGUE_REVELATION returns the same full true-revelation payload as CLEAR; only the wrapper label changes.
- **BUG-146** — `safeDirection()` tie-breaking can choose the same direction for safest and most dangerous, making FALSE_REVELATION equal the truth.
- **BUG-147** — Coin divination is not actually binary yes/no; several questions return 3–4 way semantic answers.
- **BUG-148** — SAFE_DIRECTION measures enemy scarcity only; with no enemies it declares the player’s current facing “safest,” ignoring cliffs/lava/terrain.
- **BUG-149** — Fire/water direction “no target” observation uses identical true and false revelations.
- **BUG-150** — Fire/water scanning at normal ranges samples x/z with step 2, permanently skipping about 75% of horizontal grid points.
- **BUG-151** — Fire/water direction scanning searches only Y ±2 despite tens-of-block horizontal range.
- **BUG-152** — Shift/batch precision addition forces at least one unit even when the exact recipe requirement is already met, creating accidental overmeasure.
- **BUG-153** — Death can lose the server Pending Dream while the notebook’s `Prepared` ItemStack NBT survives (keepInventory/dropped-and-recovered), producing split state.
- **BUG-154** — Multiple notebooks can all show Prepared while the server has only one last-wins player-level pending dream.
- **BUG-155** — Star crystal ore, droplet gem ore and other hard mystic blocks lack proper mining tags/`requiresCorrectToolForDrops`, so tool/drop semantics are wrong.
- **BUG-156** — Four Beyonder creatures always drop remains; placing/breaking remains yields key materials and bypasses intended adult/player/tool/chance harvest gates.
- **BUG-157** — Nine registered/placeable seedling items have no survival recipe or loot source.
- **BUG-158** — `unstable_potion` and `contaminated_potion` are registered/resource-complete but never produced or used by runtime quality logic.
- **BUG-159 (P0)** — Mystic Extractor recipe requires `silver_crystal`, which has no survival source; S9 extraction chain is blocked in a clean survival world.
- **BUG-160** — Craftable `trace_lens` and `mystic_reagent_case` have no runtime functionality.
- **BUG-161** — Question fatigue key includes the automatically observed answer target, so the same player question resets to first-use fatigue when nearby target type changes.
- **BUG-162** — All three formula-paper items are formal interactive items but have no survival source (non-blocking because memorized formulas are allowed).
- **BUG-163** — Precision order validation only requires each auxiliary ingredient to appear once before main ingredients, not that required auxiliary quantities are complete.
- **BUG-164** — Default minimap/tactical keys conflict with vanilla defaults: L=Advancements, P=Social Interactions.
- **BUG-165** — Meditation preparation message hardcodes “two seconds” while `meditationPreparationTicks` is configurable 0–1200 ticks.
- **BUG-166** — Block Dowsing clears the last result every 5 ticks before random sampling, causing rare static targets to flicker found↔silent when a later sample misses.
- **BUG-167** — Dowsing range geometry is inconsistent: player=sphere, entity/item=cube, block=cylinder, so nominal range differs by target type.
- **BUG-168** — Dowsing false revelation rerolls every 5 ticks and false bearing uses current gameTime, causing high-frequency truth/false switching and rotating fake direction.
- **BUG-169** — StructureTraceCache is memory-only; server restart forgets all previously discovered structure traces until chunks reload.
- **BUG-170** — Precision `Session.clear()` never clears selected formula; once a paper is selected it sticks across success/failure/manual clear and can misclassify future remembered recipes.
- **BUG-171** — MysticTraceEvents watches wrong Magician cooldown IDs (`wound_transfer`, `illusion`, `paper_weapon`) instead of real `damage_transfer`, `illusion_creation`, `paper_weaponization`.
- **BUG-172** — MysticTraceEvents static per-player Snap map has no logout/server-stop/world cleanup and can leak/cross-contaminate sessions.
- **BUG-173** — Presence/corruption movement trace compares against previous-tick coordinates, requiring ~8 blocks displacement in one tick; ordinary walking/running almost never emits presence history.
- **BUG-174** — Dowsing target screen always opens as SEEK + BALANCED and does not read rod NBT/current target/profile; selecting can unintentionally overwrite a configured rod.
- **BUG-175** — TRACE UI offers `ritual` residue but no runtime producer ever creates `MysticTraceType.RITUAL`.
- **BUG-176** — LOSS_OF_CONTROL / INEVITABLE traces are created at later death location/time rather than where/when the state was entered; no death means no such trace.
- **BUG-177** — Mortal→S9 first advancement emits no ADVANCEMENT trace because no pre-Beyonder Snap exists to compare.
- **BUG-178** — Entity-based divination “radius” is an inflated AABB with no spherical distance filter; corner reach is up to √3× nominal radius.
- **BUG-179** — Spirit Vision and Danger Sense use the same cube-range geometry, inflating diagonal reach beyond nominal range.
- **BUG-180** — Spirit Pendulum runtime cost/cooldown is 8 spirituality/80 ticks, while the locked Ultra spec is 7/70 (coin 6/60, Tarot 10/120).
- **BUG-181** — MYSTIC_INTERFERENCE maps to ordinary `abnormality()` rather than real security/interference/anti-divination state.
- **BUG-182** — `abnormality()` can be true from thunder/status effects while `targetStrength=0`; Pendulum and strength-driven downstream logic report negligible response despite a positive abnormality fact.
- **BUG-183** — Verified MC 1.20.1 `EntityType.toString()` returns description ID (`entity.lotm_core...`), while fixed security profiles use `lotm_core:*`; custom creature anti-divination profiles fail both initial readings and journal backlash.
- **BUG-184** — Pendulum MYSTIC_INTERFERENCE degree uses `targetStrength`, not `interference`.
- **BUG-185** — DreamOverlayEvents `wasSleeping/ticks/question` are not reset when player is null/disconnect/world switch, allowing stale overlay state across sessions.
- **BUG-186** — Sustained abilities execute `onTick()` before that second’s maintenance payment; insufficient spirituality still grants the final unpaid effect/buff tick.
- **BUG-187** — Clown acrobatics can farm genuine-risk digestion with zero fall damage on Slime Blocks; real 1.20.1 bytecode calls `causeFallDamage(distance, 0.0F, ...)`, while LOTM checks distance only.
- **BUG-188** — LOTM commits combat lock/meditation interruption/danger processing from Forge pre-validity Attack hooks; attacks ultimately rejected by invulnerability/attackability can still mutate LOTM state. Attacker-side invalid attacks are included.
- **BUG-189** — Danger Sense acting risk uses raw pre-mitigation LivingAttack amount, systematically overstating actual risk under armor/resistance/absorption.
- **BUG-190** — Fresh rod server Session defaults to `minecraft:diamond_ore`, but activation does not write `V003aTarget`; HUD may have no target until a diamond scan succeeds, and prior player Session can worsen cross-rod state.
- **BUG-191** — Opaque reagent bottle is `stacksTo(1)` but recipe converts 1 glass bottle into **2** opaque bottles: it duplicates physical containers and produces a recipe stack larger than the item’s max stack size.
- **BUG-192** — EXPLORE rare-resource fallback always splits budget across a hardcoded five-target list without dimension filtering; much of the budget is guaranteed wasted in Overworld/Nether/End (and droplet gem is currently non-worldgen).
- **BUG-193** — Active meditation teleports back to anchor without checking current collision/safe space; if blocks are placed/pushed into the anchor, the player can be forced inside solids while meditation continues.
- **BUG-194** — Magician radial wheel selection is driven by real player yaw changes in 40° increments; selecting a skill physically turns the player and therefore changes the aim used when the selected attack is released.

## Next audit number

Continue from **BUG-195**.
