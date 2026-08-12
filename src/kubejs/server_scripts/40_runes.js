function wlRuneCooldown(p, key, ticks) {
  if (p.persistentData.getInt(key) > 0) return false
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

ItemEvents.rightClicked('kubejs:rune_bomb', event => {
  const p = event.player
  if (!wlRuneCooldown(p, 'wl_bomb_cd', 80)) return
  p.runCommandSilent('execute anchored eyes positioned ^ ^-0.25 ^2.2 run summon minecraft:tnt ~ ~ ~')
})

ItemEvents.rightClicked('kubejs:rune_stasis', event => {
  const p = event.player
  if (!wlRuneCooldown(p, 'wl_stasis_cd', 140)) return
  p.runCommandSilent('effect give @e[type=!minecraft:player,distance=..12,sort=nearest,limit=1] minecraft:slowness 6 255 true')
  p.runCommandSilent('effect give @e[type=!minecraft:player,distance=..12,sort=nearest,limit=1] minecraft:weakness 6 255 true')
})

BlockEvents.rightClicked('minecraft:water', event => {
  if (event.item.id != 'kubejs:rune_cryonis') return
  const p = event.player
  if (!wlRuneCooldown(p, 'wl_cryo_cd', 55)) return
  const x = event.block.x, y = event.block.y, z = event.block.z
  p.server.runCommandSilent(`fill ${x} ${y} ${z} ${x} ${y+3} ${z} minecraft:packed_ice`)
  event.cancel()
})

const WL_METALS = ['minecraft:iron_block','minecraft:raw_iron_block','minecraft:gold_block','minecraft:raw_gold_block','minecraft:copper_block','minecraft:exposed_copper','minecraft:weathered_copper','minecraft:oxidized_copper']
BlockEvents.rightClicked(event => {
  if (event.item.id != 'kubejs:rune_magnesis') return
  const p = event.player
  let carried = p.persistentData.getString('wl_magnesis_block')
  if (carried && carried.length > 0) {
    p.server.runCommandSilent(`setblock ${event.block.x} ${event.block.y+1} ${event.block.z} ${carried} replace`)
    p.persistentData.putString('wl_magnesis_block', '')
    event.cancel(); return
  }
  if (!WL_METALS.includes(event.block.id) || !wlRuneCooldown(p, 'wl_mag_cd', 8)) return
  p.persistentData.putString('wl_magnesis_block', event.block.id)
  event.block.set('minecraft:air')
  event.cancel()
})
