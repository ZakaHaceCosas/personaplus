/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2025 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/types/glue_fix.ts
 * Basically: Specific types for fixing specific issues that repeat themselves.
 *
 * <=============================================================================>
 */

/**
 * This type is a glue fix, otherwise a type error happens because SessionParams is not compatible with UnknownInputParams from ExpoRouter
 *
 * @export
 */
export type ExpoRouterParams = Record<
    string,
    string | number | undefined | null | (string | number)[]
>;
