import type {
   IWrapFxEventInt,
   IWrapFxEventIntAttribute,
} from '../../types/beatmap/wrapper/fxEventInt.ts';
import { deepCopy } from '../../utils/misc.ts';
import { BaseObject } from './abstract/baseObject.ts';

export class FxEventInt extends BaseObject implements IWrapFxEventInt {
   static defaultValue: IWrapFxEventIntAttribute = {
      time: 0,
      previous: 0,
      value: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapFxEventIntAttribute>[]): FxEventInt[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: Partial<IWrapFxEventIntAttribute> = {}) {
      super();
      this.time = data.time ?? FxEventInt.defaultValue.time;
      this.previous = data.previous ?? FxEventInt.defaultValue.previous;
      this.value = data.value ?? FxEventInt.defaultValue.value;
      this.customData = deepCopy(data.customData ?? FxEventInt.defaultValue.customData);
   }

   previous: IWrapFxEventInt['previous'] = 0;
   value: IWrapFxEventInt['value'] = 0;

   setPrevious(value: this['previous']): this {
      this.previous = value;
      return this;
   }
   setValue(value: this['value']): this {
      this.value = value;
      return this;
   }

   isValid(fn?: (object: this) => boolean, override?: boolean): boolean {
      return override
         ? super.isValid(fn)
         : super.isValid(fn) && (this.previous === 0 || this.previous === 1);
   }
}
