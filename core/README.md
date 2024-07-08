# OpenHealthJS

> También disponible en [Español (Spanish)](README.es.md)

OpenHealthJS (or simply _OpenHealth_) is a JS library designed to make health realted calculations and to provide detailed info about various aspects related to personal wellbeing. From calculation of different indexes to detailed explanations of medical terms, OpenHealth is designed to be a versatile, educational, useful, and open tool.

It is part of the **PersonaPlus** project (in fact, at the moment they share GitHub repository).

> [!NOTE]
> All functions must (and will) provide a `getSource` function to get all the URL's from the sources used to obtain the data, formulas, and data calculations.
> For content / text based files, there should be a comment at the top.

## Usage

> [!TIP]
> For a full guide onto how to use OpenHealth within PersonaPlus, check [USAGE.md](USAGE.md).

```tsx
// 1. make the global import
import OpenHealth from "@core/openhealth"

// 2. youll see everything grouped depending on the health aspect each thing belongs to
OpenHealth.physicalHealth
OpenHealth.mentalHealth
OpenHealth.performance
// etc...

// 3. all functions do have descriptive names, so it'll be easy for you to find what you want
let bmi = OpenHealth.physicalHealth.BodyMassIndex.calculate(30, "male", 170, 40, true, true)

// provide them with the data needed, and youre done!
// check DOCS.md for a full manual on each function
```

## Documentation

Learn [aquí](DOCS.md) to use OpenHealth.

## Contribution

We're really thankfull for all possible contributions, in fact they are needed due to the huge amount of aspects of health that need to be covered. Feel free to fork this repo whenever you want, and make any contribution, wether it's a big or small one.

**The only thing we ask you for is that if you alter, add, modify, or remove any info, formula, or medical definition, please add, even if it's just a comment, a reference to any trustable source you based yourself on to make the said change(s).** Changes that are made "because yes" or without a valid explanation cannot be accepted. Health requires accuracy.

## License

Just as PersonaPlus, OpenHealth is licensed under **GPL-3.0**.
It's totally free to make usage of OpenHealth, even if it is for commercial purposes, as long as you credit the original project (OpenHealth). _Plus, we recommend you to cite aswell the sources of medical information used by the functions you use, remember you can get them with `getSource()`._

Made with love by ZakaHaceCosas, creator or PersonaPlus :]
Take care!
