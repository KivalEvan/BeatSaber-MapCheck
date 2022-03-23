import { ColorObject } from './colors';

/** Color Scheme interface for difficulty info custom data.
 * ```ts
 * _colorLeft?: { r: float, g: float, b: float },
 * _colorRight?: { r: float, g: float, b: float },
 * _envColorLeft?: { r: float, g: float, b: float },
 * _envColorRight?: { r: float, g: float, b: float },
 * _envColorLeftBoost?: { r: float, g: float, b: float },
 * _envColorRightBoost?: { r: float, g: float, b: float },
 * _obstacleColor?: { r: float, g: float, b: float }
 * ```
 */
export interface IColorScheme {
    _colorLeft?: Omit<ColorObject, 'a'>;
    _colorRight?: Omit<ColorObject, 'a'>;
    _envColorLeft?: Omit<ColorObject, 'a'>;
    _envColorRight?: Omit<ColorObject, 'a'>;
    _envColorLeftBoost?: Omit<ColorObject, 'a'>;
    _envColorRightBoost?: Omit<ColorObject, 'a'>;
    _obstacleColor?: Omit<ColorObject, 'a'>;
}

/** Color Scheme property rename to human readable. */
export const ColorSchemeRename: Readonly<{
    [k in keyof Required<IColorScheme>]: string;
}> = {
    _colorLeft: 'Left Note Color',
    _colorRight: 'Right Note Color',
    _envColorLeft: 'Left Environment Color',
    _envColorRight: 'Right Environment Color',
    _envColorLeftBoost: 'Left Environment Boost Color',
    _envColorRightBoost: 'Right Environment Boost Color',
    _obstacleColor: 'Obstacle Color',
};

/** List of available environment in base game. */
export type EnvironmentName =
    | 'DefaultEnvironment'
    | 'OriginsEnvironment'
    | 'Origins'
    | 'TriangleEnvironment'
    | 'NiceEnvironment'
    | 'BigMirrorEnvironment'
    | 'DragonsEnvironment'
    | 'KDAEnvironment'
    | 'MonstercatEnvironment'
    | 'CrabRaveEnvironment'
    | 'PanicEnvironment'
    | 'RocketEnvironment'
    | 'GreenDayEnvironment'
    | 'GreenDayGrenadeEnvironment'
    | 'TimbalandEnvironment'
    | 'FitBeatEnvironment'
    | 'LinkinParkEnvironment'
    | 'BTSEnvironment'
    | 'KaleidoscopeEnvironment'
    | 'InterscopeEnvironment'
    | 'SkrillexEnvironment'
    | 'BillieEnvironment'
    | 'HalloweenEnvironment'
    | 'GagaEnvironment'
    | 'WeaveEnvironment';
/** List of available 360 environment in base game. */
export type Environment360Name = 'GlassDesertEnvironment';
/** List of all available environment in base game. */
export type EnvironmentAllName = EnvironmentName | Environment360Name;

/** List of available color scheme in base game. */
export type ColorSchemeList =
    | 'Default Custom'
    | 'The First'
    | 'Origins'
    | 'KDA'
    | 'Crab Rave'
    | 'Noir'
    | 'Rocket'
    | 'Green Day'
    | 'Timbaland'
    | 'FitBeat'
    | 'Linkin Park'
    | 'BTS'
    | 'Kaleidoscope'
    | 'Interscope'
    | 'Skrillex'
    | 'Billie Eilish'
    | 'Spooky'
    | 'Gaga'
    | 'Glass Desert'
    | 'Weave';

export type IEnvironmentScheme = {
    [key in ColorSchemeList]: IColorScheme;
};
