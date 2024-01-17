# IMAGE PRELOADER

![bild på js function för promise.all](/src/img/imagepre.png)

Denna uppgift handlade om att skapa en bildförhandsvisare (image preloader). Till en början hade jag svårt att exakt förstå vad det innebar och tänkte initialt att det var bara en laddningsspinner. Efter lite utforskning och efter att ha hört att det involverade promises, skapade jag funktioner för att få alla bilder att visas samtidigt och laddas i bakgrunden innan de visas.

## Installation

För att köra detta projekt lokalt, följ stegen nedan:

1.  **Klona detta repository till din lokala maskin:**

```bash
git https://github.com/WilliamBostrom/ImgPreloader.git
```

2.  **Gå in i den klonade mappen::**

```bash
cd ditt-repo

```

3.**Öppna projektet:**

```bash
live-server

```

## Funktioner för att styra/visa gränssnittet:

Jag har integrerat två funktioner för att hantera gränssnittet, det vill säga hur bilderna presenteras för användaren. _displayOneAtTime()_ används för att visa endast en av de tre olika API:erna (knapparna) åt gången när man trycker på en vald knapp. För att implementera _displayRandom()_ använder jag mig av ett annat innerHTML-element där jag visar bilderna. Med andra ord ligger de i två olika "containers" där jag ändrar mellan display:none och display:block beroende på om användaren väljer en specifik API-knapp, som t.ex. "cat", eller om användaren trycker på "hämta random bilder", vilket då visar den andra containern. Samtidigt som _displayOneAtTime()_ och _displayRandom()_ körs har jag också inkluderat en laddningsspinner. showLoaderSpinner() startar när en knapp trycks och efter att bilderna är färdigladdade körs _removeLoader()_ för att dölja laddningsspinnern.

## Funktioner för att ladda bilder asynkront:

Funktionen _loadImage(src)_ hanterar alla bilder och ser till att alla har laddats klart innan de visas. Den returnerar en Promise som laddar en bild och resolvar dess källa när bilden är laddad.

![bild på js function för promise.all](/src/img/loadImg.png)

## Funktion för att hantera klickhändelser och visa bilder:

_promiseAllThis():_ Hämtar bilder från alla tre olika API:er (Sveriges Radio api.sr.se, dog.ceo, och api.thecatapi). Denna funktion laddar dem asynkront och visar dem alla bilderna tillsammans på skärmen när alla bilderna är klara, efter att knappen “btn” eller som den heter på sidan "hämta random bilder” trycks.

_Funktionen som hanterar 3 olika apier samtidigt och visar bilder från alla samtidigt_
![bild på js function för promise.all](/src/img/promiseAllThis.png)

_fetchThis(apiUrl, apiData):_ Är den andra funktionen som sköter att hämta data från alla olika API:er men när de visas en åt gången. Jag har gjort så att både btnDog, btnCat, och btnRadio returnerar en funktion för att ta ut rätt bild-URL från varje unikt API. Den hämtar datan och transformerar datan från ett API åt gången, och sedan visas bilderna.

\_bild på hur datan från _btnCat_ skickas vidare till _fetchThis()_
![bild på js function för promise.all](/src/img/fetchThisbtnCat.png)

## Funktioner för att hämta bild-URL:er från olika API:er:

I promiseAllThis() körs en Promise.all över alla tre olika API:er och skickar dem till tre separata funktioner som fetchar och tar ut den nödvändiga datan för att visa bilderna därifrån.

**getImageUrl(requestUrl):** Hämtar och returnerar hundbilder.
**getRadioUrl(requestUrl):** Hämtar och returnerar radiobilder.
**getCatUrl(requestUrl):** Hämtar och returnerar katbilder.

_Exempel på hur en fetch ser ut innan den går tillbaka till promiseAllThis()_
![bild på hur det fetchas till promiseAllThis](/src/img/getCatUrl.png)

Efter att datan är hämtad går _loadImage()_ igenom bild efter bild och i arrayen “_imagePromises_” innan de skickas till ett nytt loadedImages, som även där väntar in att alla bilder är färdiga med Promise.all innan de visas på skärmen.

_Hur loadimage körs inom promiseAllThis och hur bilderna väntar in varandra_
![bild på hur bilderna laddas i promiseAllThis functionen](/src/img/loadImgExempel.png)

_Hur loadimage körs inom fetchThis och hur bilderna visas för användaren (alltså när btnDog, btnCat eller btnRadi trycks)_
![bild på hur bilderna laddas i visas i displayData functionen](/src/img/displayData.png)
