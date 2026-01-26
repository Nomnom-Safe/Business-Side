#!/usr/bin/env python3
"""
Generate an ASCII file-tree for the repository and write it to docs/file-structure.txt

Usage:
    python scripts/update_file_tree.py [--root PATH] [--out PATH] [--depth N]

Defaults:
    root: repository root (one level up from scripts/)
    out: docs/file-structure.txt
    depth: 4

The script excludes common transient/build folders (.vscode, .git, node_modules etc.) by default.
"""
import argparse
from pathlib import Path

EXCLUDE_DIRS = {'.vscode', '.git', '.github', 'node_modules', '__pycache__', '.DS_Store'}
EXCLUDE_FILES = {'.gitignore', 'serviceAccountKey.json', '.env', 'package-lock.json'}

def is_excluded(path: Path) -> bool:
    name = path.name
    if name in EXCLUDE_DIRS:
        return True
    if name in EXCLUDE_FILES:
        return True
    return False

def tree(root: Path, max_depth: int | None = 4, verbose: bool = False):
    """Yield lines of an ASCII tree starting at root."""
    root = root.resolve()
    def _iter(dir_path: Path, prefix: str, depth: int):
        if (max_depth is not None) and (depth > max_depth):
            return
        try:
            all_entries = list(dir_path.iterdir())
            entries = []
            for p in all_entries:
                if is_excluded(p):
                    if verbose:
                        print(f"Excluded: {p}")
                    continue
                entries.append(p)
            entries = sorted(entries, key=lambda p: (p.is_file(), p.name.lower()))
        except (PermissionError, NotADirectoryError):
            return

        for i, entry in enumerate(entries):
            is_last = (i == len(entries) - 1)
            connector = '└── ' if is_last else '├── '
            if entry.is_dir():
                yield f"{prefix}{connector}{entry.name}/"
                new_prefix = prefix + ('    ' if is_last else '│   ')
                yield from _iter(entry, new_prefix, depth + 1)
            else:
                yield f"{prefix}{connector}{entry.name}"

    # root header and iterate
    yield f"{root.name}/"
    yield from _iter(root, '', 1)


def write_tree(root: Path, out_file: Path, depth: int | None = 4, verbose: bool = False):
    out_file.parent.mkdir(parents=True, exist_ok=True)
    with out_file.open('w', encoding='utf-8') as f:
        for line in tree(root, max_depth=depth, verbose=verbose):
            f.write(line + '\n')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parent.parent,
                        help='Repository root to scan')
    parser.add_argument('--out', type=Path, default=Path(__file__).resolve().parent.parent / 'docs' / 'file-structure.txt',
                        help='Output file')
    parser.add_argument('--depth', type=int, default=None, help='Max depth to print (default: unlimited)')
    parser.add_argument('--verbose', action='store_true', help='Print excluded entries to stderr')
    args = parser.parse_args()

    root = args.root
    out_file = args.out
    depth = args.depth
    verbose = args.verbose

    if not root.exists():
        print(f"Error: root path does not exist: {root}")
        raise SystemExit(2)

    print(f"Scanning {root} (depth={depth})...")
    write_tree(root, out_file, depth, verbose=verbose)
    print(f"Wrote tree to {out_file}")

if __name__ == '__main__':
    main()
