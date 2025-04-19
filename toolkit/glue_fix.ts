/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2023-2025 The "Give It A Plus" organization and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this repository for more details.
 * <=============================================================================>
 *
 * You are in: @/types/glue_fix.ts
 * Basically: Specific "glue fixes" for fixing specific (probably stupid) issues that repeat themselves.
 *
 * <=============================================================================>
 */

import type {
    INormalizeOptions,
    UnknownString,
} from "../node_modules/@zakahacecosas/string-utils/mod";
import * as n from "../node_modules/@zakahacecosas/number-utils/mod";

/**
 * Use this to extend type interfaces for URL params when passing data from page to page.
 *
 * This type is a glue fix, otherwise a type error happens because SessionParams is not compatible with UnknownInputParams from ExpoRouter
 *
 * @export
 */
export type ExpoRouterParams = Record<
    string,
    string | number | undefined | null | (string | number)[]
>;

/**
 * [My own string utilities package, a fairly very good one.](https://jsr.io/@zakahacecosas/string-utils)
 *
 * This export is a glue fix. The package is from JSR and not npm, and this error:
 * ```txt
 * Android Bundling failed 17621ms node_modules/expo-router/entry.js (1559 modules)
 * The package at "node_modules/@zakahacecosas/string-utils/mod.ts" attempted to import the Node standard library module "node:process".
 * It failed because the native React runtime does not include the Node standard library.
 * ```
 * forces me to copy paste the code I need from it and paste it here.
 */
export const StrUtils = {
    stripCliColors(str: string): string {
        return (
            str
                // deno-lint-ignore no-control-regex
                .replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, "")
        );
    },
    normalize(str: string, options?: INormalizeOptions): string {
        const { preserveCase, strict, stripCliColors } = options ?? {
            preserveCase: false,
            strict: false,
            stripCliColors: false,
        };
        const normalizedStr = str
            .normalize("NFD") // normalize á, é, etc.
            .replace(/[\u0300-\u036f]/g, "") // remove accentuation
            .replace(/\s+/g, " ") // turn "my      search  query" into "my search query"
            .trim()
            .replace(strict ? /[\s\W_]/g : "", "");

        const strippedStr = stripCliColors
            ? this.stripCliColors(normalizedStr)
            : normalizedStr;
        const finalStr = preserveCase ? strippedStr : strippedStr.toLowerCase();

        return finalStr;
    },
    validate(str: UnknownString): str is string {
        if (
            str === undefined ||
            str === null ||
            typeof str !== "string" ||
            this.normalize(str) === ""
        ) {
            return false;
        }

        return true;
    },
};

/**
 * [My own string utilities package.](https://jsr.io/@zakahacecosas/number-utils)
 *
 * This export is a glue fix. The package is from JSR and not npm, and Metro dislikes that.
 */
export const NumUtils = n.NumberUtils;
