import { BaseObject } from './abstract/baseObject.ts';
import type {
   IWrapBPMEvent,
   IWrapBPMEventAttribute,
} from '../../types/beatmap/wrapper/bpmEvent.ts';
import { deepCopy } from '../../utils/misc.ts';

export class BPMEvent extends BaseObject implements IWrapBPMEvent {
   static defaultValue: IWrapBPMEventAttribute = {
      time: 0,
      bpm: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapBPMEventAttribute>[]): BPMEvent[] {
      return data.length ? data.map((obj) => new this(obj)) : [new this()];
   }
   constructor(data: Partial<IWrapBPMEventAttribute> = {}) {
      super();
      this.time = data.time ?? BPMEvent.defaultValue.time;
      this.bpm = data.bpm ?? BPMEvent.defaultValue.bpm;
      this.customData = deepCopy(data.customData ?? BPMEvent.defaultValue.customData);
   }

   isValid(fn?: (object: this) => boolean, override?: boolean): boolean {
      return override ? super.isValid(fn) : super.isValid(fn) && this.bpm > 0;
   }

   bpm: IWrapBPMEvent['bpm'];

   setBPM(value: this['bpm']): this {
      this.bpm = value;
      return this;
   }
}
