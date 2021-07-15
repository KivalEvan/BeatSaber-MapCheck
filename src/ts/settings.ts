class Settings {
    private _load = {
        audio: false,
        image: false,
        customData: false,
    };
    private _sorting = false;
    private _beatNumbering = 'ChroMapper';
    private _rounding = 3;
    private _theme = 'Dark';
    private _show = {
        info: false,
        tools: false,
        stats: false,
        settings: false,
    };

    constructor() {
        this.init();
    }

    get load() {
        return this._load;
    }
    get sorting(): boolean {
        return this._sorting;
    }
    set sorting(val: boolean) {
        this._sorting = val;
    }
    get beatNumbering(): string {
        return this._beatNumbering;
    }
    set beatNumbering(val: string) {
        this._beatNumbering = val;
    }
    get rounding(): number {
        return this._rounding;
    }
    set rounding(val: number) {
        this._rounding = val;
    }
    get theme(): string {
        return this._theme;
    }
    set theme(val: string) {
        this._theme = val;
    }
    get show() {
        return this._show;
    }

    // TODO: prolly make this better
    private stringify = (): string => {
        return JSON.stringify({
            _load: this._load,
            _sorting: this._sorting,
            _beatNumbering: this._beatNumbering,
            _rounding: this._rounding,
            _theme: this._theme,
            _show: this._show,
        });
    };
    private init = (): void => {
        const storage = localStorage.getItem('settings');
        if (storage) {
            const temp = JSON.parse(storage);
            this._load = temp._load;
            this._sorting = temp._sorting;
            this._beatNumbering = temp._beatNumbering;
            this._rounding = temp._rounding;
            this._theme = temp._theme;
            this._show = temp._show;
        }
        this.save();
    };
    public save = (): void => {
        localStorage.setItem('settings', this.stringify());
    };
}

export default new Settings();
