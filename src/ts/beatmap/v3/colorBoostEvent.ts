import { IColorBoostEvent } from '../../types/beatmap/v3/colorBoostEvent';
import { IWrapColorBoostEventAttribute } from '../../types/beatmap/wrapper/colorBoostEvent';
import { deepCopy } from '../../utils/misc';
import { WrapColorBoostEvent } from '../wrapper/colorBoostEvent';

/** Boost event beatmap v3 class object. */
export class ColorBoostEvent extends WrapColorBoostEvent<IColorBoostEvent> {
   static default: Required<IColorBoostEvent> = {
      b: 0,
      o: false,
      customData: {},
   };

   constructor();
   constructor(data: Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>);
   constructor(data: Partial<IColorBoostEvent>);
   constructor(
      data: Partial<IColorBoostEvent> & Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>,
   );
   constructor(
      data: Partial<IColorBoostEvent> &
         Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>> = {},
   ) {
      super();

      this._time = data.b ?? data.time ?? ColorBoostEvent.default.b;
      this._toggle = data.o ?? data.toggle ?? ColorBoostEvent.default.o;
      this._customData = deepCopy(data.customData ?? ColorBoostEvent.default.customData);
   }

   static create(): ColorBoostEvent[];
   static create(
      ...data: Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>[]
   ): ColorBoostEvent[];
   static create(...data: Partial<IColorBoostEvent>[]): ColorBoostEvent[];
   static create(
      ...data: (Partial<IColorBoostEvent> &
         Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>)[]
   ): ColorBoostEvent[];
   static create(
      ...data: (Partial<IColorBoostEvent> &
         Partial<IWrapColorBoostEventAttribute<IColorBoostEvent>>)[]
   ): ColorBoostEvent[] {
      const result: ColorBoostEvent[] = [];
      data.forEach((obj) => result.push(new this(obj)));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   toJSON(): Required<IColorBoostEvent> {
      return {
         b: this.time,
         o: this.toggle,
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IColorBoostEvent['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IColorBoostEvent['customData']>) {
      this._customData = value;
   }

   isValid(): boolean {
      return true;
   }
}
