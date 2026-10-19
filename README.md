# Hochzeivilization – Einkommen (income tracker)

A companion app for the physical board game. The main screen is split into one area per
player (blue, green, red, black). Each shows that player's income for the next turn
(🔬 science, 🌾 food, 🪙 coins), their power (⚔︎) and their share of the total population.
Tap an area to open that player's sheet. The app runs offline and can be added to the home
screen. German and English, switchable in the menu.

## Put it on GitHub Pages

1. Create a new repository (for example `hochzeivilization-einkommen`) and upload the
   **contents** of this folder, so that `index.html` sits at the top level.
2. *Settings → Pages → Source: Deploy from a branch*, branch `main`, folder `/ (root)`.
3. After a minute or two the app is at `https://<name>.github.io/<repo>/`.
4. **iPhone/iPad:** open it in Safari → Share → **Add to Home Screen**.
   **Android:** open it in Chrome → menu → **Install app** (or *Add to Home screen*).
   The first visit stores every file on the device. After that it works without internet.

All paths are relative, so any repository name or subfolder works.

### After changing a file

Increase `VERSION` in `sw.js` (`hzv-einkommen-v1` → `hzv-einkommen-v2`). Otherwise devices
that already have the app keep the old version, because the app always loads from the
device first. Also update `APP_VERSION` in `app.js`; it is shown at the bottom of the menu.

## At the table

| | |
|---|---|
| **Setup** | Tap a hexagon to add or leave out a colour (two to four players). Names are optional; empty ones show the colour. |
| **Menu** | The hexagon in the middle of the main screen. *New game* needs a second tap to confirm and keeps the names. |
| **Tiles and population** | − / + changes the count. Hold a button to count quickly. A swipe that starts on a button scrolls and changes nothing. |
| **Yield per tile** | Tap the yields under a tile name (the dashed box). Change them with − / + when a technology adds something, for example Paper: grassland +1 🔬. *Reset to base* restores the printed values. Population has its own yield per population point: Writing, Universities, Assembly line, Robotics. |
| **Trade routes** | Number of cities connected to the capital: by road (+1 to all three) or by unbroken railway (+2). |
| **Ecology, Genetic engineering, Bureaucracy** | Checkboxes. The amount each one adds is shown next to it. |
| **Bureaucracy** | Enter the tiles around the capital **a second time** in the tile rows. Enter the capital's population in the *Capital* row that appears. It counts twice for yield only. The population share and Ecology keep using the real population. |
| **Other** | A free line for whatever the rows don't cover: Sea power, Pilgrimage, Viking raids, events (for example −food in a famine). |
| **Power** | − / + for buying and losing power. **Turn start** removes the loss in one tap: half, a third with *Steel*, a quarter with *Tanks*, always rounded up. The message that follows has *Undo*. |
| **Yield next turn** | At the bottom of each sheet: how the total is made up, like the yield overview in the digital game. |

Everything is saved on the device straight away (browser storage). Each phone or tablet
keeps its own game, and there is no syncing between devices.

## How the income is calculated

`calc.js` holds the rules, taken from `incomeBreakdown()` in `js/engine.js` of the digital
version (v86):

* tiles: count × yield per tile, for each terrain
  (base values: grassland 0/1/0, forest 0/0/1, mountains 1/0/1, river 0/1/1, sea 0/0/1,
  island 1/1/1)
* population: count × yield per population (base 1/−1/1); with Bureaucracy the capital's
  population is counted a second time
* Ecology: +1 to all three per 2 population of the whole empire, rounded down once
* trade routes: +1 to all three per city by road, +2 per city by railway
* the *Other* row
* Genetic engineering: +1 food per 4 science of that total, rounded down
* Bureaucracy doubles trade routes, Ecology and Genetic engineering

This was checked against the game's own engine on 5,000 random empires (random cities,
technologies, roads and railways, Bureaucracy, Ecology, Genetic engineering, Sea power).
The results matched exactly in every case. Power loss was checked the same way.

**Limitation:** bonus power that is never lost (the Vikings' *Warrior culture*, *The Statue
of Zeus*) is not tracked separately. The turn-start button works out the loss from the whole
power value, but by the rules only bought power is lost. A player with bonus power may lose
too much from the button; put it back with +.

## If the game is on the same GitHub account

All GitHub Pages sites of one account share the address `<name>.github.io`, so they also
share the browser's offline storage. The game's `sw.js` (up to v86) deletes **every** cache
except its own whenever it updates:

```js
ks.filter(k => k !== VERSION)
```

This app rebuilds its offline copy the next time it opens with internet. But if it is opened
**without** internet right after a game update, it will not load. A one-line fix in the
game's `sw.js` (activate handler) avoids this:

```js
ks.filter(k => k.startsWith('hochciv-') && k !== VERSION)
```

Then raise the game's version as usual (`node tools_version.js`). This app only ever deletes
its own caches (`hzv-einkommen-…`), and its saved data uses its own key
(`hzv-einkommen.state`), separate from the game's `hochciv.*`. If the game has saved a
language choice on the same device, the app uses it as its first language.

## Files

```
index.html             page skeleton
style.css              look of the printed board: parchment, ink, terrain colours
calc.js                the income rules (also usable from Node: require('./calc.js'))
app.js                 screens, counters, saving, offline registration
sw.js                  offline cache – raise VERSION after every change
manifest.webmanifest   name, colours and icons for the home screen
icons/                 app icons (192, 512, maskable 512, apple-touch-icon 180)
fonts/                 Vollkorn (SIL Open Font License, see fonts/OFL.txt)
```
