import re
import json
import os

def parse_hymns(text):
    lines = text.split('\n')
    hymns = []
    current_hymn = None
    current_verse = []
    in_chorus = False
    current_category = "Louange"

    def finalize_section(h, section, stype):
        if not section: return
        content = "\n".join(section).strip()
        if not content: return
        if stype == "CHORUS":
            if 'chorus' not in h: h['chorus'] = []
            if content not in h['chorus']:
                h['chorus'].append(content)
        else:
            if 'lyrics' not in h: h['lyrics'] = []
            h['lyrics'].append(content)

    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            if current_verse and current_hymn:
                finalize_section(current_hymn, current_verse, in_chorus)
                current_verse = []
            continue

        if line.startswith('[') and line.endswith(']'):
            current_category = line.strip('[]')
            continue

        is_new = False
        title_candidate = ""
        ref_candidate = ""

        # All caps title followed by a reference in parens
        all_caps = line.isupper() and len(re.sub(r'[^A-Z]', '', line)) > 3 and not any(line.startswith(x) for x in ["CH", "REFRAIN", "STROPHE", "VERSE", "COUPE", "PARTIE"])
        # Reference in parens like (Hosanna 1)
        ref_in_parens = re.match(r'^\(([A-Za-zÀ-ÿ\s\']+)\s+\d+[a-z]?\)$', line)

        # Only start a new hymn on All Caps title or standalone reference if not already in one or if previous one is done
        if all_caps:
            has_ref = False
            for j in range(i+1, min(i+4, len(lines))):
                nl = lines[j].strip()
                if not nl: continue
                if nl.startswith('(') and nl.endswith(')') and any(c.isdigit() for c in nl):
                    has_ref = True
                    ref_candidate = nl
                    break
                else: break
            if has_ref:
                is_new = True
                title_candidate = line
        elif ref_in_parens:
            # If standalone reference without a preceding ALL CAPS title
            if not current_hymn or (current_hymn and current_hymn.get('lyrics')):
                is_new = True
                title_candidate = line
                ref_candidate = line

        if is_new:
            if current_hymn:
                finalize_section(current_hymn, current_verse, in_chorus)
                hymns.append(current_hymn)

            h_cat = current_category
            if ref_candidate:
                cat_m = re.match(r'^\((.*?)\s+\d', ref_candidate)
                if cat_m: h_cat = cat_m.group(1).strip()

            current_hymn = {
                'title': title_candidate.upper(),
                'reference': ref_candidate,
                'lyrics': [],
                'category': h_cat
            }
            current_verse = []
            in_chorus = False
            continue

        if not current_hymn: continue

        low_line = line.lower()
        # Chorus detection
        if re.match(r'^(chœur|choeur|refrain|r/|chorus)\b', low_line, re.IGNORECASE):
            finalize_section(current_hymn, current_verse, in_chorus)
            current_verse = []
            in_chorus = True
            marker_content = re.sub(r'^(chœur|choeur|refrain|r/|chorus)\s*:?\s*', '', line, flags=re.IGNORECASE)
            if marker_content.strip():
                current_verse.append(marker_content.strip())
        # Verse number detection - don't start a NEW hymn, just a new section in current hymn
        elif re.match(r'^(\d+)[\.\-\s]', line):
            finalize_section(current_hymn, current_verse, in_chorus)
            current_verse = []
            in_chorus = False
            verse_content = re.sub(r'^\d+[\.\-\s]\s*', '', line)
            if verse_content.strip():
                current_verse.append(verse_content.strip())
        else:
            if line != current_hymn['reference'] and line != current_hymn['title']:
                current_verse.append(line)

    if current_hymn:
        finalize_section(current_hymn, current_verse, in_chorus)
        hymns.append(current_hymn)

    unique_hymns = []
    seen = set()
    for h in hymns:
        if not h['lyrics']: continue
        # Cleaner deduplication
        norm_title = re.sub(r'[^A-Z]', '', h['title'])
        # Use first verse as secondary key
        first_line = re.sub(r'[^A-Z]', '', h['lyrics'][0].upper())[:50]
        key = (norm_title, first_line)
        if key not in seen:
            seen.add(key)
            unique_hymns.append(h)

    for i, h in enumerate(unique_hymns):
        h['id'] = str(i + 1)
        if not h['reference']: h['reference'] = f"N° {h['id']}"
        if "Hosanna" in h['reference']: h['category'] = "Hosanna"
        elif "Crois seulement" in h['reference']: h['category'] = "Crois seulement"
        elif "Autres cantiques" in h['reference']: h['category'] = "Autres"
        elif "Symphonie de l'Epouse" in h['category']: h['category'] = "Symphonie"
        elif "Collection de cantiques" in h['reference']: h['category'] = "Collection"
        elif "Roc seculaire" in h['reference']: h['category'] = "Roc Séculaire"
        elif "Chant de victoire" in h['reference']: h['category'] = "Chants de Victoire"

    categories_list = sorted(list(set(h['category'] for h in unique_hymns)))
    if "Tous" not in categories_list:
        categories_list.insert(0, "Tous")

    result = {"cantiques": unique_hymns, "categories": categories_list}

    with open('result.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"Generated {len(unique_hymns)} unique hymns.")

if __name__ == "__main__":
    # Re-read original input if available, otherwise use hymns_input.txt
    input_file = 'hymns_input.txt'
    if os.path.exists(input_file):
        with open(input_file, 'r', encoding='utf-8') as f:
            parse_hymns(f.read())
    else:
        print(f"{input_file} not found")
