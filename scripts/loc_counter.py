# Count lines of code in the backend/, src/, and tests/ directories, ignoring blank lines and comments.
# Usage (PowerShell): python .\scripts\loc_counter.py

import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
BACKEND_PATH = os.path.join(ROOT, 'app/backend')
SRC_PATH = os.path.join(ROOT, 'app/src')
TEST_PATH = os.path.join(ROOT, 'app/tests')

paths = [BACKEND_PATH, SRC_PATH, TEST_PATH]
files = []
test_file_count = 0

for p in paths:
    for dirpath, dirnames, filenames in os.walk(p):
        for f in filenames:
            if f.endswith('.js') or f.endswith('.jsx') or f.endswith('.html') or f.endswith('.scss'):
                full_path = os.path.join(dirpath, f)
                files.append(full_path)
                if full_path.startswith(TEST_PATH):
                    test_file_count += 1

counts = {}
total = 0
test_total = 0

for fp in sorted(files):
    with open(fp, 'r', encoding='utf-8') as fh:
        lines = fh.readlines()
    count = 0
    for line in lines:
        s = line.strip()
        if s == '':
            continue
        if s.startswith('//'):
            continue
        count += 1
    counts[fp] = count
    total += count
    if fp.startswith(TEST_PATH):
        test_total += count

print('Files scanned:')
for fp in sorted(counts.keys()):
    rel = os.path.relpath(fp, ROOT)
    print(f"- `{rel}`: {counts[fp]}")
print(f"\nTotal LOC: {total}")
print(f"Total production LOC: {total - test_total}")
print(f"Total test LOC: {test_total}")
print(f"Total test files: {test_file_count}")
