param([string]$Root = (Get-Location).Path)
$ErrorActionPreference = 'Stop'
$Man = Join-Path $Root '00-MANIFEST'; $Src = Join-Path $Root '01-SOURCE-RELEASE'; $Tool = Join-Path $Root '02-TOOLCHAIN-FORGE'; $Client = Join-Path $Root '03-CLIENT-RUNTIME'; $Tools = Join-Path $Root '04-TOOLS'; $Out = Join-Path $Root 'restored'
New-Item -ItemType Directory -Force -Path $Out | Out-Null
function Join-Parts([string]$Dir,[string]$Base,[string]$Destination){ $parts=Get-ChildItem -Path $Dir -Filter "$Base.part-*" | Sort-Object Name; if($parts.Count -eq 0){throw "Missing parts for $Base"}; $o=[IO.File]::Create($Destination); try{foreach($p in $parts){$b=[IO.File]::ReadAllBytes($p.FullName);$o.Write($b,0,$b.Length)}}finally{$o.Dispose()} }
Join-Parts $Tool 'jdk17-linux-x64.zip' (Join-Path $Out 'jdk17-linux-x64.zip')
Join-Parts $Tool 'forge-1.20.1-47.4.22-server.zip' (Join-Path $Out 'forge-1.20.1-47.4.22-server.zip')
foreach($n in '00','01','02','03'){Join-Parts $Client "forge-client-chunk-$n.zip" (Join-Path $Out "forge-client-chunk-$n.zip")}
Copy-Item (Join-Path $Client 'forge-client-chunk-sums.zip') $Out; Copy-Item (Join-Path $Tool 'forge-1.20.1-47.4.22-devdeps.zip') $Out; Copy-Item (Join-Path $Tool 'forge-1.20.1-47.4.22-installer.jar') $Out; Copy-Item (Join-Path $Tools 'lotm-decompilers.zip') $Out; Copy-Item (Join-Path $Src 'lotm_core-0.0.3a-Ultra-source.zip') $Out; Copy-Item (Join-Path $Src 'lotm_core-0.0.3a-Ultra.jar') $Out
$expected=@{}; Get-Content (Join-Path $Man 'SHA256SUMS.txt') | ForEach-Object { if($_ -match '^([0-9a-f]{64})\s+(.+)$'){ $expected[$Matches[2]]=$Matches[1] } }; foreach($name in $expected.Keys){$p=Join-Path $Out $name; if(!(Test-Path $p)){throw "Missing restored file: $name"}; $a=(Get-FileHash -Algorithm SHA256 $p).Hash.ToLowerInvariant(); if($a -ne $expected[$name]){throw "SHA256 mismatch: $name"}; Write-Host "PASS $name"}
Write-Host "LOTM Ultra primary archives restored and verified in $Out"