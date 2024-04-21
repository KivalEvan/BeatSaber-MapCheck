import type { IIndexFilter } from '../../types/beatmap/v3/indexFilter.ts';
import type { ILightColorEvent } from '../../types/beatmap/v3/lightColorEvent.ts';
import type { ILightColorEventBox } from '../../types/beatmap/v3/lightColorEventBox.ts';
import type { ILightColorEventBoxGroup } from '../../types/beatmap/v3/lightColorEventBoxGroup.ts';
import type { IWrapLightColorEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightColorEventBoxGroup.ts';
import type { DeepPartial } from '../../types/utils.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapLightColorEventBoxGroup } from '../wrapper/lightColorEventBoxGroup.ts';
import { LightColorEventBox } from './lightColorEventBox.ts';

/** Light color event box group beatmap v3 class object. */
export class LightColorEventBoxGroup extends WrapLightColorEventBoxGroup<
   ILightColorEventBoxGroup,
   ILightColorEventBox,
   ILightColorEvent,
   IIndexFilter
> {
   static default: Required<ILightColorEventBoxGroup> = {
      b: 0,
      g: 0,
      e: [],
      customData: {},
   };

   static create(
      ...data: DeepPartial<
         IWrapLightColorEventBoxGroupAttribute<
            ILightColorEventBoxGroup,
            ILightColorEventBox,
            ILightColorEvent,
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
            ILightColorEventBoxGroup,
            ILightColorEventBox,
            ILightColorEvent,
            IIndexFilter
         >
      > = {},
   ) {
      super();
      this._time = data.time ?? LightColorEventBoxGroup.default.b;
      this._id = data.id ?? LightColorEventBoxGroup.default.g;
      if (data.boxes) {
         this._boxes = data.boxes.map((obj) => new LightColorEventBox(obj));
      } else {
         this._boxes = LightColorEventBoxGroup.default.e.map((obj) =>
            LightColorEventBox.fromJSON(obj),
         );
      }
      this._customData = deepCopy(data.customData ?? LightColorEventBoxGroup.default.customData);
   }

   static fromJSON(data: DeepPartial<ILightColorEventBoxGroup> = {}): LightColorEventBoxGroup {
      const d = new this();
      d._time = data.b ?? LightColorEventBoxGroup.default.b;
      d._id = data.g ?? LightColorEventBoxGroup.default.g;
      d._boxes = (data.e ?? LightColorEventBoxGroup.default.e).map((obj) =>
         LightColorEventBox.fromJSON(obj),
      );
      d._customData = deepCopy(data.customData ?? LightColorEventBoxGroup.default.customData);
      return d;
   }

   toJSON(): Required<ILightColorEventBoxGroup> {
      return {
         b: this.time,
         g: this.id,
         e: this.boxes.map((e) => e.toJSON()),
         customData: deepCopy(this.customData),
      };
   }

   get boxes(): LightColorEventBox[] {
      return this._boxes as LightColorEventBox[];
   }
   set boxes(value: LightColorEventBox[]) {
      this._boxes = value;
   }

   get customData(): NonNullable<ILightColorEventBoxGroup['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightColorEventBoxGroup['customData']>) {
      this._customData = value;
   }

   isValid(): boolean {
      return this.id >= 0;
   }
}
