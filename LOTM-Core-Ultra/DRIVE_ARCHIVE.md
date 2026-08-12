# Google Drive development archive

Canonical Drive folder for LOTM Core v0.0.3a Ultra:

- Folder ID: `1YnWTDip50AIVnDGC38rU5hlcXXhUv8cp`
- Folder name: `LOTM-Core-Ultra-DevEnv-0.0.3a`

## Layout

- `00-MANIFEST/` — manifest, primary SHA256 list, Drive-part SHA256 list, Linux/PowerShell restore scripts.
- `01-SOURCE-RELEASE/` — complete source ZIP and verified production JAR.
- `02-TOOLCHAIN-FORGE/` — Forge 47.4.22 installer, mapped devdeps, Java 17 parts, Dedicated Server parts.
- `03-CLIENT-RUNTIME/` — complete Forge development client runtime split into sub-100MB Drive parts.
- `04-TOOLS/` — CFR/Vineflower recovery tools.

## Locked baseline

- Source SHA256: `f0f2d29cebbbc45ce98d403aec97dde48c694bb02b0f6d4df028e0fd7fd04782`
- JAR SHA256: `746a8c2a6810ee4c56a4dfa5e83e61eb24362550f52b12ada16f85c97d29c642`
- Minecraft: `1.20.1`
- Forge: `47.4.22`
- Java: `17 x86_64`

The Drive archive is the durable binary/runtime backup. Git/source history remains the implementation source of truth. New sessions should read this file first when the local sandbox is empty.