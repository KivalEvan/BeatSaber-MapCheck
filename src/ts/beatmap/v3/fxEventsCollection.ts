import { IFxEventsCollection } from '../../types/beatmap/v3/fxEventsCollection';
import { IWrapFxEventsCollection } from '../../types/beatmap/wrapper/fxEventsCollection';
import { DeepPartial } from '../../types/utils';
import { WrapFxEventsCollection } from '../wrapper/fxEventsCollection';
import { IFxEventFloat } from '../../types/beatmap/v3/fxEventFloat';
import { IFxEventInt } from '../../types/beatmap/v3/fxEventInt';
import { FxEventFloat } from './fxEventFloat';
import { FxEventInt } from './fxEventInt';

/** FX events collection beatmap v3 class object. */
export class FxEventsCollection extends WrapFxEventsCollection<
   IFxEventsCollection,
   IFxEventFloat,
   IFxEventInt
> {
   static default: Required<IFxEventsCollection> = {
      _fl: [],
      _il: [],
   };

   constructor();
   constructor(data: DeepPartial<IWrapFxEventsCollection<IFxEventsCollection>>);
   constructor(data: DeepPartial<IFxEventsCollection>);
   constructor(
      data: DeepPartial<IFxEventsCollection> &
         DeepPartial<IWrapFxEventsCollection<IFxEventsCollection>>,
   );
   constructor(
      data: DeepPartial<IFxEventsCollection> &
         DeepPartial<IWrapFxEventsCollection<IFxEventsCollection>> = {},
   ) {
      super();

      this.floatList = (data.floatList ?? data._fl ?? FxEventsCollection.default._fl)
         .map((d) => {
            if (d) return new FxEventFloat(d);
            return;
         })
         .filter((d) => d) as FxEventFloat[];
      this.intList = (data.intList ?? data._il ?? FxEventsCollection.default._il)
         .map((d) => {
            if (d) return new FxEventInt(d);
            return;
         })
         .filter((d) => d) as FxEventInt[];
   }

   static create(): FxEventsCollection;
   static create(
      data: DeepPartial<IWrapFxEventsCollection<IFxEventsCollection>>,
   ): FxEventsCollection;
   static create(data: DeepPartial<IFxEventsCollection>): FxEventsCollection;
   static create(
      data: DeepPartial<IFxEventsCollection> &
         DeepPartial<IWrapFxEventsCollection<IFxEventsCollection>>,
   ): FxEventsCollection;
   static create(
      data: DeepPartial<IFxEventsCollection> &
         DeepPartial<IWrapFxEventsCollection<IFxEventsCollection>> = {},
   ): FxEventsCollection {
      return new this(data);
   }

   toJSON(): Required<IFxEventsCollection> {
      return {
         _fl: this.floatList.map((d) => d.toJSON()),
         _il: this.intList.map((d) => d.toJSON()),
      };
   }

   get floatList(): FxEventFloat[] {
      return this._floatList as FxEventFloat[];
   }
   set floatList(value: FxEventFloat[]) {
      this._floatList = value;
   }
   get intList(): FxEventInt[] {
      return this._intList as FxEventInt[];
   }
   set intList(value: FxEventInt[]) {
      this._intList = value;
   }

   isValid(): boolean {
      throw new Error('Method not implemented.');
   }
}
