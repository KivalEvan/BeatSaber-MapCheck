import { ISettings } from './types/settings';
import { deepCopy } from './bsmap/utils/mod';

const settingsDefault: ISettings = {
   version: 5,
   load: {
      audio: true,
      imageCover: true,
      imageContributor: true,
   },
   sorting: true,
   beatNumbering: 'beattime',
   infoRowHeight: 4,
   rounding: 3,
   dataCheck: true,
   deduplicateTime: true,
   theme: 'Dark',
   show: {
      info: false,
      checks: false,
      stats: false,
      settings: false,
   },
   aprilFooled: false,
};

// TODO: validate settings
export default new (class Settings implements ISettings {
   private property: ISettings = deepCopy(settingsDefault);

   constructor() {
      this.init();
   }

   get version(): ISettings['version'] {
      return this.property.version;
   }
   get load(): ISettings['load'] {
      return this.property.load;
   }
   get sorting(): boolean {
      return this.property.sorting;
   }
   set sorting(val: boolean) {
      this.property.sorting = val;
   }
   get beatNumbering(): ISettings['beatNumbering'] {
      return this.property.beatNumbering;
   }
   set beatNumbering(val: ISettings['beatNumbering']) {
      this.property.beatNumbering = val;
   }
   get infoRowHeight(): number {
      return this.property.infoRowHeight;
   }
   set infoRowHeight(val: number) {
      this.property.infoRowHeight = val;
   }
   get rounding(): number {
      return this.property.rounding;
   }
   set rounding(val: number) {
      this.property.rounding = val;
   }
   get dataCheck(): boolean {
      return this.property.dataCheck;
   }
   set dataCheck(val: boolean) {
      this.property.dataCheck = val;
   }
   get deduplicateTime(): boolean {
      return this.property.deduplicateTime;
   }
   set deduplicateTime(val: boolean) {
      this.property.deduplicateTime = val;
   }
   get theme(): ISettings['theme'] {
      return this.property.theme;
   }
   set theme(val: ISettings['theme']) {
      this.property.theme = val;
   }
   get show(): ISettings['show'] {
      return this.property.show;
   }
   get aprilFooled() {
      return this.property.aprilFooled;
   }
   set aprilFooled(value: boolean) {
      this.property.aprilFooled = value;
   }

   private stringify = (): string => {
      return JSON.stringify({
         settings: this.property,
      });
   };
   private init = (): void => {
      if (localStorage == null) {
         return;
      }
      const storage = localStorage.getItem('settings');
      if (storage) {
         const temp = JSON.parse(storage);
         if (!temp.settings?.version) {
            this.clear();
            return;
         }
         this.property = temp.settings ?? this.property;
         for (const key in settingsDefault) {
            if (typeof this.property[key as keyof ISettings] === 'undefined') {
               (this.property as any)[key as keyof ISettings] =
                  settingsDefault[key as keyof ISettings];
            }
         }
         this.property.version = settingsDefault.version;
         this.save();
      }
   };
   save = (): void => {
      if (localStorage) {
         localStorage.setItem('settings', this.stringify());
      }
   };
   clear = (): void => {
      if (localStorage) {
         localStorage.clear();
      }
   };
   reset = (): void => {
      this.property = deepCopy(settingsDefault);
   };
})();
