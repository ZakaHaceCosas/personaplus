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

## 0.0.1-R5-b20

- Started working on the logic - as a side project: "OpenHealth".

> [!INFO]
> **What does that even mean?** See: Basically, the app needs to work with a lot of health data so that it can provide accurate statistics and tips to the end user, so the first idea would be to find a library or something that does provide functions for that stuff. However - I thought it would be a nice idea to try to make our own "health.js" library, and just like that! There's a new directory called `/code` for _the core of the app_, this new library which will allow PersonaPlus to turn all that frontend objectives into actual, worthy data for users to understand themselves, their performance, and their health.

Quick note: OpenHealth will have **it's own changelog**, on `core/CHANGELOG.md`. It's mentioned here only this time, as this is the (huge and) only change of this update.

## 0.0.1-R5-b19

- Renamed most variables to take a more descriptive and easy to understand approach.
- Decided to set an internal standard for console logging: `termLog` (imported from `DeveloperInterface.tsx`). This will `console.log` and log for Dev interface aswell.

## 0.0.1-R5-b18

- Fixed some typos.
- Now, objectives won't be shown in your Home if you don't have to do them today.
- A few other changes.

## 0.0.1-R5-b17

- Fixed a few typos, like "1 MINUTES".
- Fixed a bug where OBJS got saved without an exercise name. Also, while not a bug, this fix also fixed you being able to store an objective that lasted for 0 minutes (imposible to do).
- Added a function to remove an OBJ from the Dashboard (`/Dash`).
- Fixed app not refreshing when marked an OBJ as done.
- Made several improvements to types.
- Fixed many visual mistakes and improved layouts. _Particullary, for some reason using `vertical` `order` on `<BeSwap>` caused a really hard to explain visual bug on the Welcome ("`/Welc`") screen. It was "fixed" by changing the order prop to `horizontal`._
- Improved the flow of username changes.
- Added React & PersonaPlus versions to the Dev interface.
- Made Dev interface opt-in, via `useDevTools` item in AsyncStorage.
  - You can opt-in (or opt-out) again via the Profile tab ("`/Prof`").
- Other small changes and a few performance improvements.

> [!NOTE]
>
> ### **FIXED ERRORS - Latest**
>
> `b11:` For some reason, sometimes the `exercise` prop from the objective's Object does not get stored on creation, giving it an empty name. **This was fixed by adding a placeholder invalid option, forcing the user to choose an option so `setExercise` gets called.**
> `b15`: For some reason, the `objs`' name is not being displayed on mobile devices on Expo Go. **Fixing the error above also fixed this.**
---
> [!NOTE]
>
> ### **KNOWN ERRORS - Latest**
>
> **No known errors at the moment! 🎉**

## 0.0.1-R5-b16

- Made more changes to match the requirements of ESLint.
- Made a lof of UI and design changes to improve the looks on mobile - _this lead to things looking bad on desktop -_ _**it's not a problem, as the only target devices are phones.**_
- Made a peculiar change ;] - moved the bottom navigation bar to the top.
- Added a "Dev" tab designed to help during testing, specially on mobile. Has shortcuts for things that can be done from desktop but not mobile, like clearing `OBJS`.
- Created a function `testLog` designed specifically to make "console logs" for this tab, as sometimes regular `console.log` calls don't appear on the console's replica for the Dev tab.
- Made some progress with the apps' content.
- Made some improvements to types and other aspects of the codebase.
- Updated `DOCS.md`, `README.md`, and `CONTRIBUTING.md` so that they look a bit more professional.
- Other small changes and improvements.

## 0.0.1-R5-b15

- Made several UI changes to improve the looks on end user mobile devices. There's still work to do, but good progress was made.
- Made adjustments to the ESLINT config.
- Other changes to the logic used to structure and render some components to ensure they look good.
- Added a few extra comments to the code to explain some stuff better.
- Made a few changes like replacing some `let` with `const` to match the requirements of ESLint.

> [!NOTE]
>
> ### **FIXED ERRORS - b15**
>
> None
---
> [!WARNING]
>
> ### **KNOWN ERRORS - b15**
>
> _**New errors**_:
>
> `b15`: For some reason, the `objs`' name is not being displayed on mobile devices on Expo Go. No clue what the source is, will look onto that.
>
> _**Still not fixed from older dev versions**_:
>
> `b11:` For some reason, sometimes the `exercise` prop from the objective's Object does not get stored on creation, giving it an empty name. Don't know it's origin & only happens sometimes, making it hard to replicate. Will look onto it.

## 0.0.1-R5-b14

### Updated Expo from SDK 50 to SDK 51 🎉

- **Updated Expo:** From ~~50.0.19~~ to **51.0.14**
- **Updated React Native:** From ~~0.73~~ to **0.74.2**
- Updated all the dependencies to match the new SDK and RN versions.
- Added an empty return to font loading on `_layout.tsx`, to avoid issues.
- Made _several_ UI (both style and layout) changes.
- Removed the usage of `Noti` for dev logging. Plus, finally made console logs consistent across all the code.
- Fixed username input using numerical and not text keyboard on mobile.
- Added a few comments to the code to explain stuff better.
- Added ESLINT and Prettier config files.
- Small extra changes.

> [!NOTE]
>
> ### **FIXED ERRORS - b14**
>
> `b9:` Console spamming "`Unexpected text node: . A text node cannot be a child of a <View>.`". _The error was a stupid inline comment, LOL._
> **And thanks to this fix, app was finally properly tested on mobile!**
---
> [!WARNING]
>
> ### **KNOWN ERRORS - b14**
>
> _**New errors**_:
>
> None.
>
> _**Still not fixed from older dev versions**_:
>
> `b11:` For some reason, sometimes the `exercise` prop from the objective's Object does not get stored on creation, giving it an empty name. Don't know it's origin & only happens sometimes, making it hard to replicate. Will look onto it.

**Note:**
> Now that it was finally possible to test on mobile, a LOT of visual issues were found. Will be adressed progressively.

## 0.0.1-R5-b13

- Now you can mark an objective as done.

> [!NOTE]
> KNOWN ERRORS remain the same as on `b11`

## 0.0.1-R5-b12

- Created `Sess.tsx`, page for live sessions. Still not done.
- Made very small changes to code documentation and applied them code-wide.

> [!NOTE]
> KNOWN ERRORS remain the same as on `b11`

## 0.0.1-R5-b11

- Fixed the `key` prop not being used properly in `Dash.tsx`.
- Fixed the "Create active objective" button being spammed on the UI when there _are_ created objectives.
- Added a new First launch check on the `index.tsx` page. Will redirect to `/Welc` (welcome screen) if `hasLaunched` item does not exist in LocalStorage. Also, it gets created so you don't get redirected each time you open PersonaPlus, only on the first launch.
- Updated the `Swap` component, now supports new optional property `order` which is equivalent to _`flex-direction`_.
- Fixed errors with the `Crea.tsx` page:
  - Not creating objs.
  - Not going home when an obj is created.

> [!WARNING]
>
> ### **KNOWN ERRORS - b11**
>
> _**New errors**_:
>
> For some reason, sometimes the `exercise` prop from the objective's Object does not get stored on creation, giving it an empty name. Don't know it's origin & only happens sometimes, making it hard to replicate. Will look onto it.
>
> _**Still not fixed from older dev versions**_:
>
> `b9:` Console spamming "`Unexpected text node: . A text node cannot be a child of a <View>.`".

## 0.0.1-R5-b10

- Finally, created objectives get displayed **correctly**.
- Added an objective creation page.
- Added the [Expo Go badge](https://github.com/expo/expo?tab=readme-ov-file#-badges) to the README.
- Updated `obj`'s structure to make it simpler. Removed many type interfaces as they're not needed anymore.
- Made some styling updates.

> [!WARNING]
>
> ### **KNOWN ERRORS - b10**
>
> _**New errors**_:
> None 😎
>
> _**Still not fixed from older dev versions**_:
>
> `b9:` Console spamming "`Unexpected text node: . A text node cannot be a child of a <View>.`".

## 0.0.1-R5-b9

<!--Me encantaría dejar aquí anotado que la mejor commit hasta el momento coincide con el rebrand y con la commit 69 XD, no se el porqué, pero sencillamente lo anoto-->

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
> **KNWON ISSUE:** For some reason, I didn't managed to make Microsoft's Fluent Icons (the ones used in the UI design) React package work, so I used Material Design Icons instead, via Expo's `@expo/vectoricons`

- Now the documentation is fully usable, can be considered "done". _Of course, it is still subject to changes at any time._
- Licensed under Apache 2.0.
- Added input colors to `VAR-DSGN.jsonc`.
- Updated all files to follow the documentation's requested code guidelines.
- Fully formatted the code + added formatting on save.
- Changed many `.vscode` settings.
- General changes and improvements to the Homepage (`/`).
- Made some progress in the dashboard (`/Dash`). Implemented `Notis` and _fixed_ obj fetching. (Still looking forward to implementing obj creation).

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
- Implemented `AsyncStorage` to store _OBJS_ data.
- Rewritten the documentation `DOCS.md`.
- Added versioning (`CHANGELOG.md` (this file)).
- Created a better, more complete `README`.

## PREVIOUS

Not loged.
