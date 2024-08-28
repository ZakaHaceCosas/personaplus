/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: types/logs.ts
 * Basically: Type definitions for our homemade logs.
 *
 * <=============================================================================>
 */

/**
 * A homemade developer log.
 *
 * @export
 * @interface Log
 * @typedef {Log}
 */
export interface Log {
    /**
     * The message itself.
     *
     * @type {string}
     */
    message: string;
    /**
     * Wheter it's a regular log, a warning, an error, or a success message.
     *
     * @type {("log" | "warn" | "error" | "success")}
     */
    type: "log" | "warn" | "error" | "success";
    /**
     * It's exact timestamp.
     *
     * @type {number}
     */
    timestamp: number;
}

/**
 * An array of logs.
 *
 * @export
 * @typedef {Logs}
 */
export type Logs = Log[];
