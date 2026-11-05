from pathlib import Path
import json,re

index=json.loads(Path('/tmp/wintercup-results/index.json').read_text())
seasons={f'{y}/{str(y+1)[-2:]}':{'season':f'{y}/{str(y+1)[-2:]}','classifications':[],'gaps':[]} for y in range(2012,2026)}
for n,item in enumerate(index):
    year=2025-n//2; season=seasons[f'{year}/{str(year+1)[-2:]}']; gender='K' if n%2==0 else 'M'
    tables={}; current=None; last_place=None
    lines=Path(item['text_file']).read_text().splitlines()
    for lineno,raw in enumerate(lines):
        line=raw.strip()
        low=line.lower()
        if 'slalom' in low and ('klasyfikacja' in low):
            current=('GS_' if 'gigant' in low else 'SL_')+gender
            tables.setdefault(current,{'category':current,'scope':'końcowa klasyfikacja sezonu','source_url':item['url'],'title':line,'rows':[],'status':'transcribed','notes':[]})
            last_place=None
            continue
        if 'klasyfikacja' in low and ('drużynowa' in low):
            current='TEAM_'+gender
            tables.setdefault(current,{'category':current,'scope':'końcowa klasyfikacja sezonu; uczelnie oddzielnie według płci','source_url':item['url'],'title':line,'rows':[],'status':'transcribed','notes':[]})
            last_place=None
            continue
        if not current: continue
        m=re.match(r'^(\d+|=)\s+(.+)$',line)
        if not m: continue
        place=last_place if m[1]=='=' else int(m[1]); last_place=place
        if place is None or place>10:continue
        body=m[2]
        if year==2025 and not current.startswith('TEAM_'):
            body=re.sub(r'^\d+\s+','',body)
        parts=re.split(r'\s+(?=\d)',body,maxsplit=1)
        if len(parts)!=2: continue
        labels, scores=parts
        labels=re.split(r'\s{2,}',labels.strip())
        if current.startswith('TEAM_'):
            university=' '.join(labels); name=university
        elif len(labels)>=2:
            university=labels[-1]; name=' '.join(labels[:-1])
        else:
            raise ValueError((year,current,raw,labels))
        points=scores.strip().split()[-1]
        if lineno+1<len(lines) and re.fullmatch(r'\s*\d+(?:[.,]\d+)?\s*',lines[lineno+1]):
            points=lines[lineno+1].strip()
        row={'place':place,'name':name,'university':university,'points':float(points.replace(',','.')),'source_row':line}
        if row['points'].is_integer():row['points']=int(row['points'])
        if m[1]=='=':row['tie']=True
        if not any(x['place']==row['place'] and x['name']==row['name'] for x in tables[current]['rows']):
            tables[current]['rows'].append(row)
    for category in ['GS_'+gender,'SL_'+gender,'TEAM_'+gender]:
        if category in tables:
            if category=='TEAM_M' and year==2016:
                tables[category]['notes'].append('W oficjalnej tabeli sklasyfikowano 8 uczelni; pokazano wszystkie.')
            if category=='TEAM_M' and year==2013:
                tables[category]['notes'].append('W PDF sumy pierwszych sześciu uczelni są w osobnym wierszu; odczyt uwzględnia te wartości.')
            season['classifications'].append(tables[category])
        else:
            season['classifications'].append({'category':category,'scope':'końcowa klasyfikacja sezonu','source_url':item['url'],'title':item['title'],'rows':[],'status':'requires_ocr','notes':['PDF obrazowy; wymaga ręcznego odczytu i kontroli.']})
            season['gaps'].append(category+': wymaga OCR')
out={'as_of':'2026-11-05','archive_url':'https://wintercup.pl/wyniki/','scope':'2012/13–2025/26; 14 zakończonych sezonów; jubileusz osobno','method':'Bezpośrednie PDF-y klasyfikacji generalnych/końcowych z oficjalnego archiwum; top 10 miejsc, nazwiska i nazwy uczelni w oryginalnej pisowni źródła; K/M osobno. Suma punktów przepisana ze źródła, bez przeliczania.','seasons':list(seasons.values())}
Path(__file__).with_name('results.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps([{'season':s['season'],'tables':{t['category']:len(t['rows']) for t in s['classifications']},'gaps':s['gaps']} for s in out['seasons']],ensure_ascii=False,indent=2))
