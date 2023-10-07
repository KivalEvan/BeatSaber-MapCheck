import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { ILightColorBase } from '../../types/beatmap/v3/lightColorBase';
import { ILightColorEventBox } from '../../types/beatmap/v3/lightColorEventBox';
import { ILightColorEventBoxGroup } from '../../types/beatmap/v3/lightColorEventBoxGroup';
import { IWrapLightColorEventBoxGroupAttribute } from '../../types/beatmap/wrapper/lightColorEventBoxGroup';
import { DeepPartial } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapLightColorEventBoxGroup } from '../wrapper/lightColorEventBoxGroup';
import { LightColorEventBox } from './lightColorEventBox';

/** Light color event box group beatmap v3 class object. */
export class LightColorEventBoxGroup extends WrapLightColorEventBoxGroup<
   ILightColorEventBoxGroup,
   ILightColorEventBox,
   ILightColorBase,
   IIndexFilter
> {
   static default: Required<ILightColorEventBoxGroup> = {
      b: 0,
      g: 0,
      e: [],
      customData: {},
   };

   constructor();
   constructor(
      data: DeepPartial<
         IWrapLightColorEventBoxGroupAttribute<
            ILightColorEventBoxGroup,
            ILightColorEventBox,
            ILightColorBase,
            IIndexFilter
         >
      >,
   );
   constructor(data: DeepPartial<ILightColorEventBoxGroup>);
   constructor(
      data: DeepPartial<ILightColorEventBoxGroup> &
         DeepPartial<
            IWrapLightColorEventBoxGroupAttribute<
               ILightColorEventBoxGroup,
               ILightColorEventBox,
               ILightColorBase,
               IIndexFilter
            >
         >,
   );
   constructor(
      data: DeepPartial<ILightColorEventBoxGroup> &
         DeepPartial<
            IWrapLightColorEventBoxGroupAttribute<
               ILightColorEventBoxGroup,
               ILightColorEventBox,
               ILightColorBase,
               IIndexFilter
            >
         > = {},
   ) {
      super();

      this._time = data.b ?? data.time ?? LightColorEventBoxGroup.default.b;
      this._id = data.g ?? data.id ?? LightColorEventBoxGroup.default.g;
      this._boxes = (
         (data.e as unknown as ILightColorEventBox[]) ??
         (data.boxes as ILightColorEventBox[]) ??
         LightColorEventBoxGroup.default.e
      ).map((obj) => new LightColorEventBox(obj));
      this._customData = deepCopy(data.customData ?? LightColorEventBoxGroup.default.customData);
   }

   static create(): LightColorEventBoxGroup[];
   static create(
      ...data: DeepPartial<
         IWrapLightColorEventBoxGroupAttribute<
            ILightColorEventBoxGroup,
            ILightColorEventBox,
            ILightColorBase,
            IIndexFilter
         >
      >[]
   ): LightColorEventBoxGroup[];
   static create(...data: DeepPartial<ILightColorEventBoxGroup>[]): LightColorEventBoxGroup[];
   static create(
      ...data: (DeepPartial<ILightColorEventBoxGroup> &
         DeepPartial<
            IWrapLightColorEventBoxGroupAttribute<
               ILightColorEventBoxGroup,
               ILightColorEventBox,
               ILightColorBase,
               IIndexFilter
            >
         >)[]
   ): LightColorEventBoxGroup[];
   static create(
      ...data: (DeepPartial<ILightColorEventBoxGroup> &
         DeepPartial<
            IWrapLightColorEventBoxGroupAttribute<
               ILightColorEventBoxGroup,
               ILightColorEventBox,
               ILightColorBase,
               IIndexFilter
            >
         >)[]
   ): LightColorEventBoxGroup[] {
      const result: LightColorEventBoxGroup[] = [];
      data.forEach((obj) => result.push(new this(obj)));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   toJSON(): ILightColorEventBoxGroup {
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
