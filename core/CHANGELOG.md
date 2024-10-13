# Changelog

## 0.1.0

- **Renamed from OpenHealthJS to CoreLibrary.**

> [!INFO]
> The idea of "OpenHealth" as a standalone library is being left behind. It will be renamed to "CoreLibrary" (`CoreLibrary.physicalHealth.something()`) and will be developed and maintained only inside of the PersonaPlus scope.
>
> This is because of how complicated it would be to develop an entire library. Plus, it would require a lot of code we would probably not use, and it would require a structure that's made for general usage instead of something designed specifically for this project.
>
> I still like the idea of a standalone library, but if that happens it will be a completely separate project _borrowing_ code from here. Until then, CoreLibrary is nothing else than an internal library.

- Updated documentation and some comments to fix typos.
- Simplified typing at entry point using an alias thingy.
- Update functions to match new data types (like new `dumbbellWeight`).
- Remove walking as an exercise. "Running" will supply that instead.
- Fix some outdated JSDocs comments.

## 0.0.3

- (WIP) Replace having an interface for each function with a generic `OpenHealthResponse`.
- Replace duplicate code with a "constructor" function for `getSource` and `getLastUpdate`.
- Update `physicalHealth` / `Body Mass Index`, added support for under 20 years of age calculations.
- Some work around with DOCS and READMEs.
- Replace `./` routing with `@/` for imports.
- Add a simple `package.json`.

## 0.0.2

- Removed `docs/`. It was planned to be given a usage, but that will be postponed.
- Fix `provideContext` and `provideExplanation` texts where required.
- Implement push ups performance calculation.

## 0.0.1

- Initial commits
  - Created functions for:
    - BMR
    - BFP
    - BMI
    - IDW
    - TDEE
    - MET
  - Also created functions to calculate the basic performance of a running session (one of the built in objectives PersonaPlus will ship with).
  - Made the README and basic stuff.
