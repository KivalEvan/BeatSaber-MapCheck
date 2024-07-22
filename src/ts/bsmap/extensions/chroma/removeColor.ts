import type { IChromaObject } from './types/colors.ts';

export function removeColor(objects: IChromaObject[]): void {
   objects.forEach((obj) => {
      const cd = obj.customData;
      if (cd.color) {
         delete cd.color;
      }
   });
}
