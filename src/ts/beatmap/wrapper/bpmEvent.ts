import { WrapBaseObject } from './baseObject';
import { IWrapBPMEvent } from '../../types/beatmap/wrapper/bpmEvent';

/** BPM change event beatmap class object. */
export abstract class WrapBPMEvent<T extends Record<keyof T, unknown>>
    extends WrapBaseObject<T>
    implements IWrapBPMEvent
{
    abstract get bpm(): IWrapBPMEvent['bpm'];
    abstract set bpm(value: IWrapBPMEvent['bpm']);

    setBPM(value: IWrapBPMEvent['bpm']) {
        this.bpm = value;
        return this;
    }

    isValid(): boolean {
        return this.bpm > 0;
    }
}
