execute store result score #day wl_time run time query day
execute store result score #tod wl_time run time query daytime
scoreboard players operation #mod wl_time = #day wl_time
scoreboard players operation #mod wl_time %= #eight wl_const
execute if score #day wl_time matches 8.. if score #mod wl_time matches 0 if score #tod wl_time matches 13000..13040 unless score #last_blood_day wl_state = #day wl_time run function wildlands:blood_moon/start
