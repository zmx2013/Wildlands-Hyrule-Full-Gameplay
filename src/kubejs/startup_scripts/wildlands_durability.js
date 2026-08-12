ItemEvents.modification(event => {
  const durability = {
    'minecraft:wooden_sword': 42, 'minecraft:stone_sword': 72, 'minecraft:iron_sword': 105,
    'minecraft:golden_sword': 48, 'minecraft:diamond_sword': 240, 'minecraft:netherite_sword': 390,
    'minecraft:wooden_axe': 38, 'minecraft:stone_axe': 68, 'minecraft:iron_axe': 95,
    'minecraft:golden_axe': 44, 'minecraft:diamond_axe': 220, 'minecraft:netherite_axe': 360,
    'minecraft:bow': 260, 'minecraft:crossbow': 330, 'minecraft:trident': 310, 'minecraft:shield': 240
  }
  Object.entries(durability).forEach(([id, value]) => event.modify(id, item => item.maxDamage = value))
})
