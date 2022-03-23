import { UITheme } from './ui';

type SettingsFlag = { [key: string]: boolean };

type BeatNumbering = 'beattime' | 'jsontime' | 'realtime';

export enum ISettingsLoadRename {
    audio = 'Audio',
    imageCover = 'Cover Image',
    imageContributor = 'Contributor Image',
}
interface ISettingsPropertyLoad extends SettingsFlag {
    audio: boolean;
    imageCover: boolean;
    imageContributor: boolean;
}

export enum SettingsShowRename {
    info = 'Information',
    tools = 'Tools',
    stats = 'Stats',
    settings = 'Settings',
}
interface ISettingsPropertyShow extends SettingsFlag {
    info: boolean;
    tools: boolean;
    stats: boolean;
    settings: boolean;
}

interface ISettingsPropertyOnLoad extends SettingsFlag {
    stats: boolean;
}

export interface ISettingsProperty {
    load: ISettingsPropertyLoad;
    sorting: boolean;
    beatNumbering: BeatNumbering;
    rounding: number;
    theme: UITheme;
    onLoad: ISettingsPropertyOnLoad;
    show: ISettingsPropertyShow;
}
