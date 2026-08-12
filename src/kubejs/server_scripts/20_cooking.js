// BOTW-like food importance: natural regeneration is off.
// Selected food categories grant short contextual bonuses.
// The base healing comes from Minecraft/Farmer's Delight food; these effects add "dish identity".

function wlEffect(player, effect, seconds, amplifier) {
  player.runCommandSilent(`effect give @s ${effect} ${seconds} ${amplifier} true`)
}

ItemEvents.foodEaten('minecraft:golden_carrot', event => {
  wlEffect(event.player, 'minecraft:night_vision', 90, 0)
})
ItemEvents.foodEaten('minecraft:rabbit_stew', event => {
  wlEffect(event.player, 'minecraft:speed', 75, 0)
})
ItemEvents.foodEaten('minecraft:mushroom_stew', event => {
  wlEffect(event.player, 'minecraft:resistance', 60, 0)
})
ItemEvents.foodEaten('minecraft:beetroot_soup', event => {
  wlEffect(event.player, 'minecraft:regeneration', 8, 0)
})
ItemEvents.foodEaten('minecraft:honey_bottle', event => {
  wlEffect(event.player, 'minecraft:regeneration', 5, 0)
})
