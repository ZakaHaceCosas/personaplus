# PersonaPlus CHANGELOG
<!--
P.S.: Changelog is managed by the owner only, thanks. One task less for you!

TODO: ensure all WIPs are handled before public release
-->

All notable changes will be documented in this file.

The format is <!--mostly--> based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> [!NOTE]
> For changes related to development, see [CHANGELOG_DEV.md](CHANGELOG_DEV.md).

## [0.0.26-preapp.6] - Unreleased

### Added

- Now the Welcome Screen asks you to specify your "think hour", a specific hour on which you'll be prompted daily to fill in a questionary about your day.
<!-- - Added a Not found page for non-existing routes. (WILL UNCOMMENT WHEN THAT PAGE HAS ACTUAL CONTENT) -->

### Changed

- Gave the app a visual refresh. While it's not a full redesign, many things have changed, they look better, feel and interact better, etc...
- Changed many in-app texts.
- (WIP) Now you can tap the numbers at the active objective creation page to set a custom value.
- Now, in the active objective creation page, days of the week are shown in a row instead of a column, saving up on space.
- Now, Dev Interface shows more info, like device details, a table with all active objectives and their ID, and a separate page to view logs in a better way.

### Fixed

- **Fixed** some content lacking translations.
- **Fixed** the app erroneously considering the onboarding form as completed even if it wasn't. Previously, if the app was left without submission and relaunched, it would load without the data, treating the user as "Unknown".
- **Fixed** Dev Interface showing "[object Object]" instead of the relevant data.
- (WIP) Fixed the app registering multiple times for reminder notifications, causing unwanted reminders. (_Requires testing_)
- **Fixed** buttons having inconsistent heights.
- **Fixed** swap components having their order disrupted.
- **Fixed** buttons intended to navigate back failing when there's no history.
- **Fixed** the app being unable to scroll on some devices.

## Known errors <!-- not part of the Keep A Changelog standard -->

- (WIP) Active objective creation page's input fields have turned not precise, and tend to fail.

> For versions prior to 0.0.6, see [the deprecated changelog](CHANGELOG.deprecated.md).
> P.S. Versions prior to 0.0.6 are not SemVer compliant and follow a different format.
