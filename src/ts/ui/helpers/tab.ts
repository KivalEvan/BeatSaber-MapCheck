import { ISettingsProps } from '../../types';

export class UITab {
   static #htmlTabsInfo: HTMLInputElement;
   static #htmlTabsChecks: HTMLInputElement;
   static #htmlTabsStats: HTMLInputElement;
   static #htmlTabsSettings: HTMLInputElement;

   static init(): void {
      UITab.#htmlTabsInfo = document.querySelector('#tabs__info')!;
      UITab.#htmlTabsChecks = document.querySelector('#tabs__checks')!;
      UITab.#htmlTabsStats = document.querySelector('#tabs__stats')!;
      UITab.#htmlTabsSettings = document.querySelector('#tabs__settings')!;
   }

   static showMain(id: ISettingsProps['show']): void {
      UITab.#htmlTabsInfo.checked = id === 'info';
      UITab.#htmlTabsChecks.checked = id === 'checks';
      UITab.#htmlTabsStats.checked = id === 'stats';
      UITab.#htmlTabsSettings.checked = id === 'settings';
   }

   static create(
      id: string,
      label: string,
      group: string,
      value: string,
      selected: boolean,
      callback: EventListener,
   ): HTMLDivElement {
      const htmlTab = document.createElement('div');
      htmlTab.className = 'tabs__container';

      const radio = document.createElement('input');
      radio.className = 'tabs__radio';
      radio.type = 'radio';
      radio.id = id;
      radio.name = group;
      radio.value = value;
      radio.checked = selected;
      radio.addEventListener('change', callback);

      htmlTab.appendChild(radio);

      const htmlLabel = document.createElement('label');
      htmlLabel.className = 'tabs__label tabs__label-block unselectable';
      htmlLabel.htmlFor = id;

      const htmlPad = document.createElement('div');
      const str = label.split('\n');
      for (let i = 0; i < str.length; i++) {
         const s = str[i];
         const htmlSpan = document.createElement('span');
         htmlSpan.textContent = s;
         htmlPad.appendChild(htmlSpan);
         if (i !== str.length - 1) {
            htmlPad.appendChild(document.createElement('br'));
         }
      }

      htmlLabel.appendChild(htmlPad);
      htmlTab.appendChild(htmlLabel);

      return htmlTab;
   }
}
