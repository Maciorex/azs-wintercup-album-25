# Katalog zdjęć AZS Winter Cup

Stan: 5 listopada 2026. Zakres po decyzji redaktora: 2012/13–2025/26 (14 sezonów), z osobnym rozdziałem jubileuszowym.

## Wynik pierwszego przeglądu

- 97 wpisów katalogowych: 42 współczesne galerie SkiFoto, 49 albumów Facebook i 6 starych adresów SkiFoto z sezonu 2012/13.
- 32 galerie SkiFoto odczytane HTTP 200; 10 prób zakończyło się timeoutem. Timeout nie jest dowodem usunięcia galerii.
- 48 odnośników Facebook zaobserwowano w pełnym HTML relacji NTN; treści albumów nie odczytano. Jeden dodatkowy album ma konflikt przypisania do trzech zawodów.
- 92 wpisy połączono z datami oficjalnego indeksu wyników. W tabeli edycji znajduje się komplet 98 pozycji z oficjalnego archiwum (łącznie z imprezami specjalnymi).
- Dla każdej oficjalnej edycji pole gallery_urls wskazuje znalezione albumy; pusta lista jest jawną luką. Liczba galerii i liczba zawodów nie są tożsame.

## Jak powstał katalog

Źródła: [SkiFoto — zdjęcia z zawodów](https://www.skifoto.pl/zdjecia-z-zawodow/), pełne treści relacji [NTN — AZS Winter Cup](https://www.ntn.pl/tag/azs-winter-cup/), [oficjalne archiwum wyników](https://wintercup.pl/wyniki/). Treści NTN udostępnia publiczny WordPress REST API; zachowano link do artykułu przy każdym odnośniku. URL-e Facebook oczyszczono z parametrów śledzących, pozostawiając zaobserwowany identyfikator albumu.

Galerie z dawnej ścieżki /lens_galleries/ mają współczesne odpowiedniki w katalogu /gallery/. Stare query URL-e 2013/14 dołączono jako alternate_urls do współczesnych galerii, bez podwójnego liczenia. Adresy id=21,22,23,24,25,30 z 2012/13 pozostały jako historyczne odnośniki; próbka id=21 zwraca HTTP 404.

## Ważne rozbieżności

- W sezonie 2020/21 I eliminacje (Harenda), II (GrapaSki) i III (Krynica-Zdrój) odsyłają w NTN do tego samego albumu a.10157366326370286. Wpis ma status konflikt_linkow i nie został przypisany żadnej konkretnej edycji.
- W relacjach 2023/24 pojedyncza litera C kilkakrotnie odsyła do albumu drugiej części inauguracji. Odrzucono te linki jako potwierdzenie zdjęć z późniejszych zawodów i zachowano w rejected_links.
- W sezonach 2013/14 i 2014/15 SkiFoto zachowuje numery pierwotnego kalendarza, a oficjalny indeks numery faktycznie rozegranych zawodów. W 2013/14 galeria #3 to II rozegrane eliminacje, #4 to III, #5 to IV, #6 to V; połączenie wynika z zgodnych miejsc i relacji, a oryginalny numer pozostaje zapisany.
- Finał 2018/19 rozegrano na raty: SL 22 lutego i GS 24 lutego. III eliminacje miały miejsce 25 stycznia, po korekcie literówki indeksu na podstawie nagłówka oficjalnego PDF (agent wyników).

## Do pozyskania od zespołu

Użytkownik potwierdził dostęp do wszystkich zdjęć Michała Szyplińskiego oraz organizatorów AZS. Priorytetem jest indeks prywatnego archiwum, a nie dalsze zgadywanie publicznych URL-i.

1. Michał Szypliński / SkiFoto: zestaw folderów 2012/13–2025/26 według dat i miejsc oraz wybrane pliki wysokiej rozdzielczości; wyjaśnienie konfliktów FB i braków 2012/13 IV/V.
2. Administrator profilu AZS Winter Cup: eksport listy albumów z adresami i datami, zwłaszcza pięć eliminacji 2025/26 oraz dodatkowe imprezy jubileuszowe, równoległe i Team Eventy.
3. Organizatorzy AZS: potwierdzenie numeracji przełożonych i odwołanych edycji oraz komplet albumów wydarzeń specjalnych (Puchar X-lecia, XV-lecia, 18, OCZKO).
4. Redakcja albumu: po selekcji nadać każdemu kadrowi identyfikator, zapisać osoby na zdjęciu, autora i proponowany podpis.

## Pokrycie sezonów

| Sezon | Wpisy galerii | Oficjalne wydarzenia | Wydarzenia z dopasowaną galerią |
|---|---:|---:|---:|
| 2012/13 | 6 | 8 | 6 |
| 2013/14 | 7 | 6 | 6 |
| 2014/15 | 7 | 6 | 6 |
| 2015/16 | 7 | 6 | 6 |
| 2016/17 | 6 | 5 | 5 |
| 2017/18 | 7 | 7 | 7 |
| 2018/19 | 8 | 7 | 7 |
| 2019/20 | 7 | 7 | 7 |
| 2020/21 | 6 | 8 | 5 |
| 2021/22 | 7 | 9 | 7 |
| 2022/23 | 5 | 7 | 5 |
| 2023/24 | 16 | 7 | 6 |
| 2024/25 | 6 | 8 | 6 |
| 2025/26 | 2 | 7 | 2 |

## Ograniczenia

Statusy opisują odczyt źródła w tym przeglądzie. Publiczny link nie oznacza pełnego przeglądu zawartości albumu ani gotowej selekcji do druku. Dat publikacji relacji nie używano jako dat zawodów. Dla osobnych dekoracji i imprezy o Audi pozostały luki dat.

Następne kroki: przekazać fotografowi i AZS listę brakujących edycji, a następnie zacząć wybór zdjęć sezon po sezonie.
