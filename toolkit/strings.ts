/**
 * Handles pluralization of strings
 * @author ZakaHaceCosas (actually, I borrowed this code from [here](https://github.com/SokoraDesu/Sokora/blob/dev/src/utils/pluralOrNot.ts) ngl)
 *
 * @export
 * @param {string} word Word to pluralize (or not)
 * @param {number} numberToCheck Number that's associated to the word
 * @param {("es" | "en")} lang Language to be used. This affects rules used for pluralization.
 * @returns {string} The word to be pluralized with the `numberToCheck` preceding it.
 */
export function PluralOrNot(
    word: string,
    numberToCheck: number,
    lang: "es" | "en",
): string {
    if (numberToCheck === 1) return `1 ${word}`;

    function pluralize(lang: "es" | "en"): string {
        if (lang === "es") {
            if (word.endsWith("z")) {
                return word.slice(0, -1) + "ces"; // lápiz -> lápices
            } else if (word.endsWith("ón")) {
                return word.slice(0, -2) + "ones"; // flexión -> flexiones
            } else if (!word.endsWith("s")) {
                return `${word}s`;
            } else {
                return word;
            }
        } /* else if (lang === "en") */ else {
            return word.endsWith("y") ? `${word.slice(0, -1)}ies` : `${word}s`;
        }
    }

    return `${numberToCheck} ${pluralize(lang)}`;
}
