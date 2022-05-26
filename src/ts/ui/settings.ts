// TODO: generate options instead of hardcoded in HTML
import { UIThemeName } from '../types/mapcheck/ui';
import UITheme from './theme';
import Settings from '../settings';

const logPrefix = 'UI Settings: ';

const htmlSettingsTheme: HTMLSelectElement = document.querySelector('.settings__theme')!;
const htmlSettingsLoad: NodeListOf<HTMLInputElement> = document.querySelectorAll('.settings__load');
const htmlSettingsSort: HTMLInputElement = document.querySelector('.settings__sort')!;
const htmlSettingsShow: NodeListOf<HTMLInputElement> = document.querySelectorAll('.settings__show');
const htmlSettingsOnLoad: NodeListOf<HTMLInputElement> = document.querySelectorAll('.settings__onload');
const htmlSettingsClear: HTMLInputElement = document.querySelector('.settings__clear-button')!;

if (htmlSettingsTheme) {
    htmlSettingsTheme.addEventListener('change', themeChangeHandler);
    UITheme.list.forEach((th) => {
        const optTheme = document.createElement('option');
        optTheme.value = th;
        optTheme.textContent = th;
        htmlSettingsTheme.add(optTheme);
    });
} else {
    throw new Error(logPrefix + 'theme select is missing');
}
if (!htmlSettingsLoad.length) {
    console.error(logPrefix + 'empty load list, intentional or typo error?');
}
htmlSettingsLoad.forEach((elem) => elem.addEventListener('change', loadCheckHandler));
if (htmlSettingsSort) {
    htmlSettingsSort.addEventListener('change', sortCheckHandler);
} else {
    throw new Error(logPrefix + 'sort check is missing');
}
if (!htmlSettingsOnLoad.length) {
    console.error(logPrefix + 'empty onload list, intentional or typo error?');
}
htmlSettingsOnLoad.forEach((elem) => elem.addEventListener('change', onLoadCheckHandler));
if (!htmlSettingsShow.length) {
    console.error(logPrefix + 'empty show list, intentional or typo error?');
}
htmlSettingsShow.forEach((elem) => elem.addEventListener('change', showCheckHandler));
if (htmlSettingsClear) {
    htmlSettingsClear.addEventListener('click', clear);
} else {
    throw new Error(logPrefix + 'clear button is missing');
}

function themeChangeHandler(ev: Event): void {
    const target = ev.target as HTMLSelectElement;
    Settings.theme = target.options[target.options.selectedIndex].value as UIThemeName;
    UITheme.set(Settings.theme);
    Settings.save();
}

function showCheckHandler(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const id = target.id.replace('settings__show-', '');
    Settings.show[id] = target.checked;
    Settings.save();
}

const setShowCheck = (id: string, bool: boolean): void => {
    htmlSettingsShow.forEach((elem) => {
        if (elem.id.endsWith(id)) {
            elem.checked = bool;
        }
    });
};

function sortCheckHandler(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    Settings.sorting = target.checked;
    Settings.save();
}

const setSortCheck = (bool: boolean): void => {
    if (htmlSettingsSort) {
        htmlSettingsSort.checked = bool;
    }
};

function loadCheckHandler(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const id = target.name;
    Settings.load[id] = target.checked;
    Settings.save();
}

const setLoadCheck = (id: string, bool: boolean): void => {
    htmlSettingsLoad.forEach((elem) => {
        if (elem.name === id) {
            elem.checked = bool;
        }
    });
};

function onLoadCheckHandler(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const id = target.name;
    Settings.onLoad[id] = target.checked;
    Settings.save();
}

const setOnLoadCheck = (id: string, bool: boolean): void => {
    htmlSettingsOnLoad.forEach((elem) => {
        if (elem.name === id) {
            elem.checked = bool;
        }
    });
};

const setTheme = (str: UIThemeName): void => {
    htmlSettingsTheme.value = str;
};

function clear(): void {
    Settings.clear();
    Settings.reset();
    location.reload();
}

export default {
    setShowCheck,
    setSortCheck,
    setLoadCheck,
    setOnLoadCheck,
    setTheme,
    clear,
};
