import { CustomDataEvent } from './customData';

// it took me long enough to realise Event is a built in JS interface, but it has no effect here anyway
export interface Event {
    _time: number;
    _type: number;
    _value: number;
    _floatValue?: number;
    _customData?: CustomDataEvent;
    [key: string]: number | CustomDataEvent | undefined;
}

export enum EventRename {
    'Back Lasers',
    'Ring Lights',
    'Left Lasers',
    'Right Lasers',
    'Center Lights',
    'Light Boost',
    'Extra Left Lights',
    'Extra Right Lights',
    'Ring Rotation',
    'Ring Zoom',
    'Extra Left Lasers',
    'Extra Right Lasers',
    'Left Laser Rotation',
    'Right Laser Rotation',
    'Early Lane Rotation',
    'Late Lane Rotation',
    'Lower Hydraulic',
    'Raise Hydraulic',
    'BPM Change' = 100,
}

interface EventCount {
    [key: number]: EventCountStats;
}

interface EventCountStats {
    total: number;
    chroma: number;
    chromaOld: number;
    noodleExtensions: number;
    mappingExtensions: number;
}

export const isValidType = (event: Event): boolean => {
    return (event._type >= 0 && event._type <= 17) || event._type === 100;
};

export const isLightEvent = (event: Event): boolean => {
    return (
        event._type >= 0 &&
        event._type <= 11 &&
        !isRingEvent(event) &&
        !isColorBoost(event)
    );
};

export const isColorBoost = (event: Event): boolean => {
    return event._type === 5;
};

export const isRingEvent = (event: Event): boolean => {
    return event._type === 8 || event._type === 9;
};

export const isLaserRotationEvent = (event: Event): boolean => {
    return event._type === 12 || event._type === 13;
};

export const isLaneRotationEvent = (event: Event): boolean => {
    return event._type === 14 || event._type === 15;
};

export const isHydraulicEvent = (event: Event): boolean => {
    return event._type === 16 || event._type === 17;
};

export const isBPMChangeEvent = (event: Event): boolean => {
    return event._type === 100;
};

// not to be confused with isLightEvent, this checks for event that affects the environment/lighting
export const isLightingEvent = (event: Event): boolean => {
    return (
        isLightEvent(event) ||
        isRingEvent(event) ||
        isLaserRotationEvent(event) ||
        isHydraulicEvent(event)
    );
};

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
    if (event._type === 8) {
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
    if (event._type === 9) {
        return typeof event._customData?._step === 'number';
    }
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

export const hasOldChroma = (event: Event): boolean => {
    return event._value >= 2000000000;
};

export const hasNoodleExtensions = (event: Event): boolean => {
    if (event._type === 14 || event._type === 15) {
        if (typeof event._customData?._rotation === 'number') {
            return true;
        }
    }
    return false;
};

export const hasMappingExtensions = (event: Event): boolean => {
    return (
        (event._type === 14 || event._type === 15) &&
        event._value >= 1000 &&
        event._value <= 1720
    );
};

export const isValid = (event: Event): boolean => {
    return (
        isValidType(event) &&
        event._value >= 0 &&
        !(!isLaserRotationEvent(event) && event._value > 8 && !hasOldChroma(event))
    );
};

const commonEvent = [0, 1, 2, 3, 4, 8, 9, 12, 13];
export const count = (events: Event[]): EventCount => {
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
