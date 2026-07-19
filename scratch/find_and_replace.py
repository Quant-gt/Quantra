import os
import re
import json

root_dir = r"c:\Users\ssbis\Downloads\Stock market\quantra"
exclude_dirs = {'.git', '.next', 'node_modules', 'venv', '__pycache__', '.turbo', '.pytest_cache', 'coverage', '.cache', 'scratch'}
exclude_exts = {'.png', '.jpg', '.ico', '.woff', '.woff2', '.pdf', '.zst', '.map'}

def get_replacement(match):
    text = match.group(0)
    if text.isupper():
        return "SIGMASPIRE"
    elif text.islower():
        return "sigmaspire"
    elif text == "Quantra":
        return "SigmaSpire"
    else:
        return "SigmaSpire" # default fallback

proposed_changes = []

for dirpath, dirnames, filenames in os.walk(root_dir):
    # prune
    dirnames[:] = [d for d in dirnames if d not in exclude_dirs]
    
    for f in filenames:
        ext = os.path.splitext(f)[1].lower()
        if ext in exclude_exts:
            continue
            
        filepath = os.path.join(dirpath, f)
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
                
            if re.search(r'quantra', content, flags=re.IGNORECASE):
                # We found occurrences
                new_content = re.sub(r'quantra', get_replacement, content, flags=re.IGNORECASE)
                
                # count occurrences for reporting
                count = len(re.findall(r'quantra', content, flags=re.IGNORECASE))
                
                proposed_changes.append({
                    "file": filepath.replace(root_dir, ""),
                    "occurrences": count
                })
        except Exception:
            pass

print(json.dumps(proposed_changes, indent=2))
