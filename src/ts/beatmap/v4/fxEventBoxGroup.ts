import type { DeepPartial, DeepRequiredIgnore } from '../../types/utils.ts';
import { FxEventBox } from './fxEventBox.ts';
import { WrapFxEventBoxGroup } from '../wrapper/fxEventBoxGroup.ts';
import { deepCopy } from '../../utils/misc.ts';
import type { IIndexFilter } from '../../types/beatmap/v4/indexFilter.ts';
import type { IWrapFxEventBoxGroupAttribute } from '../../types/beatmap/wrapper/fxEventBoxGroup.ts';
import type {
   IEventBoxGroupContainer,
   IFxEventFloatContainer,
} from '../../types/beatmap/container/v4.ts';
import { EventBoxType } from '../../types/beatmap/shared/constants.ts';
import type { IEventBoxGroup } from '../../types/beatmap/v4/eventBoxGroup.ts';
import type { IFxEventFloatBoxContainer } from '../../types/beatmap/container/v4.ts';
import type { IFxEventBox } from '../../types/beatmap/v4/fxEventBox.ts';
import type { IFxEventFloat } from '../../types/beatmap/v4/fxEventFloat.ts';

/** Fx event box group beatmap v4 class object. */
export class FxEventBoxGroup extends WrapFxEventBoxGroup<
   IEventBoxGroupContainer<IFxEventFloatBoxContainer>,
   IFxEventFloatBoxContainer,
   IFxEventFloatContainer,
   IIndexFilter
> {
   static default: DeepRequiredIgnore<
      IEventBoxGroupContainer<IFxEventFloatBoxContainer>,
      'customData'
   > = {
      object: {
         t: EventBoxType.TRANSLATION,
         b: 0,
         g: 0,
         e: [],
         customData: {},
      },
      boxData: [],
   };

   static create(
      ...data: DeepPartial<
         IWrapFxEventBoxGroupAttribute<
            IEventBoxGroupContainer<IFxEventFloatBoxContainer>,
            IFxEventFloatBoxContainer,
            IFxEventFloatContainer,
            IIndexFilter
         >
      >[]
   ): FxEventBoxGroup[] {
      const result: FxEventBoxGroup[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(
      data: DeepPartial<
         IWrapFxEventBoxGroupAttribute<
            IEventBoxGroupContainer<IFxEventFloatBoxContainer>,
            IFxEventFloatBoxContainer,
            IFxEventFloatContainer,
            IIndexFilter
         >
      > = {},
   ) {
      super();
      this._time = data.time ?? FxEventBoxGroup.default.object.b;
      this._id = data.id ?? FxEventBoxGroup.default.object.g;
      this._boxes = (data.boxes ?? []).map((obj) => new FxEventBox(obj));
      this._customData = deepCopy(data.customData ?? FxEventBoxGroup.default.object.customData);
   }

   static fromJSON(
      data: Partial<IEventBoxGroup> = {},
      boxes?: Partial<IFxEventBox>[],
      events?: Partial<IFxEventFloat>[],
      filters?: Partial<IIndexFilter>[],
   ): FxEventBoxGroup {
      const d = new this();
      d._time = data.b ?? FxEventBoxGroup.default.object.b;
      d._id = data.g ?? FxEventBoxGroup.default.object.g;
      events ||= [];
      if (data.e) {
         for (const e of data.e) {
            const evts: IFxEventFloat[] = [];
            const times: number[] = [];
            for (const l of e.l || []) {
               times.push(l.b || 0);
               evts.push(events[l.i || 0]);
            }
            d._boxes.push(
               FxEventBox.fromJSON(boxes?.[e.e || 0] || {}, evts, times, filters?.[e.f || 0]),
            );
         }
      }
      d._customData = deepCopy(data.customData ?? FxEventBoxGroup.default.object.customData);
      return d;
   }

   toJSON(): Required<IEventBoxGroupContainer<IFxEventFloatBoxContainer>> {
      return {
         object: {
            t: EventBoxType.FX_FLOAT,
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

   get customData(): NonNullable<IEventBoxGroup['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IEventBoxGroup['customData']>) {
      this._customData = value;
   }

   isValid(): boolean {
      return this.id >= 0;
   }
}
