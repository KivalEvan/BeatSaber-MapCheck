import { IColor } from '../../colors';

/** Color Scheme interface for difficulty info custom data. */
export interface IColorScheme {
    _colorLeft?: Omit<IColor, 'a'>;
    _colorRight?: Omit<IColor, 'a'>;
    _envColorLeft?: Omit<IColor, 'a'>;
    _envColorRight?: Omit<IColor, 'a'>;
    _envColorWhite?: Omit<IColor, 'a'>;
    _envColorLeftBoost?: Omit<IColor, 'a'>;
    _envColorRightBoost?: Omit<IColor, 'a'>;
    _envColorWhiteBoost?: Omit<IColor, 'a'>;
    _obstacleColor?: Omit<IColor, 'a'>;
}

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
    | 'Weave'
    | 'Pyro'
    | 'EDM'
    | 'The Second'
    | 'Lizzo'
    | 'The Weeknd'
    | 'Glass Desert'
    | 'Rock Mixtape';

export type IEnvironmentScheme = {
    readonly [key in ColorSchemeList]: Readonly<IColorScheme>;
};
