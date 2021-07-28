import { CustomDataEvent } from './customData';

// it took me long enough to realise Event is also a built in JS object, but it has no effect here anyway
export interface Event {
    _time: number;
    _type: number;
    _value: number;
    _customData?: CustomDataEvent;
    [key: string]: any;
}

interface EventCount {}

export const count = (events: Event[]) => {
    const eventCount = {
        light: {
            backTop: 0,
            ring: 0,
            leftLaser: 0,
            rightLaser: 0,
            center: 0,
        },
        boost: 0,
        rrotate: 0,
        rzoom: 0,
        laser: 0,
        rot: 0,
        chroma: 0,
        ogc: 0,
        other: 0,
    };
    for (let i = events.length - 1; i >= 0; i--) {
        if (events[i]._type >= 0 && events[i]._type < 5) {
            if (events[i]._type === 0) {
                eventCount.light.backTop++;
            }
            if (events[i]._type === 1) {
                eventCount.light.ring++;
            }
            if (events[i]._type === 2) {
                eventCount.light.leftLaser++;
            }
            if (events[i]._type === 3) {
                eventCount.light.rightLaser++;
            }
            if (events[i]._type === 4) {
                eventCount.light.center++;
            }
            if (
                events[i]._customData?._color ||
                events[i]._customData?._lightID ||
                events[i]._customData?._propID ||
                events[i]._customData?._lightGradient
            ) {
                eventCount.chroma++;
            }
        }
        if (events[i]._type === 5) {
            eventCount.boost++;
        }
        if (events[i]._type === 8) {
            eventCount.rrotate++;
            if (events[i]._customData) {
                // lmao fuck this has a lot
                eventCount.chroma++;
            }
        }
        if (events[i]._type === 9) {
            eventCount.rzoom++;
        }
        if (events[i]._type === 12 || events[i]._type === 13) {
            eventCount.laser++;
            if (
                events[i]._customData?._lockPosition ||
                events[i]._customData?._preciseSpeed ||
                events[i]._customData?._direction
            ) {
                eventCount.chroma++;
            }
        }
        if (events[i]._type === 14 || events[i]._type === 15) {
            eventCount.rot++;
        }
        if (events[i]._value > 2000000000) {
            eventCount.ogc++;
        }
        eventCount.other++;
    }
    eventCount.other -=
        Object.values(eventCount.light).reduce((t, n) => t + n) +
        eventCount.boost +
        eventCount.rrotate +
        eventCount.rzoom +
        eventCount.laser +
        eventCount.rot +
        eventCount.ogc;
    return eventCount;
};

export const sufficientLight = (events: Event[]): boolean => {
    let count = 0;
    for (let i = events.length - 1; i >= 0; i--) {
        if (events[i]._type >= 0 && events[i]._type < 5 && events[i]._value !== 0) {
            count++;
            if (count > 10) {
                return true;
            }
        }
    }
    return false;
};
