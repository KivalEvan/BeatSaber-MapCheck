import type { IWrapColorNote } from '../../../types/beatmap/wrapper/colorNote.ts';
import type { IWrapObstacle } from '../../../types/beatmap/wrapper/obstacle.ts';
import type { IWrapBasicEvent } from '../../../types/beatmap/wrapper/basicEvent.ts';
import type { Easings } from '../../../types/easings.ts';
import type { ColorArray, ColorInput, ColorType } from '../../../types/colors.ts';
import type { SetOptions } from './options.ts';

export type IChromaObject = IWrapColorNote | IWrapObstacle | IWrapBasicEvent;

export interface SetColorOptions {
   color: ColorInput;
   colorType?: ColorType;
}

export interface SetColorRangeOptions extends SetOptions {
   color1: ColorInput;
   color2: ColorInput;
   colorType?: ColorType;
}

export interface SetColorGradientOptions extends SetOptions {
   colorStart: ColorInput;
   colorEnd: ColorInput;
   colorType?: ColorType;
   easingColor?: (x: number) => number;
}

export interface ShiftColorBaseOptions extends SetOptions {
   hue?: number;
   saturation?: number;
   value?: number;
   alpha?: number;
}

export interface ShiftColorOptions extends ShiftColorBaseOptions {
   fixedHue?: boolean;
   fixedSaturation?: boolean;
   fixedValue?: boolean;
   fixedAlpha?: boolean;
}

export interface ShiftColorGradientOptions extends ShiftColorBaseOptions {
   reverse?: boolean;
   easing?: (x: number) => number;
}

export interface ApplyEasingsOptions {
   easing: Easings;
   type?: IWrapBasicEvent['type'];
}

export interface pRandomLightIDOptions {
   colorStart: ColorArray;
   colorEnd: ColorArray;
   colorType?: 'rgba' | 'long hsva' | 'short hsva';
   type: IWrapBasicEvent['type'];
   duration: number;
   length: number;
   precision: number;
   step: number;
   lightOff: boolean;
   offStrobe: boolean;
   lightID: number[];
   lightIDMulti?: number;
   offsetEnd?: boolean;
   easingColor?: (x: number) => number;
}

export interface pRandomLightI2DOptions {
   startColor: ColorArray;
   endColor: ColorArray;
   colorType?: 'rgba' | 'long hsva' | 'short hsva';
   type: never;
   duration: number;
   length: number;
   precision: number;
   step: number;
   lightOff: boolean;
   offStrobe: boolean;
   lightID: [IWrapBasicEvent['type'], number][];
   lightIDMulti?: number;
   offsetEnd?: boolean;
   easingColor?: (x: number) => number;
}
