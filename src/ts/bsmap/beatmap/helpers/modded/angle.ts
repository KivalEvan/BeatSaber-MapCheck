import type { IWrapBaseItemAttribute } from '../../../types/beatmap/wrapper/baseItem.ts';

export function getNoodleExtensionsAngleV2(data: IWrapBaseItemAttribute): number | null {
   if (data.customData._cutDirection) {
      return data.customData._cutDirection > 0
         ? data.customData._cutDirection % 360
         : 360 + (data.customData._cutDirection % 360);
   }
   return null;
}
