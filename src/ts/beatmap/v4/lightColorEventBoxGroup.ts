import { DeepPartial, DeepRequiredIgnore } from '../../types/utils';
import { LightColorEventBox } from './lightColorEventBox';
import { WrapLightColorEventBoxGroup } from '../wrapper/lightColorEventBoxGroup';
import { deepCopy } from '../../utils/misc';
import { IIndexFilter } from '../../types/beatmap/v4/indexFilter';
import { IWrapLightColorEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightColorEventBoxGroup';
import {
   IEventBoxGroupContainer,
   ILightColorEventContainer,
} from '../../types/beatmap/container/v4';
import { EventBoxType } from '../../types/beatmap/shared/constants';
import { IEventBoxGroup } from '../../types/beatmap/v4/eventBoxGroup';
import { ILightColorBoxContainer } from '../../types/beatmap/container/v4';
import { ILightColorEventBox } from '../../types/beatmap/v4/lightColorEventBox';
import { ILightColorEvent } from '../../types/beatmap/v4/lightColorEvent';

/** Light color event box group beatmap v4 class object. */
export class LightColorEventBoxGroup extends WrapLightColorEventBoxGroup<
   IEventBoxGroupContainer<ILightColorBoxContainer>,
   ILightColorBoxContainer,
   ILightColorEventContainer,
   IIndexFilter
> {
   static default: DeepRequiredIgnore<
      IEventBoxGroupContainer<ILightColorBoxContainer>,
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
         IWrapLightColorEventBoxGroupAttribute<
            IEventBoxGroupContainer<ILightColorBoxContainer>,
            ILightColorBoxContainer,
            ILightColorEventContainer,
            IIndexFilter
         >
      >[]
   ): LightColorEventBoxGroup[] {
      const result: LightColorEventBoxGroup[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(
      data: DeepPartial<
         IWrapLightColorEventBoxGroupAttribute<
            IEventBoxGroupContainer<ILightColorBoxContainer>,
            ILightColorBoxContainer,
            ILightColorEventContainer,
            IIndexFilter
         >
      > = {},
   ) {
      super();
      this._time = data.time ?? LightColorEventBoxGroup.default.object.b;
      this._id = data.id ?? LightColorEventBoxGroup.default.object.g;
      this._boxes = (data.boxes ?? []).map((obj) => new LightColorEventBox(obj));
      this._customData = deepCopy(
         data.customData ?? LightColorEventBoxGroup.default.object.customData,
      );
   }

   static fromJSON(
      data: Partial<IEventBoxGroup> = {},
      boxes?: Partial<ILightColorEventBox>[],
      events?: Partial<ILightColorEvent>[],
      filters?: Partial<IIndexFilter>[],
   ): LightColorEventBoxGroup {
      const d = new this();
      d._time = data.b ?? LightColorEventBoxGroup.default.object.b;
      d._id = data.g ?? LightColorEventBoxGroup.default.object.g;
      events ||= [];
      if (data.e) {
         for (const e of data.e) {
            const evts: ILightColorEvent[] = [];
            const times: number[] = [];
            for (const l of e.l || []) {
               times.push(l.b || 0);
               evts.push(events[l.i || 0]);
            }
            d._boxes.push(
               LightColorEventBox.fromJSON(
                  boxes?.[e.e || 0] || {},
                  evts,
                  times,
                  filters?.[e.f || 0],
               ),
            );
         }
      }
      d._customData = deepCopy(
         data.customData ?? LightColorEventBoxGroup.default.object.customData,
      );
      return d;
   }

   toJSON(): Required<IEventBoxGroupContainer<ILightColorBoxContainer>> {
      return {
         object: {
            t: EventBoxType.COLOR,
            b: this.time,
            g: this.id,
            e: [],
            customData: deepCopy(this.customData),
         },
         boxData: this.boxes.map((e) => e.toJSON()),
      };
   }

   get boxes(): LightColorEventBox[] {
      return this._boxes as LightColorEventBox[];
   }
   set boxes(value: LightColorEventBox[]) {
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
