import { LANE_SIZE } from '../shared/constants.ts';

/** Convert grid lane size unit to unity unit. */
export function gridToUnityUnit(value: number): number {
   return value * LANE_SIZE;
}

/** Convert unity unit to grid lane size unit. */
export function unityToGridUnit(value: number): number {
   return value / LANE_SIZE;
}
