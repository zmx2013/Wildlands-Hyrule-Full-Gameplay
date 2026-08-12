// Wildlands global survival rules.
// Uses only server-side commands so the rules stay applied to the imported Hyrule world.
PlayerEvents.loggedIn(event => {
  const p = event.player
  const data = p.persistentData

  p.server.runCommandSilent('gamerule naturalRegeneration false')
  p.server.runCommandSilent('gamerule keepInventory false')
  p.server.runCommandSilent('gamerule reducedDebugInfo true')
  p.server.runCommandSilent('difficulty hard')

  if (!data.getBoolean('wildlands_first_join')) {
    data.putBoolean('wildlands_first_join', true)
    data.putInt('wildlands_trial_count', 0)
    data.putBoolean('wildlands_glider_unlocked', false)
    p.give('kubejs:ancient_slate')
    p.tell(Text.gold('【荒野回响】你在海拉鲁醒来。'))
    p.tell(Text.gray('不要看坐标。观察山峰、道路、塔与遗迹决定方向。'))
    p.tell(Text.aqua('古代石板记录四项高原试炼。完成后可解锁滑翔翼。'))
  }
})
