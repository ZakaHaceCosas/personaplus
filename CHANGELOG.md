# Registro de cambios de PersonaPlus (CHANGELOG)
<!--
README
-->
<!--
COMO FUNCIONAN LAS VERSIONES // HOW DOES VERSIONING WORK:

Dividamos el desarrollo en dos fases, PRE-APP y POST-APP.

PRE-APP es donde estamos ahora, cuando las actualizaciones son a un código que todavía no está acabado (estamos en un punto en el que un APK sería inútil, la app no sirve). Cada versión / actualización durante esta fase sumará 1 a `X` en `0.0.1-R5-bX`.

Cuando la app llegue a un punto en el que es utilizable y se publique el primer APK (probablemente en GitHub Releases), se lanzará como "0.0.1-R5" sin más. A partir de ahí entramos en fase POST-APP:

- Se saltará a 0.1.0-R5 al pasar a POST-APP.
- Versiones que arreglen bugs, errores, o mejoren el rendimiento, sin hacer cambios, sumarán 1 a 0.0.X-R5.
- Versiones con cambios, mejoras, o que hagan una diferencia en la app, sumarán a 0.X.0-R5.
- Cuando todas las funciones principales / básicas estén implementadas y testeadas, se pasará a la 1.0.0-R5.
- Si se está en X.X.9, pero se siguen lanzado actualizaciones que deberían sumar al 9, sencillamente se seguirá sumando (p ej. 0.0.10-R5).

- PD: Los logs serán en inglés, siempre.
-->
<!--
END README
-->

<!--
TEMPLATE
## <VERSION>

### User updates - Latest

### Dev updates - Latest

### Trivial updates - Latest
-->

<!--
PD: Changelog is managed by the owner only, thanks. One task less for you!
-->

## 0.0.1-R5-b25

> Note: This update also brings changes to OpenHealth (core library). See core/CHANGELOG.md for more info.

### User updates - Latest

- Some content lacking translations has now been translated.
- **Fixed** the app thinking the Welcome form was done even if it wasn't. Before, if the app was left without submitting it, and relaunched, the app would directly load without the data, treating the user as "Unknown".

### Dev updates - Latest

- Added unit testing.
- Removed `wayToGetThem` arg from `getObjectivesDailyLog()`.
- Replaced `return {*}` with `0 | 1` (depending on success / failure) in some functions.
- Removed a useless `useEffect` from DeveloperInterface.
- Removed some `termLog`s that were there for debug purposes and aren't required anymore.
- Removed two `useState`s and one `useEffect` from `index.tsx`. Turns out the check for background fetching & notification status were duplicate.
- (WIP) Added constants for font sizes (FONT_SIZES) and spacings (SPACING), helping with visual consistency across the app.
- Created a (memoized) BackButton component. Thanks, [@Alvaro842](https://github.com/Alvaro842DEV).
- `useCallback` was implemented for `handlePrivacyPress` and `handleOssPress` functions, making the app more responsive by reducing unnecessary function re-creations. Thanks, [@Alvaro842](https://github.com/Alvaro842DEV).
- Continue to extract functions from JSX to improve readability and maintainability. Thanks, [@Alvaro842](https://github.com/Alvaro842DEV).

### Trivial updates - Latest

- Nothing (yet).

## 0.0.1-R5-b24

### User updates - b24

- Finally! Fixed the WelcomeScreen's layout. It's now centered and (thanks to other changes made) it's looking pretty good.
- Finally!! Fixed the Bottom navigation bar! It's now actually at the bottom.
  - This change implied visual changes to many components (all the pages that use the BottomNav, also the Footer component).
- Also fixed Swap's layout. It looks mostly correct now.
- Simplified CreateObjective page (revomed the "Nevermind" button, use "< Go back" instead).
- Instead of a "change to English / Spanish" button on WelcomeScreen, now PersonaPlus auto-detects your language (if you don't use a supported lang defaults to English just like always).
- Changed some in-app texts to be shorter.
- Add a Results page after a session.
- Added a daily log for objectives (Work in Progress)

### Dev updates - b24

- Removed the old, duplicate `termLog()` implementation from Dev Interface.
- Dev Interface now also has Loading... state. Also, now all data is fetched from the same Effect.
- Improved some console logs to be more descriptive.
- Replaced `vw` and `vh` in many places with React Native's `Dimensions`.
- Removed a useless export (`addLogToGlobal`) from termLog.
- Added daily logging for objectives. It's toolkified onto the objectives toolkit. (Unfinished, work in progress).
- Added a function to obtain today's date in the `DD/MM/YYYY` format (`toolkit/today.ts`, `getCurrentDate()`).
- Now Divisions' children are optional.
- Added support for `undefined` to `validateBasicData`, for less strict validation.
- Added `UserData` and `UserHealthData` interfaces to toolkit `userData.ts`, alongside `validateBasicHealthData` function.
- Removed some dependencies that weren't needed.
- Made changes to VSCode config (`.vscode/settings`).
- Added JSDoc to sections & divisions. Also improved color toolkit's JSDoc.
- Replaced using a `wasDone` property on each objective in favour of the global daily log.
- Made code easier to read by turning into functions some logics that were done directly inside of the JSX, at `index.tsx` and `Sessions.tsx` for example.
- Removed the `wayToGetThem` parameter from `getObjectives()`: now it's not possible to directly get them as a string. This removes the need to use `Array.isArray`, leading to shorter and more readable code.

### Trivial updates - b24

- Removed the useless easter egg from WelcomeScreen (which I never got the chance to see, by the way). Also removed the "time to push up" question.
- Fixed typos.
- Removed the `isDevelopmentBuild()` comprobation in Dev Interface. It didn't work anyway.
- Now the repo also comes with a `lockb` file, for Bun.
- Added a lot of explanatory comments (and more).
- Tried to use React Native's New Architecture - bad idea.
- Now development builds have their own name and icon :]

### Known errors - b24

- Dev Interface refuses to render, due to "an object not being a valid child" or something.
- On some devices, scrolling doesn't work correctly. In others it does (older ones).

## 0.0.1-R5-b23

### User updates - b23

- Now the duration selector for creating objectives allows for more precise durations.
- Translated all `ToastAndroid` messages, reminder notifications, and buttons.
- Simplified the Dev Interface flow. Removed the need of clicking three times just to access it the first time.
- Replaced some `.navigate()` functions with `.back()` to avoid confusing the user.
- Now the profile update page makes more sense: before you only had the option to edit _all_ your profile again from scratch, even your gender. Now, all the data will default to the previous data, letting you change only what you want to change.
- Now sessions display time in `mm:ss` format rather than just seconds.
- Now rests do work properly!

### Dev updates - b23

- **A lot of code quality improvements and refactors, this is the key point of this update.**
- Renamed `components/` to `src/`.
- Refactored `termLog` to avoid require cycles. It has been toolkified and moved to `src/toolkit/debug/console.ts`. Types have been consequently moved.
- Removed the `wantsDev` check. This lead to less code and a simpler flow.
- Added JSDoc to many functions.
- Toolkified reminder notifications.
- Added some try-catch statements to improve error spotting.
- Merged `Section.tsx` and `SectionHeader.tsx` onto a single file.
- Updated the objectives toolkit, `getObjectives` and `fetchObjectives` have been merged.
- Added a `calculateSessionFragmentsDuration` to the objective toolkit. Calculates rest timing for sessions, basically.
- Fixed an issue with `[key: string]: Objective` and `Objective[]` being messed up. Achieved by creating a `objectiveArrayToObject` toolkified function.
- Now all `type="error"` `termLog`s will be shown by default to the end user within an Android toast message. This improves user feedback, but also helps improving code legibility as a lot of lines have been removed thanks to this. You can also manually show the user non-error logs passing `true` as the third argument to the function.
- Created a component `sessions/InfoIcons.tsx` to display the info icons in the Sessions page, making code more readable.
- Toolkified UI colors. Now all the colors we'll use are accessible from the `colors`. It has JSDoc (to be polished, tho).
- Componentified loading screens.

### Trivial changes - b23

- Removed the preheader on the about page to save space.
- Fixed an issue with spacing among the "CLEAR ALL" button in Dev Interface.

## 0.0.1-R5-b22

- Implemented translations: now the app lets you choose between English (fully done) and Spanish (work in progress).
- The WelcomeScreen layout still has a few issues, but it's now centered at least.
- Fixed "Go back" button sometimes going to a different page.
- Added the option to save to a file PersonaPlus' logs.
- Refactored import statements.
- Changed the way CreateObjective handles the `submit` function, by adding a `void` function that handles the `async`, instead of calling the `async` directly.
- Toolkified objectives' descriptions, saving a lot of code in the Dashboard.
- Toolkified `adjustedToday`.
- General code quality improvements, specially within Sessions.
- Imrpoved some comments for better code understandability.
- Now PersonaPlus will check daily for your active objectives' due days. If you've done an objective today, and tomorrow you have to do it again, it's `wasDone` (_boolean_) value will change to `false` again so it's shown again on the app's homepage.
- Added Expo's `expo-background-fetch` and `expo-task-manager` for that. Also fixed a few deps.
- Improved detection of invalid user data (age, weight, height...).

## 0.0.1-R5-b21

- Fixed a _stupid_ mistake: sometimes THIS `{}` was used as an "array" instead of THIS `[]`, causing problems with objectives and their logic.
- Updated `app.config.ts` for Android stuff.
- Updated Expo and added some packages that apparently were required but weren't installed (`expo-system-ui` and `expo-device`). Also added `expo-navigation-bar` to customise the Android navbar's behavior, and `expo-file-system` and `uuid`, which are (currently) unused.
- Fixed the status bar not looking properly.
- Now objectives' type is global (`components/types/Objective.ts`). Some of the functions related to them have been made global aswell (`components/toolkit/objectives.ts`). Types have been updated, by the way.
- Finally (in favour of code-understandability) decided to rename the AsyncStorage item used for objectives, from "`objs`" to "`objectives`".
- Updated the ID system for objectives, now it works properly (and also, uses 10 digits instead of 3).
- Changed back `AsyncStorage.clear()` with `multiRemove`, mainly because now objectives should be set as `[]` instead of `""` to "clear" them.
- Fixed issues in `index.tsx` with how objectives were fetched.
- Now sessions work properly.
  - Also added repetitions.
- Made improvements to code legibility.
  - Specially thanks to the objective toolkit, many sections of the code are way shorter and easier to read.
- Actually fixed `termLog()` and Dev interface.

> [!NOTE]
>
> ### **FIXED ERRORS - b21**
>
> - Fixed termLog() not making persistent logs for Dev Interface.
> - Fixed sessions not being able to open.
> >
> > - This was fixed by adding the `react-native-svg` dependency.
> >
> - Fixed objectives not being stored correctly (`{}` instead of `[]`).
>
---
> [!NOTE]
>
> ### **KNOWN ERRORS - b21**
>
> - Wrong Welcome Screen layout (not centered).

## 0.0.1-R5-b20

- Started working on the logic - as a side project: "OpenHealth".

> [!INFO]
> **What does that even mean?**
>
> See: Basically, the app needs to work with a lot of health data so that it can provide accurate statistics and tips to the end user, so the first idea would be to find a library or something that does provide functions for that stuff.
> However - I thought it would be a nice idea to try to make our own "health.js" library, and just like that! There's a new directory called `/code` for _the core of the app_, on which I started working and then decided to give it's own name, documentation, and stuff. This new library will allow PersonaPlus to turn all the frontend we've been working on since 2023 into actual, worthy data for users to understand themselves, their performance, and their health.

Quick note: OpenHealth will have **it's own changelog**, on `core/CHANGELOG.md`. It's mentioned here only this time, as this is the most important change of this update.

- Now `/WelcomeScreen` works! Users can register with basic info.
  - ~~Fixed the Welcome Screen layout; it is now centered.~~ _Nope._
  - Added form validation to `/WelcomeScreen` and placeholder options to arrays to avoid saving empty (`""`) strings.
    - ~~**Review required**: Need to add validation to the Android keyboard's submit button (✔ icon in keyboard).~~ _This was fixed in later commits._
  - User data is now saved! Basic data like height, age, and more.
    - Updated the "Clear all" button in the Dev Interface to match the new schema.
    - Data previously saved in `index.tsx` (`hasLaunched`, `objs`, and `useDevTools`) now gets saved here.
  - Changed the character limit for `height` and `weight` from 6 to 3.
  - Fixed multiple errors where clicking "Finish" redirected to the beginning instead of the home page.
- Now `Sessions` work! (more or less)
  - Fixed layout; it now looks (almost) as it should (not perfect, but usable).
  - Timer is correctly set up depending on the objective.
  - You can give up, skip, or mark as done (_known errors_).
  - You can pause by clicking either the pause button or the timer itself.
  - You can see details, like how many lifts you have to do or what speed you should run to.
  - Added a Help menu with a small text to explain what you should be doing.
- Now objective creation works great!
  - The layout looks much cleaner.
  - Successfully implemented extra properties for objectives, such as push-up amount, weight to lift, running speed, etc.
  - Overall improvements and additions, like tips.
- Made many updates to the `/Profile` page as well.
  - The `/Profile` page now displays all of the user's data.
  - Added an option to check for updates from GitHub releases.
  - Improved Dev Interface navigation flow.
  - Added an option to start over the app without needing to use the Dev Interface.
  - Made a huge cleanup in the source code.
  - Now instead of just changing your username, you can change all of your data in a dedicated page.
- Moved from Apache-2.0 to GPL-3.0-only (LICENSE).
- Made many changes to `DeveloperInterface` to attempt to fix it.
- Fixed `termLog` making content invisible for light mode users (it was just removing a styling directive).
- Corrected the types for the `termLog` function.
- Added a serif font face (Noto Serif).
- Added an "About" page (I took the freedom to write a lot\*, lol), a "License" page, and a "Credits" page. All contributors will see their name there, so go contribute! Just in case we get popular, you know.
- Updated DOCS and PRIVACY files.
- Added (for testing purposes) a GitHub form for issues.
- Renamed many functions and variables to make the code easier to read.
- Corrected some places setting the height to `100vw`.
- \*Rewrote many things to save screen space.
- Fixed text looking a bit "cut off" by adding small padding and slightly increasing line height.
- Removed the Dev Interface from the "bottom" (top) navigation.
- Removed some redundant comments.
- Fixed types, fixed the button layout, and added a new layout option (fixed).
- Updated the way random sentences for all objectives being completed work (and added many new sentences).
- Added active objective reminders - if you have daily objectives for today that you haven't done yet, you'll receive a few notifications with random messages reminding you to do your stuff.
- Added a few reminders that the app is currently an unfinished WIP.
- Added loading screens so the app looks cleaner (before you saw the placeholders for a few seconds, with a not-so-good looking "appear animation").
- Worth noting: Made some parts of the source code way cleaner, thanks to these loaders and other things like function merging and usage of `AsyncStorage.multiGet` or `AsyncStorage.clear`.

> [!NOTE]
>
> ### **FIXED ERRORS - b20**
>
> - Fixed WelcomeScreen redirecting to the beginning again instead of the homepage on submit.
>
> > - This was caused by different required items (like `hasLaunched`) not being created on time.
>
> - Fixed the ✔ button in the numeric keyboard on the Welcome Screen allowing the user to skip steps.
> - Fixed sessions crash when the user finishes early (clicks the ✔ button).
> - Fixed many visual errors
> - Fixed types
>
---
> [!NOTE]
>
> ### **KNOWN ERRORS - b20**
>
> - Wrong Welcome Screen layout (not centered).
> - Sessions work perfectly on Expo Go, but crash the production APK.

Note:

> [!WARNING]
> I finally got someone to test the app, and turns out most of the stuff doesn't even work. Working on it.

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
> ### **FIXED ERRORS - b17**
>
> `b11:` For some reason, sometimes the `exercise` prop from the objective's Object does not get stored on creation, giving it an empty name. **This was fixed by adding a placeholder invalid option, forcing the user to choose an option so `setExercise` gets called.**
> `b15`: For some reason, the `objs`' name is not being displayed on mobile devices on Expo Go. **Fixing the error above also fixed this.**
---
> [!NOTE]
>
> ### **KNOWN ERRORS - b17**
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
