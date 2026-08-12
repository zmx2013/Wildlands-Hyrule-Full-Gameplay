// ============================================================
// Wildlands Rune Core
// Bomb / Stasis / Cryonis / Magnesis
// ============================================================

function wlRuneCooldown(p, key, ticks) {
  if (p.persistentData.getInt(key) > 0) {
    p.runCommandSilent('playsound minecraft:block.note_block.hat player @s ~ ~ ~ 0.35 0.65')
    return false
  }
  p.persistentData.putInt(key, ticks)
  return true
}

PlayerEvents.tick(event => {
  const p = event.player
  ;['wl_bomb_cd','wl_stasis_cd','wl_cryo_cd','wl_mag_cd'].forEach(key => {
    let v = p.persistentData.getInt(key)
    if (v > 0) p.persistentData.putInt(key, v - 1)
  })
})

// Remote-bomb style rune: deploys a primed explosive in front of the player.
ItemEvents.rightClicked('kubejs:rune_bomb', event => {
  const p = event.player
  if (!wlRuneCooldown(p, 'wl_bomb_cd', 80)) return
  p.runCommandSilent('execute anchored eyes positioned ^ ^-0.25 ^2.2 run summon minecraft:tnt ~ ~ ~')
  p.runCommandSilent('playsound minecraft:block.respawn_anchor.charge player @s ~ ~ ~ 0.7 1.35')
  p.runCommandSilent('particle minecraft:electric_spark ^ ^1 ^1.4 0.3 0.3 0.3 0.03 18 force @s')
})

// Stasis: freezes the nearest non-player entity for a short interval.
ItemEvents.rightClicked('kubejs:rune_stasis', event => {
  const p = event.player
  if (!wlRuneCooldown(p, 'wl_stasis_cd', 140)) return
  p.runCommandSilent('effect give @e[type=!minecraft:player,distance=..12,sort=nearest,limit=1] minecraft:slowness 6 255 true')
  p.runCommandSilent('effect give @e[type=!minecraft:player,distance=..12,sort=nearest,limit=1] minecraft:weakness 6 255 true')
  p.runCommandSilent('effect give @e[type=!minecraft:player,distance=..12,sort=nearest,limit=1] minecraft:glowing 6 0 true')
  p.runCommandSilent('playsound minecraft:block.amethyst_cluster.hit player @s ~ ~ ~ 0.8 0.55')
  p.runCommandSilent('particle minecraft:end_rod ^ ^1 ^3 0.5 0.5 0.5 0.03 32 force @s')
})

// Cryonis: turn a water target into a climbable four-block ice pillar.
BlockEvents.rightClicked('minecraft:water', event => {
  if (event.item.id != 'kubejs:rune_cryonis') return
  const p = event.player
  if (!wlRuneCooldown(p, 'wl_cryo_cd', 55)) return

  const x = event.block.x
  const y = event.block.y
  const z = event.block.z
  p.server.runCommandSilent(`fill ${x} ${y} ${z} ${x} ${y+3} ${z} minecraft:packed_ice`)
  p.runCommandSilent('playsound minecraft:block.glass.place player @s ~ ~ ~ 0.9 0.7')
  p.server.runCommandSilent(`particle minecraft:snowflake ${x} ${y+2} ${z} 0.5 1.5 0.5 0.04 48 force`)
  event.cancel()
})

// Magnesis: first click picks up a whitelisted metal block, second click places it above a target.
// This is a deterministic "move block" implementation, not a fake visual-only effect.
const WL_METALS = [
  'minecraft:iron_block', 'minecraft:raw_iron_block',
  'minecraft:gold_block', 'minecraft:raw_gold_block',
  'minecraft:copper_block', 'minecraft:exposed_copper',
  'minecraft:weathered_copper', 'minecraft:oxidized_copper',
  'minecraft:cut_copper', 'minecraft:exposed_cut_copper',
  'minecraft:weathered_cut_copper', 'minecraft:oxidized_cut_copper'
]

BlockEvents.rightClicked(event => {
  if (event.item.id != 'kubejs:rune_magnesis') return
  const p = event.player
  let carried = p.persistentData.getString('wl_magnesis_block')

  if (carried && carried.length > 0) {
    const x = event.block.x
    const y = event.block.y + 1
    const z = event.block.z
    p.server.runCommandSilent(`setblock ${x} ${y} ${z} ${carried} replace`)
    p.persistentData.putString('wl_magnesis_block', '')
    p.runCommandSilent('playsound minecraft:block.iron_block.place player @s ~ ~ ~ 0.75 1.45')
    p.persistentData.putInt('wl_mag_cd', 8)
    event.cancel()
    return
  }

  if (!WL_METALS.includes(event.block.id)) return
  if (!wlRuneCooldown(p, 'wl_mag_cd', 8)) return

  carried = event.block.id
  p.persistentData.putString('wl_magnesis_block', carried)
  event.block.set('minecraft:air')
  p.runCommandSilent('playsound minecraft:block.beacon.activate player @s ~ ~ ~ 0.55 1.75')
  p.runCommandSilent('title @s actionbar {"text":"磁力锁定：再次点击方块以放置","color":"aqua"}')
  event.cancel()
})
