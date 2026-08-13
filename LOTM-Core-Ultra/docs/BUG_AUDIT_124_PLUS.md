# LOTM Core v0.0.3a Ultra — Bug Audit 124+

> Continuation of the audit-only defect inventory. **No fixes are applied in this phase.**
>
> Source SHA256: `f0f2d29cebbbc45ce98d403aec97dde48c694bb02b0f6d4df028e0fd7fd04782`
> Production JAR SHA256: `746a8c2a6810ee4c56a4dfa5e83e61eb24362550f52b12ada16f85c97d29c642`
> Minecraft 1.20.1 / Forge 47.4.22 / Java 17

## Confirmed bugs

124. **BUG-124 — Underwater Breathing is only near-surface breathing.** The passive tops air only when an air block is found within five blocks above; deep/closed underwater environments still consume air normally despite the ability name.
125. **BUG-125 — Per-chunk trace trimming does not protect important traces.** The 48-entry cap sorts only by current strength, so ordinary recent traces can evict older still-valid death/advancement/loss traces.
126. **BUG-126 — Loaded important traces bypass runtime trace invariants.** Disk restore directly appends traces without per-chunk 48 cap, merge or expired cleanup, so restart state differs from runtime state.
127. **BUG-127 — Merging an existing important trace with an ordinary incoming trace is not persisted.** The merged in-memory trace changes, but save is triggered only when the incoming trace itself is important; restart rolls the trace back.
128. **BUG-128 — Global 512-entry important-trace persistence cap can evict still-valid critical history.** High-activity players/dimensions can crowd out old but unexpired death/advancement/loss traces from disk.
129. **BUG-129 — Precision mixing/laboratory/reagent collection ignore creative `instabuild`.** Their raw `ItemStack.shrink()` paths consume materials/bottles even for creative players.
130. **BUG-130 — Reversed Tarot cards are not visually inverted.** The same upright texture blit is used for upright/reversed; only a small orientation label/color changes.
131. **BUG-131 — Tarot HUD does not show Arcana names.** Card-name translations exist and names are sent once in chat, but the persistent HUD shows only a small card image plus upright/reversed marker.
132. **BUG-132 — FALSE_REVELATION Tarot can show two different spreads for one reading.** The original spread is sent to chat before resolution; false-revelation handling later rewrites ItemStack/HUD cards, so chat and HUD disagree.
133. **BUG-133 — Magician target search truncates to 256 living entities before LOS/aim filtering.** Irrelevant entities can consume the budget and hide a valid aimed target.
134. **BUG-134 — Illusion truncates to 128 arbitrary living entities before Mob filtering.** Passive/irrelevant entities can consume the cap so nearby hostile mobs are untouched while the cast still succeeds.
135. **BUG-135 — Magician active target selection does not exclude spectator/creative/invulnerable players.** A nearer invalid player can block a valid target behind them.
136. **BUG-136 — Illusion counts any Mob as successfully misdirected even when its target was already null.** Passive/idle mobs can generate HIGH misdirection acting credit without any actual target change.
137. **BUG-137 — Illusion with zero affected entities still reports success and grants LOW prepared-trick acting credit.** Empty-space casts can progress acting despite changing nothing.
138. **BUG-138 — Paper-dart target selection does not exclude protected/invulnerable entities.** An invalid nearer entity can absorb targeting and block a valid target behind it; BUG-052 separately covers the false hit message.
139. **BUG-139 — Sustained effects run before their maintenance payment.** A player who cannot pay still receives that tick's spirit-vision/body-control effect before shutdown.
140. **BUG-140 — Sustained maintenance billing is aligned to global `player.tickCount % 20`, not activation time.** First maintenance can occur anywhere from 0–19 ticks after paying the activation cost.
141. **BUG-141 — Dowsing SAFEST/EXPLORE threat scans use `Monster`, missing hostile `Enemy` types such as ghasts/phantoms/slimes/dragon.**
142. **BUG-142 — Dowsing selector always opens as SEEK/BALANCED.** It does not read current rod mode/profile, so selecting a new target can silently reset an existing TRACE/ROUTE/SAFEST setup.
143. **BUG-143 — `MysticTraceStore` static DATA/loaded state is never reset on world/server unload.** Integrated-server world A traces can remain in memory when world B is opened in the same JVM.
144. **BUG-144 — Rod NBT can remain `V003aActive=true` across server restart while the in-memory Session is gone.** HUD shows stale signal/direction although no scan or drain is running.
145. **BUG-145 — Dream overlay static state is not reset on disconnect/world change.** An in-progress overlay/sleep edge can carry into another world/server.
146. **BUG-146 — Main-channel meditation/spirit-vision/body-control toggle packets have no server rate limiting.** Modified clients can spam main-thread state changes, messages and full data syncs.
147. **BUG-147 — Clown roll acting risk uses pre-mitigation `LivingAttackEvent` damage.** Heavy armor/resistance can turn a truly low-risk hit into HIGH/EXTREME acting credit.
148. **BUG-148 — Danger-sense incoming-attack risk also uses pre-mitigation damage.** It can award inflated `danger_foreseen` risk for attacks that would be heavily reduced.
149. **BUG-149 — Danger-sense proximity scan ignores LOS/path reachability.** A hostile safely caged behind solid blocks within six blocks can repeatedly generate HIGH danger acting events.
150. **BUG-150 — Flame-control extinguish bypasses normal player block-break/protection hooks.** It calls `destroyBlock` directly instead of normal player/Forge break permission flow.
151. **BUG-151 — `unstable_potion` and `contaminated_potion` are registered/modelled/translated but have no gameplay source or behavior.** Low-quality real potions stay normal sequence potion Items with NBT instead.
152. **BUG-152 — Legacy isolated Items (`divination_medium`, `spirit_eye`, `midnight_flower`) are dead registrations.** They have registry/model/lang data but no gameplay source/use and are not part of current systems.
153. **BUG-153 — `trace_lens` and `mystic_reagent_case` are craftable functional-name items with no implemented behavior.** The reagent case is not even exposed in the LOTM creative tab.
154. **BUG-154 — Shift batch-add forces at least one extra ingredient after the exact required amount is already present.** `Math.max(1, required-current)` turns a precise mixture into an overdose.
155. **BUG-155 — Ingredient-order penalty depends on click count, not amount/order semantics.** Adding five units in one shift-click incurs one penalty step; five normal clicks incurs five penalties for the same material amount at the same stage.
156. **BUG-156 — Non-death Player Clone (notably End→Overworld return) clears selected cooldowns/combat-regen lock/transient activities.** `copyFrom` performs these clears regardless of `afterDeath`.
157. **BUG-157 — Structure cache classification ignores namespace and matches only `ResourceLocation.getPath()`.** Mod structures with vanilla-like paths can be misclassified as vanilla village/stronghold/etc.
158. **BUG-158 — Divination post-verification treats any positive hurt event as confirmation for DANGER/COMBAT_OUTCOME.** Fall/fire/lava/cactus/hunger/drowning can confirm a combat reading.
159. **BUG-159 — ROUTE can bypass dowsing range through local guide points.** Remote bound/death coordinates are accepted without distance gate, BALANCED/SAFEST repeatedly convert them to ~8-block guides; SHORTEST can also expose correct direction/vertical while signal is silent.
160. **BUG-160 — Cached structure selection rewrites the target to generic `bound_waypoint`, stripping the original `lotm_structure:*` identity/security profile.**
161. **BUG-161 — Dowsing false revelation rerolls every five ticks and wrong bearing changes with time.** The rod flickers between true and changing false directions, allowing temporal sampling of the real bearing.
162. **BUG-162 — Generic `minecraft:player` EntityType tracking bypasses named-player dynamic anti-divination.** It can find the nearest player without using `lotm_player:<name>` security/hidden fields.
163. **BUG-163 — TRACE UI exposes `lotm_trace:ritual`, but no gameplay path ever creates `MysticTraceType.RITUAL`.** The normal UI target is permanently silent.
164. **BUG-164 — `V003aBoundLabel` is written for structure/tactical waypoint bindings but never read.** HUD loses structure/slot identity and shows only a generic bound anchor.
165. **BUG-165 — Guaranteed creature-remains drops bypass intended rare/tool material harvesting.** Each creature always drops a placeable remains BlockItem; breaking it then guarantees the key potion material via block loot.
166. **BUG-166 — Custom hard blocks/ores/machines have no `mineable/*` block tags.** Pickaxes are not recognized with normal tool effectiveness; blocks also do not require the correct tool.
167. **BUG-167 — Precision-mixing `Session.clear()` never clears the selected formula.** Completed/failed/cleared batches invisibly retain the prior recipe and suppress auto-identification for the next batch.
168. **BUG-168 — Per-step mixing timestamps are write-only.** Every Step stores a tick, but quality uses only global first-to-bottle freshness and material click order; timing between individual additions has no effect.
169. **BUG-169 — Some MysticTrace writers truncate live coordinates with `(int)` instead of floor.** Negative coordinates can be off by one and cross the wrong chunk boundary (precision potion + generic divination + Tarot trace writers).
170. **BUG-170 — Dowsing-selection server packets do not require the rod to be currently held.** Any rod anywhere in inventory is accepted/modified, compounding multi-rod Session ambiguity.
171. **BUG-171 — Named-player dowsing UI/server allow the caster to select and track themselves.** The self target becomes a valid zero-distance continuously draining target.
172. **BUG-172 — Interleaving a different acting rule resets repetition occurrence to 1.** `latestComparable()` finds the prior same-rule record, but `consecutiveOccurrences()` starts from global history tail and breaks on the intervening different pattern, bypassing repeat decay.

## Notes / non-bugs checked in this range

- BUG-105 and BUG-108 were withdrawn earlier and remain unused; do not resurrect/reuse those numbers.
- Four custom creature renderer/model runtime test remained clean.
- Player list in dowsing selector comes from the full connection player list, not merely nearby rendered players.
- Tarot cards do not duplicate within a spread; false revelation does rewrite HUD card state, but BUG-132 is the chat/HUD timing split.
- Immediate coin/pendulum/Tarot readings resolve once; repeated false-revelation rerolls are specific to sustained dowsing.
- Dowsing range math uses consistent squared distances in paths that compare `Session.best`; no squared-vs-linear signal bug was confirmed.
- Mixing severely underdosed auxiliary ingredients can still bottle a low-quality normal potion Item, but the quality/instability system deliberately carries that risk; not classified separately.
- Laboratory/prep conversion quantities cover all current S9/S8/S7 formula units; no additional ingredient reachability break found here.

## Audit state

Audit is still in progress. Continue from **BUG-173**. This is a defect inventory only; fixes must wait until the user explicitly ends audit-only mode.
