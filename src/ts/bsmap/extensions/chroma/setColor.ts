import type {
   IChromaObject,
   SetColorGradientOptions,
   SetColorOptions,
   SetColorRangeOptions,
} from './types/colors.ts';
import { convertColorType, lerpColor } from '../../utils/colors.ts';
import { normalize } from '../../utils/math.ts';
import type { IChromaEventLight } from '../../types/beatmap/v3/custom/chroma.ts';
import { settings } from './settings.ts';
import logger from '../../logger.ts';

function tag(name: string): string[] {
   return ['ext', 'chroma', 'color', name];
}

export function setColor(objects: IChromaObject[], options: SetColorOptions): void {
   const opt: Required<SetColorOptions> = {
      color: options.color,
      colorType: options.colorType ?? (settings.colorType || 'hsva'),
   };
   const color = convertColorType(opt.color, opt.colorType);
   objects.forEach((obj) => {
      (obj.customData as IChromaEventLight).color = color;
   });
}

export function setColorGradient(objects: IChromaObject[], options: SetColorGradientOptions) {
   if (!objects.length) {
      logger.tWarn(tag('setColorGradient'), 'No object(s) received.');
      return;
   }
   const opt: Required<SetColorGradientOptions> = {
      offsetStart: options.offsetStart,
      offsetEnd: options.offsetEnd,
      colorStart: options.colorStart,
      colorEnd: options.colorEnd,
      colorType: options.colorType ?? 'rgba',
      easingColor:
         options.easingColor ??
         function (x: number) {
            return x;
         },
   };
   const startTime = objects.at(0)!.time + opt.offsetStart;
   const endTime = objects.at(-1)!.time + opt.offsetEnd;
   objects.forEach((obj) => {
      const norm = normalize(obj.time, startTime, endTime);
      const color = lerpColor(opt.colorStart, opt.colorEnd, norm, opt.colorType, opt.easingColor);
      (obj.customData as IChromaEventLight).color = color;
   });
}

export function setColorRandom(objects: IChromaObject[], options: SetColorRangeOptions) {
   const opt: Required<SetColorRangeOptions> = {
      offsetStart: options.offsetStart,
      offsetEnd: options.offsetEnd,
      color1: options.color1,
      color2: options.color2,
      colorType: options.colorType ?? 'rgba',
   };
   let random = 0;
   let prevTime = 0;
   for (let i = 0, l = objects.length; i < l; i++) {
      if (objects[i].time > prevTime + 0.001) {
         random = Math.random();
      }
      const color = lerpColor(opt.color1, opt.color2, random, opt.colorType);
      objects[i].customData._color = color;
      prevTime = objects[i].time;
   }
}
