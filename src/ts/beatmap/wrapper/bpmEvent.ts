import { WrapBaseObject } from './baseObject';
import { IWrapBPMEvent } from '../../types/beatmap/wrapper/bpmEvent';

/** BPM change event beatmap class object. */
export abstract class WrapBPMEvent<T extends { [P in keyof T]: T[P] }>
   extends WrapBaseObject<T>
   implements IWrapBPMEvent<T>
{
   protected _bpm!: IWrapBPMEvent['bpm'];

   get bpm(): IWrapBPMEvent['bpm'] {
      return this._bpm;
   }
   set bpm(value: IWrapBPMEvent['bpm']) {
      this._bpm = value;
   }

   setBPM(value: IWrapBPMEvent['bpm']) {
      this.bpm = value;
      return this;
   }

   isValid(): boolean {
      return this.bpm > 0;
   }
}
