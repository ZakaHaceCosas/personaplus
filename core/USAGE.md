# Usage of OpenHealth within PersonaPlus

> Tambien disponible en [Español (Spanish)](USAGE.es.md)

While the long term aim is to create a full, free and open source independant library and source of information, at the moment OpenHealth is being developed within the scope of PersonaPlus, and the usage should also be explained within that scope.

This document is basically a short guide onto

a) How to create OH functions

and

b) What functions should you use, where, and why

## Creating a function

That's basically how OpenHealth works, in the end it's just a lot of functions that do a bunch of calculations.

An OpenHealth function is designed like this:

```ts
// First, the imports. More onto that later.
import CreateComponentDataUtilities from "@/core/tools/OpenHealthDataBuilder";
import { OpenHealthResponseVersatile } from "@/core/types/OpenHealthResponse";

// Then, construct the data function. More onto that later.
export const { getSource, getLastUpdate } = CreateComponentDataUtilities(
    "date",
    "sources"
)

/**
 JSDoc
*/
export default function yourFunction(
    age: number,
    gender: "male" | "female",
    height: number,
    weight: number,
    // additional params (if neded)
    provideContext?: boolean,
    provideExplanation?: boolean
): OpenHealthResponseVersatile /* or the response type. More onto that later. */ {


    // your stuff here :D


    const samleResult = 24

    const response: OpenHealthResponseVersatile = {
        result: samleResult,
    };

    if (provideContext) {
        response.subject = {
            age,
            gender,
            height,
            weight,
            // additional params (if neded)
        };
        response.context = "context";
    }

    if (provideExplanation) {
        response.explanation = "explanation.";
    }

    return response;
}
```

Basically, first you import the desired type (see [docs](DOCS.md#now-how-do-functions-work) for more info onto available response types), and any other function that you require.

Then, construct the data. Let me explain:

`CreateComponentDataUtilities(updated, source)` accepts two `string` params. First param is the last update date, and _yes, you got to update it manually_. Note it refers to actual updates - I mean - trivial / code QL / performance changes do _not_ count as updates for this date. Only changes that alter the context, explanation, result, params, or any other kind of data in any way (by adding, modifying, removing, etc...) will be considered as _actual updates_. You must pass it in an XX/XX/XXXX format or an error will be thrown. **Please** be sure it's DD/MM/YYYY.

Then there's source, a single string with all the sources you've used. Think of it as a school work, where you got to link your sources so we can ensure your info is valid and calculations are correct.

Just `export const { getSource, getLastUpdate }` the data utilities function and they will work out of the box.

Then, you just need to create your main function and make it the **default** export. Be sure to give it the correct params and return one of the three valid OpenHealth Responses. You can just copy & paste from other functions for that.

Whatever you choose as a response, though, you should note that you'll have to define `context` and `explanation`, being both explanatory texts. `context` briefly explaining the received result and `explanation` explaining what does the calculation by itself mean.
> You can always just write "FIXME" or "TODO" as a value, and let someone else (like me) take care of it.

From here, you're now free to go make your contribution - thank you, by the way!

And one more thing, btw: Use JSDoc and descriptive variable / function naming, so everyone gets whats up.

## Usage within PersonaPlus

-- TODO --
