import type {
   IWrapFxEventFloat,
   IWrapFxEventFloatAttribute,
} from '../../types/beatmap/wrapper/fxEventFloat.ts';
import { deepCopy } from '../../utils/misc.ts';
import { BaseObject } from './abstract/baseObject.ts';

export class FxEventFloat extends BaseObject implements IWrapFxEventFloat {
   static defaultValue: IWrapFxEventFloatAttribute = {
      time: 0,
      easing: 0,
      previous: 0,
      value: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapFxEventFloatAttribute>[]): FxEventFloat[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: Partial<IWrapFxEventFloatAttribute> = {}) {
      super();
      this.time = data.time ?? FxEventFloat.defaultValue.time;
      this.easing = data.easing ?? FxEventFloat.defaultValue.easing;
      this.previous = data.previous ?? FxEventFloat.defaultValue.previous;
      this.value = data.value ?? FxEventFloat.defaultValue.value;
      this.customData = deepCopy(data.customData ?? FxEventFloat.defaultValue.customData);
   }

   easing: IWrapFxEventFloat['easing'];
   previous: IWrapFxEventFloat['previous'];
   value: IWrapFxEventFloat['value'];

   setEasing(value: this['easing']): this {
      this.easing = value;
      return this;
   }
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
         : super.isValid(fn) &&
              (this.previous === 0 || this.previous === 1) &&
              this.easing >= -1 &&
              this.easing <= 103;
   }
}
