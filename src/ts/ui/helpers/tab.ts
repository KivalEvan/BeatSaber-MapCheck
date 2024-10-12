import { ISettings } from '../../types';

export function createTab(
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
      if (i !== str.length - 1) htmlPad.appendChild(document.createElement('br'));
   }

   htmlLabel.appendChild(htmlPad);
   htmlTab.appendChild(htmlLabel);

   return htmlTab;
}

const htmlTabsInfo = document.getElementById('tabs__info') as HTMLInputElement;
const htmlTabsChecks = document.getElementById('tabs__checks') as HTMLInputElement;
const htmlTabsStats = document.getElementById('tabs__stats') as HTMLInputElement;
const htmlTabsSettings = document.getElementById('tabs__settings') as HTMLInputElement;

export function showMain(id: ISettings['show']): void {
   htmlTabsInfo.checked = id === 'info';
   htmlTabsChecks.checked = id === 'checks';
   htmlTabsStats.checked = id === 'stats';
   htmlTabsSettings.checked = id === 'settings';
}
