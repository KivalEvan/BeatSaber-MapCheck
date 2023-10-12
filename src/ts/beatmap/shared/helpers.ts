import { CharacteristicName } from '../../types/beatmap/shared/characteristic';
import { EnvironmentAllName } from '../../types/beatmap/shared/environment';
import { INote } from '../../types/beatmap/v2/note';
import { IBaseObject as IV2BaseObject } from '../../types/beatmap/v2/object';
import { IBaseObject as IV3BaseObject } from '../../types/beatmap/v3/baseObject';
import { IWrapBaseObjectAttribute } from '../../types/beatmap/wrapper/baseObject';
import { IWrapInfo } from '../../types/beatmap/wrapper/info';
import { Vector2 } from '../../types/vector';
import { LANE_SIZE } from './constants';
import { IBombNote } from '../../types/beatmap/v3/bombNote';
import { IWrapGridObjectAttribute } from '../../types/beatmap/wrapper/gridObject';

/** Convert grid lane size unit to unity unit. */
export function gridToUnityUnit(value: number): number {
   return value * LANE_SIZE;
}

/** Convert unity unit to grid lane size unit. */
export function unityToGridUnit(value: number): number {
   return value / LANE_SIZE;
}

export function currentEnvironment(
   info: IWrapInfo,
   characteristic?: CharacteristicName,
): EnvironmentAllName {
   if (characteristic === '360Degree' || characteristic === '90Degree') {
      return info.allDirectionsEnvironmentName;
   }
   return info.environmentName;
}

/**
 * Pass this to wrapper object array `sort` function as an argument.
 * ```ts
 * data.basicEvents.sort(sortObjectFn);
 * ```
 */
export function sortObjectFn(a: IWrapBaseObjectAttribute, b: IWrapBaseObjectAttribute): number {
   return a.time - b.time;
}

/**
 * Pass this to wrapper note type array `sort` function as an argument.
 * ```ts
 * data.chains.sort(sortNoteFn);
 * ```
 */
export function sortNoteFn(a: IWrapGridObjectAttribute, b: IWrapGridObjectAttribute): number {
   if (Array.isArray(a.customData.coordinates) && Array.isArray(b.customData.coordinates)) {
      return (
         a.time - b.time ||
         (a.customData.coordinates as Vector2)[0] - (b.customData.coordinates as Vector2)[0] ||
         (a.customData.coordinates as Vector2)[1] - (b.customData.coordinates as Vector2)[1]
      );
   }
   if (Array.isArray(a.customData._position) && Array.isArray(b.customData._position)) {
      return (
         a.time - b.time ||
         (a.customData._position as Vector2)[0] - (b.customData._position as Vector2)[0] ||
         (a.customData._position as Vector2)[1] - (b.customData._position as Vector2)[1]
      );
   }
   return a.time - b.time || a.posX - b.posX || a.posY - b.posY;
}

/**
 * Pass this to v1 or v2 object array `sort` function as an argument.
 * ```ts
 * data._events.sort(sortV2ObjectFn);
 * ```
 */
export function sortV2ObjectFn(a: IV2BaseObject, b: IV2BaseObject): number {
   return a._time! - b._time!;
}

/**
 * Pass this to v1 or v2 note type array `sort` function as an argument.
 * ```ts
 * data._notes.sort(sortV2NoteFn);
 * ```
 */
export function sortV2NoteFn(a: INote, b: INote): number {
   if (Array.isArray(a._customData?._position) && Array.isArray(b._customData?._position)) {
      return (
         a._time! - b._time! ||
         (a._customData!._position as Vector2)[0] - (b._customData!._position as Vector2)[0] ||
         (a._customData!._position as Vector2)[1] - (b._customData!._position as Vector2)[1]
      );
   }
   return a._time! - b._time! || a._lineIndex! - b._lineLayer! || a._lineIndex! - b._lineLayer!;
}

/**
 * Pass this to v3 object array `sort` function as an argument.
 * ```ts
 * data.basicBeatmapEvents.sort(sortV3ObjectFn);
 * ```
 */
export function sortV3ObjectFn(a: IV3BaseObject, b: IV3BaseObject): number {
   return a.b! - b.b!;
}

/**
 * Pass this to v3 note type array `sort` function as an argument.
 * ```ts
 * data.arcs.sort(sortV3NoteFn);
 * ```
 */
export function sortV3NoteFn(a: IBombNote, b: IBombNote): number {
   if (Array.isArray(a.customData?.coordinates) && Array.isArray(b.customData?.coordinates)) {
      return (
         a.b! - b.b! ||
         (a.customData!.coordinates as Vector2)[0] - (b.customData!.coordinates as Vector2)[0] ||
         (a.customData!.coordinates as Vector2)[1] - (b.customData!.coordinates as Vector2)[1]
      );
   }
   return a.b! - b.b! || a.x! - b.x! || a.y! - b.y!;
}
