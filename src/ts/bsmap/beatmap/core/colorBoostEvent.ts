import { BaseObject } from './abstract/baseObject.ts';
import type {
   IWrapColorBoostEvent,
   IWrapColorBoostEventAttribute,
} from '../../types/beatmap/wrapper/colorBoostEvent.ts';
import { deepCopy } from '../../utils/misc.ts';

export class ColorBoostEvent extends BaseObject implements IWrapColorBoostEvent {
   static defaultValue: IWrapColorBoostEventAttribute = {
      time: 0,
      toggle: false,
      customData: {},
   };

   static create(...data: Partial<IWrapColorBoostEventAttribute>[]): ColorBoostEvent[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: Partial<IWrapColorBoostEventAttribute> = {}) {
      super();
      this.time = data.time ?? ColorBoostEvent.defaultValue.time;
      this.toggle = data.toggle ?? ColorBoostEvent.defaultValue.toggle;
      this.customData = deepCopy(data.customData ?? ColorBoostEvent.defaultValue.customData);
   }

   toggle: IWrapColorBoostEvent['toggle'];

   setToggle(value: this['toggle']): this {
      this.toggle = value;
      return this;
   }
}
