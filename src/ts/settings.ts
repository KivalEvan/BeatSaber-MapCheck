// TODO: validate settings

import { ISettingsProperty } from './types/mapcheck/settings';

const settingsDefault: ISettingsProperty = {
    load: {
        audio: true,
        imageCover: true,
        imageContributor: true,
    },
    sorting: true,
    beatNumbering: 'beattime',
    rounding: 3,
    theme: 'Dark',
    onLoad: { stats: false },
    show: {
        info: false,
        tools: false,
        stats: false,
        settings: false,
    },
};

export default new (class Settings {
    private property: ISettingsProperty = JSON.parse(JSON.stringify(settingsDefault));

    constructor() {
        this.init();
    }

    get load(): ISettingsProperty['load'] {
        return this.property.load;
    }
    get sorting(): boolean {
        return this.property.sorting;
    }
    set sorting(val: boolean) {
        this.property.sorting = val;
    }
    get beatNumbering(): ISettingsProperty['beatNumbering'] {
        return this.property.beatNumbering;
    }
    set beatNumbering(val: ISettingsProperty['beatNumbering']) {
        this.property.beatNumbering = val;
    }
    get rounding(): number {
        return this.property.rounding;
    }
    set rounding(val: number) {
        this.property.rounding = val;
    }
    get theme(): ISettingsProperty['theme'] {
        return this.property.theme;
    }
    set theme(val: ISettingsProperty['theme']) {
        this.property.theme = val;
    }
    get onLoad() {
        return this.property.onLoad;
    }
    get show(): ISettingsProperty['show'] {
        return this.property.show;
    }

    private stringify = (): string => {
        return JSON.stringify({
            _property: this.property,
        });
    };
    private init = (): void => {
        if (localStorage == null) {
            return;
        }
        const storage = localStorage.getItem('settings');
        if (storage) {
            const temp = JSON.parse(storage);
            this.property = temp._property ?? this.property;
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
        this.property = JSON.parse(JSON.stringify(settingsDefault));
    };
})();
