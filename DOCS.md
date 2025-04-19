# Developer Documentation

_Dale un PLUS a tu Persona_ <!-- fun fact, this is the OG slogan -->

![Banner](https://raw.githubusercontent.com/GiveItAPlus/personaplus/main/assets/design/PP_BANNER_DEV.webp)

<!-- these badges are useless but pretty :3 -->
<!--markdownlint-disable-next-line-->
<div align="center">

[![React Native](https://img.shields.io/badge/React-Native-57c4dc?style=for-the-badge&logo=react&logoColor=black&labelColor=white)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-000?style=for-the-badge&logo=expo&logoColor=black&labelColor=white)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-2d79c7?style=for-the-badge&logo=typescript&logoColor=2d79c7&labelColor=white)](https://www.npmjs.com/package/typescript)

</div>

## 1. Understanding PersonaPlus as a codebase

PersonaPlus is a simple app written in React Native, which - while I admit is not the best way to do it - is relatively easy and gets the job done. This brief section will give you a quick look at the project's structure, organization, etc...

### Understanding the file structure

It is a simple yet functional structure. While not mandatory, we recommend to use the `@/` `src/` import alias.

- `@/app/` is where each page lives. It starts with the main layout and a not-found page, while the _actual pages_ live in `app/(tabs)/`.
- `@/core/` is where the PersonaPlus Core lives. It's a "library" (to call it somehow) that provides all the medical calculations, functions, and other tools needed to turn our buttons and timers into meaningful data, stats, and more, for the user.
- `@/components/` is where, as the name implies, most components (mainly UI components) live. It contains:
  - `/interaction` for interactive elements like buttons, input fields, pickers, etc...
  - `/navigation` for navigation-related elements, like the navbar.
  - `/static` for static elements that never change nor interact, like the _footer_ or the "Loading..." screen.
  - `/text` contains text-related components.
  - `/ui` contains core components of the user interface, like **sections & divisions**, along side other elements like alerts, gap views, etc...
    - Sub-directories of the `/ui/sections/` path contain page-specific section / division generators; in other words, presets.
- `@/constants/` contains, as the name implies, constant values to be used across the app, like stored item names, colors, screen sizes, predefined styles...
- `@/toolkit/` is where we store our toolkits. Toolkits are single TS files that contain all functions related to a specific feature into a single file (a "toolkit"). Features that grow in complexity, e.g. user handling, debugging, etc... are highly recommended to be "toolkified". While not necessary, it is allowed to toolkify simple functions as well.
- And lastly, `@/types/` contains type definitions, `@/translations/` contains translation files, and `@/hooks/` contains React hooks.

### Understanding comments

We use certain keywords in comments, so it's easier to find problems when anyone wants to contribute to the project. You know we always tend to add stuff like "TODO" to our comments, right? Well, we don't only use TODO but also a few extra words:

```ts
// TODO - tasks, things to be done, unfinished code, requires review, etc...
// FIXME - code that is known to be broken and you rely on someone else to fix
// WATCHOUT - code that is not necessarily broken, but requires review
// NOTE - obviously, notes.
// FAILING - code that is not broken but is not passing tests for whatever reason
```

Thanks to _Better Comments_, one of our recommended extensions for this workspace, these keywords will make comments colored for a better experience.

### Understanding data saving

We use Expo's `expo-sqlite/kv-store` to store all of the user data. PersonaPlus has the following main AsyncStorage items as of now (names are the ones from `StoredItemNames`; a constant that exports all names of KV Store entries to avoid messing them up):

- `userData`: an **OBJECT** with all of the user data.

```jsonc
// example
{
    "username": "Zaka",
    "age": 34,
    // ...
}
```

- `activeObjectives` and `passiveObjectives`: each one is an **ARRAY** of **OBJECTS**, being each object an Active Objective or a Passive Objective.

```jsonc
// example (Active Objectives)
[
    {
        "exercise": "Running",
        "info": { /* ... */ },
        "specificData": { /* ... */ },
        "identifier": 8131221499
    },
    // ...
]
```

- `dailyLog` and `passiveDailyLog`: each one is an **OBJECT** full of **OBJECTS**, each one also having **OBJECTS**. It's an object packaging DAYS, each day packaging ENTRIES. It's better understood with the example:

```jsonc
// example

// an object
{
    // full of objects (days)
    "15/09/2024": {
        // each one having more objects (entries)
        "8131221499": {
            // being here the actual data of each entry
            "wasDone": true,
            "objective": { /* ... */ },
            "performance": 0 // only present in the Active Objective daily log
        },
        // ...
    },
    // ...
}
```

## 2. Understanding PersonaPlus as a project

You also should have an overall idea of how the app is really meant to work, so you have a better guide of how to help the project achieve it's goal of being the best healthcare app.

### The foundation - What does this exactly do?

Just as with code, sometimes it's a bit hard to get the purpose of a project. PersonaPlus currently has a [public version](https://github.com/GiveItAPlus/personaplus/releases/latest) with a few features here and there, but not a clear "purpose".

What I really want this app to be is an all in one replacement to three items: exercising, diet, and wellbeing apps. A single app that supports all needed features for taking care of yourself.

### Active and Passive Objectives

The app is intended to have two kinds of "objectives", Active Objectives and Passive Objectives.

_Active Objectives_ can be considered routines, while _Passive Objectives_ can be considered goals. An Active Objective is - in short - a physical activity routine. Think of it as the 1st item I told you about. Simple routines for doing exercise. They could be taken as a chore (AKA with a simple & straightforward "Done" button) or as something more serious with Sessions (as the name implies, live sessions where the phone turns into both a timer and an assistant for the user to accomplish that routine in the moment).

Passive Objectives, on the other side, are more like goals. Ever seen any of those tracking apps where each day you don't smoke you note that so a "score" is bumped and you feel better? Basically that.

> That's it as of now, other mentioned ideas aren't listed because there is no progress (YET) on their implementations.

## 3. Writing (cool) code

### Getting ready

You'll need `npm` (I personally prefer `pnpm` but it just doesn't work good enough with Expo...). Create a fork of this project, clone it locally, and run `npm install` from the root. After that, `npm run start` every time you want to test your changes.

> [!WARNING]
> **Please do not manually run `npm update` or any other command EXCEPT `npm run dep:check`.**
> Expo handles dependencies **by itself**, and it knows (probably better than both you and me) what versions of each package the project requires. Manual updates have proven to break stuff. We don't need the latest versions, we need versions that work!

As an extra, while not needed, it is highly recommended to use [Microsoft Visual Studio Code](https://code.visualstudio.com/) or [VS Codium](https://vscodium.com/) with the **[Expo Tools](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools)** extension. Additionally, `.vscode/extensions.json` includes other extensions we recommend you to have. They're optional, but will do a good job helping you work better with the project.

### The beginning of a file

Before your actual code, care to place this comment at the beginning.

```ts
/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: {LOCATION}
 * Basically: {DESCRIPTION}
 *
 * <=============================================================================>
 */
```

Being {LOCATION} the `@/absolute/path.ts` (with file extension) to that file, and {DESCRIPTION} a brief description of what the code of that file should do.

> [!TIP]
> If you're using VSCode, just type `beginFile` - it's a VSCode workspace code snippet you can quickly complete with the `TAB` key.

### Use the alias

Always import with `@/` and not with `./` or `../`, even if the file you need is in the same DIR as the one you're using.

### Prefer the homemade

Do not use `<Button />` or `<Pressable />` from React Native, use `<BetterButton />`. Don't use `<Picker />` from `@react-native-picker/picker`, use `<Select />`, and so on. Prefer homemade components, **and if you find yourself repeatedly using another component, consider making it into a homemade one.**

> For example, our `<Select />` is just a `<Picker />` with all configuration applied, to avoid code duplication.

### The order matters

Always follow the same order in TSX files:

**IMPORTS - TYPES - STYLES - FUNCTIONS - COMPONENT.**

Obviously imports go first, then (if any), add your interfaces, types, and more (make sure you _should_ make your typings inline and not in the `@/types` DIR), then (if any) the component's `StyleSheet`, then (if any), all your separate / extra _components_, and then the main component.

Functions like handlers, data fetching, or so, should go inside the main component function, while functions that return a JSX element should go outside (unless they depend on stuff you can only access from the inside, which shouldn't happen).

### Naming stuff

We encourage the usage of **camelCase** for most things, **PascalCase** for main / component functions, and **UNDERSCORED_UPPERCASE** for constants ("constants" refers to things that you export from `@/constants/`, not every `const` declaration).

> To clarify, a constant parent is cased with PascalCase. Kinda like this:
>
> `Constant.VALUE`, `Constant.VALUE.NESTED_VALUE`.

**❌ Do not:**

```ts
import { someConstant } from "@/constants/something.ts";

export default function mainComponent() {
    const my_variable = "something";

    const other_thing = `${my_variable} ${someConstant.otherThing}`;

    return other_thing;
}
```

**✅ Do:**

```ts
import { SomeConstant } from "@/constants/something.ts";

export default function MainComponent() {
    const myVariable = "something";

    const otherThing = `${myVariable} ${SomeConstant.OTHER_THING}`;

    return otherThing;
}
```

----

Favor full words in variable names, except when the word becomes excessively long. If a shorter, equally clear word exists, use that. When necessary, use more than one word, but aim for brevity without losing clarity.

**❌ Do not:**

```ts
const h = "Hello there.";
async function myAsynchronousFunction();
let test = true;
```

**✅ Do:**

```ts
const hello = "Hello there.";
async function myAsyncFunction();
let thisIsATest = true;
```

----

Make function names descriptive.

**❌ Do not:**

```ts
function ToDailyLog();
```

**✅ Do:**

```ts
function SaveActiveObjectiveToDailyLog();
```

----

While PascalCase or camelCase look pretty, avoid them for naming files. Use snake_case or kebab-case (we prefer snake) for file names, as some filesystems aren't case sensitive but others are and it ends up breaking this.

**❌ Do not:**

```ts
import { a } from "@/ModuleA.ts";
import { b } from "@/moduleB.ts";
```

**✅ Do:**

```ts
import { a } from "@/module_a.ts";
import { b } from "@/module-b.ts";
```

### Keeping code readable

Comment your functions so we know what they do. Use JSDoc.

**❌ Do not:**

```ts
// greets someone
function Greet(who: string /* who to greet*/): void {}

// neither do uncommented stuff

function Greet(who: string): void {}
```

**✅ Do:**

```ts
/**
 * Greets someone
 * @param {string} who Who to greet
 */
function Greet(who: string): void {
    console.log(`Hi, ${who}!`);
}
```

----

Annulate cases instead of nesting `if else` statements.

**❌ Do not:**

```ts
if (isAdmin) {
    if (password === user.password) {
        doAdminStuff();
    } else {
        throw "Wrong pass!";
    }
} else {
    return;
}
```

**✅ Do:**

```ts
if (!isAdmin) return;
if (password != user.password) throw "Wrong pass!";
doAdminStuff();
```

----

Where possible (and if it makes sense), use ternary operators instead of `if else` statements.

**❌ Do not:**

```ts
let isCool: string;

if (usesPersonaPlus) {
    isCool = "yes";
} else {
    isCool = "no :(";
}
```

**✅ Do:**

```ts
const isCool = usesPersonaPlus ? "yes" : "no :(";
```

### Other tips

Type everything exhaustively. Even basic types like `string` and `number` are _recommended_ - of course you don't need to waste your time with this, but preventing the TypeScript LSP from inferring so many times can slightly reduce editor launch time, so every type is acknowledge.

```ts
const text: string = "some text";
        /*  ^^^^^^ even basic types are encouraged to be explicit */
```

Use JSDoc as extensively as possible. If using a JSDoc generator extension (which we recommend), remove the `@typedef` prop if generated; it breaks stuff on VSCode.

**❌ Do not:**

```ts
export function Greet(who: string) {
    console.log(`Hi, ${who}!`);
}
```

**❌ Do not:**

```ts
/**
 * A human interface.
 *
 * @typedef <- do not add this!
 * @interface Human
 */
interface Human {
    name: string,
    age: number
}
```

**✅ Do:**

```ts
/**
 * Greets someone
 *
 * @param {string} who Who to greet
 * @returns {void} Greets them
 */
export function Greet(who: string): void {
    console.log(`Hi, ${who}!`);
}
```

```ts
/**
 * A human interface.
 *
 * @interface Human
 */
interface Human {
    /**
     * Their name
     * @type {string}
     */
    name: string,
    /**
     * Their age
     * @type {number}
     */
    age: number
}
```

----

## 4. Contributing your cool code in a cool way

Okay, so you did write some cool code, right? That's awesome! Now, here are a few guidelines for committing and submitting your cool code in a cool way.

### Organize your commits by topic

**Name your commits accordingly based on topic.** Okay, everyone has failed with that twice, even I. But try to name your commits in a simple & descriptive way. For that, we enforce the usage of labels or "categories" that describe your commit -- that's also helpful for knowing how to group your changes. You can combine labels.

> [!TIP]
> This repo uses the following labels:
>
> - `(fix)` for bug fixes
> - `(new)` for new features
> - `(better)` for enhancements to existing features
> - `(CL)` for updates to CoreLibrary
> - `(doc)` for changes to MarkDown files
> - `(dev)` for dev related changes
> - `(chore)` for chores (small tasks or maintenance work)
> - `(ui)` for visual changes

Here are some sample valid (and good) commits:

- `(ui) Remove unneeded spacing below Welcome screen headers`
- `(chore) Rename variables in User toolkit for consistency`
- `(ui) Update regular font size`
- `(dev) Update to Expo SDK 53`
- `(fix)(ui) Fix a bunch of typos`
- `(new)(CL) Add two new active objectives`

And that's it for now. Keep in mind these docs are subject to future expansions.
