import type { EasingFunction } from '../types/easings.ts';
import type { Vector3 } from '../types/vector.ts';

/**
 * Return number in formatted number string.
 * ```ts
 * console.log(formatNumber(12345678)); // 12,345,678
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
const _seed = { ref: hashCode(Math.random()) };

/**
 * Mulberry32 algorithm.
 *
 * shamelessly taken from stackoverflow
 */
function _pRandom(seed: number | { ref: number }): () => number {
   const _s = typeof seed === 'number' ? { ref: seed } : seed;
   return function () {
      let s = (_s.ref += 0x6d2b79f5);
      s = Math.imul(s ^ (s >>> 15), s | 1);
      s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
      return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
   };
}
const _instPRandom = _pRandom(_seed);

function _random(
   min?: number | boolean,
   max?: number | boolean,
   rounding: number | boolean = false,
   fn: () => number = Math.random,
) {
   if (typeof min === 'boolean' || (!min && typeof min !== 'number')) {
      if (min) {
         return Math.round(fn());
      }
      return fn();
   }
   if (typeof max === 'boolean' || (!max && typeof max !== 'number')) {
      let result = fn() * min;
      if (max) {
         result = Math.round(result);
      }
      return result;
   }
   [min, max] = rearrangeTuple(min, max);
   const result = fn() * (max - min) + min;
   return rounding
      ? round(result, typeof rounding === 'number' && rounding > 0 ? rounding : 0)
      : result;
}

/**
 * Seeded pseudorandom generator.
 *
 * Based on Mulberry32 PRNG algorithm.
 *
 * **NOTE:** This is globally scoped, any random call elsewhere will affect the consequent call.
 * Consider creating instance of pseudorandom with `pRandomFn` if you need consistency across usage.
 * Reset the random seed to retain same randomness if needed.
 *
 * **WARNING:** This is not meant to be used for security, rather quick and simple for pseudorandom purpose.
 */
export function pRandom(max: number, int?: boolean): number;
export function pRandom(int?: boolean): number;
export function pRandom(min: number, max: number): number;
export function pRandom(min: number, max: number, rounding: boolean): number;
export function pRandom(min: number, max: number, rounding: number): number;
export function pRandom(
   min?: number | boolean,
   max?: number | boolean,
   rounding: number | boolean = false,
): number {
   return _random(min, max, rounding, _instPRandom);
}

/**
 * Create instance of pseudorandom function.
 * ```ts
 * const pRandom = utils.pRandomFn('seed');
 * console.log(pRandom());
 * ```
 *
 * **NOTE:** Seed cannot be reset.
 */
export function pRandomFn(
   seed: string | number | bigint = Math.random(),
): (min?: number | boolean, max?: number | boolean, rounding?: number | boolean) => number {
   const _seed = hashCode(seed);
   const _func = _pRandom(_seed);
   return function (
      min?: number | boolean,
      max?: number | boolean,
      rounding: number | boolean = false,
   ): number {
      return _random(min, max, rounding, _func);
   };
}

/**
 * Set seed for pseudorandom generator.
 *
 * Recalling this resets the seed.
 *
 * If this is never called, defaults to randomly generated seed.
 */
export function pRandomSeed(seed: string | number | bigint): void {
   _seed.ref = hashCode(seed);
}

/** Generate 32-bit hash with Java implementation. */
export function hashCode(str: string | number | bigint): number {
   str = str.toString();
   let hash = 0;
   for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
   }
   return hash;
}

/** Random number generator helpers using built-in JS Math. */
export function random(max: number, int?: boolean): number;
export function random(int?: boolean): number;
export function random(min: number, max: number): number;
export function random(min: number, max: number, rounding: boolean): number;
export function random(min: number, max: number, rounding: number): number;
export function random(
   min?: number | boolean,
   max?: number | boolean,
   rounding: number | boolean = false,
): number {
   return _random(min, max, rounding, Math.random);
}

/**
 * JS implementation of gaussian random using Box-Muller transformation and skew-normal.
 *
 * This returns value closer to `[-6, 6]` range but can be completely outside of the range due to precision.
 *
 * @link https://spin.atomicobject.com/skew-normal-prng-javascript/
 */
export function randomNormal(
   mean = 0,
   stdev = 1,
   skew = 0,
   rand: () => number = Math.random,
): number {
   let u1 = 0;
   let u2 = 0;
   while (u1 === 0) u1 = rand();
   while (u2 === 0) u2 = rand();

   const mag = Math.sqrt(-2.0 * Math.log(u1));
   const dir = 2.0 * Math.PI * u2;

   const u0 = mag * Math.cos(dir);
   if (!skew) return mean + stdev * u0;

   const v = mag * Math.sin(dir);
   const co = skew / Math.sqrt(1 + skew * skew);
   const u3 = co * u0 + Math.sqrt(1 - co * co) * v;
   const z = u0 >= 0 ? u3 : -u3;
   return mean + stdev * z;
}

/** Return number tuple in order. */
export function rearrangeTuple(min: number, max: number, inverse?: boolean): [number, number] {
   if (!inverse && min > max) {
      return [max, min];
   }
   if (inverse && min < max) {
      return [max, min];
   }
   return [min, max];
}

export function round(num: number, d = 0): number {
   const r = Math.pow(10, d);
   return Math.round(num * r) / r;
}

/**
 * Return array of numbers given arguments.
 * ```ts
 * range(5); // [0, 1, 2, 3, 4]
 * range(5, true); // [0, 1, 2, 3, 4, 5]
 * range(5, 10); // [5, 6, 7, 8, 9]
 * range(5, 10, true); // [5, 6, 7, 8, 9, 10]
 * range(5, 10, 2); // [5, 7, 9]
 * ```
 */
export function range(n: number, inclusive?: boolean): number[];
export function range(start: number, end: number, inclusive?: boolean): number[];
export function range(start: number, end: number, step: number, inclusive?: boolean): number[];
export function range(
   arg0: number,
   arg1?: number | boolean,
   arg2?: number | boolean,
   arg3?: boolean,
): number[] {
   let start = arg0;
   let inc = arg3;
   let end!: number;
   let step!: number;
   if (typeof arg1 === 'boolean') {
      end = 0;
      inc = arg1;
   } else if (typeof arg1 === 'number') {
      end = arg1;
   } else {
      end = start;
      start = 0;
   }
   if (typeof arg2 === 'boolean') {
      inc = arg2;
   } else {
      step = arg2!;
   }
   if (!step) step = start > end ? -1 : 1;
   const ary = new Array(Math.abs(Math.ceil((end - start) / step)) + (inc ? 1 : 0));
   for (let i = 0; i < ary.length; i++) {
      ary[i] = start + i * step;
   }
   return ary;
}

export function radToDeg(rad: number): number {
   return rad * (180 / Math.PI);
}

export function degToRad(deg: number): number {
   return deg * (Math.PI / 180);
}

/** Return [radius, theta, phi] */
export function cartesianCoordToSphericalCoord(x: number, y: number, z: number): Vector3 {
   const radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
   return [radius, Math.acos(z / radius), (Math.atan2(y, x) + 2 * Math.PI) % (2 * Math.PI)];
}

/** Return [x, y, z] */
export function sphericalCoordToCartesianCoord(
   radius: number,
   theta: number,
   phi: number,
): Vector3 {
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

export function sumAry(nums: number[]): number {
   let sum = 0;
   for (const n of nums) sum += n;
   return sum;
}

export function productAry(nums: number[]): number {
   if (!nums.length) {
      return 0;
   }
   let prod = 1;
   for (const n of nums) prod *= n;
   return prod;
}

export function mean(nums: number[]): number {
   if (!nums.length) {
      return 0;
   }
   return sumAry(nums) / nums.length;
}

export function median(nums: number[]): number {
   if (!nums.length) {
      return 0;
   }
   const ary = nums.map((n: number) => n).sort((a: number, b: number) => a - b);
   const mid = Math.floor(ary.length / 2);
   if (ary.length % 2) {
      return ary[mid];
   }
   return (ary[mid - 1] + ary[mid]) / 2;
}

export function clamp(value: number, min: number, max: number): number {
   return Math.min(Math.max(min, value), max);
}

/**
 * Normalize value to 0-1 from given min and max value.
 *
 * Returns 1 if `max - min === 0`, values beyond will be extrapolated.
 */
export function normalize(value: number, min: number, max: number): number {
   if (max - min === 0) return 1;
   return (value - min) / (max - min);
}

/**
 * Linear interpolate between start to end time given alpha value.
 * ```ts
 * const num = lerp(0.5, 4, 8); // returns 6
 * ```
 *
 * Alpha value must be in range of `0-1`, otherwise extrapolated.
 */
export function lerp(alpha: number, from: number, to: number, easing?: EasingFunction): number {
   if (!easing) easing = (x) => x;
   return from + (to - from) * easing(alpha);
}

/**
 * Returns alpha value from interpolated value.
 * ```ts
 * const num = invLerp(6, 4, 8); // returns 0.5
 * ```
 */
export function invLerp(value: number, from: number, to: number): number {
   return (value - from) / (to - from);
}

/**
 * Remap the value from original range to target range.
 * ```ts
 * const num = remap(6, 4, 8, 40, 60); // returns 50
 * ```
 */
export function remap(
   value: number,
   origFrom: number,
   origTo: number,
   targetFrom: number,
   targetTo: number,
): number {
   const alpha = invLerp(value, origFrom, origTo);
   return lerp(alpha, targetFrom, targetTo);
}

/** Returns true if both value are approximately equal within given tolerance. */
export function nearEqual(n1: number, n2: number, tolerance = Number.EPSILON): boolean {
   return Math.abs(n1 - n2) <= tolerance;
}
