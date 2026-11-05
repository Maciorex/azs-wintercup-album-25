# AZS Winter Cup — warsztat albumu 25-lecia

Gotowy punkt startowy: **[index.html](index.html)**. Jeden samowystarczalny plik HTML, bez instalowania bibliotek i bez połączenia z internetem do przeglądania bazy. Oryginały artykułów i galerie otwierają się w internecie.

Strona: **https://maciorex.github.io/azs-wintercup-album-25/**  
Repozytorium: **https://github.com/Maciorex/azs-wintercup-album-25**

## Ustalenia redakcyjne z 5 listopada 2026

- Zakres: **2012/13–2025/26**, czyli 14 sezonów po pierwszym tomie, oraz rozdział jubileuszowy. Nie dopisujemy przyszłego sezonu 2026/27.
- Charakter: sportowa kronika i wyniki oraz barwne wspomnienia uczestników. Objętość i termin druku ustalimy później.
- Autorzy: Maciej (użytkownik) i Antoni Zalewski. Adam Smolik i Kuba Jasiński pomogą przy najnowszych sezonach; dokładny podział nieustalony.
- Archiwa: użytkownik potwierdził dostęp do wszystkich zdjęć Michała Szyplińskiego i do organizatorów AZS. Nie kontaktowano nikogo w imieniu redakcji.
- Hall of Fame: jedna tabela medalowa całej historii — baza pierwszych 10 sezonów plus medale eliminacji i finałów SL/GS z 2012/13–2025/26. **Oddzielnie** pozostają zwycięstwa sezonów.

## Co jest gotowe

Na każdej karcie sezonu: cztery indywidualne top 10 (GS/SL K/M), osobne rankingi uczelni K/M, streszczenia i linki NTN, kalendarz edycji z wynikami, galerie z przypisaniem i statusami, tropy do rozmów oraz edytowalny notatnik. Do tego koncepcja wstępu, miejsca na zdjęcia, rozdział jubileuszowy i Hall of Fame.

Widok sezonu ma trzy niezależne zakładki: **Układ**, **Treść i notatki** oraz **Archiwum i wiedza**. Na ekranie jest tylko aktywna zawartość. Makiety są w pierwszej zakładce, plan i notatnik w drugiej, a generalki, relacje NTN i galerie w trzeciej. Wpisy zachowują się przy przełączaniu, a adres wskazuje wybraną zakładkę. Przyciski Wstecz/Dalej przeglądarki działają; zakładki obsługują również strzałki klawiatury oraz Home/End. Przejście do sąsiedniego sezonu zachowuje rodzaj zakładki. Stare odnośniki `:plan`, `:wyniki`, `:relacje` i `:galerie` otwierają odpowiadające im nowe widoki. Drukowana jest aktywna zakładka.

Sekcja **Układ stron** przy każdym sezonie zawiera edytowalną makietę: wariant dwustronicowej rozkładówki albo czterostronicowego rozdziału. Pola na tytuł, trzy zdjęcia z podpisami, kronikę, wspomnienie i ranking można wypełniać własnymi ustaleniami. Wszystkie sześć klasyfikacji ma stałe miejsce. Zmiana wariantu przestawia pola i zachowuje ich zawartość. Ustalenia są osobne dla każdego sezonu i wchodzą do istniejącego eksportu/importu notatek.

Zakładka **Do przepytania** zbiera osoby z pola **Z kim rozmawiamy?** we wszystkich sezonach. Wpisuj jedną osobę w wierszu lub oddzielaj nazwiska przecinkami/średnikami; kontekst po myślniku albo w nawiasie pozostaje w planie. Ta sama osoba z kilku sezonów ma jedną kartę wywiadu z linkami do tych sezonów. Karty zawierają status, prowadzącego, termin, tematy, pytania, odpowiedzi/notatki, cytaty i dalsze kroki. Można je otworzyć bezpośrednio z planu sezonu. Otwarta karta i jej pytania pozostają zachowane również po usunięciu osoby z planu danego sezonu. Początkowa siódemka rozmówców także ma klikalne karty.

Karty wywiadów są częścią lokalnego zapisu oraz eksportu/importu notatek. Dotychczasowe eksporty i plany sezonów pozostają obsługiwane. Sam link do nowo dodanej osoby nie przesyła jej pytań do innej przeglądarki — do przekazania całej karty służy eksport notatek.

1. **84 tabele / 838 rekordów** z 28 oficjalnych PDF-ów klasyfikacji końcowych. W 2016/17 sklasyfikowano tylko osiem uczelni mężczyzn; tabela nie jest uzupełniana fikcyjnymi pozycjami.
2. **39 streszczeń** z 14 sezonów. Autorstwo Michała Szyplińskiego potwierdzono w metadanych HTML wszystkich opracowanych wpisów. Każdy sezon ma relację finałową; 2024/25 i 2025/26 także każdą eliminację i równoległe. W dwóch materiałach wideo streszczono opis wpisu, nie obejrzano filmu.
3. **197 linków NTN łącznie**, w tym powyższe 39. Pozostałe 158 to indeks do dalszej lektury; autorstwo nie jest automatycznie przypisane.
4. **97 adresów galerii**: 42 SkiFoto, 49 Facebook i sześć historycznych SkiFoto. Facebook jest wskazany odnośnikami z relacji; zawartość albumów nie została odczytana. 32 SkiFoto zwróciły HTTP 200, 10 prób odczytu skończyło się timeoutem.
5. **98 wydarzeń** w kalendarzu, **119 osób** w historycznej tabeli medalowej 2002/03–2011/12 i **56 zwycięskich pozycji** w generalkach 2012/13–2025/26. To trzy różne zbiory; nie sumujemy ich jako jednego dorobku.

Hall of Fame łączy historyczną bazę z **1004 medalami** z 334 rozegranych konkurencji nowych sezonów, na podstawie 168 oficjalnych PDF-ów wyników 84 zwykłych imprez. Dwie konkurencje gigantowe 27.01.2023 zostały odwołane i nie dostały medali. Uwzględniono remisy. Wyłączono puchary jubileuszowe, slalom równoległy i team event. Kolumny pokazują osobno wkład pierwszego tomu i dalszych sezonów. Niepotwierdzone zmiany nazwisk pozostają osobnymi rekordami z jawną adnotacją. Rejestr podium z linkami do konkretnych PDF-ów jest widoczny w Hall of Fame; pełna metoda w `research/medals-notes.md`.

## Jak dopisywać notatki

1. Otwórz `index.html` w przeglądarce i wybierz sezon.
2. W zakładce **Układ** wybierz 2 lub 4 strony i wpisuj zawartość okienek; tekst i uwagi dopisuj w **Treść i notatki**. Dopiski zapisują się **tylko w lokalnej pamięci tej przeglądarki**. Same pliki projektu nie są zmieniane.
3. Użyj **Eksport notatek**, żeby przekazać dopiski Antoniemu lub zachować kopię. **Import notatek** scala dane; pola obecne w imporcie zastępują odpowiadające pola lokalne. Przed importem do istniejących notatek strona pobiera kopię starego stanu.
4. Baza materiałów jest osobnym eksportem JSON na stronie głównej. Publiczny hosting nie daje wspólnej edycji w czasie rzeczywistym.

Przy zmianie przeglądarki, nazwy lub lokalizacji pliku oraz przejściu z pliku do hostingu pamięć lokalna może być oddzielna — najpierw wykonaj eksport. Notatki nie są wysyłane do serwera.

## Struktura projektu

- `index.html` — gotowy, samowystarczalny warsztat; można wysłać go jako plik.
- `site/` — źródła HTML, CSS i JavaScript; `tools/build.py` łączy je z materiałami.
- `research/results.json`, `result-events.json` — generalki oraz kalendarz i PDF-y edycji.
- `research/articles.json`, `articles-index.json`, `photos.json` — streszczenia, indeks NTN i galerie.
- `research/medals-baseline.json`, `medals-updated.json`, `medals-podium.json` oraz pliki `*-notes.md` — historyczna i łączna tabela Hall of Fame, rejestr podium, metoda kwerendy i rozbieżności.

Po zmianie danych lub wyglądu:

```sh
rtk proxy python3 tools/build.py
rtk proxy node --check site/app.js
```

## GitHub Pages

Redakcja wyraziła zgodę na publiczne repozytorium i publiczną stronę GitHub Pages. Publikowany jest sam warsztat i zebrana baza; lokalne dopiski użytkowników nie trafiają do repozytorium.

1. Hosting korzysta z `index.html` i `.nojekyll` w katalogu głównym gałęzi `main`.
2. Po zmianie źródeł lub danych uruchomić `rtk proxy python3 tools/build.py`, sprawdzić wynik i wysłać zmiany. Pages aktualizuje stronę po pushu.
3. Notatki są wymieniane eksportem/importem. HTML nie ma wspólnej edycji w czasie rzeczywistym.

## Następny etap redakcyjny

Przegląd sezonów i luźne notatki, następnie rozmowy z: Adamem Chrapkiem, Filipem Rzepeckim, Jakubem Ilewiczem, Anią Berezik, Karoliną Klimek, Kasią Ostrowską i Julkiem Mitanem. Użytkownik wskazał tę kolejkę; terminy i prowadzący nie są ustalone.

Priorytet archiwalny: indeks prywatnych zdjęć Michała/AZS, brakujące galerie IV/V eliminacji 2012/13 i pięciu eliminacji 2025/26 oraz konflikty linków FB. Dalej: druga korekta wyników i identyfikacja zmian nazwisk w Hall of Fame. Nie traktować nieodczytanych albumów ani indeksu artykułów jako opracowanych materiałów.

**Następne kroki:** przegląd kart, planowanie stron i dopisywanie wspomnień; uzupełnienie luk oraz korekta nazwisk.
