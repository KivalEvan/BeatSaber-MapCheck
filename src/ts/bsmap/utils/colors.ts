// deno-lint-ignore-file prefer-const
import type { ColorArray, ColorInput, ColorObject, ColorType, IColor } from '../types/colors.ts';
import type { EasingFunction } from '../types/easings.ts';
import { degToRad, lerp, radToDeg, round } from './math.ts';
import { hexToDec, isHex } from './misc.ts';

/**
 * Convert RGBA value to HSVA array.
 * ```
 * const hsva1 = rgbaToHsva(r, g, b, a);
 * const hsva2 = rgbaToHsva(rgba);
 * ```
 */
export function rgbaToHsva(r: number, g: number, b: number, a?: number): ColorArray;
export function rgbaToHsva(color: ColorArray): ColorArray;
export function rgbaToHsva(r: number | ColorArray, g?: number, b?: number, a?: number): ColorArray {
   if (Array.isArray(r)) {
      a = r[3];
      b = r[2]!;
      g = r[1]!;
      r = r[0]!;
   }
   (r = r!), (g = g!), (b = b!);
   let h = 0;
   const max = Math.max(r, g, b);
   const min = Math.min(r, g, b);
   const d = max - min;
   const s = max === 0 ? 0 : d / max;
   const v = max;

   switch (max) {
      case min:
         break;
      case r:
         h = g - b + d * (g < b ? 6 : 0);
         h /= 6 * d;
         break;
      case g:
         h = b - r + d * 2;
         h /= 6 * d;
         break;
      case b:
         h = r - g + d * 4;
         h /= 6 * d;
         break;
   }
   const result: ColorArray = [h * 360, s, v];
   if (typeof a === 'number') result.push(a);
   return result;
}

/**
 * Convert HSVA value to RGBA array.
 * ```
 * const rgba1 = hsvaToRgba(h, s, v, a);
 * const rgba2 = hsvaToRgba(hsva);
 * ```
 */
export function hsvaToRgba(
   hue: number,
   saturation: number,
   value: number,
   alpha?: number,
): ColorArray;
export function hsvaToRgba(color: ColorArray): ColorArray;
export function hsvaToRgba(
   hue: number | ColorArray,
   saturation?: number,
   value?: number,
   alpha?: number,
): ColorArray {
   if (Array.isArray(hue)) {
      alpha = hue[3];
      value = hue[2]!;
      saturation = hue[1]!;
      hue = hue[0]!;
   }
   (hue = hue! / 360), (saturation = saturation!), (value = value!);
   if (hue < 0) {
      hue += Math.abs(Math.floor(hue));
   }
   let r = 0,
      g = 0,
      b = 0;
   const i = Math.floor(hue * 6);
   const f = hue * 6 - i;
   const p = value * (1 - saturation);
   const q = value * (1 - f * saturation);
   const t = value * (1 - (1 - f) * saturation);
   switch (i % 6) {
      case 0:
         (r = value), (g = t), (b = p);
         break;
      case 1:
         (r = q), (g = value), (b = p);
         break;
      case 2:
         (r = p), (g = value), (b = t);
         break;
      case 3:
         (r = p), (g = q), (b = value);
         break;
      case 4:
         (r = t), (g = p), (b = value);
         break;
      case 5:
         (r = value), (g = p), (b = q);
         break;
   }
   const result: ColorArray = [r, g, b];
   if (typeof alpha === 'number') result.push(alpha);
   return result;
}

/**
 * Interpolate between colors and returns RGBA array.
 * ```ts
 * const rgba = lerpColor([90, 1, 1], [180, 1, 1], 0.5, 'hsva');
 * ```
 */
export function lerpColor(
   start: ColorInput,
   end: ColorInput,
   alpha: number,
   type: ColorType = 'rgba',
   easing?: EasingFunction,
): ColorArray {
   if (!easing) {
      easing = (x: number) => {
         return x;
      };
   }
   const cType = type === 'rgba255' ? 'rgba' : (type as 'rgba' | 'hsva');
   const cStart = convertColorType(start, cType, cType);
   const cEnd = convertColorType(end, cType, cType);
   if (cStart.length !== cEnd.length) {
      if (cStart.length === 3) cStart.push(1);
      if (cEnd.length === 3) cEnd.push(1);
   }
   if (alpha === 0) return convertColorType(cStart, cType, 'rgba');
   if (alpha === 1) return convertColorType(cEnd, cType, 'rgba');
   const lerpedColor: ColorArray = [
      lerp(easing(alpha), cStart[0], cEnd[0]),
      lerp(easing(alpha), cStart[1], cEnd[1]),
      lerp(easing(alpha), cStart[2], cEnd[2]),
   ];
   if (cStart.length > 3) {
      lerpedColor.push(lerp(easing(alpha), cStart[3]!, cEnd[3]!));
   }
   switch (cType) {
      case 'hsva': {
         return hsvaToRgba(lerpedColor);
      }
      default:
         return lerpedColor;
   }
}

function compToHex(c: number): string {
   const hex = c.toString(16);
   return hex.length === 1 ? '0' + hex : hex;
}

function cDenorm(c: number): number {
   return Math.round(c * 255);
}

function cNorm(c: number): number {
   return c / 255;
}

export function toColorObject(color: ColorInput | IColor, ensureAlpha?: boolean): IColor;
export function toColorObject(color: ColorInput | IColor, ensureAlpha: true): Required<IColor>;
export function toColorObject(color: ColorInput | IColor, ensureAlpha?: boolean): IColor {
   if (Array.isArray(color)) {
      const result: IColor = { r: color[0], g: color[1], b: color[2] };
      if (typeof color[3] === 'number') result.a = color[3];
      if (ensureAlpha) {
         result.a ??= 1;
      }
      return result;
   }
   if (typeof color === 'string') return toColorObject(colorFrom(color), ensureAlpha);
   if ('type' in color) {
      return toColorObject(colorFrom(color), ensureAlpha);
   }
   const newColor: IColor = { r: color.r, g: color.g, b: color.b };
   if (typeof color.a === 'number') newColor.a = color.a;
   if (ensureAlpha) {
      newColor.a ??= 1;
   }
   return newColor;
}

export function colorToHex(color: ColorInput | IColor): string {
   const obj: IColor = toColorObject(color);
   let max = 1;
   for (const c in obj) {
      max = Math.max(Math.abs(obj[c as keyof IColor]!), max);
   }
   for (const c in obj) {
      obj[c as keyof IColor] = cDenorm(obj[c as keyof IColor]! / max);
   }
   return `#${compToHex(obj.r)}${compToHex(obj.g)}${compToHex(obj.b)}${
      typeof obj.a === 'number' ? compToHex(obj.a) : ''
   }`;
}

export function hexToRgba(hex: string): ColorArray {
   hex = hex.trim();
   if (hex.startsWith('#')) {
      hex = hex.substring(1);
   }
   if (!isHex(hex)) {
      throw new Error('Not valid hexadecimal');
   }
   let result: ColorArray = [0, 0, 0];

   if (hex.length === 3 || hex.length === 4) {
      result = [
         cNorm(hexToDec(hex.slice(0, 1) + hex.slice(0, 1))),
         cNorm(hexToDec(hex.slice(1, 2) + hex.slice(1, 2))),
         cNorm(hexToDec(hex.slice(2, 3) + hex.slice(2, 3))),
      ];
      if (hex.length === 4) {
         result.push(cNorm(hexToDec(hex.slice(3, 4) + hex.slice(3, 4))));
      }
   } else if (hex.length === 6 || hex.length === 8) {
      result = [
         cNorm(hexToDec(hex.slice(0, 2))),
         cNorm(hexToDec(hex.slice(2, 4))),
         cNorm(hexToDec(hex.slice(4, 6))),
      ];
      if (hex.length === 8) {
         result.push(cNorm(hexToDec(hex.slice(6, 8))));
      }
   } else {
      throw new Error('Not valid colour hexadecimal');
   }
   return result;
}

/**
 * Convert color input to standard RGBA array.
 * ```ts
 * const rgba = convertColorType([30, 0.75, 1], 'hsva')
 * ```
 *
 * Default color output type is RGBA unless specified otherwise.
 */
export function convertColorType(
   color: ColorInput | IColor,
   type: ColorType = 'rgba',
   output: 'rgba' | 'hsva' = 'rgba',
): ColorArray {
   if (typeof color === 'string') {
      const temp = hexToRgba(color);
      if (output === 'hsva') {
         return rgbaToHsva(temp);
      }
      return temp;
   } else if (Array.isArray(color)) {
      if (type === 'hsva') {
         return output === 'hsva' ? ([...color] satisfies ColorArray) : hsvaToRgba(color);
      }
      const temp =
         type === 'rgba255'
            ? (color.map((n) => cNorm(n!)) as ColorArray)
            : ([...color] satisfies ColorArray);
      return output === 'hsva' ? rgbaToHsva(temp) : temp;
   } else {
      if ('type' in color) {
         let temp;
         switch (color.type) {
            case 'hsva':
               temp = colorFrom(color.value, 'hsva');
               break;
            case 'rgba':
               temp = colorFrom(color.value, 'rgba');
               break;
            case 'rgba255':
               temp = colorFrom(color.value, 'rgba255');
         }
         return output === 'hsva' ? rgbaToHsva(temp) : temp;
      } else {
         const temp: ColorArray = [color.r, color.g, color.b];
         if (typeof color.a === 'number') {
            temp.push(color.a);
         }
         return output === 'hsva' ? rgbaToHsva(temp) : temp;
      }
   }
}

// https://www.easyrgb.com/ with Adobe RGB reference value
export function rgbaToLabA(rgbaAry: ColorArray): ColorArray {
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

   const result: ColorArray = [116 * y - 16, 500 * (x - y), 200 * (y - z)];
   if (typeof rgbaAry[3] === 'number') result.push(rgbaAry[3]);
   return result;
}

export function labToHue(a: number, b: number): number {
   let bias = 0;
   if (a >= 0 && b === 0) return 0;
   if (a < 0 && b === 0) return 180;
   if (a === 0 && b > 0) return 90;
   if (a === 0 && b < 0) return 270;
   if (a > 0 && b > 0) bias = 0;
   if (a < 0) bias = 180;
   if (a > 0 && b < 0) bias = 360;
   return radToDeg(Math.atan(b / a)) + bias;
}

export function deltaE00(rgbaAry1: ColorArray, rgbaAry2: ColorArray): number {
   const [l1, a1, b1] = rgbaToLabA(rgbaAry1);
   const [l2, a2, b2] = rgbaToLabA(rgbaAry2);

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
}

/** Return RGBA color array from input. */
export function colorFrom(r: number, g: number, b: number, a?: number): ColorArray;
export function colorFrom(
   r: number,
   g: number,
   b: number,
   a: number,
   type: 'rgba',
): Required<ColorArray>;
export function colorFrom(
   r: number,
   g: number,
   b: number,
   a: number,
   type: 'rgba255',
): Required<ColorArray>;
export function colorFrom(
   h: number,
   s: number,
   v: number,
   a: number,
   type: 'hsva',
): Required<ColorArray>;
export function colorFrom(r: number, g: number, b: number, type: 'rgba'): ColorArray;
export function colorFrom(r: number, g: number, b: number, type: 'rgba255'): ColorArray;
export function colorFrom(h: number, s: number, v: number, type: 'hsva'): ColorArray;
export function colorFrom(value: number): ColorArray;
export function colorFrom(value: number, normalise255?: boolean): ColorArray;
export function colorFrom(value: number, alpha: number): Required<ColorArray>;
export function colorFrom(hex: string): ColorArray;
export function colorFrom(color: (number | undefined)[]): ColorArray;
export function colorFrom(color: (number | undefined)[], type: 'rgba'): ColorArray;
export function colorFrom(color: (number | undefined)[], type: 'rgba255'): ColorArray;
export function colorFrom(color: (number | undefined)[], type: 'hsva'): ColorArray;
export function colorFrom(color: ColorObject): ColorArray;
export function colorFrom(color: IColor): ColorArray;
export function colorFrom(): ColorArray {
   const args = arguments;
   if (typeof args[0] === 'number' && typeof args[1] === 'number' && typeof args[2] === 'number') {
      let val: ColorArray = [args[0], args[1], args[2]];
      if (typeof args[3] === 'number') {
         val.push(args[3]);
      }
      if (typeof args[3] === 'string') {
         if (args[3] === 'hsva') {
            val = convertColorType(val, 'hsva');
         }
         if (args[3] === 'rgba255') {
            val = convertColorType(val, 'rgba255');
         }
      }
      if (typeof args[4] === 'string') {
         if (args[4] === 'hsva') {
            val = convertColorType(val, 'hsva');
         }
         if (args[4] === 'rgba255') {
            val = convertColorType(val, 'rgba255');
         }
      }
      return val;
   }
   if (typeof args[0] === 'number') {
      if (typeof args[1] === 'boolean' && args[1]) {
         return [args[0] / 255, args[0] / 255, args[0] / 255];
      }
      if (typeof args[1] === 'number') {
         return [args[0], args[0], args[0], args[1]];
      }
      return [args[0], args[0], args[0]];
   }
   if (typeof args[0] === 'string') {
      return hexToRgba(args[0]);
   }
   if (Array.isArray(args[0])) {
      const ary = args[0];
      let val: ColorArray = [ary[0], ary[1], ary[2]];
      if (!val.every((v) => typeof v === 'number')) {
         throw new Error('Unable to parse color; array contain undefined or non-numeric value');
      }
      if (typeof ary[3] === 'number') {
         val.push(ary[3]);
      }
      if (typeof args[1] === 'string') {
         if (args[1] === 'hsva') {
            val = convertColorType(val, 'hsva');
         }
         if (args[1] === 'rgba255') {
            val = convertColorType(val, 'rgba255');
         }
      }
      return val;
   }
   if (typeof args[0] === 'object') {
      const obj: IColor | ColorObject = args[0];
      if ('type' in obj) {
         switch (obj.type) {
            case 'hsva':
               return colorFrom(obj.value, 'hsva');
            case 'rgba':
               return colorFrom(obj.value, 'rgba');
            case 'rgba255':
               return colorFrom(obj.value, 'rgba255');
         }
      }
      if ('r' in obj && 'g' in obj && 'b' in obj) {
         const val: ColorArray = [obj.r, obj.g, obj.b];
         if (!val.every((v) => typeof v === 'number')) {
            throw new Error('Unable to parse color; array contain undefined or non-numeric value');
         }
         if (typeof obj.a === 'number') {
            val.push(obj.a);
         }
         return val;
      }
   }

   throw new Error('Unable to parse color; input is invalid');
}
