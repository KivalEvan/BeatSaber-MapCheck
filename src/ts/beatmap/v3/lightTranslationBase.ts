import type { ILightTranslationEvent } from '../../types/beatmap/v3/lightTranslationEvent.ts';
import type { IWrapLightTranslationEventAttribute } from '../../types/beatmap/wrapper/lightTranslationEvent.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapLightTranslationEvent } from '../wrapper/lightTranslationEvent.ts';

/** Light translation base beatmap v3 class object. */
export class LightTranslationBase extends WrapLightTranslationEvent<ILightTranslationEvent> {
   static default: Required<ILightTranslationEvent> = {
      b: 0,
      p: 0,
      e: 0,
      t: 0,
      customData: {},
   };

   static create(
      ...data: Partial<IWrapLightTranslationEventAttribute<ILightTranslationEvent>>[]
   ): LightTranslationBase[] {
      const result: LightTranslationBase[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapLightTranslationEventAttribute<ILightTranslationEvent>> = {}) {
      super();
      this._time = data.time ?? LightTranslationBase.default.b;
      this._easing = data.easing ?? LightTranslationBase.default.e;
      this._previous = data.previous ?? LightTranslationBase.default.p;
      this._translation = data.translation ?? LightTranslationBase.default.t;
      this._customData = deepCopy(data.customData ?? LightTranslationBase.default.customData);
   }

   static fromJSON(data: Partial<ILightTranslationEvent> = {}): LightTranslationBase {
      const d = new this();
      d._time = data.b ?? LightTranslationBase.default.b;
      d._easing = data.e ?? LightTranslationBase.default.e;
      d._previous = data.p ?? LightTranslationBase.default.p;
      d._translation = data.t ?? LightTranslationBase.default.t;
      d._customData = deepCopy(data.customData ?? LightTranslationBase.default.customData);
      return d;
   }

   toJSON(): Required<ILightTranslationEvent> {
      return {
         b: this.time,
         e: this.easing,
         p: this.previous,
         t: this.translation,
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<ILightTranslationEvent['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightTranslationEvent['customData']>) {
      this._customData = value;
   }
}
