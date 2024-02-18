import { ILightTranslationEventBoxGroup } from '../../types/beatmap/v3/lightTranslationEventBoxGroup';
import { DeepPartial } from '../../types/utils';
import { LightTranslationEventBox } from './lightTranslationEventBox';
import { WrapLightTranslationEventBoxGroup } from '../wrapper/lightTranslationEventBoxGroup';
import { deepCopy } from '../../utils/misc';
import { ILightTranslationEventBox } from '../../types/beatmap/v3/lightTranslationEventBox';
import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { ILightTranslationEvent } from '../../types/beatmap/v3/lightTranslationEvent';
import { IWrapLightTranslationEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightTranslationEventBoxGroup';

/** Light translation event box group beatmap v3 class object. */
export class LightTranslationEventBoxGroup extends WrapLightTranslationEventBoxGroup<
   ILightTranslationEventBoxGroup,
   ILightTranslationEventBox,
   ILightTranslationEvent,
   IIndexFilter
> {
   static default: Required<ILightTranslationEventBoxGroup> = {
      b: 0,
      g: 0,
      e: [],
      customData: {},
   };

   static create(
      ...data: DeepPartial<
         IWrapLightTranslationEventBoxGroupAttribute<
            ILightTranslationEventBoxGroup,
            ILightTranslationEventBox,
            ILightTranslationEvent,
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
            ILightTranslationEventBoxGroup,
            ILightTranslationEventBox,
            ILightTranslationEvent,
            IIndexFilter
         >
      > = {},
   ) {
      super();
      this._time = data.time ?? LightTranslationEventBoxGroup.default.b;
      this._id = data.id ?? LightTranslationEventBoxGroup.default.g;
      if (data.boxes) {
         this._boxes = data.boxes.map((obj) => new LightTranslationEventBox(obj));
      } else {
         this._boxes = LightTranslationEventBoxGroup.default.e.map((obj) =>
            LightTranslationEventBox.fromJSON(obj),
         );
      }
      this._customData = deepCopy(
         data.customData ?? LightTranslationEventBoxGroup.default.customData,
      );
   }

   static fromJSON(
      data: DeepPartial<ILightTranslationEventBoxGroup> = {},
   ): LightTranslationEventBoxGroup {
      const d = new this();
      d._time = data.b ?? LightTranslationEventBoxGroup.default.b;
      d._id = data.g ?? LightTranslationEventBoxGroup.default.g;
      d._boxes = (data.e ?? LightTranslationEventBoxGroup.default.e).map((obj) =>
         LightTranslationEventBox.fromJSON(obj),
      );
      d._customData = deepCopy(data.customData ?? LightTranslationEventBoxGroup.default.customData);
      return d;
   }

   toJSON(): Required<ILightTranslationEventBoxGroup> {
      return {
         b: this.time,
         g: this.id,
         e: this.boxes.map((e) => e.toJSON()),
         customData: deepCopy(this.customData),
      };
   }

   get boxes(): LightTranslationEventBox[] {
      return this._boxes as LightTranslationEventBox[];
   }
   set boxes(value: LightTranslationEventBox[]) {
      this._boxes = value;
   }

   get customData(): NonNullable<ILightTranslationEventBoxGroup['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<ILightTranslationEventBoxGroup['customData']>) {
      this._customData = value;
   }

   isValid(): boolean {
      return this.id >= 0;
   }
}
