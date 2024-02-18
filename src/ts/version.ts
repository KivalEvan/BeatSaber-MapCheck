const vMajor: number = 2;
const vMinor: number = 6;
const vPatch: number = 0;
const watermark: string = 'Kival Evan#5480';

export default new (class Version {
   private _version: string = `pre-${vMajor}.${vMinor}.${vPatch}`;
   private _wm: string = watermark;

   get value(): string {
      return this._version;
   }
   get watermark(): string {
      return this._wm;
   }
})();
