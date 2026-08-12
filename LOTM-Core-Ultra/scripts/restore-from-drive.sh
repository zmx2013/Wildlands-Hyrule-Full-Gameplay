#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-$(pwd)}"
MAN="$ROOT/00-MANIFEST"
SRC="$ROOT/01-SOURCE-RELEASE"
TOOL="$ROOT/02-TOOLCHAIN-FORGE"
CLIENT="$ROOT/03-CLIENT-RUNTIME"
TOOLS="$ROOT/04-TOOLS"
OUT="$ROOT/restored"
mkdir -p "$OUT"
join_parts(){ local dir="$1" base="$2" out="$3"; local parts=("$dir/$base".part-*); [ -e "${parts[0]}" ] || { echo "Missing parts for $base" >&2; exit 2; }; cat "${parts[@]}" > "$out"; }
join_parts "$TOOL" 'jdk17-linux-x64.zip' "$OUT/jdk17-linux-x64.zip"
join_parts "$TOOL" 'forge-1.20.1-47.4.22-server.zip' "$OUT/forge-1.20.1-47.4.22-server.zip"
for n in 00 01 02 03; do join_parts "$CLIENT" "forge-client-chunk-$n.zip" "$OUT/forge-client-chunk-$n.zip"; done
cp "$CLIENT/forge-client-chunk-sums.zip" "$OUT/"
cp "$TOOL/forge-1.20.1-47.4.22-devdeps.zip" "$OUT/"
cp "$TOOL/forge-1.20.1-47.4.22-installer.jar" "$OUT/"
cp "$TOOLS/lotm-decompilers.zip" "$OUT/"
cp "$SRC/lotm_core-0.0.3a-Ultra-source.zip" "$OUT/"
cp "$SRC/lotm_core-0.0.3a-Ultra.jar" "$OUT/"
(cd "$OUT" && sha256sum -c "$MAN/SHA256SUMS.txt")
echo "LOTM Ultra primary archives restored and verified in $OUT"