import { ColorObject } from './colors';

/** Color Scheme interface for difficulty info custom data. */
export interface IColorScheme {
    _colorLeft?: Omit<ColorObject, 'a'>;
    _colorRight?: Omit<ColorObject, 'a'>;
    _envColorLeft?: Omit<ColorObject, 'a'>;
    _envColorRight?: Omit<ColorObject, 'a'>;
    _envColorWhite?: Omit<ColorObject, 'a'>;
    _envColorLeftBoost?: Omit<ColorObject, 'a'>;
    _envColorRightBoost?: Omit<ColorObject, 'a'>;
    _envColorWhiteBoost?: Omit<ColorObject, 'a'>;
    _obstacleColor?: Omit<ColorObject, 'a'>;
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
    | 'Glass Desert';

export type IEnvironmentScheme = {
    readonly [key in ColorSchemeList]: Readonly<IColorScheme>;
};
