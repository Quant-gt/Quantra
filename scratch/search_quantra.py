import os
import json

root_dir = r"c:\Users\ssbis\Downloads\Stock market\quantra"
exclude_dirs = {'.git', '.next', 'node_modules', 'venv', '__pycache__', '.turbo', '.pytest_cache', 'coverage', '.cache'}
exclude_exts = {'.png', '.jpg', '.ico', '.woff', '.woff2', '.pdf', '.zst', '.map'}

matches = []

for dirpath, dirnames, filenames in os.walk(root_dir):
    # modify dirnames in-place to prune the search
    dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
    
    for f in filenames:
        ext = os.path.splitext(f)[1].lower()
        if ext in exclude_exts:
            continue
            
        filepath = os.path.join(dirpath, f)
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                for i, line in enumerate(file):
                    if 'quantra' in line.lower():
                        matches.append({"file": filepath.replace(root_dir, ""), "line": i+1, "content": line.strip()})
        except Exception:
            # ignore decoding errors for binaries
            pass

# Output summary
print(f"Found {len(matches)} occurrences.")
with open(os.path.join(root_dir, 'scratch', 'search_results.json'), 'w') as f:
    json.dump(matches, f, indent=2)
