# PersonaPlus CoreLibrary

> También disponible en [Español (Spanish)](https://github.com/GiveItAPlus/personaplus/blob/main/core/README.es.md)

The PersonaPlus CoreLibrary (formerly "_OpenHealth_") is, as the name implies, the core of the app - a "library" of TS code designed to make health related calculations and to provide detailed insights about various aspects related to personal health & wellbeing. From calculation of different indexes to detailed explanations of medical terms, CoreLibrary is designed to be a versatile, educational, useful, and open tool.

> [!NOTE]
> All functions must (and will) provide a `getSources()` function to get all the URL's from the sources used to obtain the data, formulas, and data calculations.

## Usage

```tsx
// 1. make the import
import CoreLibrary from "@core/CoreLibrary.ts";

// 2. you'll see everything grouped depending on the health aspect each thing belongs to
CoreLibrary.physicalHealth;
CoreLibrary.performance;
// etc...

// 3. all functions have descriptive names, so its easy for you to find what you want
// just provide them with the data needed, and you're done!
let bmi = CoreLibrary.physicalHealth.BodyMassIndex.calculate(
    30,
    "male",
    170,
    40,
    true,
    true,
);

// check DOCS.md for a full manual on each function
```

## Documentation

Learn [here](DOCS.md) to use CoreLibrary.

## Contribution

We're really thankful for all possible contributions, in fact they are needed due to the huge amount of aspects of health that need to be covered. Feel free to fork this repo whenever you want, and make any contribution, whether it's a big or small one.

**The only thing we ask you for is that if you alter, add, modify, or remove any info, formula, or medical definition, please add, even if it's just a comment, a reference to any trustable source you based yourself on to make the said change(s).** Changes that are made "because yes" or without a valid explanation cannot be accepted. Health requires accuracy.

---

Made with love by ZakaHaceCosas, creator or PersonaPlus :]

Take care!
