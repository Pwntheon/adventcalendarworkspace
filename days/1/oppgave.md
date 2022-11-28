# Nissesikker data

## Introduksjon
Når julenissen skal levere gaver, er han nødt til å fly høyt i atmosfæren for å redusere luftmotstand. Etter at sleden ble modernisert til å benytte digitale adresseregistere, har imidlertid mangelen på atmosfære blitt et problem: Atmosfæren bidrar til å redusere kosmisk bakgrunnsstråling. Denne strålingen har en ufin tendens til å flippe bits i digital lagring, noe som kan gjøre data uleselig.

På grunn av dette har nissens hjelpere utviklet et datalagringsformat (Nisse-safe) hvor et lite antall bits i en melding fungerer som *parity bits*, som kan brukes for å verifisere en bit block, og dersom en bit har blit flippet, rette opp denne feilen.

## Nisse-safe
Nisse-safe systemet fungerer som følger:
Data lagres i blokker av lengde `2^n`, hvor `n > 4`. I hver av blokkene er bit 0 ikke i bruk, og *n* bits er *parity bits*. Gjenværende bits brukes til data.

I Nisse-safe v1.0 er `n == 4`. Det gir oss 16 bits per block:

|   	|   	|   	|   	|
|:---:	|:---:	|:---:	|:---:	|
|   0	|   1	|   2	|   3	|
|   4  	|   5	|   6	|   7	|
|   8	|   9	|   10	|   11	|
|   12	|   13	|   14	|   15	|

Bit 0 er ikke i bruk (`-`). Bits 1, 2, 4 og 8 er *parity bits* (`p`). Resten er data (`d`):

|   	|   	|   	|   	|
|:---:	|:---:	|:---:	|:---:	|
|   -	|   p	|   p	|   d	|
|   p  	|   d	|   d	|   d	|
|   p	|   d	|   d	|   d	|
|   d	|   d	|   d	|   d	|

For hver parity bit deles data blokken i 2, hvor den første bitten er parity bit. Dataene i bitten blir så summert, og parity bit settes til 1 eller 0 slik at totalen blir et partall.

Blokkene deles inn som følger:

* For første parity bit (1) telles annenhver bit.
* For andre parity bit (2) telles 2, og 2 hoppes over.
* For tredje parity bit (4) telles 4, og 4 hoppes over.
* For fjerde parity bit (8) telles 8 (og ingenting hoppes over fordi vi er på slutten av blocken)

En annen måte å forklare det på er at parity bitten sin index sier hvor mange bits man skal telle og hoppe over. For `n==4` er dette parity bit og hvilke indekser som telles:
```
1: [ 1,  3,  5,  7,  9, 11, 13, 15]
2: [ 2,  3,  6,  7, 10, 11, 14, 15]
4: [ 4,  5,  6,  7, 12, 13, 14, 15]
8: [ 8,  9, 10, 11, 12, 13, 14, 15]
```

> Merknad: Nisse-safe fungerer bare så lenge det er 0 eller 1 bit flips per blokk. Er det mer enn dette er det ikke mulig å rette opp dataen.

## Eksempel

### Encoding
Nissens hjelpere skal lagre følgende bit streng: 10101010101. De starter med å fylle inn data :

(index 0 er ikke i bruk og settes til 0)
|   	|   	|   	|   	|
|:---:	|:---:	|:---:	|:---:	|
|   0	|   	|   	|   1	|
|     	|   0	|   1	|   0	|
|   	|   1	|   0	|   1	|
|   0	|   1	|   0	|   1	|


Parity bit 1 settes slik at data i indeksene [ 1,  3,  5,  7,  9, 11, 13, 15] summeres til et partall (6)

|   	|   	|   	|   	|
|:---:	|:---:	|:---:	|:---:	|
|   0	|   1	|   	|   1	|
|     	|   0	|   1	|   0	|
|   	|   1	|   0	|   1	|
|   0	|   1	|   0	|   1	|

Parity bit 2 settes slik at data i indeksene [ 2,  3,  6, 7, 10, 11, 14, 15] summeres til et partall (4)

|   	|   	|   	|   	|
|:---:	|:---:	|:---:	|:---:	|
|   0	|   1	|   0	|   1	|
|     	|   0	|   1	|   0	|
|   	|   1	|   0	|   1	|
|   0	|   1	|   0	|   1	|

Parity bit 4 settes slik at data i indeksene [ 4,  5,  6,  7, 12, 13, 14, 15] summeres til et partall (4)

|   	|   	|   	|   	|
|:---:	|:---:	|:---:	|:---:	|
|   0	|   1	|   0	|   1	|
|   1  	|   0	|   1	|   0	|
|   	|   1	|   0	|   1	|
|   0	|   1	|   0	|   1	|

Parity bit 8 settes slik at data i indeksene [ 8,  9, 10, 11, 12, 13, 14, 15] summeres til et partall (4)

|   	|   	|   	|   	|
|:---:	|:---:	|:---:	|:---:	|
|   0	|   1	|   0	|   1	|
|   1  	|   0	|   1	|   0	|
|   0	|   1	|   0	|   1	|
|   0	|   1	|   0	|   1	|

Dataen lagres så i nissens slede

### Decoding

Hvis en bit deretter blir flippet, kan vi "triangulere" hvor feilen har skjedd ved å sjekke at alle blokker summeres til partall. De blokkene som *ikke* summeres til partall, vil være de eneste blokkene som inneholder indeksen til tallet. La oss flippe bit 5:

|   	|   	|   	|   	|
|:---:	|:---:	|:---:	|:---:	|
|   0	|   1	|   0	|   1	|
|   1  	|   1	|   1	|   0	|
|   0	|   1	|   0	|   1	|
|   0	|   1	|   0	|   1	|

Om vi summerer, ser vi at:

* Gruppe 1 summeres til 7 - FEIL
* Gruppe 2 summeres til 4 - RETT
* Gruppe 4 summeres til 5 - FEIL
* Gruppe 8 summeres til 4 - RETT

Dersom vi ser i gruppetabellen ser vi at index 5 er den eneste indeksen som finnes i gruppe 1 og 4, men *ikke* finnes i gruppe 2 og 8. Derfor må bit 5 flippes for å rette opp dataen.

## Eksempel 
To blocks med Nisse-safe data:
```
[
  0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0,
  0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0
]
```
Bits nummer 5 i første block og 15 i andre block er flipped.

Etter behandling får man ut den korrigerte datastrengen:
```
[
  1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0,
  0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1
]
```

# Oppgave
For å teste Nisse-safe har nissens hjelpere enkodet og lastet opp testdata til sleden, og kjørt den på autopilot noen runder rundt nordpolen. Når den kommer tilbake ligger følgende Nisse-safe data i sledens databank:

```
[
 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0,
 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0,
 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0
]
```

Åh nei! Noen av bittene har blitt flippet. Men med Nisse-safe algoritmen klarer nissens hjelpere å flippe disse bitsene tilbake, og får lest ut de originale dataene. *Hva er bit-strengen nissens hjelpere lastet opp til sleden?*

> Svar angis i en enkel bitstreng uten spesialtegn, for eksempel 10101010101101011011011111110010