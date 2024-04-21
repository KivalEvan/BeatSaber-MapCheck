import type { DeepPartial, DeepRequiredIgnore } from '../../types/utils.ts';
import { LightTranslationEventBox } from './lightTranslationEventBox.ts';
import { WrapLightTranslationEventBoxGroup } from '../wrapper/lightTranslationEventBoxGroup.ts';
import { deepCopy } from '../../utils/misc.ts';
import type { IIndexFilter } from '../../types/beatmap/v4/indexFilter.ts';
import type { IWrapLightTranslationEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightTranslationEventBoxGroup.ts';
import type {
   IEventBoxGroupContainer,
   ILightTranslationEventContainer,
} from '../../types/beatmap/container/v4.ts';
import { EventBoxType } from '../../types/beatmap/shared/constants.ts';
import type { IEventBoxGroup } from '../../types/beatmap/v4/eventBoxGroup.ts';
import type { ILightTranslationBoxContainer } from '../../types/beatmap/container/v4.ts';
import type { ILightTranslationEventBox } from '../../types/beatmap/v4/lightTranslationEventBox.ts';
import type { ILightTranslationEvent } from '../../types/beatmap/v4/lightTranslationEvent.ts';

/** Light translation event box group beatmap v4 class object. */
export class LightTranslationEventBoxGroup extends WrapLightTranslationEventBoxGroup<
   IEventBoxGroupContainer<ILightTranslationBoxContainer>,
   ILightTranslationBoxContainer,
   ILightTranslationEventContainer,
   IIndexFilter
> {
   static default: DeepRequiredIgnore<
      IEventBoxGroupContainer<ILightTranslationBoxContainer>,
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
         IWrapLightTranslationEventBoxGroupAttribute<
            IEventBoxGroupContainer<ILightTranslationBoxContainer>,
            ILightTranslationBoxContainer,
            ILightTranslationEventContainer,
            IIndexFilter
         >
      >[]
   ): LightTranslationEventBoxGroup[] {
      const result: LightTranslationEventBoxGroup[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(
      data: DeepPartial<
         IWrapLightTranslationEventBoxGroupAttribute<
            IEventBoxGroupContainer<ILightTranslationBoxContainer>,
            ILightTranslationBoxContainer,
            ILightTranslationEventContainer,
            IIndexFilter
         >
      > = {},
   ) {
      super();
      this._time = data.time ?? LightTranslationEventBoxGroup.default.object.b;
      this._id = data.id ?? LightTranslationEventBoxGroup.default.object.g;
      this._boxes = (data.boxes ?? []).map((obj) => new LightTranslationEventBox(obj));
      this._customData = deepCopy(
         data.customData ?? LightTranslationEventBoxGroup.default.object.customData,
      );
   }

   static fromJSON(
      data: Partial<IEventBoxGroup> = {},
      boxes?: Partial<ILightTranslationEventBox>[],
      events?: Partial<ILightTranslationEvent>[],
      filters?: Partial<IIndexFilter>[],
   ): LightTranslationEventBoxGroup {
      const d = new this();
      d._time = data.b ?? LightTranslationEventBoxGroup.default.object.b;
      d._id = data.g ?? LightTranslationEventBoxGroup.default.object.g;
      events ||= [];
      if (data.e) {
         for (const e of data.e) {
            const evts: ILightTranslationEvent[] = [];
            const times: number[] = [];
            for (const l of e.l || []) {
               times.push(l.b || 0);
               evts.push(events[l.i || 0]);
            }
            d._boxes.push(
               LightTranslationEventBox.fromJSON(
                  boxes?.[e.e || 0] || {},
                  evts,
                  times,
                  filters?.[e.f || 0],
               ),
            );
         }
      }
      d._customData = deepCopy(
         data.customData ?? LightTranslationEventBoxGroup.default.object.customData,
      );
      return d;
   }

   toJSON(): Required<IEventBoxGroupContainer<ILightTranslationBoxContainer>> {
      return {
         object: {
            t: EventBoxType.TRANSLATION,
            b: this.time,
            g: this.id,
            e: [],
            customData: deepCopy(this.customData),
         },
         boxData: this.boxes.map((e) => e.toJSON()),
      };
   }

   get boxes(): LightTranslationEventBox[] {
      return this._boxes as LightTranslationEventBox[];
   }
   set boxes(value: LightTranslationEventBox[]) {
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
