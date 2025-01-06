/**
 * Handles pluralization of strings.
 * @author ZakaHaceCosas (Borrowed from [here](https://github.com/SokoraDesu/Sokora/blob/dev/src/utils/pluralOrNot.ts) ngl)
 *
 * @export
 * @param {string} word The word itself.
 * @param {number} numberToCheck The number you depend on to check if you should be using plural or singular.
 * @param {("es" | "en")} lang Pass the user's language. Most places are already fetching UserData anyway - this is better than making this function async ;).
 * @returns {string} The string.
 */
export function PluralOrNot(
    word: string,
    numberToCheck: number,
    lang: "es" | "en",
): string {
    if (numberToCheck === 1) return word;

    if (lang === "en") {
        return word.charAt(word.length - 1) === "y"
            ? `${word.slice(0, -1)}ies` // "city" -> "cities"
            : `${word}s`; // "constant" -> "constants"
    }

    if (lang === "es") {
        if (word.endsWith("z")) {
            return `${word.slice(0, -1)}ces`; // "luz" -> "luces"
        } else if (word.endsWith("ión")) {
            return `${word.slice(0, -3)}iones`; // "canción" -> "canciones"
        } else if (word.endsWith("s")) {
            return word; // already plural, probably
        } else {
            return `${word}s`; // General: "libro" -> "libros"
        }
    }

    return word;
}
