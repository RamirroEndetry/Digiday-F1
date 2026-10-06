# Test reakce – překonej pilota Formule 1

Aplikace DigiDay pro měření reakční doby. Cílový čas: 201 ms
(Valtteri Bottas, start VC Rakouska 2017).

## Průběh hry

1. **Spořič** – smyčka videí, klepnutím se spustí návod.
2. **Dvě jízdy**: *trénink* a *naostro*, každá má 3 kola (`GAMES`, `ROUNDS`).
   Počítá se rychlejší průměr z obou jízd. Ve **Správě** lze přepnout na **jednu jízdu**
   o 3 kolech (počítá se její průměr) – volba se pamatuje na daném zařízení a platí
   pro další hráče.
3. **Výherní stránka** – zobrazí se hned po třetím klepnutí jízdy naostro: výsledný čas,
   srovnání s pilotem a cena.
4. **Zápis do žebříčku** – po 5 s se otevře sám (`SIGNUP_AUTO_MS`): jméno, nepovinný e-mail
   a poznámka obsluhy (co je to za klienta). Píše se na klávesnici přímo v aplikaci.
   Bez zápisu hru nejde ukončit – tlačítko *Hotovo* se objeví až po uložení; hráč, který
   odejde, se „odhlásí“ sám návratem na spořič po 60 s nečinnosti.

## Ceny

Cena se určuje podle výsledného času, nastavuje se v `index.html` v konstantě `PRIZES`:

| Čas | Cena |
| --- | --- |
| do 250 ms | ❤️ Srdíčko |
| do 320 ms | 👛 Peněženka |
| pomalejší | 🍬 Bonbón |

## Žebříček a kontakty

- **Žebříček** se vysouvá z boku tlačítkem 🏆 vlevo dole (na spořiči, v návodu i na výherní
  stránce). E-maily ani poznámky v něm vidět nejsou. Po 30 s bez dotyku se sám zavře.
- **Správa** (⚙ vpravo nahoře nebo Ctrl+Shift+Delete, heslo správce): přepínač **Průběh hry**
  (2 jízdy / 1 jízda), seznam hráčů s e-maily, ke každému lze kdykoli dopsat poznámku,
  **Export CSV** (pro Excel) a **Smazat vše** (maže jen žebříček, nastavení zůstává).

## Pravidla proti podvádění

- **Předčasné starty**: klepnutí na červenou opakuje kolo, v každé jízdě jsou povoleny
  jen 2 omyly (`MAX_EARLY`). Třetí jízdu ukončí: trénink se pak nepočítá a jede se naostro;
  při ukončené jízdě naostro se počítá trénink (pokud byl dokončen).
- **Tipnutý klik**: reakce pod 100 ms se počítá jako předčasný start (`MIN_REACTION_MS`).
- **Tlačítka** (Rozumím, Pokračovat, tlačítka na výherní stránce) jsou po zobrazení 0,7 s
  neaktivní (`BTN_LOCK_MS`), aby je neodklikl rozjetý prst.

## Spuštění

- **Web**: otevřete `index.html` v prohlížeči (Chrome/Edge), nebo použijte GitHub Pages.
- **Windows aplikace (Electron)**: spusťte `TestReakceF1-portable.exe` (bez instalace)
  nebo `TestReakceF1-instalace.exe` (vytvoří zástupce na ploše).

## Obsluha na akci

| Akce | Jak |
| --- | --- |
| Celá obrazovka (web) | tlačítko ⛶ vpravo dole nebo F11 |
| Žebříček | tlačítko 🏆 vlevo dole |
| Průběh hry, kontakty, poznámky, export, reset | nenápadné tlačítko ⚙ vpravo nahoře nebo Ctrl+Shift+Delete, zadat heslo správce |
| Ukončení Electron aplikace | Ctrl+Q |
| Přepnutí kiosk / okno (Electron) | F11 |

Heslo správce je v souboru `config.local.js` (`adminPassword`).

Žebříček se ukládá na daném zařízení, každé zařízení má vlastní. Výsledky zůstávají
i po vypnutí, restartu nebo výpadku proudu – smazat je jde jen resetem s heslem.

- **Electron**: soubor `%APPDATA%\Test reakce F1\zebricek.json` (zapisuje se okamžitě
  s `fsync`, vedle je záloha `zebricek.json.bak`).
- **Web**: localStorage prohlížeče (nemazat data prohlížeče / nepoužívat anonymní okno).
Po 60 s nečinnosti se aplikace vrátí na úvodní spořič.

## Spořič (video)

Na úvodní obrazovce běží smyčka pěti záběrů `assets/video/f1-1.mp4` až `f1-5.mp4`
(1920×1080, bez zvuku, každý 5 s). Texty, startovní semafor, výzva ke hře a logo
`assets/logo-digiday.svg` se vykreslují přes video v aplikaci – každý klip má vlastní
scénu (`.scene` v `index.html`, ve stejném pořadí jako klipy). Záběr vyměníte přepsáním
souboru se stejným názvem. Když videa chybí, spořič běží s texty na běžném pozadí.

## Sestavení Electron balíčků

```bash
npm install
npm run build
```

Výstup najdete ve složce `dist/`.
