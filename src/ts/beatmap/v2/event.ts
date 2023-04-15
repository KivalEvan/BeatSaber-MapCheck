// deno-lint-ignore-file no-unused-vars
import { IEvent } from '../../types/beatmap/v2/event';
import { ObjectReturnFn } from '../../types/utils';
import {
    IChromaEventLaser,
    IChromaEventLight,
    IChromaEventRing,
} from '../../types/beatmap/v2/custom/chroma';
import { INEEvent } from '../../types/beatmap/v2/custom/noodleExtensions';
import { deepCopy } from '../../utils/misc';
import { EnvironmentAllName } from '../../types/beatmap/shared/environment';
import { WrapEvent } from '../wrapper/event';
import { IWrapEventAttribute } from '../../types/beatmap/wrapper/event';

/** Event beatmap v2 class object. */
export class Event extends WrapEvent<Required<IEvent>> {
    static default: ObjectReturnFn<Required<IEvent>> = {
        _time: 0,
        _type: 0,
        _value: 0,
        _floatValue: 1,
        _customData: () => {
            return {};
        },
    };

    protected constructor(event: Required<IEvent>) {
        super(event);
    }

    static create(): Event[];
    static create(...basicEvents: Partial<IWrapEventAttribute<Required<IEvent>>>[]): Event[];
    static create(...basicEvents: Partial<IEvent>[]): Event[];
    static create(
        ...basicEvents: (Partial<IEvent> & Partial<IWrapEventAttribute<Required<IEvent>>>)[]
    ): Event[];
    static create(
        ...basicEvents: (Partial<IEvent> & Partial<IWrapEventAttribute<Required<IEvent>>>)[]
    ): Event[] {
        const result: Event[] = [];
        basicEvents?.forEach((ev) =>
            result.push(
                new this({
                    _time: ev.time ?? ev._time ?? Event.default._time,
                    _type: ev.type ?? ev._type ?? Event.default._type,
                    _value: ev.value ?? ev._value ?? Event.default._value,
                    _floatValue: ev.floatValue ?? ev._floatValue ?? Event.default._floatValue,
                    _customData: ev.customData ?? ev._customData ?? Event.default._customData(),
                }),
            ),
        );
        if (result.length) {
            return result;
        }
        return [
            new this({
                _time: Event.default._time,
                _type: Event.default._type,
                _value: Event.default._value,
                _floatValue: Event.default._floatValue,
                _customData: Event.default._customData(),
            }),
        ];
    }

    toJSON(): Required<IEvent> {
        return {
            _time: this.time,
            _type: this.type,
            _value: this.value,
            _floatValue: this.floatValue,
            _customData: deepCopy(this.customData),
        };
    }

    get time() {
        return this.data._time;
    }
    set time(value: IEvent['_time']) {
        this.data._time = value;
    }

    get type() {
        return this.data._type;
    }
    set type(value: IEvent['_type']) {
        this.data._type = value;
    }

    get value() {
        return this.data._value;
    }
    set value(value: IEvent['_value']) {
        this.data._value = value;
    }

    get floatValue() {
        return this.data._floatValue;
    }
    set floatValue(value: IEvent['_floatValue']) {
        this.data._floatValue = value;
    }

    get customData(): NonNullable<IEvent['_customData']> {
        return this.data._customData;
    }
    set customData(value: NonNullable<IEvent['_customData']>) {
        this.data._customData = value;
    }

    isLightEvent(environment?: EnvironmentAllName): this is EventLight {
        return super.isLightEvent(environment);
    }

    isRingEvent(environment?: EnvironmentAllName): this is EventRing {
        return super.isRingEvent(environment);
    }

    isLaserRotationEvent(environment?: EnvironmentAllName): this is EventLaser {
        return super.isLaserRotationEvent(environment);
    }

    isLaneRotationEvent(environment?: EnvironmentAllName): this is EventLaneRotation {
        return super.isLaneRotationEvent(environment);
    }

    // holy shit i hate type guard
    isChroma(): boolean {
        const ev = this as Event;
        if (ev.isLightEvent()) {
            return (
                Array.isArray(this.customData._color) ||
                typeof this.customData._lightID === 'number' ||
                Array.isArray(this.customData._lightID) ||
                typeof this.customData._propID === 'number' ||
                typeof this.customData._lightGradient === 'object' ||
                typeof this.customData._easing === 'string' ||
                typeof this.customData._lerpType === 'string'
            );
        }
        if (ev.isRingEvent()) {
            return (
                typeof this.customData._nameFilter === 'string' ||
                typeof this.customData._reset === 'boolean' ||
                typeof this.customData._rotation === 'number' ||
                typeof this.customData._step === 'number' ||
                typeof this.customData._prop === 'number' ||
                typeof this.customData._speed === 'number' ||
                typeof this.customData._direction === 'number' ||
                typeof this.customData._counterSpin === 'boolean' ||
                typeof this.customData._stepMult === 'number' ||
                typeof this.customData._propMult === 'number' ||
                typeof this.customData._speedMult === 'number'
            );
        }
        if (ev.isLaserRotationEvent()) {
            return (
                typeof this.customData._lockPosition === 'boolean' ||
                typeof this.customData._speed === 'number' ||
                typeof this.customData._preciseSpeed === 'number' ||
                typeof this.customData._direction === 'number'
            );
        }
        return false;
    }

    isNoodleExtensions(): boolean {
        return this.isLaneRotationEvent() && typeof this.customData._rotation === 'number';
    }

    isMappingExtensions(): boolean {
        return this.isLaneRotationEvent() && this.value >= 1000 && this.value <= 1720;
    }
}

abstract class EventLight extends Event {
    get customData(): IChromaEventLight {
        return this.data._customData as IChromaEventLight;
    }
}

abstract class EventRing extends Event {
    get customData(): IChromaEventRing {
        return this.data._customData as IChromaEventRing;
    }
}

abstract class EventLaser extends Event {
    get customData(): IChromaEventLaser {
        return this.data._customData as IChromaEventLaser;
    }
}

abstract class EventLaneRotation extends Event {
    get customData(): INEEvent {
        return this.data._customData as INEEvent;
    }
}
