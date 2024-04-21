import type { IWrapLightColorEventBox } from '../../types/beatmap/wrapper/lightColorEventBox.ts';
import type { IWrapLightColorEventBoxGroup } from '../../types/beatmap/wrapper/lightColorEventBoxGroup.ts';
import { WrapEventBoxGroup } from './eventBoxGroup.ts';

/** Light color event box group beatmap class object. */
export abstract class WrapLightColorEventBoxGroup<
      TGroup extends { [P in keyof TGroup]: TGroup[P] },
      TBox extends { [P in keyof TBox]: TBox[P] },
      TBase extends { [P in keyof TBase]: TBase[P] },
      TFilter extends { [P in keyof TFilter]: TFilter[P] },
   >
   extends WrapEventBoxGroup<TGroup, TBox, TBase, TFilter>
   implements IWrapLightColorEventBoxGroup<TGroup, TBox, TBase, TFilter>
{
   protected declare _boxes: IWrapLightColorEventBox<TBox, TBase, TFilter>[];

   get boxes(): IWrapLightColorEventBox<TBox, TBase, TFilter>[] {
      return this._boxes;
   }
   set boxes(value: IWrapLightColorEventBox<TBox, TBase, TFilter>[]) {
      this._boxes = value;
   }
}
