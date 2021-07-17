import settings, { Theme } from '../settings';

const htmlBody = document.querySelector<HTMLBodyElement>('body');
const htmlSettingsTheme = document.querySelectorAll<HTMLSelectElement>('.settings__theme');
const htmlSettingsShow = document.querySelectorAll<HTMLInputElement>('.settings__show');

htmlSettingsTheme.forEach((elem) => elem.addEventListener('change', settingsThemeHandler));
htmlSettingsShow.forEach((elem) => elem.addEventListener('click', settingsShowHandler));

function settingsThemeHandler(ev: Event): void {
    const target = ev.target as HTMLSelectElement;
    settings.theme = target.options[target.options.selectedIndex].value as Theme;
    htmlBody!.className = 'theme-' + settings.theme.toLowerCase().replace(' ', '');
    settings.save();
}

function settingsShowHandler(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const id = target.id.replace('settings__show-', '');
    settings.show[id] = target.checked;
    settings.save();
}

export const settingsSetTheme = (str: Theme): void => {
    htmlBody!.className = 'theme-' + str.toLowerCase().replace(' ', '');
    htmlSettingsTheme.forEach((elem) => {
        elem.value = str;
    });
};

export const settingsShowSetCheck = (id: string, bool: boolean): void => {
    htmlSettingsShow.forEach((elem) => {
        if (elem.id.endsWith(id)) {
            elem.checked = bool;
        }
    });
};

export const settingsClear = (): void => {
    settings.clear();
    settings.reset();
    for (const key in settings.load) {
        settingsShowSetCheck(key, settings.load[key]);
    }
};
