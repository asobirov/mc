#!/usr/bin/env python3
"""Verify a client instance against its modrinth.index.json manifest.

SKlauncher does not hash-check what it downloads, so an import can silently
drop or truncate mod files and still report success. The player only finds
out at join time, as a "server send registries with unknown keys"
disconnect that names mods rather than the real cause. Run this after every
import or pack update, before the first launch.

Exits non-zero when the instance does not match the manifest.

  python3 verify-client-instance.py <instance-dir>
  python3 verify-client-instance.py <instance-dir> --repair

Find <instance-dir> with the launcher's "Open installation/instance
directory" action; it is the directory holding modrinth.index.json.
"""
import argparse, hashlib, json, os, sys, urllib.request

def sha(path, alg):
    h = hashlib.new(alg)
    with open(path, 'rb') as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('instance')
    ap.add_argument('--repair', action='store_true',
                    help='re-download missing/corrupt files from the manifest URLs')
    args = ap.parse_args()

    root = os.path.abspath(args.instance)
    manifest = os.path.join(root, 'modrinth.index.json')
    if not os.path.exists(manifest):
        sys.exit(f'no modrinth.index.json in {root} - is this a pack instance?')

    idx = json.load(open(manifest, encoding='utf-8'))
    files = idx['files']
    print(f"pack     : {idx.get('name')} {idx.get('versionId')}")
    print(f"requires : {idx.get('dependencies')}")
    print(f"instance : {root}")
    print(f"declared : {len(files)} files\n")

    missing, corrupt = [], []
    for f in files:
        path = os.path.join(root, f['path'].replace('/', os.sep))
        if not os.path.exists(path):
            missing.append(f)
            continue
        want = f['hashes'].get('sha1')
        if want and sha(path, 'sha1') != want:
            corrupt.append(f)

    for label, group in (('MISSING', missing), ('CORRUPT', corrupt)):
        for f in group:
            path = os.path.join(root, f['path'].replace('/', os.sep))
            size = os.path.getsize(path) if os.path.exists(path) else 0
            extra = f' ({size} bytes vs {f.get("fileSize")} declared)' if label == 'CORRUPT' else ''
            print(f'{label}: {f["path"]}{extra}')

    bad = missing + corrupt
    if not bad:
        print(f'OK: all {len(files)} files present and hash-verified')
        return 0

    print(f'\n{len(bad)} of {len(files)} files bad')
    if not args.repair:
        print('re-run with --repair to fix')
        return 1

    print('\nrepairing...')
    failed = 0
    for f in bad:
        path = os.path.join(root, f['path'].replace('/', os.sep))
        url = f['downloads'][0]
        os.makedirs(os.path.dirname(path), exist_ok=True)
        tmp = path + '.part'
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'friendsmc-verify/1.0'})
            with urllib.request.urlopen(req, timeout=120) as r, open(tmp, 'wb') as out:
                while chunk := r.read(1 << 20):
                    out.write(chunk)
        except Exception as e:
            print(f'  FAIL {f["path"]}: {e}')
            failed += 1
            continue
        # verify before trusting it - the whole point of this script
        ok = all(sha(tmp, alg) == f['hashes'][alg] for alg in ('sha1', 'sha512') if alg in f['hashes'])
        if ok and os.path.getsize(tmp) == f.get('fileSize', os.path.getsize(tmp)):
            os.replace(tmp, path)
            print(f'  fixed {f["path"]}')
        else:
            os.remove(tmp)
            print(f'  FAIL {f["path"]}: downloaded copy failed verification')
            failed += 1

    print('\nrepair complete' if not failed else f'\n{failed} file(s) still bad')
    return 1 if failed else 0

if __name__ == '__main__':
    sys.exit(main())
