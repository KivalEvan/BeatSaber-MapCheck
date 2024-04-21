import type { IArc } from '../../types/beatmap/v2/arc.ts';
import type { IWrapArcAttribute } from '../../types/beatmap/wrapper/arc.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapArc } from '../wrapper/arc.ts';

/** Arc beatmap v2 class object. */
export class Arc extends WrapArc<IArc> {
   static default: Required<IArc> = {
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
   };

   static create(...data: Partial<IWrapArcAttribute<IArc>>[]): Arc[] {
      const result: Arc[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapArcAttribute<IArc>> = {}) {
      super();
      this._color = data.color ?? Arc.default._colorType;
      this._time = data.time ?? Arc.default._headTime;
      this._posX = data.posX ?? Arc.default._headLineIndex;
      this._posY = data.posY ?? Arc.default._headLineLayer;
      this._direction = (data.direction as 0) ?? Arc.default._headCutDirection;
      this._lengthMultiplier =
         data.lengthMultiplier ?? Arc.default._headControlPointLengthMultiplier;
      this._tailTime = data.tailTime ?? Arc.default._tailTime;
      this._tailPosX = data.tailPosX ?? Arc.default._tailLineIndex;
      this._tailPosY = data.tailPosY ?? Arc.default._tailLineLayer;
      this._tailDirection = (data.tailDirection as 0) ?? Arc.default._tailCutDirection;
      this._tailLengthMultiplier =
         data.tailLengthMultiplier ?? Arc.default._tailControlPointLengthMultiplier;
      this._midAnchor = data.midAnchor ?? Arc.default._sliderMidAnchorMode;
      this._customData = deepCopy(data.customData ?? Arc.default._customData);
   }

   static fromJSON(data: Partial<IArc> = {}): Arc {
      const d = new this();
      d._color = data._colorType ?? Arc.default._colorType;
      d._time = data._headTime ?? Arc.default._headTime;
      d._posX = data._headLineIndex ?? Arc.default._headLineIndex;
      d._posY = data._headLineLayer ?? Arc.default._headLineLayer;
      d._direction = data._headCutDirection ?? Arc.default._headCutDirection;
      d._lengthMultiplier =
         data._headControlPointLengthMultiplier ?? Arc.default._headControlPointLengthMultiplier;
      d._tailTime = data._tailTime ?? Arc.default._tailTime;
      d._tailPosX = data._tailLineIndex ?? Arc.default._tailLineIndex;
      d._tailPosY = data._tailLineLayer ?? Arc.default._tailLineLayer;
      d._tailDirection = data._tailCutDirection ?? Arc.default._tailCutDirection;
      d._tailLengthMultiplier =
         data._tailControlPointLengthMultiplier ?? Arc.default._tailControlPointLengthMultiplier;
      d._midAnchor = data._sliderMidAnchorMode ?? Arc.default._sliderMidAnchorMode;
      d._customData = deepCopy(data._customData ?? Arc.default._customData);
      return d;
   }

   toJSON(): Required<IArc> {
      return {
         _colorType: this.color,
         _headTime: this.time,
         _headLineIndex: this.posX,
         _headLineLayer: this.posY,
         _headCutDirection: this.direction,
         _headControlPointLengthMultiplier: this.lengthMultiplier,
         _tailTime: this.tailTime,
         _tailLineIndex: this.tailPosX,
         _tailLineLayer: this.tailPosY,
         _tailCutDirection: this.tailDirection,
         _tailControlPointLengthMultiplier: this.tailLengthMultiplier,
         _sliderMidAnchorMode: this.midAnchor,
         _customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IArc['_customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IArc['_customData']>) {
      this._customData = value;
   }
}
