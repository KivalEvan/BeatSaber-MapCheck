import { ISettings } from './types/settings';
import { deepCopy } from 'bsmap/utils';

const settingsDefault: ISettings = {
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

export default new (class Settings implements ISettings {
   private props: ISettings = deepCopy(settingsDefault);

   constructor() {
      this.init();
   }

   get version(): ISettings['version'] {
      return this.props.version;
   }
   get load(): ISettings['load'] {
      return this.props.load;
   }
   get sorting(): boolean {
      return this.props.sorting;
   }
   set sorting(val: boolean) {
      this.props.sorting = val;
   }
   get beatNumbering(): ISettings['beatNumbering'] {
      return this.props.beatNumbering;
   }
   set beatNumbering(val: ISettings['beatNumbering']) {
      this.props.beatNumbering = val;
   }
   get infoRowCount(): number {
      return this.props.infoRowCount;
   }
   set infoRowCount(val: number) {
      this.props.infoRowCount = val;
   }
   get rounding(): number {
      return this.props.rounding;
   }
   set rounding(val: number) {
      this.props.rounding = val;
   }
   get dataCheck(): boolean {
      return this.props.dataCheck;
   }
   set dataCheck(val: boolean) {
      this.props.dataCheck = val;
   }
   get deduplicateTime(): boolean {
      return this.props.deduplicateTime;
   }
   set deduplicateTime(val: boolean) {
      this.props.deduplicateTime = val;
   }
   get theme(): ISettings['theme'] {
      return this.props.theme;
   }
   set theme(val: ISettings['theme']) {
      this.props.theme = val;
   }
   get show(): ISettings['show'] {
      return this.props.show;
   }
   set show(val: ISettings['show']) {
      this.props.show = val;
   }
   get checks(): ISettings['checks'] {
      return this.props.checks;
   }
   set checks(val: ISettings['checks']) {
      this.props.checks = val;
   }
   get aprilFooled() {
      return this.props.aprilFooled;
   }
   set aprilFooled(value: number) {
      this.props.aprilFooled = value;
   }

   private init(): void {
      if (localStorage == null) {
         return;
      }
      const storage = localStorage.getItem('settings');
      if (storage) {
         const temp = JSON.parse(storage);
         if (!temp.version) {
            this.clear();
            return;
         }
         this.props = temp ?? this.props;
         for (const key in settingsDefault) {
            const k = key as keyof ISettings;
            if (typeof this.props[k] !== typeof settingsDefault[k]) {
               (this.props as any)[k] = settingsDefault[k];
            }
         }
         this.props.version = settingsDefault.version;
         this.save();
      }
   }
   save(): void {
      if (localStorage) {
         localStorage.setItem('settings', JSON.stringify(this.props));
      }
   }
   clear(): void {
      if (localStorage) {
         localStorage.clear();
      }
   }
   reset(): void {
      this.props = deepCopy(settingsDefault);
   }
})();
