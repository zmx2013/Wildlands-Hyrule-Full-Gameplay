import json, subprocess, sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
for p in ROOT.rglob('*.json'):
    json.loads(p.read_text(encoding='utf-8-sig'))
for p in (ROOT/'src/kubejs').rglob('*.js'):
    r=subprocess.run(['node','--check',str(p)],capture_output=True,text=True)
    if r.returncode:
        print(r.stderr,file=sys.stderr); raise SystemExit(r.returncode)
meta=json.loads((ROOT/'pack-meta.json').read_text(encoding='utf-8'))
assert meta['version']=='2.0.0' and meta['minecraft']=='1.21.1'
counts=json.loads((ROOT/'structure-counts.json').read_text(encoding='utf-8'))
assert counts['counts']=={'shrines':120,'towers':15,'koroks':900,'dungeons':4,'enemy_camps':32}
pack=json.loads((ROOT/'src/datapack/pack.mcmeta').read_text(encoding='utf-8'))
assert pack['pack']['pack_format']==48
print('Wildlands repository validation PASS')
