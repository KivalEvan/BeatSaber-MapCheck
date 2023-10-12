import { ILightRotationBase } from '../../types/beatmap/v3/lightRotationBase';
import { IWrapLightRotationBaseAttribute } from '../../types/beatmap/wrapper/lightRotationBase';
import { deepCopy } from '../../utils/misc';
import { WrapLightRotationBase } from '../wrapper/lightRotationBase';

/** Light rotation base beatmap v3 class object. */
export class LightRotationBase extends WrapLightRotationBase<ILightRotationBase> {
   static default: Required<ILightRotationBase> = {
      b: 0,
      p: 0,
      e: 0,
      l: 0,
      r: 0,
      o: 0,
      customData: {},
   };

   constructor();
   constructor(data: Partial<IWrapLightRotationBaseAttribute<ILightRotationBase>>);
   constructor(data: Partial<ILightRotationBase>);
   constructor(
      data: Partial<ILightRotationBase> &
         Partial<IWrapLightRotationBaseAttribute<ILightRotationBase>>,
   );
   constructor(
      data: Partial<ILightRotationBase> &
         Partial<IWrapLightRotationBaseAttribute<ILightRotationBase>> = {},
   ) {
      super();

      this._time = data.b ?? data.time ?? LightRotationBase.default.b;
      this._easing = data.e ?? data.easing ?? LightRotationBase.default.e;
      this._loop = data.l ?? data.loop ?? LightRotationBase.default.l;
      this._direction = data.o ?? data.direction ?? LightRotationBase.default.o;
      this._previous = data.p ?? data.previous ?? LightRotationBase.default.p;
      this._rotation = data.r ?? data.rotation ?? LightRotationBase.default.r;
      this._customData = deepCopy(data.customData ?? LightRotationBase.default.customData);
   }

   static create(): LightRotationBase[];
   static create(
      ...data: Partial<IWrapLightRotationBaseAttribute<ILightRotationBase>>[]
   ): LightRotationBase[];
   static create(...data: Partial<ILightRotationBase>[]): LightRotationBase[];
   static create(
      ...data: (Partial<ILightRotationBase> &
         Partial<IWrapLightRotationBaseAttribute<ILightRotationBase>>)[]
   ): LightRotationBase[];
   static create(
      ...data: (Partial<ILightRotationBase> &
         Partial<IWrapLightRotationBaseAttribute<ILightRotationBase>>)[]
   ): LightRotationBase[] {
      const result: LightRotationBase[] = [];
      data.forEach((obj) => result.push(new this(obj)));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   toJSON(): Required<ILightRotationBase> {
      return {
         b: this.time,
         e: this.easing,
         l: this.loop,
         o: this.direction,
         p: this.previous,
         r: this.rotation,
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<ILightRotationBase['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightRotationBase['customData']>) {
      this._customData = value;
   }
}
