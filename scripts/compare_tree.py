#!/usr/bin/env python3
"""
Compare the current filesystem tree under the repo root with the generated
`docs/tentative-file-structure.txt` produced by update_file_tree.py.

Usage:
    python scripts/compare_tree.py [--root PATH] [--docs PATH]
"""
import argparse
import os
from pathlib import Path

EXCLUDE_DIRS = {'.vscode', '.git', '.github', 'node_modules', '__pycache__', '.DS_Store'}
EXCLUDE_FILES = {'.gitignore', 'serviceAccountKey.json', '.env', 'package-lock.json'}

def fs_paths(root: Path):
    root = root.resolve()
    out = set()
    for dirpath, dirnames, filenames in os.walk(root):
        # filter dirnames in-place to avoid walking excluded dirs
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
        rel_dir = os.path.relpath(dirpath, root)
        if rel_dir == '.':
            rel_dir = ''
        # add directory
        normalized = (rel_dir + '/') if rel_dir != '' else ''
        out.add(normalized)
        for f in filenames:
            if f in EXCLUDE_FILES:
                continue
            out.add(os.path.join(rel_dir, f) if rel_dir != '' else f)
    return out


def doc_paths(doc_file: Path):
    lines = doc_file.read_text(encoding='utf-8').splitlines()
    out = set()
    # Reconstruct paths by tracking nesting using connector positions.
    stack = []  # stack of path components by depth
    for raw in lines:
        line = raw.rstrip('\n')
        if line.strip().startswith('```') or line.strip() == '':
            continue
        # Root header (no connectors)
        if ('├──' not in line) and ('└──' not in line):
            stripped = line.strip()
            if stripped.endswith('/'):
                # reset stack to root
                stack = [stripped[:-1]]
                out.add(stripped)
            continue

        # find connector position
        pos = line.find('├──')
        if pos == -1:
            pos = line.find('└──')
        if pos == -1:
            continue

        # compute depth by counting groups of '│' and groups of 4 spaces before connector
        prefix = line[:pos]
        # count number of '│' occurrences
        bars = prefix.count('│')
        # count groups of 4 spaces
        spaces = prefix.count('    ')
        depth = bars + spaces

        name = line[pos+3:].strip()
        # ensure stack is long enough
        if depth >= len(stack):
            # extend with placeholders if needed
            while len(stack) <= depth:
                stack.append(None)
        # set current depth name (strip trailing slash for component)
        comp = name[:-1] if name.endswith('/') else name
        stack[depth] = comp
        # build full relative path from stack up to depth
        parts = [p for p in stack[:depth+1] if p]
        full = '/'.join(parts)
        if name.endswith('/'):
            full = full + '/'
        out.add(full)
    return out


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parent.parent,
                        help='Repository root')
    parser.add_argument('--docs', type=Path, default=Path(__file__).resolve().parent.parent / 'docs' / 'tentative-file-structure.txt',
                        help='Generated docs file')
    args = parser.parse_args()

    root = args.root
    docs = args.docs

    if not docs.exists():
        print(f"Doc file not found: {docs}")
        raise SystemExit(2)

    fs = fs_paths(root)
    docs_set = doc_paths(docs)

    # normalize doc entries to match fs format: dirs end with '/', files not
    normalized_docs = set()
    for p in docs_set:
        p = p.replace('\\', '/').strip()
        normalized_docs.add(p)

    # build a flattened set of fs entries formatted similarly
    fs_norm = set()
    for p in fs:
        p2 = p.replace('\\', '/').strip()
        if p2.endswith('/'):
            # reduce to top-level dir names as in docs (docs shows relative nested entries separately)
            # We will split into path components and add intermediate components to match doc granularity
            parts = p2.split('/')[:-1]
            for i in range(len(parts)):
                fs_norm.add('/'.join(parts[:i+1]) + '/')
        else:
            fs_norm.add(p2)

    missing_in_docs = fs_norm - normalized_docs
    extra_in_docs = normalized_docs - fs_norm

    print(f"Total filesystem entries (approx): {len(fs_norm)}")
    print(f"Total doc entries parsed: {len(normalized_docs)}")
    print()
    if missing_in_docs:
        print("Entries present in filesystem but missing from docs (sample up to 40):")
        for i, p in enumerate(sorted(missing_in_docs)):
            if i >= 40:
                break
            print('  ' + p)
    else:
        print("No entries missing in docs.")
    print()
    if extra_in_docs:
        print("Entries present in docs but not found on filesystem (sample up to 40):")
        for i, p in enumerate(sorted(extra_in_docs)):
            if i >= 40:
                break
            print('  ' + p)
    else:
        print("No extra entries in docs.")

if __name__ == '__main__':
    main()
