import { UITheme } from '../types/mapcheck/ui';

// theme should not contain space and will be converted to lowercase
// TODO: maybe separate the theme into another folder/file?
export const list: ReadonlyArray<UITheme> = ['Dark', 'Light', 'Monochrome'];

const htmlBody = document.querySelector<HTMLBodyElement>('body');

export const set = (str: UITheme): void => {
    htmlBody!.className = 'theme-' + str.toLowerCase().replace(' ', '');
};
