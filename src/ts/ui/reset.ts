import { State } from '../state';
import { UILoading } from './loading';
import { UIHeader } from './header';
import { UIInfo } from './information/main';
import { UIChecks } from './checks/main';
import { UISelection } from './selection';

export class UIReset {
   static #htmlResetButton: NodeListOf<HTMLInputElement> =
      document.querySelectorAll<HTMLInputElement>('.input__reset-button');
   static init(): void {
      UIReset.#htmlResetButton.forEach((elem) => elem.addEventListener('click', UIReset.click));
   }

   static click(): void {
      UILoading.reset();
      UIHeader.reset();
      UIInfo.reset();
      UIChecks.reset();
      UISelection.reset();
      State.clear();
   }
}
