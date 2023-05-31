const vMajor: number = 2;
const vMinor: number = 5;
const vPatch: number = 12;
const watermark: string = 'Kival Evan#5480';

export default new (class Version {
    private _version: string = `${vMajor}.${vMinor}.${vPatch}`;
    private _wm: string = watermark;

    get value(): string {
        return this._version;
    }
    get watermark(): string {
        return this._wm;
    }
})();
