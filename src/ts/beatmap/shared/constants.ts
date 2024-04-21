import type { Vector2 } from '../../types/vector.ts';
import { NoteDirection } from '../../types/beatmap/shared/constants.ts';
export * from '../../types/beatmap/shared/constants.ts';

/** Also known as lane count. */
export const LINE_COUNT = 4;

/** Size of grid in unity unit */
export const LANE_SIZE = 0.6;

/** Size of regular note in unity unit */
export const NOTE_SIZE = [0.5, 0.5] as const;

/**
 * Cut angle corresponding to the `direction`.
 * ```ts
 * 0 (UP) -> 180
 * 1 (DOWN) -> 0
 * 2 (LEFT) -> 270
 * 3 (RIGHT) -> 90
 * 4 (UP_LEFT) -> 225
 * 5 (UP_RIGHT) -> 135
 * 6 (DOWN_LEFT) -> 315
 * 7 (DOWN_RIGHT) -> 45
 * 8 (ANY) -> 0
 * ```
 *
 * **NOTE:** Rotation in counter-clockwise.
 */
export const NoteDirectionAngle: { readonly [d in NoteDirection]: number } = {
   [NoteDirection.UP]: 180,
   [NoteDirection.DOWN]: 0,
   [NoteDirection.LEFT]: 270,
   [NoteDirection.RIGHT]: 90,
   [NoteDirection.UP_LEFT]: 225,
   [NoteDirection.UP_RIGHT]: 135,
   [NoteDirection.DOWN_LEFT]: 315,
   [NoteDirection.DOWN_RIGHT]: 45,
   [NoteDirection.ANY]: 0,
} as const;

/**
 * Opposite direction corresponding to the `direction`.
 * ```ts
 * 0 (UP) -> 1 (DOWN)
 * 1 (DOWN) -> 0 (UP)
 * 2 (LEFT) -> 3 (RIGHT)
 * 3 (RIGHT) -> 2 (LEFT)
 * 4 (UP_LEFT) -> 7 (DOWN_RIGHT)
 * 5 (UP_RIGHT) -> 6 (DOWN_LEFT)
 * 6 (DOWN_LEFT) -> 5 (UP_RIGHT)
 * 7 (DOWN_RIGHT) -> 4 (UP_LEFT)
 * 8 (ANY) -> 8 (ANY)
 * ```
 */
export const NoteDirectionFlip: {
   readonly [d in NoteDirection]: NoteDirection;
} = {
   [NoteDirection.UP]: NoteDirection.DOWN,
   [NoteDirection.DOWN]: NoteDirection.UP,
   [NoteDirection.LEFT]: NoteDirection.RIGHT,
   [NoteDirection.RIGHT]: NoteDirection.LEFT,
   [NoteDirection.UP_LEFT]: NoteDirection.DOWN_RIGHT,
   [NoteDirection.UP_RIGHT]: NoteDirection.DOWN_LEFT,
   [NoteDirection.DOWN_LEFT]: NoteDirection.UP_RIGHT,
   [NoteDirection.DOWN_RIGHT]: NoteDirection.UP_LEFT,
   [NoteDirection.ANY]: NoteDirection.ANY,
} as const;

/**
 * Array index mapped to tuple of `posX` and `posY` corresponding to the `direction`.
 * ```ts
 * 0 -> [0, 1]
 * 1 -> [0, -1]
 * 2 -> [-1, 0]
 * 3 -> [1, 0]
 * 4 -> [-1, 1]
 * 5 -> [1, 1]
 * 6 -> [-1, -1]
 * 7 -> [1, -1]
 * 8 -> [0, 0]
 * ```
 */
export const NoteDirectionSpace: {
   readonly [d in NoteDirection]: Readonly<Vector2>;
} = {
   [NoteDirection.UP]: [0, 1],
   [NoteDirection.DOWN]: [0, -1],
   [NoteDirection.LEFT]: [-1, 0],
   [NoteDirection.RIGHT]: [1, 0],
   [NoteDirection.UP_LEFT]: [-1, 1],
   [NoteDirection.UP_RIGHT]: [1, 1],
   [NoteDirection.DOWN_LEFT]: [-1, -1],
   [NoteDirection.DOWN_RIGHT]: [1, -1],
   [NoteDirection.ANY]: [0, 0],
} as const;

/** Unused as of beatmap v3, useful for conversion reason. */
export const EventLaneRotationValue: { readonly [key: number]: number } = {
   0: -60,
   1: -45,
   2: -30,
   3: -15,
   4: 15,
   5: 30,
   6: 45,
   7: 60,
} as const;

/** Unused as of beatmap v3, useful for conversion reason. */
export const EventValueLaneRotation: { readonly [key: number]: number } = {
   '-60': 0,
   '-45': 1,
   '-30': 2,
   '-15': 3,
   '15': 4,
   '30': 5,
   '45': 6,
   '60': 7,
} as const;
