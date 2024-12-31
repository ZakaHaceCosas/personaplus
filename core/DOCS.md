# CoreLibrary documentation

> [!CAUTION]
> This is absolutely outdated, CoreLibrary has undergone some big refactoring and I am a bit lazy to take care of this right now. I'll do it shortly after merging the R6 rewrite.

---

> [!TIP]
> También disponible en [Español (Spanish)](DOCS.es.md)

## First thing first: categories

The entry point of the library is `CoreLibrary` (`@/core/CoreLibrary.ts`).

```tsx
import CoreLibrary from "@/core/CoreLibrary";
```

From there, you have different categories to access functions, like the following:

```tsx
CoreLibrary.physicalHealth // physical health related features
CoreLibrary.performance // performance measuring related features
...
```

Currently, these are all the categories available:

| CATEGORY         | EXPLANATION                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| `physicalHealth` | Physical health related functions and calculations.                         |
| `performance`    | Sport & activity performance related functions and calculations.            |
| `mentalHealth`   | **(Not yet implemented)** Mental health related functions and calculations. |

## Now, how do functions work?

Each function is different, but they all follow a standard:

```tsx
CoreLibrary.physicalHealth.BodyMassIndex.calculate({ params });
CoreLibrary.physicalHealth.BodyMassIndex.getSources();
CoreLibrary.physicalHealth.BodyMassIndex.getLastUpdated();
```

**`Calculate`** is the most important thing, where you pass all the arguments required by the calculation function to work. It can ask for data like the weight, height, age, or gender of the subject, among others.

> [!NOTE]
>
> ### _**This library is american't.**_
>
> We adhere to the international system and do not support the imperial system, nor do we have intentions to implement it. Thank you for your understanding!

## What should I expect as a return?

Calculation functions always follow the same structure for returns. Basically, an average CL response looks like this:

```tsx
interface CoreLibraryResponse {
    result: number;
    alternate?: number; // (this is usually not provided)
    context: string;
    explanation: string;
}
```

`result` is the result of the calculation itself you've just done.

`context` gives a small context (sometimes just a word) about how the result should be interpreted. E.g., in the BMI (Body Mass Index) function, `context` would a string saying if the result value does represent "healthy weight", "underweight", "obesity", and so on.

`explanation` gives a small explanation of what the calculation means. For example, in the BMI function it returns the following:

```tsx
"(According to CDC) Body mass index (BMI) is a person's weight in kilograms divided by the square of height in meters. BMI is an inexpensive and easy screening method for weight category—underweight, healthy weight, overweight, and obesity. BMI does not measure body fat directly, but BMI is moderately correlated with more direct measures of body fat. Furthermore, BMI appears to be as strongly correlated with various metabolic and disease outcomes as are these more direct measures of body fatness.";
```

In some cases, like the OneRM calculation, you can opt in to get an additional (`alternate`) result. OneRM offers the boolean param `providePercentage`, and when set to true, the return will also include the `alternate` prop, being its value the OneRM percentage in this case.

## What to expect from the other functions?

There's `getSources()`, which returns a string array with all the URLs to all the sources of knowledge used to develop the function, write it's explanation, and so on. The array will look like this: `["https://website-one.gov", "https://website-two.org"]`.

And then there's `getLastUpdated()`, which returns a string with the last time the function ITSELF was updated (using the DD/MM/YYYY format).

> [!NOTE]
> Updates that make trivial changes like cleaning the code, improving performance, etc... do not bump the `getLastUpdated()` date. Only true changes, like numbers used for calculations, explanations, and that kind of stuff will be considered as an update to "the function _itself_".

Great, you got it all!

Now, let's move onto the reference manual: a list of all available functions, categorized, and with explanations.

> [!TIP]
> This reference is only for the `calculate()` function of each utility, as `getLastUpdated()` and `getSources()` are always the same.

<!--markdownlint-disable-next-line-->

# CoreLibrary reference manual

`CoreLibrary.physicalHealth`

## basalMetabolicRate.`calculate()`

**What's this?**

> The BMR is the rate of energy expenditure per unit time by endothermic animals at rest.

In an easier vocabulary: BMR is used to calculate the amount of energy the human body spends on a day to stay alive.

**What purpose does the function serve?**

You use it by passing the data needed to calculate the BMR plus the activeness of the subject, to calculate (based on the Harris-Benedict equation) the estimated amount of kilocalories the subject should get in a daily basis.

For extra info about how this should be used within PersonaPlus' scope, see [USAGE.md](USAGE.md#basalMetabolicRate).

| Parameter    | Type                                                      | Explanation                                                                                                                                                                                                                                                                                                  |
| ------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `age`        | Number                                                    | The **age** of the subject in years                                                                                                                                                                                                                                                                          |
| `gender`     | "male" or "female"                                        | The **gender** of the subject                                                                                                                                                                                                                                                                                |
| `weight`     | Number                                                    | The weight of the subject in **kilograms**                                                                                                                                                                                                                                                                   |
| `height`     | Height                                                    | The height of the subject in **centimeters**                                                                                                                                                                                                                                                                 |
| `activeness` | "poor" or "light" or "moderate" or "intense" or "extreme" | Approximately, how active the subject is in terms of exercising, being "poor" very little or no exercise, light 1 to 3 days of exercise a week (being one time each day), moderate 3 to 5 days a week, intense 6 or seven days a week, and extreme being very intense exercises and/or more than once a day. |

## getMetabolicEquivalentOfTask.`calculate()`

**What's this?**

> The MET is the objective measure of the ratio of the rate at which a person expends energy, relative to the mass of that person, while performing some specific physical activity compared to a reference, currently set by convention at an absolute 3.5 mL of oxygen per kg per minute, which is the energy expended when sitting quietly by a reference individual, chosen to be roughly representative of the general population, and thereby suited to epidemiological surveys.

In an easier vocabulary: MET is used to calculate the metabolic work rate of an activity. According to the [Compendium of Physical Activities](https://pacompendium.com/):

> One MET is defined as 1 kcal/kg/hour and is roughly equivalent to the energy cost of sitting quietly.

**What purpose does this function serve?**

Other functions that are pretty useful require of a MET value to resolve the equation, therefore this function.

For extra info about how this should be used within PersonaPlus' scope, see [USAGE.md](USAGE.md#MetabolicEquivalentOfTask) (TL;DR: basically the main usage is getting it's value to complete the equation of other functions).

| Parameter   | Type                                                                                                                                                                                                                                                                         | Explanation                         |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `age`       | Number                                                                                                                                                                                                                                                                       | The **age** of the subject in years |
| `gender`    | "male" or "female"                                                                                                                                                                                                                                                           | The **gender** of the subject       |
| `intensity` | "super_low" or "very_low" or "low" or "low_to_mid" or "mid" or "mid_to_high" or "not_too_high" or "high" or "higher" or "very_high" or "very_high_to_intense" or "not_too_intense" or "a_bit_intense" or "intense" or "pretty_intense" or "very_intense" or "really_intense" | The intensity of the activity.      |

Each `intensity` value is associated to a fixed, approximated MET value, as seen in the table that follows.

| Value                  | Equivalent                                                                   | MET value                     |
| ---------------------- | ---------------------------------------------------------------------------- | ----------------------------- |
| `super_low`            | writing, desk work, using computer                                           | 1.5                           |
| `very_low`             | walking slowly                                                               | 2.0                           |
| `low`                  | walking, 4.8 km/h                                                            | 3.0                           |
| `low_to_mid`           | sweeping or mopping floors, vacuuming carpets                                | 3 to 3.5 (3.5 in code)        |
| `mid`                  | Tennis doubles                                                               | 5.0                           |
| `mid_to_high`          | Weight lifting (moderate intensity)                                          | 5.0                           |
| `not_too_high`         | sexual activity, aged 22                                                     | 5.8                           |
| `high`                 | aerobic dancing, medium effort, bicycling, on flat, 16-19 km/h, light effort | 6.0                           |
| `higher`               | jumping jacks                                                                | >6.0 (Rounded to 6.5 in code) |
| `very_high`            | sun salutation (Surya Namaskar, vigorous with transition jumps)              | 7.4                           |
| `very_high_to_intense` | basketball game                                                              | 8.0                           |
| `not_too_intense`      | jogging, 9.0 km/h                                                            | 8.8                           |
| `a_bit_intense`        | rope jumping, 66/min                                                         | 9.8                           |
| `intense`              | football                                                                     | 10.3                          |
| `pretty_intense`       | rope jumping, 84/min                                                         | 10.5                          |
| `very_intense`         | rope jumping, 100/min                                                        | 11.0                          |
| `really_intense`       | jogging, 10.9 km/h                                                           | 11.2                          |

## BodyMassIndex.`calculate()`

**What's this?**

> The BMI (body mass index) is a person's weight in kilograms divided by the square of height in meters.

In an easier vocabulary: BMI is a number that creates a relationship between an individual's body mass and the rest of their "parameters" (age, gender, or height).

**What purpose does the function serve?**

You use it by passing the data needed to calculate the BMI, to calculate (based on the CDC's formula and their percentiles) the estimated Body Mass Index, and whether that BMI represents a healthy weight or an unhealthy one, either by underweight or overweight / obesity.

For extra info about how this should be used within PersonaPlus' scope, see [USAGE.md](USAGE.md#BodyMassIndex).

| Parameter | Type               | Explanation                                  |
| --------- | ------------------ | -------------------------------------------- |
| `age`     | Number             | The **age** of the subject in years          |
| `gender`  | "male" or "female" | The **gender** of the subject                |
| `weight`  | Number             | The weight of the subject in **kilograms**   |
| `height`  | Height             | The height of the subject in **centimeters** |

## BodyFatPercentage.`calculate()`

**What's this?**

> The BFP (body fat percentage) of an organism is the total mass of its fat divided by its total body mass, multiplied by 100; body fat includes essential body fat and storage body fat.

In an easier vocabulary: BFP gives you the percentage of your body's weight that's fat.

**What purpose does the function serve?**

You use it by passing the data needed to calculate the BFP, to calculate the estimated percentage of your weight that's fat, and whether that BFP represents a healthy weight or an unhealthy one, either by underweight or overweight / obesity.

For extra info about how this should be used within PersonaPlus' scope, see [USAGE.md](USAGE.md#BodyFatPercentage).

| Parameter | Type               | Explanation                                  |
| --------- | ------------------ | -------------------------------------------- |
| `age`     | Number             | The **age** of the subject in years          |
| `gender`  | "male" or "female" | The **gender** of the subject                |
| `weight`  | Number             | The weight of the subject in **kilograms**   |
| `height`  | Height             | The height of the subject in **centimeters** |
