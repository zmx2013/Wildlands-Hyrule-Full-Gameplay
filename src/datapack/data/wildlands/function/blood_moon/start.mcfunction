scoreboard players operation #last_blood_day wl_state = #day wl_time
title @a title {"text":"血 月","color":"dark_red","bold":true}
title @a subtitle {"text":"荒野中的敌人重新苏醒","color":"red"}
execute as @a at @s run playsound minecraft:entity.ender_dragon.growl master @s ~ ~ ~ 0.55 0.7
execute as @a at @s run particle minecraft:large_smoke ~ ~4 ~ 8 4 8 0.03 160 force
execute as @e[type=minecraft:marker,tag=wildlands_camp_anchor] at @s run function wildlands:blood_moon/respawn_camp
