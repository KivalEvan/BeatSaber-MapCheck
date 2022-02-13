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
export interface ColorScheme {
    _colorLeft?: ColorObject;
    _colorRight?: ColorObject;
    _envColorLeft?: ColorObject;
    _envColorRight?: ColorObject;
    _envColorLeftBoost?: ColorObject;
    _envColorRightBoost?: ColorObject;
    _obstacleColor?: ColorObject;
}

/** Color Scheme property rename to human readable. */
export const colorSchemeRename: Readonly<{
    [k in keyof Required<ColorScheme>]: string;
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
    | 'GagaEnvironment';
/** List of available 360 environment in base game. */
export type Environment360Name = 'GlassDesertEnvironment';
/** List of all available environment in base game. */
export type EnvironmentAllName = EnvironmentName | Environment360Name;

/** List of available color scheme in base game. */
type ColorSchemeList =
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
    | 'Glass Desert';

export type EnvironmentScheme = {
    [key in ColorSchemeList]: ColorScheme;
};

/** Environment rename to human readable. */
export const rename: Readonly<Record<EnvironmentAllName, string>> = {
    DefaultEnvironment: 'The First',
    OriginsEnvironment: 'Origins',
    Origins: 'Origins (Triangle)', // because beat games
    TriangleEnvironment: 'Triangle',
    NiceEnvironment: 'Nice',
    BigMirrorEnvironment: 'Big Mirror',
    DragonsEnvironment: 'Dragons',
    KDAEnvironment: 'K/DA',
    MonstercatEnvironment: 'Monstercat',
    CrabRaveEnvironment: 'Crab Rave',
    PanicEnvironment: 'Panic',
    RocketEnvironment: 'Rocket',
    GreenDayEnvironment: 'Green Day',
    GreenDayGrenadeEnvironment: 'Green Day Grenade',
    TimbalandEnvironment: 'Timbaland',
    FitBeatEnvironment: 'FitBeat',
    LinkinParkEnvironment: 'Linkin Park',
    BTSEnvironment: 'BTS',
    KaleidoscopeEnvironment: 'Kaleidoscope',
    InterscopeEnvironment: 'Interscope',
    SkrillexEnvironment: 'Skrillex',
    BillieEnvironment: 'Billie',
    HalloweenEnvironment: 'Spooky',
    GagaEnvironment: 'Gaga',
    GlassDesertEnvironment: 'Glass Desert',
};

/** Record of Environment Color to Color Scheme. */
export const scheme: Readonly<Record<EnvironmentAllName, ColorSchemeList>> = {
    DefaultEnvironment: 'The First',
    OriginsEnvironment: 'Origins',
    Origins: 'The First', // because beat games
    TriangleEnvironment: 'The First',
    NiceEnvironment: 'The First',
    BigMirrorEnvironment: 'The First',
    DragonsEnvironment: 'The First',
    KDAEnvironment: 'KDA',
    MonstercatEnvironment: 'The First',
    CrabRaveEnvironment: 'Crab Rave',
    PanicEnvironment: 'The First',
    RocketEnvironment: 'Rocket',
    GreenDayEnvironment: 'Green Day',
    GreenDayGrenadeEnvironment: 'Green Day',
    TimbalandEnvironment: 'Timbaland',
    FitBeatEnvironment: 'FitBeat',
    LinkinParkEnvironment: 'Linkin Park',
    BTSEnvironment: 'BTS',
    KaleidoscopeEnvironment: 'Kaleidoscope',
    InterscopeEnvironment: 'Interscope',
    SkrillexEnvironment: 'Skrillex',
    BillieEnvironment: 'Billie Eilish',
    HalloweenEnvironment: 'Spooky',
    GagaEnvironment: 'Gaga',
    GlassDesertEnvironment: 'Glass Desert',
};
