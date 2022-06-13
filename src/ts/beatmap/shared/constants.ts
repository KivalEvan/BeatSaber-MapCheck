// enum const is used regardless as this will never be compiled and reused by JS.
/** Also known as lane count. */
export const LINE_COUNT = 4;

export const enum NoteColor {
    RED,
    BLUE,
}

export const enum NoteCutDirection {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    UP_LEFT,
    UP_RIGHT,
    DOWN_LEFT,
    DOWN_RIGHT,
    ANY,
}

/** Array index mapped to cut angle corresponding to the `cutDirection`.
 * ```ts
 * 0 -> 180,
 * 1 -> 0,
 * 2 -> 270,
 * 3 -> 90,
 * 4 -> 225,
 * 5 -> 135,
 * 6 -> 315,
 * 7 -> 45,
 * 8 -> 0
 * ```
 */
export const NoteCutAngle: { [key: number]: number } = {
    [NoteCutDirection.UP]: 180,
    [NoteCutDirection.DOWN]: 0,
    [NoteCutDirection.LEFT]: 270,
    [NoteCutDirection.RIGHT]: 90,
    [NoteCutDirection.UP_LEFT]: 225,
    [NoteCutDirection.UP_RIGHT]: 135,
    [NoteCutDirection.DOWN_LEFT]: 315,
    [NoteCutDirection.DOWN_RIGHT]: 45,
    [NoteCutDirection.ANY]: 0,
} as const;

export const NoteFlipDirection: { [key: number]: NoteCutDirection } = {
    [NoteCutDirection.UP]: NoteCutDirection.DOWN,
    [NoteCutDirection.DOWN]: NoteCutDirection.UP,
    [NoteCutDirection.LEFT]: NoteCutDirection.RIGHT,
    [NoteCutDirection.RIGHT]: NoteCutDirection.LEFT,
    [NoteCutDirection.UP_LEFT]: NoteCutDirection.DOWN_RIGHT,
    [NoteCutDirection.UP_RIGHT]: NoteCutDirection.DOWN_LEFT,
    [NoteCutDirection.DOWN_LEFT]: NoteCutDirection.UP_RIGHT,
    [NoteCutDirection.DOWN_RIGHT]: NoteCutDirection.UP_LEFT,
    [NoteCutDirection.ANY]: NoteCutDirection.ANY,
} as const;

/** Array index mapped to tuple of `posX` and `posY` corresponding to the `cutDirection`.
 * ```ts
 * 0 -> [0, 1],
 * 1 -> [0, -1],
 * 2 -> [-1, 0],
 * 3 -> [1, 0],
 * 4 -> [-1, 1],
 * 5 -> [1, 1],
 * 6 -> [-1, -1],
 * 7 -> [1, -1],
 * 8 -> [0, 0]
 * ```
 */
export const NoteCutDirectionSpace: { [key: number]: Readonly<[number, number]> } = {
    [NoteCutDirection.UP]: [0, 1],
    [NoteCutDirection.DOWN]: [0, -1],
    [NoteCutDirection.LEFT]: [-1, 0],
    [NoteCutDirection.RIGHT]: [1, 0],
    [NoteCutDirection.UP_LEFT]: [-1, 1],
    [NoteCutDirection.UP_RIGHT]: [1, 1],
    [NoteCutDirection.DOWN_LEFT]: [-1, -1],
    [NoteCutDirection.DOWN_RIGHT]: [1, -1],
    [NoteCutDirection.ANY]: [0, 0],
} as const;

export const enum EventLightValue {
    OFF,
    BLUE_ON,
    BLUE_FLASH,
    BLUE_FADE,
    BLUE_TRANSITION,
    RED_ON,
    RED_FLASH,
    RED_FADE,
    RED_TRANSITION,
}

export const enum EventType {
    BACK_LASERS,
    RING_LIGHTS,
    LEFT_LASERS,
    RIGHT_LASERS,
    CENTER_LIGHTS,
    LIGHT_BOOST,
    EXTRA_LEFT_LIGHTS,
    EXTRA_RIGHT_LIGHTS,
    RING_ROTATION,
    RING_ZOOM,
    EXTRA_LEFT_LASERS,
    EXTRA_RIGHT_LASERS,
    LEFT_LASER_ROTATION,
    RIGHT_LASER_ROTATION,
    EARLY_LANE_ROTATION,
    LATE_LANE_ROTATION,
    UTILITY_EVENT_0,
    UTILITY_EVENT_1,
    UTILITY_EVENT_2,
    UTILITY_EVENT_3,
    SPECIAL_EVENT_0 = 40,
    SPECIAL_EVENT_1 = 41,
    SPECIAL_EVENT_2 = 42,
    SPECIAL_EVENT_3 = 43,
    BPM_CHANGE = 100,
}

/** Unused as of beatmap v3, useful for conversion reason. */
export const EventLaneRotationValue: { [key: number]: number } = {
    0: -60,
    1: -45,
    2: -30,
    3: -15,
    4: 15,
    5: 30,
    6: 45,
    7: 60,
} as const;

export const enum EaseType {
    NONE = -1,
    LINEAR,
    IN_QUAD,
    OUT_QUAD,
    INOUT_QUAD,
}

/** Used for lane rotation event. */
export const enum ExecutionTime {
    EARLY,
    LATE,
}

export const enum TransitionType {
    INSTANT,
    INTERPOLATE,
    EXTEND,
}

/** Used for light rotation event. */
export const enum Axis {
    X,
    Y,
}

export const enum LightRotationDirection {
    AUTOMATIC,
    CLOCKWISE,
    COUNTER_CLOCKWISE,
}

export const enum SliderMidAnchorMode {
    STRAIGHT,
    CLOCKWISE,
    COUNTER_CLOCKWISE,
}
