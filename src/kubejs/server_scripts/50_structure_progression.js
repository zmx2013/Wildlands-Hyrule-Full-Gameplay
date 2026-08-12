function wlCoordKey(prefix, block) { return `${prefix}_${block.x}_${block.y}_${block.z}`.split('-').join('m') }
function wlFirstCompletion(p, key) {
  if (p.persistentData.getBoolean(key)) return false
  p.persistentData.putBoolean(key, true)
  return true
}

BlockEvents.rightClicked('kubejs:shrine_terminal', event => {
  const p = event.player, key = wlCoordKey('wl_shrine', event.block)
  if (!wlFirstCompletion(p, key)) return event.cancel()
  p.give('paraglider:spirit_orb')
  p.persistentData.putInt('wl_shrines_completed', p.persistentData.getInt('wl_shrines_completed') + 1)
  event.cancel()
})

BlockEvents.rightClicked('kubejs:tower_terminal', event => {
  const p = event.player, key = wlCoordKey('wl_tower', event.block)
  if (wlFirstCompletion(p, key)) {
    p.persistentData.putInt('wl_towers_activated', p.persistentData.getInt('wl_towers_activated') + 1)
    p.give('kubejs:tower_sigil')
  } else {
    p.runCommandSilent('effect give @s minecraft:levitation 3 5 true')
    p.runCommandSilent('effect give @s minecraft:slow_falling 12 0 true')
  }
  event.cancel()
})

const WL_KOROK_TYPES = [
  {base:'minecraft:moss_block',need:'minecraft:polished_andesite'}, {base:'minecraft:stone',need:'minecraft:arrow'},
  {base:'minecraft:oak_leaves',need:'minecraft:poppy'}, {base:'minecraft:flowering_azalea_leaves',need:'minecraft:apple'},
  {base:'minecraft:polished_andesite',need:'minecraft:polished_andesite'}, {base:'minecraft:cherry_leaves',need:'minecraft:cherry_sapling'},
  {base:'minecraft:birch_leaves',need:'minecraft:honey_bottle'}, {base:'minecraft:dark_oak_leaves',need:'minecraft:feather'}
]
BlockEvents.rightClicked('kubejs:korok_pedestal', event => {
  const p = event.player, b = event.block, key = wlCoordKey('wl_korok', b)
  if (p.persistentData.getBoolean(key)) return event.cancel()
  let puzzle = WL_KOROK_TYPES[0]
  for (let t of WL_KOROK_TYPES) if (p.server.runCommandSilent(`execute if block ${b.x} ${b.y-1} ${b.z} ${t.base}`) > 0) { puzzle=t; break }
  if (event.item.id != puzzle.need) return event.cancel()
  if (!p.isCreative()) event.item.count--
  p.persistentData.putBoolean(key, true)
  p.persistentData.putInt('wl_koroks_found', p.persistentData.getInt('wl_koroks_found') + 1)
  p.give('kubejs:korok_seed')
  event.cancel()
})

const WL_DUNGEONS = {
  'kubejs:dungeon_terminal_wind':{id:'wind'}, 'kubejs:dungeon_terminal_water':{id:'water'},
  'kubejs:dungeon_terminal_fire':{id:'fire'}, 'kubejs:dungeon_terminal_desert':{id:'desert'}
}
Object.entries(WL_DUNGEONS).forEach(([blockId,d]) => BlockEvents.rightClicked(blockId, event => {
  const p=event.player, key=wlCoordKey(`wl_${d.id}_terminal`, event.block)
  if (!wlFirstCompletion(p,key)) return event.cancel()
  const countKey=`wl_${d.id}_terminals`, n=p.persistentData.getInt(countKey)+1
  p.persistentData.putInt(countKey,n)
  if (n>=5) p.persistentData.putBoolean(`wl_${d.id}_ready`, true)
  event.cancel()
}))
