/** Fisher–Yates shuffle algorithm. */
// deno-lint-ignore no-explicit-any
export function shuffle(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function interleave([x, ...xs]: number[], ys: number[] = []): number[] {
    return x === undefined
        ? ys // base: no x
        : [x, ...interleave(ys, xs)]; // inductive: some x
}

/** Simple old-fashioned deep copy JSON object or JSON array.
 *
 * Works best with only primitive objects. Use `structuredClone()` for more complicated objects.
 */
// deno-lint-ignore ban-types
export function deepCopy<T extends object>(object: T): T {
    if (typeof object !== 'object') {
        throw new Error('Received non-object type');
    }
    return JSON.parse(JSON.stringify(object));
}

export function isHex(hex: string): boolean {
    return /[a-fA-F0-9]*/g.test(hex);
}

export function hexToDec(hex: string): number {
    return parseInt(hex, 16);
}

export function decToHex(val: number): string {
    const hex = val.toString(16);
    return hex;
}
