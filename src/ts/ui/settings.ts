// TODO: automatically generate options instead of hardcoded in HTML
import * as uiTheme from './theme';
import settings from '../settings';

const logPrefix = 'UI Settings: ';

const htmlSettingsTheme = document.querySelector<HTMLSelectElement>('.settings__theme');
const htmlSettingsShow = document.querySelectorAll<HTMLInputElement>('.settings__show');
const htmlSettingsClear = document.querySelector<HTMLInputElement>('.settings__clear-button');

if (htmlSettingsTheme) {
    htmlSettingsTheme.addEventListener('change', themeChangeHandler);
} else {
    console.error(logPrefix + 'theme select is missing');
}
if (!htmlSettingsShow.length) {
    console.error(logPrefix + 'empty show list, intentional or typo error?');
}
htmlSettingsShow.forEach((elem) => elem.addEventListener('click', showCheckHandler));
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
