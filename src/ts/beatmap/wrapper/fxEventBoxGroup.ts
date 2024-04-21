import { WrapEventBoxGroup } from './eventBoxGroup.ts';
import type { IWrapFxEventBoxGroup } from '../../types/beatmap/wrapper/fxEventBoxGroup.ts';
import type { IWrapFxEventBox } from '../../types/beatmap/wrapper/fxEventBox.ts';

/** FX event box group beatmap class object. */
export abstract class WrapFxEventBoxGroup<
      TGroup extends { [P in keyof TGroup]: TGroup[P] },
      TBox extends { [P in keyof TBox]: TBox[P] },
      TBase extends { [P in keyof TBase]: TBase[P] },
      TFilter extends { [P in keyof TFilter]: TFilter[P] },
   >
   extends WrapEventBoxGroup<TGroup, TBox, TBase, TFilter>
   implements IWrapFxEventBoxGroup<TGroup, TBox, TBase, TFilter>
{
   protected declare _boxes: IWrapFxEventBox<TBox, TBase, TFilter>[];

   get boxes(): IWrapFxEventBox<TBox, TBase, TFilter>[] {
      return this._boxes;
   }
   set boxes(value: IWrapFxEventBox<TBox, TBase, TFilter>[]) {
      this._boxes = value;
   }
}
