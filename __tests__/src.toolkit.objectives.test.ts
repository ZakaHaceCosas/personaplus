import { ObjectiveWithoutId } from '@/src/types/Objective';
import { ToastAndroid } from 'react-native';
import { createNewActiveObjective } from '@/src/toolkit/objectives';
import { router } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from 'react-i18next';

jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

jest.mock('expo-router', () => ({
    router: {
        back: jest.fn(),
    },
}));

const mockGetItem = AsyncStorage.getItem as jest.MockedFunction<typeof AsyncStorage.getItem>;
const mockSetItem = AsyncStorage.setItem as jest.MockedFunction<typeof AsyncStorage.setItem>;
const mockBack = router.back as jest.MockedFunction<typeof router.back>;

describe('createNewActiveObjective', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const { t } = useTranslation()

    test('should create a new objective and save it', async () => {
        const objectiveMetadata: ObjectiveWithoutId = {
            days: [false, true, true, false, true, false, true],
            duration: 60,
            exercise: 'Running',
            extra: {
                amount: 4,
                hands: 2,
                time: 5,
                lifts: 25,
                speed: 4,
                liftWeight: 3,
                barWeight: 21,
            },
            repetitions: 2,
            rests: 4,
            restDuration: 50,
        };

        const result = await createNewActiveObjective(objectiveMetadata, t);

        expect(result).toBe(0);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            'objectives',
            expect.stringContaining('"identifier":')
        );
        expect(ToastAndroid.show).toHaveBeenCalledWith(
            'Objective created',
            ToastAndroid.SHORT
        );
        expect(router.back).toHaveBeenCalled();
    });
    // didn't continue this because it doesnt even work
    /*
 FAIL  __tests__/src.toolkit.objectives.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    C:\<somewhere>\personaplus\node_modules\expo-background-fetch\build\BackgroundFetch.js:1
    ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,jest){import { Platform, UnavailabilityError } from 'expo-modules-core';
                                                                                      ^^^^^^

    SyntaxError: Cannot use import statement outside a module

       8 | import { TFunction } from 'i18next';
       9 | // BACKEND
    > 10 | import * as BackgroundFetch from 'expo-background-fetch';
         | ^
      11 | import * as TaskManager from 'expo-task-manager';
      12 | import AsyncStorage from '@react-native-async-storage/async-storage';
      13 | import { adjustedToday, getCurrentDate, TodaysDay } from '@/src/toolkit/today';

      at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1505:14)
      at Object.<anonymous> (src/toolkit/objectives.ts:10:1)
      at Object.<anonymous> (__tests__/src.toolkit.objectives.test.ts:3:1)

Test Suites: 1 failed, 4 passed, 5 total
Tests:       31 passed, 31 total
Snapshots:   0 total
Time:        16.53 s
Ran all test suites.
error: script "test" exited with code 1
    */
});
