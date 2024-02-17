export const enum NoteColor {
   RED,
   BLUE,
}

export const enum NoteDirection {
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

export const enum PosX {
   LEFT,
   MIDDLE_LEFT,
   MIDDLE_RIGHT,
   RIGHT,
}

export const enum PosY {
   BOTTOM,
   MIDDLE,
   TOP,
}

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
   WHITE_ON,
   WHITE_FLASH,
   WHITE_FADE,
   WHITE_TRANSITION,
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

export const enum IndexFilterType {
   DIVISION = 1,
   STEP_AND_OFFSET,
}

export const enum LimitAlsoAffectsType {
   NONE,
   DURATION,
   DISTRIBUTION,
   ALL,
}

export const enum RandomType {
   NO_RANDOM,
   KEEP_ORDER,
   RANDOM_ELEMENTS,
   ALL,
}

export const enum EventBoxColor {
   NONE = -1,
   RED,
   BLUE,
   WHITE,
}

export const enum DistributionType {
   WAVE = 1,
   STEP,
}

export const enum EaseType {
   NONE = -1,
   LINEAR,
   IN_QUAD,
   OUT_QUAD,
   INOUT_QUAD,
   IN_SINE,
   OUT_SINE,
   INOUT_SINE,
   IN_CUBIC,
   OUT_CUBIC,
   INOUT_CUBIC,
   IN_QUART,
   OUT_QUART,
   INOUT_QUART,
   IN_QUINT,
   OUT_QUINT,
   INOUT_QUINT,
   IN_EXPO,
   OUT_EXPO,
   INOUT_EXPO,
   IN_CIRC,
   OUT_CIRC,
   INOUT_CIRC,
   IN_BACK,
   OUT_BACK,
   INOUT_BACK,
   IN_ELASTIC,
   OUT_ELASTIC,
   INOUT_ELASTIC,
   IN_BOUNCE,
   OUT_BOUNCE,
   INOUT_BOUNCE,
   BS_INOUT_BACK = 100,
   BS_INOUT_ELASTIC,
   BS_INOUT_BOUNCE,
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
   Z,
}

/** Used for FX event box group. */
export const enum FxType {
   INT,
   FLOAT,
   BOOL,
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

export const enum EventBoxType {
   NONE,
   COLOR,
   ROTATION,
   TRANSLATION,
   FX_FLOAT,
}
