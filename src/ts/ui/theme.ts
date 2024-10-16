import { UIThemeName } from '../types/ui';

const htmlBody = document.querySelector<HTMLBodyElement>('body');
const list: ReadonlyArray<UIThemeName> = ['Dark', 'Light'];

export default {
   list,
   set(str: UIThemeName): void {
      htmlBody!.className = 'theme-' + str.toLowerCase().replace(' ', '');
   },
};
