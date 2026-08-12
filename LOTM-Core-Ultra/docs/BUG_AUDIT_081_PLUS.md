# LOTM Core v0.0.3a Ultra — Bug Audit Continuation

> Audit-only continuation. No source/JAR fixes are applied here.
>
> Baseline source SHA256: `f0f2d29cebbbc45ce98d403aec97dde48c694bb02b0f6d4df028e0fd7fd04782`
> Production JAR SHA256: `746a8c2a6810ee4c56a4dfa5e83e61eb24362550f52b12ada16f85c97d29c642`
> Minecraft 1.20.1 / Forge 47.4.22 / Java 17

## Confirmed bugs — continuation

81. **BUG-081 — MysticTrace important-file save/load is not crash-safe.** `saveImportant()` overwrites the live file directly; a partial write can truncate it, while load exceptions are swallowed after already-read entries have been inserted, leaving partial ghost state.
82. **BUG-082 — Namespace-less dowsing search entries are accepted by the client but rejected by the server.** For example `diamond_ore` closes the selector after `ResourceLocation.tryParse`, while server `safeTarget()` requires an explicit namespace and silently leaves the old target unchanged.
83. **BUG-083 — BALANCED/SAFEST route guidance can point inside a mountain.** `surface()` clamps height to `playerY+16` even when the real heightmap top is much higher, and route candidates are not checked for feet/head collision or standable ground.
84. **BUG-084 — `POLLUTION_DIRECTION` treats ordinary Monsters as pollution sources.** Vanilla hostile mobs qualify even with zero LOTM corruption.
85. **BUG-085 — `BEYONDER_TRACE` does not query `MysticTraceStore`.** It scans current living entities and treats Enemy/status-effect entities as traces, while real historical traces from departed Beyonders are ignored.
86. **BUG-086 — Dream `SHORT_FUTURE` / `NEAR_FATE` / `PLACE` are current nearby-state queries.** They do not sample future state or a distant bound target; PLACE can fall back to world spawn.
87. **BUG-087 — Acting success messages leak exact digestion values.** Normal player feedback exposes exact gain and current digestion `/100`, contrary to the hidden-backend-number UI target.
88. **BUG-088 — `hudEnabled` config is unused.** Disabling it does not disable the Ultra immersive HUD.
89. **BUG-089 — Route-anchor binding ignores the documented empty-offhand requirement.** Any sneaking block-right-click with the rod can overwrite it with a bound waypoint.
90. **BUG-090 — Dowsing HUD translates most item/entity targets as block keys.** Dynamic item/entity selections can display raw/wrong `block.namespace.path` translation keys.
91. **BUG-091 — Rod inventory lifecycle diverges from the active Session.** Moving an active rod into the backpack keeps server scanning/drain while the HUD disappears; dropping the last rod stops the Session without clearing the dropped stack's active NBT, creating phantom-active state on pickup.
92. **BUG-092 — Dowsing loses target-type semantics.** The server scans dropped ItemEntities before blocks for registry IDs, so a block target can lock a dropped BlockItem and an item target can match its placed block.
93. **BUG-093 — Dowsing Target Catalog `complexity` is dead data.** Complexity does not affect cost, range, budget, accuracy, or feedback.
94. **BUG-094 — `DivinationTarget` / `DivinationTargetType` rank+complexity model is not connected to runtime divination.** Current methods still pass raw string targets.
95. **BUG-095 — Precision-potion MysticTrace metadata hardcodes `seer`, sequence 9 for every formula.** S8/S7 potion-mixing history is recorded with false sequence metadata.
96. **BUG-096 — MysticTrace merge loses event identity.** Merge compares only type/source/distance/time, not abilityId/pathway/sequence; different same-type events can collapse and later metadata overwrites the earlier event identity.
97. **BUG-097 — COMBAT/BLOOD trace strength uses pre-mitigation LivingHurtEvent damage.** Armor/resistance/absorption can make the real wound small while the trace records severe combat/blood.
98. **BUG-098 — Core Beyonder numeric NBT accepts NaN/Infinity.** Clamp/max setters do not reject non-finite values, allowing damaged/external NBT to poison spirituality/sanity/corruption/digestion/loss state calculations and persist NaN.
99. **BUG-099 — Selecting a formula paper after adding ingredients silently discards the already-consumed mixture.** Session amounts/order are cleared without refund or warning.
100. **BUG-100 — Dowsing can run concurrently with meditation.** Neither meditation eligibility nor Dowsing tick mutually excludes the other state.
101. **BUG-101 — Meditation action blocking does not cover generic right-click/container/laboratory interactions.** A meditating player can continue operating ordinary blocks/items while recovery continues.
102. **BUG-102 — Dowsing does not suppress passive spirituality regeneration.** At S7, SEEK and normal ROUTE can produce net spirituality gain while actively divining; S8 normal ROUTE is approximately free.
103. **BUG-103 — Tarot 1/3/5 spread cannot be player-selected.** `TarotSpread.next()` has no call sites; spread size is hardcoded by question category.
104. **BUG-104 — Drawn Tarot card identities do not influence the final revelation.** Cards are generated/displayed independently; the world observation/result resolver never receives the drawn Arcana.

> **BUG-105 withdrawn.** False revelation does rewrite/flip Tarot card NBT after result resolution; do not count 105 as a defect.

106. **BUG-106 — Divination result timestamps are write-only.** Coin/pendulum revelation and Tarot cards never expire, surviving long delays/relog/question changes until overwritten.
107. **BUG-107 — Magician wheel exposes passive-only abilities as active cast slots.** Paper-figurine substitute and underwater breathing can be selected/released, but server active-cast handling only says they are passive.

> **BUG-108 withdrawn.** The HUD key text is compatible with expanding/collapsing the detailed Beyonder HUD while retaining the compact identity/spirituality panel; do not count 108 as a defect.

109. **BUG-109 — Paper weaponization reports/charges success when `hurt()` returns false.** Paper is consumed and full spirituality/cooldown is kept while the server damage result is rejected.
110. **BUG-110 — Paper weapon mode names are hardcoded English (`Blade/Spear/Club`).** Chinese UI receives untranslated English literals inside localized text.
111. **BUG-111 — MysticTrace cleanup is not persisted.** Expired important traces are removed only from memory, remain on disk, reload every restart, and are repeatedly filtered/cleaned again.
112. **BUG-112 — S7 ActingHistory capacity is smaller than its anti-farm time window throughput.** Up to ~112 legitimate S7 history events fit within 12000 ticks but only 64 are retained, allowing old repeat patterns to be evicted and treated as new.
113. **BUG-113 — `clown_composure` acting rule is unreachable.** It has a configured reward/cooldown but no gameplay award call site.
114. **BUG-114 — `magician_flame_chain` acting rule is unreachable.** It is defined but never awarded by any ability/event.
115. **BUG-115 — Dynamic anti-divination fallback rank treats a mortal target as highest rank.** `9 - sequence` maps mortal sequence -1 to 10 then clamp 9, while the backlash service maps a mortal diviner to rank 0.
116. **BUG-116 — Spirit Pendulum hard-floors RITUAL_OUTCOME/ACTION/TARGET degree input to 0.5.** These questions can never produce LOW/MODERATE output and are always HIGH or stronger.
117. **BUG-117 — Spirit Vision applies its 24-entity cap before relevance/threat sorting.** Passive entities can fill the budget and hide a nearby hostile, also suppressing spirit-observation acting reward.
118. **BUG-118 — Magician acting uses a 16×16 chunk region instead of the unified 128×128 acting region.** Moving one block across a chunk boundary can reset repeat decay as `CHANGED_REGION` for low-risk Magician acting.
119. **BUG-119 — Meditation no longer checks `onGround()` after entering MEDITATING.** Removing the support block can leave the player repeatedly anchored/teleported in air while recovery continues.
120. **BUG-120 — Corruption's own harmful-effect refresh is misclassified as combat.** SEVERE/CRITICAL corruption reapplies harmful effects every second; `MobEffectEvent.Added` renews the 5-second combat regen lock and interrupts meditation, permanently blocking natural spirituality regen and repeatedly killing meditation while severe corruption persists.
121. **BUG-121 — Damage Transfer does not verify that healing actually occurred.** Full-health/canceled/zeroed healing still consumes the RecentWound, keeps full spirituality/cooldown cost, and reports success.
122. **BUG-122 — ROUTE fallback can navigate to an unrelated arbitrary MysticTrace.** If direct scanning fails, ROUTE calls trace with the original normal target; unknown trace-filter strings fall through to `t -> true`, so diamond/player/structure/death-point routing can silently point at any nearby trace while retaining the original target label.
123. **BUG-123 — `HiddenFromDivination` does not hide a player from dowsing.** Player scanning obtains the real coordinate; feedback consumes interference/falseBias but ignores `hidden`, and Dowsing bypasses journal/backlash, so the hidden flag itself has no blocking effect.

## Verified exclusions during this continuation

- Four custom creature entity renderers/models/animations were client-render tested after real server summon; no LOTM renderer/model/texture/layer/animation exception appeared.
- Dowsing TRACE categories do use category-specific MysticTrace filters.
- ROUTE SHORTEST/BALANCED/SAFEST are behaviorally distinct.
- Core divination tool recipes and their required Star Crystal dependency are survival-reachable.
- Ability-instability chance is 0 below irreversible-tendency 50 and bounded at the configured tiers.
- Dynamic player dowsing profile can resolve `lotm_player:<name>`; BUG-123 is specifically that its `hidden` field is ignored by Dowsing.
- Admin `/lotm` commands are permission-level 2 and are treated as diagnostic tools; their ability to create test-only inconsistent state is not currently counted as a normal gameplay bug.

## Audit state

Audit remains in progress. No fixes have been applied. Continue numbering new confirmed defects from **BUG-124**; keep 105 and 108 reserved as withdrawn findings.