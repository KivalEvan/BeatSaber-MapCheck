import type { IWrapBaseObject } from '../../../types/beatmap/wrapper/baseObject.ts';
import { BaseItem } from './baseItem.ts';

/** Basic building block of beatmap object. */
export abstract class BaseObject extends BaseItem implements IWrapBaseObject {
   time: IWrapBaseObject['time'] = 0;

   setTime(value: this['time']): this {
      this.time = value;
      return this;
   }
}
