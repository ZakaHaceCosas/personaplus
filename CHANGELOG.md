# PersonaPlus CHANGELOG
<!--
P.S.: Changelog is managed by the owner only, thanks. One task less for you!
-->

All notable changes will be documented in this file.

The format is <!--mostly--> based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> [!NOTE]
> For changes related to development, see [CHANGELOG_DEV.md](CHANGELOG_DEV.md).

## [0.0.26-preapp.6] - Unreleased

There've been A LOT of changes. I'll take my time to view the `diff` and update this when the rewrite is done. For now, this is outdated.

### Added

- Now the Welcome Screen asks you to specify your "daily check", a specific hour on which you'll be prompted daily to fill in a questionary about your day. `NOTE: THE ACTUAL DAILY CHECK FEATURE IS NOT AVAILABLE YET`.
- Added a Report page for you to view insights on your results
  - For now it's limited to showing results of basic CoreLibrary, BMI and BMR. Soon to be expanded with more data + insights on active objective progress.
- Added a Not found page for non-existing routes.
- More random, friendly messages :]
- New info for Dev Interface to display, like device details, a table with all active objectives and their ID, and even two new separate pages to view logs in a better way.

### Changed

- Gave the app a visual refresh. While it's not a redesign, many things have changed, they look better, feel and interact better, etc...
- Changed many in-app texts.
- Now you can tap the numbers at the active objective creation page to set a custom value.
- Now, in the active objective creation page, days of the week are shown in a row instead of a column, saving up on space.

### Removed

- "Mark as done" - now the app won't offer the ability to just mark a session as done. You _will_ have to actually get of your chair for the app to note your progress.
- Reminder notifications. They will be added back when the app gets to a more stable point, as notifications have been a little bit of a headache to be honest.

### Fixed

- **Fixed** some content lacking translations.
- **Fixed** the app erroneously considering the onboarding form as completed even if it wasn't. Previously, if the app was left without submission and relaunched, it would load without the data, treating the user as "Unknown".
- **Fixed** Dev Interface showing "[object Object]" instead of the relevant data.
- ~~Fixed the app registering multiple times for reminder notifications, causing unwanted reminders.~~
- **Fixed** buttons having inconsistent heights.
- **Fixed** swap components having their order disrupted.
- **Fixed** buttons intended to navigate back failing when there's no history.
- (WIP, SEE R5 ISSUES) **Fixed** the app being unable to scroll on some devices.
- (WIP, SEE R5 ISSUES) **Fixed** the app crashing at the end of a session.

### Known issues <!-- not part of the Keep A Changelog standard -->

- Active objective creation page's input fields have turned not precise, and tend to fail, especially with the new tap to edit feature.

### R5 ISSUES

> This is not part of the Keep A Changelog standard and will only be present during development of the R6 rewrite. It's essentially the same as [the tracking issue](https://github.com/ZakaHaceCosas/personaplus/issues/3) but in english.

These errors come from the R5 version. They _should_ be already fixed, but haven't been tested (otherwise it will be specified).

- EAS build refusing to work.
- The app not allowing the user to scroll on some (modern) Android devices.
  - (my old Xiaomi never had that error, but friends of mine testing the app did have it)
- (FIXED) Home page showing "all objectives done" even tho there are some objectives not done.
- Random crashes of the app

> For versions prior to 0.0.26, see [the deprecated changelog](CHANGELOG.deprecated.md).
> P.S. Versions prior to 0.0.26 are not SemVer compliant and follow a different format.
