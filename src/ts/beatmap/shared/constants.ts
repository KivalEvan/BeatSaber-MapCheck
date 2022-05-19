/** Also known as lane count. */
export const LINE_COUNT = 4;

export enum NoteCutDirection {
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

/** Array index mapped to cut angle corresponding to the `_cutDirection`.
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
export const NoteCutAngle: Readonly<Record<number, number>> = {
    0: 180,
    1: 0,
    2: 270,
    3: 90,
    4: 225,
    5: 135,
    6: 315,
    7: 45,
    8: 0,
};

export const NoteFlipDirection: Readonly<Record<number, NoteCutDirection>> = {
    0: 1,
    1: 0,
    2: 3,
    3: 2,
    4: 7,
    5: 6,
    6: 5,
    7: 4,
    8: 8,
};

/** Array index mapped to tuple of `_lineIndex` and `_lineLayer` corresponding to the `_cutDirection`.
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
export const NoteCutDirectionSpace: Readonly<Record<number, [number, number]>> = {
    0: [0, 1],
    1: [0, -1],
    2: [-1, 0],
    3: [1, 0],
    4: [-1, 1],
    5: [1, 1],
    6: [-1, -1],
    7: [1, -1],
    8: [0, 0],
};

export enum BasicEventLightValue {
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

export enum BasicEventType {
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

export const EventLaneRotation: { [key: number]: number } = {
    0: -60,
    1: -45,
    2: -30,
    3: -15,
    4: 15,
    5: 30,
    6: 45,
    7: 60,
};

export enum EaseType {
    NONE = -1,
    LINEAR,
    IN_QUAD,
    OUT_QUAD,
    INOUT_QUAD,
}

/** Used for lane rotation event. */
export enum ExecutionTime {
    EARLY,
    LATE,
}

export enum TransitionType {
    INSTANT,
    INTERPOLATE,
    EXTEND,
}

/** Used for light rotation event. */
export enum Axis {
    X,
    Y,
}

export enum LightRotationDirection {
    AUTOMATIC,
    CLOCKWISE,
    COUNTER_CLOCKWISE,
}

export enum SliderMidAnchorMode {
    STRAIGHT,
    CLOCKWISE,
    COUNTER_CLOCKWISE,
}
