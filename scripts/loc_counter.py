# Count lines of code in the client/ and server/ directories,
# ignoring blank lines and comments.
# Usage (PowerShell): python .\scripts\loc_counter.py

import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

CLIENT_PATH = os.path.join(ROOT, 'client')
SERVER_PATH = os.path.join(ROOT, 'server')

# File extensions to count
VALID_EXT = ('.js', '.jsx', '.html', '.scss')

def collect_files(base_path):
    files = []
    test_files = []
    for dirpath, dirnames, filenames in os.walk(base_path):
        for f in filenames:
            if f.endswith(VALID_EXT):
                full = os.path.join(dirpath, f)
                files.append(full)
                if f.endswith('.test.js') or f.endswith('.test.jsx'):
                    test_files.append(full)
    return files, test_files

def count_loc(file_path):
    count = 0
    try:
        with open(file_path, 'r', encoding='utf-8') as fh:
            for line in fh:
                s = line.strip()
                if s == '':
                    continue
                if s.startswith('//'):
                    continue
                count += 1
    except Exception as e:
        print(f"Could not read {file_path}: {e}")
    return count

# --- Collect files ---
client_files, client_test_files = collect_files(CLIENT_PATH)
server_files, server_test_files = collect_files(SERVER_PATH)

# --- Count LOC ---
def summarize(files, test_files):
    total = 0
    test_total = 0
    counts = {}

    for fp in sorted(files):
        loc = count_loc(fp)
        counts[fp] = loc
        total += loc
        if fp in test_files:
            test_total += loc

    return counts, total, test_total

client_counts, client_total, client_test_total = summarize(client_files, client_test_files)
server_counts, server_total, server_test_total = summarize(server_files, server_test_files)

# --- Output ---
print("\n## Client Files Scanned\n")
for fp, loc in client_counts.items():
    rel = os.path.relpath(fp, ROOT)
    print(f"- `{rel}`: {loc:,}")

print("\n## Server Files Scanned\n")
for fp, loc in server_counts.items():
    rel = os.path.relpath(fp, ROOT)
    print(f"- `{rel}`: {loc:,}")

print("\n## Client Statistics\n")
print(f"- Total client LOC: {client_total:,}")
print(f"- Client production LOC: {client_total - client_test_total:,}")
print(f"- Client test LOC: {client_test_total:,}")
print(f"- Client file count: {len(client_files):,}")
print(f"- Client test file count: {len(client_test_files):,}")

print("\n## Server Statistics\n")
print(f"- Total server LOC: {server_total:,}")
print(f"- Server production LOC: {server_total - server_test_total:,}")
print(f"- Server test LOC: {server_test_total:,}")
print(f"- Server file count: {len(server_files):,}")
print(f"- Server test file count: {len(server_test_files):,}")

print("\n## Total Project Statistics\n")
total_loc = client_total + server_total
total_test_loc = client_test_total + server_test_total
total_files = len(client_files) + len(server_files)
total_test_files = len(client_test_files) + len(server_test_files)

print(f"- Total project LOC: {total_loc:,}")
print(f"- Total project production LOC: {total_loc - total_test_loc:,}")
print(f"- Total project test LOC: {total_test_loc:,}")
print(f"- Total project file count: {total_files:,}")
print(f"- Total project test file count: {total_test_files:,}")