import type { Vector3, Vector4 } from './vector.ts';

/** Standard color object. */
export interface IColor {
   r: number;
   g: number;
   b: number;
   a?: number;
}

/**
 * Standard color array.
 * ```ts
 * const color = [red, green, blue] || [red, green, blue, alpha];
 * ```
 */
export type ColorArray = Vector3 | Vector4;

export type ColorType = 'rgba' | 'rgba255' | 'hsva';

interface IColorBase {
   type: ColorType;
   value: ColorArray;
}

interface IColorRGBA extends IColorBase {
   type: 'rgba';
   value: ColorArray;
}

interface IColorRGBA255 extends IColorBase {
   type: 'rgba255';
   value: ColorArray;
}

interface IColorHSVA extends IColorBase {
   type: 'hsva';
   value: ColorArray;
}

export type ColorObject = IColorRGBA | IColorRGBA255 | IColorHSVA;

export type ColorInput = ColorArray | ColorObject | string;
