<!-- markdownlint-disable-file MD024 -->
# PersonaPlus Changelog

All notable changes will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Dates use the DD-MM-YYYY format.

## [0.1.1] - Unreleased

### Changed

- Minor changes to UI texts.
- Minor visual tweaks.
- Improved dev viewers.

### Fixed

- Fixed the app randomly showing the welcome screen, forcing into a data reset. It did this upon any error with data handling.
- Fixed the app packaging unused fonts. That's not an error per se, but it took extra space and memory for nothing.
- Fixed objectives showing "No objectives for today" instead of "All done" when all objectives of a category were done.

## [0.1.0] - 17/04/2025

Switch from "PreAPP" to "ALPHA" state.

### Added

- Passive Objectives! Type anything you'd like to do daily and you'll be able to log your daily progress, seeing a nice streak number next to your goal and on your report tab.
- Added a toolkit page. It's meant to hold small tools for a _specific_ case where a _specific_ tool might come in handy. (A real example I had was having to manually calculate the avg speed I had by running with a timer).
  - For now it includes a speedometer and a "focus training" kind of timer.
  - Suggestions are obviously accepted.

### Changed

- We've settled on **green** for both the app's accent and branding. Until this update, the app mixed blue & green as two "accent colors", making the UI a bit _too_ colorful.
- Active Objectives now work the opposite way; they're now a stopwatch instead of a timer.
- Did some minor tweaks to improve the look of the app.

### Fixed

- Fixed the app being unable to launch external URLs.
- Fixed several translations.
- Fixed the home page showing objectives that were already done as if they needed to be done.
- Fixed the dashboard not updating the UI when an objective was deleted.
- Fixed Active Objectives not launching for whatever reason.
- Fixed results calculations not working because of a variable mismatch (asking for `identifier` instead of `id`).
- Fixed box-like buttons being slightly shorter and visually off compared to others.

### Removed

- `"walking"` exercise; it's essentially equivalent to `"running"`.
- Setting duration and rests for objectives. Duration is now determined by yourself - we replaced the timer with a stopwatch. Having you to predict how much it'd take you to do an exercise was certainly stupid, we've realized. This makes more sense and makes health calculations more accurate.
- (Just partially removed) Experiments. They're still present, but not in an Enable/Disable way. They've been simplified to a "Launch {x} page" approach. The classic concept of experiments is funnier, but not necessary and a bit of a waste of time.
- The ability to view developer logs from inside the app. They were _a bit_ useful, but not that much, and gave issues because of simultaneous DB writing, as well as creating overcomplicated code and taking up a lot of space - specially for unaware users.
- Showing `TDEE` in the report page. It wasn't really practical. This and other medical calculations will be added to the Toolkit tab in next updates.

## [0.0.6-preapp.29] - 26-01-2024

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

> For versions prior to 0.0.6 (quite many), see [the deprecated changelog](https://github.com/ZakahaceCosas/personaplus/blob/main/CHANGELOG.deprecated.md).
>
> P.S. Versions prior to 0.0.6 are not SemVer compliant and follow a different format.
