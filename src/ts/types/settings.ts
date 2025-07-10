import { ThemeName } from '../ui/theme';

type SettingsFlag = { [key: string]: boolean };

export type BeatNumbering = 'beattime' | 'jsontime' | 'realtime' | 'realtimems';

interface ISettingsLoad extends SettingsFlag {
   audio: boolean;
   imageCover: boolean;
   imageContributor: boolean;
}

interface ISettingsChecks {
   persistent: boolean;
   preset: string;
}

type ISettingsShow = 'info' | 'checks' | 'stats' | 'settings';

export interface ISettingsProps {
   version: number;
   load: ISettingsLoad;
   sorting: boolean;
   beatNumbering: BeatNumbering;
   infoRowCount: number;
   rounding: number;
   dataCheck: boolean;
   deduplicateTime: boolean;
   theme: ThemeName;
   show: ISettingsShow;
   checks: ISettingsChecks;
   aprilFooled: number;
}
