# PersonaPlus Changelog

All notable changes will be documented in this file.

The format is <!--mostly--> based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> [!NOTE]
> For changes related to development, see [CHANGELOG_DEV.md](CHANGELOG_DEV.md).

## [0.0.6-preapp.26] - Unreleased

Keep in mind there have been many visual and functional changes due to the R6 rewrite. Some changes might not be logged.

### Added

- Now the Welcome Screen is more complete, errors have been fixed, it looks more beautiful, and now it asks you to specify your "daily check", a specific hour on which you'll be prompted daily to fill in a questionary about your day.
  - **NOTE: THE ACTUAL DAILY CHECK FEATURE IS NOT AVAILABLE YET.**
- Added a Not found page for non-existing routes.
- More random, friendly messages :]
- Now you can tap the numbers at the active objective creation page to set a custom value.
- A settings page. Now most settings, and all new settings, have been moved from the profile tab to there.
- Added a new "Experiments" feature, allowing you to enable experiments, like:
  - A Report page for you to view insights on your results
    - For now it's limited to showing results of basic CoreLibrary, BMI and BMR. Soon to be expanded with more data + insights on active objective progress.
  - An actual movement tracker for running sessions (will be added to walking as well, when it's stabilized).
- New info for Dev Interface to display, like device details, a table with all active objectives and their ID, and even two new separate pages to view logs in a better way.

### Changed

- Gave the app a visual refresh. While it's not a redesign, many things have changed, they look better, feel and interact better, etc...
- Changed many in-app texts.
- Now, in the active objective creation page, days of the week are shown in a row instead of a column, saving up on space.
- Now the credits page also showcases highlighted contributors.
- Now active objectives & your profile page use icons instead of text based descriptions to represent properties.

### Removed temporarily

- Reminder notifications. They will be added back when the app gets to a more stable point, as notifications have been a little bit of a headache to be honest.

### Removed permanently

- "Mark as done" - now the app won't offer the ability to just mark a session as done. You _will_ have to actually get of your chair for the app to note your progress.
- Repetitions. As the app currently supports nothing but sessions of a single, long-paced exercise, it doesn't really make sense to have "repetitions".

### Fixed

- **Fixed** some content lacking translations.
- **Fixed** the app erroneously considering the onboarding form as completed even if it wasn't. Previously, if the app was left without submission and relaunched, it would load without the data, treating the user as "Unknown".
- **Fixed** Dev Interface showing "[object Object]" instead of the relevant data.
<!-- - ~~Fixed the app registering multiple times for reminder notifications, causing unwanted reminders.~~ ("Fixed" by removal of the feature. Will be re-added.) -->
- **Fixed** buttons having inconsistent heights.
- **Fixed** swap components having their order disrupted.
- **Fixed** buttons intended to navigate back failing when there's no history.
- (WIP, SEE R5 ISSUES) **Fixed** the app being unable to scroll on some devices.
- **Fixed** the app crashing at the end of a session.
- **Fixed** the home page showing "all objectives done" even tho there are some objectives not done.

### Known issues <!-- not part of the Keep A Changelog standard -->

- First time launching the app doesn't properly handle missing user data, crashes. (SHOULD BE FIXED, NEED TO TEST)
- Splash screen looks extremely small. (SHOULD BE FIXED, NEED TO TEST)
- Create page shows "Text strings must be rendered inside a `<Text />` tag" error. I haven't found any text outside BetterText tags, so investigation is required. Doesn't crash the app, though.

### R5 ISSUES

> This is not part of the Keep A Changelog standard and will only be present during development of the R6 rewrite. It's essentially the same as [the tracking issue](https://github.com/ZakaHaceCosas/personaplus/issues/3) but in english.

These errors come from the R5 version. They _should_ be already fixed, but haven't been tested (otherwise it will be specified).

- The app not allowing the user to scroll on some (modern) Android devices.
  - (my old Xiaomi never had that error, but friends of mine testing the app did have it)

---

> For versions prior to 0.0.6, see [the deprecated changelog](CHANGELOG.deprecated.md).
> P.S. Versions prior to 0.0.6 are not SemVer compliant and follow a different format.
