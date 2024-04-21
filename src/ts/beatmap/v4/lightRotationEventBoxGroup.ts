import type { DeepPartial, DeepRequiredIgnore } from '../../types/utils.ts';
import { LightRotationEventBox } from './lightRotationEventBox.ts';
import { WrapLightRotationEventBoxGroup } from '../wrapper/lightRotationEventBoxGroup.ts';
import { deepCopy } from '../../utils/misc.ts';
import type { IIndexFilter } from '../../types/beatmap/v4/indexFilter.ts';
import type { IWrapLightRotationEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightRotationEventBoxGroup.ts';
import type {
   IEventBoxGroupContainer,
   ILightRotationEventContainer,
} from '../../types/beatmap/container/v4.ts';
import { EventBoxType } from '../../types/beatmap/shared/constants.ts';
import type { IEventBoxGroup } from '../../types/beatmap/v4/eventBoxGroup.ts';
import type { ILightRotationBoxContainer } from '../../types/beatmap/container/v4.ts';
import type { ILightRotationEventBox } from '../../types/beatmap/v4/lightRotationEventBox.ts';
import type { ILightRotationEvent } from '../../types/beatmap/v4/lightRotationEvent.ts';

/** Light rotation event box group beatmap v4 class object. */
export class LightRotationEventBoxGroup extends WrapLightRotationEventBoxGroup<
   IEventBoxGroupContainer<ILightRotationBoxContainer>,
   ILightRotationBoxContainer,
   ILightRotationEventContainer,
   IIndexFilter
> {
   static default: DeepRequiredIgnore<
      IEventBoxGroupContainer<ILightRotationBoxContainer>,
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
         IWrapLightRotationEventBoxGroupAttribute<
            IEventBoxGroupContainer<ILightRotationBoxContainer>,
            ILightRotationBoxContainer,
            ILightRotationEventContainer,
            IIndexFilter
         >
      >[]
   ): LightRotationEventBoxGroup[] {
      const result: LightRotationEventBoxGroup[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(
      data: DeepPartial<
         IWrapLightRotationEventBoxGroupAttribute<
            IEventBoxGroupContainer<ILightRotationBoxContainer>,
            ILightRotationBoxContainer,
            ILightRotationEventContainer,
            IIndexFilter
         >
      > = {},
   ) {
      super();
      this._time = data.time ?? LightRotationEventBoxGroup.default.object.b;
      this._id = data.id ?? LightRotationEventBoxGroup.default.object.g;
      this._boxes = (data.boxes ?? []).map((obj) => new LightRotationEventBox(obj));
      this._customData = deepCopy(
         data.customData ?? LightRotationEventBoxGroup.default.object.customData,
      );
   }

   static fromJSON(
      data: Partial<IEventBoxGroup> = {},
      boxes?: Partial<ILightRotationEventBox>[],
      events?: Partial<ILightRotationEvent>[],
      filters?: Partial<IIndexFilter>[],
   ): LightRotationEventBoxGroup {
      const d = new this();
      d._time = data.b ?? LightRotationEventBoxGroup.default.object.b;
      d._id = data.g ?? LightRotationEventBoxGroup.default.object.g;
      events ||= [];
      if (data.e) {
         for (const e of data.e) {
            const evts: ILightRotationEvent[] = [];
            const times: number[] = [];
            for (const l of e.l || []) {
               times.push(l.b || 0);
               evts.push(events[l.i || 0]);
            }
            d._boxes.push(
               LightRotationEventBox.fromJSON(
                  boxes?.[e.e || 0] || {},
                  evts,
                  times,
                  filters?.[e.f || 0],
               ),
            );
         }
      }
      d._customData = deepCopy(
         data.customData ?? LightRotationEventBoxGroup.default.object.customData,
      );
      return d;
   }

   toJSON(): Required<IEventBoxGroupContainer<ILightRotationBoxContainer>> {
      return {
         object: {
            t: EventBoxType.ROTATION,
            b: this.time,
            g: this.id,
            e: [],
            customData: deepCopy(this.customData),
         },
         boxData: this.boxes.map((e) => e.toJSON()),
      };
   }

   get boxes(): LightRotationEventBox[] {
      return this._boxes as LightRotationEventBox[];
   }
   set boxes(value: LightRotationEventBox[]) {
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
