import { ISettings } from './types/mapcheck/settings';
import { deepCopy } from './utils';

const settingsDefault: ISettings = {
    version: 3,
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
    dataError: true,
    theme: 'Dark',
    onLoad: { stats: false },
    show: {
        info: false,
        tools: false,
        stats: false,
        settings: false,
    },
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
    get dataError(): boolean {
        return this.property.dataError;
    }
    set dataError(val: boolean) {
        this.property.dataError = val;
    }
    get theme(): ISettings['theme'] {
        return this.property.theme;
    }
    set theme(val: ISettings['theme']) {
        this.property.theme = val;
    }
    get onLoad() {
        return this.property.onLoad;
    }
    get show(): ISettings['show'] {
        return this.property.show;
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
                    (this.property as any)[key as keyof ISettings] = settingsDefault[key as keyof ISettings];
                }
            }
            this.property.version = settingsDefault.version;
            this.save();
        }
    };
    public save = (): void => {
        if (localStorage) {
            localStorage.setItem('settings', this.stringify());
        }
    };
    public clear = (): void => {
        if (localStorage) {
            localStorage.clear();
        }
    };
    public reset = (): void => {
        this.property = deepCopy(settingsDefault);
    };
})();
