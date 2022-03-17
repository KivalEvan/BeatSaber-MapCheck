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

class Settings {
    private _property: ISettingsProperty = JSON.parse(JSON.stringify(settingsDefault));

    constructor() {
        this.init();
    }

    get load(): ISettingsProperty['load'] {
        return this._property.load;
    }
    get sorting(): boolean {
        return this._property.sorting;
    }
    set sorting(val: boolean) {
        this._property.sorting = val;
    }
    get beatNumbering(): ISettingsProperty['beatNumbering'] {
        return this._property.beatNumbering;
    }
    set beatNumbering(val: ISettingsProperty['beatNumbering']) {
        this._property.beatNumbering = val;
    }
    get rounding(): number {
        return this._property.rounding;
    }
    set rounding(val: number) {
        this._property.rounding = val;
    }
    get theme(): ISettingsProperty['theme'] {
        return this._property.theme;
    }
    set theme(val: ISettingsProperty['theme']) {
        this._property.theme = val;
    }
    get onLoad() {
        return this._property.onLoad;
    }
    get show(): ISettingsProperty['show'] {
        return this._property.show;
    }

    private stringify = (): string => {
        return JSON.stringify({
            _property: this._property,
        });
    };
    private init = (): void => {
        if (localStorage == null) {
            return;
        }
        const storage = localStorage.getItem('settings');
        if (storage) {
            const temp = JSON.parse(storage);
            this._property = temp._property ?? this._property;
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
        this._property = JSON.parse(JSON.stringify(settingsDefault));
    };
}

export default new Settings();
