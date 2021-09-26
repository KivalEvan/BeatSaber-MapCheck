// TODO: validate settings
import { Theme } from './ui/theme';

type SettingsFlag = { [key: string]: boolean };

type BeatNumbering = 'beattime' | 'jsontime' | 'realtime';

interface SettingsProperty {
    _load: SettingsPropertyLoad;
    _sorting: boolean;
    _beatNumbering: BeatNumbering;
    _rounding: number;
    _theme: Theme;
    _onLoad: SettingsPropertyOnLoad;
    _show: SettingsPropertyShow;
}

export enum SettingsLoadRename {
    audio = 'Audio',
    imageCover = 'Cover Image',
    imageContributor = 'Contributor Image',
}
interface SettingsPropertyLoad extends SettingsFlag {
    audio: boolean;
    imageCover: boolean;
    imageContributor: boolean;
}

export enum SettingsShowRename {
    info = 'Information',
    tools = 'Tools',
    stats = 'Stats',
    settings = 'Settings',
}
interface SettingsPropertyShow extends SettingsFlag {
    info: boolean;
    tools: boolean;
    stats: boolean;
    settings: boolean;
}

interface SettingsPropertyOnLoad extends SettingsFlag {
    stats: boolean;
}

const settingsDefault: SettingsProperty = {
    _load: {
        audio: true,
        imageCover: true,
        imageContributor: true,
    },
    _sorting: true,
    _beatNumbering: 'beattime',
    _rounding: 3,
    _theme: 'Dark',
    _onLoad: { stats: false },
    _show: {
        info: false,
        tools: false,
        stats: false,
        settings: false,
    },
};

class Settings {
    private _property: SettingsProperty = JSON.parse(JSON.stringify(settingsDefault));

    constructor() {
        this.init();
    }

    get load(): SettingsPropertyLoad {
        return this._property._load;
    }
    get sorting(): boolean {
        return this._property._sorting;
    }
    set sorting(val: boolean) {
        this._property._sorting = val;
    }
    get beatNumbering(): BeatNumbering {
        return this._property._beatNumbering;
    }
    set beatNumbering(val: BeatNumbering) {
        this._property._beatNumbering = val;
    }
    get rounding(): number {
        return this._property._rounding;
    }
    set rounding(val: number) {
        this._property._rounding = val;
    }
    get theme(): Theme {
        return this._property._theme;
    }
    set theme(val: Theme) {
        this._property._theme = val;
    }
    get onLoad() {
        return this._property._onLoad;
    }
    get show(): SettingsPropertyShow {
        return this._property._show;
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
