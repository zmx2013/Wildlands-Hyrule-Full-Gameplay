# LOTM Ultra 开发环境

## 锁定版本

- OS for CI: Ubuntu latest (Linux x86_64)
- Java: Temurin/OpenJDK 17 x64
- Minecraft: 1.20.1
- Forge: 1.20.1-47.4.22
- ForgeGradle: 6.x（由项目 `build.gradle` 锁定）
- mappings: `official`, Minecraft `1.20.1`

## 已验证过的环境产物

这些文件曾在实际开发中生成并逐项 SHA 校验，作为恢复时的参考，不依赖它们永久存在：

- Forge devdeps ZIP: `forge-1.20.1-47.4.22-devdeps.zip`
  - SHA-256 `3d665605c3f238e2cb7edb0d7dcc1379825e2e10433371e42929d9719326bbc5`
  - 内容含 `minecraft_user_repo`、mapped official / SRG / binpatched Forge 1.20.1 开发 JAR。
- Forge server pack ZIP: `forge-1.20.1-47.4.22-server.zip`
  - SHA-256 `d930b1c13c43167e7509343866eff486cf6fe13f42efa335a3ac8043a8d916b0`
- Forge client runtime cache: `clientpack.tar.zst`
  - SHA-256 `58fad0924372cedf61526158e8db8afc19cb38860c3d2f06dbc8d715961da241`
- JDK 17 recovery Artifact ZIP: `jdk17-linux-x64.zip`
  - SHA-256 `ee39f23c7fc1da516d5425e006384ee75db82c88e3c3859d15f9121b30602558`

## 生产验证历史

- ForgeGradle `clean build` / `reobfJar`: PASS
- Java 17 full source compile: PASS
- 内置离线逻辑 harness: 8/8 PASS
- Forge 47.4.22 Dedicated Server: 实际启动到 `Done` 并正常 stop/save
- Forge development client: 实际完成 LOTM 注册、资源 reload、纹理 atlas 创建
- Integrated Server: 实际进入 `UltraWorld`，玩家加入成功
- LOTM network channels: `lotm_core:main` v4 / `lotm_core:v003a_final` v1 双向 ACCEPTED
- 最终小地图复测：terrain/radar/tactical fallback = 0

## 环境恢复原则

大型 Mojang/Forge/JDK 缓存不作为 Git 源码提交：

1. Java 17 由 `actions/setup-java` 或本机 JDK 17 提供。
2. Forge server 通过官方 Forge Maven installer 重建。
3. Mojmap Forge 开发依赖通过官方 MDK + ForgeGradle `compileJava` 预热生成。
4. 客户端 assets/natives 通过 ForgeGradle `prepareRuns/runClient` 正规生成。
5. `source/` 中的源码才是项目行为基线；正式发布必须通过 ForgeGradle `reobfJar`，不得把 Mojmap class 直接塞入生产 JAR。
