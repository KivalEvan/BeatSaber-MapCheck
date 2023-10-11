import { IArc } from '../../types/beatmap/v2/arc';
import { IWrapArcAttribute } from '../../types/beatmap/wrapper/arc';
import { deepCopy } from '../../utils/misc';
import { WrapArc } from '../wrapper/arc';

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

   constructor();
   constructor(data: Partial<IWrapArcAttribute<IArc>>);
   constructor(data: Partial<IArc>);
   constructor(data: Partial<IArc> & Partial<IWrapArcAttribute<IArc>>);
   constructor(data: Partial<IArc> & Partial<IWrapArcAttribute<IArc>> = {}) {
      super();

      this._color = data._colorType ?? data.color ?? Arc.default._colorType;
      this._time = data._headTime ?? data.time ?? data._tailTime ?? Arc.default._headTime;
      this._posX = data._headLineIndex ?? data.posX ?? Arc.default._headLineIndex;
      this._posY = data._headLineLayer ?? data.posY ?? Arc.default._headLineLayer;
      this._direction =
         data._headCutDirection ?? (data.direction as 0) ?? Arc.default._headCutDirection;
      this._lengthMultiplier =
         data._headControlPointLengthMultiplier ??
         data.lengthMultiplier ??
         Arc.default._headControlPointLengthMultiplier;
      this._tailTime = data._tailTime ?? data.tailTime ?? data._headTime ?? Arc.default._tailTime;
      this._tailPosX = data._tailLineIndex ?? data.tailPosX ?? Arc.default._tailLineIndex;
      this._tailPosY = data._tailLineLayer ?? data.tailPosY ?? Arc.default._tailLineLayer;
      this._tailDirection =
         data._tailCutDirection ?? (data.tailDirection as 0) ?? Arc.default._tailCutDirection;
      this._tailLengthMultiplier =
         data._tailControlPointLengthMultiplier ??
         data.tailLengthMultiplier ??
         Arc.default._tailControlPointLengthMultiplier;
      this._midAnchor =
         data._sliderMidAnchorMode ?? data.midAnchor ?? Arc.default._sliderMidAnchorMode;
      this._customData = deepCopy(data._customData ?? data.customData ?? Arc.default._customData);
   }

   static create(): Arc[];
   static create(...data: Partial<IWrapArcAttribute<IArc>>[]): Arc[];
   static create(...data: Partial<IArc>[]): Arc[];
   static create(...data: (Partial<IArc> & Partial<IWrapArcAttribute<IArc>>)[]): Arc[];
   static create(...data: (Partial<IArc> & Partial<IWrapArcAttribute<IArc>>)[]): Arc[] {
      const result: Arc[] = [];
      data.forEach((obj) => result.push(new this(obj)));
      if (result.length) {
         return result;
      }
      return [new this()];
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
