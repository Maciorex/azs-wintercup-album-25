'use strict';
const D = window.ALBUM_DATA;
const main = document.querySelector('#main');
const storageKey = 'azs-wintercup-album25-planning-v1';
const layoutFields = {
  layoutTitle:{label:'Tytuł sezonu',hint:'Roboczy tytuł otwierający rozdział',type:'title'},
  layoutHero:{label:'Zdjęcie 01 · otwarcie',hint:'Który kadr? Wpisz nazwę pliku lub link, osoby i pomysł na podpis.',type:'photo'},
  layoutStory:{label:'Tekst · kronika sezonu',hint:'Co opowiemy? Główne wydarzenia, sceny i odnośniki do relacji NTN.',type:'text'},
  layoutAction:{label:'Zdjęcie 02 · sport',hint:'Przejazd, meta lub podium. Kadr / link / podpis.',type:'photo'},
  layoutMemory:{label:'Wspomnienie / cytat',hint:'Czyja historia? Bohater, temat rozmowy i wybrany fragment.',type:'memory'},
  layoutPortrait:{label:'Zdjęcie 03 · ludzie',hint:'Portret lub ekipa. Kadr / link / podpis.',type:'photo'},
  layoutRanking:{label:'Ranking wyników',hint:'Uwagi do tabel: układ, podpisy, wyróżnienia. Wyniki są już w materiałach sezonu.',type:'rankings'}
};
const allowedFields = ['angle','writer','status','interviewees','questions','memories','draft','photos','todo','intro','hallRules','hallNotes','teamNotes','anniversary','layoutTemplate',...Object.keys(layoutFields)];
const layoutTemplates = {
  spread:{label:'2 strony · rozkładówka',pages:[
    {title:'Otwarcie i kronika',slots:['layoutTitle','layoutHero','layoutStory']},
    {title:'Ludzie i wyniki',slots:['layoutMemory','layoutAction','layoutPortrait','layoutRanking']}
  ]},
  chapter:{label:'4 strony · rozdział',pages:[
    {title:'Otwarcie sezonu',slots:['layoutTitle','layoutHero']},
    {title:'Kronika i sport',slots:['layoutStory','layoutAction']},
    {title:'Karta wyników',slots:['layoutRanking']},
    {title:'Ludzie i wspomnienia',slots:['layoutMemory','layoutPortrait']}
  ]}
};
const categoryLabels = {GS_K:'Gigant · kobiety',SL_K:'Slalom · kobiety',GS_M:'Gigant · mężczyźni',SL_M:'Slalom · mężczyźni',TEAM_K:'Uczelnie · kobiety',TEAM_M:'Uczelnie · mężczyźni'};
const categoryOrder = Object.keys(categoryLabels);
let planning = {};
let activeCategory = 'GS_K';
let storageOk = true;
try { const saved = JSON.parse(localStorage.getItem(storageKey) || '{}'); planning = cleanPlanning(saved); }
catch { storageOk = false; }

function e(v) { return String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function cleanPlanning(input) {
  const out = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return out;
  const scopes = new Set(['global', ...D.seasons.map(s=>s.id)]);
  for (const [scope, fields] of Object.entries(input)) {
    if (!scopes.has(scope) || !fields || typeof fields !== 'object' || Array.isArray(fields)) continue;
    out[scope] = {};
    for (const [key, value] of Object.entries(fields)) {
      if (allowedFields.includes(key) && typeof value === 'string' && value.length <= 100000) out[scope][key] = value;
    }
  }
  return out;
}
function url(value) { try { const u=new URL(value); return ['https:','http:'].includes(u.protocol)?e(u.href):'#'; } catch { return '#'; } }
function link(href,label,cls='') { return `<a href="${url(href)}" target="_blank" rel="noopener noreferrer" class="${e(cls)}">${e(label)} ↗</a>`; }
function list(items, cls='') { return `<ul class="${e(cls)}">${items.map(x=>`<li>${e(x)}</li>`).join('')}</ul>`; }
function unique(items) { return [...new Set(items.filter(Boolean))]; }
function stats(items) { return `<div class="stats">${items.map(([n,t])=>`<div class="stat"><strong>${e(n)}</strong><span>${e(t)}</span></div>`).join('')}</div>`; }
function sectionTitle(title,aside='') { return `<div class="section-title"><h2>${e(title)}</h2><span>${e(aside)}</span></div>`; }
function field(scope,key,label,placeholder='',type='textarea') {
  const value=planning[scope]?.[key] || (key==='status'?'Zbieramy materiały':'');
  const id=`${scope}-${key}`;
  const attrs=`id="${e(id)}" data-scope="${e(scope)}" data-field="${e(key)}" placeholder="${e(placeholder)}"`;
  let control;
  if (type === 'select') control=`<select ${attrs}>${['Do omówienia','Zbieramy materiały','Rozmowy w toku','Szkic tekstu','Do korekty','Gotowe do składu'].map(x=>`<option ${value===x?'selected':''}>${e(x)}</option>`).join('')}</select>`;
  else if (type === 'input') control=`<input ${attrs} value="${e(value)}">`;
  else control=`<textarea ${attrs} rows="4">${e(value)}</textarea>`;
  return `<label class="field ${type==='textarea'?'wide':''}" for="${e(id)}">${e(label)}${control}</label>`;
}
function totals() {
  return [D.seasons.length, D.seasons.reduce((a,s)=>a+s.classifications.length,0),D.seasons.reduce((a,s)=>a+s.articles.filter(a=>a.summary).length,0),new Set(D.seasons.flatMap(s=>s.galleries.map(g=>g.url))).size];
}
function renderNav() {
  const route=(location.hash.slice(1).split(':')[0] || 'start');
  const items=[['start','Przegląd albumu','01'],['wstep','Wstęp i układ','02'],['rozmowy','Rozmowy i redakcja','03'],['jubileusz','Rozdział jubileuszowy','04'],['hall','Hall of Fame','05']];
  document.querySelector('#main-nav').innerHTML=items.map(([id,label,n])=>`<a href="#${id}" class="${route===id?'active':''}" ${route===id?'aria-current="page"':''}><span>${label}</span><span>${n}</span></a>`).join('');
  const q=document.querySelector('#season-search').value.trim().toLocaleLowerCase('pl');
  const found=D.seasons.filter(s=>!q || JSON.stringify(s).toLocaleLowerCase('pl').includes(q));
  document.querySelector('#season-nav').innerHTML=found.map(s=>`<a href="#${s.id}" class="${route===s.id?'active':''}" ${route===s.id?'aria-current="page"':''}><span>${e(s.label)}</span><span>${e(s.roman)}</span></a>`).join('');
  document.querySelector('#search-count').textContent=q?`${found.length} z ${D.seasons.length} sezonów`:'';
}
function overview() {
  const ns=totals();
  return `<div class="hero"><div><span class="eyebrow">ALBUM 25-LECIA / TOM II</span><h1>Kolejne zimy.<br><em>Nasze historie.</em></h1><p class="intro">Od wyników na mecie do tego, co pamiętamy do dziś. Warsztat albumu AZS Winter Cup: 14 sezonów, ludzie i wspólne wspomnienia.</p><a class="button" href="#${D.seasons[0].id}">Zacznij od sezonu 2012/13 →</a></div><div class="hero-art" aria-label="25 lat AZS Winter Cup"><span class="art-caption">ATMOSFERA<br>ZABAWA<br>SPORT</span><span class="big">25<span class="red">.</span></span><span class="pole"></span></div></div>
  ${stats(ns.map((n,i)=>[n,['kart sezonów','tabele generalne','streszczenia NTN','adresy galerii'][i]]))}
  <div class="notice"><strong>Zakres ustalony: 2012/13–2025/26 + rozdział jubileuszowy</strong>Tom X-lecia kończy się na 2011/12. Nowy album obejmuje następne 14 sezonów. Sezonu 2026/27 nie uwzględniamy. Materiały są bazą do wspominania i pisania; statusy źródeł pokazują, co wymaga sprawdzenia.</div>
  ${sectionTitle('Sezon po sezonie','Wyniki · relacje · zdjęcia · notatki')}
  <div class="season-grid">${D.seasons.map(s=>`<a class="season-card" href="#${s.id}"><div class="card-top"><span>SEZON ${e(s.roman)}</span><span>↗</span></div><h3>${e(s.label)}</h3><p>${e(s.workingAngle || 'Wyniki, relacje i zdjęcia do odtworzenia historii sezonu.')}</p><span class="pill ${planning[s.id]?.status==='Gotowe do składu'?'':'plan'}">${e(planning[s.id]?.status || 'Zbieramy materiały')}</span><div class="mini-counts"><span>${s.classifications.length}/6 tabel</span><span>${s.articles.filter(a=>a.summary).length} streszczeń</span><span>${s.galleries.length} galerii</span></div></a>`).join('')}</div>
  ${sectionTitle('Jak pracujemy','Materiały → wspomnienia → tekst')}
  <div class="two-col"><div class="panel"><h3>Najpierw przypominamy sobie sezon</h3><ol><li>Otwórz generalki, relacje i galerie.</li><li>Dopisz luźne skojarzenia oraz nazwiska do rozmów.</li><li>Zapisz pomysł na tekst i wybór kadrów.</li></ol></div><div class="panel"><h3>Wspólna baza, lokalne notatki</h3><p>HTML działa po otwarciu pliku oraz na GitHub Pages. Materiały źródłowe są częścią pliku. Twoje dopiski zapisują się tylko w tej przeglądarce; przy przekazaniu pracy użyj „Eksport notatek”.</p><button class="secondary" id="download-research">Pobierz bazę materiałów JSON ↓</button></div></div>`;
}
function resultTable(c, heading=false) {
  if (!c) return '<div class="empty">Brak tabeli w bazie.</div>';
  const team=c.category.startsWith('TEAM');
  return `${heading?`<h3 class="table-heading">${e(categoryLabels[c.category])}</h3>`:''}<div class="table-wrap"><table><caption class="sr-only">${e(c.title)}</caption><thead><tr><th scope="col">Miejsce</th><th scope="col">${team?'Uczelnia':'Zawodniczka / zawodnik'}</th>${team?'':'<th scope="col">Uczelnia</th>'}<th scope="col">Punkty</th></tr></thead><tbody>${c.rows.map(r=>`<tr><td>${e(r.place)}.</td><td>${e(r.name)}</td>${team?'':`<td>${e(r.university)}</td>`}<td>${e(Number(r.points).toLocaleString('pl-PL'))}</td></tr>`).join('')}</tbody></table></div><p class="source-note">${link(c.source_url,'Oficjalny PDF klasyfikacji końcowej')} · Przepisane ze źródła; kolejność i pisownia źródłowa.${c.notes?.length?`<br>${c.notes.map(e).join(' ')}`:''}</p>`;
}
function articleCards(articles) {
  if (!articles.length) return '<div class="empty">Brak streszczenia w tym sezonie. Potrzebna kwerenda w archiwum NTN.</div>';
  return `<div class="article-list">${articles.map(a=>`<article class="article"><div class="article-meta"><strong>${e(a.type || 'RELACJA NTN')}</strong><span>${e(a.published || '')}<br>${e(a.author || 'Autor do potwierdzenia')}<br>${e(a.edition || '')}</span></div><div><h3>${e(a.title)}</h3><p>${e(a.summary || 'Artykuł odnaleziony; streszczenie do przygotowania.')}</p>${link(a.url,'Czytaj oryginał w NTN')}<span class="metadata">Autorskie streszczenie robocze na podstawie treści artykułu.</span></div></article>`).join('')}</div>`;
}
function galleryStatus(g) {
  const st=g.status || '';
  const labels={galeria_odczytana_http_200:'Galeria dostępna (HTTP 200)',link_z_katalogu_timeout:'Link z katalogu — timeout przy odczycie',link_z_relacji_album_nieodczytany:'Link z NTN — zawartość albumu nieodczytana'};
  if(labels[st])return labels[st];
  if (/konflikt|conflict|mismatch/.test(st)) return 'Konflikt przypisania';
  if (/404|stare_archiwum/.test(st)) return 'Stare archiwum — odzyskać pliki';
  if (/facebook|fb|login|ogranicz/.test(st)) return 'Link ze źródła — sprawdzić na Facebooku';
  if (/link_z_katalogu/.test(st)) return 'Link z katalogu SkiFoto';
  if (/potwierd|verified|dostepn|dostępn/.test(st)) return 'Zweryfikowano źródło';
  return st.replaceAll('_',' ') || 'Do sprawdzenia';
}
function galleryTable(s) {
  if(!s.galleries.length) return '<div class="empty">Nie znaleziono bezpośrednich albumów. Poprośmy Michała Szyplińskiego o indeks archiwum tego sezonu.</div>';
  return `<div class="table-wrap"><table class="edition-table"><thead><tr><th scope="col">Edycja / zdjęcia</th><th scope="col">Album</th><th scope="col">Status źródła</th></tr></thead><tbody>${s.galleries.map(g=>`<tr><td>${e(g.edition || 'Edycja do przypisania')}<span class="metadata">${e([g.date,g.venue].filter(Boolean).join(' · '))}</span></td><td>${link(g.url,g.title,'gallery-link')}<span class="metadata">${e(g.platform)} · ${e(g.photographer || 'Autor do potwierdzenia')}</span></td><td><span class="pending-label">${e(galleryStatus(g))}</span>${g.notes?`<span class="metadata">${e(g.notes)}</span>`:''}${g.source_url?`<span class="metadata">${link(g.source_url,'Skąd mamy link')}</span>`:''}</td></tr>`).join('')}</tbody></table></div>`;
}
function eventTable(s) {
  if(!s.events.length) return '<div class="empty">Kalendarz sezonu do odtworzenia z komunikatów organizatora.</div>';
  return `<div class="table-wrap"><table class="edition-table"><thead><tr><th scope="col">Data / zawody</th><th scope="col">Dokumentacja sportowa</th><th scope="col">Galerie tej edycji</th></tr></thead><tbody>${s.events.map(ev=>{const pe=s.photoEditions.find(p=>p.label===ev.label);const galleries=(pe?.gallery_urls||[]).map(u=>s.galleries.find(g=>g.url===u)).filter(Boolean);return `<tr><td>${e(ev.label)}${ev.notes?`<span class="metadata">${e(Array.isArray(ev.notes)?ev.notes.join(' '):ev.notes)}</span>`:''}</td><td>${(ev.results || []).map(r=>link(r.url,r.title,'gallery-link')).join('')}</td><td>${galleries.length?galleries.map(g=>`${link(g.url,g.platform,'gallery-link')}<span class="metadata">${e(galleryStatus(g))}</span>`).join(''):'<span class="pending-label">Brak przypisanego albumu — uzupełnić z archiwum</span>'}</td></tr>`;}).join('')}</tbody></table></div><p class="source-note">${link('https://wintercup.pl/wyniki/','Kalendarz według oficjalnego archiwum wyników')}. Galerie poniżej zachowują nazwy z archiwów zdjęć; niepewne przypisania wymagają uzgodnienia.</p>`;
}
function layoutCompletion(s) {
  return `${Object.keys(layoutFields).filter(key=>planning[s.id]?.[key]?.trim()).length}/${Object.keys(layoutFields).length} pól uzupełnionych`;
}
function layoutSlot(s,key,compactPhotos) {
  const f=layoutFields[key],id=`${s.id}-${key}`,value=planning[s.id]?.[key] || '';
  const rankings=f.type==='rankings'?`<p class="layout-slot-hint">Top 10 SL i GS oraz klasyfikacje uczelni — osobno kobiety i mężczyźni.</p><div class="ranking-mini-grid" aria-label="Miejsce na sześć klasyfikacji">${categoryOrder.map(c=>`<span>${e(categoryLabels[c])}</span>`).join('')}</div>`:'';
  const attrs=`id="${e(id)}" data-scope="${e(s.id)}" data-field="${e(key)}" placeholder="${e(f.hint)}"`;
  return `<div class="layout-slot layout-slot-${f.type} ${key==='layoutHero'?'layout-slot-hero':''} ${compactPhotos && ['layoutAction','layoutPortrait'].includes(key)?'layout-slot-half':''}"><label for="${e(id)}">${e(f.label)}</label>${rankings}${f.type==='title'?`<input ${attrs} value="${e(value)}">`:`<textarea ${attrs} rows="3">${e(value)}</textarea>`}</div>`;
}
function seasonLayout(s) {
  const selected=Object.hasOwn(layoutTemplates,planning[s.id]?.layoutTemplate)?planning[s.id].layoutTemplate:'spread';
  const template=layoutTemplates[selected];
  return `<section id="uklad" class="season-layout">${sectionTitle('Układ stron albumu','Edytowalna makieta / każdy sezon osobno')}
    <p class="layout-intro">Wybierz przykładowy układ i wpisz w okienkach, co tu trafi: zdjęcie, tekst lub wspomnienie. Każdy wariant ma miejsce na ranking wyników. Zmiana wariantu zachowuje wpisaną zawartość.</p>
    <div class="layout-toolbar"><div class="layout-options" role="group" aria-label="Wariant układu stron">${Object.entries(layoutTemplates).map(([key,t])=>`<button data-layout="${key}" aria-pressed="${key===selected}">${e(t.label)}</button>`).join('')}</div><span id="layout-completion" role="status">${e(layoutCompletion(s))}</span></div>
    <div class="album-spread" data-template="${selected}">${template.pages.map((page,i)=>`<article class="album-page" aria-label="Strona ${i+1}: ${e(page.title)}"><header class="album-page-header"><span>SEZON ${e(s.label)}</span><span>${String(i+1).padStart(2,'0')} / ${String(template.pages.length).padStart(2,'0')}</span></header><h3>${e(page.title)}</h3><div class="album-page-content">${page.slots.map(key=>layoutSlot(s,key,selected==='spread')).join('')}</div><div class="album-page-footer">${e(s.label)}<span>${String(i+1).padStart(2,'0')}</span></div></article>`).join('')}</div>
    <p class="source-note">To plan zawartości stron. Nazwy plików, linki i podpisy wpisujcie w polach „Zdjęcie”. Układ i dopiski zapisują się w tej przeglądarce oraz trafiają do eksportu notatek. <a href="#${e(s.id)}:wyniki">Zobacz tabele wyników tego sezonu →</a></p>
  </section>`;
}
function seasonPage(s) {
  const index=D.seasons.indexOf(s);
  const suggestedPeople=unique(s.articles.flatMap(a=>a.people || [])).slice(0,10);
  const angles=unique(s.articles.flatMap(a=>a.story_angles || [])).slice(0,4);
  const gaps=unique([...s.resultGaps,...s.articleGaps,...s.photoGaps]);
  return `<header class="season-head"><div><span class="eyebrow">KARTA SEZONU / ${e(s.roman)} EDYCJA</span><h1>${e(s.label)}</h1><p class="description">${e(s.workingAngle || 'Kronika wyników i punkt wyjścia do wspomnień. Przejrzyj materiały, potem dopisz, co warto opowiedzieć.')}</p><span class="pill plan">${e(planning[s.id]?.status || 'Zbieramy materiały')}</span></div><div class="season-number" aria-hidden="true">${e(s.roman)}</div></header>
  <nav class="subnav" aria-label="Sekcje sezonu">${[['uklad','Układ stron'],['wyniki','Generalki'],['relacje','Relacje NTN'],['galerie','Edycje i zdjęcia'],['plan','Plan i notatki']].map(([id,t])=>`<a href="#${s.id}:${id}">${t}</a>`).join('')}</nav>
  ${stats([[s.classifications.length,'tabel końcowych'],[s.articles.length,'streszczeń NTN'],[s.galleries.length,'adresów galerii'],[s.events.length,'wydarzeń w archiwum']])}
  ${seasonLayout(s)}
  <section id="wyniki">${sectionTitle('Klasyfikacje końcowe','Top 10 · SL / GS · uczelnie K i M')}<p class="source-note">To wyniki całego sezonu. Rankingi uczelni pozostają oddzielne dla kobiet i mężczyzn. W 2016/17 sklasyfikowano tylko 8 uczelni mężczyzn.</p><div class="category-tabs" role="group" aria-label="Klasyfikacja">${categoryOrder.map(cat=>`<button data-category="${cat}" aria-pressed="${cat===activeCategory}">${categoryLabels[cat]}</button>`).join('')}</div><div class="screen-table" id="active-result">${resultTable(s.classifications.find(c=>c.category===activeCategory))}</div><div class="print-only">${categoryOrder.map(cat=>resultTable(s.classifications.find(c=>c.category===cat),true)).join('')}</div></section>
  <section id="relacje">${sectionTitle('Co działo się w tym sezonie?','Streszczenia redakcyjne + oryginały NTN')}${articleCards(s.articles)}${s.articleIndex.length?`<details class="panel"><summary>Więcej odnalezionych materiałów NTN (${s.articleIndex.length})</summary><ul class="link-list">${s.articleIndex.map(a=>`<li>${link(a.url,a.title)}<small>${e(a.published || a.date || '')} · indeks uzupełniający; nie każdy materiał ma opracowane streszczenie</small></li>`).join('')}</ul></details>`:''}</section>
  <section id="galerie">${sectionTitle('Edycje i zdjęcia','Najpierw kalendarz, potem albumy')}${eventTable(s)}${sectionTitle('Katalog galerii','Link ≠ gotowy wybór zdjęć do druku')}${galleryTable(s)}</section>
  <section id="plan">${sectionTitle('Co chcemy opowiedzieć?','Pomysły do rozmowy, nie gotowy tekst')}
  <div class="two-col"><div class="panel"><h3>Tropy z przeczytanych relacji</h3>${angles.length?list(angles):'<p>Po lekturze zapiszcie najważniejszy konflikt sportowy, przełom albo scenę z tego sezonu.</p>'}${suggestedPeople.length?`<p class="source-note">Nazwiska pojawiające się w materiałach: ${suggestedPeople.map(e).join(', ')}.</p>`:''}<p class="source-note">To propozycje tematów, które wymagają Waszej pamięci i rozmów z uczestnikami.</p>${s.interviewCandidates.length?`<p class="source-note">Z Waszej kolejki rozmów: ${s.interviewCandidates.map(e).join(', ')}. Przypisanie do sezonu do ustalenia.</p>`:''}${s.editorialQuestions.length?`<details><summary>Pytania robocze do rozmów</summary>${list(s.editorialQuestions)}</details>`:''}</div><div class="panel"><h3>Do uzupełnienia w archiwum</h3>${gaps.length?list(gaps.slice(0,5)):'<p>Źródła znalezione. Kolejny etap: korekta, wspomnienia i wybór zdjęć.</p>'}${gaps.length>5?`<details><summary>Pozostałe braki (${gaps.length-5})</summary>${list(gaps.slice(5))}</details>`:''}</div></div>
  <div class="planning"><h3>Notatnik sezonu</h3><p class="source-note">Dopiski zapisują się lokalnie. Eksportuj notatki przed zmianą urządzenia lub przekazaniem ich Antoniemu.</p><div class="fields-grid">${field(s.id,'angle','Roboczy tytuł / główny temat','Co wyróżnia ten sezon?','input')}${field(s.id,'writer','Autor / osoba prowadząca','Ty / Antoni / do ustalenia','input')}${field(s.id,'status','Etap pracy','','select')}${field(s.id,'interviewees','Z kim rozmawiamy?','Nazwiska + co dana osoba może pamiętać.','input')}${field(s.id,'memories','Luźne wspomnienia','Skojarzenia, sceny, anegdoty. Nie trzeba układać ich w tekst.')}${field(s.id,'questions','Pytania do bohaterów','Co było stawką? Co pamiętasz spoza trasy? Kto ma inną wersję tej historii?')}${field(s.id,'draft','Szkic tekstu do albumu','Miejsce na pierwszą wersję — po obejrzeniu źródeł i rozmowach.')}${field(s.id,'photos','Wybór zdjęć i podpisy','Album / nazwa pliku / kto jest na zdjęciu / gdzie i kiedy / autor.')}${field(s.id,'todo','Konkretne zadania','Co / kto / do kiedy. Np. Michał — odzyskać pełną galerię finału.')}</div></div></section>
  <nav class="previous-next" aria-label="Sąsiednie sezony">${index>0?`<a href="#${D.seasons[index-1].id}">← ${e(D.seasons[index-1].label)}</a>`:'<a href="#start">← Przegląd</a>'}${index<D.seasons.length-1?`<a href="#${D.seasons[index+1].id}">${e(D.seasons[index+1].label)} →</a>`:'<a href="#jubileusz">Rozdział jubileuszowy →</a>'}</nav>`;
}
function introPage() {
  return `<span class="eyebrow">OTWARCIE ALBUMU</span><h1 class="route-title">Zanim zaczniemy<br><em>kolejny przejazd.</em></h1><p class="muted">Robocza koncepcja wstępu i rytmu sezonów. Zdjęcia zastępują miejsca do późniejszego wyboru z archiwum Michała Szyplińskiego.</p>
  <div class="intro-draft"><small>PROPOZYCJA OTWARCIA · DO WASZEGO PRZEPISANIA</small>Pierwszy album zatrzymał dziesięć zim. Od tamtej pory na starcie pojawili się kolejni ludzie, a znane stoki dopisały nowe historie. Wracamy do wyników, zdjęć i wspomnień, żeby opowiedzieć, co zostało z nami po ostatnim przejeździe. To album o ściganiu — i o ekipie, która sprawiała, że znów chciało się przyjechać.</div>
  ${sectionTitle('Proponowany początek','Układ do dyskusji')}
  <div class="wireframe"><div class="photo-slot tall">OTWARCIE / ZDJĘCIE NA CAŁĄ STRONĘ<br>Start, meta lub szeroki kadr całej ekipy.<br>Wybór z archiwum — jeszcze nie wybrany.</div><div class="wire-text"><span class="eyebrow">WSTĘP</span><h2>Od pierwszej dekady<br>do kolejnego pokolenia</h2><p>Krótki głos redakcji: po co wracamy do tej historii i kto ją opowiada. Następnie osobiste słowo od organizatorów.</p></div><div class="photo-slot">DETAL + PODPIS<br>Numer startowy, trofeum, archiwalny identyfikator.</div></div>
  ${sectionTitle('Rytm rozdziału sezonowego','Wariant roboczy: 4–6 stron / sezon')}
  <div class="two-col"><div class="panel"><h3>Pierwsza rozkładówka</h3><ol><li>Duże zdjęcie i rok sezonu.</li><li>Krótka kronika oparta na relacjach NTN.</li><li>Jedno wspomnienie bohatera z portretem.</li></ol></div><div class="panel"><h3>Kolejna rozkładówka</h3><ol><li>Top 10 SL/GS K i M oraz rankingi uczelni.</li><li>Selekcja scen sportowych i z życia ekipy.</li><li>Podpisy z miejscem, datą i nazwiskami.</li></ol></div></div>
  <p class="source-note">Objętość i termin wydania nie są ustalone. Ten układ służy do planowania; zakres zdjęć oraz rozkład stron zmienimy po zebraniu materiałów.</p>
  ${sectionTitle('Co bierzemy z pierwszego albumu?','Analiza wzorca: 60 stron PDF')}
  <div class="panel"><p>Wzorzec łączy edytorial, kroniki sezonów, „kartę sławy” z wynikami, fotograficzne rozkładówki, tabelę medalową i osobiste wspomnienia w „Gadających głowach”. Nowy tom zachowuje ten rytm, a historie i rozmówców przypisujemy już przy zbieraniu materiałów do sezonów.</p><p class="source-note">Źródło: album X-lecia AZS Winter Cup, 2013; PDF s. 4, 6, 8–39 i 48–57. Oryginał w plikach użytkownika, nie jest dołączany do publikacji.</p></div>
  <div class="planning"><div class="fields-grid">${field('global','intro','Wasz wstęp / uwagi do otwarcia','Autor wstępu, sceny otwierające, pomysły na fotografie.')}</div></div>`;
}
function interviewsPage() {
  const people=[['Adam Chrapek','Rywalizacja i pamięć sezonów'],['Filip Rzepecki','Wyniki i wspomnienia uczestnika'],['Jakub Ilewicz','Wyniki i wspomnienia uczestnika'],['Ania Berezik','Wyniki i wspomnienia uczestniczki'],['Karolina Klimek','Wyniki i wspomnienia uczestniczki'],['Kasia Ostrowska','Perspektywa uczestniczki'],['Julek Mitan','Perspektywa uczestnika']];
  return `<span class="eyebrow">LUDZIE TWORZĄ HISTORIĘ</span><h1 class="route-title">Z kim siadamy<br>do wspomnień?</h1><p class="muted">Lista wskazana przez Was. Daty rozmów i przypisanie do sezonów pozostają do ustalenia.</p>
  <div class="two-col"><div class="panel"><h3>Redakcja</h3><p><strong>Ty + Antoni Zalewski</strong> — autorzy albumu i redakcja wspomnień.</p><p><strong>Adam Smolik + Kuba Jasiński</strong> — pomoc w odtworzeniu ostatnich sezonów; dokładny podział uzgodnicie.</p></div><div class="panel"><h3>Archiwa i organizacja</h3><p><strong>Michał Szypliński</strong> — dostęp do wszystkich zdjęć potwierdzony przez Was. Do pozyskania indeks plików, nazwy galerii i kadry do składu.</p><p><strong>Organizatorzy AZS</strong> — dostęp do rozmów potwierdzony. Prosimy o pomoc przy korektach chronologii i tabeli medalowej.</p></div></div>
  ${sectionTitle('Pierwsza kolejka rozmów','Kandydaci wskazani przez redakcję')}
  <div class="person-grid">${people.map(([name,role])=>`<article class="person"><p class="role">DO ZAPROSZENIA</p><h3>${name}</h3><p>${role}. Najpierw przypiszmy konkretne sezony i wybierzmy zdjęcia wywołujące wspomnienia.</p><p class="source-note">Źródło listy: ustalenia z redakcją, 05.11.2026.</p></article>`).join('')}</div>
  ${sectionTitle('Krótki scenariusz rozmowy','Pytamy o sceny i szczegóły')}
  <div class="panel"><ol><li>Który sezon i który dzień pamiętasz najmocniej? Co pomaga go datować?</li><li>Co działo się tuż przed albo po przejeździe, czego nie widać w wynikach?</li><li>Kto jeszcze był przy tej historii i może dopowiedzieć szczegóły?</li><li>Które zdjęcie z galerii najlepiej przywołuje tę scenę?</li><li>Jak ta ekipa i ściganie wpłynęły na Twoje dalsze życie?</li></ol></div>
  <div class="planning"><div class="fields-grid">${field('global','teamNotes','Podział pracy i ustalenia z rozmówcami','Kto prowadzi rozmowę / sezony / materiały do pokazania / termin / status. Dane kontaktowe przechowujcie w swoim wspólnym notesie.')}</div></div>`;
}
function anniversaryPage() {
  return `<span class="eyebrow">ROZDZIAŁ JUBILEUSZOWY</span><h1 class="route-title">Co zostaje<br>po tych zimach?</h1><p class="muted">Miejsce na domknięcie 14 sezonów. Tu połączymy pokolenia, a potem przejdziemy do Hall of Fame.</p>
  <div class="wireframe"><div class="photo-slot tall">WSPÓLNY PORTRET / SPOTKANIE POKOLEŃ<br>Do zaplanowania z organizatorami i Michałem.</div><div class="wire-text"><h2>Te same emocje,<br>kolejne twarze.</h2><p>Pomysł redakcyjny: krótkie wypowiedzi dawnych i obecnych zawodników, zestawione ze zdjęciami „wtedy i dziś”.</p><p class="fake-quote">Miejsce na autentyczny cytat po rozmowie.</p><p class="byline">Bez fikcyjnych cytatów i podpisów.</p></div><div class="photo-slot">WTEDY / DZIŚ<br>Ta sama osoba, stok lub drużyna.</div></div>
  <div class="two-col"><div class="panel"><h3>Możliwe wątki</h3><ul><li>Jak zmienił się sportowy poziom ligi i organizacja zawodów?</li><li>Co pozostało z relacji poza trasą?</li><li>Jak nowe pokolenie opowiada własny Winter Cup?</li></ul></div><div class="panel"><h3>Do zebrania</h3><ul class="checklist"><li>Głos organizatorów na jubileusz.</li><li>Wspólna fotografia i podpisane portrety.</li><li>Autentyczne wspomnienia z rozmów.</li><li>Zweryfikowane liczby do podsumowania.</li></ul></div></div>
  <div class="planning"><div class="fields-grid">${field('global','anniversary','Pomysły do rozdziału jubileuszowego','Sceny, osoby, zdjęcia i wspólne motywy.')}</div></div>`;
}
function medalTable(rows,breakdown=false) {
  const medals=v=>`${v?.gold || 0} / ${v?.silver || 0} / ${v?.bronze || 0}`;
  const previousName=name=>{const previous=(D.medalsUpdated?.aliases || []).find(a=>a.canonical_name===name)?.previous_names || [];return previous.length?`<span class="metadata">wcześniej: ${previous.map(e).join(', ')}</span>`:'';};
  return `<div class="table-wrap"><table><thead><tr><th scope="col">M.</th><th scope="col">Osoba</th><th scope="col">Złote</th><th scope="col">Srebrne</th><th scope="col">Brązowe</th><th scope="col">Suma</th>${breakdown?'<th scope="col">Pierwsze 10 sezonów<br>Z / S / B</th><th scope="col">Od 2012/13<br>Z / S / B</th>':''}</tr></thead><tbody>${rows.map(r=>`<tr><td>${e(r.place)}.</td><td>${e(r.name)}${breakdown?previousName(r.name):''}</td><td>${e(r.gold)}</td><td>${e(r.silver)}</td><td>${e(r.bronze)}</td><td>${e(r.total)}</td>${breakdown?`<td>${e(medals(r.baseline))}</td><td>${e(medals(r.added))}</td>`:''}</tr>`).join('')}</tbody></table></div>`;
}
function podiumSources() {
  const races=D.medalPodium?.races || [];
  if(!races.length)return '';
  return `${sectionTitle('Skąd pochodzą dopisane medale?','Podium każdej konkurencji + dokument źródłowy')}
    <p class="source-note">Miejsca i pisownia nazwisk w poniższym rejestrze pochodzą bezpośrednio z PDF-ów. Remisy zachowano. Nie dopisano medali za odwołane konkurencje.</p>
    ${D.seasons.map(s=>{const seasonRaces=races.filter(r=>r.season===s.label);return `<details class="panel podium-season"><summary>${e(s.label)} · ${seasonRaces.filter(r=>r.status!=='cancelled').length} rozegranych konkurencji · ${seasonRaces.reduce((n,r)=>n+r.rows.length,0)} medali</summary><div class="table-wrap"><table><thead><tr><th scope="col">Zawody</th><th scope="col">Konkurencja</th><th scope="col">Podium</th><th scope="col">Źródło</th></tr></thead><tbody>${seasonRaces.map(r=>`<tr><td>${e(r.event_label)}</td><td>${e(categoryLabels[r.category])}</td><td>${r.status==='cancelled'?`Odwołana. ${e((r.notes || []).join(' '))}`:r.rows.map(row=>`${e(row.place)}. ${e(row.name)}`).join('<br>')}</td><td>${link(r.source_url,`PDF, strona ${r.source_page}`)}</td></tr>`).join('')}</tbody></table></div></details>`;}).join('')}`;
}
function hallPage() {
  const winners=D.seasons.flatMap(s=>s.classifications.filter(c=>!c.category.startsWith('TEAM')).map(c=>({season:s.label,category:c.category,row:c.rows[0],source:c.source_url})));
  const updated=D.medalsUpdated;
  const coverage=D.medalPodium?.coverage || {};
  return `<span class="eyebrow">HALL OF FAME / 2002/03–2025/26</span><h1 class="route-title">Ludzie.<br>Medale. Sezony.</h1>
  <div class="notice"><strong>${updated?'Jedna tabela całej historii':'Uzgodnione: jedna tabela całej historii'}</strong>${updated?'Do dorobku z pierwszych 10 sezonów dodano medale eliminacji i finałów SL/GS z sezonów 2012/13–2025/26. W kolumnach obok sumy widać wkład obu okresów.':'Baza pierwszego tomu jest gotowa. Trwa dodawanie medali zawodów z kolejnych sezonów.'} Zwycięstwa w generalkach pozostają oddzielnym zestawieniem.</div>
  ${updated?`${stats([[coverage.downloaded_sources || 0,'PDF-ów wyników'],[coverage.completed_races || 0,'rozegrane konkurencje'],[coverage.podium_rows || 0,'dopisane medale'],[coverage.gaps || 0,'braki źródeł']])}
    ${sectionTitle('Najbardziej utytułowani','Łącznie: 2002/03–2025/26')}
    <p class="source-note">Kolejność według złotych, srebrnych i brązowych medali. Takie same dorobki dają wspólne miejsce. Tabela obejmuje eliminacje i finały SL/GS; nie wlicza jubileuszowych pucharów, slalomu równoległego ani team event. Liczby wymagają korekty redakcyjnej przed drukiem.</p>
    ${(updated.unresolved_identities || []).length?`<div class="notice"><strong>Nazwiska do wyjaśnienia z redakcją</strong>${updated.unresolved_identities.map(g=>`${g.names.map(e).join(' / ')} — na razie osobne rekordy; nie potwierdzono, czy dotyczą tej samej osoby.`).join('<br>')}</div>`:''}
    ${updated.tables.map(t=>`<h3 class="table-heading">${t.gender==='K'?'Kobiety':'Mężczyźni'} · top 10 całej historii</h3>${medalTable(t.rows.filter(r=>r.place<=10),true)}<details class="panel"><summary>Pełna tabela · ${t.rows.length} osób</summary>${medalTable(t.rows,true)}</details>`).join('')}
    ${(updated.aliases || []).length?`<details class="panel"><summary>Potwierdzone warianty imion i nazwisk (${updated.aliases.length})</summary><ul class="link-list">${updated.aliases.map(a=>`<li><strong>${e(a.canonical_name)}</strong><small>${a.variants.map(e).join(' / ')}. ${e(a.evidence)}</small>${a.source_urls.map((u,i)=>link(u,`Źródło ${i+1}`)).join(' · ')}</li>`).join('')}</ul></details>`:''}`:''}
  <details class="panel"><summary>Historyczna baza z pierwszego tomu · 2002/03–2011/12</summary><p class="source-note">Źródło: album X-lecia, PDF s. 38–39. Zachowano miejsca i pisownię tabeli. W 2004/05 i 2005/06 liczy się wynik dwuboju slalomowego; w pozostałych sezonach osobno GS i SL.</p>${D.medals.tables.map(t=>`<h3 class="table-heading">${t.gender==='K'?'Kobiety':'Mężczyźni'}</h3>${medalTable(t.rows)}`).join('')}</details>
  ${updated?podiumSources():''}
  ${sectionTitle('Triumfatorzy nowych sezonów','SL / GS · K i M · klasyfikacje końcowe')}
  <p class="source-note">Lista z odczytanych generalek sezonów 2012/13–2025/26. Nie doliczamy tych zwycięstw do medali pojedynczych zawodów. Nazwiska zachowano w kolejności zapisu oficjalnych PDF-ów.</p>
  <div class="table-wrap"><table><thead><tr><th scope="col">Sezon</th><th scope="col">Klasyfikacja</th><th scope="col">Zwycięzca</th><th scope="col">Źródło</th></tr></thead><tbody>${winners.map(w=>`<tr><td><a href="#s${w.season.replace('/','-')}">${e(w.season)}</a></td><td>${e(categoryLabels[w.category])}</td><td>${e(w.row?.name)}</td><td>${link(w.source,'PDF')}</td></tr>`).join('')}</tbody></table></div>
  ${sectionTitle('Przed zamknięciem albumu','Korekta dorobku i portrety bohaterów')}
  <div class="panel"><p>Sprawdźmy z organizatorami warianty pisowni i ewentualne zmiany nazwisk. Zmian nazwiska nie łączymy automatycznie bez potwierdzenia. Wyjątki historyczne z pierwszego tomu są zachowane; dodatkowe puchary jubileuszowe, równoległe i drużynowe pozostają poza tą tabelą.</p></div>
  <div class="planning"><div class="fields-grid">${field('global','hallRules','Szczegóły zasad tabeli medalowej','Uzgodnione: medale zawodów SL/GS + osobno zwycięstwa sezonów. Doprecyzować finały, jubileuszowe, remisy i ewentualne wyjątki.')}${field('global','hallNotes','Osoby, portrety i tropy do Hall of Fame','Kto powinien dostać osobny portret? Jakie zdjęcie i cytat?')}</div></div>`;
}
function route() {
  const [id='start',section]=location.hash.slice(1).split(':');
  const s=D.seasons.find(x=>x.id===id);
  const pages={start:overview,wstep:introPage,rozmowy:interviewsPage,jubileusz:anniversaryPage,hall:hallPage};
  main.innerHTML=s?seasonPage(s):(pages[id] || overview)();
  document.title=`${s?s.label:({wstep:'Wstęp',rozmowy:'Rozmowy',jubileusz:'Jubileusz',hall:'Hall of Fame'}[id] || 'Warsztat albumu')} · AZS Winter Cup 25`;
  renderNav();
  if(section && ['uklad','wyniki','relacje','galerie','plan'].includes(section)) requestAnimationFrame(()=>document.getElementById(section)?.scrollIntoView());
  else window.scrollTo({top:0});
}
function download(filename, data) {
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});
  const u=URL.createObjectURL(blob),a=document.createElement('a'); a.href=u; a.download=filename; a.click(); setTimeout(()=>URL.revokeObjectURL(u),1000);
}
function save() {
  try {localStorage.setItem(storageKey,JSON.stringify(planning)); storageOk=true; document.querySelector('#save-status').textContent='Zapisano w tej przeglądarce. Eksportuj notatki, aby przekazać je zespołowi.';}
  catch {storageOk=false;document.querySelector('#save-status').textContent='Przeglądarka nie pozwala na trwały zapis. Użyj eksportu, zanim zamkniesz stronę.';}
}
document.querySelector('#season-search').addEventListener('input',renderNav);
document.querySelector('.skip').addEventListener('click',ev=>{ev.preventDefault();main.focus();});
document.querySelector('#import-trigger').addEventListener('click',()=>document.querySelector('#import').click());
main.addEventListener('click',ev=>{
  const layoutButton=ev.target.closest('[data-layout]');
  if(layoutButton){
    const s=D.seasons.find(s=>s.id===location.hash.slice(1).split(':')[0]);
    const selected=layoutButton.dataset.layout;
    if(!s || !Object.hasOwn(layoutTemplates,selected))return;
    if(!planning[s.id])planning[s.id]={};
    planning[s.id].layoutTemplate=selected;save();
    document.querySelector('#uklad').outerHTML=seasonLayout(s);
    document.querySelector(`[data-layout="${selected}"]`).focus({preventScroll:true});
  }
  const button=ev.target.closest('[data-category]');
  if(button){activeCategory=button.dataset.category;const s=D.seasons.find(s=>s.id===location.hash.slice(1).split(':')[0]);if(!s)return;document.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===activeCategory)));document.querySelector('#active-result').innerHTML=resultTable(s.classifications.find(c=>c.category===activeCategory));}
  if(ev.target.closest('#download-research')) download('azs-wintercup-materialy-2026-11-05.json',D);
});
main.addEventListener('input',ev=>{const t=ev.target;if(!t.dataset.field)return;const {scope,field:key}=t.dataset;if(!allowedFields.includes(key))return;if(!planning[scope])planning[scope]={};planning[scope][key]=t.value;save();if(Object.hasOwn(layoutFields,key)){const s=D.seasons.find(s=>s.id===scope);if(s)document.querySelector('#layout-completion').textContent=layoutCompletion(s);}});
document.querySelector('#export').addEventListener('click',()=>download(`azs-wintercup-notatki-${new Date().toISOString().slice(0,10)}.json`,{format:'azs-wintercup-planning',version:1,exported_at:new Date().toISOString(),planning}));
document.querySelector('#import').addEventListener('change',async ev=>{
  const file=ev.target.files[0];if(!file)return;
  try{
    if(file.size>5_000_000)throw new Error('Plik jest za duży (limit 5 MB).');
    const imported=JSON.parse(await file.text());
    if(imported.format!=='azs-wintercup-planning' || imported.version!==1 || !imported.planning || typeof imported.planning!=='object' || Array.isArray(imported.planning))throw new Error('To nie jest eksport notatek tego albumu.');
    const cleaned=cleanPlanning(imported.planning);
    const existing=Object.keys(planning).some(scope=>Object.keys(planning[scope]).length);
    if(existing)download('azs-wintercup-notatki-przed-importem.json',{format:'azs-wintercup-planning',version:1,exported_at:new Date().toISOString(),planning});
    for(const [scope,fields] of Object.entries(cleaned))planning[scope]={...(planning[scope]||{}),...fields};
    save();route();document.querySelector('#save-status').textContent=`Wczytano notatki. ${existing?'Pobrano kopię dotychczasowych dopisków. ':''}${storageOk?'Zapisano lokalnie.':'Zapis lokalny niedostępny — wykonaj eksport.'}`;
  }catch(err){document.querySelector('#save-status').textContent=`Import nie powiódł się: ${err.message}`;}
  ev.target.value='';
});
document.querySelector('#print').addEventListener('click',()=>window.print());
window.addEventListener('hashchange',route);
if(!storageOk)document.querySelector('#save-status').textContent='Zapis lokalny jest niedostępny. Eksportuj notatki przed zamknięciem strony.';
route();
