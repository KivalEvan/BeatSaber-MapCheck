import { UIThemeName } from '../types/mapcheck/ui';

// theme should not contain space and will be converted to lowercase
export default new (class UITheme {
    private htmlBody = document.querySelector<HTMLBodyElement>('body');
    list: ReadonlyArray<UIThemeName> = ['Dark', 'Light', 'Monochrome'];

    set = (str: UIThemeName): void => {
        this.htmlBody!.className = 'theme-' + str.toLowerCase().replace(' ', '');
    };
})();
