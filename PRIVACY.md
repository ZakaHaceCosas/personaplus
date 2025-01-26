# PersonaPlus Privacy Policy

> [!WARNING]
> **As a NON FINISHED app, this is subject to changes. It's just a draft.**

## Data Collection

- What we **do not** collet: PersonaPlus does not collect any personal information from the user that allows to identify him or than can be directly associated to him. No real name, e-mail address, or any other kind of personal data from the user is collected.
- What we **do** collect: PersonaPlus stores basic data, such as age, gender, and username. Your username does not need to be an authentic name and is not checked to be real. Age and gender _should_ be correct (and we encourage you to provide accurate values), but we do not intrude on your privacy to validate their veracity. We also collect health data, in two ways:
  - **User provided health information:** PersonaPlus does ask for health way, in a fully anonymous way. This includes but is not limited to: age, gender, weight, height, estimate hours of sleep[^1], estimate activeness level of the user, among others.
  - **App generated health data:** Via an internal library (CoreLibrary, or "CL"), PersonaPlus can use user provided data to generate additional data based on standardized medical calculations, calculations designed by us, or by measuring your way of using the app in certain ways. For example, we may measure the amount of time you spent one week on an Active Objective like "Running", together with the data you provided to us (like your gender or your weight) to estimate[^2] the amount of calories you've burnt that week[^2]. Some examples of calculations the app makes are:
    - Your ideal body weight (IBW).
    - The percentage of fat in your body (BFP).
    - The estimate of calories you burn in a daily basis (BMR).
    - Among others. We keep adding additional calculations to the CL as needed.
  - You are always shown the results of all calculations and they're never shown to anyone. Please note their accuracy is not a guarantee[^2].
- **Usage data:** PersonaPlus does not compile technical usage data, diagnostics, telemetry, whatsoever. We do collect basic data onto your usage of the app, but it's only stored locally and you can see it and/or wipe it at any time.

## Data collection methods

- **User:** We can obtain data directly from you by asking you to provide it in various ways; for example the onboarding form you're required to submit before being able to use the app.
- **Deduction / Internal collection:** As previously mentioned, we may use provided data to perform medical calculations[^2] and generate additional data from you.

### How we process and use your data

- **Local-only processing:** Your info is stored uniquely and exclusively on your own device. An SQLite database (provided by React Native package `expo-sqlite/kv-store`) is used for storing all of your data. You can read most of this content from Profile -> Settings -> Dev Interface.
  - We never store your data in any 1st or 3rd party cloud service[^3]. We never store your data anywhere that isn't your device.
- **Usage:** We only use your data for the purposes stated before: functionality and personality purposes. We do not use your data in any way that's not specified in here. If an update to the app changes the way we process your data, an in-app alert will notify you about this change.
  - **Third parties:** PersonaPlus never shares, sells, or exchanges ANY piece of your data with any third party, ever. No third party services are used for data processing.

[^1]: Estimate sleep hours are asked to the user, the app does not have any sleep tracking feature as of now.

[^2]: "Medical calculations" provided by this app include (but aren't limited to) BMI, BMR, or IBW, among others, that provide estimates about user related health aspects. This app SHALL NEVER BE CONSIDERED UNDER ANY CIRCUMSTANCE as a substitute to the medical info provided by your medic, or by any other source of prover reliability. In case of a discrepancy between our advice and that of a trusted source, such as your doctor, always prioritize their guidance over ours.

[^3]: **PersonaPlus will never INTENTIONALLY share your data with third parties.** However, things like backups made by your Android phone on Google Drive, unauthorized access to your device's system files, 3rd party backup services, and so on, are outside of the scope of what we can control. We do our best to keep your data private, but be aware of what apps are accessing what on your device, and what are you backing up and where.
