COMO FUNCIONAN LAS VERSIONES // HOW DOES VERSIONING WORK:

Dividamos el desarrollo en dos fases, PRE-APP y POST-APP.

PRE-APP es donde estamos ahora, cuando las actualizaciones son a un código que todavía no está acabado (estamos en un punto en el que un APK sería inútil, la app no sirve). Cada versión / actualización durante esta fase sumará 1 a:
`0.0.1-R5-bX`.

Cuando la app llegue a un punto en el que es utilizable y se publique el primer APK (probablemente en GitHub Releases), se lanzará como "0.0.1-R5" sin más. A partir de ahí entramos en fase POST-APP:
- Versiones que arreglen bugs, errores, o mejoren el rendimiento, sin hacer cambios, sumarán 1 a 0.0.X-R5.
- Versiones con cambios, mejoras, o que hagan una diferencia en la app, sumarán a 0.X.0-R5.
- Cuando todas las funciones principales / básicas estén implementadas y testeadas, se pasará a la 1.0.0-R5.
- Si se está en X.X.9, pero se siguen lanzado actualizaciones que deberían sumar al 9, se añadirá una cifra (p ej. 0.0.91-R5).

- PD: Los logs serán en inglés, siempre.

# 0.0.1-R5-b7
- Added `position` attribute to Notis.
- Updated `/prof` (profile page) to the new, correct layout.
- Replaced `console.log` and `console.error` with Notis in `/prof`.
- Updated the documentation. While still unfinished, it's now in a state where it's usable as if it was.
- Added React's `StrictMode`.
- Organised some components and made the code a little cleaner.

# 0.0.1-R5-b6
- Fixed some errors
- Removed the custom `Input.tsx` component, will reuse proped default `Native.Input`.

# 0.0.1-R5-b5
- Changes to how `width`s and `height`s are passed to avoid VSC errors.

# 0.0.1-R5-b4
- Visual improvments
- Creation of Notification and Nomore component
- Some changes to error handling in `index.tsx` (replaced `console.error` with in-interface logs, will roll out to all files on next commit)

# 0.0.1-R5-b3
- Very small changes
- Created Welc.tsx for the welcome page and made some work
- Created Input element

# 0.0.1-R5-b2
- Changed the code style used for imports.
- AsyncStorage! + username, which is preserved in the AS. It can be edited aswell.

# 0.0.1-R5-b1
- Fix `Foot.tsx` (more or less).
- Started works with the Divisions.

# 0.0.1-R5
- Start over, with TypeScript this time.
- Barely anything achieved (it literally errors at `start`, lol). Will look onto that.

# 0.0.1-R4
**(This was a failed attempt, not all the listed changes were achieved)**
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

# PREVIOUS

Not loged.