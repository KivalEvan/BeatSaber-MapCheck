import { UITheme } from './ui';

type SettingsFlag = { [key: string]: boolean };

type BeatNumbering = 'beattime' | 'jsontime' | 'realtime';

export interface ISettingsProperty {
    load: SettingsPropertyLoad;
    sorting: boolean;
    beatNumbering: BeatNumbering;
    rounding: number;
    theme: UITheme;
    onLoad: SettingsPropertyOnLoad;
    show: SettingsPropertyShow;
}

export enum SettingsLoadRename {
    audio = 'Audio',
    imageCover = 'Cover Image',
    imageContributor = 'Contributor Image',
}
interface SettingsPropertyLoad extends SettingsFlag {
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
interface SettingsPropertyShow extends SettingsFlag {
    info: boolean;
    tools: boolean;
    stats: boolean;
    settings: boolean;
}

interface SettingsPropertyOnLoad extends SettingsFlag {
    stats: boolean;
}
