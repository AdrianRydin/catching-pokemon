![bulbasaur](./assets/background.png)

# Gruppexamination: Catching Pokémon

Välkommen, blivande Pokémon-mästare! 🌟

Professor Bugg har ett STORT problem: Pokémon har tagit över webbsidan! De dyker upp helt slumpmässigt, smyger runt i koden och verkar inte ha några planer på att lugna ner sig. Just nu springer de fritt, och det är fullständigt kaos! 💥

Som tur är har NI blivit utvalda att lösa detta. Med hjälp av smart programmering och lite magisk DOM-manipulation ska ni bygga ett Pokémon-fångarspel. Målet? Fånga alla Pokémon genom att hovra över dem med musen! 🖱️🎯

Men var försiktig… 😨 Om du av misstag nuddar en Pokémon du redan har fångat – då blir den skrämd och smiter iväg snabbare än en Abra som just använt Teleport! POOF! 💨

## Uppgift

- Användaren startar vid ett formulär och ni skall formulärvalidera följande
  - Tränarens namn måste vara mellan 5 och 10 tecken långt
  - Tränaren måste vara mellan 10 och 15 år gammal
  - Tränaren måste ha bockat i om hen är en pojke eller en flicka
- Vid lyckad validering skall spelet starta, vid misslyckad validering meddelas användaren om exakt vad som gick snett
- Under tiden spelet pågår skall spelmusik spelas
- 10 slumpmässigt utvalda pokemons (av 151 stycken) skall slumpas ut på skärmen
- Bilderna skall ha en bredd och höjd på 300px.
- Var 3e sekund får varje pokemon en ny position
- När man hovrar över en pokemon så fångas den i en pokeboll
- När man hovrar över en pokeboll smiter pokemonen (måste vara samma pokemon som fångades)
- När alla pokemon fångats avslutas spelet
- Om användarens tid tar sig in på topp 10 snabbaste tider sparas hen ner i HighScore-listan i localStorage
- När HighScore-vyn dyker upp skall användaren kunna starta om spelet genom att återgå till startformuläret

Här hittar ni en [demonstration av spelet](https://drive.google.com/file/d/1XqZY1tBt95HNET9k9-ZnyZomu4RcXfEs/view?usp=sharing)

## Ni har till ert förfogande

### index.html

Detta är den enda html-filen i spelet. I den ligger lite startkod som är frivillig att använda.

### style.css

Detta är den enda css-filen i spelet. Här ligger lite startkod som ni inte rör. Fyll på med er egen styling.

### script.js

Det är i denna fil ni skriver spellogiken för ert spel. Ni får inte skapa några nya filer, utan all kod ni skriver skall in här.

### oGameData.js

Här har ni objektet oGameData till ert förfogande. Detta innehåller en hel del data som kan vara till er hjälp, och dessutom innehåller den flera funktioner som kommer hjälpa er att hålla koll på tiden, samt att slumpa fram nya positioner åt era pokemonbilder.
Rör helst inte koden, men om ni vill döpa om objektet till något kortare så är det okej.

### Mappen assets

Här finner ni alla resurser som krävs för att bygga spelet. Om ni vill välja andra bakgrundsbilder och annan ljudfil så är det okej, men bilderna på pokemonen och pokebollen måste vara de som ligger med i mappen.

## Arbetssätt

Nu skall ni få ta era första stapplande steg med brancher i Git Flow.

För att nå godkänt betyg:

- Får ni inte göra pushar varken till main eller dev, enbart till era feature-brancher
- main får endast innehålla en färdig version av spelet, merga därför inte till main förens spelet är helt färdigt
- Måste var och en i gruppen ha skapat brancher, pushat kod, och gjort pull requests

Tips! Även om arbetssättet är lämpat för att man skall kunna sitta och jobba parallellt med kod så tycker jag att ni bör sitta tillsammans, dela skärm, prata, diskutera, och turas om med vem som kodar just nu. Vi är inte riktigt där ännu att vi kan släppa lös alla på egen hand.

## Handledning

Sköter vi på Discord. Tagga mig i handledningskanalen under de timmar som ni normalt sett har lektionstid. Eftersom detta är ert första riktiga kodprojekt där ni tvingas tänka mycket själva så kommer jag vara ganska generös med hjälp, MEN då krävs det att man gjort ett grundligt arbete och försökt själv först.

## Inlämning

Lämna in länken till ert grupprepo på Azomo senast kl 23:59, torsdagen den 6 februari. Glöm inte att ALLA i gruppen måste lämna in länken. Sen inlämning resulterar i att man hamnar i komplettering, och kompletteringsperioden pågår i 2 veckor från det att rättningarna publicerats.
