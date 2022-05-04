import {
    IEvent,
    IEventBoost,
    IEventCount,
    IEventLaneRotation,
    IEventLaser,
    IEventLight,
    IEventRing,
    IEventZoom,
    IEventExtra,
    IEventSpecial,
    IEventBPMChange,
} from '../../types/beatmap/v2/event';
import { EnvironmentAllName } from '../../types/beatmap/shared/environment';
import { EventList } from '../shared/environment';
import { ObjectToReturn } from '../../types/utils';
import { BeatmapObject } from './object';
import { deepCopy } from '../../utils/misc';

/** Basic event beatmap object. */
export class Event extends BeatmapObject<IEvent> {
    static default: ObjectToReturn<Required<IEvent>> = {
        _time: 0,
        _type: 0,
        _value: 0,
        _floatValue: 1,
        _customData: () => {
            return {};
        },
    };

    private constructor(event: Required<IEvent>) {
        super(event);
    }

    static create(): Event;
    static create(basicEvents: Partial<IEvent>): Event;
    static create(...basicEvents: Partial<IEvent>[]): Event[];
    static create(...basicEvents: Partial<IEvent>[]): Event | Event[] {
        const result: Event[] = [];
        basicEvents?.forEach((ev) =>
            result.push(
                new Event({
                    _time: ev._time ?? Event.default._time,
                    _type: ev._type ?? Event.default._type,
                    _value: ev._value ?? Event.default._value,
                    _floatValue: ev._floatValue ?? Event.default._floatValue,
                    _customData: ev._customData ?? Event.default._customData(),
                })
            )
        );
        if (result.length === 1) {
            return result[0];
        }
        if (result.length) {
            return result;
        }
        return new Event({
            _time: Event.default._time,
            _type: Event.default._type,
            _value: Event.default._value,
            _floatValue: Event.default._floatValue,
            _customData: Event.default._customData(),
        });
    }

    toObject(): IEvent {
        return {
            _time: this.time,
            _type: this.type,
            _value: this.value,
            _floatValue: this.floatValue,
            _customData: deepCopy(this.customData),
        };
    }

    /** Event type `<int>` of basic event.
     * ```ts
     * 0 -> Back Lasers
     * 1 -> Ring Lights
     * 2 -> Left Lasers
     * 3 -> Right Lasers
     * 4 -> Center Lights
     * 5 -> Light Boost
     * 6 -> Extra Left Lights
     * 7 -> Extra Right Lights
     * 8 -> Ring Rotation
     * 9 -> Ring Zoom
     * 10 -> Extra Left Lasers
     * 11 -> Extra Right Lasers
     * 12 -> Left Laser Rotation
     * 13 -> Right Laser Rotation
     * 14 -> Early Lane Rotation
     * 15 -> Late Lane Rotation
     * 16 -> Utility Event 0
     * 17 -> Utility Event 1
     * 18 -> Utility Event 2
     * 19 -> Utility Event 3
     * 40 -> Special Event 0
     * 41 -> Special Event 1
     * 42 -> Special Event 2
     * 43 -> Special Event 3
     * 100 -> BPM Change
     * ```
     */
    get type() {
        return this.data._type;
    }
    set type(value: IEvent['_type']) {
        this.data._type = value;
    }

    /** Value `<int>` of basic event. */
    get value() {
        return this.data._value;
    }
    set value(value: IEvent['_value']) {
        this.data._value = value;
    }

    /** Float value `<float>` of basic event. */
    get floatValue() {
        return this.data._floatValue;
    }
    set floatValue(value: IEvent['_floatValue']) {
        this.data._floatValue = value;
    }

    setType(value: IEvent['_type']) {
        this.type = value;
        return this;
    }
    setValue(value: IEvent['_value']) {
        this.value = value;
        return this;
    }
    setFloatValue(value: IEvent['_floatValue']) {
        this.floatValue = value;
        return this;
    }

    /** Check if light  this is an off event.
     * ```ts
     * if (isOff(event)) {}
     * ```
     * ---
     * This may check non-light event too.
     */
    isOff = (): boolean => {
        return this.value === 0;
    };

    /** Check if light  this is an on event.
     * ```ts
     * if (isOn(event)) {}
     * ```
     * ---
     * This may check non-light event too.
     */
    isOn = (): boolean => {
        return this.value === 1 || this.value === 5;
    };

    /** Check if light  this is a flash event.
     * ```ts
     * if (isFlash(event)) {}
     * ```
     * ---
     * This may check non-light event too.
     */
    isFlash = (): boolean => {
        return this.value === 2 || this.value === 6;
    };

    /** Check if light  this is a fade event.
     * ```ts
     * if (isFade(event)) {}
     * ```
     * ---
     * This may check non-light event too.
     */
    isFade = (): boolean => {
        return this.value === 3 || this.value === 7;
    };

    /** Check if light  this is a transition event.
     * ```ts
     * if (isTransition(event)) {}
     * ```
     * This may check non-light event too.
     */
    isTransition = (): boolean => {
        return this.value === 4 || this.value === 8;
    };

    /** Check if  this is a valid type.
     * ```ts
     * if (isValidType(event)) {}
     * ```
     */
    isValidType = (): boolean => {
        return (this.type >= 0 && this.type <= 17) || this.type === 100;
    };

    /** Check if  this is a light event.
     * ```ts
     * if (isLightEvent(event)) {}
     * ```
     */
    isLightEvent = (): this is IEventLight => {
        return (
            this.type === 0 ||
            this.type === 1 ||
            this.type === 2 ||
            this.type === 3 ||
            this.type === 4 ||
            this.type === 6 ||
            this.type === 7 ||
            this.type === 10 ||
            this.type === 11
        );
    };

    /** Check if  this is a boost event.
     * ```ts
     * if (isColorBoost(event)) {}
     * ```
     */
    isColorBoost = (): this is IEventBoost => {
        return this.type === 5;
    };

    /** Check if  this is a ring event.
     * ```ts
     * if (isRingEvent(event)) {}
     * ```
     * ---
     * This does not check for ring zoom.
     */
    isRingEvent = (): this is IEventRing => {
        return this.type === 8;
    };

    /** Check if  this is a ring zoom event.
     * ```ts
     * if (isZoomEvent(event)) {}
     * ```
     */
    isZoomEvent = (): this is IEventZoom => {
        return this.type === 9;
    };

    /** Check if  this is a laser rotation event.
     * ```ts
     * if (isLaserRotationEvent(event)) {}
     * ```
     */
    isLaserRotationEvent = (): this is IEventLaser => {
        return this.type === 12 || this.type === 13;
    };

    /** Check if  this is a lane rotation event.
     * ```ts
     * if (isLaneRotationEvent(event)) {}
     * ```
     */
    isLaneRotationEvent = (): this is IEventLaneRotation => {
        return this.type === 14 || this.type === 15;
    };

    /** Check if  this is a extra event.
     * ```ts
     * if (isExtraEvent(event)) {}
     * ```
     */
    isExtraEvent = (): this is IEventExtra => {
        return (
            this.type === 16 || this.type === 17 || this.type === 18 || this.type === 19
        );
    };

    /** Check if  this is a special event.
     * ```ts
     * if (isSpecialEvent(event)) {}
     * ```
     */
    isSpecialEvent = (): this is IEventSpecial => {
        return (
            this.type === 40 || this.type === 41 || this.type === 42 || this.type === 43
        );
    };

    /** Check if  this is a BPM change event.
     * ```ts
     * if (isBPMChangeEvent(event)) {}
     * ```
     */
    isBPMChangeEvent = (): this is IEventBPMChange => {
        return this.type === 100;
    };

    /** Not to be confused with isLightEvent, this checks for event that affects the environment/lighting.
     * ```ts
     * if (isLightingEvent(event)) {}
     * ```
     */
    isLightingEvent = (): boolean => {
        return (
            this.isLightEvent() ||
            this.isRingEvent() ||
            this.isZoomEvent() ||
            this.isLaserRotationEvent() ||
            this.isExtraEvent()
        );
    };

    /** Check if event has Chroma properties.
     * ```ts
     * if (hasChroma(event)) {}
     * ```
     */
    // holy shit i hate type guard
    hasChroma = (): boolean => {
        if (this.isLightEvent()) {
            return (
                Array.isArray(this.customData?._color) ||
                typeof this.customData?._lightID === 'number' ||
                Array.isArray(this.customData?._lightID) ||
                typeof this.customData?._propID === 'number' ||
                typeof this.customData?._lightGradient === 'object'
            );
        }
        if (this.isRingEvent()) {
            return (
                typeof this.customData?._nameFilter === 'string' ||
                typeof this.customData?._reset === 'boolean' ||
                typeof this.customData?._rotation === 'number' ||
                typeof this.customData?._step === 'number' ||
                typeof this.customData?._prop === 'number' ||
                typeof this.customData?._speed === 'number' ||
                typeof this.customData?._direction === 'number' ||
                typeof this.customData?._counterSpin === 'boolean' ||
                typeof this.customData?._stepMult === 'number' ||
                typeof this.customData?._propMult === 'number' ||
                typeof this.customData?._speedMult === 'number'
            );
        }
        if (this.isZoomEvent()) {
            return (
                typeof this.customData?._nameFilter === 'string' ||
                typeof this.customData?._reset === 'boolean' ||
                typeof this.customData?._rotation === 'number' ||
                typeof this.customData?._step === 'number' ||
                typeof this.customData?._prop === 'number' ||
                typeof this.customData?._speed === 'number' ||
                typeof this.customData?._direction === 'number' ||
                typeof this.customData?._counterSpin === 'boolean' ||
                typeof this.customData?._stepMult === 'number' ||
                typeof this.customData?._propMult === 'number' ||
                typeof this.customData?._speedMult === 'number'
            );
        }
        if (this.isLaserRotationEvent()) {
            return (
                typeof this.customData?._lockPosition === 'boolean' ||
                typeof this.customData?._speed === 'number' ||
                typeof this.customData?._preciseSpeed === 'number' ||
                typeof this.customData?._direction === 'number'
            );
        }
        return false;
    };

    /** Check if event has old Chroma properties.
     * ```ts
     * if (hasOldChroma(event)) {}
     * ```
     */
    hasOldChroma = (): boolean => {
        return this.value >= 2000000000;
    };

    /** Check if event has Noodle Extensions properties.
     * ```ts
     * if (hasNoodleExtensions(event)) {}
     * ```
     */
    hasNoodleExtensions = (): boolean => {
        if (this.isLaneRotationEvent()) {
            if (typeof this.customData?._rotation === 'number') {
                return true;
            }
        }
        return false;
    };

    /** Check if event has Mapping Extensions properties.
     * ```ts
     * if (hasMappingExtensions(event)) {}
     * ```
     */
    hasMappingExtensions = (): boolean => {
        return this.isLaneRotationEvent() && this.value >= 1000 && this.value <= 1720;
    };

    /** Check if  this is a valid, vanilla event.
     * ```ts
     * if (isValid(event)) {}
     * ```
     */
    isValid = (): boolean => {
        return (
            this.isValidType() &&
            this.value >= 0 &&
            !(!this.isLaserRotationEvent() && this.value > 8 && !this.hasOldChroma())
        );
    };

    /** Count number of type of events with their properties in given array and return a event count object.
     * ```ts
     * const list = count(events);
     * console.log(list);
     * ```
     */
    count = (
        events: Event[],
        environment: EnvironmentAllName = 'DefaultEnvironment'
    ): IEventCount => {
        const commonEvent = EventList[environment][0] ?? [0, 1, 2, 3, 4, 8, 9, 12, 13];
        const eventCount: IEventCount = {};
        for (let i = commonEvent.length - 1; i >= 0; i--) {
            eventCount[commonEvent[i]] = {
                total: 0,
                chroma: 0,
                chromaOld: 0,
                noodleExtensions: 0,
                mappingExtensions: 0,
            };
        }

        for (let i = events.length - 1; i >= 0; i--) {
            if (this.isValidType()) {
                if (!eventCount[events[i].type]) {
                    eventCount[events[i].type] = {
                        total: 0,
                        chroma: 0,
                        chromaOld: 0,
                        noodleExtensions: 0,
                        mappingExtensions: 0,
                    };
                }
                eventCount[events[i].type].total++;
                if (this.hasChroma()) {
                    eventCount[events[i].type].chroma++;
                }
                if (this.hasOldChroma()) {
                    eventCount[events[i].type].chromaOld++;
                }
                if (this.hasNoodleExtensions()) {
                    eventCount[events[i].type].noodleExtensions++;
                }
                if (this.hasMappingExtensions()) {
                    eventCount[events[i].type].mappingExtensions++;
                }
            }
        }
        return eventCount;
    };
}
