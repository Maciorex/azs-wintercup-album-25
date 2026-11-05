# Wyniki AZS Winter Cup — badanie źródeł

Stan odczytu: 5 listopada 2026.

## Zakres i kompletność

Album X-lecia obejmuje sezony 2002/03–2011/12. Ustalony przez redakcję zakres nowej części: 2012/13–2025/26, czyli 14 zakończonych sezonów, oraz osobny rozdział jubileuszowy.

W results.json zapisano 84 tabele i 838 wierszy: GS K, SL K, GS M, SL M oraz uczelnie K i M oddzielnie. Dla każdej tabeli zapisano bezpośredni URL oficjalnego PDF, nazwę tabeli i wiersze źródłowe. Nazwy uczelni i zawodników zachowują pisownię źródła; to nie są obecne nazwy uczelni ani ujednolicona baza osób.

## Metoda i weryfikacja

1. Z oficjalnego indeksu https://wintercup.pl/wyniki/ pobrano wyłącznie linki generalna/końcowa K/M. Wyników poszczególnych finałów nie pomylono z generalną sezonu.
2. Pobrano 28 PDF-ów (po dwa na każdy zakończony sezon), wszystkie zakończyły się poprawnym pobraniem i odczytem pdftotext -layout. Wybrano miejsca 1–10 w czterech tabelach indywidualnych i dwóch drużynowych.
3. Kontrola struktury: 6 tabel na sezon; wszystkie cztery indywidualne mają 10 rekordów; punkty we wszystkich tabelach są nierosnące; brak pustych nazwisk/uczelni. 2016/17 M ma w pełnym źródle tylko 8 uczelni, więc pokazano 8, bez tworzenia miejsc 9–10.
4. W PDF 2013/14 drużynowa M sumy pierwszych sześciu uczelni tekstowo łamały się do osobnego wiersza. Odczyt poprawiono i porównano z renderem strony 5. Wiersze source_row zachowują pierwszy wiersz; points zawiera wartość z kolumny Suma, także gdy była w osobnym wierszu.
5. Status transcribed oznacza przepisanie ze źródła, a nie pełną korektę wydawniczą. Przed drukiem potrzebna jest druga niezależna korekta nazwisk, uczelni i punktów. Nie przeliczano punktów ani nie poprawiano oryginalnych zaokrągleń (np. 528 w źródle 2015/16 GS M).

## Daty edycji

result-events.json zawiera 98 wydarzeń z oficjalnego indeksu (eliminacje, finały i wydarzenia towarzyszące), z datami i linkami do wyników. W III eliminacjach 2018/19 indeks błędnie podawał 11.01.2019; nagłówek PDF potwierdza 25.01.2019 — korekta i surowa etykieta zapisane w danych. Finał 2018/19 obejmował SL K 22.02 i GS K 24.02; daty potwierdzono w nagłówkach PDF. Pozostałe daty pochodzą z indeksu i wymagają później porównania z relacjami/galeriami.

## Bezpośrednie źródła klasyfikacji

| Sezon | Kobiety | Mężczyźni |
| --- | --- | --- |
| 2012/13 | [PDF K](https://wintercup.pl/wp-content/uploads/2014/11/1213_klasyfikacja_generalna_kobiet.pdf) | [PDF M](https://wintercup.pl/wp-content/uploads/2014/11/1213_klasyfikacja_generalna_mezczyzn.pdf) |
| 2013/14 | [PDF K](https://wintercup.pl/wp-content/uploads/2014/11/1314_klasyfikacja_generalna_kobiet.pdf) | [PDF M](https://wintercup.pl/wp-content/uploads/2014/11/1314_klasyfikacja_generalna_mezczyzn.pdf) |
| 2014/15 | [PDF K](https://wintercup.pl/wp-content/uploads/2015/03/1415_klasyfikacja_generalna_kobiet.pdf) | [PDF M](https://wintercup.pl/wp-content/uploads/2015/03/1415_klasyfikacja_generalna_mezczyzn.pdf) |
| 2015/16 | [PDF K](https://wintercup.pl/wp-content/uploads/2016/02/1516_klasyfikacja_generalna_k.pdf) | [PDF M](https://wintercup.pl/wp-content/uploads/2016/02/1516_klasyfikacja_generalna_m.pdf) |
| 2016/17 | [PDF K](https://wintercup.pl/wp-content/uploads/2017/02/1617_klasyfikacja_k.pdf) | [PDF M](https://wintercup.pl/wp-content/uploads/2017/02/1617_klasyfikacja_m.pdf) |
| 2017/18 | [PDF K](https://wintercup.pl/wp-content/uploads/2018/03/1718_klasyfikacja_k.pdf) | [PDF M](https://wintercup.pl/wp-content/uploads/2018/03/1718_klasyfikacja_m.pdf) |
| 2018/19 | [PDF K](https://wintercup.pl/wp-content/uploads/2019/02/1819_klasyfikacja_generalna_k.pdf) | [PDF M](https://wintercup.pl/wp-content/uploads/2019/02/1819_klasyfikacja_generalna_m.pdf) |
| 2019/20 | [PDF K](https://wintercup.pl/wp-content/uploads/2020/02/1920_wintercup_klasyfikacja_k.pdf) | [PDF M](https://wintercup.pl/wp-content/uploads/2020/02/1920_wintercup_klasyfikacja_m.pdf) |
| 2020/21 | [PDF K](https://wintercup.pl/wp-content/uploads/2021/02/2021_wintercup_klasyfikacja_k.pdf) | [PDF M](https://wintercup.pl/wp-content/uploads/2021/02/2021_wintercup_klasyfikacja_m.pdf) |
| 2021/22 | [PDF K](https://wintercup.pl/wp-content/uploads/2022/02/2122_wintercup_klasyfikacje_k.pdf) | [PDF M](https://wintercup.pl/wp-content/uploads/2022/02/2122_wintercup_klasyfikacje_m.pdf) |
| 2022/23 | [PDF K](https://wintercup.pl/wp-content/uploads/2023/03/2223_wintercup_klasyfikacje_k.pdf) | [PDF M](https://wintercup.pl/wp-content/uploads/2023/03/2223_wintercup_klasyfikacje_m.pdf) |
| 2023/24 | [PDF K](https://wintercup.pl/wp-content/uploads/2025/11/2324_wintercup_klasyfikacja_k-1.pdf) | [PDF M](https://wintercup.pl/wp-content/uploads/2025/11/2324_wintercup_klasyfikacja_m.pdf) |
| 2024/25 | [PDF K](https://wintercup.pl/wp-content/uploads/2025/11/2425_wintercup_klasyfikacja_k-2.pdf) | [PDF M](https://wintercup.pl/wp-content/uploads/2025/11/2425_wintercup_klasyfikacja_m-1.pdf) |
| 2025/26 | [PDF K](https://wintercup.pl/wp-content/uploads/2026/02/2526_wintercup_klasyfikacja_k.pdf) | [PDF M](https://wintercup.pl/wp-content/uploads/2026/02/2526_wintercup_klasyfikacja_m.pdf) |
