export default function GenerateRandomKey(item: string): string {
    const n: number = Math.random() * 1000;

    return `__PERSONAPLUS_${item}_ITEM__${n}__DO_NOT_REMOVE_OR_YOU_WILL_BE_FIRED`; // learning from react, heh~
}
