import logger from '../logger';

// deno-lint-ignore ban-types
const tag = (func: Function) => {
    return `[utils::misc::${func.name}]`;
};

export const isHex = (hex: string): boolean => {
    return /[a-fA-F0-9]*/g.test(hex);
};

/** Fisher–Yates shuffle algorithm. */
// deno-lint-ignore no-explicit-any
export const shuffle = (array: any[]): void => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

export const interleave = ([x, ...xs]: number[], ys: number[] = []): number[] => {
    return x === undefined
        ? ys // base: no x
        : [x, ...interleave(ys, xs)]; // inductive: some x
};

/** Simple deep copy JSON object or JSON array.
 * Works best with only primitive objects.
 */

export const deepCopy = <T>(object: T): T => {
    if (typeof object !== 'object') {
        logger.error(tag(deepCopy), 'Received non-object type');
    }
    return JSON.parse(JSON.stringify(object));
};
