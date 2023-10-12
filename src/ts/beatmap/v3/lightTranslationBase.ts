import { ILightTranslationBase } from '../../types/beatmap/v3/lightTranslationBase';
import { IWrapLightTranslationBaseAttribute } from '../../types/beatmap/wrapper/lightTranslationBase';
import { deepCopy } from '../../utils/misc';
import { WrapLightTranslationBase } from '../wrapper/lightTranslationBase';

/** Light translation base beatmap v3 class object. */
export class LightTranslationBase extends WrapLightTranslationBase<ILightTranslationBase> {
   static default: Required<ILightTranslationBase> = {
      b: 0,
      p: 0,
      e: 0,
      t: 0,
      customData: {},
   };

   constructor();
   constructor(data: Partial<IWrapLightTranslationBaseAttribute<ILightTranslationBase>>);
   constructor(data: Partial<ILightTranslationBase>);
   constructor(
      data: Partial<ILightTranslationBase> &
         Partial<IWrapLightTranslationBaseAttribute<ILightTranslationBase>>,
   );
   constructor(
      data: Partial<ILightTranslationBase> &
         Partial<IWrapLightTranslationBaseAttribute<ILightTranslationBase>> = {},
   ) {
      super();

      this._time = data.b ?? data.time ?? LightTranslationBase.default.b;
      this._easing = data.e ?? data.easing ?? LightTranslationBase.default.e;
      this._previous = data.p ?? data.previous ?? LightTranslationBase.default.p;
      this._translation = data.t ?? data.translation ?? LightTranslationBase.default.t;
      this._customData = deepCopy(data.customData ?? LightTranslationBase.default.customData);
   }

   static create(): LightTranslationBase[];
   static create(
      ...data: Partial<IWrapLightTranslationBaseAttribute<ILightTranslationBase>>[]
   ): LightTranslationBase[];
   static create(...data: Partial<ILightTranslationBase>[]): LightTranslationBase[];
   static create(
      ...data: (Partial<ILightTranslationBase> &
         Partial<IWrapLightTranslationBaseAttribute<ILightTranslationBase>>)[]
   ): LightTranslationBase[];
   static create(
      ...data: (Partial<ILightTranslationBase> &
         Partial<IWrapLightTranslationBaseAttribute<ILightTranslationBase>>)[]
   ): LightTranslationBase[] {
      const result: LightTranslationBase[] = [];
      data.forEach((obj) => result.push(new this(obj)));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   toJSON(): Required<ILightTranslationBase> {
      return {
         b: this.time,
         e: this.easing,
         p: this.previous,
         t: this.translation,
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<ILightTranslationBase['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightTranslationBase['customData']>) {
      this._customData = value;
   }
}
