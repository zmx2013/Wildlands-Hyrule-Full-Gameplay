#!/usr/bin/env python3
import hashlib, json, os, sys, time, urllib.parse, urllib.request
from pathlib import Path

API='https://api.modrinth.com/v2'
MC='1.21.1'
LOADER='neoforge'
STRICT=['kubejs','paragliders','parcool','better-combat','shoulder-surfing-reloaded']
OPTIONAL=['YpPfINZw','farmers-delight','cold-sweat','sound-physics-remastered','ambientsounds','sodium','iris','immediatelyfast','modernfix','ferrite-core','entityculling','dynamic-fps','not-enough-animations','falling-leaves','presence-footsteps','make_bubbles_pop','better-mount-hud','horse-expert','zelda-hyrule-terrors']
UA='Wildlands-Hyrule-Full-Gameplay/2.0.1 (+https://github.com/zmx2013/Wildlands-Hyrule-Full-Gameplay)'
OUT=Path(os.environ.get('OUT_DIR','build/pcl2'))
DL=OUT/'downloads'
OUT.mkdir(parents=True,exist_ok=True); DL.mkdir(parents=True,exist_ok=True)

def get(path, params=None):
    url=API+path
    if params: url += '?' + urllib.parse.urlencode(params)
    req=urllib.request.Request(url,headers={'User-Agent':UA})
    for i in range(5):
        try:
            with urllib.request.urlopen(req,timeout=40) as r: return json.load(r)
        except Exception:
            if i==4: raise
            time.sleep(1.5*(i+1))

def project(pid): return get('/project/'+urllib.parse.quote(str(pid),safe=''))

def versions(pid):
    return get('/project/'+urllib.parse.quote(str(pid),safe='')+'/version', {
        'loaders':json.dumps([LOADER],separators=(',',':')),
        'game_versions':json.dumps([MC],separators=(',',':')),
        'include_changelog':'false'
    })

def choose(pid):
    vs=versions(pid)
    if not vs: return None
    listed=[v for v in vs if v.get('status','listed') in ('listed','archived')]
    if listed: vs=listed
    rank={'release':0,'beta':1,'alpha':2}
    vs.sort(key=lambda v:(rank.get(v.get('version_type'),9),-int(v.get('date_published','1970')[:4] or 1970)))
    # API normally returns newest first; within best channel keep most recently published.
    best_type=min(rank.get(v.get('version_type'),9) for v in vs)
    candidates=[v for v in vs if rank.get(v.get('version_type'),9)==best_type]
    candidates.sort(key=lambda v:v.get('date_published',''),reverse=True)
    return candidates[0]

def exact(vid): return get('/version/'+urllib.parse.quote(str(vid),safe=''))

def primary_file(v):
    fs=v.get('files') or []
    if not fs: raise RuntimeError('Version has no files: '+v.get('id','?'))
    return next((f for f in fs if f.get('primary')),fs[0])

resolved={}
missing_optional=[]
queue=[]
for slug in STRICT:
    v=choose(slug)
    if not v: raise SystemExit(f'REQUIRED project has no {MC} {LOADER} build: {slug}')
    queue.append((v,'root-required',slug))
for slug in OPTIONAL:
    try: v=choose(slug)
    except Exception as e:
        print('optional lookup failed',slug,e); v=None
    if v: queue.append((v,'root-optional',slug))
    else: missing_optional.append(slug)

while queue:
    v,reason,source=queue.pop(0)
    pid=v['project_id']
    if pid in resolved: continue
    p=project(pid)
    f=primary_file(v)
    resolved[pid]={'project':p,'version':v,'file':f,'reason':reason,'source':source}
    for dep in v.get('dependencies') or []:
        if dep.get('dependency_type')!='required': continue
        if dep.get('version_id'):
            dv=exact(dep['version_id'])
        elif dep.get('project_id'):
            dv=choose(dep['project_id'])
            if not dv: raise RuntimeError(f"No compatible version for required dependency {dep['project_id']} of {p['title']}")
        else:
            continue
        queue.append((dv,'dependency',p['slug']))

entries=[]; lock=[]
for pid,r in sorted(resolved.items(),key=lambda kv:kv[1]['project']['title'].lower()):
    p,v,f=r['project'],r['version'],r['file']
    filename=f['filename']
    data_path=DL/filename
    req=urllib.request.Request(f['url'],headers={'User-Agent':UA})
    with urllib.request.urlopen(req,timeout=120) as resp, open(data_path,'wb') as out:
        while True:
            b=resp.read(1024*1024)
            if not b: break
            out.write(b)
    b=data_path.read_bytes(); sha1=hashlib.sha1(b).hexdigest(); sha512=hashlib.sha512(b).hexdigest()
    if sha1.lower()!=f['hashes']['sha1'].lower(): raise RuntimeError('SHA1 mismatch '+filename)
    if 'sha512' in f['hashes'] and sha512.lower()!=f['hashes']['sha512'].lower(): raise RuntimeError('SHA512 mismatch '+filename)
    client='unsupported' if p.get('client_side')=='unsupported' else 'required'
    server='unsupported' if p.get('server_side')=='unsupported' else 'required'
    entries.append({'path':'mods/'+filename,'hashes':{'sha1':sha1,'sha512':sha512},'env':{'client':client,'server':server},'downloads':[f['url']],'fileSize':len(b)})
    lock.append({'project_id':pid,'slug':p['slug'],'name':p['title'],'version_id':v['id'],'version_number':v['version_number'],'version_type':v['version_type'],'filename':filename,'sha1':sha1,'sha512':sha512,'size':len(b),'url':f['url'],'client_side':p.get('client_side'),'server_side':p.get('server_side'),'reason':r['reason'],'source':r['source']})
    print('LOCK',p['title'],v['version_number'],filename,len(b))

(OUT/'resolved-modrinth-files.json').write_text(json.dumps(entries,ensure_ascii=False,indent=2),encoding='utf-8')
(OUT/'modset-lock.json').write_text(json.dumps({'minecraft':MC,'loader':LOADER,'generated_at':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'strict_roots':STRICT,'optional_roots':OPTIONAL,'missing_optional':missing_optional,'mods':lock},ensure_ascii=False,indent=2),encoding='utf-8')
print('Resolved',len(lock),'files; missing optional:',missing_optional)
