// whatever this is, it works
const keyCache = new Map<string, string>();

export default function GenerateRandomKey(item: string): string {
    if (!keyCache.has(item)) {
        const n: number = Math.random() * 1000;
        const key = `__PERSONAPLUS_${item}_ITEM__${n}__DO_NOT_REMOVE_OR_YOU_WILL_BE_FIRED`;
        keyCache.set(item, key); // learning from react, heh~
    }
    return keyCache.get(item)!;
}
