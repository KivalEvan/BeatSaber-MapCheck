import type { IBPMEvent } from '../../types/beatmap/v3/bpmEvent.ts';
import type { IWrapBPMEventAttribute } from '../../types/beatmap/wrapper/bpmEvent.ts';
import { deepCopy } from '../../utils/misc.ts';
import { WrapBPMEvent } from '../wrapper/bpmEvent.ts';

/** BPM change event beatmap v3 class object. */
export class BPMEvent extends WrapBPMEvent<IBPMEvent> {
   static default: Required<IBPMEvent> = {
      b: 0,
      m: 0,
      customData: {},
   };

   static create(...data: Partial<IWrapBPMEventAttribute<IBPMEvent>>[]): BPMEvent[] {
      const result: BPMEvent[] = data.map((obj) => new this(obj));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   constructor(data: Partial<IWrapBPMEventAttribute<IBPMEvent>> = {}) {
      super();
      this._time = data.time ?? BPMEvent.default.b;
      this._bpm = data.bpm ?? BPMEvent.default.m;
      this._customData = deepCopy(data.customData ?? BPMEvent.default.customData);
   }

   static fromJSON(data: Partial<IBPMEvent> = {}): BPMEvent {
      const d = new this();
      d._time = data.b ?? BPMEvent.default.b;
      d._bpm = data.m ?? BPMEvent.default.m;
      d._customData = deepCopy(data.customData ?? BPMEvent.default.customData);
      return d;
   }

   toJSON(): Required<IBPMEvent> {
      return {
         b: this.time,
         m: this.bpm,
         customData: deepCopy(this.customData),
      };
   }

   get customData(): NonNullable<IBPMEvent['customData']> {
      return this._customData;
   }
   set customData(value: NonNullable<IBPMEvent['customData']>) {
      this._customData = value;
   }

   setBPM(value: number): this {
      this.bpm = value;
      return this;
   }

   isValid(): boolean {
      return this.bpm > 0;
   }
}
