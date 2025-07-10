import { ISettingsProps } from './types/settings';
import { deepCopy } from 'bsmap/utils';

export class Settings {
   static default: ISettingsProps = {
      version: 6,
      load: {
         audio: true,
         imageCover: true,
         imageContributor: true,
      },
      sorting: true,
      beatNumbering: 'beattime',
      infoRowCount: 5,
      rounding: 3,
      dataCheck: true,
      deduplicateTime: true,
      theme: 'Dark',
      show: 'info',
      checks: {
         persistent: true,
         preset: 'Default',
      },
      aprilFooled: 1,
   };
   static props: ISettingsProps = deepCopy(Settings.default);

   static init(): void {
      if (localStorage == null) {
         return;
      }
      const storage = localStorage.getItem('settings');
      if (storage) {
         const temp = JSON.parse(storage) as ISettingsProps;
         if (!temp.version) {
            Settings.clear();
            return;
         }
         for (const key in Settings.default) {
            const k = key as keyof ISettingsProps;
            (Settings.props as any)[k] = temp[k] ?? Settings.default[k];
            if (typeof Settings.props[k] !== typeof Settings.default[k]) {
               (Settings.props as any)[k] = Settings.default[k];
            }
         }
         Settings.props.version = Settings.default.version;
         Settings.save();
      }
   }

   static clear(): void {
      if (localStorage) {
         localStorage.clear();
      }
   }

   static save(): void {
      if (localStorage) {
         localStorage.setItem('settings', JSON.stringify(Settings.props));
      }
   }

   static reset(): void {
      Settings.props = deepCopy(Settings.default);
   }
}
