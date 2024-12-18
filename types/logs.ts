/* <=============================================================================>
 *  PersonaPlus - Give yourself a plus!
 *  Copyright (C) 2024 ZakaHaceCosas and the PersonaPlus contributors. All rights reserved.
 *  Distributed under the terms of the GNU General Public License version 3.0.
 *  See the LICENSE file in the root of this for more details.
 * <=============================================================================>
 *
 * You are in: @/types/logs.ts
 * Basically: Type definitions for our homemade logs.
 *
 * <=============================================================================>
 */

/**
 * A homemade developer log.
 *
 * @export
 * @interface Log
 */
export interface Log {
    /**
     * The message itself.
     *
     * @type {string}
     */
    message: string;
    /**
     * Whether it's a regular log, a warning, an error, or a success message.
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
    /**
     * Where does this log come from.
     *
     * @type {LogTraceback | undefined}
     */
    traceback: LogTraceback | undefined;
}

/**
 * A manual traceback for logging purposes.
 *
 * @export
 * @interface LogTraceback
 */
export interface LogTraceback {
    /**
     * The FILE location using the project's schema, e.g. @/types/Logs.ts.
     *
     * @type {string}
     */
    location: string;
    /**
     * What MAIN function is this being traced from, e.g. `logToConsole()`.
     *
     * @type {string}
     */
    function: string;
    /**
     * Whether the traceback comes from a handler function, e.g. a `handleThis()` inside the main function instead of the function itself.
     *
     * @type {boolean}
     */
    isHandler: boolean;
    /**
     * In case of being a handler, the name of the HANDLER function this is being traced from.
     *
     * @type {?string}
     */
    handlerName?: string;
}

/**
 * An array of logs.
 *
 * @export
 */
export type Logs = Log[];
