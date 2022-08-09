import { LANE_SIZE } from './constants';

/** Convert grid lane size unit to unity unit */
export function gridToUnityUnit(value: number) {
    return value * LANE_SIZE;
}

/** Convert unity unit to grid lane size unit */
export function unityToGridUnit(value: number) {
    return value / LANE_SIZE;
}
