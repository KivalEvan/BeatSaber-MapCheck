import settings from '../settings';

const htmlSettingsShow = document.querySelectorAll<HTMLInputElement>('.settings__show');
htmlSettingsShow.forEach((elem) => elem.addEventListener('click', settingsShowHandler));

const settingsShowHandler = (ev: Event): void => {
    const target = ev.target as HTMLInputElement;
    const id = target.id.replace('settings__show-', '');
    settings.show[id] = target.checked;
    settings.save();
};

export const settingsShowSetCheck = (id: string, bool: boolean) => {
    htmlSettingsShow.forEach((elem) => {
        if (elem.id.endsWith(id)) {
            elem.checked = bool;
        }
    });
};
