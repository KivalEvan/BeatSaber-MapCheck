import type { ILightRotationEventBoxGroup } from '../../types/beatmap/v3/lightRotationEventBoxGroup.ts';
import type { DeepPartial } from '../../types/utils.ts';
import { LightRotationEventBox } from './lightRotationEventBox.ts';
import { WrapLightRotationEventBoxGroup } from '../wrapper/lightRotationEventBoxGroup.ts';
import { deepCopy } from '../../utils/misc.ts';
import type { ILightRotationEventBox } from '../../types/beatmap/v3/lightRotationEventBox.ts';
import type { IIndexFilter } from '../../types/beatmap/v3/indexFilter.ts';
import type { ILightRotationEvent } from '../../types/beatmap/v3/lightRotationEvent.ts';
import type { IWrapLightRotationEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightRotationEventBoxGroup.ts';

/** Light Rotation event box group beatmap v3 class object. */
export class LightRotationEventBoxGroup extends WrapLightRotationEventBoxGroup<
   ILightRotationEventBoxGroup,
   ILightRotationEventBox,
   ILightRotationEvent,
   IIndexFilter
> {
   static default: Required<ILightRotationEventBoxGroup> = {
      b: 0,
      g: 0,
      e: [],
      customData: {},
   };

   static create(
      ...data: DeepPartial<
         IWrapLightRotationEventBoxGroupAttribute<
            ILightRotationEventBoxGroup,
            ILightRotationEventBox,
            ILightRotationEvent,
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
            ILightRotationEventBoxGroup,
            ILightRotationEventBox,
            ILightRotationEvent,
            IIndexFilter
         >
      > = {},
   ) {
      super();
      this._time = data.time ?? LightRotationEventBoxGroup.default.b;
      this._id = data.id ?? LightRotationEventBoxGroup.default.g;
      if (data.boxes) {
         this._boxes = data.boxes.map((obj) => new LightRotationEventBox(obj));
      } else {
         this._boxes = LightRotationEventBoxGroup.default.e.map((obj) =>
            LightRotationEventBox.fromJSON(obj),
         );
      }
      this._customData = deepCopy(data.customData ?? LightRotationEventBoxGroup.default.customData);
   }

   static fromJSON(
      data: DeepPartial<ILightRotationEventBoxGroup> = {},
   ): LightRotationEventBoxGroup {
      const d = new this();
      d._time = data.b ?? LightRotationEventBoxGroup.default.b;
      d._id = data.g ?? LightRotationEventBoxGroup.default.g;
      d._boxes = (data.e ?? LightRotationEventBoxGroup.default.e).map((obj) =>
         LightRotationEventBox.fromJSON(obj),
      );
      d._customData = deepCopy(data.customData ?? LightRotationEventBoxGroup.default.customData);
      return d;
   }

   toJSON(): Required<ILightRotationEventBoxGroup> {
      return {
         b: this.time,
         g: this.id,
         e: this.boxes.map((e) => e.toJSON()),
         customData: deepCopy(this.customData),
      };
   }

   get boxes(): LightRotationEventBox[] {
      return this._boxes as LightRotationEventBox[];
   }
   set boxes(value: LightRotationEventBox[]) {
      this._boxes = value;
   }

   get customData(): NonNullable<ILightRotationEventBoxGroup['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightRotationEventBoxGroup['customData']>) {
      this._customData = value;
   }

   isValid(): boolean {
      return this.id >= 0;
   }
}
