# OpenHealth documentation

> [!NOTE]
> Don't confuse `DOCS.md` (Documentation) with `docs/`, a directory for content used by the library.
> [!TIP]
> También disponible en [Español (Spanish)](DOCS.es.md)

## First thing first: categories

The entry point of the library is `OpenHealth`

```tsx
import OpenHealth from "openhealth"
```

From there, you have different categories to access functions, like the following:

```tsx
OpenHealth.phisicalHealth // phisical health related features
OpenHealth.mentalHealth // mental health related features
...
```

Currently, these are all the categories available:

| CATEGORY | EXPLANATION |
| -------- | ----------- |
| `phisicalHealth` | Phisical health related functions and calculations. |
| `mentalHealth` | Mental health related functions and calculations. |
| `performance` | Sport & activity performance related functions and calculations. |

## Now, how do functions work?

Each function is different, but they all follow a standard:

```tsx
OpenHealth.phisicalHealth.BodyMassIndex.calculate(<params>);
OpenHealth.phisicalHealth.BodyMassIndex.getSource();
OpenHealth.phisicalHealth.BodyMassIndex.getLastUpdated();
```

***`Calculate`*** is the most important thing, where you pass **all the arguments required by the calculation function to work**, plus **two extra booleans:** `provideContext` and `provideExplanation`. It can ask for data like the weight, height, age, or gender of the subject, among others.

> [!NOTE]
> ***This library is american't.*** We use the international system, and there is neither support for the imperial system nor intentions to implement it. Thanks for understanding!

`provideContext` gives a small context (sometimes just a word) about how the result should be interpreted. E.g., in the BMI (BodyMassIndex) function, `provideContext` returns (when applicable) a string saying if the result value does represent "healthy weight", "under weight", "obesity", and so on.

`provideExplanation` gives a small explanation of what the calculation means. For example, in the BMI function it returns the following:

```tsx
"(According to CDC) Body mass index (BMI) is a person's weight in kilograms divided by the square of height in meters. BMI is an inexpensive and easy screening method for weight category—underweight, healthy weight, overweight, and obesity. BMI does not measure body fat directly, but BMI is moderately correlated with more direct measures of body fat. Furthermore, BMI appears to be as strongly correlated with various metabolic and disease outcomes as are these more direct measures of body fatness."
```

## What should I expect as a return?

Calculation functions always follow the same structure for returns: an `object` which looks like this:

```tsx
interface response {
    result: number; // The result of the calculation itself. Always a number.
    subject?: {
        age: number;
        gender: "male" | "female";
        weight: number;
        height: number;
        ... // if there's any other function specific parameter, it will always be part of the "subject"
    };
    context?: string;
    explanation?: string;
}
```

> [!WARNING]
> If both `provideContext` and `provideExplanation` are set to `false`, you will be returned an object that contains JUST the "`result`". This is because the `subject` is considered part of the context, therefore `provideContext` must be set to true if you wanted to retrieve it for any reason. Anyways all the content from the `subject` are arguments you pass to the function, so in theory you'll always have access to those even if you don't explicitly ask for the `subject` AND the `context`.

Then, there's `getSource()` which returns a string with the URLs to all the sources of knoweledge used to develop the function, write it's explanation, and so on, and `getLastUpdated()` returns a string with the last time the function ITSELF was updated (using the DD/MM/YYYY format).

> [!NOTE]
> Updates that make trivial changes like cleaning the code, improving performance, etc... do not bump the `getLastUpdated()` date. Only true changes, like numbers used for calculations, explanations, and that kind of stuff will be considered as an update to "the function *itself*".

Great, you got it!

Now, let's move onto the reference manual: a list of all available functions, categorised, and with explanations.

> [!TIP]
> This reference is only for the `calculate()` function of each utility, as `getLastUpdated()` and `getSource()` are always the same.

<!--markdownlint-disable-next-line-->
# OpenHealth reference manual

`OpenHealth.phisicalHealth`

## basalMetabolicRate.`calculate()`

| Parameter | Type | Explanation |
| --------- | ---- | ----------- |
| `age` | Number | The **age** of the subject in years |
| `gender` | "male" or "female" | The **gender** of the subject |
| `weight` | Number | The weight of the subject in **kilograms** |
| `height` | Height | The height of the subject in **centimeters** |
| `activness` | "poor" or "light" or "moderate" or "intense" or "extreme" | Aproximetly, how active the subject is in terms of exercising, being "poor" very little or no exercise, light 1 to 3 days of exercise a week (being one time each day), moderate 3 to 5 days a week, intense 6 or seven days a week, and extreme being very intense exercies and/or more than once a day. |
| `provideContext` | Boolean | Wether to provide or not a brief context on how the result should be interpreted (if applicable). |
| `provideExplanation` | Boolean | Wether to provide or not a brief explanation on what the calculation is about. |
