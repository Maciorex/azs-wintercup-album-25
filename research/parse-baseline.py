"""Odczyt sum medalowych z PDF s. 38–39; wymaga lokalnego pdftotext -layout."""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parent
pages = (root / "reference/album-10-text.txt").read_text().split("\f")
tables = []
for gender, page in [("M", pages[37]), ("K", pages[38])]:
    rows = []
    for line in page.splitlines():
        # Numer strony drukowanej znalazł się na prawo od wiersza Schwenk.
        line = re.sub(r"\s{5,}37\s*$", "", line)
        match = re.match(r"^\s*(\d+)\s+([^\d]+?)\s+(\d.*)$", line)
        if not match:
            continue
        nums = [int(n) for n in re.findall(r"\d+", match[3])]
        if len(nums) < 4:
            continue
        gold, silver, bronze, total = nums[-4:]
        assert gold + silver + bronze == total, line
        rows.append(dict(place=int(match[1]), name=match[2].strip(), gold=gold,
                         silver=silver, bronze=bronze, total=total))
    tables.append(dict(gender=gender, rows=rows))
assert len(tables[0]["rows"]) == 54
assert len(tables[1]["rows"]) == 65
out = {
    "scope": "2002/03–2011/12; baza historyczna, bez aktualizacji późniejszych sezonów",
    "source": "Album X-lecia AZS Winter Cup, 2013, PDF s. 38–39 (druk s. 36–37)",
    "source_reference": "Pierwszy album dostarczony przez redakcję; oryginał nie jest publikowany w repozytorium.",
    "methodology_note": "Przypis źródła: w 2004/05 i 2005/06 liczony wynik dwuboju slalomowego; w pozostałych sezonach osobno slalom gigant i slalom.",
    "status": "Odczyt sum z historycznego PDF; przed drukiem kontrola nazw i identyfikacja zmian nazwisk.",
    "tables": tables,
}
(root / "medals-baseline.json").write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n")
print(f"Baza historyczna: {sum(len(t['rows']) for t in tables)} osób; wszystkie sumy Z+S+B zgodne.")
