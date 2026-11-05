"""Zbuduj samowystarczalny index.html z materiałów research; bez zależności."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
def read(name, default):
    p = ROOT / 'research' / name
    return json.loads(p.read_text()) if p.exists() else default

results = read('results.json', {'seasons': []})
events = read('result-events.json', {'seasons': []})
articles = read('articles.json', [])
photos = read('photos.json', [])
article_index = read('articles-index.json', [])
if isinstance(articles, dict):
    articles = articles.get('seasons', [])
if isinstance(photos, dict):
    photos = photos.get('seasons', [])
def season_map(rows):
    return {r['season']: r for r in rows}

rm = season_map(results['seasons'])
em = season_map(events['seasons'])
am = season_map(articles)
pm = season_map(photos)
im = {}
if isinstance(article_index, list):
    for row in article_index:
        if 'articles' in row:
            im[row['season']] = row['articles']
        elif row.get('season'):
            im.setdefault(row['season'], []).append(row)
elif isinstance(article_index, dict):
    for row in article_index.get('seasons', []):
        im[row['season']] = row.get('articles', [])

roman = ['XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII','XXIII','XXIV']
seasons = []
for i, year in enumerate(range(2012, 2026)):
    key = f'{year}/{str(year+1)[-2:]}'
    a, p, r = am.get(key, {}), pm.get(key, {}), rm.get(key, {})
    season_articles = a.get('articles', [])
    first = season_articles[0] if season_articles else {}
    angles = first.get('story_angles', [])
    seasons.append({
        'id': 's' + key.replace('/', '-'), 'label': key, 'roman': roman[i],
        'classifications': r.get('classifications', []), 'resultGaps': r.get('gaps', []),
        'events': em.get(key, {}).get('events', []),
        'articles': season_articles, 'articleGaps': a.get('gaps', []),
        'articleIndex': [x for x in im.get(key, []) if not x.get('has_summary')],
        'editorialQuestions': a.get('editorial_questions', []),
        'interviewCandidates': a.get('interview_candidates', []),
        'galleries': p.get('galleries', []), 'photoGaps': p.get('gaps', []),
        'photoEditions': p.get('editions', []),
        'workingAngle': angles[0] if angles else '',
    })

podium = read('medals-podium.json', {})
podium_summary = {
    'coverage': podium.get('coverage', {}),
    'methodology': podium.get('methodology', ''),
    'excluded_events': podium.get('excluded_events', []),
    'races': [{k: race[k] for k in ['season', 'event_label', 'category', 'source_url', 'source_page', 'status', 'notes'] if k in race}
              | {'rows': [{k: row[k] for k in ['place', 'name'] if k in row} for row in race.get('rows', [])]}
              for race in podium.get('races', [])]
}
data = {'as_of': '2026-11-05', 'scope': '2012/13–2025/26 + rozdział jubileuszowy',
        'seasons': seasons, 'medals': read('medals-baseline.json', {'tables': []}),
        'medalsUpdated': read('medals-updated.json', None), 'medalPodium': podium_summary}
payload = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')
html = (ROOT/'site/template.html').read_text()
html = html.replace('/* STYLES */', (ROOT/'site/styles.css').read_text())
html = html.replace('/* DATA */', 'window.ALBUM_DATA = ' + payload + ';')
html = html.replace('/* APP */', (ROOT/'site/app.js').read_text())
(ROOT/'index.html').write_text(html)
(ROOT/'.nojekyll').touch()
print(f'index.html: {len(html.encode()):,} bajtów, {len(seasons)} kart sezonów')
print('Tabele:', sum(len(s['classifications']) for s in seasons))
print('Streszczenia:', sum(len(s['articles']) for s in seasons))
print('Galerie:', sum(len(s['galleries']) for s in seasons))
