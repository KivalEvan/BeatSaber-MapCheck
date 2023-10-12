import { IWrapBaseItem } from '../../types/beatmap/wrapper/baseItem';
import { _ObtainCustomData } from '../../types/utils';
import { Serializable } from '../shared/serializable';

/** Basic building block of beatmap object. */
export abstract class WrapBaseItem<T extends { [P in keyof T]: T[P] }>
   extends Serializable<T>
   implements IWrapBaseItem<T>
{
   protected _customData!: _ObtainCustomData<T>;

   get customData(): _ObtainCustomData<T> {
      return this._customData;
   }
   set customData(value: _ObtainCustomData<T>) {
      this._customData = value;
   }

   setCustomData(value: _ObtainCustomData<T>): this {
      this.customData = value;
      return this;
   }
   resetCustomData() {
      this.customData = {} as _ObtainCustomData<T>;
      return this;
   }
   removeCustomData(key: string | string[]) {
      if (typeof key === 'string') {
         delete this.customData[key];
      } else {
         key.forEach((k) => delete this.customData[k]);
      }
      return this;
   }
   addCustomData(object: _ObtainCustomData<T>): this {
      for (const k in object) {
         this.customData[k] = object[k];
      }
      return this;
   }

   // deno-lint-ignore no-explicit-any
   func(fn: (object: this, ...args: any[]) => void, ...args: any[]) {
      fn(this, ...args);
      return this;
   }

   abstract isValid(): boolean;

   isChroma(): boolean {
      return false;
   }

   isNoodleExtensions(): boolean {
      return false;
   }

   isMappingExtensions(): boolean {
      return false;
   }
}
