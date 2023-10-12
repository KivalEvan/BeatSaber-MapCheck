import { IFxEventBoxGroup } from '../../types/beatmap/v3/fxEventBoxGroup';
import { DeepPartial } from '../../types/utils';
import { FxEventBox } from './fxEventBox';
import { WrapFxEventBoxGroup } from '../wrapper/fxEventBoxGroup';
import { deepCopy } from '../../utils/misc';
import { IFxEventBox } from '../../types/beatmap/v3/fxEventBox';
import { IIndexFilter } from '../../types/beatmap/v3/indexFilter';
import { IWrapFxEventBoxGroupAttribute } from '../../types/beatmap/wrapper/fxEventBoxGroup';

/** FX event box group beatmap v3 class object. */
export class FxEventBoxGroup extends WrapFxEventBoxGroup<
   IFxEventBoxGroup,
   IFxEventBox,
   IIndexFilter
> {
   static default: Required<IFxEventBoxGroup> = {
      b: 0,
      g: 0,
      e: [],
      t: 0,
      customData: {},
   };

   constructor();
   constructor(
      data: DeepPartial<IWrapFxEventBoxGroupAttribute<IFxEventBoxGroup, IFxEventBox, IIndexFilter>>,
   );
   constructor(data: DeepPartial<IFxEventBoxGroup>);
   constructor(
      data: DeepPartial<IFxEventBoxGroup> &
         DeepPartial<IWrapFxEventBoxGroupAttribute<IFxEventBoxGroup, IFxEventBox, IIndexFilter>>,
   );
   constructor(
      data: DeepPartial<IFxEventBoxGroup> &
         DeepPartial<
            IWrapFxEventBoxGroupAttribute<IFxEventBoxGroup, IFxEventBox, IIndexFilter>
         > = {},
   ) {
      super();

      this._time = data.b ?? data.time ?? FxEventBoxGroup.default.b;
      this._id = data.g ?? data.id ?? FxEventBoxGroup.default.g;
      this._boxes = (
         (data.e as unknown as IFxEventBox[]) ??
         (data.boxes as IFxEventBox[]) ??
         FxEventBoxGroup.default.e
      ).map((obj) => new FxEventBox(obj));
      this._type = data.t ?? data.type ?? FxEventBoxGroup.default.t;
      this._customData = deepCopy(data.customData ?? FxEventBoxGroup.default.customData);
   }

   static create(): FxEventBoxGroup[];
   static create(
      ...data: DeepPartial<
         IWrapFxEventBoxGroupAttribute<IFxEventBoxGroup, IFxEventBox, IIndexFilter>
      >[]
   ): FxEventBoxGroup[];
   static create(...data: DeepPartial<IFxEventBoxGroup>[]): FxEventBoxGroup[];
   static create(
      ...data: (DeepPartial<IFxEventBoxGroup> &
         DeepPartial<IWrapFxEventBoxGroupAttribute<IFxEventBoxGroup, IFxEventBox, IIndexFilter>>)[]
   ): FxEventBoxGroup[];
   static create(
      ...data: (DeepPartial<IFxEventBoxGroup> &
         DeepPartial<IWrapFxEventBoxGroupAttribute<IFxEventBoxGroup, IFxEventBox, IIndexFilter>>)[]
   ): FxEventBoxGroup[] {
      const result: FxEventBoxGroup[] = [];
      data.forEach((obj) => result.push(new this(obj)));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   toJSON(): Required<IFxEventBoxGroup> {
      return {
         b: this.time,
         g: this.id,
         e: this.boxes.map((e) => e.toJSON()),
         t: this.type,
         customData: deepCopy(this.customData),
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

   setCustomData(value: NonNullable<IFxEventBoxGroup['customData']>): this {
      this.customData = value;
      return this;
   }
   addCustomData(object: IFxEventBoxGroup['customData']): this {
      this.customData = { ...this.customData, object };
      return this;
   }

   isValid(): boolean {
      return this.id >= 0;
   }
}
