import { ILightRotationEventBoxGroup } from '../../types/beatmap/v3/lightRotationEventBoxGroup';
import { DeepPartial } from '../../types/utils';
import { LightRotationEventBox } from './lightRotationEventBox';
import { WrapLightRotationEventBoxGroup } from '../wrapper/lightRotationEventBoxGroup';
import { deepCopy } from '../../utils/misc';
import { ILightRotationEventBox } from '../../types/beatmap/v3/lightRotationEventBox';
import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { ILightRotationBase } from '../../types/beatmap/v3/lightRotationBase';
import { IWrapLightRotationEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightRotationEventBoxGroup';

/** Light Rotation event box group beatmap v3 class object. */
export class LightRotationEventBoxGroup extends WrapLightRotationEventBoxGroup<
   ILightRotationEventBoxGroup,
   ILightRotationEventBox,
   ILightRotationBase,
   IIndexFilter
> {
   static default: Required<ILightRotationEventBoxGroup> = {
      b: 0,
      g: 0,
      e: [],
      customData: {},
   };

   constructor();
   constructor(
      data: DeepPartial<
         IWrapLightRotationEventBoxGroupAttribute<
            ILightRotationEventBoxGroup,
            ILightRotationEventBox,
            ILightRotationBase,
            IIndexFilter
         >
      >,
   );
   constructor(data: DeepPartial<ILightRotationEventBoxGroup>);
   constructor(
      data: DeepPartial<ILightRotationEventBoxGroup> &
         DeepPartial<
            IWrapLightRotationEventBoxGroupAttribute<
               ILightRotationEventBoxGroup,
               ILightRotationEventBox,
               ILightRotationBase,
               IIndexFilter
            >
         >,
   );
   constructor(
      data: DeepPartial<ILightRotationEventBoxGroup> &
         DeepPartial<
            IWrapLightRotationEventBoxGroupAttribute<
               ILightRotationEventBoxGroup,
               ILightRotationEventBox,
               ILightRotationBase,
               IIndexFilter
            >
         > = {},
   ) {
      super();

      this._time = data.b ?? data.time ?? LightRotationEventBoxGroup.default.b;
      this._id = data.g ?? data.id ?? LightRotationEventBoxGroup.default.g;
      this._boxes = (
         (data.e as unknown as ILightRotationEventBox[]) ??
         (data.boxes as ILightRotationEventBox[]) ??
         LightRotationEventBoxGroup.default.e
      ).map((obj) => new LightRotationEventBox(obj));
      this._customData = deepCopy(data.customData ?? LightRotationEventBoxGroup.default.customData);
   }

   static create(): LightRotationEventBoxGroup[];
   static create(
      ...data: DeepPartial<
         IWrapLightRotationEventBoxGroupAttribute<
            ILightRotationEventBoxGroup,
            ILightRotationEventBox,
            ILightRotationBase,
            IIndexFilter
         >
      >[]
   ): LightRotationEventBoxGroup[];
   static create(...data: DeepPartial<ILightRotationEventBoxGroup>[]): LightRotationEventBoxGroup[];
   static create(
      ...data: (DeepPartial<ILightRotationEventBoxGroup> &
         DeepPartial<
            IWrapLightRotationEventBoxGroupAttribute<
               ILightRotationEventBoxGroup,
               ILightRotationEventBox,
               ILightRotationBase,
               IIndexFilter
            >
         >)[]
   ): LightRotationEventBoxGroup[];
   static create(
      ...data: (DeepPartial<ILightRotationEventBoxGroup> &
         DeepPartial<
            IWrapLightRotationEventBoxGroupAttribute<
               ILightRotationEventBoxGroup,
               ILightRotationEventBox,
               ILightRotationBase,
               IIndexFilter
            >
         >)[]
   ): LightRotationEventBoxGroup[] {
      const result: LightRotationEventBoxGroup[] = [];
      data.forEach((obj) => result.push(new this(obj)));
      if (result.length) {
         return result;
      }
      return [new this()];
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
