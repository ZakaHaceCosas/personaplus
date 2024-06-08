# Registro de cambios de PersonaPlus (CHANGELOG)

COMO FUNCIONAN LAS VERSIONES // HOW DOES VERSIONING WORK:

Dividamos el desarrollo en dos fases, PRE-APP y POST-APP.

PRE-APP es donde estamos ahora, cuando las actualizaciones son a un código que todavía no está acabado (estamos en un punto en el que un APK sería inútil, la app no sirve). Cada versión / actualización durante esta fase sumará 1 a `X` en `0.0.1-R5-bX`.

Cuando la app llegue a un punto en el que es utilizable y se publique el primer APK (probablemente en GitHub Releases), se lanzará como "0.0.1-R5" sin más. A partir de ahí entramos en fase POST-APP:

- Versiones que arreglen bugs, errores, o mejoren el rendimiento, sin hacer cambios, sumarán 1 a 0.0.X-R5.
- Versiones con cambios, mejoras, o que hagan una diferencia en la app, sumarán a 0.X.0-R5.
- Cuando todas las funciones principales / básicas estén implementadas y testeadas, se pasará a la 1.0.0-R5.
- Si se está en X.X.9, pero se siguen lanzado actualizaciones que deberían sumar al 9, sencillamente se seguirá sumando (p ej. 0.0.10-R5).

- PD: Los logs serán en inglés, siempre.

## 0.0.1-R5-b10

- Finally, created objectives get displayed. (*Unfinished, commits oriented to finishing this won't version bump.*)

## 0.0.1-R5-b9 (commit 69 XD)
<!--me encantaría dejar aquí anotado que la mejor commit hasta el momento coincide con el rebrand y con la commit 69 XD, no se porque sencillamente lo anoto-->
- **Updated Expo:** From ~~50.0.17~~ to **50.0.19**
- Fixed dependencies.
- Fixed the `adaptive-icon` syntax.
- Fixed the dashboard's layout.
- Uploaded all the app icons.
- Created custom switch element `Swap.tsx`.

> [!WARNING]
> **KNOWN ERROR**: Swap not working correctly.

- Added icons to the app.

> [!NOTE]
> **KNWON ISSUE:** For some reason, I didn't managed to make Microsoft's Fluent Icons React package work, so I used Material Design Icons instead, via Expo's `@expo/vectoricons`

- Now the documentation is fully usable, can be considered "done". *Of course, it is still subject to changes at any time.*
- Licensed under Apache 2.0.
- Added input colors to `VAR-DSGN.jsonc`.
- Updated all files to follow the documentation's requested code guidelines.
- Fully formatted the code + added formatting on save.
- Changed many `.vscode` settings.
- General changes and improvements to the Homepage (`/`).
- Made some progress in the dashboard (`/Dash`). Implemented `Notis` and *fixed* obj fetching. (Still looking forward to implementing obj creation).

> [!WARNING]
> **KNOWN ERROR**: Still doesn't access them 100% correctly.

- Fixed errors with the Profile (`/Prof`) page. Added a "current username is ..." text to the username change menu.
- A lot of progress with the Welcome screen (`/Welc`). First page is complete, plus added (non-tested) data saving.
- Now `GapView` also has a `width` argument.
- Made changes to types in different components.
- Additional progress.

> [!WARNING]
> **OTHER KNOWN ERRORS**: Console spamming "Unexpected text node:  . A text node cannot be a child of a `<View>`.". I am trying to find were that comes from.

## 0.0.1-R5-b8

- Changes to different root files (`.env`, `package.json`, etc...) to setup Expo EAS.

## 0.0.1-R5-b7

- Added `position` attribute to Notis.
- Updated `/prof` (profile page) to the new, correct layout.
- Replaced `console.log` and `console.error` with Notis in `/prof`.
- Updated the documentation. While still unfinished, it's now in a state where it's usable as if it was.
- Added React's `StrictMode`.
- Organised some components and made the code a little cleaner.

## 0.0.1-R5-b6

- Fixed some errors
- Removed the custom `Input.tsx` component, will reuse proped default `Native.Input`.

## 0.0.1-R5-b5

- Changes to how `width`s and `height`s are passed to avoid VSC errors.

## 0.0.1-R5-b4

- Visual improvements
- Creation of Notification and Nomore component
- Some changes to error handling in `index.tsx` (replaced `console.error` with in-interface logs, will roll out to all files on next commits)

## 0.0.1-R5-b3

- Very small changes
- Created Welc.tsx for the welcome page and made some work
- Created Input element

## 0.0.1-R5-b2

- Changed the code style used for imports.
- AsyncStorage! + username, which is preserved in the AS. It can be edited aswell.

## 0.0.1-R5-b1

- Fix `Foot.tsx` (more or less).
- Started works with the Divisions.

## 0.0.1-R5

- Start over, with TypeScript this time.
- Barely anything achieved (it literally errors at `start`, lol). Will look onto that.

## 0.0.1-R4

### (This was a failed attempt, not all the listed changes were achieved)

- Attempt of refactor of the codebase.
  - All code that was not function has been rewritten.
  - New variable naming system.
  - New file structure.
  - Created `metro.config.js`.
  - Created `.vscode/`.
- Removal of every single in-app gradient, in favour of plain colors.
- Implemented `AsyncStorage` to store *OBJS* data.
- Rewritten the documentation `DOCS.md`.
- Added versioning (`CHANGELOG.md` (this file)).
- Created a better, more complete `README`.

## PREVIOUS

Not loged.
