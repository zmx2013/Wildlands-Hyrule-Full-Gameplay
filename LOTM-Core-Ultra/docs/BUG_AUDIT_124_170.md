# LOTM Core v0.0.3a Ultra — Bug Audit 124–170

> Audit-only continuation. **No source fixes are applied.**
> Baseline source SHA256: `f0f2d29cebbbc45ce98d403aec97dde48c694bb02b0f6d4df028e0fd7fd04782`
> Production JAR SHA256: `746a8c2a6810ee4c56a4dfa5e83e61eb24362550f52b12ada16f85c97d29c642`

- **BUG-124** — `underwater_breathing` is only near-surface breathing: it tops up air only when air is found within 5 blocks, so deep/closed water provides no breathing.
- **BUG-125** — Per-chunk trace trim ignores `important`; ordinary stronger traces can evict death/advancement/loss traces before expiry.
- **BUG-126** — Important traces loaded from disk bypass runtime invariants: no 48-per-chunk cap, merge or expired cleanup.
- **BUG-127** — When an existing important trace merges with a later ordinary trace, memory updates but disk is not rewritten because saving checks only the incoming trace's `important` flag.
- **BUG-128** — Global latest-512 important-trace persistence can evict still-valid critical history; high-activity players/dimensions can push out other dimensions' death/advancement/loss records.
- **BUG-129** — Precision mixing, laboratory processing and reagent collection consume items in Creative because they directly `shrink()` without `instabuild` checks.
- **BUG-130** — Tarot reversed cards are not visually inverted; the texture is rendered identically and only the `逆` label/color changes.
- **BUG-131** — Tarot HUD does not show Arcana names; it renders tiny card art plus upright/reversed state, while the localized Arcana name keys are not used by the HUD.
- **BUG-132** — FALSE_REVELATION Tarot can show two different spreads in one reading: the original spread is sent to chat before resolution, then item NBT/HUD cards are rewritten after false revelation is determined.
- **BUG-133** — Magician target search caps the first 256 LivingEntities before LOS/aim filtering; irrelevant entities can hide an actually aimed target.
- **BUG-134** — Illusion caps the first 128 LivingEntities before Mob filtering; passive entities can consume the cap and nearby attackers can be skipped.
- **BUG-135** — Offensive target selection does not exclude spectator players; spectators can intercept Magician/Clown targeting and cause misleading success/cost behavior.
- **BUG-136** — Repeat-potion `+15%` reinforcement is only wired into a subset of ability parameters; many acquired abilities get no effective reinforcement.
- **BUG-137** — Dowsing starts with `lastDrain=0`, so the first tick after activation immediately charges a full one-second maintenance cost.
- **BUG-138** — Sustained abilities charge maintenance on absolute `player.tickCount % 20`, so startup-to-first-maintenance interval varies from almost 0 to almost 1 second.
- **BUG-139** — Dowsing `scanBudget` only constrains random block scans; entity, dropped-item and EXPLORE scans are unbounded by the advertised budget.
- **BUG-140** — BALANCED/SAFEST ROUTE performs eight Monster AABB queries every route refresh (~32 queries/sec/player), outside the scan budget.
- **BUG-141** — Death/bound waypoint nominal range suppresses signal strength but not true bearing/vertical direction, allowing long-range directional tracking far beyond sequence range.
- **BUG-142** — Dowsing `found=false` writes `silent / north / level`; HUD shows a concrete north/same-height direction for complete no-result state.
- **BUG-143** — Dowsing validates `simple_divination` only on a later tick: mortals/blocked players first receive a successful-start state, then generic `exhausted` shutdown.
- **BUG-144** — Dowsing RightClickItem does not consume the event; dual-wield rods can toggle the same player-level Session twice from one click.
- **BUG-145** — VAGUE revelation uses the exact same `trueRevelation()` payload as CLEAR revelation; only the outer label changes, so information is not actually vague.
- **BUG-146** — `safeDirection()` tie handling can make true and false directions identical because safest/most-dangerous both remain the first enum direction on equal scores.
- **BUG-147** — Coin divination is not truly yes/no despite the guide calling it binary; it can return multi-state danger and 4-way action results.
- **BUG-148** — SAFE_DIRECTION ignores terrain/environment hazards; with no hostile entities it simply reports the player's current facing as safest.
- **BUG-149** — Fire/water direction `none()` uses the same text for true and false revelation, so FALSE_REVELATION cannot produce a false result when no source exists.
- **BUG-150** — Fire/water direction scanning uses `dx/dz += 2` at normal radii, permanently skipping roughly 75% of horizontal block coordinates.
- **BUG-151** — Fire/water direction vertical search is fixed to player Y ±2 despite ~44–50 block horizontal range.
- **BUG-152** — Shift batch-add in precision mixing forces at least one unit even when the required amount is already met, creating unintended over-measurement.
- **BUG-153** — Player death can lose server Pending Dream while a notebook ItemStack still carries `V003aDreamPrepared=true` via keepInventory/drop pickup.
- **BUG-154** — Multiple notebooks can simultaneously show `prepared`, while the server stores only one player-level Pending Dream; later preparation silently overwrites earlier pending state.
- **BUG-155** — Custom ores/hard mystic blocks lack proper correct-tool requirements/tags; core ores can drop under hand-breaking and pickaxe semantics are incomplete.
- **BUG-156** — Four live creatures unconditionally drop remains blocks which can be placed/broken into core materials, bypassing intended tool/adult/player-kill/probability harvest gates.
- **BUG-157** — Nine registered/placeable `*_seedling` BlockItems have no survival recipe/loot source; they are Creative-only dead content.
- **BUG-158** — `unstable_potion` and `contaminated_potion` are registered/resource-complete but have no runtime production/use path; the quality system never outputs them.
- **BUG-159 (P0)** — `mystic_extractor` requires `silver_crystal`, but `silver_crystal` has no survival source, blocking the required S9/S8/S7 extraction chain in survival.
- **BUG-160** — `trace_lens` and `mystic_reagent_case` are survival-craftable formal tools with no runtime behavior/capability/UI.
- **BUG-161** — Persistent question-fatigue key includes the automatically observed answer target, so the same player question becomes a fresh key whenever the nearest threat/answer target changes.
- **BUG-162** — Seer/Clown/Magician formula-paper items are fully implemented knowledge items but have no survival acquisition source. This does not block progression because memorized formulas can be mixed directly.
- **BUG-163** — Potion-order validation records only whether each auxiliary ingredient type appeared once, not whether its required quantity was completed; one unit of every aux can bypass the intended aux-before-main ordering rule.
- **BUG-164** — Default LOTM keybinds conflict with vanilla: `L` minimap radar vs Advancements and `P` tactical mode vs Social Interactions.
- **BUG-165** — Meditation start message hardcodes `two seconds`, while preparation time is configurable from 0–1200 ticks.
- **BUG-166** — FALSE_REVELATION Tarot rewrite can create duplicate Arcana in one spread because each slot uses a different modular offset after a no-replacement draw.
- **BUG-167** — Tarot HUD does not preserve/display card-slot meanings (past/present/future or situation/hidden/advice/danger/outcome); those meanings exist only in the initial chat output.
- **BUG-168** — Dream divination and dowsing do not create `DIVINATION` MysticTrace entries, so divination-trace searches cannot observe these two formal methods.
- **BUG-169** — Clown roll invulnerability cancels all `LivingAttackEvent` damage sources, including environmental damage, and can award acrobatics acting for such damage.
- **BUG-170** — Roll ticks/invulnerability/direction are serialized, so disconnect/restart mid-roll resumes forced movement and remaining invulnerability after login.

## Withdrawn numbers

- **BUG-105 withdrawn** — false Tarot revelation does rewrite the held-card HUD state.
- **BUG-108 withdrawn** — the H key is accurately described as expanding/collapsing the Beyonder HUD detail panel.

## Audit state

Next confirmed bug number starts at **BUG-171**. Audit is still in progress; this is not a patch log.