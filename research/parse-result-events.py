from pathlib import Path
from html import unescape
import re,json

html=Path('/tmp/wintercup-wyniki.html').read_text()
chunks=re.split(r'SEZON (\d{4})/(\d{4})',html)
seasons=[]
for i in range(1,len(chunks),3):
    start,end,body=chunks[i:i+3]
    if not 2012<=int(start)<=2025:continue
    events=[]
    paragraphs=re.findall(r'<p\b[^>]*>(.*?)</p>',body,re.S)
    for p in paragraphs:
        label=' '.join(unescape(re.sub('<[^>]+>',' ',p)).split())
        if re.search(r'\d{1,2}\.\d{2}\.\d{4}',label) and not '<a ' in p:
            event={'label':label,'source_url':'https://wintercup.pl/wyniki/','results':[]}
            dates=re.findall(r'(?<![\d/])(\d{1,2})\.(\d{2})\.(\d{4})',label)
            if len(dates)==1:
                day,month,year=dates[0];event['date']=f'{year}-{month}-{day.zfill(2)}'
            events.append(event)
        elif events and '<a ' in p:
            for url,inner in re.findall(r'<a\b[^>]*href=[\"\x27](.*?)[\"\x27][^>]*>(.*?)</a>',p,re.S):
                title=' '.join(unescape(re.sub('<[^>]+>',' ',inner)).split())
                if title in ['wyniki kobiet','wyniki mężczyzn','wyniki','team event','slalom równoległy','indywidualnie']:
                    events[-1]['results'].append({'title':title,'url':unescape(url)})
    if start=='2018':
        for event in events:
            if event['label'].startswith('III eliminacje'):
                event['archive_label']=event['label']
                event['label']='III eliminacje, 25.01.2019: Szczawnica/Palenica I'
                event['date']='2019-01-25'
                event['date_source_url']=event['results'][0]['url']
                event['notes']=['Korekta literówki indeksu: data 25.01.2019 potwierdzona w nagłówku PDF wyników; indeks błędnie powtarza 11.01.2019.']
            if event['label'].startswith('FINAŁ'):
                event['date_start']='2019-02-22';event['date_end']='2019-02-24'
                event['date_source_url']=event['results'][0]['url']
                event['disciplines']=[{'date':'2019-02-22','name':'Slalom kobiet'},{'date':'2019-02-24','name':'Slalom gigant kobiet'}]
                event['notes']=['Daty SL i GS potwierdzone w nagłówkach PDF wyników kobiet.']
    seasons.append({'season':f'{start}/{end[-2:]}','events':events})
out={'as_of':'2026-11-05','source_url':'https://wintercup.pl/wyniki/','notes':['Nazwy i daty przepisane z indeksu oficjalnego archiwum wyników. Indeks zawiera możliwe literówki; do ostatecznej chronologii daty trzeba skonfrontować z nagłówkiem PDF i relacją. Daty z zakresami wymagają ręcznego sprawdzenia.'],'seasons':seasons}
Path(__file__).with_name('result-events.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps([{'season':s['season'],'events':[e['label'] for e in s['events']]} for s in seasons],ensure_ascii=False,indent=2))
