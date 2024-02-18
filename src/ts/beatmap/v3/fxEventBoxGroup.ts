import { IFxEventBoxGroup } from '../../types/beatmap/v3/fxEventBoxGroup';
import { DeepPartial } from '../../types/utils';
import { FxEventBox } from './fxEventBox';
import { WrapFxEventBoxGroup } from '../wrapper/fxEventBoxGroup';
import { deepCopy } from '../../utils/misc';
import { IFxEventBox } from '../../types/beatmap/v3/fxEventBox';
import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { IWrapFxEventBoxGroupAttribute } from '../../types/beatmap/wrapper/fxEventBoxGroup';
import {
   IEventBoxGroupContainer,
   IFxEventFloatBoxContainer,
} from '../../types/beatmap/container/v3';
import { DeepRequiredIgnore } from '../../types/utils';
import { IFxEventFloat } from '../../types/beatmap/v3/fxEventFloat';
import { FxType } from '../../types/beatmap/shared/constants';

/** FX event box group beatmap v3 class object. */
export class FxEventBoxGroup extends WrapFxEventBoxGroup<
   IEventBoxGroupContainer<IFxEventBox, IFxEventFloatBoxContainer>,
   IFxEventFloatBoxContainer,
   IFxEventFloat,
   IIndexFilter
> {
   static default: DeepRequiredIgnore<
      IEventBoxGroupContainer<IFxEventBox, IFxEventFloatBoxContainer>,
      'customData'
   > = {
      object: { t: FxType.FLOAT, b: 0, g: 0, e: [], customData: {} },
      boxData: [],
   };

   static create(
      ...data: (DeepPartial<IFxEventBoxGroup> &
         DeepPartial<
            IWrapFxEventBoxGroupAttribute<
               IFxEventBoxGroup,
               IFxEventBox,
               IFxEventFloat,
               IIndexFilter
            >
         >)[]
   ): FxEventBoxGroup[] {
      const result: FxEventBoxGroup[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(
      data: DeepPartial<
         IWrapFxEventBoxGroupAttribute<IFxEventBoxGroup, IFxEventBox, IFxEventFloat, IIndexFilter>
      > = {},
   ) {
      super();
      this._time = data.time ?? FxEventBoxGroup.default.object.b;
      this._id = data.id ?? FxEventBoxGroup.default.object.g;
      if (data.boxes) {
         this._boxes = data.boxes.map((obj) => new FxEventBox(obj));
      } else {
         this._boxes = FxEventBoxGroup.default.boxData.map((obj) =>
            FxEventBox.fromJSON(obj.data, obj.eventData),
         );
      }
      this._customData = deepCopy(data.customData ?? FxEventBoxGroup.default.object.customData);
   }

   static fromJSON(
      data: DeepPartial<IFxEventBoxGroup> = {},
      events?: Partial<IFxEventFloat>[],
   ): FxEventBoxGroup {
      const d = new this();
      d._time = data.b ?? FxEventBoxGroup.default.object.b;
      d._id = data.g ?? FxEventBoxGroup.default.object.g;
      if (data.e) {
         d._boxes = data.e.map((obj) => FxEventBox.fromJSON(obj, events));
      } else {
         d._boxes = FxEventBoxGroup.default.boxData.map((obj) =>
            FxEventBox.fromJSON(obj.data, events ?? obj.eventData),
         );
      }
      d._customData = deepCopy(data.customData ?? FxEventBoxGroup.default.object.customData);
      return d;
   }

   toJSON(): Required<IEventBoxGroupContainer<IFxEventBox, IFxEventFloatBoxContainer>> {
      return {
         object: {
            t: FxType.FLOAT,
            b: this.time,
            g: this.id,
            e: [],
            customData: deepCopy(this.customData),
         },
         boxData: this.boxes.map((e) => e.toJSON()),
      };
   }

   get boxes(): FxEventBox[] {
      return this._boxes as FxEventBox[];
   }
   set boxes(value: FxEventBox[]) {
      this._boxes = value;
   }

   get customData(): NonNullable<IFxEventBoxGroup['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IFxEventBoxGroup['customData']>) {
      this._customData = value;
   }

   isValid(): boolean {
      return this.id >= 0;
   }
}
