const versionMajor: number = 2;
const versionMinor: number = 0;
const versionPatch: number = 0;
const watermark: string = 'Kival Evan#5480';

export default class Version {
    private version: string = `v${versionMajor}.${versionMinor}.${versionPatch}`;
    private wm: string = watermark;

    get number(): string {
        return this.version;
    }
    get watermark(): string {
        return this.wm;
    }
}
