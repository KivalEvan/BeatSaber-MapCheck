import {
    Event,
    EventLight,
    EventLaser,
    EventCount,
    EventRing,
    EventZoom,
    EventLaneRotation,
} from './types/event';
import { EnvironmentAllName } from './types/environment';
import { eventList } from './environment';

/**
 * Check if light event is an off event.
 * @param {Event} event - Beatmap light event
 * @returns {boolean} If light event is an off event
 */
export const isOff = (event: Event): boolean => {
    return event._value === 0;
};

/**
 * Check if light event is an on event.
 * @param {Event} event - Beatmap light event
 * @returns {boolean} If light event is an on event
 */
export const isOn = (event: Event): boolean => {
    return event._value === 1 || event._value === 5;
};

/**
 * Check if light event is a flash event.
 * @param {Event} event - Beatmap light event
 * @returns {boolean} If light event is a flash event
 */
export const isFlash = (event: Event): boolean => {
    return event._value === 2 || event._value === 6;
};

/**
 * Check if light event is a fade event.
 * @param {Event} event - Beatmap light event
 * @returns {boolean} If light event is a fade event
 */
export const isFade = (event: Event): boolean => {
    return event._value === 3 || event._value === 7;
};

/**
 * Check if light event is a transition event.
 * @param {Event} event - Beatmap light event
 * @returns {boolean} If light event is a transition event
 */
export const isTransition = (event: Event): boolean => {
    return event._value === 4 || event._value === 8;
};

/**
 * Check if event is a valid type.
 * @param {Event} event - Beatmap event
 * @returns {boolean} If event is a valid type
 */
export const isValidType = (event: Event): boolean => {
    return (event._type >= 0 && event._type <= 17) || event._type === 100;
};

/**
 * Check if event is a light event.
 * @param {Event} event - Beatmap event
 * @returns {boolean} If event is a light event
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

/**
 * Check if event is a boost event.
 * @param {Event} event - Beatmap event
 * @returns {boolean} If event is a boost event
 */
export const isColorBoost = (event: Event): boolean => {
    return event._type === 5;
};

/**
 * Check if event is a ring event.
 * @param {Event} event - Beatmap event
 * @returns {boolean} If event is a ring event
 */
export const isRingEvent = (event: Event): event is EventRing => {
    return event._type === 8;
};

/**
 * Check if event is a ring zoom event.
 * @param {Event} event - Beatmap event
 * @returns {boolean} If event is a ring zoom event
 */
export const isZoomEvent = (event: Event): event is EventZoom => {
    return event._type === 9;
};

/**
 * Check if event is a laser rotation event.
 * @param {Event} event - Beatmap event
 * @returns {boolean} If event is a laser rotation event
 */
export const isLaserRotationEvent = (event: Event): event is EventLaser => {
    return event._type === 12 || event._type === 13;
};

/**
 * Check if event is a lane rotation event.
 * @param {Event} event - Beatmap event
 * @returns {boolean} If event is a lane rotation event
 */
export const isLaneRotationEvent = (event: Event): event is EventLaneRotation => {
    return event._type === 14 || event._type === 15;
};

/**
 * Check if event is a hydraulic event.
 * @param {Event} event - Beatmap event
 * @returns {boolean} If event is a hydraulic event
 */
export const isExtraEvent = (event: Event): boolean => {
    return event._type === 16 || event._type === 17;
};

/**
 * Check if event is a BPM change event.
 * @param {Event} event - Beatmap event
 * @returns {boolean} If event is a BPM change event
 */
export const isBPMChangeEvent = (event: Event): boolean => {
    return event._type === 100;
};

/**
 * Not to be confused with isLightEvent, this checks for event that affects the environment/lighting.
 * @param {Event} event - Beatmap event
 * @returns {boolean} If event is a BPM change event
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

/**
 * Check if event has Chroma properties.
 * @param {Event} event - Beatmap event
 * @returns {boolean} If event has Chroma properties
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

/**
 * Check if event has old Chroma properties.
 * @param {Event} event - Beatmap event
 * @returns {boolean} If event has old Chroma properties
 */
export const hasOldChroma = (event: Event): boolean => {
    return event._value >= 2000000000;
};

/**
 * Check if event has Noodle Extensions properties.
 * @param {Event} event - Beatmap event
 * @returns {boolean} If event has Noodle Extensions properties
 */
export const hasNoodleExtensions = (event: Event): boolean => {
    if (event._type === 14 || event._type === 15) {
        if (typeof event._customData?._rotation === 'number') {
            return true;
        }
    }
    return false;
};

/**
 * Check if event has Mapping Extensions properties.
 * @param {Event} event - Beatmap event
 * @returns {boolean} If event has Mapping Extensions properties
 */
export const hasMappingExtensions = (event: Event): boolean => {
    return (
        (event._type === 14 || event._type === 15) &&
        event._value >= 1000 &&
        event._value <= 1720
    );
};

/**
 * Check if event is a valid, vanilla event.
 * @param {Event} event - Beatmap event
 * @returns {boolean} If event is a valid, vanilla event
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

/**
 * Count number of type of events with their properties in given array and return a event count object.
 * @param {Event[]} events - Array of beatmap event
 * @param {EnvironmentAllName} [environment] - Environment name
 * @returns {EventCount} Event count object
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
