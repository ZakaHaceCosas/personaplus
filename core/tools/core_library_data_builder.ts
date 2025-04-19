/**
 * A type with the `getSources` and `getLastUpdate` data.
 */
type CoreLibraryComponentData = {
    updated: `${string}/${string}/${string}`;
    sources: string[];
};

/**
 * Creates the functions to get component data from a CoreLibrary function. **See docs for more info (Component Data).**
 *
 * @export
 * @param {string} updated The date of the last update in DD/MM/YYYY format.
 * @param {string} sources The sources of information used.
 * @returns {{ getSources: () => string; getLastUpdate: () => `${string}/${string}/${string}`; }}
 */
export default function CreateComponentDataUtilities(
    updated: string,
    sources: string[],
): {
    getLastUpdate: () => `${string}/${string}/${string}`;
    getSources: () => string[];
} {
    // data validation
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!datePattern.test(updated)) {
        throw new Error("Invalid date format. Expected DD/MM/YYYY.");
    }

    // construction
    const componentData: CoreLibraryComponentData = {
        updated: updated as `${string}/${string}/${string}`,
        sources: sources,
    };

    // function creation
    /**
     * Retrieves the sources of information used in the component's calculations.
     *
     * @returns {string} A single string with all the URLs, separated by "and" if there is more than one.
     */
    function getSources(): string[] {
        return componentData.sources;
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
        getLastUpdate,
        getSources,
    };
}
