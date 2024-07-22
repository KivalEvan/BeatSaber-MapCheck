import { hsvaToRgba, rgbaToHsva } from '../../utils/colors.ts';
import type { ColorArray } from '../../types/colors.ts';
import { clamp } from '../../utils/math.ts';
import type { IChromaObject, ShiftColorOptions } from './types/colors.ts';
import type { IChromaEventLight } from '../../types/beatmap/v3/custom/chroma.ts';

export function shiftColor(objects: IChromaObject[], options: ShiftColorOptions) {
   const opt: Omit<Required<ShiftColorOptions>, 'type'> = {
      offsetStart: options.offsetStart,
      offsetEnd: options.offsetEnd,
      hue: options.hue ?? 0,
      saturation: options.saturation ?? 100,
      value: options.value ?? 0,
      alpha: options.alpha ?? 0,
      fixedHue: options.fixedHue ?? false,
      fixedSaturation: options.fixedSaturation ?? false,
      fixedValue: options.fixedValue ?? false,
      fixedAlpha: options.fixedAlpha ?? false,
   };
   const hsvaShift: ColorArray = [
      opt.hue >= 0 ? (opt.hue / 360) % 1 : (((opt.hue % 360) + 360) / 360) % 1,
      opt.saturation / 100,
      opt.value,
      opt.alpha,
   ];
   const shift = (currentColor: ColorArray, shiftHSVA: ColorArray, settings: typeof opt) => {
      return hsvaToRgba(
         rgbaToHsva(currentColor).map((hsva, i) => {
            if (i === 0 && typeof hsva === 'number') {
               if (settings.fixedHue) {
                  return shiftHSVA[0];
               } else {
                  return hsva + shiftHSVA[0];
               }
            }
            if (i === 1 && typeof hsva === 'number') {
               if (settings.fixedHue) {
                  return clamp(hsva * shiftHSVA[1], 0, 1);
               } else {
                  return hsva + shiftHSVA[1];
               }
            }
            if (i === 2 && typeof hsva === 'number') {
               if (settings.fixedValue) {
                  return shiftHSVA[2];
               } else {
                  return hsva + shiftHSVA[2];
               }
            }
            if (i === 3 && typeof hsva === 'number' && typeof shiftHSVA[3] === 'number') {
               if (settings.fixedAlpha) {
                  return shiftHSVA[3];
               } else {
                  return hsva + shiftHSVA[3];
               }
            }
            return hsva;
         }) as ColorArray,
      ) as ColorArray;
   };
   objects.forEach((obj) => {
      const cd = obj.customData as IChromaEventLight;
      if (cd.color) {
         cd.color = shift(cd.color, hsvaShift, opt);
      }
   });
}
