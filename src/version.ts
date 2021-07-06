const versionMajor: number = 2;
const versionMinor: number = 0;
const versionPatch: number = 0;
const watermark: string = 'Kival Evan#5480';

export default class Version {
    private _version: string = `v${versionMajor}.${versionMinor}.${versionPatch}`;
    private _wm: string = watermark;

    get value(): string {
        return this._version;
    }
    get watermark(): string {
        return this._wm;
    }
}
