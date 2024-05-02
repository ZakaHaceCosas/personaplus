COMO FUNCIONAN LAS VERSIONES // HOW DOES VERSIONING WORK:

Dividamos el desarrollo en dos fases, PRE-APP y POST-APP.

PRE-APP es donde estamos ahora, cuando las actualizaciones son a un código que todavía no está acabado (estamos en un punto en el que un APK sería inútil, la app no sirve). Cada versión / actualización durante esta fase sumará 1 a:
`0.0.1-R5-bX`.

Cuando la app llegue a un punto en el que es utilizable y se publique el primer APK (probablemente en GitHub Releases), se lanzará como "0.0.1-R5" sin más. A partir de ahí entramos en fase POST-APP:
- Versiones que arreglen bugs, errores, o mejoren el rendimiento, sin hacer cambios, sumarán 1 a 0.0.X-R5.
- Versiones con cambios, mejoras, o que hagan una diferencia en la app, sumarán a 0.X.0-R5.
- Cuando todas las funciones principales / básicas estén implementadas y testeadas, se pasará a la 1.0.0-R5.
- Si se está en X.X.9, pero se siguen lanzado actualizaciones que deberían sumar al 9, se añadirá una cifra (p ej. 0.0.91-R5).

# 0.0.1-R5-b1
- Fix `Foot.tsx` (more or less)
- Started works with the Divisions

# 0.0.1-R5
- Start over, with TypeScript this time.
- Barely anything achieved (it literally errors at `start`, lol). Will look onto that.

# 0.0.1-R4
(This was a failed attempt, not all the listed changes were achieved)
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