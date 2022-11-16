// deno-lint-ignore-file no-unused-vars
import { IBasicEvent } from '../../types/beatmap/v3/basicEvent';
import { IChromaEventLaser, IChromaEventLight, IChromaEventRing } from '../../types/beatmap/v3/custom/chroma';
import { ObjectReturnFn, PartialWrapper } from '../../types/utils';
import { deepCopy } from '../../utils/misc';
import { EnvironmentAllName } from '../../types/beatmap/shared/environment';
import { IWrapEvent } from '../../types/beatmap/wrapper/event';
import { WrapEvent } from '../wrapper/event';

/** Basic event beatmap v3 class object. */
export class BasicEvent extends WrapEvent<Required<IBasicEvent>> {
    static default: ObjectReturnFn<Required<IBasicEvent>> = {
        b: 0,
        et: 0,
        i: 0,
        f: 1,
        customData: () => {
            return {};
        },
    };

    protected constructor(basicEvent: Required<IBasicEvent>) {
        super(basicEvent);
    }

    static create(): BasicEvent[];
    static create(...basicEvents: PartialWrapper<IWrapEvent<Required<IBasicEvent>>>[]): BasicEvent[];
    static create(...basicEvents: Partial<IBasicEvent>[]): BasicEvent[];
    static create(
        ...basicEvents: (Partial<IBasicEvent> & PartialWrapper<IWrapEvent<Required<IBasicEvent>>>)[]
    ): BasicEvent[];
    static create(
        ...basicEvents: (Partial<IBasicEvent> & PartialWrapper<IWrapEvent<Required<IBasicEvent>>>)[]
    ): BasicEvent[] {
        const result: BasicEvent[] = [];
        basicEvents?.forEach((be) =>
            result.push(
                new this({
                    b: be.time ?? be.b ?? BasicEvent.default.b,
                    et: be.type ?? be.et ?? BasicEvent.default.et,
                    i: be.value ?? be.i ?? BasicEvent.default.i,
                    f: be.floatValue ?? be.f ?? BasicEvent.default.f,
                    customData: be.customData ?? BasicEvent.default.customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                b: BasicEvent.default.b,
                et: BasicEvent.default.et,
                i: BasicEvent.default.i,
                f: BasicEvent.default.f,
                customData: BasicEvent.default.customData(),
            }),
        ];
    }

    toJSON(): Required<IBasicEvent> {
        return {
            b: this.time,
            et: this.type,
            i: this.value,
            f: this.floatValue,
            customData: deepCopy(this.customData),
        };
    }

    get time() {
        return this.data.b;
    }
    set time(value: IBasicEvent['b']) {
        this.data.b = value;
    }

    get type() {
        return this.data.et;
    }
    set type(value: IBasicEvent['et']) {
        this.data.et = value;
    }

    get value() {
        return this.data.i;
    }
    set value(value: IBasicEvent['i']) {
        this.data.i = value;
    }

    get floatValue() {
        return this.data.f;
    }
    set floatValue(value: IBasicEvent['f']) {
        this.data.f = value;
    }

    get customData(): NonNullable<IBasicEvent['customData']> {
        return this.data.customData;
    }
    set customData(value: NonNullable<IBasicEvent['customData']>) {
        this.data.customData = value;
    }

    isLightEvent(environment?: EnvironmentAllName): this is BasicEventLight {
        return super.isLightEvent(environment);
    }

    isRingEvent(environment?: EnvironmentAllName): this is BasicEventRing {
        return super.isRingEvent(environment);
    }

    isLaserRotationEvent(environment?: EnvironmentAllName): this is BasicEventLaser {
        return super.isLaserRotationEvent(environment);
    }

    isLaneRotationEvent(environment?: EnvironmentAllName): this is BasicEventLaneRotation {
        return super.isLaneRotationEvent(environment);
    }

    // holy shit i hate type guard
    isChroma(): boolean {
        if (this.isLightEvent()) {
            return (
                Array.isArray(this.customData.color) ||
                typeof this.customData.lightID === 'number' ||
                Array.isArray(this.customData.lightID) ||
                typeof this.customData.easing === 'string' ||
                typeof this.customData.lerpType === 'string'
            );
        }
        if (this.isRingEvent()) {
            return (
                typeof this.customData.nameFilter === 'string' ||
                typeof this.customData.rotation === 'number' ||
                typeof this.customData.step === 'number' ||
                typeof this.customData.prop === 'number' ||
                typeof this.customData.speed === 'number' ||
                typeof this.customData.direction === 'number'
            );
        }
        if (this.isLaserRotationEvent()) {
            return (
                typeof this.customData.lockRotation === 'boolean' ||
                typeof this.customData.speed === 'number' ||
                typeof this.customData.direction === 'number'
            );
        }
        return false;
    }
}

abstract class BasicEventLight extends BasicEvent {
    get customData(): IChromaEventLight {
        return this.data.customData as IChromaEventLight;
    }
}

abstract class BasicEventRing extends BasicEvent {
    get customData(): IChromaEventRing {
        return this.data.customData as IChromaEventRing;
    }
}

abstract class BasicEventLaser extends BasicEvent {
    get customData(): IChromaEventLaser {
        return this.data.customData as IChromaEventLaser;
    }
}

abstract class BasicEventLaneRotation extends BasicEvent {}
