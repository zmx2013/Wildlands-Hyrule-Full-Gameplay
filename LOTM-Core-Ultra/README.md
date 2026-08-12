# LOTM Core v0.0.3a Ultra — 命运回响·极境版

这是 LOTM Core Ultra 的长期恢复入口，用于以后新的 ChatGPT/Codex 对话直接恢复完整开发状态。

## 固定版本

- Minecraft: `1.20.1`
- Forge: `47.4.22`
- Java: `17`
- mappings: `official / Minecraft 1.20.1`
- modId: `lotm_core`
- version: `0.0.3a`

## 不可变基线校验

- 最终 Ultra JAR SHA-256: `746a8c2a6810ee4c56a4dfa5e83e61eb24362550f52b12ada16f85c97d29c642`
- Ultra 完整源码 ZIP SHA-256: `f0f2d29cebbbc45ce98d403aec97dde48c694bb02b0f6d4df028e0fd7fd04782`

## 目录

- `source/` — 完整可搜索 ForgeGradle 源码树。
- `source-payload/` — 用于恢复原始源码树的压缩载荷与校验。
- `release/` — 构建后的 Ultra JAR / 发布校验。
- `docs/` — 环境、验收、Bug 审计与开发上下文。
- `scripts/` — 开发环境恢复脚本。
- `.github/workflows/lotm-ultra-*.yml` — 可重复生成 Forge 开发环境和执行真实构建/服务端验证。

## 新对话恢复约定

新对话只需要告诉 ChatGPT/Codex：

> 从 `zmx2013/Wildlands-Hyrule-Full-Gameplay` 的 `lotm-core-ultra-archive` 分支、`LOTM-Core-Ultra/` 目录恢复 LOTM v0.0.3a Ultra，不要从头开发。先读 README、ENVIRONMENT、HANDOFF/IMPLEMENTATION_STATUS，再继续当前版本。

开发环境的大型二进制缓存（Forge server、devdeps、客户端 natives/assets、JDK）不硬编码进 Git 历史；它们通过 Actions 按锁定版本正规重建。这样不会因为某一台沙箱机器消失而丢失项目。
