# PersonaPlus CHANGELOG
<!--
P.S.: Changelog is managed by the owner only, thanks. One task less for you!
-->

All notable changes will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)[^1],
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For changes related to development, see [CHANGELOG_DEV.md](CHANGELOG_DEV.md).

## 0.0.6-preapp.1 - 24th August 2024

### Fixed

- **Fixed** some content lacking translations.
- **Fixed** the app erroneously considering the Welcome form as completed even if it wasn't. Previously, if the app was left without submission and relaunched, it would load without the data, treating the user as "Unknown".
- **Fixed** Dev Interface showing "[object Object]" instead of the relevant data.
- **Fixed** the app registering multiple times for reminder notifications, causing unwanted reminders. (_Requires testing_)
- **Fixed** buttons having inconsistent heights.
- **Fixed** swap components having their order disrupted.
- **Fixed** buttons intended to navigate back failing when there's no history.
- **Fixed** the app being unable to scroll on some devices.

> For versions prior to 0.0.6, see [the deprecated changelog](CHANGELOG.deprecated.md).
> P.S. Versions prior to 0.0.6 are not SemVer compliant and follow a different format.
