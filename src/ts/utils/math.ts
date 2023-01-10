import logger from '../logger';
import { EasingFunction } from '../types/easings';

const tag = (name: string) => {
    return `[utils::math::${name}]`;
};

/** Return number in formatted number string.
 * ```ts
 * console.log(formatNumber(12345678)) // 12,345,678
 * ```
 */
export function formatNumber(num: number): string {
    return num
        .toString()
        .split('.')
        .map((str, i) => (i ? str : str.replace(/\B(?=(\d{3})+(?!\d))/g, ',')))
        .join('.');
}

// Randomly generate seed if not provided.
const _internalSeed = { ref: hashCode(Math.random()) };

/** Mulberry32 algorithm.
 *
 * shamelessly taken from stackoverflow
 */
function internalPRandom(seed: number | { ref: number }) {
    const _s = typeof seed === 'number' ? { ref: seed } : seed;
    return function () {
        let s = (_s.ref += 0x6d2b79f5);
        s = Math.imul(s ^ (s >>> 15), s | 1);
        s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
        return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
    };
}
const _instPRandom = internalPRandom(_internalSeed);

function internalRandom(
    min?: number | boolean,
    max?: number | boolean,
    rounding: number | boolean = false,
    func: () => number = Math.random,
) {
    if (typeof min === 'boolean' || (!min && typeof min !== 'number')) {
        if (min) {
            return Math.round(func());
        }
        return func();
    }
    if (typeof max === 'boolean' || (!max && typeof max !== 'number')) {
        let result = func() * min;
        if (max) {
            result = Math.round(result);
        }
        return result;
    }
    [min, max] = fixRange(min, max);
    const result = func() * (max - min) + min;
    return rounding ? round(result, typeof rounding === 'number' && rounding > 0 ? rounding : 0) : result;
}

/** Seeded pseudorandom generator.
 *
 * Based on Mulberry32 PRNG algorithm.
 *
 * **NOTE:** This is globally scoped, any random call elsewhere will affect the consequent call. Consider creating instance of pseudorandom with `pRandomFn` if you need consistency across usage. Reset the random seed to retain same randomness if needed.
 *
 * **WARNING:** This is not meant to be used for security, rather quick and simple for pseudorandom purpose.
 */
export function pRandom(max: number, int?: boolean): number;
export function pRandom(int?: boolean): number;
export function pRandom(min: number, max: number): number;
export function pRandom(min: number, max: number, rounding: boolean): number;
export function pRandom(min: number, max: number, rounding: number): number;
export function pRandom(min?: number | boolean, max?: number | boolean, rounding: number | boolean = false): number {
    return internalRandom(min, max, rounding, _instPRandom);
}

/** Create instance of pseudorandom function.
 * ```ts
 * const pRandom = utils.pRandomFn('seed');
 * console.log(pRandom());
 * ```
 * **NOTE:** Seed cannot be reset.
 */
export function pRandomFn(seed: string | number | bigint = Math.random()) {
    const _seed = hashCode(seed);
    const _func = internalPRandom(_seed);
    return function (min?: number | boolean, max?: number | boolean, rounding: number | boolean = false) {
        return internalRandom(min, max, rounding, _func);
    };
}

/** Set seed for pseudorandom generator.
 *
 * Recalling this resets the seed.
 *
 * If this is never called, defaults to randomly generated seed.
 */
export function pRandomSeed(seed: string | number | bigint): void {
    _internalSeed.ref = hashCode(seed);
}

/** Generate 32-bit hash with Java implementation.
 *
 * Internally converts primitives to string.
 */
export function hashCode(str: string | number | bigint): number {
    str = str.toString();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

/** Random number generator using built-in JS Math. */
export function random(max: number, int?: boolean): number;
export function random(int?: boolean): number;
export function random(min: number, max: number): number;
export function random(min: number, max: number, rounding: boolean): number;
export function random(min: number, max: number, rounding: number): number;
export function random(min?: number | boolean, max?: number | boolean, rounding: number | boolean = false): number {
    return internalRandom(min, max, rounding, Math.random);
}

/** Return number tuple in order. */
export function fixRange(min: number, max: number, inverse?: boolean): [number, number] {
    if (!inverse && min > max) {
        return [max, min];
    }
    if (inverse && min < max) {
        return [max, min];
    }
    return [min, max];
}

export function round(num: number, d = 0): number {
    return Math.round(num * Math.pow(10, d)) / Math.pow(10, d);
}

export function radToDeg(rad: number) {
    return rad * (180 / Math.PI);
}

export function degToRad(deg: number) {
    return deg * (Math.PI / 180);
}

/** Return [radius, theta, phi] */
export function cartesianCoordToSphericalCoord(x: number, y: number, z: number): [number, number, number] {
    const radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
    return [radius, Math.acos(z / radius), (Math.atan2(y, x) + 2 * Math.PI) % (2 * Math.PI)];
}

/** Return [x, y, z] */
export function sphericalCoordToCartesianCoord(radius: number, theta: number, phi: number): [number, number, number] {
    return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta),
    ];
}

// thanks Top_Cat#1961
export function mod(x: number, m: number): number {
    if (m < 0) {
        m = -m;
    }
    const r = x % m;
    return r < 0 ? r + m : r;
}
export function shortRotDistance(a: number, b: number, m: number): number {
    return Math.min(mod(a - b, m), mod(b - a, m));
}

export function median(numArr: number[]): number {
    if (numArr.length === 0) {
        return 0;
    }
    numArr.sort((a: number, b: number) => a - b);
    const mid = Math.floor(numArr.length / 2);
    if (numArr.length % 2) {
        return numArr[mid];
    }
    return (numArr[mid - 1] + numArr[mid]) / 2;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(min, value), max);
}

/** Normalize value to 0-1 from given min and max value. */
export function normalize(value: number, min: number, max: number): number {
    if (min > max) {
        logger.warn(tag('normalize'), 'Min value is more than max value, returning 1');
        return 1;
    }
    if (min === max) {
        return 1;
    }
    const result = (value - min) / (max - min);
    logger.verbose(tag('normalize'), `Obtained ${result}`);
    return result;
}

/** Linear interpolate between start to end time given alpha value.
 * Alpha value must be around 0-1.
 */
export function lerp(alpha: number, start: number, end: number, easing?: EasingFunction): number {
    if (!easing) {
        easing = (x) => x;
    }
    if (alpha > 1) {
        logger.warn(tag('lerp'), 'Alpha value is larger than 1, may have unintended result');
    }
    if (alpha < 0) {
        logger.warn(tag('lerp'), 'Alpha value is smaller than 0, may have unintended result');
    }
    const result = start + (end - start) * easing(alpha);
    logger.verbose(tag('lerp'), `Obtained ${result}`);
    return result;
}

export function equalNear(value: number, compareTo: number, tolerance = Number.EPSILON): boolean {
    return Math.abs(value - compareTo) <= tolerance;
}
