import type { IWrapBaseObject } from '../../types/beatmap/wrapper/baseObject.ts';
import { WrapBaseItem } from './baseItem.ts';

/** Basic building block of beatmap object. */
export abstract class WrapBaseObject<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseItem<T>
   implements IWrapBaseObject<T>
{
   protected _time!: IWrapBaseObject['time'];

   get time(): IWrapBaseObject['time'] {
      return this._time;
   }
   set time(value: IWrapBaseObject['time']) {
      this._time = value;
   }

   setTime(value: number): this {
      this.time = value;
      return this;
   }
}
