# Zaktualizowana tabela medalowa AZS Winter Cup

Stan: 5 listopada 2026. Zakres: 2002/03–2025/26, czyli 24 rozegrane sezony. Jubileusz stanowi osobny rozdział albumu.

## Wynik pracy

Jedna zaktualizowana tabela historyczna z osobnymi kategoriami kobiet i mężczyzn: baza pierwszych 10 sezonów z albumu X-lecia + medale 14 kolejnych sezonów. Tabela zawiera 104 kobiet i 103 mężczyzn, łącznie 1530 medali. Każdy rekord pokazuje wynik łączny oraz osobno bazę i przyrost.

## Reguły liczenia

1. Nowy okres: liczymy miejsca 1–3 oddzielnie w SL i GS kobiet oraz mężczyzn, we wszystkich zwykłych eliminacjach i finałach. Nie dodajemy do medali zawodów miejsc w generalce sezonu.
2. Wykluczamy Puchar X-lecia, Puchar XV-lecia, Puchar „18”, OCZKO, slalom równoległy i team event. Pełna lista 84 imprez uwzględnionych i 14 wykluczonych znajduje się w medals-podium.json wraz z URL-ami.
3. Remisy liczymy zgodnie z oficjalnym miejscem: dwóch drugich daje dwa srebra i brak brązu, dwóch trzecich daje dwa brązy. Kolejność tabeli: złoto, srebro, brąz. Identyczny dorobek oznacza wspólne miejsce.
4. Baza X-lecia zachowuje oryginalną metodę: w 2004/05 i 2005/06 medal za dwubój slalomowy, w pozostałych sezonach za SL oraz GS oddzielnie. Nie przeliczamy historycznej bazy na inną metodę.
5. Zwycięstwa sezonów są odrębną miarą. W danych są 56 rozstrzygnięć SL/GS z nowych 14 sezonów; tytuły pierwszych 10 sezonów nie zostały w tej aktualizacji odtworzone i nie wolno przedstawiać tej kolumny jako pełnego dorobku historycznego.

## Pokrycie źródeł

Pobrano i odczytano wszystkie 168 PDF-ów wyników dla 84 imprez. Pliki mają 168 różnych sum SHA-256. Odczytano 336 sekcji, z czego dwa giganty 27.01.2023 (K/M) zostały oficjalnie odwołane z powodu mgły. Pozostają 334 odbyte konkurencje i 1004 wpisy medalowe. Brak brakujących podiów. Sumy nowego okresu: K 167 złotych, 167 srebrnych, 167 brązowych; M 168 złotych, 168 srebrnych, 167 brązowych.

| Sezon | Imprezy | Sekcje GS/SL K/M | Wpisy medalowe |
| --- | ---: | ---: | ---: |
| 2012/13 | 7 | 28 | 84 |
| 2013/14 | 6 | 24 | 72 |
| 2014/15 | 6 | 24 | 72 |
| 2015/16 | 6 | 24 | 72 |
| 2016/17 | 5 | 20 | 60 |
| 2017/18 | 6 | 24 | 73 |
| 2018/19 | 6 | 24 | 73 |
| 2019/20 | 6 | 24 | 72 |
| 2020/21 | 6 | 24 | 72 |
| 2021/22 | 6 | 24 | 72 |
| 2022/23 | 6 | 24 | 66 |
| 2023/24 | 6 | 24 | 72 |
| 2024/25 | 6 | 24 | 72 |
| 2025/26 | 6 | 24 | 72 |

## Nietypowe przypadki sprawdzone w źródle

| Data | Konkurencja | Odczyt |
| --- | --- | --- |
| 19.02.2016 | SL M | Antoni Szczepanik i Sebastian Białobrzycki ex aequo drudzy — dwa srebra. |
| 12.01.2018 | SL M | Antoni Szczepanik i Szymon Mitan ex aequo pierwsi — dwa złota. |
| 09.02.2018 | GS M | Przemysław Gałuszka i Łukasz Jarmuszczak ex aequo trzeci — dwa brązy. |
| 15.02.2019 | SL M | Piotr Krawczyk i Adam Chrapek ex aequo trzeci — dwa brązy. |
| 28.02.2025 | GS M | Mateusz Bucki i Jakub Toporowski ex aequo drudzy — dwa srebra. |

Ponadto potwierdzono źródłowo: brak kolumny M w tabeli SL M 26.01.2018 (kolejność wynika z wierszy, czasów i punktów 150/130/110); przełamanie wiersza Wojciecha Dulczewskiego w SL M 23.02.2024; odwołane giganty 27.01.2023. Finał 2018/19 ma SL 22.02 i GS 24.02 w jednym PDF-ie K/M; każdą konkurencję policzono raz. Wszystkie podium mają unikalną parę event_id/category.

## Łączenie nazw

Automatycznie złączono tylko identyczne tokeny pełnego imienia i nazwiska po normalizacji Unicode, wielkości liter i kolejności tokenów (np. Karolina Klimek = Klimek Karolina). Oryginalne warianty zachowano w source_names. Nazwisk nie łączono przez podobieństwo, samą uczelnię lub sam fakt zmiany roku.

Udokumentowane aliasy:

- Przemek / Przemysław Gałuszka: [NTN, Przedświąteczne otwarcie sezonu](https://www.ntn.pl/azs-wc-przedswiateczne-otwarcie-sezonu/). Relacja używa obu imion wobec tego samego zwycięzcy SL z AWF Katowice.
- Ania / Anna Skarbek-Malczewska: [NTN, Warto było poczekać](https://www.ntn.pl/azs-wc-warto-bylo-poczekac/) i [NTN, Coś z niczego](https://www.ntn.pl/azs-wc-cos-z-niczego/) oraz PDF-y wskazane w medals-aliases.json.
- Dorota Kaczmarek / Dorota Sierpińska: potwierdzenie użytkownika z 5 listopada 2026, że to ta sama osoba po zmianie nazwiska po ślubie; aktualna nazwa w tabeli: Dorota Sierpińska. Dowód redakcyjny source_type=user_confirmation zapisano w medals-aliases.json.

Dorota Siedlecka pozostaje osobnym rekordem. Potwierdzenie użytkownika dotyczy wyłącznie pary Kaczmarek/Sierpińska i nie daje podstaw do łączenia Siedleckiej z tą parą.

## Weryfikacja

Sprawdzono sumy każdego rekordu (złoto+srebro+brąz), zgodność wynik łączny=baza+przyrost, zgodność każdego przyrostu z liczbą unikalnych race_id oraz 56 odrębnych tytułów sezonu. Niezależny agent przeliczył wszystkie 207 rekordów, sprawdził 76 konkurencji z sezonów 2012/13, 2018/19 i 2025/26 (229 wpisów podium) oraz wizualnie wszystkie remisy i nietypowe przypadki; bez rozbieżności. Szczegóły: medals-audit.md.

Niezależny benchmark z [oficjalnej relacji AZS Warszawa „Powrót do akademickich czasów”](https://azs.waw.pl/powrot-do-akademickich-czasow/) zgadza się dokładnie: Karolina Klimek 89 medali, w tym 42 złote; Adam Chrapek 18 medali; Michał Szypliński 11 medali.

## Pliki i reprodukcja

| Plik | Znaczenie |
| --- | --- |
| medals-updated.json | Tabela łączna K/M, baza/przyrost, dorobek i powiązania z podiami. |
| medals-podium.json | Każde podium, źródłowe wiersze PDF, URL, SHA-256, strona, lista imprez i wykluczeń. |
| medals-aliases.json | Udokumentowane aliasy oraz rekordy zachowane osobno. |
| medals-baseline.json | Odczyt historycznej bazy X-lecia ze stron PDF 38–39. |
| medals-audit.md | Niezależna kontrola danych i źródeł. |

Reprodukcja wymaga Python 3, curl, Popplera (pdftotext) i rtk. W katalogu projektu kolejno uruchom: `rtk proxy python3 research/update-medals.py fetch`, `rtk proxy python3 research/update-medals.py parse`, `rtk proxy python3 research/update-medals.py aggregate`. Pobrane PDF-y pozostają w /tmp/wintercup-medals, a trwały JSON przechowuje ich adresy i sumy kontrolne. Przed drukiem pozostała redakcyjna korekta pisowni i zachowanie rozdzielonych rekordów, których tożsamości nie potwierdzono.
