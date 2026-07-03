import { State } from '../state';

export type ThemeName = 'Dark' | 'Light';

export class UITheme {
   static list: ReadonlyArray<ThemeName> = ['Dark', 'Light'];
   static set(theme: ThemeName): void {
      document.body.className = 'theme-' + theme.toLowerCase().replace(' ', '');
   }
}
