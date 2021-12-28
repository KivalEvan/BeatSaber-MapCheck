import { round, radToDeg, degToRad } from './utils';

export interface ColorObject {
    r: number;
    g: number;
    b: number;
    a?: number;
    [key: string]: number | undefined;
}

export type ColorArray = [number, number, number] | [number, number, number, number];

export const toRGBArray = (c: ColorObject): ColorArray => {
    return [c.r, c.g, c.b];
};

export const compToHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
};

export const cDenorm = (c: number): number => {
    return c > 1 && !(c < 0) ? 255 : round(c * 255);
};

export const rgbaToHex = (colorObj?: ColorObject | null): string | null => {
    if (!colorObj) {
        return null;
    }
    const color: ColorObject = { r: 0, g: 0, b: 0 };
    for (const c in colorObj) {
        const num: number | undefined = colorObj[c];
        if (num === undefined) {
            continue;
        }
        color[c] = cDenorm(num);
    }
    return `#${compToHex(color.r)}${compToHex(color.g)}${compToHex(color.b)}${
        color.a ? compToHex(color.a) : ''
    }`;
};

// https://www.easyrgb.com/ with Adobe RGB reference value
export const rgbToLab = (rgbaAry: ColorArray) => {
    let r = rgbaAry[0],
        g = rgbaAry[1],
        b = rgbaAry[2],
        x: number,
        y: number,
        z: number;

    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
};

export const labToHue = (a: number, b: number): number => {
    let bias = 0;
    if (a >= 0 && b === 0) return 0;
    if (a < 0 && b === 0) return 180;
    if (a === 0 && b > 0) return 90;
    if (a === 0 && b < 0) return 270;
    if (a > 0 && b > 0) bias = 0;
    if (a < 0) bias = 180;
    if (a > 0 && b < 0) bias = 360;
    return radToDeg(Math.atan(b / a)) + bias;
};

export const deltaE00 = (rgbaAry1: ColorArray, rgbaAry2: ColorArray): number => {
    const [l1, a1, b1] = rgbToLab(rgbaAry1);
    const [l2, a2, b2] = rgbToLab(rgbaAry2);

    const wL = 1;
    const wC = 1;
    const wH = 1;

    let c1: number,
        c2: number,
        cX: number,
        cY: number,
        gX: number,
        h1: number,
        h2: number,
        hX: number,
        nN: number,
        lX: number,
        tX: number,
        sL: number,
        sC: number,
        sH: number,
        pH: number,
        rC: number,
        rT: number,
        dL: number,
        dC: number,
        dH: number;

    c1 = Math.sqrt(a1 * a1 + b1 * b1);
    c2 = Math.sqrt(a2 * a2 + b2 * b2);
    cX = (c1 + c2) / 2;
    gX = 0.5 * (1 - Math.sqrt((cX ^ 7) / ((cX ^ 7) + (25 ^ 7))));
    nN = (1 + gX) * a1;
    c1 = Math.sqrt(nN * nN + b1 * b1);
    h1 = labToHue(nN, b1);
    nN = (1 + gX) * a2;
    c2 = Math.sqrt(nN * nN + b2 * b2);
    h2 = labToHue(nN, b2);
    dL = l2 - l1;
    dC = c2 - c1;
    if (c1 * c2 == 0) {
        dH = 0;
    } else {
        nN = round(h2 - h1, 12);
        if (Math.abs(nN) <= 180) {
            dH = h2 - h1;
        } else {
            if (nN > 180) dH = h2 - h1 - 360;
            else dH = h2 - h1 + 360;
        }
    }

    dH = 2 * Math.sqrt(c1 * c2) * Math.sin(degToRad(dH / 2));
    lX = (l1 + l2) / 2;
    cY = (c1 + c2) / 2;
    if (c1 * c2 == 0) {
        hX = h1 + h2;
    } else {
        nN = Math.abs(round(h1 - h2, 12));
        if (nN > 180) {
            if (h2 + h1 < 360) hX = h1 + h2 + 360;
            else hX = h1 + h2 - 360;
        } else {
            hX = h1 + h2;
        }
        hX /= 2;
    }
    tX =
        1 -
        0.17 * Math.cos(degToRad(hX - 30)) +
        0.24 * Math.cos(degToRad(2 * hX)) +
        0.32 * Math.cos(degToRad(3 * hX + 6)) -
        0.2 * Math.cos(degToRad(4 * hX - 63));
    pH = 30 * Math.exp(-((hX - 275) / 25) * ((hX - 275) / 25));
    rC = 2 * Math.sqrt((cY ^ 7) / ((cY ^ 7) + (25 ^ 7)));
    sL = 1 + (0.015 * ((lX - 50) * (lX - 50))) / Math.sqrt(20 + (lX - 50) * (lX - 50));

    sC = 1 + 0.045 * cY;
    sH = 1 + 0.015 * cY * tX;
    rT = -Math.sin(degToRad(2 * pH)) * rC;

    dL = dL / (wL * sL);
    dC = dC / (wC * sC);
    dH = dH / (wH * sH);

    return Math.sqrt(dL * dL + dC * dC + dH * dH + rT * dC * dH);
};
