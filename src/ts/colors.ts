import { round } from './utils';

export interface Color {
    r: number;
    g: number;
    b: number;
    a?: number;
    [key: string]: number | undefined;
}

export const compToHex = (c: number): string => {
    let hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
};

export const cDenorm = (c: number): number => {
    return c > 1 && !(c < 0) ? 255 : round(c * 255);
};

export const rgbaToHex = (colorObj?: Color | null): string | null => {
    if (!colorObj) {
        return null;
    }
    let color: Color = { r: 0, g: 0, b: 0 };
    for (const c in colorObj) {
        let num: number | undefined = colorObj[c];
        if (num === undefined) {
            continue;
        }
        color[c] = cDenorm(num);
    }
    return `#${compToHex(color.r)}${compToHex(color.g)}${compToHex(color.b)}${
        color.a ? compToHex(color.a) : ''
    }`;
};
