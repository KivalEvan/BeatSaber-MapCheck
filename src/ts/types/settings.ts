import { UIThemeName } from './ui';

type SettingsFlag = { [key: string]: boolean };

export type BeatNumbering = 'beattime' | 'jsontime' | 'realtime' | 'realtimems';

interface ISettingsLoad extends SettingsFlag {
   audio: boolean;
   imageCover: boolean;
   imageContributor: boolean;
}

interface ISettingsShow extends SettingsFlag {
   info: boolean;
   checks: boolean;
   stats: boolean;
   settings: boolean;
}

export interface ISettings {
   version: number;
   load: ISettingsLoad;
   sorting: boolean;
   beatNumbering: BeatNumbering;
   infoRowHeight: number;
   rounding: number;
   dataCheck: boolean;
   deduplicateTime: boolean;
   theme: UIThemeName;
   show: ISettingsShow;
   aprilFooled: boolean;
}
