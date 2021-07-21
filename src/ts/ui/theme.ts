// theme should not contain space and will be converted to lowercase
// TODO: maybe separate the theme into another folder/file?
export type Theme = 'Dark' | 'Light' | 'Monochrome';
export const themeList: Theme[] = ['Dark', 'Light', 'Monochrome'];

const htmlBody = document.querySelector<HTMLBodyElement>('body');

export const set = (str: Theme): void => {
    htmlBody!.className = 'theme-' + str.toLowerCase().replace(' ', '');
};
