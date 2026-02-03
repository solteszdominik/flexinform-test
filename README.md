Projekt dokumentáció – fejlesztési folyamat és AI-használat

A projekt elkészítését az alap mappastruktúra kialakításával kezdtem:

- models
- components
- services

A fejlesztés későbbi szakaszában, a kód átláthatósága és hosszú távú karbantarthatósága érdekében külön validators és constants mappákat is létrehoztam.

Az API dokumentációja alapján elkészítettem a szükséges modelleket, majd bekötöttem az API-t az alkalmazásba. Ezt követően elkezdtem felépíteni az oldal vázát a komponensek segítségével. Elsőként a client-list komponens készült el, hogy ellenőrizni tudjam az ügyfelek és a hozzájuk tartozó autók sikeres listázását.

Ezután kialakítottam a kereső felületet (client-search). A fejlesztés során problémába ütköztem, mivel a keresési funkció után kezdetben tömböt vártam vissza a szolgáltatásból, ami nem minden esetben volt helyes feltételezés.

Ebben a pontban vettem igénybe AI segítséget, elsősorban a visszatérési típusok és a keresési logika átgondolásához, valamint a hiba okának beazonosításához.

A keresési funkciónál szerveroldali hiba is jelentkezett (500-as státuszkód), amikor név alapján próbáltam lekérdezést indítani. A szerver ugyan hibát adott vissza, de a konzolra a várt adatok kiíródtak. Ennek elemzéséhez és a lehetséges okok feltárásához szintén AI-t használtam iránymutatásként.

A client-service kialakításánál szintén nehézségbe ütköztem egy adott adat megjelenítésével kapcsolatban. Ezt végül a hivatalos dokumentáció áttanulmányozásával sikerült megoldanom. Ennek során megismerkedtem az Angular újabb @if szintaxisával, amelyet korábban \*ngIf formában használtam, és ennek megfelelően refaktoráltam a kódot modernebb megoldásokra.

A funkcionális váz elkészítése után kisebb dizájn elemeket is hozzáadtam az alkalmazáshoz, hogy egy letisztult, admin jellegű felületet kapjak.

A feladat elkészítése körülbelül 7–8 órát vett igénybe.
Az AI-t összesen körülbelül négy alkalommal használtam:

- egyszer ellenőrzési célból,
- egyszer az API-val kapcsolatos hiba elemzéséhez,
- kétszer pedig a keresési funkció hibás működésének feltárásához.

Az AI-t minden esetben segédeszközként, nem pedig kész megoldások átvételére használtam.
