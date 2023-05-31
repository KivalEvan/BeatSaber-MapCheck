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
export class Event extends WrapEvent<IEvent> {
    static default: ObjectReturnFn<IEvent> = {
        _time: 0,
        _type: 0,
        _value: 0,
        _floatValue: 1,
        _customData: () => {
            return {};
        },
    };

    constructor();
    constructor(data: Partial<IWrapEventAttribute<IEvent>>);
    constructor(data: Partial<IEvent>);
    constructor(data: Partial<IEvent> & Partial<IWrapEventAttribute<IEvent>>);
    constructor(data: Partial<IEvent> & Partial<IWrapEventAttribute<IEvent>> = {}) {
        super();

        this._time = data.time ?? data._time ?? Event.default._time;
        this._type = data.type ?? data._type ?? Event.default._type;
        this._value = data.value ?? data._value ?? Event.default._value;
        this._floatValue = data.floatValue ?? data._floatValue ?? Event.default._floatValue;
        this._customData = data.customData ?? data._customData ?? Event.default._customData();
    }

    static create(): Event[];
    static create(...data: Partial<IWrapEventAttribute<IEvent>>[]): Event[];
    static create(...data: Partial<IEvent>[]): Event[];
    static create(...data: (Partial<IEvent> & Partial<IWrapEventAttribute<IEvent>>)[]): Event[];
    static create(...data: (Partial<IEvent> & Partial<IWrapEventAttribute<IEvent>>)[]): Event[] {
        const result: Event[] = [];
        data.forEach((obj) => result.push(new this(obj)));
        if (result.length) {
            return result;
        }
        return [new this()];
    }

    toJSON(): IEvent {
        return {
            _time: this.time,
            _type: this.type,
            _value: this.value,
            _floatValue: this.floatValue,
            _customData: deepCopy(this.customData),
        };
    }

    get customData(): NonNullable<IEvent['_customData']> {
        return this._customData;
    }
    set customData(value: NonNullable<IEvent['_customData']>) {
        this._customData = value;
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
        return this._customData as IChromaEventLight;
    }
}

abstract class EventRing extends Event {
    get customData(): IChromaEventRing {
        return this._customData as IChromaEventRing;
    }
}

abstract class EventLaser extends Event {
    get customData(): IChromaEventLaser {
        return this._customData as IChromaEventLaser;
    }
}

abstract class EventLaneRotation extends Event {
    get customData(): INEEvent {
        return this._customData as INEEvent;
    }
}
