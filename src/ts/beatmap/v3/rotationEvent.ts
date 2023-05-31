import { IRotationEvent } from '../../types/beatmap/v3/rotationEvent';
import { IWrapRotationEventAttribute } from '../../types/beatmap/wrapper/rotationEvent';
import { ObjectReturnFn } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { WrapRotationEvent } from '../wrapper/rotationEvent';

/** Rotation event beatmap v3 class object. */
export class RotationEvent extends WrapRotationEvent<IRotationEvent> {
    static default: ObjectReturnFn<IRotationEvent> = {
        b: 0,
        e: 0,
        r: 0,
        customData: () => {
            return {};
        },
    };

    constructor();
    constructor(data: Partial<IWrapRotationEventAttribute<IRotationEvent>>);
    constructor(data: Partial<IRotationEvent>);
    constructor(
        data: Partial<IRotationEvent> & Partial<IWrapRotationEventAttribute<IRotationEvent>>,
    );
    constructor(
        data: Partial<IRotationEvent> & Partial<IWrapRotationEventAttribute<IRotationEvent>> = {},
    ) {
        super();

        this._time = data.time ?? data.b ?? RotationEvent.default.b;
        this._executionTime = data.executionTime ?? data.e ?? RotationEvent.default.e;
        this._rotation = data.rotation ?? data.r ?? RotationEvent.default.r;
        this._customData = data.customData ?? RotationEvent.default.customData();
    }

    static create(): RotationEvent[];
    static create(...data: Partial<IWrapRotationEventAttribute<IRotationEvent>>[]): RotationEvent[];
    static create(...data: Partial<IRotationEvent>[]): RotationEvent[];
    static create(
        ...data: (Partial<IRotationEvent> & Partial<IWrapRotationEventAttribute<IRotationEvent>>)[]
    ): RotationEvent[];
    static create(
        ...data: (Partial<IRotationEvent> & Partial<IWrapRotationEventAttribute<IRotationEvent>>)[]
    ): RotationEvent[] {
        const result: RotationEvent[] = [];
        data.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [new this()];
    }

    toJSON(): IRotationEvent {
        return {
            b: this.time,
            e: this.executionTime,
            r: this.rotation,
            customData: deepCopy(this.customData),
        };
    }

    get customData(): NonNullable<IRotationEvent['customData']> {
        return this._customData;
    }
    set customData(value: NonNullable<IRotationEvent['customData']>) {
        this._customData = value;
    }
}
