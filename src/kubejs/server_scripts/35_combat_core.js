function wlDec(p, key) {
  let v = p.persistentData.getInt(key)
  if (v > 0) p.persistentData.putInt(key, v - 1)
}

function wlNearbySlow(p, seconds, amplifier) {
  p.runCommandSilent(`effect give @e[type=!minecraft:player,distance=..14,sort=nearest,limit=24] minecraft:slowness ${seconds} ${amplifier} true`)
  p.runCommandSilent(`effect give @e[type=!minecraft:player,distance=..14,sort=nearest,limit=24] minecraft:weakness ${seconds} 1 true`)
}

function wlPerfectDodge(p) {
  p.persistentData.putInt('wl_flurry_ticks', 38)
  p.persistentData.putInt('wl_dodge_cd', 18)
  wlNearbySlow(p, 2, 4)
  p.runCommandSilent('effect give @s minecraft:speed 2 2 true')
  p.runCommandSilent('effect give @s minecraft:haste 2 2 true')
  p.runCommandSilent('effect give @s minecraft:strength 2 1 true')
  p.runCommandSilent('title @s actionbar {"text":"完美闪避 · FLURRY RUSH","color":"aqua","bold":true}')
}

function wlPerfectGuard(p) {
  p.persistentData.putInt('wl_guard_cd', 14)
  p.runCommandSilent('effect give @e[type=!minecraft:player,distance=..5,sort=nearest,limit=1] minecraft:slowness 2 6 true')
  p.runCommandSilent('effect give @e[type=!minecraft:player,distance=..5,sort=nearest,limit=1] minecraft:weakness 3 3 true')
  p.runCommandSilent('title @s actionbar {"text":"PERFECT GUARD","color":"gold","bold":true}')
}

PlayerEvents.tick(event => {
  const p = event.player
  ;['wl_dodge_window','wl_guard_window','wl_flurry_ticks','wl_dodge_cd','wl_guard_cd'].forEach(k => wlDec(p, k))
  const crouch = p.isCrouching()
  const was = p.persistentData.getBoolean('wl_was_crouching')
  if (crouch && !was && p.persistentData.getInt('wl_dodge_cd') <= 0) p.persistentData.putInt('wl_dodge_window', 5)
  p.persistentData.putBoolean('wl_was_crouching', crouch)
})

ItemEvents.rightClicked('minecraft:bow', event => {
  const p = event.player
  if (p.fallDistance <= 0.2) return
  wlNearbySlow(p, 2, 4)
  p.runCommandSilent('effect give @s minecraft:slow_falling 2 0 true')
  p.runCommandSilent('title @s actionbar {"text":"AIR FOCUS","color":"aqua","bold":true}')
})

ItemEvents.rightClicked('minecraft:shield', event => {
  const p = event.player
  if (p.persistentData.getInt('wl_guard_cd') <= 0) p.persistentData.putInt('wl_guard_window', 4)
})

EntityEvents.hurt(event => {
  const p = event.entity
  if (p.type != 'minecraft:player') return
  if (p.persistentData.getInt('wl_guard_window') > 0) {
    event.cancel(); p.persistentData.putInt('wl_guard_window', 0); wlPerfectGuard(p); return
  }
  if (p.persistentData.getInt('wl_dodge_window') > 0) {
    event.cancel(); p.persistentData.putInt('wl_dodge_window', 0); wlPerfectDodge(p)
  }
})
