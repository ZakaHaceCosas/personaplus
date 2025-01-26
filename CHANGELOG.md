<!-- markdownlint-disable-file MD024 -->
# PersonaPlus Changelog

All notable changes will be documented in this file.

The format is <!--mostly--> based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Dates use the DD-MM-YYYY format.

## Unreleased

### Added

- Report page! Includes the following:
  - Daily log, showing what you did and what you didn't do each day (from your objectives).
  - Basic health insights (currently BMI and TDEE, which translates into how healthy your weight is and a rough estimate of the daily caloric ingest you should take).

### Changed

- Made session's timer slightly bigger.
- Now the profile page shows "check for updates" before "about us".
- (Experiment:Tracker) Now the running tracker better resembles the sessions page.

### Fixed

- Fixed top being slightly cutoff on some displays.
- Fixed some minor issues with Dev Interface.

### Removed

- "Today" table in the home page. It's been replaced by the report page.
- License page, now only the small text is shown. For the larger one, a button to open the web is provided.

## [0.0.6-preapp.28] - 08-01-2025

### Added

- Added a question in the Welcome Screen to tell the app about medical conditions of the user.
- (Experiment:Tracker) Added the Session timer to the running tracker page.
- (Dev) A page to view scheduled notifications.

### Changed

- (Experiment:Report) Replace BMR with TDEE.

### Fixed

- Fixed some missing / wrong translations in the sessions page.
- Fixed pluralization of some texts.
- Fixed some edge cases where your performance after a session wouldn't get saved.
- (Experiment:Report) Fix the BMI traffic light.
- (_possibly_) Fixed "Disable notifications" button from settings working, but not reflecting the changes on screen.

## [0.0.6-preapp.27] - 25-12-2024

Merry Christmas btw

### Added

- Added the ability to edit an active objective.
- Added a view displaying your daily log from the report page. (Currently only available as an experiment).

### Changed

- Now all objectives display their duration in their division.
- Now the onboarding screen shows more clearly what's wrong when some data isn't alright.

### Fixed

- Fixed a performance issue in the homepage caused by notification validation looping itself.
- Fixed the app not correctly fetching the user's language in some cases.
- Fixed the app going into loading state again if you accidentally touched in the navbar the button to the tab you're currently on.
- Fixed some missing translations
- Fixed some responsiveness issues with the onboarding screen.
- Fixed the app not looking as it should on devices that still use 3-dot navigation.

## [0.0.6-preapp.26] - 07-12-2024

Keep in mind there have been many visual and functional changes due to the R6 rewrite. Some changes might not be logged.

### Added

- Now the Welcome Screen is more complete, errors have been fixed, it looks more beautiful, and now it asks you to specify your "daily check", a specific hour on which you'll be prompted daily to fill in a questionary about your day.
  - **Note: The actual Daily Check feature isn't yet available.**
- Added a Not found page for non-existing routes.
- More random, friendly messages :]
- Now you can tap the numbers at the active objective creation page to set a custom value.
- A settings page. Now most settings, and all new settings, have been moved from the profile tab to there.
- Added the option to opt-out from reminder notifications.
- Added a new "Experiments" feature, allowing you to enable experiments, like:
  - A Report page for you to view insights on your results
    - For now it's limited to showing results of basic CoreLibrary, BMI and BMR. Soon to be expanded with more data + insights on active objective progress.
  - An actual movement tracker for running sessions (will be added to walking as well, when it's stabilized).
- New info for Dev Interface to display, like device details, a table with all active objectives and their ID, and even two new separate pages to view logs in a better way.

### Changed

- Gave the app a visual refresh. Many things have changed, they look better, feel and interact better, etc...
- Changed many in-app texts.
- Now, in the active objective creation page, days of the week are shown in a row instead of a column, saving up on space.
- Now the credits page also showcases highlighted contributors.
- Now active objectives & your profile page use icons instead of text based descriptions to represent properties.
- Now the credits page also shows important GitHub contributors :].

### Fixed

- **Fixed** some content lacking translations.
- **Fixed** the app erroneously considering the onboarding form as completed even if it wasn't. Previously, if the app was left without submission and relaunched, it would load without the data, calling the user "Unknown".
- **Fixed** Dev Interface showing "[object Object]" instead of the relevant data.
- **Fixed** the app registering multiple times for reminder notifications, causing unwanted reminders.
- **Fixed** buttons having inconsistent heights.
- **Fixed** swap components having their order disrupted.
- **Fixed** buttons intended to navigate back failing when there's no history.
- **Fixed** the app being unable to scroll on some devices.
- **Fixed** the app crashing at the end of a session.
- **Fixed** the home page showing "all objectives done" even tho there are some objectives not done.
- **Fixed** issues with notification scheduling.
- **Fixed** Dev Interface sometimes rendering text in a wrong way.
- **Fixed** the results page not properly showing burnt calories sometimes.
- **Fixed** the update profile feature removing all user data that wasn't in the form.

### Removed

- "Mark as done" and the tick icon to early mark as done a live session - now the app won't offer the ability to just mark a session as done. You _will_ have to actually get of your chair and do staff for the app to note your progress.
- Repetitions. As the app currently supports nothing but sessions of a single, long-paced exercise, it doesn't really make sense to have "repetitions" in sessions.

### Known issues <!-- not part of the Keep A Changelog standard -->

- First time launching the app doesn't properly handle missing user data, crashes. **Relaunch the app to fix.**

---

> For versions prior to 0.0.6, see [the deprecated changelog](CHANGELOG.deprecated.md).
>
> P.S. Versions prior to 0.0.6 are not SemVer compliant and follow a different format.
