# Niezależna kontrola aktualizacji tabeli medalowej

Stan kontroli: 5 listopada 2026. Sprawdzono `medals-baseline.json`, `result-events.json`, `medals-podium.json`, `medals-updated.json` oraz pobrane oficjalne PDF-y w `/tmp/wintercup-medals/`.

## Wynik

Nie znaleziono rozbieżności w kontrolowanej agregacji. Końcowa tabela po potwierdzeniu zmiany nazwiska Doroty Kaczmarek/Sierpińskiej zawiera 207 rekordów osób (104 K i 103 M), łącznie 1530 medali: 526 z bazy pierwszych 10 sezonów oraz 1004 z kolejnych 14 sezonów. Podium zawodów i zwycięstwa klasyfikacji sezonowych są liczone oddzielnie.

Potwierdzenie dotyczy zgodności z zachowaną bazą historyczną i z wybranym zakresem oficjalnych wyników. Nie rozstrzyga nieudokumentowanych zmian nazwisk. Nie jest pełną korektą wydawniczą każdej strony źródłowej.

## Kontrola zakresu i kompletności

1. W indeksie było 98 wydarzeń z sezonów 2012/13–2025/26. Do medalowej agregacji włączono 84 zwykłe imprezy: eliminacje i finały. Wyłączono 14 wydarzeń jubileuszowych, równoległych oraz team event. Pozycje opisane samą datą w sezonach 2023/24 i 2024/25 rozpoznano również po tytułach i URL-ach wyników; nie trafiły do SL/GS.
2. Pobrano 168 PDF-ów K/M dla 84 imprez. Wszystkie 168 ma odrębny SHA-256; nie stwierdzono powtórzonych plików. Dane zawierają 336 sekcji konkurencji, z czego 334 odbyły się, a dwie oficjalnie odwołano.
3. Nie ma powtórzonych identyfikatorów konkurencji ani par `event_id/category`. Wielodniowy finał 2018/19 tworzy jedną imprezę z osobnymi SL i GS; żadnej konkurencji nie policzono dwukrotnie.
4. Źródłem dopisanych medali są miejsca w poszczególnych zawodach, nie miejsca w klasyfikacjach generalnych. Zwycięstwa sezonowe w nowych 14 sezonach są odrębną miarą i nie powiększają medali zawodów. Tytułów pierwszych 10 sezonów nie odtwarzano w tej kontroli.

## Kontrola odczytu źródeł

Niezależnym odczytem tekstów źródłowych porównano wszystkie 76 konkurencji sezonów 2012/13, 2018/19 i 2025/26: 229 wpisów podium, bez różnic w miejscu, numerze startowym, nazwisku ani uczelni.

Na renderach dziewięciu stron PDF osobno sprawdzono pięć remisów podium, obie odwołane konkurencje GS z 27.01.2023, tabelę bez kolumny miejsca i wiersz łamany podczas ekstrakcji. Wszystkie te odczyty zgadzają się z `medals-podium.json`.

| Data i konkurencja | Potwierdzenie w oficjalnym PDF |
| --- | --- |
| 19.02.2016, SL M | Mateusz Habrat pierwszy; Antoni Szczepanik i Sebastian Białobrzycki ex aequo drudzy (28.66); brak brązu. [PDF](https://wintercup.pl/wp-content/uploads/2016/02/2016_02_19_Harenda_wyniki_m.pdf), s. 2. |
| 12.01.2018, SL M | Antoni Szczepanik i Szymon Mitan ex aequo pierwsi (0:41.01); Paweł Jaksina trzeci; brak srebra. [PDF](https://wintercup.pl/wp-content/uploads/2018/01/180112_kluszkowce_wyniki_m.pdf), s. 2. |
| 26.01.2018, SL M | Brak całej kolumny miejsca. Kolejność wierszy, sumy czasów i punkty 150/130/110 potwierdzają podium: Przemek Gałuszka, Tomasz Pająk, Kamil Krawczyk. [PDF](https://wintercup.pl/wp-content/uploads/2018/01/180126_zawoja_wyniki_m.pdf), s. 2. |
| 9.02.2018, GS M | Szymon Mitan pierwszy, Antoni Szczepanik drugi; Przemek Gałuszka i Łukasz Jarmuszczak ex aequo trzeci (1:23.38). [PDF](https://wintercup.pl/wp-content/uploads/2018/02/180209_kluszkowce_wyniki_m.pdf), s. 1. |
| 15.02.2019, SL M | Antoni Szczepanik pierwszy, Przemek Gałuszka drugi; Piotr Krawczyk i Adam Chrapek ex aequo trzeci (1:16.52). [PDF](https://wintercup.pl/wp-content/uploads/2019/02/190215_szczawnica_wyniki_m.pdf), s. 2. |
| 27.01.2023, GS K i GS M | Oba PDF-y wprost informują, że slalom gigant nie odbył się z powodu mgły. Nie dopisano medali. [PDF K](https://wintercup.pl/wp-content/uploads/2023/01/230127_wintercup_wyniki_k.pdf), [PDF M](https://wintercup.pl/wp-content/uploads/2023/01/230127_wintercup_wyniki_m.pdf), s. 1 obu dokumentów. |
| 23.02.2024, SL M | Wojciech Dulczewski trzeci (1:25.75), AGH Kraków. Rozbicie nazwiska i uczelni/czasów na dwa wiersze jest wyłącznie problemem ekstrakcji tekstu. [PDF](https://wintercup.pl/wp-content/uploads/2025/11/240223_wintercup_wyniki_m.pdf), s. 2. |
| 28.02.2025, GS M | Juliusz Mitan pierwszy; Mateusz Bucki i Jakub Toporowski ex aequo drudzy (1:45.47); brak brązu. [PDF](https://wintercup.pl/wp-content/uploads/2025/11/250228_wintercup_wyniki_m.pdf), s. 1. |

W nowych sezonach odczytano 167 złotych, 167 srebrnych i 167 brązowych medali K oraz 168 złotych, 168 srebrnych i 167 brązowych M. Suma 1004 uwzględnia wszystkie powyższe remisy; nie należy zastępować jej iloczynem 334 × 3.

## Kontrola sum i kolejności

1. Baza historyczna zawiera 54 rekordy M i 65 K, bez powtórzeń pełnych nazw po bezstratnym uporządkowaniu tokenów. Każda suma medali równa się sumie trzech kolorów. Baza M: 88/88/88 = 264; baza K: 89/86/87 = 262. Historyczne nierówności liczby kolorów zachowano.
2. W pierwotnej kontroli niezależnie ponownie zsumowano bazę i wpisy podium przy dwóch aliasach potwierdzonych publikacjami. Otrzymano wtedy dokładnie 208 rekordów (105 K i 103 M) i ten sam dorobek każdego koloru co w ówczesnym `medals-updated.json`; bez dodatkowych ani brakujących osób. Późniejszą, potwierdzoną przez użytkownika zmianę nazwiska opisano osobno poniżej.
3. Sprawdzono wszystkie pozycje rankingu: porządek złoto → srebro → brąz jest prawidłowy, identyczny dorobek otrzymuje wspólne miejsce. Każde `total` jest równe sumie kolorów.

## Tożsamość i udokumentowane warianty zapisu

| Połączenie | Dowód |
| --- | --- |
| Przemek Gałuszka ↔ Przemysław Gałuszka | [NTN, „Przedświąteczne otwarcie sezonu”, 23.12.2016](https://www.ntn.pl/azs-wc-przedswiateczne-otwarcie-sezonu/): ta sama relacja nazywa zwycięzcę SL reprezentującego AWF Katowice pełnym imieniem i zdrobnieniem. |
| Ania Skarbek-Malczewska ↔ Anna Skarbek-Malczewska | [NTN, „Warto było poczekać”, 23.12.2023](https://www.ntn.pl/azs-wc-warto-bylo-poczekac/): w jednej relacji drugą zawodniczkę PK Kraków opisano jako Annę w GS i Anię w SL. [Oficjalny PDF tej imprezy](https://wintercup.pl/wp-content/uploads/2025/11/231222_wintercup_wyniki_k.pdf) używa Anna, a strata SL wynosi 1.00 s zgodnie z relacją. Drugie potwierdzenie: [NTN, „Coś z niczego”, 24.02.2024](https://www.ntn.pl/azs-wc-cos-z-niczego/) podaje Annę jako trzecią w SL, podczas gdy [PDF tej samej imprezy](https://wintercup.pl/wp-content/uploads/2025/11/240223_wintercup_wyniki_k.pdf) podaje Anię. |
| Dorota Kaczmarek ↔ Dorota Sierpińska | Użytkownik potwierdził 5.11.2026: „Dorota Kaczmarek i Dorota Sierpińska to ta sama osoba tylko po wyjściu za mąż”. W danych zapisano `source_type: user_confirmation`, datę i treść potwierdzenia; nazwą główną jest Dorota Sierpińska, a Dorota Kaczmarek pozostaje poprzednim nazwiskiem. |

Dorota Siedlecka pozostaje osobnym rekordem. Potwierdzenie użytkownika obejmuje wyłącznie parę Kaczmarek/Sierpińska i nie stanowi podstawy do połączenia jej z Dorotą Siedlecką.

## Kontrola końcowa po potwierdzeniu zmiany nazwiska

Po ponownym wygenerowaniu danych wykonano niezależną kontrolę wyłącznie nowego połączenia i sum:

1. W źródłowych podium znaleziono siedem wpisów Kaczmarek Dorota i cztery Sierpińska Dorota. Ich bezpośrednia suma to 9 złotych, 0 srebrnych i 2 brązowe medale, razem 11. Końcowy rekord Doroty Sierpińskiej zawiera dokładnie te 11 odrębnych identyfikatorów konkurencji, bez zgubionych ani powtórzonych wpisów; zajmuje 12. miejsce K i ma jeden osobno liczony tytuł sezonowy SL 2016/17.
2. Dorota Kaczmarek nie występuje już jako osobny rekord tabeli. Zachowano ją jako poprzednie nazwisko Doroty Sierpińskiej wraz z potwierdzeniem użytkownika z 5.11.2026.
3. Rekord Doroty Siedleckiej pozostał bez zmian: 5 złotych, 1 srebrny, 3 brązowe medale, razem 9, w całości z historycznej bazy; 15. miejsce K. Nie przypisano jej żadnych nowych konkurencji.
4. Liczba osób zmniejszyła się z 208 do 207 (K: 105 → 104; M: 103 bez zmian), a liczba medali pozostała równa 1530. Kontrola połączenia i zachowania sum zakończyła się bez rozbieżności.

## Niezależne benchmarki opublikowane przez organizatora

[AZS Warszawa, „Powrót do akademickich czasów”](https://azs.waw.pl/powrot-do-akademickich-czasow/) przy okazji imprezy Oczko w 2025 r. podaje poniższe dorobki z historii zwykłych zawodów. Aktualizacja trafia we wszystkie trzy:

| Osoba | Wynik aktualizacji | Wartość w relacji organizatora |
| --- | --- | --- |
| Karolina Klimek | 42 złote, 34 srebrne, 13 brązowych = 89 | 89 medali, w tym 42 złote |
| Adam Chrapek | 9 złotych, 3 srebrne, 6 brązowych = 18 | 18 medali |
| Michał Szypliński | 3 złote, 3 srebrne, 5 brązowych = 11 | 11 medali |

## Następne kroki

Zachować Dorotę Siedlecką osobno, zgodnie z zakresem otrzymanego potwierdzenia. Przed drukiem przeprowadzić korektę nazwisk i przyjętej metody medalowej; nie dopisywać do tej tabeli medali jubileuszowych ani trofeów za klasyfikacje generalne bez odrębnej decyzji redakcyjnej.
