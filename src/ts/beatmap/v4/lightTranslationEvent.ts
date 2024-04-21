import type { ILightTranslationEventContainer } from '../../types/beatmap/container/v4.ts';
import type { ILightTranslationEvent } from '../../types/beatmap/v4/lightTranslationEvent.ts';
import type { IWrapLightTranslationEventAttribute } from '../../types/beatmap/wrapper/lightTranslationEvent.ts';
import type { DeepRequiredIgnore } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapLightTranslationEvent } from '../wrapper/lightTranslationEvent.ts';

/** Light translation event beatmap v4 class object. */
export class LightTranslationEvent extends WrapLightTranslationEvent<ILightTranslationEventContainer> {
   static default: DeepRequiredIgnore<ILightTranslationEventContainer, 'customData'> = {
      data: { p: 0, e: 0, t: 0, customData: {} },
      time: 0,
   };

   static create(
      ...data: Partial<IWrapLightTranslationEventAttribute<ILightTranslationEvent>>[]
   ): LightTranslationEvent[] {
      const result: LightTranslationEvent[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(
      data: Partial<IWrapLightTranslationEventAttribute<ILightTranslationEventContainer>> = {},
   ) {
      super();
      this._time = data.time ?? 0;
      this._previous = data.previous ?? LightTranslationEvent.default.data.p;
      this._easing = data.easing ?? LightTranslationEvent.default.data.e;
      this._translation = data.translation ?? LightTranslationEvent.default.data.t;
      this._customData = deepCopy(data.customData ?? LightTranslationEvent.default.data.customData);
   }

   static fromJSON(
      data: Partial<ILightTranslationEvent> = {},
      time?: number,
   ): LightTranslationEvent {
      const d = new this();
      d._time = time ?? 0;
      d._previous = data.p ?? LightTranslationEvent.default.data.p;
      d._easing = data.e ?? LightTranslationEvent.default.data.e;
      d._translation = data.t ?? LightTranslationEvent.default.data.t;
      d._customData = deepCopy(data.customData ?? LightTranslationEvent.default.data.customData);
      return d;
   }

   toJSON(): Required<ILightTranslationEventContainer> {
      return {
         data: {
            p: this.previous,
            e: this.easing,
            t: this.translation,
            customData: deepCopy(this.customData),
         },
         time: this.time,
      };
   }

   get customData(): NonNullable<ILightTranslationEvent['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightTranslationEvent['customData']>) {
      this._customData = value;
   }
}
