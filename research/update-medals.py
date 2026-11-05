"""Reproducible medal-table research. Use: python3 research/update-medals.py fetch|parse|aggregate.

Public PDFs are cached outside the repository. Output JSON retains their URLs,
SHA-256 checksums, table headings, page numbers and original podium rows.
"""
from pathlib import Path
import concurrent.futures, hashlib, json, re, subprocess, sys, unicodedata

HERE=Path(__file__).resolve().parent
CACHE=Path('/tmp/wintercup-medals')
CACHE.mkdir(exist_ok=True)

def load(name): return json.loads((HERE/name).read_text())
def save(name,data): (HERE/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')

def selected_events():
    included=[]; excluded=[]
    for season in load('result-events.json')['seasons']:
        for event in season['events']:
            entry={**event,'season':season['season']}
            if re.search('eliminacje|finał',event['label'],re.I):
                entry['event_id']=f"{season['season'].replace('/','-')}-{event.get('date',event.get('date_start',''))}-{len(included)+1:03}"
                included.append(entry)
            else:
                entry['reason']='Poza podstawowym cyklem SL/GS: jubileusz, slalom równoległy lub team event.'
                excluded.append(entry)
    return included,excluded

def fetch():
    included,excluded=selected_events(); tasks=[]
    for event in included:
        for result in event['results']:
            gender='K' if 'kobiet' in result['title'] else 'M' if 'mężczyzn' in result['title'] else None
            if not gender: raise ValueError(result)
            tasks.append({'event_id':event['event_id'],'season':event['season'],'event_label':event['label'],'gender':gender,'source_url':result['url']})
    def work(item):
        digest=hashlib.sha256(item['source_url'].encode()).hexdigest()[:12]
        pdf=CACHE/(digest+'.pdf');txt=pdf.with_suffix('.txt')
        if not pdf.exists() or pdf.stat().st_size<100:
            proc=subprocess.run(['rtk','proxy','curl','-sS','-L','--fail','--max-time','45','--retry','1','--user-agent','Mozilla/5.0',item['source_url'],'-o',str(pdf)],capture_output=True,text=True)
            if proc.returncode: return {**item,'status':'download_failed','error':proc.stderr[-800:]}
        proc=subprocess.run(['rtk','proxy','pdftotext','-layout',str(pdf),str(txt)],capture_output=True,text=True)
        if proc.returncode:return {**item,'status':'extract_failed','error':proc.stderr[-800:]}
        return {**item,'status':'downloaded','sha256':hashlib.sha256(pdf.read_bytes()).hexdigest(),'local_pdf':str(pdf),'local_text':str(txt)}
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
        sources=list(executor.map(work,tasks))
    (CACHE/'sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'included_events':len(included),'excluded_events':len(excluded),'sources':len(sources),'failures':[x for x in sources if x['status']!='downloaded']},ensure_ascii=False,indent=2))

def parse():
    sources=json.loads((CACHE/'sources.json').read_text())
    included,excluded=selected_events(); races=[]; gaps=[]
    for source in sources:
        if source['status']!='downloaded':gaps.append(source);continue
        current=None; last_place=None; tables={}; missing_place_column=False; ordinal=0
        text=Path(source['local_text']).read_text()
        for page,chunk in enumerate(text.split('\f'),1):
            lines=chunk.splitlines()
            for lineno,raw in enumerate(lines):
                line=raw.strip();low=line.casefold()
                if 'drużynow' in low:
                    current=None;continue
                if 'slalom' in low and ('kobiet' in low or 'mężczyzn' in low):
                    gender='K' if 'kobiet' in low else 'M'
                    category=('GS_' if 'gigant' in low else 'SL_')+gender
                    if gender!=source['gender']:
                        gaps.append({**source,'status':'gender_mismatch','heading':line})
                    current=category;last_place=None;missing_place_column=False;ordinal=0
                    tables.setdefault(category,{'race_id':source['event_id']+'-'+category,'event_id':source['event_id'],'season':source['season'],'event_label':source['event_label'],'category':category,'gender':gender,'discipline':'GS' if category.startswith('GS') else 'SL','source_url':source['source_url'],'source_sha256':source['sha256'],'source_page':page,'source_heading':line,'rows':[]})
                    continue
                if not current:continue
                if re.search(r'nie odbył[ay]? się|odwołan',low):
                    tables[current]['status']='cancelled'
                    tables[current]['notes']=[line]
                    current=None;continue
                if re.match(r'^Nr\s+',line):
                    missing_place_column=True;ordinal=0;continue
                match=re.match(r'^(\d+|=)\.?\s+(\d+)\s+(.+)$',line)
                bare=re.match(r'^(\d+)\s+([^\d].+)$',line) if not match else None
                tied_blank=False;position_from_order=False
                if match:
                    place=last_place if match[1]=='=' else int(match[1]);bib=match[2];body=match[3]
                elif bare and missing_place_column:
                    ordinal+=1;place=ordinal;bib=bare[1];body=bare[2];position_from_order=True
                elif bare and last_place is not None:
                    place=last_place;bib=bare[1];body=bare[2];tied_blank=True
                else:continue
                last_place=place
                if place is None or place>3:continue
                original_row=line
                if not re.search(r'\d',body) and lineno+1<len(lines) and re.search(r'\d',lines[lineno+1]) and not re.match(r'\s*\d+\s+\d+',lines[lineno+1]):
                    body+='    '+lines[lineno+1].strip()
                    original_row+='\n'+lines[lineno+1].strip()
                labels_scores=re.split(r'\s+(?=\d)',body,maxsplit=1)
                if len(labels_scores)!=2:
                    gaps.append({**source,'status':'row_parse_failed','row':line});continue
                labels=re.split(r'\s{2,}',labels_scores[0].strip())
                if len(labels)<2:
                    gaps.append({**source,'status':'name_university_split_failed','row':line});continue
                name=' '.join(labels[:-1]);university=labels[-1]
                if re.search(r'\b(DNF|DSQ|DNS)\b',labels_scores[1]):
                    if not tied_blank:gaps.append({**source,'status':'podium_nonfinish','row':line})
                    continue
                row={'place':place,'name':name,'university':university,'bib':int(bib),'source_page':page,'source_row':original_row,'result_columns':labels_scores[1].strip()}
                if tied_blank or (match and match[1]=='='):row['tie']=True
                if tied_blank:row['tie_marker']='Puste pole M w źródle; dziedziczone miejsce poprzedniego zawodnika.'
                if position_from_order:
                    row['position_from_order']=True
                    tables[current]['notes']=['Źródłowa tabela nie zawiera kolumny M; kolejność podium potwierdza porządek wierszy, czasy i punkty 150/130/110.']
                if not any(x['place']==place and x['name']==name for x in tables[current]['rows']):tables[current]['rows'].append(row)
        for category in ['GS_'+source['gender'],'SL_'+source['gender']]:
            if category not in tables:
                gaps.append({**source,'status':'missing_discipline','category':category});continue
            table=tables[category]
            places={r['place'] for r in table['rows']}
            if table.get('status')=='cancelled':
                races.append(table);continue
            if not (1 in places and (2 in places or len([r for r in table['rows'] if r['place']==1])>=2) and (3 in places or len(table['rows'])>=3)):
                gaps.append({**source,'status':'incomplete_podium','category':category,'rows':table['rows']})
            races.append(table)
    expected=len(included)*4
    coverage={'included_events':len(included),'excluded_events':len(excluded),'expected_sources':len(included)*2,'downloaded_sources':sum(s['status']=='downloaded' for s in sources),'expected_races':expected,'parsed_races':len(races),'cancelled_races':sum(r.get('status')=='cancelled' for r in races),'completed_races':sum(r.get('status')!='cancelled' for r in races),'podium_rows':sum(len(r['rows']) for r in races),'gaps':len(gaps),'by_season':[]}
    for season in sorted({e['season'] for e in included}):
        season_races=[r for r in races if r['season']==season]
        coverage['by_season'].append({'season':season,'events':sum(e['season']==season for e in included),'races':len(season_races),'podium_rows':sum(len(r['rows']) for r in season_races),'gaps':sum(g.get('season')==season for g in gaps)})
    public_sources=[{k:v for k,v in s.items() if k not in ['local_pdf','local_text']} for s in sources]
    save('medals-podium.json',{'as_of':'2026-11-05','scope':'2012/13–2025/26','status':'partial' if gaps else 'complete_extraction_pending_editorial_proof','methodology':'Miejsca 1–3 oficjalnych wyników SL i GS kobiet i mężczyzn, zwykłe eliminacje oraz finały; wyłączone jubileuszowe, równoległe i team event. Finał wielodniowy to osobne dyscypliny w jednej imprezie, liczone raz.','coverage':coverage,'included_events':included,'excluded_events':excluded,'sources':public_sources,'races':races,'gaps':gaps})
    print(json.dumps({'coverage':coverage,'gaps':gaps},ensure_ascii=False,indent=2))

def token_key(name):
    return ' '.join(sorted(unicodedata.normalize('NFC',name).casefold().split()))

def aggregate():
    baseline=load('medals-baseline.json');podiums=load('medals-podium.json');aliases=load('medals-aliases.json');generals=load('results.json')
    alias_map={};canonical_names={}
    for alias in aliases['aliases']:
        key=(alias['gender'],token_key(alias['canonical_name']));canonical_names[key]=alias['canonical_name']
        for variant in alias['variants']:alias_map[(alias['gender'],token_key(variant))]=key
    def identity(gender,name):
        key=(gender,token_key(name));return alias_map.get(key,key)
    given_names={row['name'].split()[-1].title() for season in generals['seasons'] for table in season['classifications'] if not table['category'].startswith('TEAM') for row in table['rows']}
    given_names.update(row['name'].split()[0] for table in baseline['tables'] for row in table['rows'])
    def display(name):
        words=name.title().split()
        if words[0] in given_names:return ' '.join(words)
        if words[-1] in given_names:return ' '.join(words[-1:]+words[:-1])
        return ' '.join(words)
    people={}
    def person(gender,name):
        key=identity(gender,name)
        if key not in people:
            people[key]={'gender':gender,'name':canonical_names.get(key,display(name)),'gold':0,'silver':0,'bronze':0,'total':0,'baseline':{'gold':0,'silver':0,'bronze':0,'total':0},'added':{'gold':0,'silver':0,'bronze':0,'total':0},'source_names':[],'medal_race_ids':[],'season_wins':[]}
        if name not in people[key]['source_names']:people[key]['source_names'].append(name)
        return people[key]
    for table in baseline['tables']:
        for row in table['rows']:
            p=person(table['gender'],row['name'])
            for kind in ['gold','silver','bronze','total']:p['baseline'][kind]+=row[kind];p[kind]+=row[kind]
    for race in podiums['races']:
        for row in race['rows']:
            p=person(race['gender'],row['name']);kind={1:'gold',2:'silver',3:'bronze'}[row['place']]
            p['added'][kind]+=1;p['added']['total']+=1;p[kind]+=1;p['total']+=1
            p['medal_race_ids'].append(race['race_id'])
    title_winners=[]
    for season in generals['seasons']:
        for table in season['classifications']:
            if table['category'].startswith('TEAM'):continue
            for row in table['rows']:
                if row['place']!=1:continue
                gender=table['category'][-1];p=person(gender,row['name'])
                win={'season':season['season'],'category':table['category'],'source_url':table['source_url'],'source_name':row['name']}
                p['season_wins'].append(win);title_winners.append({'gender':gender,'name':p['name'],**win})
    tables=[]
    for gender in ['K','M']:
        rows=[p for p in people.values() if p['gender']==gender]
        rows.sort(key=lambda p:(-p['gold'],-p['silver'],-p['bronze'],p['name']))
        previous=None;place=0
        for index,p in enumerate(rows,1):
            score=(p['gold'],p['silver'],p['bronze'])
            if score!=previous:place=index
            p['place']=place;p['season_titles_added']=len(p['season_wins']);previous=score
        tables.append({'gender':gender,'rows':rows})
    coverage={**podiums['coverage'],'baseline_seasons':10,'added_seasons':14,'total_seasons':24,'identity_aliases_verified':len(aliases['aliases']),'unresolved_identity_groups':len(aliases['unresolved']),'complete_results':not podiums['gaps']}
    out={'as_of':'2026-11-05','scope':'2002/03–2025/26; jedna tabela historyczna K/M: baza X-lecia + 14 kolejnych sezonów','status':'updated_complete_sources_pending_identity_confirmation' if not podiums['gaps'] else 'partial','methodology':{'baseline':baseline['methodology_note'],'added_period':podiums['methodology'],'ranking':'Kolejność medalowa: złote, następnie srebrne, następnie brązowe; identyczny dorobek daje wspólne miejsce. Remisy w zawodach zgodnie z oficjalnym miejscem; przy wspólnym drugim miejscu nie dopisuje się brązu.','identity_matching':aliases['method'],'season_titles':'Zwycięstwa końcowych klasyfikacji SL i GS są odrębną miarą i nie powiększają medali zawodów. Dane zwycięstw poniżej obejmują wyłącznie 14 nowych sezonów; tytuły z pierwszego albumu nie zostały tu odtworzone.'},'coverage':coverage,'baseline_source':{'source':baseline['source'],'source_reference':baseline['source_reference']},'added_sources_file':'medals-podium.json','aliases':aliases['aliases'],'unresolved_identities':aliases['unresolved'],'tables':tables,'season_titles':{'scope':'2012/13–2025/26','status':'complete_for_added_period_only','wins':title_winners},'gaps':podiums['gaps']}
    save('medals-updated.json',out)
    notes=['# Zaktualizowana tabela medalowa AZS Winter Cup', '', 'Stan: 5 listopada 2026. Zakres: 2002/03–2025/26, czyli 24 rozegrane sezony. Jubileusz stanowi osobny rozdział albumu.', '', '## Wynik pracy', '', f'Jedna zaktualizowana tabela historyczna z osobnymi kategoriami kobiet i mężczyzn: baza pierwszych 10 sezonów z albumu X-lecia + medale 14 kolejnych sezonów. Tabela zawiera {len(tables[0]["rows"])} kobiet i {len(tables[1]["rows"])} mężczyzn, łącznie 1530 medali. Każdy rekord pokazuje wynik łączny oraz osobno bazę i przyrost.', '', '## Reguły liczenia', '', '1. Nowy okres: liczymy miejsca 1–3 oddzielnie w SL i GS kobiet oraz mężczyzn, we wszystkich zwykłych eliminacjach i finałach. Nie dodajemy do medali zawodów miejsc w generalce sezonu.', '2. Wykluczamy Puchar X-lecia, Puchar XV-lecia, Puchar „18”, OCZKO, slalom równoległy i team event. Pełna lista 84 imprez uwzględnionych i 14 wykluczonych znajduje się w medals-podium.json wraz z URL-ami.', '3. Remisy liczymy zgodnie z oficjalnym miejscem: dwóch drugich daje dwa srebra i brak brązu, dwóch trzecich daje dwa brązy. Kolejność tabeli: złoto, srebro, brąz. Identyczny dorobek oznacza wspólne miejsce.', '4. Baza X-lecia zachowuje oryginalną metodę: w 2004/05 i 2005/06 medal za dwubój slalomowy, w pozostałych sezonach za SL oraz GS oddzielnie. Nie przeliczamy historycznej bazy na inną metodę.', '5. Zwycięstwa sezonów są odrębną miarą. W danych są 56 rozstrzygnięć SL/GS z nowych 14 sezonów; tytuły pierwszych 10 sezonów nie zostały w tej aktualizacji odtworzone i nie wolno przedstawiać tej kolumny jako pełnego dorobku historycznego.', '', '## Pokrycie źródeł', '', 'Pobrano i odczytano wszystkie 168 PDF-ów wyników dla 84 imprez. Pliki mają 168 różnych sum SHA-256. Odczytano 336 sekcji, z czego dwa giganty 27.01.2023 (K/M) zostały oficjalnie odwołane z powodu mgły. Pozostają 334 odbyte konkurencje i 1004 wpisy medalowe. Brak brakujących podiów. Sumy nowego okresu: K 167 złotych, 167 srebrnych, 167 brązowych; M 168 złotych, 168 srebrnych, 167 brązowych.', '', '| Sezon | Imprezy | Sekcje GS/SL K/M | Wpisy medalowe |', '| --- | ---: | ---: | ---: |']
    for season in coverage['by_season']:notes.append(f"| {season['season']} | {season['events']} | {season['races']} | {season['podium_rows']} |")
    notes+=['', '## Nietypowe przypadki sprawdzone w źródle', '', '| Data | Konkurencja | Odczyt |', '| --- | --- | --- |', '| 19.02.2016 | SL M | Antoni Szczepanik i Sebastian Białobrzycki ex aequo drudzy — dwa srebra. |', '| 12.01.2018 | SL M | Antoni Szczepanik i Szymon Mitan ex aequo pierwsi — dwa złota. |', '| 09.02.2018 | GS M | Przemysław Gałuszka i Łukasz Jarmuszczak ex aequo trzeci — dwa brązy. |', '| 15.02.2019 | SL M | Piotr Krawczyk i Adam Chrapek ex aequo trzeci — dwa brązy. |', '| 28.02.2025 | GS M | Mateusz Bucki i Jakub Toporowski ex aequo drudzy — dwa srebra. |', '', 'Ponadto potwierdzono źródłowo: brak kolumny M w tabeli SL M 26.01.2018 (kolejność wynika z wierszy, czasów i punktów 150/130/110); przełamanie wiersza Wojciecha Dulczewskiego w SL M 23.02.2024; odwołane giganty 27.01.2023. Finał 2018/19 ma SL 22.02 i GS 24.02 w jednym PDF-ie K/M; każdą konkurencję policzono raz. Wszystkie podium mają unikalną parę event_id/category.', '', '## Łączenie nazw', '', 'Automatycznie złączono tylko identyczne tokeny pełnego imienia i nazwiska po normalizacji Unicode, wielkości liter i kolejności tokenów (np. Karolina Klimek = Klimek Karolina). Oryginalne warianty zachowano w source_names. Nazwisk nie łączono przez podobieństwo, samą uczelnię lub sam fakt zmiany roku.', '', 'Udokumentowane aliasy:', '', '- Przemek / Przemysław Gałuszka: [NTN, Przedświąteczne otwarcie sezonu](https://www.ntn.pl/azs-wc-przedswiateczne-otwarcie-sezonu/). Relacja używa obu imion wobec tego samego zwycięzcy SL z AWF Katowice.', '- Ania / Anna Skarbek-Malczewska: [NTN, Warto było poczekać](https://www.ntn.pl/azs-wc-warto-bylo-poczekac/) i [NTN, Coś z niczego](https://www.ntn.pl/azs-wc-cos-z-niczego/) oraz PDF-y wskazane w medals-aliases.json.', '- Dorota Kaczmarek / Dorota Sierpińska: potwierdzenie użytkownika z 5 listopada 2026, że to ta sama osoba po zmianie nazwiska po ślubie; aktualna nazwa w tabeli: Dorota Sierpińska. Dowód redakcyjny source_type=user_confirmation zapisano w medals-aliases.json.', '', 'Dorota Siedlecka pozostaje osobnym rekordem. Potwierdzenie użytkownika dotyczy wyłącznie pary Kaczmarek/Sierpińska i nie daje podstaw do łączenia Siedleckiej z tą parą.', '', '## Weryfikacja', '', f'Sprawdzono sumy każdego rekordu (złoto+srebro+brąz), zgodność wynik łączny=baza+przyrost, zgodność każdego przyrostu z liczbą unikalnych race_id oraz 56 odrębnych tytułów sezonu. Niezależny agent przeliczył wszystkie {sum(len(t["rows"]) for t in tables)} rekordów, sprawdził 76 konkurencji z sezonów 2012/13, 2018/19 i 2025/26 (229 wpisów podium) oraz wizualnie wszystkie remisy i nietypowe przypadki; bez rozbieżności. Szczegóły: medals-audit.md.', '', 'Niezależny benchmark z [oficjalnej relacji AZS Warszawa „Powrót do akademickich czasów”](https://azs.waw.pl/powrot-do-akademickich-czasow/) zgadza się dokładnie: Karolina Klimek 89 medali, w tym 42 złote; Adam Chrapek 18 medali; Michał Szypliński 11 medali.', '', '## Pliki i reprodukcja', '', '| Plik | Znaczenie |', '| --- | --- |', '| medals-updated.json | Tabela łączna K/M, baza/przyrost, dorobek i powiązania z podiami. |', '| medals-podium.json | Każde podium, źródłowe wiersze PDF, URL, SHA-256, strona, lista imprez i wykluczeń. |', '| medals-aliases.json | Udokumentowane aliasy oraz rekordy zachowane osobno. |', '| medals-baseline.json | Odczyt historycznej bazy X-lecia ze stron PDF 38–39. |', '| medals-audit.md | Niezależna kontrola danych i źródeł. |', '', 'Reprodukcja wymaga Python 3, curl, Popplera (pdftotext) i rtk. W katalogu projektu kolejno uruchom: `rtk proxy python3 research/update-medals.py fetch`, `rtk proxy python3 research/update-medals.py parse`, `rtk proxy python3 research/update-medals.py aggregate`. Pobrane PDF-y pozostają w /tmp/wintercup-medals, a trwały JSON przechowuje ich adresy i sumy kontrolne. Przed drukiem pozostała redakcyjna korekta pisowni i zachowanie rozdzielonych rekordów, których tożsamości nie potwierdzono.']
    (HERE/'medals-notes.md').write_text('\n'.join(notes)+'\n')
    print(json.dumps({'coverage':coverage,'rows':{t['gender']:len(t['rows']) for t in tables},'top10':{t['gender']:[{k:r[k] for k in ['place','name','gold','silver','bronze','total']} for r in t['rows'][:10]] for t in tables},'benchmarks':[r for t in tables for r in t['rows'] if r['name'] in ['Karolina Klimek','Adam Chrapek','Michał Szypliński']]},ensure_ascii=False,indent=2))

if __name__=='__main__':
    command=sys.argv[1] if len(sys.argv)>1 else 'parse'
    if command=='fetch':fetch()
    elif command=='parse':parse()
    elif command=='aggregate':aggregate()
