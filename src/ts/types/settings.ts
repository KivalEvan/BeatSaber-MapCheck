import { UIThemeName } from './ui';

type SettingsFlag = { [key: string]: boolean };

export type BeatNumbering = 'beattime' | 'jsontime' | 'realtime' | 'realtimems';

interface ISettingsLoad extends SettingsFlag {
   audio: boolean;
   imageCover: boolean;
   imageContributor: boolean;
}

type ISettingsShow = 'info' | 'checks' | 'stats' | 'settings';

export interface ISettings {
   version: number;
   load: ISettingsLoad;
   sorting: boolean;
   beatNumbering: BeatNumbering;
   infoRowCount: number;
   rounding: number;
   dataCheck: boolean;
   deduplicateTime: boolean;
   theme: UIThemeName;
   show: ISettingsShow;
   aprilFooled: boolean;
}
