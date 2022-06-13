const versionMajor: number = 2;
const versionMinor: number = 5;
const versionPatch: number = 0;
const watermark: string = 'Kival Evan#5480';

export default new (class Version {
    private _version: string = `pre-${versionMajor}.${versionMinor}.${versionPatch}-3`;
    private _wm: string = watermark;

    get value(): string {
        return this._version;
    }
    get watermark(): string {
        return this._wm;
    }
})();
