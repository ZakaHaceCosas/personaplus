# Contributing to PersonaPlus

First thing first - thanks for collaborating!

Every kind of contribution is valued and taken into account. Here you'll find some guidelines to effectively contribute the project. We're hoping to see what you'll make 🎉!

> [!TIP]
> Psst... If you don't have time to contribute or you simply don't know how to code, no problem! There are other ways to show appreciation and help to the project you would make us happy by:
>
> - Star us on GitHub
> - Share with your friends
> - Try out the app and report any bug / issue you find

---

> [!NOTE]
> Please ensure to follow the [Code of Conduct](https://github.com/GiveItAPlus/personaplus/blob/main/CODE_OF_CONDUCT.md) at all time.

## Reporting issues

If you find an error, please [open up an issue](https://github.com/GiveItAPlus/personaplus/issues) on GitHub. Make sure to include:

- A clear description of the error.
- Steps to reproduce (find) the error.
- If possible, screenshots of the error, and debug logs if running from Expo Go.
- Environment info (app version, phone and OS details, ...).

> [!WARNING]
> **If it's a** _**security**_ **issue what we're talking about, DO NOT make a public issue, report it privately instead**. See [SECURITY.md](https://github.com/GiveItAPlus/personaplus/blob/main/SECURITY.md) for more info. **Thank you.**

## Suggestions

If you got an idea for a new feature or an enhancement, open up an [issue](https://github.com/GiveItAPlus/personaplus/issues) and describe:

- The reason for your suggestion (what does it improve / add?).
- The suggestion itself.
- If possible, any example or reference that helps understanding better your suggestion.

## Contributing with code

### 0. Make a fork

Open [https://github.com/GiveItAPlus/personaplus/fork](https://github.com/GiveItAPlus/personaplus/fork) and create your fork.

### 1. Clone it

On your local PC, run:

```bash
git clone https://github.com/YOUR_USER/YOUR_FORK.git
```

with your fork's real git URL. Then open the folder.

### 2. Ensure you're on the right branch

```bash
git branch
```

It should show `main` marked with an asterisk.

```bash
* main
  (other branches we don't care about)
```

If the asterisk _is not in `main`_, change to the main branch:

```bash
git checkout main
```

### 3. Install deps

You'll require of NodeJS and NPM for that. Please use `npm`.

```bash
npm install
```

### 4. Launch the dev server

```bash
npm run start
```

¡Aparcado! Now **open the Expo Go app in your Android phone** (you can get it from Google Play) and you should see PersonaPlus in the list of servers. Open it and you're ready to code! Start making changes and the app will live-refresh. Ensure to follow our [coding conventions (the docs)](https://github.com/ZakaHaceCosas/personaplus/blob/main/DOCS.md).

[![Runs with Expo Go](https://img.shields.io/badge/Runs_with_Expo_Go-SDK_52-000.svg?style=for-the-badge&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://expo.dev/go)

Test your changes before committing. Once everything's done, make a commit following our commit conventions.

```bash
git commit -m "(page:Results)(new) Show min, max, and average heart rate." # for example
```

Also, add your changes to the [CHANGELOG.md](https://github.com/ZakaHaceCosas/personaplus/blob/main/CHANGELOG.md) file.

### 5. Push your changes

Push your changes to your fork.

```bash
git push
```

Now make a pull request to PersonaPlus and you're done! Thank you :smile:

## Communicating

Join [our Discord server](https://discord.gg/wwzddK4Zpc) for discussions & sneak peeks onto the app.

## License

By contributing to PersonaPlus, you accept your contributions are licensed under the GPL-3.0 license, and you accept all the implications of that.

**Thank you for your time and effort to make PersonaPlus a better app for everyone!**
