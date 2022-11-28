# Nissesikker data - Produksjonssetting

> Del 2. Løs forrige luke for å få konteksten til denne oppgaven.

## Introduksjon

Sikre på at Nisse-safe fungerer bra, bestemmer nissens hjelpere seg for å sette systemet i produksjon. De har imidlertid funnet ut at ved å bruke større datablokker i algoritmen sin, kaster de bort færre bits på verifisering og korrigering av data, så lange addresser tar ikke så mye plass.

Julaften kommer, og nissen er på vei til en veldig viktig gavemottaker. Adressen er korrupt, men takket være Nisse-safe algoritmen kan addressen reproduseres perfekt, og gavene kommer fram!

## Nisse-safe v2.0

> Se forrige luke for generell info om Nisse-safe

Siden Nisse-safe deler data i blokker på størrelse 2^n, og bare setter av n+1 bits til verifisering og korrigering, har nissens hjelpere bestemt seg for å øke blokkstørrelsen til 32 bit (`n=5`). 

Algoritmen er den samme:

* Bit med index 0 rendundant og kan sees bort i fra
* Bits med index som er toerpotens (1, 2, 4, 8, 16) er *parity bits*.
* Resterende bits er data.
* Hver *parity bit* settes til 1 dersom tallene i sin gruppe summeres til et oddetall, 0 dersom det blir partall.
* Gruppene deles inn som følger:
    * Start på parity bitten sin index.
    * Plukk `m` indekser, hvor `m` er parity bitten sin index.
    * Hopp over `m` indekser.
    * Gjenta
    * Eksempel: `Parity bit 4: [ 4,  5,  6,  7, 12, 13, 14, 15, 20, 21, 22, 23, 28, 29, 30, 31]`


> Merknad: Nisse-safe fungerer bare så lenge det er 0 eller 1 bit flips per blokk. Er det mer enn dette er det ikke mulig å rette opp dataen. Heldigvis er det ikke *så* store feil i addressen i nissens addresseregister

Dekoding fungerer på akkurat samme måte som i Nisse-safe v1.0. Dersom det er en feil, vil en eller flere av gruppene summeres til oddetall. Indeksen som inneholder en bit flip er da indeksen som finnes i *alle* grupper med oddetall og *ingen* av gruppene med partall.

## Tekst-enkoding

Mangel på finansiering har ført til at mange av nissens datasystemer er utdatert. Derfor har nissens hjelpere valgt et tekst-enkodingssystem som er så bakoverkompatibelt de kunne tenke seg, nemlig 7-bit ASCII, lagret i 8-bits bytes.

Teksten "`OK`" blir i systemet lagret som
```
0100111101001011
```

# Oppgave
Den Nisse-safe enkodede adressen i nissens adresseregister er vedlagt i filen [input.txt](input.txt).

Siden nissen allerede hadde flydd i flere timer er det mange bit flips (men heldigvis ikke mer enn én per datablokk). Rett opp feilene og finn den veldig spesielle adressen nissen skulle levere pakke til.

> Svar angis som en enkel tekststreng, uten anførselstegn, for eksempel `Julenissen, Julenissens hovedkvarter, Postboks 0001, NP`