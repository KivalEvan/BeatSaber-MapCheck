import settings, { Theme } from '../settings';

const htmlBody = document.querySelector<HTMLBodyElement>('body');
const htmlSettingsTheme = document.querySelectorAll<HTMLSelectElement>('.settings__theme');
const htmlSettingsShow = document.querySelectorAll<HTMLInputElement>('.settings__show');

htmlSettingsTheme.forEach((elem) => elem.addEventListener('change', themeChangeHandler));
htmlSettingsShow.forEach((elem) => elem.addEventListener('click', showCheckHandler));

function themeChangeHandler(ev: Event): void {
    const target = ev.target as HTMLSelectElement;
    settings.theme = target.options[target.options.selectedIndex].value as Theme;
    htmlBody!.className = 'theme-' + settings.theme.toLowerCase().replace(' ', '');
    settings.save();
}

function showCheckHandler(ev: Event): void {
    const target = ev.target as HTMLInputElement;
    const id = target.id.replace('settings__show-', '');
    settings.show[id] = target.checked;
    settings.save();
}

export const setTheme = (str: Theme): void => {
    htmlBody!.className = 'theme-' + str.toLowerCase().replace(' ', '');
    htmlSettingsTheme.forEach((elem) => {
        elem.value = str;
    });
};

export const setShowCheck = (id: string, bool: boolean): void => {
    htmlSettingsShow.forEach((elem) => {
        if (elem.id.endsWith(id)) {
            elem.checked = bool;
        }
    });
};

export const clear = (): void => {
    settings.clear();
    settings.reset();
    location.reload(true);
};

export default {
    setTheme,
    setShowCheck,
    clear,
};
