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

export const isOff = (e: Event): boolean => {
    return e._value === 0;
};

export const isOn = (e: Event): boolean => {
    return e._value === 1 || e._value === 5;
};

export const isFlash = (e: Event): boolean => {
    return e._value === 2 || e._value === 6;
};

export const isFade = (e: Event): boolean => {
    return e._value === 3 || e._value === 7;
};

export const isTransition = (e: Event): boolean => {
    return e._value === 4 || e._value === 8;
};

export const isValidType = (e: Event): boolean => {
    return (e._type >= 0 && e._type <= 17) || e._type === 100;
};

export const isLightEvent = (e: Event): boolean => {
    return e._type >= 0 && e._type <= 11 && !isRingEvent(e) && !isColorBoost(e);
};

export const isColorBoost = (e: Event): boolean => {
    return e._type === 5;
};

export const isRingEvent = (e: Event): boolean => {
    return e._type === 8 || e._type === 9;
};

export const isLaserRotationEvent = (e: Event): boolean => {
    return e._type === 12 || e._type === 13;
};

export const isLaneRotationEvent = (e: Event): boolean => {
    return e._type === 14 || e._type === 15;
};

export const isHydraulicEvent = (e: Event): boolean => {
    return e._type === 16 || e._type === 17;
};

export const isBPMChangeEvent = (e: Event): boolean => {
    return e._type === 100;
};

// not to be confused with isLightEvent, this checks for event that affects the environment/lighting
export const isLightingEvent = (e: Event): boolean => {
    return (
        isLightEvent(e) ||
        isRingEvent(e) ||
        isLaserRotationEvent(e) ||
        isHydraulicEvent(e)
    );
};

export const hasChroma = (e: Event): boolean => {
    if (isLightEvent(e)) {
        return (
            Array.isArray(e._customData?._color) ||
            typeof e._customData?._lightID === 'number' ||
            Array.isArray(e._customData?._lightID) ||
            typeof e._customData?._propID === 'number' ||
            typeof e._customData?._lightGradient === 'object'
        );
    }
    if (e._type === 8) {
        return (
            typeof e._customData?._nameFilter === 'string' ||
            typeof e._customData?._reset === 'boolean' ||
            typeof e._customData?._rotation === 'number' ||
            typeof e._customData?._step === 'number' ||
            typeof e._customData?._prop === 'number' ||
            typeof e._customData?._speed === 'number' ||
            typeof e._customData?._direction === 'number' ||
            typeof e._customData?._counterSpin === 'boolean' ||
            typeof e._customData?._stepMult === 'number' ||
            typeof e._customData?._propMult === 'number' ||
            typeof e._customData?._speedMult === 'number'
        );
    }
    if (e._type === 9) {
        return typeof e._customData?._step === 'number';
    }
    if (isLaserRotationEvent(e)) {
        return (
            typeof e._customData?._lockPosition === 'boolean' ||
            typeof e._customData?._speed === 'number' ||
            typeof e._customData?._preciseSpeed === 'number' ||
            typeof e._customData?._direction === 'number'
        );
    }
    return false;
};

export const hasOldChroma = (e: Event): boolean => {
    return e._value >= 2000000000;
};

export const hasNoodleExtensions = (e: Event): boolean => {
    if (e._type === 14 || e._type === 15) {
        if (typeof e._customData?._rotation === 'number') {
            return true;
        }
    }
    return false;
};

export const hasMappingExtensions = (e: Event): boolean => {
    return (e._type === 14 || e._type === 15) && e._value >= 1000 && e._value <= 1720;
};

export const isValid = (e: Event): boolean => {
    return (
        isValidType(e) &&
        e._value >= 0 &&
        !(!isLaserRotationEvent(e) && e._value > 8 && !hasOldChroma(e))
    );
};

const commonEvent = [0, 1, 2, 3, 4, 8, 9, 12, 13];
export const count = (ev: Event[]): EventCount => {
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

    for (let i = ev.length - 1; i >= 0; i--) {
        if (isValidType(ev[i])) {
            if (!eventCount[ev[i]._type]) {
                eventCount[ev[i]._type] = {
                    total: 0,
                    chroma: 0,
                    chromaOld: 0,
                    noodleExtensions: 0,
                    mappingExtensions: 0,
                };
            }
            eventCount[ev[i]._type].total++;
            if (hasChroma(ev[i])) {
                eventCount[ev[i]._type].chroma++;
            }
            if (hasOldChroma(ev[i])) {
                eventCount[ev[i]._type].chromaOld++;
            }
            if (hasNoodleExtensions(ev[i])) {
                eventCount[ev[i]._type].noodleExtensions++;
            }
            if (hasMappingExtensions(ev[i])) {
                eventCount[ev[i]._type].mappingExtensions++;
            }
        }
    }
    return eventCount;
};
