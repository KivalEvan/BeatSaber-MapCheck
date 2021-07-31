// TODO: automatically generate options instead of hardcoded in HTML
import * as uiTheme from './theme';
import settings from '../settings';

const logPrefix = 'UI Settings: ';

const htmlSettingsTheme = document.querySelector<HTMLSelectElement>('.settings__theme');
const htmlSettingsLoad = document.querySelectorAll<HTMLInputElement>('.settings__load');
const htmlSettingsSort = document.querySelector<HTMLInputElement>('.settings__sort');
const htmlSettingsShow = document.querySelectorAll<HTMLInputElement>('.settings__show');
const htmlSettingsOnLoad = document.querySelectorAll<HTMLInputElement>('.settings__onload');
const htmlSettingsClear = document.querySelector<HTMLInputElement>('.settings__clear-button');

if (htmlSettingsTheme) {
    htmlSettingsTheme.addEventListener('change', themeChangeHandler);
    uiTheme.list.forEach((th) => {
        const optTheme = document.createElement('option');
        optTheme.value = th;
        optTheme.textContent = th;
        htmlSettingsTheme.add(optTheme);
    });
} else {
    console.error(logPrefix + 'theme select is missing');
}
if (!htmlSettingsLoad.length) {
    console.error(logPrefix + 'empty load list, intentional or typo error?');
}
htmlSettingsLoad.forEach((elem) => elem.addEventListener('change', loadCheckHandler));
if (htmlSettingsSort) {
    htmlSettingsSort.addEventListener('change', sortCheckHandler);
} else {
    console.error(logPrefix + 'sort check is missing');
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
    console.error(logPrefix + 'clear button is missing');
}

function themeChangeHandler(ev: Event): void {
    const target = ev.target as HTMLSelectElement;
    settings.theme = target.options[target.options.selectedIndex].value as uiTheme.Theme;
    uiTheme.set(settings.theme);
    settings.save();
}

function showCheckHandler(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const id = target.id.replace('settings__show-', '');
    settings.show[id] = target.checked;
    settings.save();
}

export const setShowCheck = (id: string, bool: boolean): void => {
    htmlSettingsShow.forEach((elem) => {
        if (elem.id.endsWith(id)) {
            elem.checked = bool;
        }
    });
};

function sortCheckHandler(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    settings.sorting = target.checked;
    settings.save();
}

export const setSortCheck = (bool: boolean): void => {
    if (htmlSettingsSort) {
        htmlSettingsSort.checked = bool;
    }
};

function loadCheckHandler(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const id = target.name;
    settings.load[id] = target.checked;
    settings.save();
}

export const setLoadCheck = (id: string, bool: boolean): void => {
    htmlSettingsLoad.forEach((elem) => {
        if (elem.name === id) {
            elem.checked = bool;
        }
    });
};

function onLoadCheckHandler(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const id = target.name;
    settings.onLoad[id] = target.checked;
    settings.save();
}

export const setOnLoadCheck = (id: string, bool: boolean): void => {
    htmlSettingsOnLoad.forEach((elem) => {
        if (elem.name === id) {
            elem.checked = bool;
        }
    });
};

export const setTheme = (str: uiTheme.Theme): void => {
    if (!htmlSettingsTheme) {
        console.error(logPrefix + 'input element is missing');
        return;
    }
    htmlSettingsTheme.value = str;
};

export function clear(): void {
    settings.clear();
    settings.reset();
    location.reload(true);
}

export default {
    setTheme,
    setShowCheck,
    clear,
};
