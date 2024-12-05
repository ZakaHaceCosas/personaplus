# PersonaPlus Developer Changelog

All changes related to the app's development (codebase and others) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For changes related to app itself, see [CHANGELOG.md](CHANGELOG.md).

## [0.0.6-preapp.26] - Unreleased

There've been A LOT of changes. The rewrite is overwhelmingly big and detailed logs are hard to provide. Next versions will much better log changes.

### Added

- Constants: Repeated values, like heights of certain components, font names, font sizes, even the names of the `AsyncStorage` items, and more, have been moved to a `@/constants/` directory with multiple exports.
  - `Colors.ts` = the app's color palette.
  - `FontSizes.ts` = reusable font sizes, for visual consistency.
  - `Routes.ts` = all routes the user can navigate to.
  - `Screen.ts` = width and height of the screen (with some required calculations done by default).
  - `StoredItemNames.ts` = names of AsyncStorage entries.
- Tracebacks: Now logs can be optionally passed a "traceback" object, including some meaningful data about where the log is actually happening, to help with debugging - specially with repeated messages across different places like "Error fetching objectives".
- Experiments: So users can try out features early.
- New components:
  - BetterButton (an iteration of buttons).
  - Select (a preconfigured `<Picker />`). Based on `react-native-picker`.
  - BetterInputField (a preconfigured `TextInput`).
  - BetterAlert (an iteration of notifications).
  - IslandDivision (for floating divisions).
  - TopBar (to avoid duplicating the top bar which is always the same in all pages).
- New toolkit elements:
  - Routing toolkit (to safely work around with app routing).
  - Time (to better handle daily hours).
  - Key Generator (to generate `key` attributes with very low chances of being duplicate).
  - Experiments toolkit (for the newly added experiments).
  - Android (to remove the `if (Platform.OS === "android")` boilerplate).
- Separate log views and error views to Dev Interface, alongside displaying device data, raw JSON data from the app, and more.
- Usage of Prettier within the codebase.

### Changed

- Fully reorganized the project onto a better, easier to understand file structure.
- Most components went under revision and refactoring. Some were entirely rebuilt, others were just changed, more or less. But most components have undergone changes.
- Improved JSDoc for many functions.
- Renamed many functions and components.
- Changed the versioning and changelog system to comply with the SemVer and Keep A Changelog specs.

### Removed

- The idea of "OpenHealth" as a standalone library. It will be renamed to "CoreLibrary" (`CoreLibrary.physicalHealth.something()`) and will be developed and maintained only inside of the PersonaPlus scope.
- Background fetching for Active Objectives. Fetching will happen each time an objective is marked as done instead, so reminder notifications get cancelled more efficiently.
- Removed some debug `logToConsole` calls that were no longer needed.

### Fixed

- Welcome screen
  - Saving values the wrong way, using the display sentence (e.g. "Not too active...") instead of a `"poor" | "small" | ...` value.
