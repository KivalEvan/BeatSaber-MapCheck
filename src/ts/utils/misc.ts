/** Fisher–Yates shuffle algorithm. */
export function shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function interleave<T, U>([x, ...xs]: T[], ys: U[] = []): (T | U)[] {
    return x === undefined
        ? ys // base: no x
        : [x, ...interleave(ys, xs)]; // inductive: some x
}

export function pickRandom<T>(ary: T[], func = Math.random): T {
    return ary[Math.floor(func() * ary.length)];
}

/** Simple old-fashioned deep copy JSON object or JSON array.
 *
 * Works best with only primitive objects. Use `structuredClone()` for more complicated objects.
 */
export function deepCopy<T extends { [P in keyof T]: T[P] }>(object: T): T;
export function deepCopy<T extends { [P in keyof T]: T[P] }>(object: T[]): T[];
export function deepCopy<T extends { [P in keyof T]: T[P] }>(object: T | T[]): T | T[] {
    if (typeof object !== 'object') {
        throw new Error('Received non-object type');
    }
    return JSON.parse(JSON.stringify(object));
}

export function isHex(hex: string): boolean {
    return /^[a-fA-F0-9]+$/g.test(hex);
}

export function hexToDec(hex: string): number {
    return parseInt(hex, 16);
}

export function decToHex(val: number): string {
    const hex = val.toString(16);
    return hex;
}
