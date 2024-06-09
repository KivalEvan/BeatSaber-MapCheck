import type { IWrapEventBox } from '../../../types/beatmap/wrapper/eventBox.ts';
import type { IWrapEventBoxGroup } from '../../../types/beatmap/wrapper/eventBoxGroup.ts';
import { BaseObject } from './baseObject.ts';

/** Base event box group beatmap class object. */
export abstract class EventBoxGroup extends BaseObject implements IWrapEventBoxGroup {
   id: IWrapEventBoxGroup['id'] = 0;
   abstract boxes: IWrapEventBox[];

   isValid(fn?: (object: this) => boolean, override?: boolean): boolean {
      return override
         ? super.isValid(fn)
         : super.isValid(fn) && this.id >= 0 && this.boxes.every((e) => e.isValid());
   }
}
