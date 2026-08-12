# Wildlands: Hyrule — Full Gameplay Edition

> A community-made Minecraft 1.21.1 / NeoForge gameplay layer inspired by open-world adventure design.

[中文说明](#中文) · [English](#english) · [Architecture](docs/V2_IMPLEMENTED_MECHANICS.md) · [Credits](docs/CREDITS_AND_LICENSES.md)

## 中文

Wildlands: Hyrule Full Gameplay Edition 是一个 **Minecraft 1.21.1 + NeoForge** 的开源整合与玩法层项目。它把开放世界探索、滑翔、攀爬、耐力、神庙试炼、区域塔、森灵谜题、大型地下城、符文、完美闪避/盾反和周期性世界重置整合进同一套可修改的 KubeJS + datapack 架构。

### v2.0.0 已实现

- 120 个神庙结构模板
- 15 座区域塔
- 900 个森灵/Korok 式谜题模板
- 4 个 45×24×45 大型地下城
- 32 个带 Blood Moon 重生锚点的敌营
- 完美闪避、Flurry Rush 窗口与空中拉弓 Focus
- 完美盾反
- Bomb / Stasis / Cryonis / Magnesis 四符文
- BOTW 式压缩武器耐久
- 每 8 个 Minecraft 日触发一次确定性 Blood Moon
- 神庙、塔、谜题和地下城进度持久化

### 技术结构

```text
overrides/kubejs/
├── startup_scripts/       # 物品、方块、耐久
└── server_scripts/        # 战斗、符文、世界进度

world_overrides/datapacks/wildlands_full_gameplay/
└── data/wildlands/
    ├── function/          # Blood Moon / placement / runtime functions
    └── structure/         # 1071 个 Minecraft Structure NBT
```

完整发行包中的结构规模：**1071 个 NBT、394,607 个规范化结构方块**。

### 安装

下载 `dist/Wildlands_Hyrule_Full_Gameplay_v2.0.0.zip`，解压后运行：

```text
1_安装完整版.bat
```

安装完成后运行：

```text
2_验证安装.bat
```

开发测试可在有权限的世界里使用：

```mcfunction
/function wildlands:place/test_gallery
```

### 依赖与第三方内容

本仓库**不重新托管第三方 Mod 或完整 Hyrule 地图**。安装器按项目配置从对应发布源获取它们。每个第三方项目继续受其原始许可证约束。详见 [`docs/CREDITS_AND_LICENSES.md`](docs/CREDITS_AND_LICENSES.md)。

### 开源范围

MIT License 适用于本仓库中由 Wildlands 项目原创的代码、脚本、配置、原创小型纹理与原创 Minecraft 结构设计。第三方名称、项目、地图、Mod、游戏资产与相关知识产权不因本仓库的 MIT License 而重新授权。

---

## English

Wildlands: Hyrule Full Gameplay Edition is an open-source **Minecraft 1.21.1 + NeoForge** integration/gameplay layer. The project implements exploration-focused systems through KubeJS and datapacks while keeping third-party mods and map downloads outside this repository.

### Implemented in v2.0.0

- 120 shrine structure templates
- 15 regional towers
- 900 forest-spirit/Korok-style puzzle templates
- 4 large 45×24×45 dungeons
- 32 enemy camps with Blood Moon respawn anchors
- Perfect Dodge, Flurry window and aerial bow focus
- Perfect Guard / parry
- Bomb, Stasis, Cryonis and Magnesis rune systems
- Compressed weapon durability profile
- Deterministic Blood Moon every 8 Minecraft days
- Persistent shrine/tower/puzzle/dungeon progression

### Validation

The v2 build was statically checked for:

- KubeJS JavaScript syntax
- JSON parsing
- gzip/NBT integrity
- DataVersion 3955
- palette indices and structure bounds
- duplicate block positions
- ZIP CRC integrity

See [`BUILD_VALIDATION_REPORT.json`](BUILD_VALIDATION_REPORT.json).

## Contributing

Issues and pull requests are welcome. Start with [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License & fan-project notice

Original Wildlands code and original project assets are released under the MIT License. This is an unofficial fan integration and is not affiliated with Nintendo, Mojang/Microsoft, Grazzy, or third-party mod authors. See [`NOTICE.md`](NOTICE.md) and [`docs/CREDITS_AND_LICENSES.md`](docs/CREDITS_AND_LICENSES.md).
