import { Color } from '../colors';

export interface ColorScheme {
    _colorLeft?: Color;
    _colorRight?: Color;
    _envColorLeft?: Color;
    _envColorRight?: Color;
    _envColorLeftBoost?: Color;
    _envColorRightBoost?: Color;
    _obstacleColor?: Color;
    [key: string]: Color | undefined | null;
}

export enum ColorSchemeRename {
    '_colorLeft' = 'Left Note Color',
    '_colorRight' = 'Right Note Color',
    '_envColorLeft' = 'Left Environment Color',
    '_envColorRight' = 'Right Environment Color',
    '_envColorLeftBoost' = 'Left Environment Boost Color',
    '_envColorRightBoost' = 'Right Environment Boost Color',
    '_obstacleColor' = 'Obstacle Color',
}

export interface EnvironmentScheme {
    [key: string]: ColorScheme;
}

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
    | 'GlassDesertEnvironment';

export enum EnvironmentRename {
    DefaultEnvironment = 'The First',
    OriginsEnvironment = 'Origins',
    Origins = 'Origins', // because beat games
    TriangleEnvironment = 'Triangle',
    NiceEnvironment = 'Nice',
    BigMirrorEnvironment = 'Big Mirror',
    DragonsEnvironment = 'Dragons',
    KDAEnvironment = 'K/DA',
    MonstercatEnvironment = 'Monstercat',
    CrabRaveEnvironment = 'Crab Rave',
    PanicEnvironment = 'Panic',
    RocketEnvironment = 'Rocket',
    GreenDayEnvironment = 'Green Day',
    GreenDayGrenadeEnvironment = 'Green Day Grenade',
    TimbalandEnvironment = 'Timbaland',
    FitBeatEnvironment = 'FitBeat',
    LinkinParkEnvironment = 'Linkin Park',
    BTSEnvironment = 'BTS',
    KaleidoscopeEnvironment = 'Kaleidoscope',
    InterscopeEnvironment = 'Interscope',
    GlassDesertEnvironment = 'Glass Desert',
}

export enum EnvironmentColor {
    DefaultEnvironment = 'The First',
    OriginsEnvironment = 'Origins',
    Origins = 'Origins', // because beat games
    TriangleEnvironment = 'The First',
    NiceEnvironment = 'The First',
    BigMirrorEnvironment = 'The First',
    DragonsEnvironment = 'The First',
    KDAEnvironment = 'KDA',
    MonstercatEnvironment = 'The First',
    CrabRaveEnvironment = 'Crab Rave',
    PanicEnvironment = 'The First',
    RocketEnvironment = 'Rocket',
    GreenDayEnvironment = 'Green Day',
    GreenDayGrenadeEnvironment = 'Green Day',
    TimbalandEnvironment = 'Timbaland',
    FitBeatEnvironment = 'FitBeat',
    LinkinParkEnvironment = 'Linkin Park',
    BTSEnvironment = 'BTS',
    KaleidoscopeEnvironment = 'Kaleidoscope',
    InterscopeEnvironment = 'Interscope',
    GlassDesertEnvironment = 'Glass Desert',
}

export const colorScheme: EnvironmentScheme = {
    'Default Custom': {
        _colorLeft: {
            r: 0.7529412,
            g: 0.1882353,
            b: 0.1882353,
        },
        _colorRight: {
            r: 0.1254902,
            g: 0.3921569,
            b: 0.6588235,
        },
        _envColorLeft: {
            r: 0.7529412,
            g: 0.1882353,
            b: 0.1882353,
        },
        _envColorRight: {
            r: 0.1882353,
            g: 0.5960785,
            b: 1,
        },
        _obstacleColor: {
            r: 1,
            g: 0.1882353,
            b: 0.1882353,
        },
    },
    'The First': {
        _colorLeft: {
            r: 0.7843137,
            g: 0.07843138,
            b: 0.07843138,
        },
        _colorRight: {
            r: 0.1568627,
            g: 0.5568627,
            b: 0.8235294,
        },
        _envColorLeft: {
            r: 0.85,
            g: 0.08499997,
            b: 0.08499997,
        },
        _envColorRight: {
            r: 0.1882353,
            g: 0.675294,
            b: 1,
        },
        _obstacleColor: {
            r: 1,
            g: 0.1882353,
            b: 0.1882353,
        },
    },
    Origins: {
        _colorLeft: {
            r: 0.6792453,
            g: 0.5712628,
            b: 0,
        },
        _colorRight: {
            r: 0.7075472,
            g: 0,
            b: 0.5364411,
        },
        _envColorLeft: {
            r: 0.4910995,
            g: 0.6862745,
            b: 0.7,
        },
        _envColorRight: {
            r: 0.03844783,
            g: 0.6862745,
            b: 0.9056604,
        },
        _obstacleColor: {
            r: 0.06167676,
            g: 0.2869513,
            b: 0.3962264,
        },
    },
    KDA: {
        _colorLeft: {
            r: 0.6588235,
            g: 0.2627451,
            b: 0.1607843,
        },
        _colorRight: {
            r: 0.5019608,
            g: 0.08235294,
            b: 0.572549,
        },
        _envColorLeft: {
            r: 1,
            g: 0.3960785,
            b: 0.2431373,
        },
        _envColorRight: {
            r: 0.7607844,
            g: 0.1254902,
            b: 0.8666667,
        },
        _obstacleColor: {
            r: 1,
            g: 0.3960785,
            b: 0.2431373,
        },
    },
    'Crab Rave': {
        _colorLeft: {
            r: 0,
            g: 0.7130001,
            b: 0.07806564,
        },
        _colorRight: {
            r: 0.04805952,
            g: 0.5068096,
            b: 0.734,
        },
        _envColorLeft: {
            r: 0.134568,
            g: 0.756,
            b: 0.1557533,
        },
        _envColorRight: {
            r: 0.05647058,
            g: 0.6211764,
            b: 0.9,
        },
        _obstacleColor: {
            r: 0,
            g: 0.8117648,
            b: 0.09019608,
        },
    },
    Noir: {
        _colorLeft: {
            r: 0.1792453,
            g: 0.1792453,
            b: 0.1792453,
        },
        _colorRight: {
            r: 0.5943396,
            g: 0.5943396,
            b: 0.5943396,
        },
        _envColorLeft: {
            r: 0.4056604,
            g: 0.4056604,
            b: 0.4056604,
        },
        _envColorRight: {
            r: 0.6037736,
            g: 0.6037736,
            b: 0.6037736,
        },
        _obstacleColor: {
            r: 0.2358491,
            g: 0.2358491,
            b: 0.2358491,
        },
    },
    Rocket: {
        _colorLeft: {
            r: 1,
            g: 0.4980392,
            b: 0,
        },
        _colorRight: {
            r: 0,
            g: 0.5294118,
            b: 1,
        },
        _envColorLeft: {
            r: 0.9,
            g: 0.4866279,
            b: 0.3244186,
        },
        _envColorRight: {
            r: 0.4,
            g: 0.7180724,
            b: 1,
        },
        _obstacleColor: {
            r: 0.3176471,
            g: 0.6117647,
            b: 0.7254902,
        },
    },
    'Green Day': {
        _colorLeft: {
            r: 0.2588235,
            g: 0.7843138,
            b: 0.01960784,
        },
        _colorRight: {
            r: 0,
            g: 0.7137255,
            b: 0.6705883,
        },
        _envColorLeft: {
            r: 0,
            g: 0.7137255,
            b: 0.6705883,
        },
        _envColorRight: {
            r: 0.2588235,
            g: 0.7843137,
            b: 0.01960784,
        },
        _obstacleColor: {
            r: 0,
            g: 0.8117648,
            b: 0.09019608,
        },
    },
    Timbaland: {
        _colorLeft: {
            r: 0.5019608,
            g: 0.5019608,
            b: 0.5019608,
        },
        _colorRight: {
            r: 0.1,
            g: 0.5517647,
            b: 1,
        },
        _envColorLeft: {
            r: 0.1,
            g: 0.5517647,
            b: 1,
        },
        _envColorRight: {
            r: 0.1,
            g: 0.5517647,
            b: 1,
        },
        _obstacleColor: {
            r: 0.5,
            g: 0.5,
            b: 0.5,
        },
    },
    FitBeat: {
        _colorLeft: {
            r: 0.8000001,
            g: 0.6078432,
            b: 0.1568628,
        },
        _colorRight: {
            r: 0.7921569,
            g: 0.1607843,
            b: 0.682353,
        },
        _envColorLeft: {
            r: 0.8,
            g: 0.5594772,
            b: 0.5594772,
        },
        _envColorRight: {
            r: 0.5594772,
            g: 0.5594772,
            b: 0.8,
        },
        _obstacleColor: {
            r: 0.2784314,
            g: 0.2784314,
            b: 0.4,
        },
    },
    'Linkin Park': {
        _colorLeft: {
            r: 0.6627451,
            g: 0.1643608,
            b: 0.1690187,
        },
        _colorRight: {
            r: 0.3870196,
            g: 0.5168997,
            b: 0.5568628,
        },
        _envColorLeft: {
            r: 0.7529412,
            g: 0.672753,
            b: 0.5925647,
        },
        _envColorRight: {
            r: 0.6241197,
            g: 0.6890281,
            b: 0.709,
        },
        _envColorLeftBoost: {
            r: 0.922,
            g: 0.5957885,
            b: 0.255394,
        },
        _envColorRightBoost: {
            r: 0.282353,
            g: 0.4586275,
            b: 0.6235294,
        },
        _obstacleColor: {
            r: 0.6627451,
            g: 0.1647059,
            b: 0.172549,
        },
    },
    BTS: {
        _colorLeft: {
            r: 1,
            g: 0.09019607,
            b: 0.4059771,
        },
        _colorRight: {
            r: 0.8018868,
            g: 0,
            b: 0.7517689,
        },
        _envColorLeft: {
            r: 0.7843137,
            g: 0.1254902,
            b: 0.5010797,
        },
        _envColorRight: {
            r: 0.6941177,
            g: 0.1254902,
            b: 0.8666667,
        },
        _envColorLeftBoost: {
            r: 0.9019608,
            g: 0.5411765,
            b: 1,
        },
        _envColorRightBoost: {
            r: 0.3490196,
            g: 0.8078431,
            b: 1,
        },
        _obstacleColor: {
            r: 0.6698113,
            g: 0.1800908,
            b: 0.5528399,
        },
    },
    Kaleidoscope: {
        _colorLeft: {
            r: 0.65882355,
            g: 0.1254902,
            b: 0.1254902,
        },
        _colorRight: {
            r: 0.28235295,
            g: 0.28235295,
            b: 0.28235295,
        },
        _envColorLeft: {
            r: 0.65882355,
            g: 0.1254902,
            b: 0.1254902,
        },
        _envColorRight: {
            r: 0.47058824,
            g: 0.47058824,
            b: 0.47058824,
        },
        _envColorLeftBoost: {
            r: 0.50196081,
            g: 0,
            b: 0,
        },
        _envColorRightBoost: {
            r: 0.49244517,
            g: 0,
            b: 0.53725493,
        },
        _obstacleColor: {
            r: 0.25098041,
            g: 0.25098041,
            b: 0.25098041,
        },
    },
    Interscope: {
        _colorLeft: {
            r: 0.726415,
            g: 0.62691,
            b: 0.31181,
        },
        _colorRight: {
            r: 0.589571,
            g: 0.297888,
            b: 0.723,
        },
        _envColorLeft: {
            r: 0.724254,
            g: 0.319804,
            b: 0.913725,
        },
        _envColorRight: {
            r: 0.764706,
            g: 0.758971,
            b: 0.913725,
        },
        _envColorLeftBoost: {
            r: 0.792453,
            g: 0.429686,
            b: 0.429868,
        },
        _envColorRightBoost: {
            r: 0.7038,
            g: 0.715745,
            b: 0.765,
        },
        _obstacleColor: {
            r: 0.588235,
            g: 0.298039,
            b: 0.721569,
        },
    },
    'Glass Desert': {
        _colorLeft: {
            r: 0.6792453,
            g: 0.5712628,
            b: 0,
        },
        _colorRight: {
            r: 0.7075472,
            g: 0,
            b: 0.5364411,
        },
        _envColorLeft: {
            r: 0.32222217,
            g: 0.6111111,
            b: 0.75,
        },
        _envColorRight: {
            r: 0.03844783,
            g: 0.62239975,
            b: 0.90566039,
        },
        _obstacleColor: {
            r: 0.06167676,
            g: 0.2869513,
            b: 0.3962264,
        },
    },
};
