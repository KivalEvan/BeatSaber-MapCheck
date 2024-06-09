import type { ISchemaContainer } from '../../../types/beatmap/shared/schema.ts';
import type { IArc } from '../../../types/beatmap/v2/arc.ts';
import type { IWrapArcAttribute } from '../../../types/beatmap/wrapper/arc.ts';
import { deepCopy } from '../../../utils/misc.ts';

const defaultValue = {
   _colorType: 0,
   _headTime: 0,
   _headLineIndex: 0,
   _headLineLayer: 0,
   _headCutDirection: 0,
   _headControlPointLengthMultiplier: 0,
   _tailTime: 0,
   _tailLineIndex: 0,
   _tailLineLayer: 0,
   _tailCutDirection: 0,
   _tailControlPointLengthMultiplier: 0,
   _sliderMidAnchorMode: 0,
   _customData: {},
} as Required<IArc>;
export const arc: ISchemaContainer<IWrapArcAttribute, IArc> = {
   defaultValue,
   serialize(data: IWrapArcAttribute): IArc {
      return {
         _colorType: data.color,
         _headTime: data.time,
         _headLineIndex: data.posX,
         _headLineLayer: data.posY,
         _headCutDirection: data.direction,
         _headControlPointLengthMultiplier: data.lengthMultiplier,
         _tailTime: data.tailTime,
         _tailLineIndex: data.tailPosX,
         _tailLineLayer: data.tailPosY,
         _tailCutDirection: data.tailDirection,
         _tailControlPointLengthMultiplier: data.tailLengthMultiplier,
         _sliderMidAnchorMode: data.midAnchor,
         _customData: deepCopy(data.customData),
      };
   },
   deserialize(data: Partial<IArc> = {}): Partial<IWrapArcAttribute> {
      return {
         color: data._colorType ?? defaultValue._colorType,
         time: data._headTime ?? defaultValue._headTime,
         posX: data._headLineIndex ?? defaultValue._headLineIndex,
         posY: data._headLineLayer ?? defaultValue._headLineLayer,
         direction: data._headCutDirection ?? defaultValue._headCutDirection,
         lengthMultiplier:
            data._headControlPointLengthMultiplier ??
            defaultValue._headControlPointLengthMultiplier,
         tailTime: data._tailTime ?? defaultValue._tailTime,
         tailPosX: data._tailLineIndex ?? defaultValue._tailLineIndex,
         tailPosY: data._tailLineLayer ?? defaultValue._tailLineLayer,
         tailDirection: data._tailCutDirection ?? defaultValue._tailCutDirection,
         tailLengthMultiplier:
            data._tailControlPointLengthMultiplier ??
            defaultValue._tailControlPointLengthMultiplier,
         midAnchor: data._sliderMidAnchorMode ?? defaultValue._sliderMidAnchorMode,
         customData: deepCopy(data._customData ?? defaultValue._customData),
      };
   },
};
