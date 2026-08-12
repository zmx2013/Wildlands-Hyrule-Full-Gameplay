// ============================================================
// Wildlands Combat Core
// Perfect Dodge -> "bullet-time" emulation + Flurry Rush window
// Perfect Guard -> shield parry window
// ============================================================

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
  p.runCommandSilent('particle minecraft:electric_spark ~ ~1 ~ 0.8 0.6 0.8 0.08 42 force @a[distance=..24]')
  p.runCommandSilent('playsound minecraft:block.amethyst_block.chime player @s ~ ~ ~ 0.85 1.65')
  p.runCommandSilent('title @s actionbar {"text":"完美闪避 · FLURRY RUSH","color":"aqua","bold":true}')
}

function wlPerfectGuard(p) {
  p.persistentData.putInt('wl_guard_cd', 14)
  p.runCommandSilent('effect give @e[type=!minecraft:player,distance=..5,sort=nearest,limit=1] minecraft:slowness 2 6 true')
  p.runCommandSilent('effect give @e[type=!minecraft:player,distance=..5,sort=nearest,limit=1] minecraft:weakness 3 3 true')
  p.runCommandSilent('effect give @e[type=!minecraft:player,distance=..5,sort=nearest,limit=1] minecraft:glowing 2 0 true')
  p.runCommandSilent('particle minecraft:flash ~ ~1 ~ 0 0 0 0 1 force @a[distance=..24]')
  p.runCommandSilent('playsound minecraft:item.shield.block player @s ~ ~ ~ 1 1.7')
  p.runCommandSilent('title @s actionbar {"text":"PERFECT GUARD","color":"gold","bold":true}')
}

PlayerEvents.tick(event => {
  const p = event.player

  wlDec(p, 'wl_dodge_window')
  wlDec(p, 'wl_guard_window')
  wlDec(p, 'wl_flurry_ticks')
  wlDec(p, 'wl_dodge_cd')
  wlDec(p, 'wl_guard_cd')

  const crouch = p.isCrouching()
  const was = p.persistentData.getBoolean('wl_was_crouching')
  if (crouch && !was && p.persistentData.getInt('wl_dodge_cd') <= 0) {
    p.persistentData.putInt('wl_dodge_window', 5)
  }
  p.persistentData.putBoolean('wl_was_crouching', crouch)
})

ItemEvents.rightClicked('minecraft:bow', event => {
  const p = event.player
  if (p.fallDistance <= 0.2) return
  wlNearbySlow(p, 2, 4)
  p.runCommandSilent('effect give @s minecraft:slow_falling 2 0 true')
  p.runCommandSilent('effect give @s minecraft:resistance 2 1 true')
  p.runCommandSilent('title @s actionbar {"text":"AIR FOCUS","color":"aqua","bold":true}')
  p.runCommandSilent('playsound minecraft:block.amethyst_block.resonate player @s ~ ~ ~ 0.55 0.8')
})

ItemEvents.rightClicked('minecraft:shield', event => {
  const p = event.player
  if (p.persistentData.getInt('wl_guard_cd') <= 0) {
    p.persistentData.putInt('wl_guard_window', 4)
  }
})

// KubeJS 1.21 exposes cancellable-style damage control through EntityEvents.beforeHurt.
// Setting damage to zero makes the perfect-dodge / perfect-guard window authoritative server-side.
EntityEvents.beforeHurt(event => {
  const p = event.entity
  if (p.type != 'minecraft:player') return

  if (p.persistentData.getInt('wl_guard_window') > 0) {
    event.setDamage(0)
    p.persistentData.putInt('wl_guard_window', 0)
    wlPerfectGuard(p)
    return
  }

  if (p.persistentData.getInt('wl_dodge_window') > 0) {
    event.setDamage(0)
    p.persistentData.putInt('wl_dodge_window', 0)
    wlPerfectDodge(p)
  }
})
