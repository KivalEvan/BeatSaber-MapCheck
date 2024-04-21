import type { IWrapEventBox } from '../../types/beatmap/wrapper/eventBox.ts';
import type { IWrapEventBoxGroup } from '../../types/beatmap/wrapper/eventBoxGroup.ts';
import { WrapBaseObject } from './baseObject.ts';

/** Base event box group beatmap class object. */
export abstract class WrapEventBoxGroup<
      TGroup extends { [P in keyof TGroup]: TGroup[P] },
      TBox extends { [P in keyof TBox]: TBox[P] },
      TBase extends { [P in keyof TBase]: TBase[P] },
      TFilter extends { [P in keyof TFilter]: TFilter[P] },
   >
   extends WrapBaseObject<TGroup>
   implements IWrapEventBoxGroup<TGroup>
{
   protected _id!: IWrapEventBoxGroup['id'];
   protected _boxes!: IWrapEventBox<TBox, TBase, TFilter>[];

   get id(): IWrapEventBoxGroup['id'] {
      return this._id;
   }
   set id(value: IWrapEventBoxGroup['id']) {
      this._id = value;
   }
   get boxes(): IWrapEventBox<TBox, TBase, TFilter>[] {
      return this._boxes;
   }
   set boxes(value: IWrapEventBox<TBox, TBase, TFilter>[]) {
      this._boxes = value;
   }

   isValid(): boolean {
      return this.id >= 0 && this.boxes.every((e) => e.isValid());
   }
}
