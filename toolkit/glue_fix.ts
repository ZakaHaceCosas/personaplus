/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2025 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/types/glue_fix.ts
 * Basically: Specific "glue fixes" for fixing specific (probably stupid) issues that repeat themselves.
 *
 * <=============================================================================>
 */

import * as string_utils from "@zakahacecosas/string-utils";

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
 * [My own string utilities package.](https://jsr.io/@zakahacecosas/string-utils)
 *
 * This export is a glue fix. The package is from JSR and not npm, and Metro is unable to process that (thus the app can't even run). That forces us to explicitly import it from `node_modules` then re-export it from here.
 */
export const StrUtils = string_utils.StringUtils;
