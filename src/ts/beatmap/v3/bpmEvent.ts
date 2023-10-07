import { IBPMEvent } from '../../types/beatmap/v3/bpmEvent';
import { IWrapBPMEventAttribute } from '../../types/beatmap/wrapper/bpmEvent';
import { deepCopy } from '../../utils/misc';
import { WrapBPMEvent } from '../wrapper/bpmEvent';

/** BPM change event beatmap v3 class object. */
export class BPMEvent extends WrapBPMEvent<IBPMEvent> {
   static default: Required<IBPMEvent> = {
      b: 0,
      m: 0,
      customData: {},
   };

   constructor();
   constructor(data: Partial<IWrapBPMEventAttribute<IBPMEvent>>);
   constructor(data: Partial<IBPMEvent>);
   constructor(data: Partial<IBPMEvent> & Partial<IWrapBPMEventAttribute<IBPMEvent>>);
   constructor(data: Partial<IBPMEvent> & Partial<IWrapBPMEventAttribute<IBPMEvent>> = {}) {
      super();

      this._time = data.b ?? data.time ?? BPMEvent.default.b;
      this._bpm = data.m ?? data.bpm ?? BPMEvent.default.m;
      this._customData = deepCopy(data.customData ?? BPMEvent.default.customData);
   }

   static create(): BPMEvent[];
   static create(...data: Partial<IWrapBPMEventAttribute<IBPMEvent>>[]): BPMEvent[];
   static create(...data: Partial<IBPMEvent>[]): BPMEvent[];
   static create(
      ...data: (Partial<IBPMEvent> & Partial<IWrapBPMEventAttribute<IBPMEvent>>)[]
   ): BPMEvent[];
   static create(
      ...data: (Partial<IBPMEvent> & Partial<IWrapBPMEventAttribute<IBPMEvent>>)[]
   ): BPMEvent[] {
      const result: BPMEvent[] = [];
      data.forEach((obj) => result.push(new this(obj)));
      if (result.length) {
         return result;
      }
      return [new this()];
   }

   toJSON(): IBPMEvent {
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

   setBPM(value: IBPMEvent['m']) {
      this.bpm = value;
      return this;
   }

   isValid(): boolean {
      return this.bpm > 0;
   }
}
