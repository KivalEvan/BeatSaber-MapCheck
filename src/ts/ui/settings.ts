// TODO: generate options instead of hardcoded in HTML
import { UIThemeName } from '../types/mapcheck/ui';
import uiTheme from './theme';
import settings from '../settings';

const logPrefix = 'UI Settings: ';

export default new (class UISettings {
    private htmlSettingsTheme: HTMLSelectElement;
    private htmlSettingsLoad: NodeListOf<HTMLInputElement>;
    private htmlSettingsSort: HTMLInputElement;
    private htmlSettingsShow: NodeListOf<HTMLInputElement>;
    private htmlSettingsOnLoad: NodeListOf<HTMLInputElement>;
    private htmlSettingsClear: HTMLInputElement;

    constructor() {
        this.htmlSettingsTheme = document.querySelector('.settings__theme')!;
        this.htmlSettingsLoad = document.querySelectorAll('.settings__load');
        this.htmlSettingsSort = document.querySelector('.settings__sort')!;
        this.htmlSettingsShow = document.querySelectorAll('.settings__show');
        this.htmlSettingsOnLoad = document.querySelectorAll('.settings__onload');
        this.htmlSettingsClear = document.querySelector('.settings__clear-button')!;

        if (this.htmlSettingsTheme) {
            this.htmlSettingsTheme.addEventListener('change', this.themeChangeHandler);
            uiTheme.list.forEach((th) => {
                const optTheme = document.createElement('option');
                optTheme.value = th;
                optTheme.textContent = th;
                this.htmlSettingsTheme.add(optTheme);
            });
        } else {
            console.error(logPrefix + 'theme select is missing');
        }
        if (!this.htmlSettingsLoad.length) {
            console.error(logPrefix + 'empty load list, intentional or typo error?');
        }
        this.htmlSettingsLoad.forEach((elem) =>
            elem.addEventListener('change', this.loadCheckHandler)
        );
        if (this.htmlSettingsSort) {
            this.htmlSettingsSort.addEventListener('change', this.sortCheckHandler);
        } else {
            console.error(logPrefix + 'sort check is missing');
        }
        if (!this.htmlSettingsOnLoad.length) {
            console.error(logPrefix + 'empty onload list, intentional or typo error?');
        }
        this.htmlSettingsOnLoad.forEach((elem) =>
            elem.addEventListener('change', this.onLoadCheckHandler)
        );
        if (!this.htmlSettingsShow.length) {
            console.error(logPrefix + 'empty show list, intentional or typo error?');
        }
        this.htmlSettingsShow.forEach((elem) =>
            elem.addEventListener('change', this.showCheckHandler)
        );
        if (this.htmlSettingsClear) {
            this.htmlSettingsClear.addEventListener('click', this.clear);
        } else {
            console.error(logPrefix + 'clear button is missing');
        }
    }

    private themeChangeHandler(ev: Event): void {
        const target = ev.target as HTMLSelectElement;
        settings.theme = target.options[target.options.selectedIndex]
            .value as UIThemeName;
        uiTheme.set(settings.theme);
        settings.save();
    }

    private showCheckHandler(ev: Event): void {
        const target = ev.target as HTMLInputElement;
        const id = target.id.replace('settings__show-', '');
        settings.show[id] = target.checked;
        settings.save();
    }

    setShowCheck = (id: string, bool: boolean): void => {
        this.htmlSettingsShow.forEach((elem) => {
            if (elem.id.endsWith(id)) {
                elem.checked = bool;
            }
        });
    };

    private sortCheckHandler(ev: Event): void {
        const target = ev.target as HTMLInputElement;
        settings.sorting = target.checked;
        settings.save();
    }

    setSortCheck = (bool: boolean): void => {
        if (this.htmlSettingsSort) {
            this.htmlSettingsSort.checked = bool;
        }
    };

    private loadCheckHandler(ev: Event): void {
        const target = ev.target as HTMLInputElement;
        const id = target.name;
        settings.load[id] = target.checked;
        settings.save();
    }

    setLoadCheck = (id: string, bool: boolean): void => {
        this.htmlSettingsLoad.forEach((elem) => {
            if (elem.name === id) {
                elem.checked = bool;
            }
        });
    };

    private onLoadCheckHandler(ev: Event): void {
        const target = ev.target as HTMLInputElement;
        const id = target.name;
        settings.onLoad[id] = target.checked;
        settings.save();
    }

    setOnLoadCheck = (id: string, bool: boolean): void => {
        this.htmlSettingsOnLoad.forEach((elem) => {
            if (elem.name === id) {
                elem.checked = bool;
            }
        });
    };

    setTheme = (str: UIThemeName): void => {
        this.htmlSettingsTheme.value = str;
    };

    clear(): void {
        settings.clear();
        settings.reset();
        location.reload();
    }
})();
