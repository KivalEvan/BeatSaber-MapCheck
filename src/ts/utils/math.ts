import logger from '../logger';

// deno-lint-ignore ban-types
const tag = (func: Function) => {
    return `[utils::math::${func.name}]`;
};

export const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const round = (num: number, d = 0): number => {
    return Math.round(num * Math.pow(10, d)) / Math.pow(10, d);
};

export const radToDeg = (rad: number) => {
    return rad * (180 / Math.PI);
};

export const degToRad = (deg: number) => {
    return deg * (Math.PI / 180);
};

// thanks Top_Cat#1961
export const mod = (x: number, m: number): number => {
    if (m < 0) {
        m = -m;
    }
    const r = x % m;
    return r < 0 ? r + m : r;
};
export const shortRotDistance = (a: number, b: number, m: number): number => {
    return Math.min(mod(a - b, m), mod(b - a, m));
};

export const median = (numArr: number[]): number => {
    if (numArr.length === 0) {
        return 0;
    }
    numArr.sort((a: number, b: number) => a - b);
    const mid = Math.floor(numArr.length / 2);
    if (numArr.length % 2) {
        return numArr[mid];
    }
    return (numArr[mid - 1] + numArr[mid]) / 2;
};

export const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(min, value), max);
};

/** Normalize value to 0-1 from given min and max value. */
export const normalize = (value: number, min: number, max: number): number => {
    if (min >= max) {
        logger.warn(
            tag(normalize),
            'Min value is equal or more than max value, returning 1'
        );
        return 1;
    }
    const result = (value - min) / (max - min);
    logger.verbose(tag(normalize), `Obtained ${result}`);
    return result;
};

/** Linear interpolate between start to end time given alpha value.
 * Alpha value must be around 0-1.
 */
export const lerp = (
    alpha: number,
    start: number,
    end: number,
    easing?: (x: number) => number
): number => {
    if (!easing) {
        easing = (x) => x;
    }
    if (alpha > 1) {
        logger.warn(
            tag(lerp),
            'Alpha value is larger than 1, may have unintended result'
        );
    }
    if (alpha < 0) {
        logger.warn(
            tag(lerp),
            'Alpha value is smaller than 0, may have unintended result'
        );
    }
    const result = start + (end - start) * easing(alpha);
    logger.verbose(tag(lerp), `Obtained ${result}`);
    return result;
};
