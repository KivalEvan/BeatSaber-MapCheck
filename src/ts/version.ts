import { version } from '../../package.json';

const watermark: string = 'Kival Evan#5480';

export default new (class Version {
   private _version: string = version;
   private _wm: string = watermark;

   get value(): string {
      return this._version;
   }
   get watermark(): string {
      return this._wm;
   }
})();
