import { IBPMEvent } from '../../types/beatmap/v3/bpmEvent';
import { IWrapBPMEvent } from '../../types/beatmap/wrapper/bpmEvent';
import { ObjectReturnFn, PartialWrapper } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapBPMEvent } from '../wrapper/bpmEvent';

/** BPM change event beatmap v3 class object. */
export class BPMEvent extends WrapBPMEvent<Required<IBPMEvent>> {
    static default: ObjectReturnFn<Required<IBPMEvent>> = {
        b: 0,
        m: 0,
        customData: () => {
            return {};
        },
    };

    protected constructor(bpmEvent: Required<IBPMEvent>) {
        super(bpmEvent);
    }

    static create(): BPMEvent[];
    static create(...bpmEvents: PartialWrapper<IWrapBPMEvent<Required<IBPMEvent>>>[]): BPMEvent[];
    static create(...bpmEvents: Partial<IBPMEvent>[]): BPMEvent[];
    static create(
        ...bpmEvents: (Partial<IBPMEvent> & PartialWrapper<IWrapBPMEvent<Required<IBPMEvent>>>)[]
    ): BPMEvent[];
    static create(
        ...bpmEvents: (Partial<IBPMEvent> & PartialWrapper<IWrapBPMEvent<Required<IBPMEvent>>>)[]
    ): BPMEvent[] {
        const result: BPMEvent[] = [];
        bpmEvents?.forEach((be) =>
            result.push(
                new this({
                    b: be.time ?? be.b ?? BPMEvent.default.b,
                    m: be.bpm ?? be.m ?? BPMEvent.default.m,
                    customData: be.customData ?? BPMEvent.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: BPMEvent.default.b,
                m: BPMEvent.default.m,
                customData: BPMEvent.default.customData(),
            }),
        ];
    }

    toJSON(): Required<IBPMEvent> {
        return {
            b: this.time,
            m: this.bpm,
            customData: deepCopy(this.customData),
        };
    }

    get time() {
        return this.data.b;
    }
    set time(value: IBPMEvent['b']) {
        this.data.b = value;
    }

    get bpm() {
        return this.data.m;
    }
    set bpm(value: IBPMEvent['m']) {
        this.data.m = value;
    }

    setBPM(value: IBPMEvent['m']) {
        this.bpm = value;
        return this;
    }

    get customData(): NonNullable<IBPMEvent['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<IBPMEvent['customData']>) {
        this.data.customData = value;
    }

    isValid(): boolean {
        return this.bpm > 0;
    }
}
