// ============================================================
// World-structure progression terminals.
// Completion is coordinate-keyed, so every physical structure has its own save state.
// ============================================================

function wlCoordKey(prefix, block) {
  return `${prefix}_${block.x}_${block.y}_${block.z}`.split('-').join('m')
}

function wlFirstCompletion(p, key) {
  if (p.persistentData.getBoolean(key)) return false
  p.persistentData.putBoolean(key, true)
  return true
}

// ---------------- SHRINES ----------------
BlockEvents.rightClicked('kubejs:shrine_terminal', event => {
  const p = event.player
  const key = wlCoordKey('wl_shrine', event.block)
  if (!wlFirstCompletion(p, key)) {
    p.runCommandSilent('title @s actionbar {"text":"这座试炼已经完成","color":"gray"}')
    event.cancel()
    return
  }

  p.give('paraglider:spirit_orb')
  p.runCommandSilent('fill ~-24 ~-10 ~-24 ~24 ~12 ~24 minecraft:air replace minecraft:spawner')
  let n = p.persistentData.getInt('wl_shrines_completed') + 1
  p.persistentData.putInt('wl_shrines_completed', n)

  p.runCommandSilent('effect give @s minecraft:regeneration 6 2 true')
  p.runCommandSilent('playsound minecraft:ui.toast.challenge_complete player @s ~ ~ ~ 1 1.25')
  p.runCommandSilent('particle minecraft:end_rod ~ ~1 ~ 1 1.6 1 0.06 70 force @a[distance=..32]')
  p.runCommandSilent(`title @s title {"text":"试炼完成","color":"aqua","bold":true}`)
  p.runCommandSilent(`title @s subtitle {"text":"Spirit Orb · ${n}/120","color":"white"}`)
  event.cancel()
})

// ---------------- TOWERS ----------------
BlockEvents.rightClicked('kubejs:tower_terminal', event => {
  const p = event.player
  const key = wlCoordKey('wl_tower', event.block)
  const first = wlFirstCompletion(p, key)

  if (first) {
    let n = p.persistentData.getInt('wl_towers_activated') + 1
    p.persistentData.putInt('wl_towers_activated', n)
    p.give('kubejs:tower_sigil')
    p.runCommandSilent('playsound minecraft:block.beacon.activate player @s ~ ~ ~ 1 1.35')
    p.runCommandSilent('particle minecraft:end_rod ~ ~1 ~ 1.3 2.0 1.3 0.06 90 force @a[distance=..48]')
    p.runCommandSilent(`title @s title {"text":"区域塔激活","color":"aqua","bold":true}`)
    p.runCommandSilent(`title @s subtitle {"text":"区域扫描 ${n}/15","color":"white"}`)
  } else {
    p.runCommandSilent('effect give @s minecraft:levitation 3 5 true')
    p.runCommandSilent('effect give @s minecraft:slow_falling 12 0 true')
    p.runCommandSilent('playsound minecraft:entity.breeze.wind_burst player @s ~ ~ ~ 0.8 1.25')
    p.runCommandSilent('title @s actionbar {"text":"上升气流启动","color":"aqua"}')
  }
  event.cancel()
})

// ---------------- KOROK ----------------
const WL_KOROK_TYPES = [
  {base:'minecraft:moss_block',                  need:'minecraft:polished_andesite', hint:'石环缺少最后一块石头'},
  {base:'minecraft:stone',                       need:'minecraft:arrow',             hint:'观察四周的靶标'},
  {base:'minecraft:oak_leaves',                  need:'minecraft:poppy',             hint:'花朵排列似乎缺少终点'},
  {base:'minecraft:flowering_azalea_leaves',     need:'minecraft:apple',             hint:'树与供品'},
  {base:'minecraft:polished_andesite',           need:'minecraft:polished_andesite', hint:'两侧方块图案并不对称'},
  {base:'minecraft:cherry_leaves',               need:'minecraft:cherry_sapling',    hint:'让树木重新延续'},
  {base:'minecraft:birch_leaves',                need:'minecraft:honey_bottle',      hint:'蜂巢散发着甜香'},
  {base:'minecraft:dark_oak_leaves',             need:'minecraft:feather',           hint:'风在这里留下痕迹'}
]

BlockEvents.rightClicked('kubejs:korok_pedestal', event => {
  const p = event.player
  const b = event.block
  const key = wlCoordKey('wl_korok', b)
  if (p.persistentData.getBoolean(key)) {
    p.runCommandSilent('title @s actionbar {"text":"呀哈哈！这里已经找到过了","color":"green"}')
    event.cancel()
    return
  }

  let puzzle = WL_KOROK_TYPES[0]
  for (let t of WL_KOROK_TYPES) {
    let ok = p.server.runCommandSilent(`execute if block ${b.x} ${b.y-1} ${b.z} ${t.base}`)
    if (ok > 0) {
      puzzle = t
      break
    }
  }

  if (event.item.id != puzzle.need) {
    p.runCommandSilent(`title @s actionbar {"text":"${puzzle.hint}……","color":"yellow"}`)
    p.runCommandSilent('playsound minecraft:block.note_block.hat player @s ~ ~ ~ 0.4 0.8')
    event.cancel()
    return
  }

  if (!p.isCreative()) event.item.count--
  p.persistentData.putBoolean(key, true)
  let n = p.persistentData.getInt('wl_koroks_found') + 1
  p.persistentData.putInt('wl_koroks_found', n)
  p.give('kubejs:korok_seed')

  p.runCommandSilent('playsound minecraft:entity.allay.ambient_with_item player @s ~ ~ ~ 0.9 1.55')
  p.runCommandSilent('particle minecraft:happy_villager ~ ~1 ~ 0.8 1.2 0.8 0.1 55 force @a[distance=..24]')
  p.runCommandSilent('title @s title {"text":"呀哈哈！","color":"green","bold":true}')
  p.runCommandSilent(`title @s subtitle {"text":"森灵种子 ${n}/900","color":"gold"}`)
  event.cancel()
})

// ---------------- FOUR GREAT DUNGEONS ----------------
const WL_DUNGEONS = {
  'kubejs:dungeon_terminal_wind':   {id:'wind',   label:'风之神兽', sigil:'kubejs:champion_sigil_wind'},
  'kubejs:dungeon_terminal_water':  {id:'water',  label:'水之神兽', sigil:'kubejs:champion_sigil_water'},
  'kubejs:dungeon_terminal_fire':   {id:'fire',   label:'火之神兽', sigil:'kubejs:champion_sigil_fire'},
  'kubejs:dungeon_terminal_desert': {id:'desert', label:'雷沙神兽', sigil:'kubejs:champion_sigil_desert'}
}

Object.entries(WL_DUNGEONS).forEach(([blockId, d]) => {
  BlockEvents.rightClicked(blockId, event => {
    const p = event.player
    const key = wlCoordKey(`wl_${d.id}_terminal`, event.block)
    if (!wlFirstCompletion(p, key)) {
      p.runCommandSilent('title @s actionbar {"text":"终端已激活","color":"gray"}')
      event.cancel()
      return
    }

    let countKey = `wl_${d.id}_terminals`
    let n = p.persistentData.getInt(countKey) + 1
    p.persistentData.putInt(countKey, n)

    p.runCommandSilent('playsound minecraft:block.beacon.power_select player @s ~ ~ ~ 0.8 1.35')
    p.runCommandSilent('particle minecraft:electric_spark ~ ~1 ~ 0.6 0.9 0.6 0.06 45 force @a[distance=..30]')
    p.runCommandSilent(`title @s subtitle {"text":"${d.label} 控制终端 ${n}/5","color":"aqua"}`)

    if (n >= 5 && !p.persistentData.getBoolean(`wl_${d.id}_ready`)) {
      p.persistentData.putBoolean(`wl_${d.id}_ready`, true)
      p.runCommandSilent(`title @s title {"text":"主控制室已解锁","color":"gold","bold":true}`)
    }
    event.cancel()
  })
})

function wlBossAltar(event, id, label, mob, sigil) {
  const p = event.player
  if (!p.persistentData.getBoolean(`wl_${id}_ready`)) {
    p.runCommandSilent('title @s actionbar {"text":"必须先激活 5 个控制终端","color":"red"}')
    event.cancel()
    return
  }

  const done = `wl_${id}_dungeon_complete`
  if (p.persistentData.getBoolean(done)) {
    p.runCommandSilent('title @s actionbar {"text":"此神兽已被净化","color":"green"}')
    event.cancel()
    return
  }

  const spawnedKey = `wl_${id}_boss_spawned`
  if (!p.persistentData.getBoolean(spawnedKey)) {
    p.runCommandSilent(`summon ${mob} ~ ~2 ~ {PersistenceRequired:1b,Tags:["wildlands_dungeon_boss","wildlands_${id}_boss"]}`)
    p.persistentData.putBoolean(spawnedKey, true)
    p.runCommandSilent('playsound minecraft:entity.ender_dragon.growl player @s ~ ~ ~ 0.65 1.15')
    p.runCommandSilent(`title @s title {"text":"${label} · 灾厄显现","color":"red","bold":true}`)
    event.cancel()
    return
  }

  const alive = p.runCommandSilent(`execute if entity @e[tag=wildlands_${id}_boss,distance=..96]`)
  if (alive > 0) {
    p.runCommandSilent('title @s actionbar {"text":"灾厄仍然存在","color":"red"}')
    event.cancel()
    return
  }

  p.give(sigil)
  p.persistentData.putBoolean(done, true)
  let clear = p.persistentData.getInt('wl_dungeons_completed') + 1
  p.persistentData.putInt('wl_dungeons_completed', clear)
  p.runCommandSilent('playsound minecraft:ui.toast.challenge_complete player @s ~ ~ ~ 1 1.15')
  p.runCommandSilent(`title @s title {"text":"${label} · 净化完成","color":"gold","bold":true}`)
  p.runCommandSilent(`title @s subtitle {"text":"大型地下城 ${clear}/4","color":"aqua"}`)
  event.cancel()
}

BlockEvents.rightClicked('kubejs:boss_altar_wind', event =>
  wlBossAltar(event, 'wind', '风之神兽', 'minecraft:phantom', 'kubejs:champion_sigil_wind'))
BlockEvents.rightClicked('kubejs:boss_altar_water', event =>
  wlBossAltar(event, 'water', '水之神兽', 'minecraft:elder_guardian', 'kubejs:champion_sigil_water'))
BlockEvents.rightClicked('kubejs:boss_altar_fire', event =>
  wlBossAltar(event, 'fire', '火之神兽', 'minecraft:ravager', 'kubejs:champion_sigil_fire'))
BlockEvents.rightClicked('kubejs:boss_altar_desert', event =>
  wlBossAltar(event, 'desert', '雷沙神兽', 'minecraft:warden', 'kubejs:champion_sigil_desert'))
