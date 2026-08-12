// Great Plateau-style tutorial without quest-book UI.
// Four survival milestones act as the opening trials. They only award once.

function wildlandsTrial(player, key, title) {
  const data = player.persistentData
  if (data.getBoolean(key)) return
  data.putBoolean(key, true)

  let n = data.getInt('wildlands_trial_count') + 1
  data.putInt('wildlands_trial_count', n)
  player.give('kubejs:trial_crest')
  player.tell(Text.gold(`◆ 试炼完成：${title}  (${n}/4)`))
  player.playSound('minecraft:entity.player.levelup', 0.7, 1.35)

  if (n >= 4 && !data.getBoolean('wildlands_glider_unlocked')) {
    player.tell(Text.aqua('四项试炼已经完成。右键古代石板，领取滑翔翼。'))
  }
}

ItemEvents.crafted('minecraft:crafting_table', event => wildlandsTrial(event.player, 'wl_trial_craft', '创造'))
ItemEvents.crafted('minecraft:campfire', event => wildlandsTrial(event.player, 'wl_trial_fire', '火焰'))
ItemEvents.crafted('minecraft:shield', event => wildlandsTrial(event.player, 'wl_trial_guard', '守护'))
ItemEvents.crafted('minecraft:bow', event => wildlandsTrial(event.player, 'wl_trial_hunt', '狩猎'))

ItemEvents.rightClicked('kubejs:ancient_slate', event => {
  const p = event.player
  const data = p.persistentData
  const n = data.getInt('wildlands_trial_count')

  if (!data.getBoolean('wildlands_glider_unlocked')) {
    if (n < 4) {
      p.tell(Text.aqua(`古代石板：高原试炼 ${n}/4`))
      p.tell(Text.gray('创造：工作台 / 火焰：营火 / 守护：盾牌 / 狩猎：弓'))
      return
    }
    data.putBoolean('wildlands_glider_unlocked', true)
    p.give('paraglider:paraglider')
    p.give('kubejs:goddess_token')
    p.give('kubejs:rune_bomb')
    p.give('kubejs:rune_stasis')
    p.give('kubejs:rune_cryonis')
    p.give('kubejs:rune_magnesis')
    p.tell(Text.gold('◆ 滑翔翼已解锁。现在，整个海拉鲁都向你开放。'))
    p.playSound('minecraft:ui.toast.challenge_complete', 1.0, 1.0)
    return
  }

  p.tell(Text.aqua('古代石板：滑翔翼已解锁。'))
  p.tell(Text.gray('攀爬、冲刺、游泳与滑翔共用耐力；营火可制造上升气流。'))
})

ItemEvents.rightClicked('kubejs:goddess_token', event => {
  const p = event.player
  p.tell(Text.gold('女神祈愿：4 枚 Spirit Orb 可换生命容器或耐力容器。'))
  // Paragliders documents this command as the entry point to its bargain UI.
  p.runCommandSilent('paraglider bargain start')
})

ServerEvents.recipes(event => {
  // Prevent skipping the opening progression by crafting the paraglider.
  event.remove({ output: 'paraglider:paraglider' })
})
