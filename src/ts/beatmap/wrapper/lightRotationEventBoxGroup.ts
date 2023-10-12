import { WrapEventBoxGroup } from './eventBoxGroup';
import { IWrapLightRotationEventBoxGroup } from '../../types/beatmap/wrapper/lightRotationEventBoxGroup';
import { IWrapLightRotationEventBox } from '../../types/beatmap/wrapper/lightRotationEventBox';

/** Light rotation event box group beatmap class object. */
export abstract class WrapLightRotationEventBoxGroup<
      TGroup extends { [P in keyof TGroup]: TGroup[P] },
      TBox extends { [P in keyof TBox]: TBox[P] },
      TBase extends { [P in keyof TBase]: TBase[P] },
      TFilter extends { [P in keyof TFilter]: TFilter[P] },
   >
   extends WrapEventBoxGroup<TGroup, TBox, TBase, TFilter>
   implements IWrapLightRotationEventBoxGroup<TGroup, TBox, TBase, TFilter>
{
   protected declare _boxes: IWrapLightRotationEventBox<TBox, TBase, TFilter>[];

   get boxes(): IWrapLightRotationEventBox<TBox, TBase, TFilter>[] {
      return this._boxes;
   }
   set boxes(value: IWrapLightRotationEventBox<TBox, TBase, TFilter>[]) {
      this._boxes = value;
   }
}
