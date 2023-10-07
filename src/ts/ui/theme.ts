import { UIThemeName } from '../types/mapcheck/ui';

const htmlBody = document.querySelector<HTMLBodyElement>('body');
const list: ReadonlyArray<UIThemeName> = ['Dark', 'Light', 'Monochrome'];

export default {
   list,
   set: (str: UIThemeName): void => {
      htmlBody!.className = 'theme-' + str.toLowerCase().replace(' ', '');
   },
};
