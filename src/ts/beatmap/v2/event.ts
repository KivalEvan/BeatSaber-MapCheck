import {
    Event,
    EventCount,
    EventLaneRotation,
    EventLaser,
    EventLight,
    EventRing,
    EventZoom,
} from './types/event';
import { EnvironmentAllName } from '../shared/types/environment';
import { eventList } from '../shared/environment';

/** Check if light event is an off event.
 * ```ts
 * if (isOff(event)) {}
 * ```
 * This may check non-light event too.
 */
export const isOff = (event: Event): boolean => {
    return event._value === 0;
};

/** Check if light event is an on event.
 * ```ts
 * if (isOn(event)) {}
 * ```
 * This may check non-light event too.
 */
export const isOn = (event: Event): boolean => {
    return event._value === 1 || event._value === 5;
};

/** Check if light event is a flash event.
 * ```ts
 * if (isFlash(event)) {}
 * ```
 * This may check non-light event too.
 */
export const isFlash = (event: Event): boolean => {
    return event._value === 2 || event._value === 6;
};

/** Check if light event is a fade event.
 * ```ts
 * if (isFade(event)) {}
 * ```
 * This may check non-light event too.
 */
export const isFade = (event: Event): boolean => {
    return event._value === 3 || event._value === 7;
};

/** Check if light event is a transition event.
 * ```ts
 * if (isTransition(event)) {}
 * ```
 * This may check non-light event too.
 */
export const isTransition = (event: Event): boolean => {
    return event._value === 4 || event._value === 8;
};

/** Check if event is a valid type.
 * ```ts
 * if (isValidType(event)) {}
 * ```
 */
export const isValidType = (event: Event): boolean => {
    return (event._type >= 0 && event._type <= 17) || event._type === 100;
};

/** Check if event is a light event.
 * ```ts
 * if (isLightEvent(event)) {}
 * ```
 */
export const isLightEvent = (event: Event): event is EventLight => {
    return (
        event._type === 0 ||
        event._type === 1 ||
        event._type === 2 ||
        event._type === 3 ||
        event._type === 4 ||
        event._type === 6 ||
        event._type === 7 ||
        event._type === 10 ||
        event._type === 11
    );
};

/** Check if event is a boost event.
 * ```ts
 * if (isColorBoost(event)) {}
 * ```
 */
export const isColorBoost = (event: Event): boolean => {
    return event._type === 5;
};

/** Check if event is a ring event.
 * ```ts
 * if (isRingEvent(event)) {}
 * ```
 * This does not check for ring zoom.
 */
export const isRingEvent = (event: Event): event is EventRing => {
    return event._type === 8;
};

/** Check if event is a ring zoom event.
 * ```ts
 * if (isZoomEvent(event)) {}
 * ```
 */
export const isZoomEvent = (event: Event): event is EventZoom => {
    return event._type === 9;
};

/** Check if event is a laser rotation event.
 * ```ts
 * if (isLaserRotationEvent(event)) {}
 * ```
 */
export const isLaserRotationEvent = (event: Event): event is EventLaser => {
    return event._type === 12 || event._type === 13;
};

/** Check if event is a lane rotation event.
 * ```ts
 * if (isLaneRotationEvent(event)) {}
 * ```
 */
export const isLaneRotationEvent = (event: Event): event is EventLaneRotation => {
    return event._type === 14 || event._type === 15;
};

/** Check if event is a hydraulic event.
 * ```ts
 * if (isExtraEvent(event)) {}
 * ```
 */
export const isExtraEvent = (event: Event): boolean => {
    return event._type === 16 || event._type === 17;
};

/** Check if event is a BPM change event.
 * ```ts
 * if (isBPMChangeEvent(event)) {}
 * ```
 */
export const isBPMChangeEvent = (event: Event): boolean => {
    return event._type === 100;
};

/** Not to be confused with isLightEvent, this checks for event that affects the environment/lighting.
 * ```ts
 * if (isLightingEvent(event)) {}
 * ```
 */
export const isLightingEvent = (event: Event): boolean => {
    return (
        isLightEvent(event) ||
        isRingEvent(event) ||
        isZoomEvent(event) ||
        isLaserRotationEvent(event) ||
        isExtraEvent(event)
    );
};

/** Check if event has Chroma properties.
 * ```ts
 * if (hasChroma(event)) {}
 * ```
 */
// holy shit i hate type guard
export const hasChroma = (event: Event): boolean => {
    if (isLightEvent(event)) {
        return (
            Array.isArray(event._customData?._color) ||
            typeof event._customData?._lightID === 'number' ||
            Array.isArray(event._customData?._lightID) ||
            typeof event._customData?._propID === 'number' ||
            typeof event._customData?._lightGradient === 'object'
        );
    }
    event = event as Event;
    if (isRingEvent(event)) {
        return (
            typeof event._customData?._nameFilter === 'string' ||
            typeof event._customData?._reset === 'boolean' ||
            typeof event._customData?._rotation === 'number' ||
            typeof event._customData?._step === 'number' ||
            typeof event._customData?._prop === 'number' ||
            typeof event._customData?._speed === 'number' ||
            typeof event._customData?._direction === 'number' ||
            typeof event._customData?._counterSpin === 'boolean' ||
            typeof event._customData?._stepMult === 'number' ||
            typeof event._customData?._propMult === 'number' ||
            typeof event._customData?._speedMult === 'number'
        );
    }
    event = event as Event;
    if (isZoomEvent(event)) {
        return (
            typeof event._customData?._nameFilter === 'string' ||
            typeof event._customData?._reset === 'boolean' ||
            typeof event._customData?._rotation === 'number' ||
            typeof event._customData?._step === 'number' ||
            typeof event._customData?._prop === 'number' ||
            typeof event._customData?._speed === 'number' ||
            typeof event._customData?._direction === 'number' ||
            typeof event._customData?._counterSpin === 'boolean' ||
            typeof event._customData?._stepMult === 'number' ||
            typeof event._customData?._propMult === 'number' ||
            typeof event._customData?._speedMult === 'number'
        );
    }
    event = event as Event;
    if (isLaserRotationEvent(event)) {
        return (
            typeof event._customData?._lockPosition === 'boolean' ||
            typeof event._customData?._speed === 'number' ||
            typeof event._customData?._preciseSpeed === 'number' ||
            typeof event._customData?._direction === 'number'
        );
    }
    return false;
};

/** Check if event has old Chroma properties.
 * ```ts
 * if (hasOldChroma(event)) {}
 * ```
 */
export const hasOldChroma = (event: Event): boolean => {
    return event._value >= 2000000000;
};

/** Check if event has Noodle Extensions properties.
 * ```ts
 * if (hasNoodleExtensions(event)) {}
 * ```
 */
export const hasNoodleExtensions = (event: Event): boolean => {
    if (isLaneRotationEvent(event)) {
        if (typeof event._customData?._rotation === 'number') {
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
export const hasMappingExtensions = (event: Event): boolean => {
    return isLaneRotationEvent(event) && event._value >= 1000 && event._value <= 1720;
};

/** Check if event is a valid, vanilla event.
 * ```ts
 * if (isValid(event)) {}
 * ```
 */
export const isValid = (event: Event): boolean => {
    return (
        isValidType(event) &&
        event._value >= 0 &&
        !(
            !isLaserRotationEvent(event) &&
            (event as Event)._value > 8 &&
            !hasOldChroma(event)
        )
    );
};

/** Count number of type of events with their properties in given array and return a event count object.
 * ```ts
 * const list = count(events);
 * console.log(list);
 * ```
 */
export const count = (
    events: Event[],
    environment: EnvironmentAllName = 'DefaultEnvironment'
): EventCount => {
    const commonEvent = eventList[environment] ?? [0, 1, 2, 3, 4, 8, 9, 12, 13];
    const eventCount: EventCount = {};
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
        if (isValidType(events[i])) {
            if (!eventCount[events[i]._type]) {
                eventCount[events[i]._type] = {
                    total: 0,
                    chroma: 0,
                    chromaOld: 0,
                    noodleExtensions: 0,
                    mappingExtensions: 0,
                };
            }
            eventCount[events[i]._type].total++;
            if (hasChroma(events[i])) {
                eventCount[events[i]._type].chroma++;
            }
            if (hasOldChroma(events[i])) {
                eventCount[events[i]._type].chromaOld++;
            }
            if (hasNoodleExtensions(events[i])) {
                eventCount[events[i]._type].noodleExtensions++;
            }
            if (hasMappingExtensions(events[i])) {
                eventCount[events[i]._type].mappingExtensions++;
            }
        }
    }
    return eventCount;
};
