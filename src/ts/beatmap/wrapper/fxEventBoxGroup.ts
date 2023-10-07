import { WrapEventBoxGroup } from './eventBoxGroup';
import { IWrapFxEventBoxGroup } from '../../types/beatmap/wrapper/fxEventBoxGroup';
import { IWrapFxEventBox } from '../../types/beatmap/wrapper/fxEventBox';

/** FX event box group beatmap class object. */
export abstract class WrapFxEventBoxGroup<
      TGroup extends { [P in keyof TGroup]: TGroup[P] },
      TBox extends { [P in keyof TBox]: TBox[P] },
      TFilter extends { [P in keyof TFilter]: TFilter[P] },
   >
   extends WrapEventBoxGroup<TGroup, TBox, number, TFilter>
   implements IWrapFxEventBoxGroup<TGroup, TBox, TFilter>
{
   protected _type!: IWrapFxEventBoxGroup['type'];
   protected declare _boxes: IWrapFxEventBox<TBox, TFilter>[];

   get boxes(): IWrapFxEventBox<TBox, TFilter>[] {
      return this._boxes;
   }
   set boxes(value: IWrapFxEventBox<TBox, TFilter>[]) {
      this._boxes = value;
   }

   get type(): IWrapFxEventBoxGroup['type'] {
      return this._type;
   }
   set type(value: IWrapFxEventBoxGroup['type']) {
      this._type = value;
   }
}
