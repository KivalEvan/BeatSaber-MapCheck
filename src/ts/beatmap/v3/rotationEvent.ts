import { IRotationEvent } from '../../types/beatmap/v3/rotationEvent';
import { IWrapRotationEvent } from '../../types/beatmap/wrapper/rotationEvent';
import { ObjectReturnFn, PartialWrapper } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapRotationEvent } from '../wrapper/rotationEvent';

/** Rotation event beatmap v3 class object. */
export class RotationEvent extends WrapRotationEvent<Required<IRotationEvent>> {
    static default: ObjectReturnFn<Required<IRotationEvent>> = {
        b: 0,
        e: 0,
        r: 0,
        customData: () => {
            return {};
        },
    };

    protected constructor(rotationEvent: Required<IRotationEvent>) {
        super(rotationEvent);
    }

    static create(): RotationEvent[];
    static create(...rotationEvents: PartialWrapper<IWrapRotationEvent<Required<IRotationEvent>>>[]): RotationEvent[];
    static create(...rotationEvents: Partial<IRotationEvent>[]): RotationEvent[];
    static create(
        ...rotationEvents: (Partial<IRotationEvent> & PartialWrapper<IWrapRotationEvent<Required<IRotationEvent>>>)[]
    ): RotationEvent[];
    static create(
        ...rotationEvents: (Partial<IRotationEvent> & PartialWrapper<IWrapRotationEvent<Required<IRotationEvent>>>)[]
    ): RotationEvent[] {
        const result: RotationEvent[] = [];
        rotationEvents?.forEach((re) =>
            result.push(
                new this({
                    b: re.time ?? re.b ?? RotationEvent.default.b,
                    e: re.executionTime ?? re.e ?? RotationEvent.default.e,
                    r: re.rotation ?? re.r ?? RotationEvent.default.r,
                    customData: re.customData ?? RotationEvent.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: RotationEvent.default.b,
                e: RotationEvent.default.e,
                r: RotationEvent.default.r,
                customData: RotationEvent.default.customData(),
            }),
        ];
    }

    toJSON(): Required<IRotationEvent> {
        return {
            b: this.time,
            e: this.executionTime,
            r: this.rotation,
            customData: deepCopy(this.customData),
        };
    }

    get time() {
        return this.data.b;
    }
    set time(value: IRotationEvent['b']) {
        this.data.b = value;
    }

    get executionTime() {
        return this.data.e;
    }
    set executionTime(value: IRotationEvent['e']) {
        this.data.e = value;
    }

    get rotation() {
        return this.data.r;
    }
    set rotation(value: IRotationEvent['r']) {
        this.data.r = value;
    }

    get customData(): NonNullable<IRotationEvent['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<IRotationEvent['customData']>) {
        this.data.customData = value;
    }
}
