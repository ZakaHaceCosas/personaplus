/**
 * A type with the `getSource` and `getLastUpdate` data.
 */
type OpenHealthComponentData = {
    updated: `${string}/${string}/${string}`;
    source: string;
};

/**
 * Creates the functions to get component data from an OpenHealth function. **See docs for more info (Component Data).**
 *
 * @export
 * @param {string} updated - The date of the last update in DD/MM/YYYY format.
 * @param {string} source - The sources of information used.
 * @returns {{ getSource: () => string; getLastUpdate: () => `${string}/${string}/${string}`; }}
 */
export default function CreateComponentDataUtilities(updated: string, source: string): { getSource: () => string; getLastUpdate: () => `${string}/${string}/${string}`; } {
    // data validation
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!datePattern.test(updated)) {
        throw new Error("Invalid date format. Expected DD/MM/YYYY.");
    }

    // construction
    const componentData: OpenHealthComponentData = {
        updated: updated as `${string}/${string}/${string}`,
        source
    };

    // function creation
    /**
    * Retrieves the sources of information used in the component's calculations.
    *
    * @returns {string} A single string with all the URLs, separated by "and" if there is more than one.
    */
    function getSource(): string {
        return componentData.source;
    }

    /**
     * Retrieves the date of the last update made to the component.
     *
     * @returns {`${string}/${string}/${string}`} A string with the date of the last update, in DD/MM/YYYY format.
     */
    function getLastUpdate(): `${string}/${string}/${string}` {
        return componentData.updated;
    }

    return {
        getSource,
        getLastUpdate
    };
}
