import { IBPMEvent } from '../../types/beatmap/v3/bpmEvent';
import { ObjectReturnFn } from '../../types/utils';
import { BaseObject } from './baseObject';
import { deepCopy } from '../../utils/misc';

/** BPM change event beatmap v3 class object. */
export class BPMEvent extends BaseObject<IBPMEvent> {
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
    static create(...bpmEvents: Partial<IBPMEvent>[]): BPMEvent[];
    static create(...bpmEvents: Partial<IBPMEvent>[]): BPMEvent[] {
        const result: BPMEvent[] = [];
        bpmEvents?.forEach((be) =>
            result.push(
                new this({
                    b: be.b ?? BPMEvent.default.b,
                    m: be.m ?? BPMEvent.default.m,
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

    /** Value `<float>` of BPM change event. */
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
}
