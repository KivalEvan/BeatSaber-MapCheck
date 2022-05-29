import { UIThemeName } from './ui';

type SettingsFlag = { [key: string]: boolean };

type BeatNumbering = 'beattime' | 'jsontime' | 'realtime';

interface ISettingsLoad extends SettingsFlag {
    audio: boolean;
    imageCover: boolean;
    imageContributor: boolean;
}

interface ISettingsShow extends SettingsFlag {
    info: boolean;
    tools: boolean;
    stats: boolean;
    settings: boolean;
}

interface ISettingsOnLoad extends SettingsFlag {
    stats: boolean;
}

export interface ISettings {
    version: number;
    load: ISettingsLoad;
    sorting: boolean;
    beatNumbering: BeatNumbering;
    rounding: number;
    theme: UIThemeName;
    onLoad: ISettingsOnLoad;
    show: ISettingsShow;
}
